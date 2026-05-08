import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  kind: z.enum(["blog", "email", "code", "social", "custom"]),
  prompt: z.string().min(3).max(4000),
  tone: z.string().optional(),
  language: z.string().optional(),
});

const SYSTEM_PROMPTS: Record<string, string> = {
  blog: "You are a senior content strategist. Write engaging, SEO-aware blog content with clear structure (H2s, short paragraphs, lists). Output Markdown.",
  email: "You are a professional copywriter. Write concise, persuasive emails with a clear subject line, opener, body and single CTA. Output Markdown with **Subject:** on the first line.",
  code: "You are a senior software engineer. Write clean, idiomatic, well-commented code. Wrap code in fenced blocks and briefly explain after.",
  social: "You are a social media expert. Write punchy, on-brand posts with relevant hashtags. Output Markdown.",
  custom: "You are a world-class generalist assistant. Respond clearly in well-formatted Markdown.",
};

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not configured." };
    }

    const userMsg = [
      data.prompt,
      data.tone ? `\n\nTone: ${data.tone}.` : "",
      data.language ? `\nLanguage: ${data.language}.` : "",
    ].join("");

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS[data.kind] ?? SYSTEM_PROMPTS.custom },
            { role: "user", content: userMsg },
          ],
        }),
      });

      if (!res.ok) {
        if (res.status === 429) return { ok: false as const, error: "Rate limit reached. Please wait a moment and try again." };
        if (res.status === 402) return { ok: false as const, error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." };
        const t = await res.text();
        console.error("AI gateway error:", res.status, t);
        return { ok: false as const, error: "The AI service is currently unavailable." };
      }

      const json = await res.json();
      const content: string = json?.choices?.[0]?.message?.content ?? "";
      return { ok: true as const, content };
    } catch (e) {
      console.error("generateContent failed:", e);
      return { ok: false as const, error: "Something went wrong while generating." };
    }
  });
