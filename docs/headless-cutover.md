# Northwestern Golf — Headless Cutover Runbook

Date: October 29, 2026
Status: **CUT OVER — November 4, 2026** (northwestern.golf is served by Vercel)

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

1. ~~**Storefront API token**~~ — done November 4, 2026. Token and cart env
   vars are in Vercel Production, and the cart test steps pass on
   `northwesterngolf.vercel.app` (see `docs/build-phase-3b-cart-verification.md`).
   `dev.northwestern.golf` was verified for this project on November 4 by
   replacing another Vercel account's `_vercel` TXT record. Expect the apex
   and `www` to need their own `_vercel` TXT verification at step 3.
2. ~~**Wholesale Gorilla**~~ — not in use (decided November 4, 2026). Its
   `/pages/ws-*` pages stay `noindex` on the headless site; the app and those
   pages can be removed from Shopify whenever convenient.
3. **Contact form** posts to the Online Store `/contact` endpoint; keep the
   Online Store channel enabled (it also hosts checkout and Shopify Email).

## Cutover order

Do these in order; each step is reversible until step 4.

1. ✅ **Checkout domain** (done November 4, 2026: CNAME added, connected in Shopify, TLS issued). In Cloudflare add `CNAME checkout →
   shops.myshopify.com` (DNS only). In Shopify Admin → Settings → Domains,
   connect `checkout.northwestern.golf` and wait for its SSL certificate.
2. ✅ **Customer accounts domain** (done November 4, 2026: `account.northwestern.golf` is the primary customer accounts domain and `next.config.ts` redirects there). Add `CNAME account →
   shops.myshopify.com` (DNS only) and set it as the customer accounts domain
   in Shopify. If added, point the `/account` redirect in `next.config.ts` at
   `https://account.northwestern.golf` instead of
   `https://shopify.com/72808693923/account`.
3. ✅ **Vercel domains** (done November 4, 2026: `northwestern.golf` on Production, `www` as a 308 redirect to the apex; no TXT verification was needed. Vercel wants `CNAME @ → f685364ff4673557.vercel-dns-017.com` and `CNAME www → f685364ff4673557.vercel-dns-017.com`, both DNS only, for step 5). Add `northwestern.golf` and `www.northwestern.golf` to
   the Vercel project (as `dev.northwestern.golf` already is). Vercel shows
   the exact DNS values to use; don't change DNS yet.
4. ✅ **Switch Shopify's primary domain** (done November 4, 2026; the live theme now 301s the apex and `www` to `checkout.northwestern.golf`, and headless checkout still hands off to Shopify). to `checkout.northwestern.golf`
   (Settings → Domains → Change primary). Cart `checkoutUrl`s then use that
   host; `src/app/cart/actions.ts` already allows any `*.northwestern.golf`
   host plus `r1kikk-am.myshopify.com`.
5. ✅ **Repoint the apex and www** (done November 4, 2026: `@` and `www` are DNS-only CNAMEs to `f685364ff4673557.vercel-dns-017.com`. Vercel certificates took about 7 minutes. `www` was removed from Shopify. The apex was **kept** in Shopify, because `checkout`/`account` are listed under it and Shopify Email depends on the root domain, and it receives no traffic now). in Cloudflare to the Vercel values from
   step 3 (DNS only). Remove `northwestern.golf` and `www` from Shopify's
   domain list afterwards so Shopify stops redirecting them.
6. ✅ **Production env:** not needed. `SITE_URL` already defaults to `https://northwestern.golf` in `src/lib/shopify/index.ts`. set `SITE_URL=https://northwestern.golf` in Vercel.

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

Restore the apex `A 23.227.38.65` (it is now a CNAME to Vercel; switch the type back) and `www CNAME shops.myshopify.com`, and
set `northwestern.golf` back as Shopify's primary domain.

## Post-cutover results (November 4, 2026)

- `https://northwestern.golf` → `server: Vercel`; `www` 308 → apex (path kept).
- All 47 sitemap URLs return 200; an unknown product handle returns 404.
- `/account` → `https://account.northwestern.golf/`.
- Add to cart → checkout on `northwestern.golf` reaches Shopify checkout (Shop Pay).
- MX (ppe-hosted), SPF and DMARC are unchanged.
- Still to do: submit `https://northwestern.golf/sitemap.xml` in Search Console; send a test email; delete the "ZZ Headless Cart Test" product.
