# Nomaseko Mahlangu — Portfolio

Personal portfolio of **Nomaseko Brilliant Mahlangu** — data engineer and AI builder.
A modern, animated single-page experience showcasing flagship generative-AI products,
experience, certifications and contact channels.

🔗 **Live:** https://nomasekomahlangu.lovable.app

---

## ✨ Highlights

- Aurora gradient design system with glassmorphism, noise textures and elegant shadows
- Framer Motion reveal/scroll animations across every section
- Fully responsive, accessible, SEO-tuned (per-route titles, meta and OG tags)
- File-based routing with TanStack Router — Home, Projects, Contact
- Built-in **VisualReads AI** generator (server function + Lovable AI Gateway)

---

## 🚀 Featured projects

### 1. VisualReads AI
A fully functional AI content generator that turns long, text-heavy reading —
articles, stories, novels, educational content, magazines, blogs and research
summaries — into **comics, illustrations, infographics, storyboards, cinematic
scenes and interactive storytelling**. Includes a built-in prompt library.

→ Try it: `/visualreads` &nbsp;·&nbsp; Docs: [`docs/visualreads-ai.md`](docs/visualreads-ai.md)

### 2. JobGenie
An AI-powered career assistant for young South African job seekers (18–30) —
CV coaching, interview prep, learnership finder. A patient, encouraging mentor
for first-time applicants, matriculants and township & rural youth.

→ Live: https://jobgenieai.lovable.app

### 3. AgriVision
A production-ready agriculture intelligence platform — disease detection (28+
crops), smart irrigation, hyperlocal weather, yield prediction, drone/satellite
heatmaps and a conversational farming assistant. Free for every farmer, no
account required.

→ Repo: https://github.com/nomaseko97/agribloom-ai

---

## 🛠️ Tech stack

- **Framework:** TanStack Start v1 (React 19 + Vite 7)
- **Routing:** TanStack Router (file-based, type-safe)
- **Styling:** Tailwind CSS v4 + shadcn/ui, oklch design tokens
- **Animation:** Framer Motion
- **AI:** Lovable AI Gateway (Gemini 2.5 Flash + Flash Image)
- **Hosting:** Cloudflare Workers via Wrangler

---

## 📁 Structure

```
src/
├── assets/              # Portrait and static images
├── components/          # Nav, Footer, Background, Reveal, ui/*
├── lib/
│   └── ai.functions.ts  # VisualReads server functions
├── routes/
│   ├── __root.tsx       # Shell, head, providers
│   ├── index.tsx        # Home — hero, skills, certs, stats
│   ├── projects.tsx     # VisualReads + JobGenie + AgriVision
│   ├── visualreads.tsx  # Live generator UI
│   └── contact.tsx      # Multi-channel contact
└── styles.css           # Design tokens
docs/
└── visualreads-ai.md    # VisualReads technical documentation
```

---

## 🧑‍💻 Run locally

```bash
bun install
bun run dev
```

Build for production:

```bash
bun run build
```

---

## 📬 Contact

- **GitHub:** https://github.com/nomaseko97
- **Portfolio:** https://nomasekomahlangu.lovable.app

© 2026 Nomaseko Mahlangu.
