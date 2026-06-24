import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { FileText, Mail, ArrowUpRight, Wand2, LayoutGrid, Film, Newspaper, BookText, GraduationCap, Sparkles, Briefcase, Heart, MessageCircle, Users, Leaf, Droplets, Sun, LineChart, Bot, Satellite } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Nomaseko Mahlangu" },
      { name: "description", content: "VisualReads AI and JobGenie — flagship AI products built end-to-end." },
    ],
  }),
  component: Projects,
});

const features = [
  { icon: LayoutGrid, label: "Comics & manga panels" },
  { icon: Film, label: "Cinematic storyboards" },
  { icon: Newspaper, label: "Data-rich infographics" },
  { icon: BookText, label: "Illustrated micro-scenes" },
  { icon: GraduationCap, label: "Educational visual explainers" },
  { icon: Sparkles, label: "Interactive & branching storytelling" },
];

const sources = ["News articles", "Short stories & novels", "Educational content", "Magazines", "Blogs", "Research summaries", "Digital reading materials"];

function Projects() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Reveal>
        <div className="text-xs font-mono text-accent uppercase tracking-widest">Featured Projects</div>
        <h1 className="mt-3 text-5xl md:text-6xl font-display font-bold tracking-tight">
          Projects that <span className="text-gradient">ship value</span>.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Flagship generative-AI products built end-to-end — live, interactive, and ready to try.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <motion.article
          whileHover={{ y: -6 }}
          className="group relative mt-12 glass rounded-3xl p-10 md:p-12 shadow-elegant overflow-hidden noise"
        >
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-aurora opacity-30 blur-3xl group-hover:opacity-60 transition-opacity" />
          <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-gradient-to-br from-[oklch(0.78_0.2_350)] to-[oklch(0.78_0.18_200)] opacity-20 blur-3xl" />

          <div className="relative grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-aurora flex items-center justify-center shadow-glow">
                  <Wand2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="text-xs font-mono text-accent uppercase tracking-widest">Live · Generative AI</span>
              </div>

              <h2 className="mt-6 text-4xl md:text-5xl font-display font-bold tracking-tight">
                VisualReads <span className="text-gradient">AI</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                A fully functional AI content generator that transforms long, text-heavy reading — articles, stories, novels, educational content, magazines, blogs and research summaries — into <strong className="text-foreground">comics, illustrations, infographics, storyboards, cinematic scenes and interactive storytelling</strong>. Includes a built-in prompt library you can fire straight into the generator.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {sources.map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-muted-foreground">{s}</span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/visualreads" className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-aurora text-primary-foreground font-semibold shadow-glow hover:scale-105 transition-transform">
                  Try it live <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
                <a href="https://github.com/nomaseko97" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full glass font-medium hover:bg-secondary/60 transition-colors">
                  View on GitHub
                </a>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <div key={f.label} className="glass rounded-2xl p-5 shadow-card flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-aurora/80 flex items-center justify-center shrink-0 shadow-glow">
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">{f.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.article>
      </Reveal>

      <Reveal delay={0.1}>
        <motion.article
          whileHover={{ y: -6 }}
          className="group relative mt-10 glass rounded-3xl p-10 md:p-12 shadow-elegant overflow-hidden noise"
        >
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-[oklch(0.78_0.2_60)] to-[oklch(0.78_0.18_350)] opacity-30 blur-3xl group-hover:opacity-60 transition-opacity" />
          <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-aurora opacity-20 blur-3xl" />

          <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-aurora flex items-center justify-center shadow-glow">
                  <Briefcase className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="text-xs font-mono text-accent uppercase tracking-widest">Live · AI Career Mentor</span>
              </div>

              <h2 className="mt-6 text-4xl md:text-5xl font-display font-bold tracking-tight">
                Job<span className="text-gradient">Genie</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                An AI-powered career assistant built for young South African job seekers aged <strong className="text-foreground">18–30</strong> — first-time applicants, matriculants, township and rural youth, and anyone who has never had access to a career counsellor.
              </p>
              <p className="mt-3 text-muted-foreground">
                South Africa has the highest youth unemployment rate in the world (over <strong className="text-foreground">60% for ages 15–24</strong>). Most young people don't fail because they lack potential — they fail because nobody ever showed them how to write a CV, find a learnership, or answer "Tell me about yourself." JobGenie is the patient, encouraging mentor every young South African deserves.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Matriculants", "First-time applicants", "Township & rural youth", "Learnership seekers", "Ages 18–30"].map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-muted-foreground">{s}</span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="https://jobgenieai.lovable.app/" target="_blank" rel="noreferrer" className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-aurora text-primary-foreground font-semibold shadow-glow hover:scale-105 transition-transform">
                  Try JobGenie <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
                <a href="https://github.com/nomaseko97" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full glass font-medium hover:bg-secondary/60 transition-colors">
                  View on GitHub
                </a>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: FileText, label: "CV & cover letter coaching" },
                { icon: MessageCircle, label: "Interview prep & mock answers" },
                { icon: Users, label: "Learnership & bursary finder" },
                { icon: Heart, label: "Encouraging, judgement-free mentor" },
              ].map((f) => (
                <div key={f.label} className="glass rounded-2xl p-5 shadow-card flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-aurora/80 flex items-center justify-center shrink-0 shadow-glow">
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">{f.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.article>
      </Reveal>

      <Reveal>
        <div className="mt-20 glass rounded-3xl p-10 shadow-elegant text-center">
          <FileText className="h-8 w-8 text-accent mx-auto" />
          <h3 className="mt-3 text-3xl font-display font-bold">Want the full case study?</h3>
          <p className="text-muted-foreground mt-2">Reach out and I'll walk you through architecture, decisions and outcomes.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-aurora text-primary-foreground font-medium shadow-glow hover:scale-105 transition-transform">
            <Mail className="h-4 w-4" /> Contact me
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
