import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nuun Bots" },
      { name: "description", content: "Get in touch with the Nuun Bots team. We answer fast." },
      { property: "og:title", content: "Contact — Nuun Bots" },
      { property: "og:description", content: "Get in touch with the Nuun Bots team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-4xl">Get in <span className="text-gradient-gold">touch</span></h1>
      <p className="mt-3 text-muted-foreground">
        Pre-sale questions, custom EA work, partnership opportunities — we read every message.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <a
          href="mailto:support@nuunbots.com"
          className="rounded-xl border border-border bg-card/60 p-6 hover:border-gold transition"
        >
          <Mail className="text-primary" size={26} />
          <h3 className="mt-4 font-display text-lg">Email</h3>
          <p className="mt-1 text-sm text-muted-foreground">support@nuunbots.com</p>
        </a>
        <a
          href="https://t.me/nuunbots"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-border bg-card/60 p-6 hover:border-gold transition"
        >
          <MessageCircle className="text-primary" size={26} />
          <h3 className="mt-4 font-display text-lg">Telegram</h3>
          <p className="mt-1 text-sm text-muted-foreground">@nuunbots</p>
        </a>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        We typically reply within a few hours during business days.
      </p>
    </section>
  );
}
