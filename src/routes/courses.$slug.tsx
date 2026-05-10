import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/lib/products.functions";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/courses/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Nuun Bots` },
      { name: "description", content: `${params.slug} — trading course from Nuun Bots.` },
    ],
  }),
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const fetchProduct = useServerFn(getProductBySlug);
  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct({ data: { slug } }),
  });

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-16"><div className="h-96 rounded-xl bg-card/40 animate-pulse" /></div>;
  const product = data?.product;
  if (!product) throw notFound();

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft size={14} /> Back to courses
      </Link>
      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">Course</span>
          <h1 className="mt-2 font-display text-4xl">{product.name}</h1>
          {product.tagline && <p className="mt-3 text-lg text-muted-foreground">{product.tagline}</p>}
          <div className="gold-divider my-8" />
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
          <h2 className="font-display text-xl mt-10 mb-3">What you'll get</h2>
          <ul className="space-y-2 text-muted-foreground">
            {(product.features ?? []).map((f, i) => (
              <li key={i} className="flex gap-2"><span className="text-primary">✓</span>{f}</li>
            ))}
          </ul>
        </div>
        <aside className="lg:sticky lg:top-24 self-start rounded-xl border border-gold bg-card p-6 shadow-gold h-fit">
          <div className="text-sm text-muted-foreground">Lifetime access</div>
          <div className="mt-1 font-display text-4xl text-gradient-gold">${Number(product.price_usd).toFixed(0)}</div>
          <Link
            to="/checkout/$productId"
            params={{ productId: product.id }}
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-gradient-gold px-4 py-3 text-sm font-medium text-primary-foreground shadow-gold"
          >
            Enroll now
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">Access link delivered by email after payment.</p>
        </aside>
      </div>
    </section>
  );
}
