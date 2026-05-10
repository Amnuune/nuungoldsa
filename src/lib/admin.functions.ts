import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  setResponseHeaders,
  getRequestHeader,
} from "@tanstack/react-start/server";

const COOKIE_NAME = "nuun_admin";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function getCookie(name: string): string | null {
  const cookieHeader = getRequestHeader("cookie");
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((s) => s.trim());
  for (const p of parts) {
    const [k, ...v] = p.split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

function requireAdmin(): { ok: true } | { ok: false; error: string } {
  const pwd = getAdminPassword();
  if (!pwd) return { ok: false, error: "Admin password not configured" };
  const cookie = getCookie(COOKIE_NAME);
  if (cookie !== pwd) return { ok: false, error: "Unauthorized" };
  return { ok: true };
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().min(1) }).parse)
  .handler(async ({ data }) => {
    const pwd = getAdminPassword();
    if (!pwd) return { ok: false as const, error: "Admin password is not set up. Add the ADMIN_PASSWORD secret." };
    if (data.password !== pwd) return { ok: false as const, error: "Wrong password" };
    setResponseHeaders(
      new Headers({
        "Set-Cookie": `${COOKIE_NAME}=${encodeURIComponent(pwd)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
      }),
    );
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  setResponseHeaders(
    new Headers({
      "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    }),
  );
  return { ok: true };
});

export const adminCheckSession = createServerFn({ method: "GET" }).handler(async () => {
  const a = requireAdmin();
  return { authenticated: a.ok };
});

export const adminListOrders = createServerFn({ method: "GET" }).handler(async () => {
  const a = requireAdmin();
  if (!a.ok) return { ok: false as const, error: a.error, orders: [] };

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("id, customer_name, customer_email, amount, currency, status, payment_provider, provider_ref, created_at, products(name, type)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return { ok: false as const, error: error.message, orders: [] };
  return { ok: true as const, orders: data ?? [] };
});

export const adminMarkPaid = createServerFn({ method: "POST" })
  .inputValidator(z.object({ orderId: z.string().uuid() }).parse)
  .handler(async ({ data }) => {
    const a = requireAdmin();
    if (!a.ok) return { ok: false as const, error: a.error };
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: "paid", payment_provider: "manual" })
      .eq("id", data.orderId);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const adminListProducts = createServerFn({ method: "GET" }).handler(async () => {
  const a = requireAdmin();
  if (!a.ok) return { ok: false as const, error: a.error, products: [] };
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id, slug, type, name, price_usd, billing, active, sort_order")
    .order("sort_order", { ascending: true });
  if (error) return { ok: false as const, error: error.message, products: [] };
  return { ok: true as const, products: data ?? [] };
});

export const adminToggleProduct = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().uuid(), active: z.boolean() }).parse)
  .handler(async ({ data }) => {
    const a = requireAdmin();
    if (!a.ok) return { ok: false as const, error: a.error };
    const { error } = await supabaseAdmin.from("products").update({ active: data.active }).eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
