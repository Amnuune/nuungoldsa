import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products.functions";

const billingLabel: Record<string, string> = {
  one_time: "one-time",
  monthly: "/ month",
  quarterly: "/ 3 months",
  lifetime: "lifetime",
};

const typePathMap: Record<string, "/bots/$slug" | "/courses/$slug" | "/signals"> = {
  bot: "/bots/$slug",
  course: "/courses/$slug",
  signal: "/signals",
};

export function ProductCard({ product }: { product: Product }) {
  const to = typePathMap[product.type];
  const isParam = to !== "/signals";

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition hover:border-gold hover:shadow-gold">
      <div className="absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition" style={{ background: "var(--gradient-gold-soft)", filter: "blur(40px)", opacity: 0 }} />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">
          {product.type === "bot" ? "Trading EA" : product.type === "signal" ? "Signals" : "Course"}
        </span>
        <span className="text-xs text-muted-foreground">
          {billingLabel[product.billing] ?? ""}
        </span>
      </div>

      <h3 className="font-display text-xl mb-1">{product.name}</h3>
      {product.tagline && (
        <p className="text-sm text-muted-foreground mb-4">{product.tagline}</p>
      )}

      <ul className="space-y-1.5 text-sm text-muted-foreground mb-6 flex-1">
        {(product.features ?? []).slice(0, 4).map((f, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-end justify-between">
        <div>
          <div className="font-display text-2xl text-gradient-gold">
            ${Number(product.price_usd).toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">
            {billingLabel[product.billing]}
          </div>
        </div>
        {isParam ? (
          <Link
            to={to}
            params={{ slug: product.slug }}
            className="inline-flex items-center rounded-md border border-gold bg-transparent px-4 py-2 text-sm font-medium text-primary hover:bg-gradient-gold hover:text-primary-foreground transition"
          >
            View
          </Link>
        ) : (
          <Link
            to="/checkout/$productId"
            params={{ productId: product.id }}
            className="inline-flex items-center rounded-md bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold hover:opacity-90 transition"
          >
            Buy
          </Link>
        )}
      </div>
    </div>
  );
}
