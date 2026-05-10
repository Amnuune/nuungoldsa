import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/risk-disclaimer")({
  head: () => ({
    meta: [
      { title: "Risk Disclaimer — Nuun Bots" },
      { name: "description", content: "Important risk disclosure for trading FX, CFDs and other leveraged products." },
    ],
  }),
  component: () => (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-4xl mb-6">Risk Disclaimer</h1>
      <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
        <p><strong className="text-foreground">Trading involves substantial risk.</strong> Trading foreign exchange, CFDs, futures, cryptocurrencies and other leveraged products carries a high level of risk and may not be suitable for all investors.</p>
        <p>Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment, and you should not invest money that you cannot afford to lose.</p>
        <p>Past performance of any trading system, expert advisor, signal, or strategy is not necessarily indicative of future results. Hypothetical and simulated results have inherent limitations.</p>
        <p>Nuun Bots provides software, signals, and educational content only. We are not a licensed financial advisor, broker, or money manager. Nothing on this website constitutes investment advice. You are solely responsible for any trading decisions you make.</p>
        <p>Seek advice from an independent financial advisor if you have any doubts.</p>
      </div>
    </article>
  ),
});
