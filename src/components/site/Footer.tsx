import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-gold text-primary-foreground font-display font-bold">
                N
              </span>
              <span className="font-display text-lg">
                Nuun <span className="text-gradient-gold">Golds</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Premium trading EAs, signals and courses for serious traders.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/bots" className="hover:text-primary">Trading Bots</Link></li>
              <li><Link to="/signals" className="hover:text-primary">Signals</Link></li>
              <li><Link to="/courses" className="hover:text-primary">Courses</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/legal/terms" className="hover:text-primary">Terms</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-primary">Privacy</Link></li>
              <li><Link to="/legal/risk-disclaimer" className="hover:text-primary">Risk Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="gold-divider my-8" />

        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Risk Warning:</strong> Trading foreign exchange, CFDs, and other leveraged
          products carries a high level of risk and may not be suitable for all investors. Past performance is not
          indicative of future results. You may lose all of your invested capital. Nuun Golds provides educational tools
          and software only — we are not a licensed financial advisor.
        </p>

        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nuun Golds. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
