# Northwestern Golf — Retail Cart Foundation

Date: August 28, 2026  
Status: **IMPLEMENTED IN CODE; DISABLED AND NOT SHOPIFY-MUTATION-VERIFIED**

## Outcome

The complete anonymous retail cart path is prepared:

```text
Product
  ↓
Select real Shopify variant
  ↓
Add to Cart server action
  ↓
Shopify Storefront Cart API
  ↓
Next.js Cart Drawer
  ↓
Update / Remove / Continue Shopping
  ↓
Encrypted HTTP-only persistent Shopify Cart ID
  ↓
/cart
  ↓
Fresh cart.checkoutUrl lookup
  ↓
Shopify-hosted Checkout
```

This code does not create, update, or remove a Shopify cart unless the server-only `SHOPIFY_CART_ENABLED` environment variable is explicitly set to `true`. Its default is `false`.

No Shopify mutation was executed during this preparation phase. No order or checkout was created, and no production system was changed.

## What is in place

### Storefront Cart API data layer

- Typed `Cart`, `CartLine`, cost, discount-application, action-result, and checkout-result DTOs.
- Shared cart fragment containing product/variant identity, selected options, image, quantity, line cost, cart cost, discount applications, total quantity, and `checkoutUrl`.
- `cart` query.
- `cartCreate` mutation.
- `cartLinesAdd` mutation.
- `cartLinesUpdate` mutation.
- `cartLinesRemove` mutation.
- All cart reads and mutations use `cache: "no-store"`.
- Shopify mutation `userErrors` are surfaced without exposing the cart ID.
- Shopify's non-blocking cart mutation warnings are requested and surfaced to the shopper.
- Expired/missing saved carts can be replaced with a new cart on the next valid Add to Cart operation.

### Server security and persistence

- Cart operations run in Next.js Server Actions. Storefront credentials remain server-side.
- The complete Shopify cart ID, including its secret key, is never returned in a client-safe cart DTO.
- The cart ID is encrypted with AES-256-GCM using `SHOPIFY_CART_COOKIE_SECRET`.
- The encrypted value is stored in an HTTP-only, same-site, high-priority cookie.
- The cookie is marked Secure in production and applies only to this storefront's `/` path.
- Cart IDs are treated as opaque strings; the code does not assume a fixed Shopify token format.
- Variant IDs, line IDs, and quantities are validated again on the server before mutations.
- The cart is limited to a UI quantity range of 1–99 per line.

### Storefront UI

- PDP Add to Cart uses the currently resolved real Shopify variant and selected quantity.
- Successful Add to Cart updates the shared cart count and opens the drawer.
- Failed actions produce an accessible error and never fake success.
- The header cart count restores the saved cart after navigation/reload when enabled.
- Cart drawer supports:
  - product image, title, selected options, line total;
  - increment/decrement;
  - remove;
  - subtotal and returned discount allocation display;
  - continue shopping;
  - full cart link;
  - Shopify checkout handoff.
- `/cart` supports the same update/remove operations plus an order-summary layout.
- Checkout requests the cart again at click time and then performs a full-page transition to Shopify's returned `checkoutUrl`.
- Shopify remains authoritative for inventory, availability, pricing, discounts, tax, shipping, payment, final total, order creation, and purchase confirmation.

## Environment variables

The placeholders are documented in `.env.example`:

```dotenv
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_CART_ENABLED=false
SHOPIFY_CART_COOKIE_SECRET=replace-with-at-least-32-random-characters
```

The current Storefront API supports tokenless Cart read/write, but this implementation still centralizes all requests on the server and accepts the configured Storefront token when one is supplied. A token may still be required for other protected storefront fields.

`SHOPIFY_CART_ENABLED=true` alone is insufficient. The store domain and a cookie secret of at least 32 characters must also exist or the UI remains disabled.

## Explicitly not implemented

- Wholesale Gorilla pricing, eligibility, catalog, cart, or order behavior.
- Shopify customer authentication or cart buyer identity.
- Customer-specific pricing.
- Native Shopify B2B company/location context.
- GOVX verification or code application.
- Discount-code entry in Next.js.
- AlphaLogic's `🏷️ Regular price` line attribute.
- Bundle, subscription, gift, selling-plan, or cart-note behavior.
- Shipping estimates, delivery addresses, tax estimates, payment methods, or wallet emulation.
- Cart/checkout analytics events or marketing pixels.
- `begin_checkout` or `purchase` event publication from Next.js.

These omissions are deliberate. This cart is an anonymous retail lane only.

## Activation checklist

Do not enable the cart in production until all applicable items are complete:

- [ ] Confirm the permanent `*.myshopify.com` Storefront API domain.
- [ ] Create/verify the approved Storefront access configuration and scopes if a token is used.
- [ ] Generate a unique secret of at least 32 random characters for `SHOPIFY_CART_COOKIE_SECRET` in the local/staging environment.
- [ ] Close or explicitly accept the Wholesale Gorilla separation gate: wholesale buyers must not fall through to the anonymous retail cart.
- [ ] Export and review active Shopify/AlphaLogic discounts and their combination rules.
- [ ] Confirm whether AlphaLogic's regular-price line attribute is still required at checkout.
- [ ] Confirm GOVX stays a Shopify-checkout code flow.
- [ ] Inventory enabled checkout Functions, validation rules, extensions, shipping/payment customizations, and accelerated checkout settings.
- [ ] Enable `SHOPIFY_CART_ENABLED=true` in a non-production environment only.
- [ ] Run the staging test matrix below without placing a real order.
- [ ] Complete consent and analytics event-boundary QA before enabling tracking.
- [ ] Obtain explicit production commerce approval before changing the production environment flag.

## Required connection test matrix

| Scenario | Required evidence |
| --- | --- |
| First add | `cartCreate` returns the selected merchandise, correct quantity, current Shopify price, availability, and a persistent cart. |
| Second product | `cartLinesAdd` preserves the existing line and adds the new real variant. |
| Same variant twice | Shopify returns the intended merged/separate line behavior and correct total quantity. |
| Quantity update | `cartLinesUpdate` returns the new quantity and recalculated Shopify costs. |
| Remove | `cartLinesRemove` returns the remaining cart and correct count. |
| Reload/navigation | Encrypted cookie restores the same Shopify cart without exposing its ID to client code or HTML. |
| Expired cart | UI recovers cleanly and the next add creates a fresh cart. |
| Sold-out/changed variant | Shopify error/availability response is shown; no success state is emitted. |
| Sale product | Cart price and compare-at-driven storefront presentation agree with current Shopify variant data. |
| Automatic discount | Returned allocations and Shopify checkout agree; unknown combinations remain unresolved. |
| Checkout handoff | Click obtains a fresh `checkoutUrl` and opens Shopify-hosted checkout with matching variants and quantities. Stop before order placement. |
| Retail versus wholesale | An approved tagged wholesale account cannot silently use this anonymous retail lane as a substitute for Wholesale Gorilla. |
| GOVX | Verification/code flow remains downstream and does not alter anonymous cart pricing without approved behavior. |
| Analytics | No duplicate `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, or `purchase`; Shopify remains purchase-authoritative. |

## Current connection status

The repository's existing catalog DAL is capable of reading public Shopify product and collection data when `SHOPIFY_STORE_DOMAIN` is configured. The newly prepared Cart API mutation path is separately disabled and has not been exercised against the live store.

Therefore:

- UI and TypeScript integration: ready.
- Persistent server session design: ready.
- Shopify cart GraphQL operations: implemented, not mutation-verified.
- Shopify-hosted checkout handoff: implemented, not redirect-verified.
- Production activation: **NOT AUTHORIZED**.

## Validation completed

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed with `/cart` correctly classified as a dynamic route.
- Local production route smoke tests:
  - `/cart` — HTTP 200 with the disconnected setup state.
  - `/products/men-s-thunderbird-driver` — HTTP 200 with a real Shopify variant flow and disabled cart activation state.
  - `/` — HTTP 200 with the disabled header cart marker and no Shopify Cart GID in rendered HTML.
  - `/collections/drivers` — HTTP 200 with real Shopify catalog data.
- Live Cart API mutations and checkout redirect — **NOT RUN**, intentionally.

## Shopify API references

- [Create and update a cart with the Storefront API](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage)
- [Storefront API 2026-07 `cart` query](https://shopify.dev/docs/api/storefront/2026-07/queries/cart)
- [Storefront API 2026-07 `cartLinesAdd` mutation](https://shopify.dev/docs/api/storefront/2026-07/mutations/cartlinesadd)
- [Storefront API 2026-07 `CartWarning`](https://shopify.dev/docs/api/storefront/2026-07/objects/CartWarning)
