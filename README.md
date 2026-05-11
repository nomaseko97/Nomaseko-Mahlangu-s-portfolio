# VisualReads AI

> Turn long, text-heavy reading into comics, storyboards, infographics, cinematic stills, illustrations and interactive scenes — in seconds.

VisualReads AI is the flagship project inside [Nomaseko Mahlangu's portfolio](https://nomasekomahlangu.lovable.app). It transforms articles, short stories, novels, educational content, magazines, blogs and research summaries into **visually engaging panels** instead of walls of text — and ships with a built-in **prompt library** so anyone can get great results on the first try.

Live demo: <https://nomasekomahlangu.lovable.app/visualreads>

---

## ✨ What it does

Paste any written content (or pick a prompt from the library) and VisualReads AI:

1. **Plans the story** — a language model breaks the source into a sequence of visual panels, each with a tight caption and a self-contained image prompt.
2. **Generates the visuals** — every panel is rendered in parallel by an image model in your chosen format and style.
3. **Returns a ready-to-share visual story** — title, summary and N illustrated panels you can download.

### Output formats

| Format | What you get |
| --- | --- |
| `comic` | Bold ink panels, halftone shading, dynamic angles |
| `storyboard` | Cinematic production-style frames with shot composition |
| `infographic` | Flat infographic design with icons and clear hierarchy |
| `illustration` | Editorial painterly illustrations with expressive lighting |
| `cinematic` | Photo-real anamorphic film stills |
| `interactive` | Branching-story key art with focal characters |

### Source content it handles

News articles · Short stories & novels · Educational content · Magazines · Blogs · Research summaries · Digital reading materials.

### Built-in prompt library

A categorised, searchable library of starter prompts that one-click load into the generator — so first-time users always get a strong result.

---

## 🧱 Tech stack

- **Framework:** [TanStack Start v1](https://tanstack.com/start) on React 19 (SSR, server functions, file-based routing)
- **Build tool:** Vite 7
- **Runtime:** Cloudflare Workers (via `@cloudflare/vite-plugin` + `wrangler`)
- **Styling:** Tailwind CSS v4 (CSS-first, semantic tokens in `src/styles.css`)
- **Animation:** Framer Motion
- **UI primitives:** shadcn/ui + Radix
- **Validation:** Zod
- **AI Gateway:** [Lovable AI Gateway](https://docs.lovable.dev) (OpenAI-compatible)
  - Planner: `google/gemini-2.5-flash`
  - Image generator: `google/gemini-2.5-flash-image` (Nano Banana)

---

## 🚀 Getting started

```bash
bun install
bun run dev
```

Open <http://localhost:8080>.

### Required environment

`LOVABLE_API_KEY` is auto-provisioned by Lovable Cloud and read **server-side only** inside `src/lib/ai.functions.ts`. It is never exposed to the browser. To run locally with your own key:

```bash
export LOVABLE_API_KEY="lk_..."
```

---

## 📁 Project structure

```text
src/
├── routes/
│   ├── __root.tsx          # Root layout (shell, head, providers)
│   ├── index.tsx           # Portfolio home
│   ├── projects.tsx        # Featured projects (VisualReads AI, JobGenie)
│   ├── visualreads.tsx     # 🎨 VisualReads AI generator UI
│   └── contact.tsx
├── lib/
│   └── ai.functions.ts     # 🧠 generateVisuals server function
├── components/             # Nav, Footer, Background, Reveal, ui/*
└── styles.css              # Design tokens (oklch), Tailwind v4 theme
```

---

## 📚 Documentation

For deep technical details — architecture, data contracts, prompt engineering, error handling, deployment — see [`docs/visualreads-ai.md`](./docs/visualreads-ai.md).

---

## 👤 Author

**Nomaseko Brilliant Mahlangu** — IT graduate · Data & Cloud · AI builder
GitHub: [@nomaseko97](https://github.com/nomaseko97)

## 📄 License

MIT
