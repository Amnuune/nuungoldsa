import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/site/ProductCard";
import { ArrowRight, Bot, Radio, GraduationCap, Shield, Zap, Mail } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nuun Golds — Premium Trading EAs, Signals & Courses" },
      { name: "description", content: "Battle-tested MT4/MT5 expert advisors, VIP Telegram signals, and trading courses. Instant email delivery." },
    ],
  }),
  component: Index,
});

function Index() {
  const fetchProducts = useServerFn(listProducts);
  const { data } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts({ data: {} }),
  });
  const featured = (data?.products ?? []).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-gold bg-card/50 px-3 py-1 text-xs uppercase tracking-widest text-primary">
              Premium trading suite
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Trade smarter with{" "}
              <span className="text-gradient-gold">Nuun Golds</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Battle-tested expert advisors, hand-picked VIP signals, and the courses that make
              them work — built for traders who treat the markets like a business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/bots"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold hover:opacity-90 transition"
              >
                Browse trading bots <ArrowRight size={16} />
              </Link>
              <Link
                to="/signals"
                className="inline-flex items-center rounded-md border border-gold px-6 py-3 text-sm font-medium text-primary hover:bg-card transition"
              >
                See VIP signals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Bot, title: "Trading Bots", desc: "MT4 / MT5 EAs with risk controls.", to: "/bots" as const },
            { icon: Radio, title: "VIP Signals", desc: "Daily premium signals on Telegram.", to: "/signals" as const },
            { icon: GraduationCap, title: "Courses", desc: "Master price action and prop firms.", to: "/courses" as const },
          ].map(({ icon: Icon, title, desc, to }) => (
            <Link
              key={title}
              to={to}
              className="group rounded-xl border border-border bg-card/60 p-6 transition hover:border-gold hover:shadow-gold"
            >
              <Icon className="text-primary" size={28} />
              <h3 className="mt-4 font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              <span className="mt-4 inline-flex items-center text-sm text-primary">
                Explore <ArrowRight className="ml-1 transition group-hover:translate-x-1" size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl">Featured products</h2>
            <p className="mt-2 text-sm text-muted-foreground">A taste of what's in the catalog.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">
        <h2 className="font-display text-3xl text-center">Why traders pick Nuun Golds</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Shield, title: "Risk-first design", desc: "Every EA ships with built-in equity protection and configurable risk caps." },
            { icon: Zap, title: "Instant delivery", desc: "Pay and get your download link, Telegram invite, or course access by email in seconds." },
            { icon: Mail, title: "Real support", desc: "Direct email and Telegram support from a team that actually trades." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card/60 p-6">
              <Icon className="text-primary" size={26} />
              <h3 className="mt-4 font-display text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">
        <div className="rounded-2xl border border-gold bg-card/60 p-10 text-center shadow-gold">
          <h2 className="font-display text-3xl">Ready to level up your trading?</h2>
          <p className="mt-3 text-muted-foreground">Browse the catalog and get started in minutes.</p>
          <Link
            to="/bots"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold"
          >
            Shop the catalog <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
