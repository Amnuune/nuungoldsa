import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { listProducts } from "@/lib/products.functions";

export const Route = createFileRoute("/signals")({
  head: () => ({
    meta: [
      { title: "VIP Signals — Nuun Bots" },
      { name: "description", content: "Premium daily trading signals delivered on Telegram. Choose monthly, quarterly, or lifetime access." },
      { property: "og:title", content: "VIP Signals — Nuun Bots" },
      { property: "og:description", content: "Premium daily trading signals delivered on Telegram." },
    ],
  }),
  component: SignalsPage,
});

const planMeta: Record<string, { tag: string; highlight?: boolean }> = {
  one_time: { tag: "" },
  monthly: { tag: "/ month" },
  quarterly: { tag: "/ 3 months", highlight: true },
  lifetime: { tag: "lifetime" },
};

function SignalsPage() {
  const fetchProducts = useServerFn(listProducts);
  const { data, isLoading } = useQuery({
    queryKey: ["products", "signal"],
    queryFn: () => fetchProducts({ data: { type: "signal" } }),
  });

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl">VIP <span className="text-gradient-gold">Signals</span></h1>
        <p className="mt-3 text-muted-foreground">
          5–10 hand-picked daily setups on FX, gold and indices. Entries, SL, TP, and trade management — sent to your phone.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-80 rounded-xl border border-border bg-card/40 animate-pulse" />)
          : (data?.products ?? []).map((p) => {
            const meta = planMeta[p.billing] ?? { tag: "" };
            return (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-xl border p-8 ${meta.highlight ? "border-gold shadow-gold bg-card" : "border-border bg-card/60"}`}
              >
                {meta.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-gold px-3 py-1 text-[10px] uppercase tracking-widest text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.tagline}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-gradient-gold">${Number(p.price_usd).toFixed(0)}</span>
                  <span className="text-sm text-muted-foreground">{meta.tag}</span>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground flex-1">
                  {(p.features ?? []).map((f, i) => (
                    <li key={i} className="flex gap-2"><span className="text-primary">✓</span>{f}</li>
                  ))}
                </ul>
                <Link
                  to="/checkout/$productId"
                  params={{ productId: p.id }}
                  className={`mt-8 inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium transition ${meta.highlight ? "bg-gradient-gold text-primary-foreground shadow-gold" : "border border-gold text-primary hover:bg-gradient-gold hover:text-primary-foreground"}`}
                >
                  Get access
                </Link>
              </div>
            );
          })}
      </div>
    </section>
  );
}
