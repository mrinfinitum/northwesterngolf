# Phase 3B — Controlled Retail Cart Activation & Verification

Date: August 28, 2026

## Outcome

**NOT READY FOR PREVIEW**

Controlled activation was stopped before the first Shopify mutation because the local `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is missing. This is the required fail-closed outcome. No Shopify cart was created, no checkout was opened, no order was placed, and no production setting was changed.

The local cart cookie secret was generated and stored only in the ignored `.env.local` file. `SHOPIFY_CART_ENABLED` remains `false` locally, and `.env.example` continues to default to `false`.

## Environment

| Variable | Status |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | PRESENT |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | MISSING |
| `SHOPIFY_CART_COOKIE_SECRET` | PRESENT |

No secret values were printed or included in this report.

## Real Shopify Verification

| Test | Result | Notes |
| --- | --- | --- |
| Cart Creation | NOT TESTED — BLOCKED | No mutation was sent because the Storefront token is missing. |
| Persistence | NOT TESTED — BLOCKED | Requires a real Shopify cart. |
| Multiple Products | NOT TESTED — BLOCKED | Requires a real Shopify cart. |
| Variants | NOT TESTED — BLOCKED | Existing PDP variant selection remains available, but variant-to-cart behavior was not activated. |
| Quantity Updates | NOT TESTED — BLOCKED | Requires a real Shopify cart. |
| Remove | NOT TESTED — BLOCKED | Requires a real Shopify cart. |
| Empty Cart | NOT TESTED — BLOCKED | The disabled empty state renders, but the post-removal Shopify state was not verified. |
| Checkout Handoff | NOT TESTED | No checkout URL was requested. |
| Pricing Consistency | NOT TESTED — BLOCKED | PDP/cart/checkout comparison requires authenticated cart access. |

Checkout hostname: **NOT OBSERVED**

No conclusions about real Northwestern Golf cart creation, merging behavior, warning behavior, cart persistence, prices, totals, or checkout merchandise can be made until valid local Storefront API credentials are supplied.

## Security Review

### Cart ID exposure

- The raw full Shopify cart GID remains server-side.
- The browser-facing cart DTO does not contain the cart ID.
- The cart ID is persisted as an AES-256-GCM authenticated ciphertext in the `nwg_cart` cookie.
- A production-rendered HTML scan of representative routes found no `gid://shopify/Cart/` value and no cart `?key=` token.
- Product and variant GIDs are intentionally permitted and are not Shopify cart secrets.

### Cookie configuration

- `HttpOnly`: enabled.
- `Secure`: enabled when `NODE_ENV=production`.
- `SameSite`: `Lax`, intentionally allowing ordinary top-level navigation while withholding the cookie from cross-site subrequests.
- Scope: `/`.
- Maximum age: 30 days.
- Integrity/tamper protection: AES-256-GCM authentication. Malformed or modified ciphertext returns `null` rather than throwing into the storefront.
- Runtime tamper/recovery behavior against a real Shopify cart remains **NOT TESTED — BLOCKED**.

### Credential boundary

- The Storefront token and cookie secret use server-only environment variables; neither is prefixed with `NEXT_PUBLIC_`.
- The shared Shopify client and cart session modules are explicitly marked `server-only`.
- Client components call constrained server actions rather than receiving arbitrary Storefront GraphQL access.
- Inputs are restricted to Shopify ProductVariant/CartLine GID types and conservative integer quantities from 1 through 99.
- User-facing failures do not return raw GraphQL or server errors.
- A production-rendered HTML scan found no recognizable Storefront credential.

### Checkout redirect boundary

Checkout handoff now rejects non-HTTPS destinations and hostnames other than the configured Shopify store domain or configured storefront domain. An unexpected destination produces a safe error and no redirect. The actual Shopify-returned checkout hostname remains unverified.

## Failure Handling Review

Source inspection confirms safe messages or recovery paths for:

- disabled retail commerce;
- invalid merchandise/line identifiers;
- invalid quantities;
- missing or expired carts;
- stale cart IDs during add, which fall back to a new cart only after Shopify lookup confirms the old cart is unavailable;
- cart lookup/mutation failures;
- empty carts;
- missing or unexpected checkout destinations; and
- unavailable Shopify operations without exposing raw server errors.

Runtime verification of these cases remains blocked by the missing Storefront token.

## Wholesale Boundary

- Anonymous Retail: **NOT VERIFIED** — activation blocked by missing credentials.
- Customer-Aware Retail: **NOT IMPLEMENTED**.
- Wholesale: **BLOCKED**.
- Wholesale Gorilla: **BLOCKED PENDING VENDOR/ADMIN VERIFICATION**.

The cart implementation does not fetch customer tags, attach a customer identity, recreate wholesale pricing, or claim wholesale compatibility.

## Visual QA

The required in-app browser runtime reported that no browser was available. No alternate screenshot tooling was used, so visual status is recorded honestly.

| Viewport | Status |
| --- | --- |
| 375px | NOT VERIFIED |
| 430px | NOT VERIFIED |
| 768px | NOT VERIFIED |
| 1024px | NOT VERIFIED |
| 1440px | NOT VERIFIED |

## Regression and Validation

With the cart gate disabled, the production server returned HTTP 200 for:

- `/`
- `/collections/drivers`
- `/products/men-s-thunderbird-driver`
- `/search`
- `/cart`
- `/pages/our-story`
- `/policies/privacy-policy`

Validation results:

- `npm run typecheck`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS
- Production-server route smoke test: PASS (fail-closed configuration)

## Issues Discovered

1. `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is missing locally. This is the blocking issue.
2. The real checkout hostname is unknown until Shopify returns a checkout URL.
3. Real cart creation, persistence, line merging, mutations, warnings, pricing, totals, tamper recovery, and checkout handoff remain unverified.
4. Browser-based responsive and interaction QA is unavailable in the current runtime.
5. `docs/build-phase-3-cart.md` was not present; `docs/cart-foundation.md` was used as the Phase 3 source of truth.

## Production Readiness

**NOT READY FOR PREVIEW**

This result reflects missing real-API verification, not a decision to enable production commerce. Repository and local behavior remain safely disabled.

## Exact Recommended Next Action

Provision a valid Northwestern Golf Storefront API access token in the ignored local `.env.local` file as `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Then rerun this Phase 3B test matrix, enabling `SHOPIFY_CART_ENABLED=true` locally only for the controlled test. Do not change Vercel production settings or Shopify configuration.
