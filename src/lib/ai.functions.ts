import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const VisualSchema = z.object({
  format: z.enum(["comic", "storyboard", "infographic", "illustration", "cinematic", "interactive"]),
  prompt: z.string().min(3).max(4000),
  panels: z.number().int().min(1).max(4).default(3),
  style: z.string().optional(),
});

const FORMAT_GUIDE: Record<string, string> = {
  comic: "comic book panels with bold ink lines, halftone shading, dynamic camera angles and speech bubbles when appropriate",
  storyboard: "cinematic storyboard frames, sketchy production-art look, shot composition notes baked in visually",
  infographic: "modern flat infographic design with bold typography, icons, charts and clear visual hierarchy",
  illustration: "richly detailed editorial illustration, painterly textures, expressive lighting",
  cinematic: "cinematic photo-real film still, dramatic lighting, anamorphic widescreen mood",
  interactive: "stylised scene illustration designed as a branching-story key art with clear focal characters",
};

type Panel = { caption: string; image?: string; prompt: string };

async function callGateway(body: unknown, apiKey: string) {
  return fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export const generateVisuals = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => VisualSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not configured." };

    const styleHint = data.style?.trim() || "vivid, modern, accessible";
    const formatHint = FORMAT_GUIDE[data.format];

    // Step 1: ask a text model to break content into N visual panels with captions + image prompts.
    const planRes = await callGateway({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You convert written content into a sequence of visual panels. Always respond with STRICT JSON only — no prose, no markdown fences. Schema: {\"title\": string, \"summary\": string, \"panels\": [{\"caption\": string, \"imagePrompt\": string}]}. The imagePrompt must be a self-contained, vivid description usable by an image generator (subject, setting, action, mood, composition, art style). Keep captions tight (1-2 sentences).",
        },
        {
          role: "user",
          content: `Format: ${data.format} — ${formatHint}\nVisual style: ${styleHint}\nNumber of panels: ${data.panels}\n\nSource content / instructions:\n${data.prompt}`,
        },
      ],
    }, apiKey);

    if (!planRes.ok) {
      if (planRes.status === 429) return { ok: false as const, error: "Rate limit reached. Please wait and try again." };
      if (planRes.status === 402) return { ok: false as const, error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." };
      return { ok: false as const, error: "Planning step failed." };
    }

    const planJson = await planRes.json();
    const raw: string = planJson?.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    let plan: { title: string; summary: string; panels: { caption: string; imagePrompt: string }[] };
    try {
      plan = JSON.parse(cleaned);
    } catch {
      return { ok: false as const, error: "Could not parse the visual plan. Try again." };
    }

    // Step 2: generate an image for each panel in parallel.
    const panels: Panel[] = await Promise.all(
      plan.panels.slice(0, data.panels).map(async (p): Promise<Panel> => {
        try {
          const res = await callGateway({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: `${p.imagePrompt}. Art direction: ${formatHint}. Style: ${styleHint}. High craft, coherent composition, no text overlays unless the format calls for it.`,
              },
            ],
            modalities: ["image", "text"],
          }, apiKey);
          if (!res.ok) return { caption: p.caption, prompt: p.imagePrompt };
          const j = await res.json();
          const url: string | undefined =
            j?.choices?.[0]?.message?.images?.[0]?.image_url?.url ??
            j?.choices?.[0]?.message?.images?.[0]?.url;
          return { caption: p.caption, prompt: p.imagePrompt, image: url };
        } catch {
          return { caption: p.caption, prompt: p.imagePrompt };
        }
      }),
    );

    return {
      ok: true as const,
      title: plan.title,
      summary: plan.summary,
      panels,
    };
  });
