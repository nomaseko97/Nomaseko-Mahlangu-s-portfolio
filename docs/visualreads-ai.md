# VisualReads AI — Technical Documentation

> A two-stage generative pipeline that converts written content into a sequence of illustrated, captioned panels.

- **Route:** `/visualreads` → `src/routes/visualreads.tsx`
- **Server function:** `generateVisuals` → `src/lib/ai.functions.ts`
- **Runtime:** Cloudflare Workers (TanStack Start SSR)
- **AI provider:** Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`)

---

## 1. High-level architecture

```text
┌────────────────────┐    createServerFn   ┌──────────────────────────┐
│ visualreads.tsx    │ ──────────────────▶ │ generateVisuals (server) │
│  - Format picker   │                     │                          │
│  - Prompt input    │                     │  Step 1: Plan (text)     │
│  - Style + panels  │                     │   gemini-2.5-flash       │
│  - Prompt library  │                     │                          │
│  - Panel renderer  │ ◀────── JSON ────── │  Step 2: Render (image)  │
└────────────────────┘   {title, summary,  │   gemini-2.5-flash-image │
                          panels[N]}       │   (parallel per panel)   │
                                           └──────────────────────────┘
```

Both steps run **server-side** so the `LOVABLE_API_KEY` never reaches the browser. The client only ever sees the final JSON response.

---

## 2. Public contract

### Input (validated with Zod)

```ts
{
  format: "comic" | "storyboard" | "infographic"
        | "illustration" | "cinematic" | "interactive",
  prompt: string,          // 3–4000 chars; the source content or instructions
  panels: number,          // integer, 1–4 (default 3)
  style?: string           // free-text style hint, e.g. "moody, neon noir"
}
```

### Output

```ts
// success
{
  ok: true,
  title: string,
  summary: string,
  panels: Array<{
    caption: string,       // 1–2 sentence narration for the panel
    prompt: string,        // self-contained image prompt used to render
    image?: string         // base64 data URL (omitted if image step failed)
  }>
}

// failure
{ ok: false, error: string }
```

### Known error messages

| Trigger | Message |
| --- | --- |
| Missing `LOVABLE_API_KEY` | `AI is not configured.` |
| Gateway 429 | `Rate limit reached. Please wait and try again.` |
| Gateway 402 | `AI credits exhausted. Add credits in Settings → Workspace → Usage.` |
| Other planning failure | `Planning step failed.` |
| Plan JSON parse error | `Could not parse the visual plan. Try again.` |

Image-step failures are **non-fatal**: the panel is still returned with its caption and prompt, just without an `image` field. The UI shows a placeholder for missing images.

---

## 3. The pipeline

### Step 1 — Planning (text model)

- **Model:** `google/gemini-2.5-flash`
- **Goal:** Convert the source content into a strict-JSON plan.
- **System prompt** (verbatim): see `src/lib/ai.functions.ts`. It enforces:
  - Strict JSON output, no markdown fences, no prose
  - Schema: `{ title, summary, panels: [{ caption, imagePrompt }] }`
  - `imagePrompt` must be self-contained (subject, setting, action, mood, composition, art style)
  - Captions kept tight (1–2 sentences)
- **User prompt:** assembled from `format`, the `FORMAT_GUIDE` art-direction string, the user's `style` hint, the requested `panels` count, and the source `prompt`.
- **Hardening:** the response content is stripped of accidental ```` ``` ```` fences before `JSON.parse`. Failures return a friendly error rather than throwing.

### Step 2 — Rendering (image model)

- **Model:** `google/gemini-2.5-flash-image` (Nano Banana)
- **Modalities:** `["image", "text"]`
- **Concurrency:** all panels rendered in parallel via `Promise.all` for low end-to-end latency.
- **Per-panel prompt template:**
  ```
  {imagePrompt}. Art direction: {FORMAT_GUIDE[format]}. Style: {style}.
  High craft, coherent composition, no text overlays unless the format calls for it.
  ```
- **Response shape:** the gateway returns image URLs at one of:
  - `choices[0].message.images[0].image_url.url`
  - `choices[0].message.images[0].url`
  Both are checked. The URL is a base64 data URL suitable for direct use in `<img src>` and `<a download>`.

### Format guide table

| Format | Art direction passed to both steps |
| --- | --- |
| `comic` | Comic book panels, bold ink lines, halftone shading, dynamic angles, speech bubbles when appropriate |
| `storyboard` | Cinematic storyboard frames, sketchy production-art look, shot composition baked in |
| `infographic` | Modern flat infographic, bold typography, icons, charts, clear visual hierarchy |
| `illustration` | Richly detailed editorial illustration, painterly textures, expressive lighting |
| `cinematic` | Photo-real film still, dramatic lighting, anamorphic widescreen mood |
| `interactive` | Stylised scene as branching-story key art with clear focal characters |

---

## 4. Frontend (`src/routes/visualreads.tsx`)

Key UI concerns:

- **Format selector** — chip-style buttons, drives the `format` input.
- **Prompt textarea + style + panel count** — all bound to local React state.
- **Prompt library** — searchable, category-filtered list of starter prompts. "Use in generator" copies the prompt into the textarea and (optionally) sets a sensible format.
- **Generate** — calls the `generateVisuals` server function via `useServerFn` + TanStack Query. Submit is disabled while in flight.
- **Panel renderer** — Framer Motion stagger animation reveals each panel with its caption and image. Each image has a **Download** link (uses the base64 data URL directly).
- **Error states** — friendly inline message for the `ok: false` shape; toast for unexpected throws.

The route is a public page (no auth middleware), safe to call during prerender — the server function is only invoked from the component, never from a route loader.

---

## 5. Server function authoring rules followed

- File lives in `src/lib/` (client-safe path), named `*.functions.ts` so it is importable from the route.
- `process.env.LOVABLE_API_KEY` is read **inside** `.handler()`, not at module top level.
- Input is validated with Zod via `.inputValidator()`.
- No client-only modules imported at module scope (SSR-safe).

See the project-level rules in the system prompt and the TanStack Start docs for the full pattern.

---

## 6. Security

- `LOVABLE_API_KEY` is **server-only**. It is never sent to the browser, never embedded in client bundles, and never logged.
- All AI calls originate from the server function, so callers cannot smuggle their own model/headers.
- Input is length-bounded (`prompt` ≤ 4000 chars, `panels` ≤ 4) to limit abuse and runaway cost.
- Output images are base64 data URLs returned in-band — no third-party image host is involved.

---

## 7. Performance

- **Parallel image generation** keeps total latency close to the slowest single panel, not the sum.
- **Panel cap of 4** prevents pathological fan-out and keeps gateway cost predictable.
- **No streaming** today: the client waits for the full JSON response. Streaming panels as they finish is a natural future enhancement (see Roadmap).

---

## 8. Deployment

The portfolio (and VisualReads AI with it) is deployed via Lovable to Cloudflare Workers.

- `wrangler.jsonc` declares `nodejs_compat` and points `main` at `src/server.ts`.
- `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which already wires TanStack Start, the Cloudflare plugin, Tailwind v4 and the React plugin.
- Production URL: <https://nomasekomahlangu.lovable.app/visualreads>
- Stable preview URL: `https://project--70b592d6-6c5c-4611-aace-dfc9ea74706c-dev.lovable.app/visualreads`

---

## 9. Local development

```bash
bun install
bun run dev      # http://localhost:8080
```

To exercise the generator locally you need a `LOVABLE_API_KEY` exported in the shell that runs the dev server.

### Adding a new format

1. Add the literal to the `format` enum in `VisualSchema` (`src/lib/ai.functions.ts`).
2. Add an entry to `FORMAT_GUIDE` describing the art direction.
3. Add a chip + (optional) icon in the format selector in `src/routes/visualreads.tsx`.

### Extending the prompt library

The library lives next to the generator UI in `src/routes/visualreads.tsx`. Add an entry with `{ title, category, prompt, suggestedFormat }`. Categories surface automatically in the filter row.

---

## 10. Roadmap

- Stream panels to the UI as each image finishes
- Allow up to 8 panels with a cost-aware confirmation
- Optional text-on-image overlays for infographic/comic formats
- Export the full story as a single PDF or vertical scroll image
- Persist generations to Lovable Cloud with a public share link

---

## 11. File reference

| Path | Purpose |
| --- | --- |
| `src/routes/visualreads.tsx` | Generator UI, prompt library, panel renderer |
| `src/lib/ai.functions.ts` | `generateVisuals` server function (plan + render) |
| `src/routes/projects.tsx` | Marketing card linking into `/visualreads` |
| `src/styles.css` | Design tokens used by the generator UI |
| `wrangler.jsonc` / `vite.config.ts` | Worker + Vite configuration |
