import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Nuun Golds" },
      { name: "description", content: "Terms of Service for Nuun Golds." },
    ],
  }),
  component: () => (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose prose-invert">
      <h1 className="font-display text-4xl mb-6">Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
        <p>By purchasing or using any product or service from Nuun Golds ("we", "us", "our") via nuunbots.com, you agree to these terms.</p>
        <h2 className="font-display text-xl text-foreground mt-8">1. Products</h2>
        <p>We sell digital trading software (expert advisors), trading signals, and educational courses. All products are for personal use unless otherwise agreed.</p>
        <h2 className="font-display text-xl text-foreground mt-8">2. License</h2>
        <p>Each EA license is granted for a limited number of accounts as described on the product page. Reselling, sharing, or reverse-engineering is prohibited.</p>
        <h2 className="font-display text-xl text-foreground mt-8">3. Refunds</h2>
        <p>All sales of digital products are final. We do not offer refunds once delivery has been made.</p>
        <h2 className="font-display text-xl text-foreground mt-8">4. No financial advice</h2>
        <p>Nothing on this site constitutes financial, investment, or trading advice. You are solely responsible for your trading decisions.</p>
        <h2 className="font-display text-xl text-foreground mt-8">5. Liability</h2>
        <p>To the maximum extent permitted by law, Nuun Golds is not liable for any losses, damages, or claims arising from the use of our products.</p>
        <h2 className="font-display text-xl text-foreground mt-8">6. Contact</h2>
        <p>Questions about these terms? Email support@nuunbots.com.</p>
      </div>
    </article>
  ),
});
