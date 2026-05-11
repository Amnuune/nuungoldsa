import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

export const Route = createFileRoute("/checkout/cancel")({
  head: () => ({
    meta: [
      { title: "Payment cancelled — Nuun Golds" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <XCircle className="mx-auto text-muted-foreground" size={56} />
      <h1 className="mt-6 font-display text-4xl">Payment cancelled</h1>
      <p className="mt-4 text-muted-foreground">No charge was made. You can try again anytime.</p>
      <Link to="/" className="mt-8 inline-flex rounded-md bg-gradient-gold px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-gold">
        Back to home
      </Link>
    </section>
  ),
});
