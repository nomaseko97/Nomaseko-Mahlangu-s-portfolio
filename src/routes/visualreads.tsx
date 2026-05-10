import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { generateVisuals } from "@/lib/ai.functions";
import {
  Search, Copy, Check, Sparkles, Wand2, BookOpen, ArrowRight, Loader2,
  Newspaper, BookText, GraduationCap, Film, LayoutGrid, MessageSquarePlus, Download,
} from "lucide-react";

export const Route = createFileRoute("/visualreads")({
  head: () => ({
    meta: [
      { title: "VisualReads AI — Nomaseko Mahlangu" },
      { name: "description", content: "VisualReads AI turns articles, novels, blogs and research into actual comics, infographics, storyboards and cinematic scenes." },
    ],
  }),
  component: VisualReads,
});

type Format = "comic" | "storyboard" | "infographic" | "illustration" | "cinematic" | "interactive";

const FORMATS: { key: Format; label: string; icon: any; blurb: string; placeholder: string }[] = [
  { key: "comic", label: "Comic Strip", icon: LayoutGrid, blurb: "Bold panels with characters, action and mood.", placeholder: "Paste a news article, story or blog and I'll turn it into comic panels." },
  { key: "storyboard", label: "Storyboard", icon: Film, blurb: "Cinematic scene-by-scene frames.", placeholder: "Drop a short story or scene description for a visual storyboard." },
  { key: "infographic", label: "Infographic", icon: Newspaper, blurb: "Data and key points as a designed visual.", placeholder: "Paste a research summary, report or data-rich blog." },
  { key: "illustration", label: "Illustrated Story", icon: BookText, blurb: "Editorial illustrations of micro-scenes.", placeholder: "Paste a chapter or short story to illustrate." },
  { key: "cinematic", label: "Cinematic Scene", icon: Film, blurb: "Photo-real film stills.", placeholder: "Describe a moment, poem or passage to render cinematically." },
  { key: "interactive", label: "Interactive Story", icon: MessageSquarePlus, blurb: "Branching key-art for choose-your-path stories.", placeholder: "Paste a story you want re-imagined as interactive scenes." },
];

type Prompt = { title: string; category: string; body: string; format: Format };

const PROMPTS: Prompt[] = [
  { category: "Comics", format: "comic", title: "News Article → Comic", body: "Transform this news article into a vivid comic strip — capture the key beats, characters and mood:\n\n{paste article}" },
  { category: "Comics", format: "comic", title: "Short Story → Manga", body: "Adapt this short story into manga-style panels with expressive characters and emotional pacing:\n\n{paste story}" },
  { category: "Storyboards", format: "storyboard", title: "Novel Chapter → Storyboard", body: "Turn this novel chapter into a cinematic storyboard — strong shot composition, lighting and mood:\n\n{paste chapter}" },
  { category: "Storyboards", format: "storyboard", title: "Blog → Explainer Storyboard", body: "Convert this blog post into a 90-second explainer video storyboard with a hook, beats and outro:\n\n{paste blog}" },
  { category: "Infographics", format: "infographic", title: "Research → Infographic", body: "Turn this research summary into a designed infographic with bold stats and clear hierarchy:\n\n{paste research}" },
  { category: "Infographics", format: "infographic", title: "Magazine Feature → Spread", body: "Design a magazine-style visual spread for this feature — hero visual, sidebars, pull-quote:\n\n{paste feature}" },
  { category: "Education", format: "illustration", title: "Textbook → Visual Explainer", body: "Break this textbook section into illustrated micro-scenes that teach the concept visually:\n\n{paste text}" },
  { category: "Education", format: "illustration", title: "Concept → Analogy Comic", body: "Explain {concept} for a {audience} learner using an analogy comic with vivid visuals." },
  { category: "Cinematic", format: "cinematic", title: "Poem → Cinematic Scene", body: "Translate this poem into a single cinematic film still — location, lighting, mood, metaphor:\n\n{paste poem}" },
  { category: "Cinematic", format: "cinematic", title: "Historical Event → Reenactment", body: "Produce cinematic reenactment frames for this historical event with period-accurate styling:\n\n{paste event}" },
  { category: "Interactive", format: "interactive", title: "Article → Branching Story", body: "Re-imagine this article as an interactive branching story with scene art for each decision:\n\n{paste article}" },
  { category: "Interactive", format: "interactive", title: "Blog → Scrollytelling", body: "Convert this blog into scrollytelling key-art scenes that pace the narrative:\n\n{paste blog}" },
];

const CATEGORIES = ["All", ...Array.from(new Set(PROMPTS.map((p) => p.category)))];

type Panel = { caption: string; image?: string; prompt: string };
type Result = { title: string; summary: string; panels: Panel[] };

function VisualReads() {
  const generate = useServerFn(generateVisuals);

  const [tab, setTab] = useState<"generate" | "library">("generate");
  const [formatIdx, setFormatIdx] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Vivid, modern, cinematic");
  const [panels, setPanels] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const active = FORMATS[formatIdx];

  const filtered = useMemo(
    () =>
      PROMPTS.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (p.title.toLowerCase().includes(q.toLowerCase()) || p.body.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  const onGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await generate({ data: { format: active.key, prompt, panels, style } });
      if (res.ok) setResult({ title: res.title, summary: res.summary, panels: res.panels });
      else setError(res.error);
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const useInGenerator = (p: Prompt) => {
    setPrompt(p.body);
    const idx = FORMATS.findIndex((f) => f.key === p.format);
    if (idx >= 0) setFormatIdx(idx);
    setTab("generate");
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Reveal>
        <div className="text-xs font-mono text-accent uppercase tracking-widest">Featured Project · Live</div>
        <h1 className="mt-3 text-5xl md:text-6xl font-display font-bold tracking-tight">
          VisualReads <span className="text-gradient">AI</span>.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Paste any written content — an article, novel chapter, research summary, blog or email — and watch it become an actual visual experience: comic panels, storyboards, infographics and cinematic scenes.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-10 inline-flex glass rounded-full p-1 shadow-card">
          {[
            { k: "generate", label: "Visualise content", Icon: Wand2 },
            { k: "library", label: "Prompt Library", Icon: BookOpen },
          ].map(({ k, label, Icon }) => (
            <button
              key={k}
              onClick={() => setTab(k as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition ${
                tab === k ? "bg-aurora text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </Reveal>

      {tab === "generate" ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.3fr]">
          <Reveal>
            <div className="glass rounded-3xl p-6 shadow-card">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FORMATS.map((f, i) => (
                  <button
                    key={f.label}
                    onClick={() => setFormatIdx(i)}
                    className={`flex flex-col items-start gap-1 px-3 py-3 rounded-2xl text-left text-sm transition ${
                      formatIdx === i ? "bg-aurora text-primary-foreground shadow-glow" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <f.icon className="h-4 w-4" />
                    <span className="font-semibold">{f.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{active.blurb}</p>

              <label className="block mt-5 text-xs font-mono text-muted-foreground">Your content or instructions</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={active.placeholder}
                rows={9}
                className="mt-2 w-full bg-secondary/40 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground">Visual style</label>
                  <input value={style} onChange={(e) => setStyle(e.target.value)} className="mt-1 w-full bg-secondary/40 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground">Panels ({panels})</label>
                  <input type="range" min={1} max={4} value={panels} onChange={(e) => setPanels(parseInt(e.target.value))} className="mt-3 w-full accent-[var(--accent)]" />
                </div>
              </div>

              <button
                onClick={onGenerate}
                disabled={loading || !prompt.trim()}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-aurora text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Visualising…</>) : (<><Sparkles className="h-4 w-4" /> Visualise</>)}
              </button>

              <button
                onClick={() => setTab("library")}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Browse the prompt library <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass rounded-3xl p-6 shadow-card min-h-[28rem] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-accent uppercase tracking-widest">Output</div>
                {result && (
                  <button onClick={() => copy(result.summary, "out")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary text-xs font-medium transition">
                    {copied === "out" ? <><Check className="h-3.5 w-3.5 text-accent" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy summary</>}
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-sm text-destructive bg-destructive/10 rounded-xl p-4">
                    {error}
                  </motion.div>
                )}
                {!error && !result && !loading && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-12 text-center text-muted-foreground">
                    <Sparkles className="h-8 w-8 mx-auto text-accent" />
                    <p className="mt-3 text-sm">Pick a visual format, paste content, and watch it transform into real images.</p>
                  </motion.div>
                )}
                {loading && (
                  <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-12 text-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 mx-auto text-accent animate-spin" />
                    <p className="mt-3 text-sm">Storyboarding & rendering panels — this takes a moment…</p>
                  </motion.div>
                )}
                {result && !loading && (
                  <motion.div key="out" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-5">
                    <div>
                      <h3 className="text-2xl font-display font-bold">{result.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{result.summary}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {result.panels.map((p, i) => (
                        <motion.figure
                          key={i}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="glass rounded-2xl overflow-hidden shadow-card group relative"
                        >
                          {p.image ? (
                            <div className="relative">
                              <img src={p.image} alt={p.caption} className="w-full aspect-square object-cover" />
                              <a
                                href={p.image}
                                download={`visualreads-panel-${i + 1}.png`}
                                className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition"
                                title="Download"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          ) : (
                            <div className="w-full aspect-square bg-secondary/40 flex items-center justify-center text-xs text-muted-foreground p-4 text-center">
                              Image render failed — try regenerating.
                            </div>
                          )}
                          <figcaption className="p-4">
                            <div className="text-xs font-mono text-accent">Panel {i + 1}</div>
                            <p className="mt-1 text-sm">{p.caption}</p>
                          </figcaption>
                        </motion.figure>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      ) : (
        <>
          <Reveal delay={0.05}>
            <div className="mt-8 glass rounded-2xl p-4 shadow-card flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search prompts…"
                  className="w-full bg-secondary/50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`px-4 py-2 rounded-full text-sm transition ${cat === c ? "bg-aurora text-primary-foreground shadow-glow" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.article
                  key={p.title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: Math.min(i, 6) * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="group glass rounded-2xl p-6 shadow-card relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-mono text-accent">{p.category}</div>
                      <h3 className="mt-1 text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        {p.title}
                      </h3>
                    </div>
                    <button onClick={() => copy(p.body, p.title)} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary text-xs font-medium transition">
                      {copied === p.title ? <><Check className="h-3.5 w-3.5 text-accent" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                    </button>
                  </div>
                  <pre className="mt-4 whitespace-pre-wrap text-sm font-mono text-muted-foreground bg-background/40 rounded-xl p-4 leading-relaxed">{p.body}</pre>
                  <button
                    onClick={() => useInGenerator(p)}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent font-medium"
                  >
                    Use in generator <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-20">No prompts match your search.</div>
          )}
        </>
      )}
    </div>
  );
}
