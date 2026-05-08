import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Reveal } from "@/components/Reveal";
import { generateContent } from "@/lib/ai.functions";
import {
  Search, Copy, Check, Sparkles, Wand2, FileText, Mail, Code2,
  Megaphone, Loader2, BookOpen, MessageSquarePlus, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Lumen AI Studio — Nomaseko Mahlangu" },
      { name: "description", content: "A live AI content studio that generates blogs, emails, code and social posts — with a built-in prompt library." },
    ],
  }),
  component: Studio,
});

type Kind = "blog" | "email" | "code" | "social" | "custom";

const KINDS: { key: Kind; label: string; icon: any; placeholder: string }[] = [
  { key: "blog", label: "Blog", icon: FileText, placeholder: "Write a 600-word blog post about the impact of AI on data engineering, target audience: graduates entering tech." },
  { key: "email", label: "Email", icon: Mail, placeholder: "Write a cold outreach email to a hiring manager at a fintech company introducing me as a junior data engineer." },
  { key: "code", label: "Code", icon: Code2, placeholder: "Write a Python function that ingests a CSV from Azure Blob Storage and loads it into Synapse, with retries and logging." },
  { key: "social", label: "Social", icon: Megaphone, placeholder: "Write 3 LinkedIn posts announcing my new Azure DP-203 certification." },
  { key: "custom", label: "Custom", icon: MessageSquarePlus, placeholder: "Anything you want me to write, summarise, or brainstorm…" },
];

type Prompt = { title: string; category: string; body: string };

const PROMPTS: Prompt[] = [
  { category: "Blog", title: "SEO Blog Outline", body: 'Act as an SEO content strategist. Create a detailed outline for a blog post titled "{topic}" targeting the keyword "{keyword}". Include H1, 6 H2s, suggested meta description, and 5 FAQ questions.' },
  { category: "Blog", title: "Long-form Article", body: "Write a 1200-word article on {topic} for a {audience} audience. Use a confident, friendly tone. Include intro hook, 4 sections with examples, and a conclusion with CTA." },
  { category: "Email", title: "Cold Outreach", body: "Write a concise cold email to {recipient_role} at {company}. Goal: {goal}. Keep under 120 words, personalised opener, single clear CTA." },
  { category: "Email", title: "Follow-up", body: "Write a polite follow-up email after {days} days of no response. Reference our previous {context}. Offer a new angle and a low-friction CTA." },
  { category: "Code", title: "Refactor for Readability", body: "You are a senior {language} engineer. Refactor the following code for readability, name clarity, and idiomatic style. Explain key changes after.\n\n```\n{code}\n```" },
  { category: "Code", title: "Generate Unit Tests", body: "Write thorough unit tests for the following {language} function using {framework}. Cover edge cases and failure paths.\n\n```\n{code}\n```" },
  { category: "Code", title: "SQL Query Builder", body: "Given the schema below, write an optimised SQL query that {goal}. Explain the query plan implications.\n\nSchema:\n{schema}" },
  { category: "Marketing", title: "Landing Page Hero", body: "Write a punchy hero headline + 1 sentence subheadline + 1 primary CTA for a product that {value_prop}. Audience: {audience}. Tone: bold and modern." },
  { category: "Marketing", title: "Social Post Pack", body: "Create 5 social posts (LinkedIn, X, Instagram caption, Threads, Facebook) announcing {announcement}. Adapt voice per platform. Add 3 hashtags each where relevant." },
  { category: "Productivity", title: "Meeting Summary", body: "Summarise the following meeting transcript into: 1) decisions, 2) action items with owners, 3) open questions, 4) next steps.\n\n{transcript}" },
  { category: "Productivity", title: "Daily Planner", body: "Given the following tasks and deadlines, plan my day from {start} to {end} with focus blocks and breaks. Prioritise high-impact work.\n\n{tasks}" },
  { category: "Career", title: "CV Bullet Rewrite", body: "Rewrite the following CV bullet to be impact-driven, quantified, and ATS-friendly:\n\n{bullet}" },
];

const CATEGORIES = ["All", ...Array.from(new Set(PROMPTS.map((p) => p.category)))];

function Studio() {
  const generate = useServerFn(generateContent);

  const [tab, setTab] = useState<"generate" | "library">("generate");
  const [kind, setKind] = useState<Kind>("blog");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Confident & friendly");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // library state
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const active = KINDS.find((k) => k.key === kind)!;

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
      const result = await generate({ data: { kind, prompt, tone, language } });
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
    const map: Record<string, Kind> = { Blog: "blog", Email: "email", Code: "code", Marketing: "social" };
    setKind(map[p.category] ?? "custom");
    setPrompt(p.body);
    setTab("generate");
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Reveal>
        <div className="text-xs font-mono text-accent uppercase tracking-widest">Featured Project · Live</div>
        <h1 className="mt-3 text-5xl md:text-6xl font-display font-bold tracking-tight">
          Lumen <span className="text-gradient">AI Studio</span>.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          A fully functional AI content generator — blogs, emails, code, social posts and more. Includes a built-in prompt library you can fire straight into the generator.
        </p>
      </Reveal>

      {/* Tabs */}
      <Reveal delay={0.05}>
        <div className="mt-10 inline-flex glass rounded-full p-1 shadow-card">
          {[
            { k: "generate", label: "AI Generator", Icon: Wand2 },
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
          {/* Composer */}
          <Reveal>
            <div className="glass rounded-3xl p-6 shadow-card">
              <div className="flex flex-wrap gap-2">
                {KINDS.map((k) => (
                  <button
                    key={k.key}
                    onClick={() => setKind(k.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition ${
                      kind === k.key ? "bg-aurora text-primary-foreground shadow-glow" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <k.icon className="h-4 w-4" />
                    {k.label}
                  </button>
                ))}
              </div>

              <label className="block mt-5 text-xs font-mono text-muted-foreground">Your prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={active.placeholder}
                rows={8}
                className="mt-2 w-full bg-secondary/40 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground">Tone</label>
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
                {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>) : (<><Sparkles className="h-4 w-4" /> Generate</>)}
              </button>

              <button
                onClick={() => setTab("library")}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Browse the prompt library <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </Reveal>

          {/* Output */}
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
                    <p className="mt-3 text-sm">Pick a content type, drop a prompt, and watch Lumen generate.</p>
                  </motion.div>
                )}
                {loading && (
                  <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-12 text-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 mx-auto text-accent animate-spin" />
                    <p className="mt-3 text-sm">Lumen is thinking…</p>
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
                    <div className="flex gap-2">
                      <button onClick={() => copy(p.body, p.title)} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary text-xs font-medium transition">
                        {copied === p.title ? <><Check className="h-3.5 w-3.5 text-accent" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                      </button>
                    </div>
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
