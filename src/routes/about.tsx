import { createFileRoute } from "@tanstack/react-router";
import { Target, Users, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Nuun Bots" },
      { name: "description", content: "Nuun Bots builds premium trading software, signals, and education for serious traders." },
      { property: "og:title", content: "About — Nuun Bots" },
      { property: "og:description", content: "Nuun Bots builds premium trading software, signals, and education for serious traders." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-4xl">About <span className="text-gradient-gold">Nuun Bots</span></h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        Nuun Bots is a trading-tech studio building premium expert advisors, signals, and courses
        for traders who treat the markets like a business — not a casino.
      </p>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Every product we ship is built and tested on our own live accounts first. If we wouldn't
        run it on our own capital, we wouldn't sell it.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          { icon: Target, title: "Risk first", desc: "Capital preservation comes before everything else." },
          { icon: TrendingUp, title: "Edge over noise", desc: "Strategies with statistical edge — not curve fits." },
          { icon: Users, title: "Trader to trader", desc: "Built by traders, for traders. No fluff." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl border border-border bg-card/60 p-6">
            <Icon className="text-primary" size={26} />
            <h3 className="mt-4 font-display text-lg">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
