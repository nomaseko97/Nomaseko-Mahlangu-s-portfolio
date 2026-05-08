import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { Sparkles, FileText, Mail, Code2, Wand2, ArrowUpRight, Database, Cloud } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Nomaseko Mahlangu" },
      { name: "description", content: "AI content generator, prompt library, data pipelines and more — selected work by Nomaseko Mahlangu." },
    ],
  }),
  component: Projects,
});

const projects = [
  {
    title: "Lumen AI — Content Studio",
    tag: "Featured · Generative AI",
    description: "An AI tool that generates blog posts, marketing emails, code snippets and social copy from a single prompt. Multi-tone, multi-language, with export & history.",
    icon: Wand2,
    features: ["Blog & article generator", "Email composer with tone control", "Code generator (Python, JS, SQL)", "Built-in prompt library"],
    cta: { label: "Explore Prompt Library", to: "/prompts" as const },
    accent: "from-[oklch(0.72_0.22_295)] to-[oklch(0.78_0.18_200)]",
  },
  {
    title: "Prompt Library",
    tag: "Companion product",
    description: "A curated, searchable library of high-leverage prompts for writers, devs and marketers — packaged with the Lumen AI Studio.",
    icon: Sparkles,
    features: ["Categorised templates", "One-click copy", "Variable placeholders"],
    cta: { label: "Open library", to: "/prompts" as const },
    accent: "from-[oklch(0.78_0.2_350)] to-[oklch(0.72_0.22_295)]",
  },
  {
    title: "Standard Bank — Data Reservoir Pipelines",
    tag: "Enterprise data engineering",
    description: "Automated ingestion of source data into the bank's data reservoir using SSIS batch processes, Attunity and curated views deployed to production.",
    icon: Database,
    features: ["SSIS batch ingestion", "Curated view deployment", "Risk monitoring & reporting"],
    accent: "from-[oklch(0.78_0.18_200)] to-[oklch(0.72_0.22_295)]",
  },
  {
    title: "Azure Cloud Lab",
    tag: "Cloud · DP-203",
    description: "Hands-on Azure projects covering Data Factory, Synapse, Data Lake — designed and secured following DP-203 best practices.",
    icon: Cloud,
    features: ["Data Factory pipelines", "Synapse analytics", "Storage security"],
    accent: "from-[oklch(0.72_0.22_295)] to-[oklch(0.78_0.2_350)]",
  },
  {
    title: "Client E-commerce Builds",
    tag: "Software development",
    description: "Responsive client e-commerce sites built and tested end-to-end during internships at Asolution & Digital Academy.",
    icon: Code2,
    features: ["Responsive front-ends", "Cart & checkout flows", "QA & functional testing"],
    accent: "from-[oklch(0.78_0.18_200)] to-[oklch(0.78_0.2_350)]",
  },
];

function Projects() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Reveal>
        <div className="text-xs font-mono text-accent uppercase tracking-widest">Selected Work</div>
        <h1 className="mt-3 text-5xl md:text-6xl font-display font-bold tracking-tight">Projects that <span className="text-gradient">ship value</span>.</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">From enterprise data pipelines to a generative AI content studio — a sample of the work I've built and contributed to.</p>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.07}>
            <motion.article
              whileHover={{ y: -6 }}
              className="group relative h-full glass rounded-3xl p-8 shadow-card overflow-hidden noise"
            >
              <div className={`absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${p.accent} opacity-30 blur-3xl group-hover:opacity-60 transition-opacity`} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-aurora flex items-center justify-center shadow-glow">
                    <p.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{p.tag}</span>
                </div>
                <h3 className="mt-6 text-2xl font-display font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />{f}
                    </li>
                  ))}
                </ul>
                {p.cta && (
                  <Link to={p.cta.to} className="mt-6 inline-flex items-center gap-1 text-accent font-medium group/link">
                    {p.cta.label} <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                )}
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>

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
