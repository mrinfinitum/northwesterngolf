# Shopify data map

Audit date: 2026-08-27  
Storefront: <https://northwestern.golf>

This document separates proven Shopify data from theme-only and third-party content. It intentionally does not invent metafield namespaces or metaobject definitions that cannot be seen from the public storefront.

## Source-of-truth map

| Category | Current storefront responsibility | Required headless use | Confidence / investigation |
|---|---|---|---|
| Product | Handle, title, HTML description, vendor, tags, media, SEO fields, options, product availability | PDPs, cards, search, recommendations, structured data | Observed. Product type is blank on all 20 public products. |
| Variant | Variant ID, SKU, selected options, price, compare-at price, availability, variant image, weight | Variant picker, cart lines, URL state, price/availability, image switching | Observed. Do not identify variants by title or SKU alone; use Storefront API IDs. |
| Collection | Handle, title, description, image, products, sort order, filter metadata | Collection routes, featured collection, navigation destinations, Open Graph | Observed. Manual vs automated collection rules **NEED SHOPIFY ADMIN INSPECTION**. |
| Metafield | Likely candidate for specifications, badges, reviews, editorial references | Typed custom product/content fields if they exist | Public source cannot prove most namespaces. **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |
| Metaobject | Candidate for repeated FAQs, specifications, trust callouts, campaign sections | Structured reusable content if already modeled | No public proof of a current metaobject model. **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |
| Page | Contact, Our Story, privacy choices, Talon SS, Thunderbird Full Set, Wedges | `/pages/[handle]` content and metadata | Observed, but many landing-page layouts include theme sections beyond page body. |
| Article | No live articles | Future `/blogs/[blog]/[article]` support | Shopify type exists; current article inventory is empty. |
| Blog | `news` blog | Blog index, future articles | Observed empty blog. |
| Menu | Header parent/child links; possibly footer groups | Global navigation | Header behavior is consistent with a Shopify menu. Footer may be custom blocks. **Admin inspection required** for exact menu handles. |
| Customer | Authentication/account ownership, customer identity | Hosted-account handoff or Customer Account API plan | New customer accounts are observed through Shopify-hosted redirect. High-risk boundary. |
| Cart | Cart lines, cost, buyer identity, discounts, note, checkout URL | Drawer and `/cart`, optimistic updates, checkout handoff | Shopify cart is observed; wholesale/app parity must be validated. |
| Search | Native predictive/full search, resource grouping, facets, sort | Search drawer/page | Observed native endpoints and `filter.v.*` parameters. |
| Theme-only content | Homepage sections, custom footer, per-product short copy/editorial panels, hardcoded testimonials | Must be migrated to a durable source before theme retirement | **SOURCE NEEDS SHOPIFY ADMIN INSPECTION** per section/block. Storefront API cannot read arbitrary theme settings. |
| Third-party app | Reviews, wholesale, GOVX, promotion bar, analytics/pixels | Feature-specific SDK/API/webhook or retained hosted surface | See `integration-inventory.md`. |
| Policy | Refund, privacy, terms | Policy routes and SEO | Public policy pages observed. Confirm desired API/content strategy because policy retrieval differs from normal pages. |

## Catalog structure

### Product families

- Talon SS: men's, women's, senior's full sets; all sold out at audit time.
- Thunderbird: men's, women's, senior's full sets, irons, fairways, drivers, and hybrids.
- Thunderbird: one men's wedge and one golf bag.

All products use vendor `Northwestern Golf`; `productType` is empty. Classification currently relies primarily on collection membership and tags:

```text
Drivers, Fairway, Full Set, Golf Bags, Hybrids, Irons,
Men, Women, Senior, Retail, Talon SS, Thunderbird, Wedges
```

This is adequate for current storefront grouping but is not a robust long-term taxonomy. Do not normalize it during parity migration without approved redirects, merchandising rules, and Search & Discovery updates.

### Options and variants

Only three option names are present across the public catalog:

| Option | Examples | UI |
|---|---|---|
| Shaft Flex | Steel S, Steel R, Steel W, Graphite R, Graphite S, Graphite L, Graphite SR, Regular, Stiff | Text option buttons. |
| Loft | 9.5 Degree, 10.5 Degree, 14 Degree, 18, 24, 22/24/27 Degree, 52–60 | Text option buttons; impossible combinations disabled. |
| Bag Color | Navy, Black, Gray, Green | Color swatches and variant-linked images. |

The men's Thunderbird driver demonstrates sparse option combinations: only R + 10.5 and S + 9.5 exist. The UI must derive valid combinations from variants; a Cartesian product is incorrect.

The men's Thunderbird full set demonstrates the largest current option matrix: two shaft values × four bag colors = eight variants. Women's/senior's full sets expose one shaft value × four bag colors.

### Product money and availability

- Price and compare-at price belong to variants even when every current variant shares a value.
- Sale labels are computed from the compare-at difference; do not store formatted savings strings.
- Product availability should aggregate variant availability, but Add to Cart must use the selected variant's state.
- Selected variant should be represented as `?variant=[Storefront variant ID]` to retain deep links and browser history parity.
- Currency is USD in the observed US market. Money must remain currency-aware for future Markets behavior.
- Inventory quantities are not displayed publicly. Request/use them only if the Storefront access scope and business decision support stock messaging.

## Product-page field map

| UI/content | Proven current source | Headless field/source | Status |
|---|---|---|---|
| Handle/title/vendor | Product JSON/schema | `Product.handle/title/vendor` | Observed. Vendor is not currently shown in the main UI. |
| Long description | Shopify product `body_html` | `Product.descriptionHtml` | Observed; sanitize legacy Elementor wrappers. |
| Short marketing description | Separate PDP block | Unknown theme setting/metafield | **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |
| SKU | Variant | `ProductVariant.sku` | Observed in data, not visibly rendered. |
| Price/compare-at | Variant | `price`, `compareAtPrice` | Observed. |
| Sale badge/savings | Theme calculation | Calculate from selected or representative variant money | Observed behavior. |
| Availability | Variant | `availableForSale`, product aggregate | Observed. |
| Main/gallery media | Product media | `Product.media`/images | Observed; preserve order, dimensions, alt text, media type. |
| Variant media | Variant featured image | Variant `image` + product media | Observed on Golf Bag; absent on driver/Talon variants. |
| Video/3D media | None in sampled products | Product media union when present | Not currently observed; implementation can remain type-safe. |
| Option definitions | Product/Variant | options + selected options | Observed. |
| Swatch colors | Theme swatch configuration and option value | Existing swatch config or typed color mapping | Navy/Black/Gray/Green values observed. Exact ownership **NEEDS ADMIN INSPECTION**. |
| Quantity | Cart-form UI | Local state plus cart line quantity | Observed. |
| Shop Pay installments | Shopify payment terms | Shopify payment/checkout surface | Observed on eligible PDP. Do not calculate financing copy independently. |
| Review summary/full reviews | Okendo | Okendo headless API/widget plus product identifiers | Observed third party. |
| One-year warranty/trust callouts | Product theme blocks | Unknown theme settings/metafields/metaobjects | **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |
| Accordion headings/content | Product template blocks | Unknown theme settings, product metafields, or metaobjects | **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |
| GOVX discount | GOVX app block | GOVX-approved headless integration | Observed third party. |
| Related products | Theme recommendation section | Shopify recommendations or curated references | Observed UI; exact algorithm/source **NEEDS ADMIN INSPECTION**. |
| Recently viewed | Theme local storage support | Client-side recent-product storage | Code capability observed; rendered section not confirmed. |
| Editorial product sections | Theme sections, many generated blocks | Page-builder content source must be chosen from actual Admin configuration | **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |

### Custom fields to investigate in Shopify Admin

The frontend shows or suggests these content classes, but their storage is not publicly identifiable:

| Candidate field | Frontend evidence | Required action |
|---|---|---|
| Specifications | Loft, lie, length, handedness, shaft/grip details in descriptions/accordions | Determine whether description HTML, theme block, product metafield, or metaobject. Do not duplicate until ownership is known. |
| Features | Product bullets and short uppercase marketing line | Inspect product metafields and product-template dynamic sources. |
| What's included | Repeated accordion across sets/clubs/bag | Inspect block dynamic-source binding; model as metafield/metaobject only if it already is or migration content work is approved. |
| Shipping & returns | Repeated accordion | Determine global theme text vs per-product block. Link policy rather than duplicating only if current source supports it. |
| Warranty | “1-YEAR WARRANTY” callout and accordion copy | Inspect global/product field source. |
| Badges | Sale, sold-out, trust callouts | Sale/sold-out are computed; other badges need source inspection. |
| FAQs | Accordion-like support content | No dedicated FAQ page found; determine whether any blocks are actual FAQs. |
| Related products | “You may also like” | Inspect whether Shopify recommendations, Search & Discovery complementary products, or manually selected products. |
| Downloads/manuals | None visibly confirmed | **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**; do not invent a field. |
| Videos | No product video in representative media | **SOURCE NEEDS SHOPIFY ADMIN INSPECTION** for unpublished/other products. |
| Dimensions/materials | Some details embedded in description | Determine structured vs rich-text ownership. |
| Installation | No confirmed installation block | **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |

## Collection data map

Required fields:

```text
Collection.id
Collection.handle
Collection.title
Collection.descriptionHtml
Collection.image { url, width, height, altText }
Collection.seo { title, description }
Collection.products(...filters/sort/pagination)
ProductConnection.filters
PageInfo
```

Collection navigation must preserve current handles. The live filter query syntax exposes only Availability and Price. Filter values/ranges should come from Shopify's response, not from a locally hardcoded list.

Questions for Admin:

- Which collections are automated, and what rules/tags power them?
- Which collection is selected for homepage “Most Wanted”?
- Why does `/collections/all` not appear in the collection sitemap, and is that intentional?
- Are `northwestern-golf-inc`, `talon-ss`, `thunderbird`, and `best-sellers` intended public landing collections or only merchandising helpers?
- Is Search & Discovery the authoritative facet and recommendation configuration?

## Menus and global content

### Header

Fetch the configured Shopify menu by handle through Storefront API once the Admin menu handle is known. The public markup proves the hierarchy but not the internal handle. Preserve order, label, destination, and nested children. Parent campaign destinations must remain navigable in addition to opening a child menu.

### Footer

Footer groups may be menus or individual custom-theme link blocks. Logo, social URLs, copyright, colors, and spacing are theme configuration. Storefront API does not expose arbitrary theme settings.

**SOURCE NEEDS SHOPIFY ADMIN INSPECTION:** decide whether to:

1. read actual Shopify menus for each link group;
2. migrate the remaining global settings into a dedicated Shopify metaobject; or
3. keep low-change brand constants in version-controlled site configuration.

Do not hardcode links until their current ownership is confirmed.

### Promotion bar

The visible sale bar is provided by AlphaLogic, not a native announcement section. Its copy/link/styles are app configuration. The pricing discount itself may be a Shopify automatic discount/app function separate from the displayed message. Inspect both the app and Shopify Discounts before migrating the bar.

## Pages, blogs, and policies

- Standard content routes should load Shopify Pages by handle.
- Landing pages contain theme sections and cannot be recreated from `Page.body` alone unless their section content is migrated to a Storefront-readable model.
- Blog `news` is empty but the route should be preserved. Article template and Article schema should be ready before content publication.
- Policy pages are Shopify-managed content. Decide whether the headless app reads and renders them, proxies them, or preserves a Shopify-hosted route. Any choice must keep existing URLs and canonical metadata.
- Privacy choices/data-sale opt-out is compliance-sensitive. Coordinate with Shopify Privacy & Compliance settings and the active pixel consent model.

## Customer and account data

The live `/account/login` redirects to Shopify's hosted new-customer-account domain. The parity baseline is therefore a hosted account handoff, not a custom email/password form.

Before implementation, decide and document:

- hosted new customer accounts vs Customer Account API UI;
- return URL/domain behavior after sign-in;
- order history, addresses, profile, returns, wholesale account state, and GOVX implications;
- customer-tag access and Wholesale Gorilla behavior;
- session/token storage and logout across Vercel and Shopify domains.

**SOURCE NEEDS SHOPIFY ADMIN INSPECTION** for account settings, wholesale approval flows, B2B companies, customer tags, and any account extensions.

## Cart and checkout data

Minimum Storefront Cart API fields:

```text
Cart.id
Cart.totalQuantity
Cart.lines { id, quantity, merchandise, attributes, cost }
Cart.cost { subtotalAmount, totalAmount, totalTaxAmount?, checkoutChargeAmount? }
Cart.discountCodes / discountAllocations
Cart.note
Cart.buyerIdentity
Cart.checkoutUrl
Cart.deliveryGroups / delivery options only if exposed and required
Cart.userErrors from every mutation
```

Use a secure HTTP-only cookie for the cart ID, server-side Storefront calls, and Shopify-returned totals. Never recreate discount, tax, financing, wholesale, or shipping mathematics in Next.js.

The observed shipping estimator is a theme/Ajax-cart feature. Confirm whether it is a launch requirement and whether the chosen Storefront API flow can return equivalent estimates before checkout.

Checkout customizations, Shopify Functions, automatic discounts, scripts, Markets, shipping profiles, taxes, and payment methods **NEED SHOPIFY ADMIN INSPECTION**. Checkout remains on Shopify.

## Search data

The current native search groups products, collections, pages, and articles. Full product search supports availability/price facets and relevance/price sorts. A headless implementation should use Shopify's current Storefront search/predictive-search capability, return resource types separately, and use Shopify-provided filter metadata.

Track search queries and no-result rates before deciding whether native relevance needs replacement. The broad match for `driver` is a known baseline characteristic, not proof that a third-party search provider is needed.

## Theme-only content migration register

Storefront API cannot retrieve theme JSON/settings. Before the Shopify theme is retired, export and map:

- Homepage video URL, poster, focal behavior, heading, CTA, link.
- Both desktop/mobile assets and copy/CTA for each Daly image overlay.
- “Most Wanted” collection selection and section settings.
- Nine testimonial blocks, order, author/title/text, auto-advance setting.
- Footer logo, menus/link blocks, social URLs, and copyright source.
- Per-product template assignments and every section/block setting.
- Product accordion content and any dynamic-source bindings.
- Related-product/recently-viewed section configuration.
- Swatch definitions and color values.
- Free-shipping threshold/configuration.
- Search, cart, header, and quick-add theme settings.

Classify each exported value as global configuration, Shopify resource, metafield, metaobject, or app-owned before implementing it.

## Storefront API query planning

Use shared fragments rather than page-specific duplicate queries:

```text
MoneyFragment
ImageFragment
MediaFragment
VariantFragment
ProductCardFragment
ProductDetailFragment
CollectionSummaryFragment
CartFragment
SeoFragment
```

Operational requirements:

- Pin a supported Shopify API version and schedule upgrades.
- Use public Storefront access only where safe; keep tokens in server environment variables according to Shopify's token type.
- Cache content queries with explicit revalidation and invalidate with Shopify webhooks.
- Avoid caching personalized customer, cart, wholesale, or market-sensitive responses as public data.
- Preserve market/country/language context in every relevant query.
- Log Shopify user errors and request IDs without exposing personal data.
- Use API-returned IDs and URLs; handles are route keys, not immutable entity IDs.

## Admin inspection checklist

- Product metafield definitions and values, including app-owned fields.
- Metaobject definitions and references.
- Product template assignments and theme section JSON.
- Navigation menu handles and footer link ownership.
- Automated collection rules and Search & Discovery configuration.
- Related/complementary product configuration.
- Shopify Discounts/functions corresponding to the advertised 30% sale.
- Inventory policy, overselling, backorder, and location behavior.
- Markets, price lists, duties, currencies, and localization.
- Shipping profiles/rates and free-shipping threshold.
- Customer account mode, B2B/wholesale tags, and account extensions.
- Checkout customizations, payment methods, Shop Pay, pixels, and consent settings.
- App list, scopes, billing status, webhooks, and headless support contracts.
