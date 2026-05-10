import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getProductById } from "@/lib/products.functions";
import { createCheckoutOrder } from "@/lib/checkout.functions";
import { ArrowLeft, Lock } from "lucide-react";

export const Route = createFileRoute("/checkout/$productId")({
  head: () => ({
    meta: [
      { title: "Checkout — Nuun Bots" },
      { name: "description", content: "Secure checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const fetchProduct = useServerFn(getProductById);
  const submitOrder = useServerFn(createCheckoutOrder);

  const { data, isLoading } = useQuery({
    queryKey: ["checkout-product", productId],
    queryFn: () => fetchProduct({ data: { id: productId } }),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-16"><div className="h-96 rounded-xl bg-card/40 animate-pulse" /></div>;
  const product = data?.product;
  if (!product) throw notFound();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) { setError("Please agree to the terms and risk disclaimer."); return; }
    setError(null);
    setSubmitting(true);
    try {
      const res = await submitOrder({ data: { productId, customerName: name, customerEmail: email } });
      if (!res.ok) {
        setError(res.error);
        setSubmitting(false);
        return;
      }
      navigate({ to: "/checkout/success", search: { order: res.orderId } });
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft size={14} /> Continue shopping
      </Link>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className="space-y-5">
          <h1 className="font-display text-3xl">Checkout</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details. After payment, your access link will be sent to this email.
          </p>

          <div>
            <label className="text-sm font-medium">Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-input/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-input/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
            <p className="mt-1 text-xs text-muted-foreground">Your product will be delivered to this email.</p>
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1" />
            <span className="text-muted-foreground">
              I agree to the <Link to="/legal/terms" className="text-primary hover:underline">Terms</Link>,{" "}
              <Link to="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and{" "}
              <Link to="/legal/risk-disclaimer" className="text-primary hover:underline">Risk Disclaimer</Link>.
              I understand all sales are final.
            </span>
          </label>

          {error && <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold disabled:opacity-60"
          >
            <Lock size={14} /> {submitting ? "Processing…" : `Pay $${Number(product.price_usd).toFixed(0)}`}
          </button>

          <p className="text-xs text-muted-foreground">
            You'll be redirected to our secure payment processor to complete the purchase.
          </p>
        </form>

        <aside className="rounded-xl border border-border bg-card/60 p-6 h-fit">
          <h2 className="font-display text-lg">Order summary</h2>
          <div className="mt-4 flex items-start justify-between border-b border-border/60 pb-4">
            <div>
              <div className="font-medium">{product.name}</div>
              {product.tagline && <div className="text-xs text-muted-foreground mt-1">{product.tagline}</div>}
            </div>
            <div className="font-medium">${Number(product.price_usd).toFixed(2)}</div>
          </div>
          <div className="mt-4 flex justify-between font-display text-lg">
            <span>Total</span>
            <span className="text-gradient-gold">${Number(product.price_usd).toFixed(2)} USD</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
