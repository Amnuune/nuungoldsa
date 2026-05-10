import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Nuun Bots" },
      { name: "description", content: "How Nuun Bots collects, uses, and protects your data." },
    ],
  }),
  component: () => (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-4xl mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
        <p>This Privacy Policy explains how Nuun Bots collects and uses information when you use nuunbots.com.</p>
        <h2 className="font-display text-xl text-foreground mt-8">Information we collect</h2>
        <p>We collect your name and email address when you place an order, plus payment-related details handled by our payment processor. We do not store full card numbers.</p>
        <h2 className="font-display text-xl text-foreground mt-8">How we use it</h2>
        <p>To process orders, deliver products, send transactional and support emails, and improve our services.</p>
        <h2 className="font-display text-xl text-foreground mt-8">Data sharing</h2>
        <p>We do not sell your personal data. We share data only with service providers strictly necessary to operate the site (payments, email delivery, hosting).</p>
        <h2 className="font-display text-xl text-foreground mt-8">Your rights</h2>
        <p>You may request access, correction, or deletion of your data by emailing support@nuunbots.com.</p>
        <h2 className="font-display text-xl text-foreground mt-8">Cookies</h2>
        <p>We use minimal cookies required for site functionality and basic analytics.</p>
      </div>
    </article>
  ),
});
