# Recommended headless production architecture

Audit date: August 27, 2026  
Decision status: recommended target with a gated wholesale lane; no implementation has started.

## Architecture decision

Use Next.js on Vercel for the public retail storefront, Shopify's Storefront API for public commerce data and retail carts, Shopify-hosted customer accounts for identity/account management, and Shopify Checkout for all payment/order completion.

Shopify remains the system of record. There must be no parallel Supabase customer, product, price, inventory, cart, discount, or order database.

Wholesale is a separate gated buyer journey until Wholesale Gorilla confirms a supported headless contract. The preferred low-risk outcome is to route approved wholesale buyers to Wholesale Gorilla's existing hosted portal while retaining Shopify customer accounts and Shopify as the underlying commerce system. A custom Next.js wholesale cart is prohibited until vendor evidence proves price, eligibility, validation, and checkout parity.

## Ownership diagram

```text
                           NORTHWESTERN.GOLF
                                  │
                                  ▼
                         Next.js on Vercel
                                  │
          ┌───────────────────────┼────────────────────────┐
          │                       │                        │
     Public content          Retail commerce        Storefront events
  pages/metaobjects/static   catalog/search/cart    view/cart actions
          │                       │                        │
          └───────────────┬───────┴──────────────┬─────────┘
                          │                      │
                          ▼                      ▼
              Shopify Storefront API     GA4/Ads/Meta/confirmed
                          │               marketing integrations
                          │               (upper funnel only)
                          ▼
                       SHOPIFY
          ┌───────────────┼───────────────────────────────┐
          │               │               │               │
      Products &       Customers &     Discounts &      Inventory
      collections       customer tags   Functions
          │               │               │               │
          └───────────────┴───────┬───────┴───────────────┘
                                  │
                  ┌───────────────┴────────────────┐
                  │                                │
                  ▼                                ▼
        Shopify-hosted accounts            Storefront Cart API
        passwordless login/orders          retail cart/checkoutUrl
                  │                                │
                  │                                ▼
                  │                         Shopify Checkout
                  │                   discounts/shipping/payment
                  │                                │
                  └──────────────────────┬─────────┘
                                         ▼
                                   Shopify Orders
                                         │
                                         ▼
                            purchase analytics/pixels
                            (Shopify authoritative)
```

### Integration positions

```text
Retail Next.js PDP/cart
   ├── AlphaLogic-managed Shopify price/compare-at price (read through Shopify)
   ├── AlphaLogic bar/savings/regular-price attribute (explicit Next.js parity work)
   ├── GOVX CTA ──► auth.govx.com verification ──► single-use Shopify code
   ├── Okendo supported headless reviews surface
   └── checkoutUrl ──► Shopify Checkout applies code/discounts and creates order

Shopify customer account
   └── Wholesale tag / Wholesale Gorilla price-list assignment
          └── Preferred until proven otherwise:
              Wholesale Gorilla hosted portal
                 catalog/pricing/quick order/cart/order path
                 └── Shopify customer/product/inventory/order backend
```

Wholesale Gorilla sits beside the Next.js retail presentation layer, attached to Shopify customers/tags, its own price-list engine, and its hosted wholesale buyer surface. It must not be placed inside the standard retail Storefront API path until the vendor proves that its customer prices and restrictions are returned and enforced there.

GOVX sits at the storefront/checkout boundary: Next.js launches GOVX-hosted verification; GOVX creates the single-use Shopify code; Shopify Checkout validates it. Next.js never stores GOVX eligibility or creates a price adjustment.

AlphaLogic spans two layers: its price-reduction campaign manages Shopify variant price/compare-at fields, while its announcement and savings display currently live in the theme. Any AlphaLogic automatic/coupon discounts remain in Shopify Discounts/Checkout after their configuration is confirmed.

## System ownership

| Capability | Owner | Next.js responsibility | Explicitly out of scope for Next.js |
| --- | --- | --- | --- |
| Products, variants, options, SKU | Shopify | Read/render current data | Duplicating catalog truth |
| Inventory and availability | Shopify | Read availability; refresh after mutations | Local stock ledger or oversell policy |
| Standard and sale price | Shopify ProductVariant; AlphaLogic may manage values | Render `price` and `compareAtPrice` for selected variant | Recalculating or scheduling the 30% campaign |
| Wholesale price/eligibility | Wholesale Gorilla + Shopify customer/tag | Route only through approved vendor contract/portal | Reimplementing rules from tags or copying price lists |
| Collections | Shopify | Render routes, filtering, and merchandising | Local collection database |
| Search | Shopify native Search/Search & Discovery | Search UI and request orchestration | Independent search provider unless later approved |
| Public content | Shopify Page/Blog/Article, approved metafields/metaobjects, limited Next.js static content | Render typed sections and preserved routes | Reading arbitrary theme JSON at runtime |
| Retail cart | Shopify Storefront Cart API | Cart UI, mutations, persistence, recovery, estimated totals | Authoritative price/discount/tax calculation |
| Wholesale cart | Wholesale Gorilla supported surface/contract | Link/handoff only until compatibility is proven | Retail-cart approximation |
| Customer identity/accounts | Shopify-hosted customer accounts | Account/login redirects and return paths | Supabase/parallel identity, password storage |
| Customer tags/B2B status | Shopify/Wholesale Gorilla | No public exposure; consume only through supported contract | Client-side authorization decisions |
| GOVX eligibility | GOVX | Display approved CTA and popup/full-page launch | Storing verification tokens/profile or issuing codes |
| Discount codes/automatic discounts | Shopify Discounts/Functions/apps | Optional code input to Cart API if approved; display returned allocations | Local discount calculation |
| Shipping, tax, payment | Shopify Checkout | Redirect via `checkoutUrl` | Rates, tax engine, payment forms, wallet emulation |
| Checkout extensions | Shopify/apps | None beyond compatible cart attributes/metafields | Rebuilding hosted checkout extensions in Next.js |
| Orders | Shopify | Link to hosted account/order status as needed | Order database/system of record |
| Reviews | Okendo | Supported headless widget/metafield/API rendering | Scraping theme widget HTML |
| Analytics before checkout | Next.js with consent | Exactly-once upper-funnel event publishing | Purchase inference |
| Checkout/purchase analytics | Shopify Customer Events/apps | Pass attribution/consent identifiers through supported handoff | Firing `purchase` |

## Customer architecture

### Selected option: Shopify-hosted customer accounts

Use the current new customer accounts and passwordless Shopify authentication. The account icon in Next.js should enter Shopify's supported account/login route and return to an allow-listed storefront URL when supported.

This choice preserves:

- Shopify as the customer system of record;
- order history and address management on a Shopify-hosted surface;
- passwordless email-code login;
- Shopify account/checkout continuity; and
- Wholesale Gorilla's documented association with Shopify customer accounts and tags.

Do not build a custom Customer Account API interface in the first release. It would add OAuth/PKCE, protected customer data approval, token storage, error recovery, and an additional surface that must still cooperate with Wholesale Gorilla. Revisit only after the hosted-account and wholesale-portal flows are proven inadequate.

### Authentication is not wholesale authorization

Next.js must not assume that a logged-in customer is wholesale or expose wholesale behavior based only on a client-readable tag. Authentication answers who the customer is; Wholesale Gorilla remains responsible for which price list, catalog, limits, tax treatment, payment terms, and order path apply.

## Retail request/data flow

1. Next.js resolves the canonical route and queries Storefront API with market/language context.
2. Product and collection pages render Shopify product, variant, image, availability, and current money fields.
3. Next.js reads only approved content metafields/metaobjects and renders a finite set of reusable sections.
4. A retail cart is created/updated through Storefront Cart API. The complete opaque cart ID, including its secret key, is stored securely and never logged or exposed in shareable URLs.
5. Cart UI displays Shopify-returned estimated cost and discount allocations. It never promises the checkout total.
6. “Checkout” navigates to the cart's Shopify `checkoutUrl` as a full-page transition.
7. Shopify authenticates the buyer as supported, revalidates price/inventory/discounts, collects shipping/payment, and creates the order.
8. Shopify customer events/apps fire checkout and purchase events. Next.js does not fire `purchase`.

## Wholesale request/data flow

The production flow must be selected after vendor testing:

### Preferred low-risk flow

```text
Next.js wholesale/login link
        ↓
Shopify-hosted customer login
        ↓
Wholesale Gorilla hosted portal
        ↓
WSG validates customer price-list/tag
        ↓
WSG catalog / Quick Order Form / cart
        ↓
WSG-approved Shopify order/checkout path
```

This preserves the vendor's price and order engine instead of recreating it. Branding and domain continuity may differ from the retail storefront and must be tested, but that is safer than serving incorrect wholesale commerce.

### Allowed alternative

A Next.js wholesale experience is allowed only if Wholesale Gorilla supplies a supported, documented contract that covers:

- customer authentication and price-list identity;
- product/collection eligibility and exclusions;
- exact variant price and quantity rules;
- inventory/backorder behavior;
- cart validation and minimums;
- discounts and code combinations;
- shipping/tax/payment terms;
- checkout/order/draft-order creation;
- logout/session expiry;
- webhook/cache invalidation; and
- vendor support/SLA for the integration.

Until then, the public retail Storefront API cart is not an acceptable wholesale fallback.

## GOVX flow

1. Next.js renders the vendor-approved full GOVX verification URL.
2. The CTA opens GOVX in an accessible popup or full-page fallback. GOVX owns its cookie/session and verification UI.
3. Approved users receive a `GX`-prefixed, store-specific, single-use Shopify code.
4. The shopper enters the code in Shopify Checkout. A Next.js cart code field is optional only if end-to-end testing proves a GOVX code can be safely applied through `cartDiscountCodesUpdate` without changing issuance/redemption behavior.
5. Shopify is authoritative for acceptance, combination, discount allocation, and the order.

The existing simple link is preferred over a new OAuth integration. Use GOVX's server-side explicit OAuth only if the vendor requires a whitelisted callback for the headless domain or the business explicitly needs verification data in Next.js.

## AlphaLogic flow

1. AlphaLogic continues to schedule/edit Shopify variant `price` and `compare-at price` in Admin.
2. Storefront API returns the resulting values; Next.js derives displayed sale state from the selected variant.
3. Next.js renders an approved campaign bar from a supported/configured source. It must not hardcode `30%` independently of the active campaign.
4. If “Regular price” in checkout remains required, Next.js adds the exact line attribute expected by AlphaLogic after vendor/Admin confirmation.
5. Shopify applies any confirmed AlphaLogic automatic/coupon discounts and blocking rules in cart/checkout. Next.js renders only the allocations/errors returned by Shopify.

## Content architecture

Use three durable sources:

```text
Shopify resources
  Product / Variant / Collection / Page / Blog / Article / Menu / Policy

Shopify structured extensions
  Product/collection/page/shop metafields
  Reusable content metaobjects

Next.js version-controlled static configuration
  Design tokens, component variants, icon geometry, stable UI labels
```

The exact mapping is in `theme-content-migration.md`. Theme JSON is an input to a one-time migration, not a runtime CMS. App configuration remains in the app unless a supported export/contract says otherwise.

## Analytics architecture

```text
Next.js storefront                         Shopify-hosted checkout
-----------------                         ------------------------
page_view                                 begin_checkout
view_item_list                            add_shipping_info
view_item                                 add_payment_info
search                                    purchase
add_to_cart                                      │
remove_from_cart                                 └─ authoritative order event
view_cart
```

Rules:

- One consent manager and one documented consent state must span the storefront/checkout handoff.
- Next.js publishes upper-funnel events once, after successful navigation/action.
- Shopify Checkout publishes lower-funnel and purchase events once.
- Google, Meta, and confirmed marketing providers receive only their assigned side of the boundary.
- If Meta browser/CAPI or another provider receives two transports for one Shopify event, share a stable `event_id` and verify deduplication.
- Do not install the old theme pixel loader in Next.js.
- Do not infer purchase from a thank-you URL, cart deletion, or checkout redirect.

## Domain and routing boundaries

Preserve public route shapes and canonical URLs described in `seo-migration.md`. The domain plan should eventually provide:

- `northwestern.golf` → Next.js public storefront;
- a Shopify-hosted checkout domain under an approved first-party subdomain where Shopify configuration allows;
- Shopify-hosted customer-account routes/domain with allow-listed callbacks; and
- a clearly linked Wholesale Gorilla hosted portal/domain if the preferred wholesale architecture is selected.

No DNS changes are authorized by this audit. Exact checkout/account/portal hostnames are a later configuration decision after staging validation.

## Security and privacy boundaries

- Storefront public token exposure is acceptable only for Storefront API scopes intended for public clients; Admin/app secrets stay server-side.
- Never expose Storefront Cart secret keys in analytics, logs, URLs, error reports, or client-readable shared state.
- Customer Account API secrets/tokens are unnecessary in the selected hosted-account architecture.
- GOVX OAuth secrets are unnecessary if the custom link flow is retained. If explicit OAuth is later approved, keep secrets and access tokens server-side and validate `state`.
- Do not expose Shopify customer tags as authorization claims in client HTML.
- Consent must be evaluated before marketing/analytics events and passed through the Shopify checkout handoff using supported fields/cookies.

## Required architecture gates

| Gate | Pass condition | Blocks |
| --- | --- | --- |
| Wholesale | Written vendor contract or verified hosted-portal flow; tagged-account test passes through order creation | Wholesale UI, price, cart, account integration, commerce launch |
| Discounts | AlphaLogic/Shopify/GOVX/Wholesale configuration exported; signed combination matrix passes | Cart totals, promo UI, commerce launch |
| Customer/account | Hosted login, logout, account, checkout identity, and wholesale handoff tested | Account navigation and wholesale launch |
| Checkout | Extensions, Functions, shipping/payment customizations, and post-purchase apps inventoried and staging-tested | Checkout cutover |
| Analytics | Pixel owners identified; consent/event spec approved; exactly-once debugger tests pass including one purchase | Production launch |
| Theme content | Theme/metaobject/metafield export reconciled to `theme-content-migration.md` | Content-complete launch |

## Fallbacks

- If Wholesale Gorilla's hosted portal works but direct headless integration does not, run headless retail plus hosted wholesale.
- If neither works, pause wholesale migration. Evaluate Shopify B2B or a different wholesale platform as a separate approved project; do not silently change the wholesale system in this build.
- If AlphaLogic's storefront widgets lack a supported headless contract, keep AlphaLogic as the Shopify price campaign manager and reproduce only business-approved presentation from Shopify money fields/static campaign configuration.
- If GOVX's existing link is not approved for the new domain, use its documented explicit OAuth only with GOVX coordination; Shopify still owns the resulting discount/order.
- If an analytics provider cannot support the event boundary, keep purchase in Shopify and accept a temporary upper-funnel gap rather than duplicate revenue.

