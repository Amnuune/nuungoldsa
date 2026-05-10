import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: z.object({ order: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Order received — Nuun Bots" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const search = Route.useSearch();
  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <CheckCircle2 className="mx-auto text-primary" size={56} />
      <h1 className="mt-6 font-display text-4xl">Order <span className="text-gradient-gold">received</span></h1>
      <p className="mt-4 text-muted-foreground">
        Thanks for your purchase! Once payment is confirmed, your delivery email will arrive within
        a few minutes. Please check your spam folder if you don't see it.
      </p>
      {search.order && (
        <p className="mt-2 text-xs text-muted-foreground">Order reference: <span className="text-foreground font-mono">{search.order}</span></p>
      )}
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="rounded-md border border-border px-5 py-2.5 text-sm">Back to home</Link>
        <Link to="/contact" className="rounded-md bg-gradient-gold px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-gold">Need help?</Link>
      </div>
    </section>
  );
}
