import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Reveal } from "@/components/Reveal";
import { generateContent } from "@/lib/ai.functions";
import {
  Search, Copy, Check, Sparkles, Wand2, BookOpen, ArrowRight, Loader2,
  Newspaper, BookText, GraduationCap, Film, LayoutGrid, MessageSquarePlus,
} from "lucide-react";

export const Route = createFileRoute("/visualreads")({
  head: () => ({
    meta: [
      { title: "VisualReads AI — Nomaseko Mahlangu" },
      { name: "description", content: "VisualReads AI transforms written content — articles, novels, blogs, research — into comics, infographics, storyboards and cinematic scenes." },
    ],
  }),
  component: VisualReads,
});

type Kind = "blog" | "email" | "code" | "social" | "custom";

type Format = {
  key: Kind;
  label: string;
  icon: any;
  blurb: string;
  placeholder: string;
};

const FORMATS: Format[] = [
  { key: "blog", label: "Comic Strip", icon: LayoutGrid, blurb: "Turn an article into a 6–8 panel comic with dialogue.", placeholder: "Transform this news article into a 6-panel comic strip with vivid scene descriptions, character dialogue and panel directions:\n\n[paste article here]" },
  { key: "blog", label: "Storyboard", icon: Film, blurb: "Cinematic scene-by-scene storyboard.", placeholder: "Convert this short story into a cinematic storyboard with shot type, camera movement, lighting and on-screen action for each scene:\n\n[paste story here]" },
  { key: "blog", label: "Infographic", icon: Newspaper, blurb: "Data-rich infographic outline with sections & visuals.", placeholder: "Turn this research summary into an infographic outline with title, 5 key stats, suggested icons/illustrations, and a call-to-action:\n\n[paste research here]" },
  { key: "blog", label: "Illustrated Story", icon: BookText, blurb: "Re-tell a chapter as illustrated micro-scenes.", placeholder: "Re-tell this novel chapter as 8 illustrated micro-scenes. For each scene, give a 2-sentence narration and a detailed illustration prompt:\n\n[paste chapter here]" },
  { key: "blog", label: "Edu Visual", icon: GraduationCap, blurb: "Educational concept broken into visual explainers.", placeholder: "Transform this educational text into a visual explainer with: hook visual, 4 concept cards (each with metaphor + diagram description), and a recap visual:\n\n[paste educational content here]" },
  { key: "custom", label: "Custom", icon: MessageSquarePlus, blurb: "Anything you want me to visualise.", placeholder: "Describe the content and the visual format you want…" },
];

type Prompt = { title: string; category: string; body: string };

const PROMPTS: Prompt[] = [
  { category: "Comics", title: "News Article → Comic", body: "Transform the following news article into an 8-panel comic strip. For each panel, describe: setting, characters, action, dialogue/caption, and visual mood. Keep tone faithful to the original.\n\nArticle:\n{article}" },
  { category: "Comics", title: "Short Story → Manga", body: "Adapt this short story into a 12-panel manga page. Specify panel layout, character expressions, sound effects (SFX), and dialogue bubbles.\n\nStory:\n{story}" },
  { category: "Storyboards", title: "Novel Chapter → Cinematic Storyboard", body: "Turn this novel chapter into a cinematic storyboard with 10 shots. For each: shot type, camera movement, lens, lighting, key action, and a one-line visual prompt.\n\nChapter:\n{chapter}" },
  { category: "Storyboards", title: "Blog → Explainer Video Storyboard", body: "Convert this blog post into a 90-second explainer video storyboard. Provide: hook (0-5s), 3 main beats with on-screen text and B-roll ideas, and an outro CTA.\n\nBlog:\n{blog}" },
  { category: "Infographics", title: "Research Summary → Infographic", body: "Turn this research summary into an infographic spec: bold title, subtitle, 5 stat cards (number + label + icon), a comparison chart suggestion, source line and CTA.\n\nResearch:\n{research}" },
  { category: "Infographics", title: "Magazine Feature → Visual Spread", body: "Design a 2-page magazine visual spread for this feature: hero illustration concept, 3 sidebar facts, pull-quote, and a tiny timeline visual.\n\nFeature:\n{feature}" },
  { category: "Education", title: "Textbook Section → Visual Explainer", body: "Break this textbook section into a visual explainer: hook image, 4 concept cards (metaphor + diagram), worked example sketch, and a recap mind-map.\n\nText:\n{text}" },
  { category: "Education", title: "Concept → Analogy Comic", body: "Explain {concept} for a {audience} learner using a 6-panel analogy comic. Each panel: visual + caption.\n\n" },
  { category: "Interactive", title: "Article → Branching Story", body: "Re-imagine this article as an interactive branching story with 3 decision points. For each branch, describe the visual scene and the consequence.\n\nArticle:\n{article}" },
  { category: "Interactive", title: "Blog → Scrollytelling", body: "Convert this blog into a scrollytelling experience: 6 scroll-trigger sections with background visual, headline, and 1-sentence body. Note where charts or animations should appear.\n\nBlog:\n{blog}" },
  { category: "Cinematic", title: "Poem → Cinematic Scene", body: "Translate this poem into a single cinematic scene: location, weather, lighting, character action, sound design, and a closing visual metaphor.\n\nPoem:\n{poem}" },
  { category: "Cinematic", title: "Historical Event → Reenactment Shotlist", body: "Produce a 12-shot cinematic reenactment shotlist for this historical event. Include period-accurate setting, costuming notes, and a lens/lighting plan.\n\nEvent:\n{event}" },
];

const CATEGORIES = ["All", ...Array.from(new Set(PROMPTS.map((p) => p.category)))];

function VisualReads() {
  const generate = useServerFn(generateContent);

  const [tab, setTab] = useState<"generate" | "library">("generate");
  const [formatIdx, setFormatIdx] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Vivid, cinematic, accessible");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
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
    setOutput("");
    try {
      const styled = `Transform the following written content into a "${active.label}" format. ${active.blurb}\n\nUser content / instructions:\n${prompt}`;
      const result = await generate({ data: { kind: active.key, prompt: styled, tone, language } });
      if (result.ok) setOutput(result.content);
      else setError(result.error);
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
          Transform articles, stories, novels, educational content, magazines, blogs and research into visually engaging experiences — comics, illustrations, infographics, storyboards, cinematic scenes and interactive storytelling.
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
                  <label className="block text-xs font-mono text-muted-foreground">Tone / Style</label>
                  <input value={tone} onChange={(e) => setTone(e.target.value)} className="mt-1 w-full bg-secondary/40 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground">Language</label>
                  <input value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 w-full bg-secondary/40 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
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
                {output && (
                  <button onClick={() => copy(output, "out")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary text-xs font-medium transition">
                    {copied === "out" ? <><Check className="h-3.5 w-3.5 text-accent" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-sm text-destructive bg-destructive/10 rounded-xl p-4">
                    {error}
                  </motion.div>
                )}
                {!error && !output && !loading && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-12 text-center text-muted-foreground">
                    <Sparkles className="h-8 w-8 mx-auto text-accent" />
                    <p className="mt-3 text-sm">Pick a visual format, paste your content, and watch VisualReads transform it.</p>
                  </motion.div>
                )}
                {loading && (
                  <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-12 text-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 mx-auto text-accent animate-spin" />
                    <p className="mt-3 text-sm">Storyboarding your scene…</p>
                  </motion.div>
                )}
                {output && !loading && (
                  <motion.article
                    key="out"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 prose prose-invert prose-sm max-w-none prose-pre:bg-background/60 prose-pre:rounded-xl prose-headings:font-display"
                  >
                    <ReactMarkdown>{output}</ReactMarkdown>
                  </motion.article>
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
