# Northwestern Golf — Headless Cutover Runbook

Date: October 29, 2026
Status: **PREPARED — NOT EXECUTED**

## Current state

- DNS for `northwestern.golf` is on Cloudflare (`mario.ns.cloudflare.com`,
  `nelci.ns.cloudflare.com`). All 36 former GoDaddy records were copied and
  verified against the authoritative nameservers; every record is DNS only.
- `northwestern.golf` (A `23.227.38.65`) and `www` (CNAME
  `shops.myshopify.com`) still serve the Shopify Impact theme.
- `dev.northwestern.golf` (CNAME to Vercel) serves this Next.js storefront.
  Every URL in the live sitemap returns the same status there; `/account*`
  and `/customer_authentication/*` redirect to Shopify customer accounts.

## Blocking prerequisites

1. **Storefront API token** from Shopify's Headless channel, stored in Vercel
   as `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (server-only). Then run the Phase 3B
   cart matrix (`docs/build-phase-3b-cart-verification.md`) on
   `dev.northwestern.golf` with `SHOPIFY_CART_ENABLED=true` and a 32+
   character `SHOPIFY_CART_COOKIE_SECRET`, and `SHOPIFY_STORE_DOMAIN` set.
2. **Wholesale Gorilla** decision: its `/pages/ws-*` UI only runs inside the
   Shopify theme. Either keep wholesale on a Shopify-hosted subdomain or
   accept that it stops working at cutover.
3. **Contact form** posts to the Online Store `/contact` endpoint; keep the
   Online Store channel enabled (it also hosts checkout and Shopify Email).

## Cutover order

Do these in order; each step is reversible until step 4.

1. **Checkout domain.** In Cloudflare add `CNAME checkout →
   shops.myshopify.com` (DNS only). In Shopify Admin → Settings → Domains,
   connect `checkout.northwestern.golf` and wait for its SSL certificate.
2. **Customer accounts domain** (optional, recommended). Add `CNAME account →
   shops.myshopify.com` (DNS only) and set it as the customer accounts domain
   in Shopify. If added, point the `/account` redirect in `next.config.ts` at
   `https://account.northwestern.golf` instead of
   `https://shopify.com/72808693923/account`.
3. **Vercel domains.** Add `northwestern.golf` and `www.northwestern.golf` to
   the Vercel project (as `dev.northwestern.golf` already is). Vercel shows
   the exact DNS values to use; don't change DNS yet.
4. **Switch Shopify's primary domain** to `checkout.northwestern.golf`
   (Settings → Domains → Change primary). Cart `checkoutUrl`s then use that
   host; `src/app/cart/actions.ts` already allows any `*.northwestern.golf`
   host plus `r1kikk-am.myshopify.com`.
5. **Repoint the apex and www** in Cloudflare to the Vercel values from
   step 3 (DNS only). Remove `northwestern.golf` and `www` from Shopify's
   domain list afterwards so Shopify stops redirecting them.
6. **Production env:** set `SITE_URL=https://northwestern.golf` in Vercel.

## Verification

Check from outside the local network (its router intercepts DNS); digwebinterface.com
can query `mario.ns.cloudflare.com` directly.

- `https://northwestern.golf` and `www` serve the Vercel build (header
  `server: Vercel`); `www` redirects to the apex.
- Every URL in the old sitemap returns 200, unknown handles return 404.
- Add to cart → `/cart` → checkout lands on `checkout.northwestern.golf`
  with the same prices and variants.
- `/account` reaches Shopify customer login.
- MX, SPF, DMARC, DKIM (Shopify Email `dcn`/`dcn2`, Mandrill, SMTP2GO,
  Mailgun) are unchanged; send a test email.
- Search Console: submit `https://northwestern.golf/sitemap.xml`.

## Rollback

Restore the apex `A 23.227.38.65` and `www CNAME shops.myshopify.com`, and
set `northwestern.golf` back as Shopify's primary domain.
