import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { Mail, Phone, Linkedin, MessageCircle, Send, MapPin, Calendar, Github } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nomaseko Mahlangu" },
      { name: "description", content: "Get in touch via email, phone, WhatsApp, LinkedIn or the contact form." },
    ],
  }),
  component: Contact,
});

const channels = [
  { icon: Mail, label: "Email", value: "nomasekomahlangu@gmail.com", href: "mailto:nomasekomahlangu@gmail.com?subject=Hello%20Nomaseko" },
  { icon: Phone, label: "Call", value: "+27 72 666 7449", href: "tel:+27726667449" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat instantly", href: "https://wa.me/27726667449?text=Hi%20Nomaseko%2C%20I%20saw%20your%20portfolio" },
  { icon: Linkedin, label: "LinkedIn", value: "Connect with me", href: "https://www.linkedin.com/in/nomaseko-mahlangu-0b4171178/" },
  { icon: Calendar, label: "Schedule a call", value: "Book a 20 min slot", href: "mailto:nomasekomahlangu@gmail.com?subject=Schedule%20a%20call" },
  { icon: Github, label: "GitHub", value: "View code", href: "https://github.com/" },
];

function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name");
    const email = data.get("email");
    const message = data.get("message");
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    window.location.href = `mailto:nomasekomahlangu@gmail.com?subject=Portfolio%20enquiry%20from%20${encodeURIComponent(String(name))}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Reveal>
        <div className="text-xs font-mono text-accent uppercase tracking-widest">Get in touch</div>
        <h1 className="mt-3 text-5xl md:text-6xl font-display font-bold tracking-tight">
          Let's start a <span className="text-gradient">conversation</span>.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">Pick the channel that suits you best — I respond quickly and warmly.</p>
      </Reveal>

      <div className="mt-12 grid lg:grid-cols-[1.1fr_1fr] gap-8">
        {/* Channels */}
        <div className="grid sm:grid-cols-2 gap-4 content-start">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.05}>
              <motion.a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                whileHover={{ y: -4 }}
                className="group relative block glass rounded-2xl p-6 shadow-card overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-aurora opacity-0 group-hover:opacity-30 blur-2xl transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-aurora shadow-glow flex items-center justify-center">
                    <c.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">{c.label}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{c.value}</div>
                  </div>
                </div>
              </motion.a>
            </Reveal>
          ))}
          <Reveal delay={0.4}>
            <div className="sm:col-span-2 glass rounded-2xl p-6 shadow-card flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold">Based in</div>
                <div className="text-sm text-muted-foreground">16 Chamomile Street, Riverside View Ext 30, Sandton, 2191 — South Africa 🇿🇦</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="glass rounded-3xl p-8 shadow-elegant relative overflow-hidden">
            <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-aurora opacity-30 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl font-display font-bold">Send a message</h2>
              <p className="text-sm text-muted-foreground mt-1">I'll get back to you within 24 hours.</p>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Your name</label>
                  <input required name="name" className="mt-1 w-full bg-background/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <input required type="email" name="email" className="mt-1 w-full bg-background/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Message</label>
                  <textarea required name="message" rows={5} className="mt-1 w-full bg-background/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Tell me about the role or project..." />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-aurora text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition-transform">
                  {sent ? "Opening your email..." : <>Send message <Send className="h-4 w-4" /></>}
                </button>
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
