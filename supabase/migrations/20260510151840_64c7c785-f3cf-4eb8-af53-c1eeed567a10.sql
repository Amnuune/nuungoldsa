
-- Enums
CREATE TYPE product_type AS ENUM ('bot', 'signal', 'course');
CREATE TYPE billing_cycle AS ENUM ('one_time', 'monthly', 'quarterly', 'lifetime');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cancelled');

-- Products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  type product_type NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL DEFAULT '',
  price_usd NUMERIC(10,2) NOT NULL,
  billing billing_cycle NOT NULL DEFAULT 'one_time',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  download_path TEXT,
  telegram_invite_url TEXT,
  course_access_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status order_status NOT NULL DEFAULT 'pending',
  payment_provider TEXT,
  provider_ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX orders_email_idx ON public.orders(customer_email);
CREATE INDEX orders_status_idx ON public.orders(status);

-- Email log
CREATE TABLE public.email_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin users (by email) — independent of auth so site has email-only delivery
CREATE TABLE public.admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT USING (active = true);

-- Orders & email_log: no public access (server-only via service role)
-- (no policies = denied for anon/authenticated; service role bypasses RLS)

-- admin_users: no public access

-- Storage bucket for product files (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('product-files', 'product-files', false)
ON CONFLICT (id) DO NOTHING;

-- Seed sample products
INSERT INTO public.products (slug, type, name, tagline, description, price_usd, billing, features, sort_order) VALUES
('nuun-scalper-pro', 'bot', 'Nuun Scalper Pro', 'High-frequency scalping EA for MT5', 'Battle-tested scalping expert advisor designed for low-spread brokers. Trades XAUUSD and major pairs with strict risk controls.', 299, 'one_time',
  '["MT5 compatible", "XAUUSD + EURUSD optimized", "Built-in risk manager", "Lifetime updates", "1 live + 2 demo accounts"]'::jsonb, 1),
('nuun-trend-master', 'bot', 'Nuun Trend Master', 'Smart trend-following EA', 'A medium-frequency EA that rides confirmed trends with adaptive trailing stops. Works on H1 and H4 timeframes.', 399, 'one_time',
  '["MT4 + MT5", "Adaptive trailing", "News filter", "Lifetime updates"]'::jsonb, 2),
('nuun-grid-x', 'bot', 'Nuun Grid X', 'Recovery grid system', 'Advanced grid trading EA with smart recovery and equity protection.', 249, 'one_time',
  '["Smart recovery", "Equity stop", "MT5 only"]'::jsonb, 3),
('signals-monthly', 'signal', 'VIP Signals — Monthly', 'Daily premium signals on Telegram', '5–10 hand-picked signals per day on FX, gold, and indices. Entries, SL, TP, and trade management included.', 79, 'monthly',
  '["5–10 signals daily", "FX, gold, indices", "Trade management included", "Telegram VIP channel"]'::jsonb, 1),
('signals-quarterly', 'signal', 'VIP Signals — Quarterly', '3 months of premium signals', 'Same VIP channel, billed every 3 months. Save 15%.', 199, 'quarterly',
  '["Everything in monthly", "Save 15%", "Priority support"]'::jsonb, 2),
('signals-lifetime', 'signal', 'VIP Signals — Lifetime', 'One-time, lifetime access', 'Pay once, get our VIP signal channel for life.', 999, 'lifetime',
  '["Lifetime VIP access", "All future signal sets", "Priority support"]'::jsonb, 3),
('course-foundations', 'course', 'Trading Foundations', 'From zero to your first funded account', '8-module video course covering price action, risk management, psychology, and prop firm challenges.', 149, 'one_time',
  '["8 modules · 12+ hours", "Lifetime access", "Private community", "Certificate of completion"]'::jsonb, 1),
('course-prop-firm', 'course', 'Prop Firm Mastery', 'Pass any prop firm challenge', 'Step-by-step playbook to pass FTMO, MyFundedFX, and similar challenges with consistency.', 249, 'one_time',
  '["Challenge-specific playbooks", "Risk templates", "Live trade reviews"]'::jsonb, 2);
