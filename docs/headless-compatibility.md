# Headless compatibility audit

Audit date: August 27, 2026  
Storefront: [northwestern.golf](https://northwestern.golf/)  
Scope: read-only public storefront evidence, existing `/docs` audit, and first-party vendor/Shopify documentation.

## Executive finding

The retail catalog, standard cart, and Shopify-hosted checkout are compatible with a Next.js/Vercel storefront. The whole commerce configuration is **not yet cleared for implementation** because Wholesale Gorilla's customer-specific price calculation and order path have no publicly documented headless contract and currently depend on Liquid-injected customer/app data.

The safe interpretation is:

- Shopify must remain authoritative for products, variants, sale price, compare-at price, inventory, customer identity, discounts, checkout, and orders.
- Next.js can own public browsing, content, search, the retail cart UI, and approved storefront integrations.
- Shopify-hosted customer accounts and Shopify Checkout should be retained.
- Wholesale must use either a Wholesale Gorilla-supported headless contract or its hosted wholesale portal. It must not be approximated in Next.js.
- GOVX verification can likely be linked from Next.js while GOVX and Shopify continue to issue and validate the code.
- AlphaLogic's current sale prices survive because the app changes Shopify variant price fields; its banner, cart-savings UI, and “regular price” line attribute need explicit storefront work.

## Evidence and limitations

Public evidence was captured from the homepage, a representative [product page](https://northwestern.golf/products/men-s-thunderbird-driver), [cart](https://northwestern.golf/cart), account redirects, JSON/product endpoints, and the JavaScript/app configuration emitted by the live theme. First-party sources are linked throughout.

The audit did not use a wholesale-tagged customer, a completed GOVX verification, a paid checkout, Shopify Admin, or app dashboards. Anything dependent on those surfaces is labeled **SHOPIFY ADMIN INVESTIGATION REQUIRED**. Public JavaScript configuration is evidence of current anonymous behavior, not proof of every logged-in/customer-specific branch.

## 1. Wholesale Gorilla

### Observed storefront role

Wholesale Gorilla is installed as a theme-integrated runtime. The Liquid response serializes a large `wsgData` object and customer/product variables, then loads `https://www.wholesalegorilla.app/shop_assets/wsg-index.js?v=6`. Its script searches theme DOM structures for prices, product cards, cart subtotal, and checkout controls. That is direct theme dependency, not a Storefront API contract.

First-party Wholesale Gorilla material confirms its general model: wholesale buyers use Shopify customer accounts, are assigned to price lists, and price lists are associated with Shopify customer tags. Its documentation also describes the quick-order portal, product/variant pricing rules, catalog exclusions, order limits, net terms, and wholesale shipping features. See [Getting Wholesale Orders](https://wholesalegorilla.com/getting-wholesale-orders/), [features](https://wholesalegorilla.com/features/), and the [changelog](https://wholesalegorilla.com/changelog/).

### Current public configuration

| Area | Publicly observed value | Interpretation |
| --- | --- | --- |
| Install mode | `installStatus: "hosted"` | A hosted Wholesale Gorilla surface exists/configures branding, catalog, cart, account, and quick-order pages. Its exact domain, routing, and cart handoff are not exposed anonymously. |
| Plan/tier | `tier: "essential"` | Current runtime reports Essential. Do not infer entitlements only from the public marketing plan table. |
| Wholesale identification | `activeTags: ["Wholesale"]` | The exact active customer tag exposed to the runtime is `Wholesale`. |
| Anonymous customer | `isWsgCustomer=false`; no customer tags/ID/rates | Wholesale pricing and eligible catalog cannot be audited without an approved tagged account. |
| Retail price visibility | `loginToViewPrices=false` | Anonymous users can see retail prices. Wholesale pricing is expected only after eligible login. |
| Price lists/rates | Anonymous `wsgCustomerRates={}` | Actual wholesale rules are private and remain unknown. |
| Product exclusions | `exclusions=[]`, `lockedPages=[]`, sample driver restriction false | No anonymous evidence of wholesale-only/retail-only products or locked content in current global config. Customer-specific exclusions remain untested. |
| Minimum order | `minOrder=-1` | Global Wholesale Gorilla minimum order is publicly configured as disabled. |
| Quantity limits | Empty cart/collection/product quantity configuration | No public current quantity minimum/multiple/maximum rules. |
| Volume/quantity breaks | `volume_discounts.enabled=false`; no rules | Wholesale Gorilla's volume discounts are publicly disabled. |
| Inventory/backorder | `checkInventory=true`, `autoBackorder=false`, `showShipPartial=false` | App is configured to respect inventory and not auto-backorder. Logged-in messages/edge cases remain untested. |
| Net terms | `net_orders.enabled=false`; no tag/template | App net checkout is publicly disabled. |
| Wholesale shipping | `shippingEnabled=false`, `useShopifyDefault=true`; custom/free/flat rates unset | Current top-level custom wholesale shipping is disabled and Shopify defaults are selected. A nested local-delivery flag exists but is not evidence of an active wholesale rule while shipping is off. |
| PO/cart terms | PO hidden/not required; cart note not required; terms disabled | No public active wholesale cart form requirements. |
| Registration | Pending/approval messaging exists; `autoInvite=false`, `autoTags=[]`, tax-exempt default true | Signup/approval workflow exists conceptually, but its live route, fields, approval policy, and tax handling require Admin inspection. |
| Quick order | Configured title “Quick Order Form”; inventory/SKU shown; `linkInCart=true` | Likely available to eligible wholesale buyers. Anonymous visibility and destination could not be tested. |
| Drafts | `draftNotification=true`, `hideDrafts=[]` | This does **not** prove that draft orders are used for current checkout. |

### Authentication and pricing sequence

The lowest-risk, evidence-based sequence is:

```text
Shopify customer account login (passwordless email code)
        ↓
Shopify customer identified
        ↓
Wholesale Gorilla reads Shopify customer tag / price-list assignment
        ↓
Wholesale Gorilla exposes wholesale catalog and price behavior
        ↓
Wholesale-specific cart/order route (exact current implementation unknown)
```

Retail prices appear before login because `loginToViewPrices` is false. Whether the correct wholesale price can be returned through Storefront API product/cart queries is **not publicly demonstrated**. A customer tag being known to Next.js is not itself a pricing algorithm and must not be used to reimplement vendor price rules.

### What breaks when Liquid is removed

- Liquid no longer emits `wsgData`, `isWsgCustomer`, customer tags/rates, product membership, and restriction flags into the page.
- The Wholesale Gorilla runtime will not automatically find Impact product-card, price, cart, subtotal, or checkout DOM nodes.
- Conditional accelerated-checkout hiding for wholesale users disappears.
- Wholesale messages, price display, restriction hiding, quick-order link, and any cart validation will not automatically run.
- Any theme-linked registration, catalog, cart, or portal entry point may disappear from navigation.
- A Shopify customer session alone does not prove that Storefront API cart costs include Wholesale Gorilla pricing.

### Classification and gate

**Current implementation: NOT HEADLESS READY / BLOCKER pending vendor confirmation.**

No first-party public Wholesale Gorilla documentation found in this audit promises a Storefront API, Hydrogen, or arbitrary headless integration. That absence is not proof that a private/supported contract does not exist. The live configuration's `hosted` mode creates a plausible lower-risk alternative: keep wholesale buying in Wholesale Gorilla's hosted portal while the retail site becomes headless.

**SHOPIFY ADMIN INVESTIGATION REQUIRED**

1. Export every Wholesale Gorilla price list/rule, customer tag mapping, exclusion, limit, payment, tax, and shipping setting.
2. Test an approved `Wholesale` customer: login, product/collection visibility, PDP price, cart price, discount application, shipping, payment, checkout/order creation, and reorder/quick-order behavior.
3. Determine whether orders are standard checkout orders, draft orders, net orders, or mixed by customer/market.
4. Ask Wholesale Gorilla in writing whether its current hosted install supports a Next.js retail storefront, how authentication crosses domains, and whether its hosted portal preserves current prices/cart/checkout without the Liquid theme.
5. If a headless API exists, obtain documentation, authentication model, rate limits, cart/pricing contract, supported account system, and support commitment.

Do not build wholesale price, catalog, or cart logic until this gate closes.

## 2. AlphaLogic / Alpha Sale

### Where it appears and what triggers it

The anonymous storefront currently receives:

- a global app bar titled `30% Off All Products` with copy “Sitewide Sale: Take 30% Off All Products,” linking to `/collections/all`;
- an enabled “Regular price” feature;
- a cart savings-widget configuration; and
- a theme app embed that loads AlphaLogic JavaScript.

The current bar has no public customer/tag targeting configuration and is rendered for anonymous users. AlphaLogic's general product supports customer and product targeting, coupon discounts, automatic discounts, exclusions, and schedules, so other private campaigns cannot be ruled out.

### What the current storefront code does

- The visible product prices are Shopify variant prices. On the sample driver, the live price is `$209.99` with `$299.99` compare-at price—30% lower.
- AlphaLogic's first-party documentation confirms that a “Price reduction” campaign directly edits Shopify's actual `Price` and `Compare-at price` fields. See [How is the price reduction applied?](https://help.alphalogic.io/en/articles/10041826-how-is-the-discount-applied) and [Types of discounts](https://help.alphalogic.io/en/articles/10040165-types-of-discounts).
- The live `regular-price.js` intercepts theme AJAX `/cart/add` and Storefront `cartCreate`, then adds a line attribute named `🏷️ Regular price` when compare-at price exceeds price. It can update cart lines through Storefront API.
- The live savings widget calculates presentation from compare-at/original/discounted values. It does not set the variant selling price.
- The current announcement script renders the bar and optional savings content; it does not itself apply the advertised 30%.

### Discount and checkout behavior

AlphaLogic supports three distinct mechanisms:

1. **Price reduction:** directly changes Shopify product/variant `price` and `compareAtPrice`; headless product and cart reads receive those values.
2. **In-cart product/order discounts:** coupon or automatic discounts applied in cart/checkout, with targeting and combination settings. See [in-cart application](https://help.alphalogic.io/en/articles/10046783-how-is-the-discount-applied) and [combination rules](https://help.alphalogic.io/en/articles/10041430-combining-different-discount-types).
3. **Presentation:** theme app embed for bars, regular-price display, and cart savings. AlphaLogic states that the app embed is required for these theme widgets in its [installation guide](https://help.alphalogic.io/en/articles/8532487-how-to-activate-alpha-sale-app-embed-in-shopify-store-theme).

The public storefront proves mechanism 1 and presentation behavior. It does not prove whether mechanisms 2, discount-code blocking rules, or Shopify Functions are active for this store.

### Classification

**REQUIRES CUSTOM INTEGRATION** for exact storefront parity.

Evidence:

- Core current sale price is headless-safe because it is stored on Shopify variants.
- The app's visible UI is a theme embed and will not appear in Next.js.
- The live regular-price cart attribute is theme JavaScript behavior and must be deliberately reproduced or retired with business approval.
- No first-party AlphaLogic headless SDK/API documentation was found for those presentation features.
- Private automatic/coupon campaigns may execute in Shopify cart/checkout, but their configuration and implementation type are unknown.

This is not presently a blocker for public retail price display. It is a commerce gate until the AlphaLogic dashboard and Shopify Discounts list prove whether any customer-targeted, in-cart, blocking, or Shopify Function behavior is active.

**SHOPIFY ADMIN INVESTIGATION REQUIRED:** export all active/scheduled campaigns, campaign type, targets/exclusions, customer segments/tags, minimums, maximums, combination settings, code-blocking rules, and restore/revert behavior. Confirm whether the 30% campaign is the direct price-reduction campaign observed publicly.

## 3. GOVX ID

### Complete observable flow

```text
Customer clicks GOVX CTA on PDP/cart
        ↓
Popup opens at auth.govx.com for shop r1kikk-am.myshopify.com
        ↓
Customer logs into GOVX or completes real-time eligibility verification
        ↓
GOVX returns/creates a unique single-use code (15% in current public config)
        ↓
Customer copies the code
        ↓
Customer enters code in Shopify Checkout
        ↓
Shopify validates eligibility rules and applies/rejects the code
        ↓
Shopify creates the order; GOVX can report redemption
```

The live PDP link is:

`https://auth.govx.com/shopify/verify?shop=r1kikk-am.myshopify.com&utm_source=shopify&utm_medium=govxid&utm_campaign=govxid_button_app_block`

It opens a 450 × 700 popup named `GOVXID Verification`. The store's public GOVX config advertises 15% and current/former military, spouses/dependents, first responders, government employees, and teachers. It says one code per day and instructs the shopper to copy the code for checkout.

GOVX's official Shopify documentation states that the app creates unique `GX`-prefixed, single-use codes in Shopify in real time, reissues an unused code, and limits issuance to one per 24 hours. See [GOVX ID discounts](https://support.govxinc.com/hc/en-us/articles/360044787831-GOVX-ID-discounts). The [Shopify App Store listing](https://apps.shopify.com/govx-id) also identifies native code creation, APIs, and webhooks.

### Redirects, cookies, and sessions

- The live link sends only the Shopify shop identifier and UTM parameters; no return URL is visible in the link.
- Authentication and verification occur on `auth.govx.com`. GOVX therefore owns its authentication session/cookies.
- No public Northwestern code was found storing GOVX eligibility in Shopify customer data or changing cart contents.
- The discount is not auto-applied by the current CTA. The shopper copies it to Shopify Checkout.
- GOVX supports custom links “anywhere in your store” and documents server-side explicit and client-side implicit OAuth. Its explicit flow requires a pre-registered/whitelisted `redirect_uri`, `client_id`, secret, state, and server token exchange. See [custom implementations](https://support.govxinc.com/hc/en-us/articles/360035764752-Custom-implementations) and [OAuth explicit flow](https://support.govxinc.com/hc/en-us/articles/360028760851-Deploying-verification-via-OAuth-Explicit-flow).

### Next.js responsibility and classification

**LIKELY HEADLESS READY**, conditional on a vendor-approved custom link and staging verification/checkout test.

For parity, Next.js only needs to render the approved CTA and popup/full-page launch. It should not store eligibility, issue codes, mutate price, or emulate GOVX. GOVX continues verification/code issuance; Shopify continues code validation and order attribution.

Do not build the more invasive OAuth integration unless the current Shopify link cannot be approved for the new domain or the business needs verified user data inside Next.js. If OAuth is required, use the server-side explicit flow, validate `state`, keep the secret server-side, collect only necessary scopes, and register the exact callback with GOVX.

**SHOPIFY ADMIN INVESTIGATION REQUIRED:** confirm eligible groups, 15% value, product/collection exclusions, minimum purchase, expiry, combination settings, current price rule, subscription setting, checkout app block status, marketplace attribution, and the approved production/test domains. Test an issued code once on staging and verify that wholesale/sale combinations follow the intended policy.

## 4. Discount architecture

### Mechanisms

| Mechanism | Observed status | Authoritative layer | Headless implication |
| --- | --- | --- | --- |
| Standard variant price | Active | Shopify ProductVariant | Query and render from Shopify. |
| Sale/compare-at pricing | Active; sample catalog shows 30% reduction | Shopify ProductVariant, apparently managed by AlphaLogic price-reduction campaign | Survives headless. Compute badges/savings from selected variant fields. |
| Shopify discount codes | Platform capability; active list unknown | Shopify Discounts/Checkout | Can be supplied to Storefront Cart or entered in checkout; exact rules require Admin. |
| Shopify automatic/app discounts | AlphaLogic can create them; store status unknown | Shopify Discounts/Functions/Checkout | Storefront Cart/Checkout can apply supported discounts, but buyer identity and rules must be tested. |
| Wholesale price | Active integration; exact rules hidden | Wholesale Gorilla + Shopify customer tags/account/order path | **BLOCKER** until vendor contract and tagged-account test. |
| Wholesale quantity/subtotal discount | Public Wholesale Gorilla configuration disabled | Wholesale Gorilla | Do not implement as active behavior unless Admin contradicts public config. |
| GOVX | Active 15% public offer | GOVX-issued Shopify code + Shopify Checkout | Next.js launches verification; Shopify applies code. |
| AlphaLogic presentation | Active bar/regular-price tooling | AlphaLogic app embed | Reproduce only approved UI/line attribute. It is not the price authority. |
| Bundle pricing | No public evidence | Unknown | Do not implement. **SHOPIFY ADMIN INVESTIGATION REQUIRED** to confirm no bundle app/rule. |
| Promotional copy | Active AlphaLogic bar and landing-page copy | App/theme content | Must never override live Shopify price/discount truth. |

### Combination compatibility matrix

Legend: **Yes** = publicly/platform-confirmed role; **No** = not applicable or publicly disabled; **Unknown** = private combination setting or untested customer context.

| Pricing mechanism | Retail | Wholesale customer | With GOVX | With AlphaLogic | Shopify Checkout |
| --- | --- | --- | --- | --- | --- |
| Standard Shopify price | **Yes** | **Unknown** — likely replaced/adjusted by WSG display/order logic | Base for code calculation is **Unknown** until rule is inspected | Alpha reads/edits Shopify values | **Yes** |
| Sale price + compare-at price | **Yes** | **Unknown** | Stacking versus “best discount” is **Unknown** | **Yes** — current price-reduction mechanism | Checkout charges variant sale price; compare-at presentation may use Alpha line attribute |
| Shopify discount code | Platform supports it | **Unknown** | Multiple code combination depends on each discount class/setting | **Unknown** — Alpha can exclude/block/replace behavior | **Yes**, subject to code and combination rules |
| Shopify automatic/app discount | Capability confirmed; active store rules **Unknown** | **Unknown** | **Unknown** | Alpha can create this type; current active rules **Unknown** | **Yes**, if eligible |
| Wholesale Gorilla price | **No** for retail customer | **Unknown exact value/method**, but integration is intended for tagged customers | **Unknown** | **Unknown** | **Unknown order path** |
| Wholesale Gorilla quantity/subtotal discount | **No** | **No in public current config** | **No/Unknown** | **No/Unknown** | Not active in public config |
| GOVX 15% code | Only after successful verification | **Unknown** | **Yes**, this is the mechanism | No direct Alpha dependency; stacking **Unknown** | **Yes** — code is created/validated by Shopify |
| AlphaLogic price reduction | **Yes** as Shopify sale price | **Unknown interaction with WSG price** | Combination policy **Unknown** | **Yes** | **Yes** as variant price |
| Bundle price | No evidence | No evidence | **Unknown** | **Unknown** | **Unknown** |

Shopify allows combinations only when the participating discounts' class and combination settings allow it; otherwise it applies the best permitted discount/combination. See [Shopify discount combinations](https://help.shopify.com/en/manual/discounts/discount-combinations). Third-party app discounts must support Shopify's combination model. Therefore no unchecked combination in the table may be inferred from platform capability.

### Mandatory discount test matrix

After Admin export, test at least:

- retail regular-price item;
- retail sale item;
- regular and sale items with GOVX code;
- regular and sale items with each active Shopify/AlphaLogic code;
- every active automatic discount threshold;
- wholesale tagged customer on regular and sale items;
- wholesale + GOVX and wholesale + every other code, even if the expected result is rejection;
- mixed eligible/ineligible carts;
- variant change, quantity change, cart reload, account login/logout, and checkout handoff.

Record PDP, Storefront Cart estimated cost, checkout total, order discount allocations, code, customer/tag, and expected/actual result.

## 5. Customer account architecture

### Current system

`/account/login` returns a 302 redirect to Shopify's hosted account at `https://shopify.com/72808693923/account?...`. Header links use `/customer_authentication/redirect?locale=en&region_country=US`. This is Shopify's new customer-account system, not legacy theme-rendered accounts.

Shopify documents these accounts as passwordless: a customer enters email and receives a one-time six-digit code. See [Shopify customer accounts](https://help.shopify.com/en/manual/customers/customer-accounts/new-customer-accounts). There is therefore no storefront password or conventional reset flow to reproduce.

| Capability | Current/observable status | Ownership |
| --- | --- | --- |
| Login | Shopify-hosted redirect; passwordless email code | Shopify |
| Registration | New-account creation is part of Shopify account flow; exact store setting untested | Shopify |
| Password/reset | No customer password in new accounts | Shopify |
| Account URLs | `/account/login` → `shopify.com/{shopId}/account`; redirect helper also used | Shopify |
| Order history | Expected Shopify customer-account capability; not observable without login | **SHOPIFY ADMIN INVESTIGATION REQUIRED** |
| Addresses | Expected Shopify customer-account capability; not observable without login | **SHOPIFY ADMIN INVESTIGATION REQUIRED** |
| Wholesale identity | Shopify customer tag `Wholesale`/WSG price-list assignment | Shopify + Wholesale Gorilla |
| Customer tags | `Wholesale` is publicly emitted as WSG active tag; per-customer tags are private | Shopify |
| Native Shopify B2B company/location | Not publicly determinable | **SHOPIFY ADMIN INVESTIGATION REQUIRED** |

### Recommendation

Choose **Option A — Shopify-hosted customer accounts**.

This is the lowest-risk option because it preserves the current passwordless identity, account/order/address surfaces, checkout single sign-on potential, and Wholesale Gorilla's documented reliance on Shopify customers. Link or redirect from Next.js into the hosted account surface. Do not create a Supabase customer database.

Shopify's Customer Account API can support a custom account interface and authentication handoff, but it introduces OAuth/PKCE, credentials, protected customer data approval, token/session storage, and more responsibility. See [Customer Account API](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/index). Treat it as a future enhancement only if Shopify-hosted accounts cannot meet a confirmed requirement.

The unresolved point is whether a Shopify-hosted login can reliably establish the identity Wholesale Gorilla needs in either its hosted portal or a headless retail cart. That must be vendor-tested.

## 6. Checkout boundary

### Recommended retail boundary

```text
Next.js/Vercel
  browse → product → collection → search → retail cart
                                           ↓
                              Storefront Cart.checkoutUrl
                                           ↓
                                  Shopify Checkout
                                           ↓
                              discounts/shipping/payment
                                           ↓
                                      Shopify Order
```

Shopify's Storefront Cart API returns the hosted `checkoutUrl` and supports lines, attributes, buyer identity, estimated costs, and discount codes. Final costs remain subject to checkout. See [Shopify Cart API](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage).

Next.js should stop at the returned `checkoutUrl`. Shopify should own address collection, shipping rates, tax, discount validation, payment methods, Shop Pay/other wallets, checkout UI extensions, order creation, confirmation, and purchase events.

### Functionality that may alter the boundary

| Concern | Public result | Required decision |
| --- | --- | --- |
| Wholesale Gorilla | Exact cart/order/checkout path unknown | Wholesale lane may need to leave Next.js earlier and use the hosted WSG portal. **BLOCKER**. |
| GOVX | Verification can occur on storefront; code is applied in Shopify checkout | No boundary change; preserve CTA and code entry. |
| AlphaLogic price reduction | Shopify variant price | No boundary change. |
| AlphaLogic in-cart discounts/blocking | Active status unknown; intended to run in cart/checkout | Confirm Admin rules and test Storefront Cart → checkout. |
| Alpha regular-price checkout display | Live code adds line attribute; official app supports checkout display | Preserve line attribute only if business confirms it is required. |
| Checkout extensions | Cannot be enumerated publicly | Export checkout editor/apps; retain them in Shopify. |
| Shipping/payment customization | Not publicly enumerable; WSG custom shipping/net terms publicly off | Export Shopify Functions, delivery/payment customizations, and Markets. |
| Upsells/post-purchase | No public proof | Inspect checkout editor and installed apps. |

Checkout UI extensions run inside Shopify and can remain even with a headless storefront, but enabled targets/settings require Admin inspection. Shopify notes that extensions in information/shipping/payment steps require Plus. See [Checkout UI extensions](https://shopify.dev/docs/api/checkout-ui-extensions/latest/index).

## 7. Analytics and marketing pixels

### Current public inventory

The Liquid theme initializes Shopify Web Pixels Manager and publishes storefront events. The public configuration exposes:

| Integration | Public identifier/evidence | Current firing surface | Confidence |
| --- | --- | --- | --- |
| Google tag / GA4 | `GT-5R3QNQJ8`, `GT-5NX8GBBF`, destination `G-T04EQ37VVZ` | Shopify app web pixel across storefront/checkout events | Confirmed |
| Google Ads | `AW-17694000302` plus conversion labels | Shopify app web pixel | Confirmed |
| Google Merchant Center | `MC-4SVNY911XH` | Google app pixel event destinations | Confirmed |
| Meta Pixel | `1058499582905322`; `facebookCapiEnabled=true` | Shopify Meta app pixel; browser + CAPI setting | Confirmed |
| Shopify Analytics | `ShopifyAnalytics.meta`, Web Pixels Manager, page/product event publishing | Shopify theme/storefront and Shopify checkout | Confirmed |
| Shopify app pixel | Generic `shopify-app-pixel` entry | Shopify Customer Events | Confirmed entry; purpose/code not public |
| Custom pixel | Generic `shopify-custom-pixel`, lax sandbox, Analytics/Marketing purposes | Shopify Customer Events | Confirmed entry; code/name not public |
| Unidentified app pixel | App pixel ID `1909555363`, API client `123074`, account `VeKatU`, Added to Cart enabled | Shopify Customer Events | Confirmed pixel; provider not proven publicly. Configuration shape is consistent with Klaviyo, but this remains **SHOPIFY ADMIN INVESTIGATION REQUIRED**. |
| Klaviyo | No standalone onsite script conclusively identified | Possibly the unidentified app pixel | Suspected only; do not treat as confirmed |
| TikTok advertising pixel | No advertising pixel identified | None observed | Not publicly detected; Admin confirmation required |

The Google pixel is publicly configured for `page_view`, `search`, `view_item`, `view_item_list`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, and `purchase`. The public product page also publishes Shopify `page_viewed` and `product_viewed` events.

### Future ownership and exactly-once boundaries

| Commerce event | Future owner | Rule |
| --- | --- | --- |
| `page_view` | Next.js | Emit once after initial load and each completed client navigation, after consent. Do not also load the Liquid storefront pixel loader. |
| `view_item_list` | Next.js | Emit once per meaningful list view, not per component render. |
| `view_item` | Next.js | Emit once per product/selected-item view policy. |
| `search` | Next.js | Emit for committed search, not every keystroke unless explicitly specified. |
| `add_to_cart` / `remove_from_cart` / `view_cart` | Next.js | Emit after successful Shopify Cart mutation/state resolution. |
| `begin_checkout` | Shopify Checkout | Let Shopify fire when the hosted checkout actually starts. Next.js may record a differently named internal `checkout_click`, never a second `begin_checkout`. |
| `add_shipping_info` / `add_payment_info` | Shopify Checkout | Shopify only. |
| `purchase` | **Shopify only** | Completed Shopify order/checkout event is authoritative. Never fire purchase from Next.js, a redirect click, or a thank-you URL guess. |

Future provider ownership:

- **Next.js:** consent-aware upper-funnel adapter for GA4/Google Ads, Meta browser events, Shopify storefront analytics if selected, and confirmed Klaviyo onsite behavior.
- **Shopify Customer Events/checkout:** checkout lifecycle and purchase; Google/Meta app pixels and server-side/CAPI purchase attribution remain here.
- **Both:** only as the preceding event table partitions them. Use stable cart/checkout/order identifiers and provider `event_id` deduplication where a provider receives browser and server events for the same boundary.

Shopify's theme web-pixel loader will not automatically observe arbitrary Next.js UI events. Shopify provides headless analytics/consent patterns, but they require explicit implementation and validation; see [Shopify headless analytics](https://shopify.dev/docs/storefronts/headless/hydrogen/analytics) and [web pixels](https://shopify.dev/docs/apps/build/marketing/pixels). The project is Next.js, so these are behavioral contracts, not an instruction to install Hydrogen.

**SHOPIFY ADMIN INVESTIGATION REQUIRED:** identify pixel ID 1909555363/API client 123074, export the custom pixel code/name/version, list all Customer Events subscriptions, confirm Google/Meta data-sharing settings, enumerate server-side destinations, document consent regions/categories, and verify whether checkout/order-status scripts or post-purchase extensions also send purchase.

## 8. Headless compatibility matrix

| Integration | Current purpose | Theme dependency | Next.js work required | Checkout dependency | Risk |
| --- | --- | --- | --- | --- | --- |
| Shopify Product/Variant | Catalog, price, compare-at price, options, inventory | None for data | Storefront API queries and rendering | Checkout validates final variant/price | **LOW** |
| Shopify Collections | Taxonomy and product membership | None for data | Storefront API query and route parity | None | **LOW** |
| Shopify native search / Search & Discovery | Predictive/full search and filters | Current UI is theme-owned | Build search UI; export filters/boosts/synonyms | None | **MEDIUM** |
| Shopify Storefront Cart API | Retail cart and checkout handoff | Replaces theme cart | Cart state/mutations, buyer context, attributes, recovery | Returns Shopify `checkoutUrl` | **MEDIUM** |
| Shopify Checkout | Discounts, shipping, taxes, payments, order creation | Hosted surface independent of theme | Redirect only; preserve domain/cookies/return URLs | Entire purpose | **LOW** for retail; wholesale unresolved |
| Shopify customer accounts | Passwordless login, orders, addresses | Hosted account independent of theme | Link/redirect and domain configuration | Customer authentication can carry to checkout | **MEDIUM** |
| Wholesale Gorilla | Wholesale identity, price lists, catalog, quick order, potential order rules | **High**—Liquid globals, theme DOM, app blocks/embed | Vendor-supported integration or route wholesale to hosted portal | Exact WSG order/checkout path unknown | **BLOCKER** |
| AlphaLogic / Alpha Sale | Direct sale-price edits, bar, savings, possible in-cart discounts | Price data none; UI/line attribute high | Rebuild approved bar/savings/attribute; export discount campaigns | In-cart rules and regular-price display may continue in checkout | **HIGH** until Admin export, then likely **MEDIUM** |
| GOVX ID | Eligibility verification and single-use code | CTA placement/popup is theme-bound | Render approved full link/popup; no eligibility store | Shopify Checkout applies code; optional checkout block unknown | **HIGH** until staging test, then **LOW/MEDIUM** |
| Okendo Reviews | Ratings/reviews widgets | Current theme app embed/blocks | Use supported headless widget/metafields/API; preserve SEO | Review request/post-purchase flows may use Shopify orders | **MEDIUM** |
| Shop Pay / accelerated wallets | Express payment/checkout | Theme buttons disappear | Use Shopify-supported cart/checkout handoff; do not emulate wallets | Shopify | **LOW/MEDIUM** |
| Google & YouTube app pixel | GA4, Ads, Merchant events | Storefront event publication changes | Implement upper funnel once; retain Shopify checkout/purchase | Strong checkout/purchase role | **HIGH** until event QA |
| Meta app pixel/CAPI | Meta browser/server measurement | Storefront event publication changes | Implement upper funnel/deduping once | Shopify purchase/CAPI authoritative | **HIGH** until event QA |
| Unidentified app pixel, likely Klaviyo | Added-to-cart/customer marketing tracking | Current Shopify event stream | Identify provider and supported headless onsite contract | May consume checkout events | **HIGH** |
| Shopify custom pixel | Unknown analytics/marketing logic | Current Shopify Customer Events surfaces | Inspect code; allocate events by boundary | Could fire checkout/purchase | **HIGH** |
| Shopify generic app pixel | App analytics/marketing | Current Shopify Customer Events | Identify app/subscriptions | Could fire checkout/purchase | **HIGH** |
| TikTok | Social link confirmed; ad pixel not detected | Unknown | None unless Admin confirms advertising integration | Unknown | **MEDIUM** pending confirmation |
| hCaptcha/contact | Contact spam protection | Current Shopify form/theme integration | Select supported server-side form and spam flow | None | **MEDIUM** |
| Swiper/theme carousels | UI-only carousel behavior | Theme implementation | Recreate only required behavior; library not mandated | None | **LOW** |
| Theme sections/Custom Liquid | Homepage, landing pages, PDP editorial content, footer | **Complete** theme dependency | Structured content migration per `theme-content-migration.md` | None unless content embeds an app | **HIGH** |
| Shopify policies/privacy choices | Legal content and data-sharing control | Current routes/surface | Preserve URLs and supported render/hosted flow | Consent must cross into checkout | **MEDIUM/HIGH** |

## 9. Admin/vendor evidence required to close compatibility

**SHOPIFY ADMIN INVESTIGATION REQUIRED**

1. Installed apps list with plan, scopes, theme extensions, Customer Account UI extensions, Checkout UI extensions, Functions, web pixels, app proxies, webhooks, and accountable owner.
2. Wholesale Gorilla full configuration and an approved tagged test customer.
3. AlphaLogic campaign/discount export and Shopify Discounts/Functions list.
4. GOVX campaign/price-rule settings and test code.
5. Checkout editor screenshots/exports for information, shipping, payment, thank-you, order-status, and post-purchase surfaces.
6. Shipping/delivery profiles, payment customizations, validation functions, Markets, tax, and customer-account settings.
7. Customer Events/pixel inventory, consent settings, GA4/Ads/Meta/Klaviyo/TikTok destinations, and server-side event sources.
8. Three recorded test orders: retail regular price, retail discount/GOVX, and wholesale. Use reversible test products/codes only in an approved test environment.

