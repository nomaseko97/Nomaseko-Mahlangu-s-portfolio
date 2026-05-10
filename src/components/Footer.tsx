import { Link } from "@tanstack/react-router";
import { Mail, Phone, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-2xl font-display font-bold text-gradient">Nomaseko Mahlangu</h3>
          <p className="text-sm text-muted-foreground mt-2">IT Graduate · Data · Cloud · AI</p>
        </div>
        <div className="text-sm space-y-2">
          <a href="tel:+27726667449" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Phone className="h-4 w-4" />072 666 7449</a>
          <a href="mailto:nomasekomahlangu@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Mail className="h-4 w-4" />nomasekomahlangu@gmail.com</a>
          <a href="https://www.linkedin.com/in/nomaseko-mahlangu-0b4171178/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Linkedin className="h-4 w-4" />LinkedIn</a>
        </div>
        <div className="text-sm space-y-2">
          <Link to="/projects" className="block text-muted-foreground hover:text-foreground">Projects</Link>
          <Link to="/visualreads" className="block text-muted-foreground hover:text-foreground">VisualReads AI</Link>
          <a href="https://github.com/nomaseko97" target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-foreground">GitHub</a>
          <Link to="/contact" className="block text-muted-foreground hover:text-foreground">Get in touch</Link>
        </div>
      </div>
      <div className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nomaseko Brilliant Mahlangu. Crafted with care.
      </div>
    </footer>
  );
}
