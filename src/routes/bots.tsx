import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/bots")({
  head: () => ({
    meta: [
      { title: "Trading Bots — Nuun Bots" },
      { name: "description", content: "Premium MT4 and MT5 expert advisors with built-in risk management." },
      { property: "og:title", content: "Trading Bots — Nuun Bots" },
      { property: "og:description", content: "Premium MT4 and MT5 expert advisors with built-in risk management." },
    ],
  }),
  component: BotsPage,
});

function BotsPage() {
  const fetchProducts = useServerFn(listProducts);
  const { data, isLoading } = useQuery({
    queryKey: ["products", "bot"],
    queryFn: () => fetchProducts({ data: { type: "bot" } }),
  });

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl">Trading <span className="text-gradient-gold">Bots</span></h1>
        <p className="mt-3 text-muted-foreground">
          MT4 / MT5 expert advisors. Built with strict risk controls and battle-tested on live accounts.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-72 rounded-xl border border-border bg-card/40 animate-pulse" />)
          : (data?.products ?? []).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
