import { createFileRoute } from "@tanstack/react-router";

const faqs = [
  { q: "How do I receive my purchase?", a: "Right after payment, you'll get an email with your download link (for bots and courses) or your VIP Telegram invite (for signals). Typically within 1–2 minutes." },
  { q: "Which brokers do the bots support?", a: "Our EAs work on any MT4 or MT5 broker. We recommend low-spread ECN brokers for scalping EAs." },
  { q: "Do bots work on a VPS?", a: "Yes, and we strongly recommend it. A low-latency VPS keeps your EA running 24/7 with stable execution." },
  { q: "Is there a refund policy?", a: "Because all products are digital and delivered instantly, all sales are final. We provide free demo support and pre-sale Q&A so you can buy with confidence." },
  { q: "Do signals work in any timezone?", a: "Yes. Signals are posted with UTC timestamps and trade levels — you can act on them from anywhere." },
  { q: "Will you provide setup help?", a: "Yes. Every purchase includes a setup guide and email/Telegram support to help you get up and running." },
  { q: "What payment methods are accepted?", a: "We accept secure online payments. The available methods will appear at checkout." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Nuun Golds" },
      { name: "description", content: "Answers to common questions about Nuun Golds EAs, signals, courses, and delivery." },
      { property: "og:title", content: "FAQ — Nuun Golds" },
      { property: "og:description", content: "Answers to common questions about Nuun Golds." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-4xl">Frequently asked <span className="text-gradient-gold">questions</span></h1>
      <div className="mt-10 space-y-4">
        {faqs.map((f) => (
          <details key={f.q} className="rounded-xl border border-border bg-card/60 p-5 group">
            <summary className="cursor-pointer list-none font-medium flex justify-between items-center">
              {f.q}
              <span className="text-primary transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
