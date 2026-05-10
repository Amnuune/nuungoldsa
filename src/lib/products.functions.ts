import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type Product = {
  id: string;
  slug: string;
  type: "bot" | "signal" | "course";
  name: string;
  tagline: string | null;
  description: string;
  price_usd: number;
  billing: "one_time" | "monthly" | "quarterly" | "lifetime";
  features: string[];
  image_url: string | null;
  active: boolean;
  sort_order: number;
};

function row(r: any): Product {
  return {
    ...r,
    features: Array.isArray(r.features) ? r.features : [],
    price_usd: Number(r.price_usd),
  };
}

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((data: { type?: "bot" | "signal" | "course" }) => data ?? {})
  .handler(async ({ data }) => {
    let query = supabaseAdmin
      .from("products")
      .select("id, slug, type, name, tagline, description, price_usd, billing, features, image_url, active, sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (data?.type) query = query.eq("type", data.type);

    const { data: rows, error } = await query;
    if (error) {
      console.error("listProducts error", error);
      return { products: [] as Product[] };
    }
    return { products: (rows ?? []).map(row) };
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { data: r, error } = await supabaseAdmin
      .from("products")
      .select("id, slug, type, name, tagline, description, price_usd, billing, features, image_url, active, sort_order")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) {
      console.error("getProductBySlug error", error);
      return { product: null as Product | null };
    }
    return { product: r ? row(r) : null };
  });

export const getProductById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { data: r, error } = await supabaseAdmin
      .from("products")
      .select("id, slug, type, name, tagline, description, price_usd, billing, features, image_url, active, sort_order")
      .eq("id", data.id)
      .eq("active", true)
      .maybeSingle();
    if (error) {
      console.error("getProductById error", error);
      return { product: null as Product | null };
    }
    return { product: r ? row(r) : null };
  });
