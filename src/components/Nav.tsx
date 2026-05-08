import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/studio", label: "AI Studio" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-4 py-4"
    >
      <div className="mx-auto max-w-6xl glass rounded-full px-5 py-3 flex items-center justify-between shadow-card">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-aurora shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display font-bold tracking-tight">Nomaseko</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors relative"
              activeProps={{ className: "text-foreground bg-secondary/60" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/contact"
          className="text-sm font-medium px-4 py-2 rounded-full bg-aurora text-primary-foreground shadow-glow hover:scale-105 transition-transform"
        >
          Hire me
        </Link>
      </div>
    </motion.header>
  );
}
