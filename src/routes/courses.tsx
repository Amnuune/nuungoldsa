import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Trading Courses — Nuun Golds" },
      { name: "description", content: "Step-by-step trading courses: price action, risk management, and prop firm playbooks." },
      { property: "og:title", content: "Trading Courses — Nuun Golds" },
      { property: "og:description", content: "Step-by-step trading courses: price action, risk management, and prop firm playbooks." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const fetchProducts = useServerFn(listProducts);
  const { data, isLoading } = useQuery({
    queryKey: ["products", "course"],
    queryFn: () => fetchProducts({ data: { type: "course" } }),
  });

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl"><span className="text-gradient-gold">Courses</span></h1>
        <p className="mt-3 text-muted-foreground">From price action fundamentals to prop firm mastery.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-72 rounded-xl border border-border bg-card/40 animate-pulse" />)
          : (data?.products ?? []).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
