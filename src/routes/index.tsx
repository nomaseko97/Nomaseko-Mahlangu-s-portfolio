import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Cloud, Database, Cpu, Sparkles, Code2, Brain } from "lucide-react";
import portrait from "@/assets/portrait.jpg";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nomaseko Mahlangu — IT Graduate · Data · Cloud · AI" },
      { name: "description", content: "Marvellous portfolio of an IT graduate with hands-on data engineering, cloud, and AI experience." },
    ],
  }),
  component: Home,
});

const skills = [
  { icon: Cloud, label: "Azure & AWS", desc: "Data Factory, Synapse, Data Lake" },
  { icon: Database, label: "Data Engineering", desc: "SQL, SSIS, Attunity, Power BI" },
  { icon: Code2, label: "Software Dev", desc: "Python, Java, JS, C#, PHP" },
  { icon: Brain, label: "AI Tooling", desc: "LLM apps, prompt design, automation" },
  { icon: Cpu, label: "IT Infrastructure", desc: "Monitoring, backups, security" },
  { icon: Sparkles, label: "Soft Skills", desc: "Adaptable, sharp eye, team-first" },
];

const experience = [
  { role: "Data Engineer Learner", company: "Standard Bank", period: "May 2022 — Oct 2023", points: ["Curated views, deployment & SSIS batch ingestion", "Monitored daily tasks on enterprise data platform", "Reported risk areas for early correction"] },
  { role: "Education Assistant", company: "Ntolo Secondary School", period: "Dec 2020 — Mar 2021", points: ["Prepared classrooms & supported educators", "Helped learners with academic tasks"] },
  { role: "Software Development Intern", company: "Digital Academy", period: "Dec 2019 — May 2020", points: ["Built responsive websites for clients"] },
  { role: "Software Development Intern", company: "Asolution", period: "Oct 2018 — Sep 2019", points: ["Developed e-commerce websites end-to-end", "Tested for full functionality"] },
  { role: "Lab Tutor", company: "Tshwane University of Technology", period: "Aug 2018 — Dec 2018", points: ["Facilitated open lab & assisted students"] },
];

const certs = ["DP-203 Azure Data Engineer", "AZ-900 Azure Fundamentals", "PL-900 Power Platform Fundamentals"];

function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-32">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Available for graduate & junior roles
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="mt-6 text-5xl md:text-7xl font-display font-bold leading-[1.05] tracking-tight"
            >
              I build <span className="text-gradient">data-driven</span> & <span className="text-gradient">AI-powered</span> experiences.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl"
            >
              I'm <strong className="text-foreground">Nomaseko Brilliant Mahlangu</strong> — an IT graduate from Tshwane University of Technology with hands-on experience at Standard Bank in data engineering, Azure cloud, and software development.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/projects" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-aurora text-primary-foreground font-medium shadow-glow hover:scale-105 transition-transform">
                See my projects <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-6 py-3 rounded-full glass font-medium hover:bg-secondary/60 transition-colors">
                Let's talk
              </Link>
            </motion.div>
            <div className="mt-10 flex gap-8 text-sm">
              {[["5+", "years studying & working in IT"], ["3", "Microsoft certifications"], ["10+", "projects shipped"]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-3xl font-display font-bold text-gradient">{n}</div>
                  <div className="text-muted-foreground text-xs mt-1 max-w-[10rem]">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto"
          >
            <div className="absolute -inset-6 bg-aurora rounded-[2rem] blur-2xl opacity-50 animate-blob" />
            <div className="relative glass rounded-[2rem] p-3 shadow-elegant">
              <img src={portrait} alt="Portrait of Nomaseko Mahlangu" className="rounded-[1.5rem] w-[22rem] h-[28rem] object-cover" />
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-card"
              >
                <div className="text-xs text-muted-foreground">Currently exploring</div>
                <div className="font-semibold flex items-center gap-2"><Brain className="h-4 w-4 text-accent" /> Generative AI</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                className="absolute -top-6 -right-6 glass rounded-2xl p-4 shadow-card"
              >
                <div className="text-xs text-muted-foreground">Based in</div>
                <div className="font-semibold">Sandton, ZA 🇿🇦</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">What I bring to the table</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">A blend of cloud, data and modern AI craft — sharpened by enterprise experience at one of Africa's biggest banks.</p>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <motion.div whileHover={{ y: -6 }} className="group glass rounded-2xl p-6 shadow-card h-full relative overflow-hidden noise">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-aurora opacity-0 group-hover:opacity-30 blur-2xl transition-opacity" />
                <s.icon className="h-8 w-8 text-accent" />
                <h3 className="mt-4 text-xl font-semibold">{s.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXPERIENCE TIMELINE */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Experience</h2>
        </Reveal>
        <div className="mt-12 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-aurora opacity-40" />
          <div className="space-y-10">
            {experience.map((e, i) => (
              <Reveal key={e.role + e.company} delay={i * 0.05}>
                <div className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 ? "" : "md:[&>*:first-child]:order-2"}`}>
                  <div className="hidden md:block" />
                  <div className="pl-12 md:pl-0 relative">
                    <span className="absolute left-2 md:left-auto md:right-[calc(100%+1.5rem)] top-3 h-3 w-3 rounded-full bg-aurora shadow-glow" style={{ transform: i % 2 ? "" : "translateX(0)" }} />
                    <div className="glass rounded-2xl p-6 shadow-card">
                      <div className="text-xs text-accent font-mono">{e.period}</div>
                      <h3 className="mt-1 text-xl font-semibold">{e.role}</h3>
                      <div className="text-muted-foreground text-sm">{e.company}</div>
                      <ul className="mt-3 text-sm space-y-1.5 text-muted-foreground list-disc list-inside">
                        {e.points.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS / EDUCATION */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="glass rounded-3xl p-8 shadow-card h-full">
              <h3 className="text-2xl font-display font-bold">Education</h3>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="font-semibold">B.Tech Information Technology</div>
                  <div className="text-sm text-muted-foreground">Tshwane University of Technology · 2019 — 2021</div>
                </div>
                <div>
                  <div className="font-semibold">National Diploma in IT (Software Development)</div>
                  <div className="text-sm text-muted-foreground">Tshwane University of Technology · 2016 — 2019</div>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass rounded-3xl p-8 shadow-card h-full">
              <h3 className="text-2xl font-display font-bold">Certifications</h3>
              <div className="mt-6 space-y-3">
                {certs.map((c) => (
                  <div key={c} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                    <div className="h-9 w-9 rounded-lg bg-aurora flex items-center justify-center text-primary-foreground font-bold">M</div>
                    <span className="font-medium">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl glass p-12 text-center shadow-elegant">
            <div className="absolute inset-0 bg-aurora opacity-20" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-display font-bold">Let's build something brilliant.</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Open to graduate programmes, junior data / cloud / AI engineering roles, and exciting collaborations.</p>
              <Link to="/contact" className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full bg-aurora text-primary-foreground font-semibold shadow-glow hover:scale-105 transition-transform">
                Reach out <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
