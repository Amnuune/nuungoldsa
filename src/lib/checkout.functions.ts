import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CheckoutSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().min(1).max(120),
  customerEmail: z.string().email().max(200),
});

export const createCheckoutOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => CheckoutSchema.parse(input))
  .handler(async ({ data }) => {
    // Look up product
    const { data: product, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, name, price_usd, active")
      .eq("id", data.productId)
      .maybeSingle();

    if (pErr || !product || !product.active) {
      return { ok: false as const, error: "Product not available" };
    }

    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
        product_id: product.id,
        customer_name: data.customerName,
        customer_email: data.customerEmail.toLowerCase(),
        amount: product.price_usd,
        currency: "USD",
        status: "pending",
      })
      .select("id")
      .single();

    if (oErr || !order) {
      console.error("create order error", oErr);
      return { ok: false as const, error: "Could not create order" };
    }

    return { ok: true as const, orderId: order.id };
  });
