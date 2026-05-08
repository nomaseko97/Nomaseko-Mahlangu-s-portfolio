import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { Search, Copy, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      { title: "Prompt Library — Nomaseko Mahlangu" },
      { name: "description", content: "A curated library of high-leverage prompts for blogs, emails, code and more." },
    ],
  }),
  component: Prompts,
});

type Prompt = { title: string; category: string; body: string };

const PROMPTS: Prompt[] = [
  { category: "Blog", title: "SEO Blog Outline", body: "Act as an SEO content strategist. Create a detailed outline for a blog post titled \"{topic}\" targeting the keyword \"{keyword}\". Include H1, 6 H2s, suggested meta description, and 5 FAQ questions." },
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

function Prompts() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return PROMPTS.filter((p) =>
      (cat === "All" || p.category === cat) &&
      (p.title.toLowerCase().includes(q.toLowerCase()) || p.body.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, cat]);

  const copy = async (p: Prompt) => {
    await navigator.clipboard.writeText(p.body);
    setCopied(p.title);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Reveal>
        <div className="text-xs font-mono text-accent uppercase tracking-widest">Companion Tool</div>
        <h1 className="mt-3 text-5xl md:text-6xl font-display font-bold tracking-tight">
          The <span className="text-gradient">Prompt Library</span>.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">A curated collection of prompts powering the Lumen AI Content Studio — for blogs, emails, code, marketing and more.</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 glass rounded-2xl p-4 shadow-card flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search prompts..."
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

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.article
              key={p.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04 }}
              whileHover={{ y: -4 }}
              className="group glass rounded-2xl p-6 shadow-card relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-accent">{p.category}</div>
                  <h3 className="mt-1 text-lg font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" />{p.title}</h3>
                </div>
                <button
                  onClick={() => copy(p)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary text-xs font-medium transition"
                >
                  {copied === p.title ? <><Check className="h-3.5 w-3.5 text-accent" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
                </button>
              </div>
              <pre className="mt-4 whitespace-pre-wrap text-sm font-mono text-muted-foreground bg-background/40 rounded-xl p-4 leading-relaxed">{p.body}</pre>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-20">No prompts match your search.</div>
      )}
    </div>
  );
}
