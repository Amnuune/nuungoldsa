import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Generic payment webhook adapter.
 *
 * To wire in a real provider (NOWPayments, CCBill, CoinPayments, Coinbase Commerce, etc.):
 * 1. Set `PAYMENT_WEBHOOK_SECRET` in your project secrets (use the provider's webhook secret).
 * 2. Replace `verifyAndParse()` below with the provider's signature scheme.
 * 3. Map the provider's event payload to { orderId, status, providerRef, provider }.
 *
 * Until then this endpoint accepts a simple shared-secret POST so you can also
 * trigger delivery manually for off-platform sales.
 */

type WebhookPayload = {
  orderId: string;
  status: "paid" | "failed" | "refunded";
  providerRef?: string;
  provider?: string;
};

async function verifyAndParse(request: Request): Promise<WebhookPayload | null> {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) {
    console.error("PAYMENT_WEBHOOK_SECRET not configured");
    return null;
  }
  const headerSecret = request.headers.get("x-webhook-secret");
  if (headerSecret !== secret) return null;

  try {
    const body = (await request.json()) as Partial<WebhookPayload>;
    if (!body.orderId || !body.status) return null;
    return {
      orderId: body.orderId,
      status: body.status,
      providerRef: body.providerRef,
      provider: body.provider ?? "manual",
    };
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = await verifyAndParse(request);
        if (!payload) return new Response("Unauthorized", { status: 401 });

        const { data: order, error: getErr } = await supabaseAdmin
          .from("orders")
          .select("id, status, customer_email, customer_name, products(name, type, telegram_invite_url, course_access_url, download_path)")
          .eq("id", payload.orderId)
          .maybeSingle();

        if (getErr || !order) return new Response("Order not found", { status: 404 });
        if (order.status === "paid") return new Response("Already processed", { status: 200 });

        const { error: upErr } = await supabaseAdmin
          .from("orders")
          .update({
            status: payload.status,
            payment_provider: payload.provider,
            provider_ref: payload.providerRef,
          })
          .eq("id", payload.orderId);

        if (upErr) {
          console.error("update order failed", upErr);
          return new Response("Server error", { status: 500 });
        }

        if (payload.status === "paid") {
          // TODO: send delivery email via Lovable Emails once email domain is configured.
          // For now, log it so the admin can deliver manually if needed.
          await supabaseAdmin.from("email_log").insert({
            order_id: payload.orderId,
            to_email: order.customer_email,
            type: "delivery_pending",
            status: "queued",
          });
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
