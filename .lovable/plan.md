
# Nuun Bots — Build Plan

A premium dark + gold marketing & storefront site for **nuunbots.com** selling trading EAs, signals subscriptions, and courses. Buyers pay, get an automatic email with their download / signal channel link / course access link. No login required.

---

## 1. Important note on payments (please read)

You asked for **2D-only (no 3D Secure) and high-risk merchant friendly**. Lovable's built-in payment providers (Stripe and Paddle) **cannot** be used for that — they enforce 3DS in most regions and don't onboard high-risk trading product merchants.

So we will build the site **gateway-agnostic** with a clean checkout layer you (or I, later) can wire into any provider you choose. Good options for your case:

- **NOWPayments / CoinPayments / Coinbase Commerce** — crypto, no 3DS, no merchant approval issues (recommended easiest path)
- **PayKings, DirectPayNet, CCBill, Segpay, Easy Pay Direct** — true high-risk credit card processors that support 2D / non-3DS MOTO/recurring (require manual onboarding outside Lovable)
- **Manual / bank transfer / Telegram** — show a "Contact to purchase" flow

The site will be ready to accept any of these — once you pick one, plugging in the API key + webhook is a small follow-up task.

---

## 2. Brand & design

- **Style:** Premium dark gold — deep black background (`#0a0a0a` / near-black), warm gold accents (`#d4af37` / champagne gold), serif display headings (Playfair Display or similar), clean sans body (Inter).
- Subtle gold gradient buttons, soft glow on hover, faint candlestick / chart line motifs as background decoration.
- Fully responsive (mobile first), dark mode only.
- Design tokens defined in `src/styles.css` using `oklch` (background, foreground, primary=gold, gold-glow, muted, border, gradients, shadows). All components consume tokens — no hardcoded colors.

---

## 3. Site structure (routes)

Each is a real route file under `src/routes/` with its own SEO metadata.

| Route | Purpose |
|---|---|
| `/` | Hero, value prop, featured products, social proof, CTA |
| `/bots` | Catalog of trading EAs / bots |
| `/bots/$slug` | Single bot detail + buy button |
| `/signals` | Signal subscription plans (monthly / quarterly / lifetime) |
| `/courses` | Catalog of courses |
| `/courses/$slug` | Course detail + buy button |
| `/about` | Story, mission, team, why Nuun Bots |
| `/faq` | Common questions (delivery, refunds, supported brokers, risk) |
| `/contact` | Contact form + Telegram / email |
| `/checkout/$productId` | Email-capture checkout, choose payment method, redirect to gateway |
| `/checkout/success` | "Check your email" confirmation page |
| `/checkout/cancel` | Payment cancelled / try again |
| `/legal/terms`, `/legal/privacy`, `/legal/risk-disclaimer` | Required legal pages for trading products |

Shared **Header** (logo, nav, CTA) and **Footer** (links, socials, disclaimer) on all pages.

---

## 4. Backend (Lovable Cloud)

Enable Lovable Cloud for:

- **Database tables**
  - `products` — id, slug, type (`bot` | `signal` | `course`), name, description, price_usd, billing (`one_time` | `monthly` | `quarterly` | `lifetime`), features (jsonb), image_url, download_url (private), telegram_invite_url (private), course_access_url (private), active
  - `orders` — id, product_id, customer_email, customer_name, amount, currency, status (`pending` | `paid` | `failed` | `refunded`), payment_provider, provider_ref, created_at
  - `email_log` — id, order_id, type, sent_at, status
- **RLS:** products readable by anyone (only `active=true`), orders/email_log writable only by service role.
- **Storage bucket** `product-files` (private) for `.ex5` / `.zip` / course materials. Server signs short-lived download URLs in the delivery email.
- **Lovable Emails** for transactional delivery (order confirmation + download/access link). Will trigger the email-domain setup dialog so emails come from `@nuunbots.com`.

---

## 5. Checkout & delivery flow

1. Buyer clicks **Buy** on a product → goes to `/checkout/$productId`.
2. Enters name + email, agrees to terms + risk disclaimer.
3. Server function creates a `pending` order, then redirects to the configured payment gateway (initially a placeholder "Pay" screen until you pick a provider).
4. Gateway redirects buyer back to `/checkout/success` and sends a webhook to `/api/public/payments/webhook`.
5. Webhook verifies signature → marks order `paid` → triggers Lovable Email with:
   - **Bot:** signed download link (24h) + license info
   - **Signals:** Telegram invite link + access duration note
   - **Course:** access link / private page link
6. `/checkout/success` tells the buyer to check their inbox.

The webhook handler will be written as a clean adapter so swapping NOWPayments → CCBill etc. is a single file change.

---

## 6. Admin (lightweight, for you)

A protected `/admin` route (single password stored as a secret, simple session cookie) where you can:

- See orders + status
- Manually mark an order as paid (for bank transfers / Telegram sales)
- Resend the delivery email
- Add / edit / disable products

Keeps things simple — no full auth system since buyers don't have accounts.

---

## 7. SEO & legal

- Per-route `<title>`, meta description, og:title/description, og:image
- JSON-LD `Product` schema on bot/course pages
- Canonical tags, sitemap-ready route structure
- Risk disclaimer footer on every page (required for trading products)
- Terms / Privacy / Refund policy pages (template content you can edit)

---

## 8. Build order

1. Enable Lovable Cloud + set up email domain for `nuunbots.com`
2. Design system (tokens, fonts, base components) + Header / Footer
3. Home page + About + FAQ + Contact + legal pages
4. Database tables + seed a few example products
5. Catalog + detail pages for bots, signals, courses
6. Checkout flow + order creation + success/cancel pages
7. Webhook adapter + email delivery (placeholder gateway until you pick one)
8. Admin panel
9. SEO polish + responsive QA
10. Publish to `nuunbots.com` (custom domain — Cloudflare DNS instructions provided when ready)

---

## What I need from you to start building

Just confirm this plan and I'll begin with steps 1–3. Two small things you can decide later (won't block me starting):

- Which payment gateway you want to wire in first (NOWPayments is easiest)
- Your initial product list (names, prices, descriptions) — I'll seed placeholders you can edit anytime
