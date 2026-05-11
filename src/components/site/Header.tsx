import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/bots", label: "Bots" },
  { to: "/signals", label: "Signals" },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-gold text-primary-foreground font-display font-bold shadow-gold">
            N
          </span>
          <span className="font-display text-xl tracking-tight">
            Nuun <span className="text-gradient-gold">Golds</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/bots"
            className="inline-flex items-center rounded-md bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold hover:opacity-90 transition"
          >
            Shop now
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="flex flex-col px-4 py-3 gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/bots"
              className="mt-2 inline-flex items-center justify-center rounded-md bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold"
              onClick={() => setOpen(false)}
            >
              Shop now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
