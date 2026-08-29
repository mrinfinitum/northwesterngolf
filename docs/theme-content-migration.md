# Theme content migration register

Audit date: August 27, 2026  
Storefront: [northwestern.golf](https://northwestern.golf/)  
Scope: content ownership only; no content has been migrated or changed.

## Purpose

The current Impact 6.11.2 theme is both a renderer and a content store. A headless storefront cannot query arbitrary theme JSON, section settings, block settings, Custom Liquid, or theme app blocks through the Storefront API. Those values must be exported before the Liquid theme stops serving the storefront and assigned one durable owner.

This document uses these classifications:

| Class | Meaning |
| --- | --- |
| **A — Already structured** | A Shopify resource is already available through the Storefront API, subject to publication and API permissions. |
| **B — Should migrate to Shopify metafield** | Typed data belongs to one Shopify resource, usually a product, collection, page, or shop. |
| **C — Should migrate to Shopify metaobject** | Reusable or repeatable editorial content needs a shared schema and merchant editing. |
| **D — Appropriate as Next.js static content** | Low-change implementation content is best version-controlled and does not need routine merchant editing. |
| **E — Requires investigation** | The public storefront does not prove the current source or the operational owner. |

Classes B–D are proposed destinations, not claims about current storage. Every E item below is **SHOPIFY ADMIN INVESTIGATION REQUIRED**.

## Source-of-truth rules

1. Shopify remains authoritative for catalog, price, compare-at price, inventory, availability, customers, carts, discounts, checkout, and orders.
2. Do not copy theme content into Next.js until the theme JSON and dynamic-source bindings have been exported.
3. A value should have one editing owner. Do not keep live copies in both theme settings and source code.
4. App-owned content remains app-owned when a supported headless contract exists. It is not silently converted to theme or application content.
5. Pricing or eligibility statements must never be stored as unmanaged marketing copy when Shopify or an app is the actual authority.

## Global content

| Significant item | Observed current behavior/source | Class | Proposed durable owner | Required action |
| --- | --- | --- | --- | --- |
| Primary and secondary navigation | Shopify menu output rendered by the theme | **A** | Shopify Menu | Confirm menu handles and Headless channel permission. Preserve nested order and URLs. |
| Logo assets | Theme settings/CDN assets | **E** | Shop metafield or a `site_branding` metaobject; static asset only if brand governance prefers source control | Export desktop, light/transparent, and mobile variants plus alt text. |
| Header behavior and labels | Impact settings and CSS/JS | **D** for behavior; **E** for editable labels | Next.js layout configuration plus structured branding content | Export transparent/sticky settings, icon labels, and breakpoints. |
| Footer navigation groups | Custom footer section; public output does not prove Shopify menu bindings | **E** | Shopify Menu when navigational; `site_footer` metaobject for non-menu content | Export every block and dynamic source. |
| Footer contact details | Custom footer section | **C** | `site_contact` or `site_footer` metaobject | Preserve phone/email/address exactly; assign business owner. |
| Social links | Custom footer section/theme settings | **C** | `social_link` metaobjects or a list field on `site_footer` | Export labels, URLs, order, and icons. |
| Social SVG icons | Theme assets | **D** | Version-controlled accessible icon components | Preserve visual geometry; labels remain structured. |
| Legal links | Shopify policy/page routes presented by footer settings | **A/E** | Shopify policies/pages plus Shopify Menu | Confirm each link's current resource and canonical URL. |
| Copyright text/year | Custom footer section | **D** if generated; **C** if custom legal text | Next.js generated year plus structured legal owner | Export exact wording. |
| AlphaLogic sale bar | AlphaLogic app configuration and theme app embed | **E** | AlphaLogic for campaign truth; Next.js presentation only through an approved contract | Current public bar says “Sitewide Sale: Take 30% Off All Products” and links to `/collections/all`. Confirm campaign ID, schedule, targeting, and future delivery method. |
| Wholesale Gorilla login/pending messages | Liquid-injected Wholesale Gorilla configuration | **E** | Wholesale Gorilla | Do not copy until vendor confirms the supported headless/hosted-portal path. |
| Cookie/consent experience | Shopify/customer-pixel configuration not fully visible in HTML | **E** | Shopify Customer Privacy or approved CMP | Export regional rules, consent categories, and banner configuration. |

## Homepage

The public homepage comprises a video hero, two art-directed image overlays, a featured collection, and a custom testimonial scroller. These are theme sections rather than a single Shopify Page body.

| Section/field | Observed source | Class | Proposed destination | Notes |
| --- | --- | --- | --- | --- |
| Homepage section order and enable/disable state | Theme template JSON | **C** | `page_composition` metaobject referencing typed section metaobjects | Keeps merchant-editable ordering without recreating arbitrary Liquid. |
| Video hero video, poster, heading, copy, CTA, link, alignment | Custom theme section/settings | **E**, then likely **C** | `hero_video` metaobject | Export desktop/mobile media, focal data, autoplay/mute/loop settings, and fallback poster. |
| John Daly image overlay | Theme image-overlay section | **E**, then likely **C** | `image_overlay` metaobject | Separate desktop and mobile images are intentional and must remain separate fields. |
| “Most Wanted” heading and selected collection | Theme section setting + Shopify Collection | Collection is **A**; presentation is **C** | Collection reference in a `featured_collection_section` metaobject | Product membership and prices stay in Shopify. |
| Featured product/card data | Shopify products and variants | **A** | Shopify Product/Variant | Query price, compare-at price, availability, images, options, and URLs at render time. |
| Driver image overlay | Theme image-overlay section | **E**, then likely **C** | Reuse `image_overlay` metaobject | Do not create a one-off page component. |
| Testimonial cards | Custom section blocks; not the visible Okendo review widget | **E**, then likely **C** | `testimonial` metaobjects referenced by a testimonial section | Verify whether quotes are manually curated and obtain attribution/legal approval. |
| Section spacing, color, and layout switches | Theme settings | **D/C** | Constrained component variants; editable values only where merchants use them | Do not expose arbitrary CSS as content. |

## Product pages

| Content/function | Observed current source | Class | Proposed destination | Required evidence |
| --- | --- | --- | --- | --- |
| Title, handle, vendor, description HTML, SEO, media | Shopify Product | **A** | Shopify Product | Confirm publication to Headless channel. Sanitize legacy Elementor markup without dropping content. |
| Options, variants, SKU, price, compare-at price, availability | Shopify ProductVariant | **A** | Shopify Variant | Preserve sparse combinations and selected-variant behavior. |
| Short uppercase marketing line | Separate theme block on representative PDPs | **E**, then likely **B** | Product metafield such as a typed short-text field | Inspect the product template's dynamic source; do not invent a namespace yet. |
| Specifications | Description/accordion/theme block source varies or is unknown | **E** | **B** for product-specific values; **C** for reusable specification groups | Inventory product-by-product and preserve units/order. |
| “What's included” | Repeated accordion with product-specific content | **E** | **B** when unique; **C** when shared assemblies are reused | Export block text and dynamic bindings. |
| Shipping and returns copy | Repeated PDP accordion | **E** | **C** for global policy excerpt; **B** only for product override | Link to Shopify policies rather than duplicating legal truth. |
| One-year warranty/trust callouts | Theme blocks | **E** | **C** global trust item with optional **B** product override | Confirm whether every product receives the same promise. |
| Badges and marketing callouts | Theme calculation/settings/metafield unknown | **E** | Computed from Product data where factual; **B** for curated badge references | Sale badges should derive from variant money, not copied text. |
| Color swatch mapping | Theme swatch configuration/dynamic source unknown | **E** | **C** reusable color definition or **B** product mapping | Export label, display color/image, and option-value matching rules. |
| Manuals/downloads | Not publicly confirmed | **E** | **B** list of Shopify file references, or **C** reusable document records | **SHOPIFY ADMIN INVESTIGATION REQUIRED** before adding a schema. |
| Videos | Product media absent in audited examples; editorial embeds possible | **E** | Shopify media when product media; otherwise **B/C** reference | Inventory all products and template blocks. |
| FAQs | No dedicated FAQ page; accordion semantics may be product support content | **E** | **C** FAQ entries referenced from product metafields | Do not label content as FAQ/schema until its meaning is confirmed. |
| Related products | Theme recommendation section | **A/E** | Shopify recommendations unless Admin reveals curated product references | Confirm algorithm and any manual overrides. |
| Recently viewed | Theme JavaScript capability; rendered use not confirmed | **D/E** | Next.js client state if the section is active | Confirm template enablement before reproducing it. |
| Product editorial panels | Product-template sections and generated blocks | **E** | Finite typed metaobjects referenced from product metafields | Export every product template assignment and block setting. |
| GOVX offer text/button | GOVX app block and hosted verification link | App-owned | GOVX link/config; Next.js placement | Do not convert eligibility or discount value to a product metafield. |
| Okendo rating/reviews | Okendo app data/widgets | App-owned | Okendo supported headless widget/metafields/API | Confirm current Okendo plan and Storefront Metafields/API entitlement. |

## Collections, search, and cart

| Item | Observed source | Class | Proposed destination | Notes |
| --- | --- | --- | --- | --- |
| Collection title, handle, description, image, membership, SEO | Shopify Collection | **A** | Shopify Collection | Confirm every collection is published to the Headless channel. |
| Collection hero enablement/layout | Theme settings | **E** | **B** collection presentation metafields or constrained Next.js default | Only add fields actually used by current collections. |
| Filters | Shopify Search & Discovery/native filter output plus theme UI | **A/E** | Shopify search/filter data; Next.js UI | Export enabled filter list and any custom labels/order. |
| Sort options and page size | Theme settings | **E/D** | Version-controlled configuration after stakeholder confirmation | Current small catalog does not exercise pagination sufficiently. |
| Product card flags, quick-add behavior, hover image | Theme settings + Shopify product data | **D/E** | Shared Next.js component configuration | Sale truth remains computed from Shopify money fields. |
| Search results/relevance | Shopify native search | **A** | Storefront API search/predictive search | Theme layout is **D**; any Search & Discovery boosts/synonyms require Admin export. |
| Free-shipping threshold/copy | Cart theme configuration not publicly proven | **E** | Shopify shipping settings plus structured display config | Never hardcode a threshold until it is reconciled with checkout rates. |
| Cart notes/gift options/upsell content | Not active or not publicly proven | **E** | Cart attributes/metafields and structured content only if confirmed | Wholesale Gorilla's public cart-note setting is not required and PO number is hidden. |
| AlphaLogic savings widget copy/styles | Theme app embed | App-owned/E | Next.js parity component fed by Shopify money/discount allocations | Exact need depends on active AlphaLogic settings. |
| Wholesale quick-order link | Wholesale Gorilla public configuration says `linkInCart: true` | **E** | Wholesale Gorilla hosted portal or supported headless contract | Do not reproduce until logged-in behavior and destination are tested. |

## Pages, campaigns, blog, and policies

| Item | Observed source | Class | Proposed destination | Notes |
| --- | --- | --- | --- | --- |
| Standard Page title/body/SEO | Shopify Page | **A** | Shopify Page | Applies only to content actually stored in Page body. |
| `/pages/our-story` composed content | Page plus theme sections | **A/E** | Page core plus typed editorial metaobjects | Export section JSON and image references. |
| `/pages/talon-ss` landing content | Page plus image-rich theme sections | **A/E** | Reusable editorial section metaobjects | Preserve URL and metadata. |
| `/pages/thunderbird-full-set` | Page plus theme sections and price copy | **A/E** | Structured sections; live price must query Shopify | Existing stale price copy must be resolved by content owner, not silently corrected. |
| `/pages/wedges` | Page plus theme/editorial content | **A/E** | Reusable rich-text/image/metaobject sections | Preserve Brian Symonds/signature-wedge attribution. |
| Contact body | Shopify Page/theme section | **A/E** | Shopify Page plus Next.js form implementation | Form submission/spam handling is functional architecture, not theme content. |
| Blog index/articles | Shopify Blog/Article | **A** | Shopify Blog/Article | Preserve empty `news` route and future schema capability. |
| Refund, privacy, and terms | Shopify Policy resources/routes | **A/E** | Shopify policy content or retained hosted routes | Choose rendering strategy only after verifying API access and legal ownership. |
| Privacy choices/data-sharing opt-out | Shopify privacy surface | **E** | Shopify-hosted privacy mechanism or approved integration | Must remain functional across storefront and checkout. |

## Theme code that must be treated as behavior, not content

The following should be documented and recreated as bounded Next.js behavior only after its source settings are exported:

- sticky/transparent header transitions;
- desktop mega-menu and mobile navigation behavior;
- predictive search drawer;
- product gallery, zoom, sticky Add to Cart, quick add, and variant-state URL handling;
- collection filter drawer and sort;
- cart drawer;
- carousel breakpoints and reduced-motion behavior;
- responsive art direction and image focal points.

Swiper and Impact theme JavaScript are implementation dependencies, not content sources. Their presence does not require copying those libraries.

## Theme/app injections that will disappear with Liquid

| Injection | Public evidence | Migration consequence |
| --- | --- | --- |
| Wholesale Gorilla | Liquid serializes `wsgData`, customer tags/rates, product restriction state, and loads `wholesalegorilla.app/shop_assets/wsg-index.js`; script reads theme DOM selectors. | It will not execute automatically in Next.js. Vendor-supported headless or hosted-portal routing is required. |
| AlphaLogic | Theme app embed loads announcement/savings code and intercepts cart requests to add a regular-price line attribute. | Shopify's actual sale prices survive; the bar, savings display, and line-attribute behavior do not. |
| GOVX | Theme app block injects CTA, CSS, popup handler, and hosted verification link. | Replace placement with the approved full GOVX link/popup contract; Shopify-issued code remains downstream. |
| Okendo | Theme app embed and app blocks render review UI. | Use Okendo's supported headless widget/metafield/API route; plan entitlement must be confirmed. |
| Shopify theme analytics loader | Liquid output initializes Shopify Web Pixels Manager and publishes storefront events. | A Next.js storefront needs an explicit analytics/consent implementation; checkout pixels remain Shopify-owned. |

## Required Admin export before implementation

**SHOPIFY ADMIN INVESTIGATION REQUIRED**

Obtain a read-only evidence package containing:

1. Published theme download, including `templates/*.json`, `sections/*`, `snippets/*`, `config/settings_data.json`, and assets.
2. Screenshot/export of every template assignment for products, collections, pages, blog, article, cart, search, and index.
3. All metafield and metaobject definitions plus values, including app-owned namespaces.
4. Navigation menu handles and complete nested items.
5. Theme app embed/block enablement and settings for Wholesale Gorilla, AlphaLogic, GOVX, and Okendo.
6. Search & Discovery filters, synonyms, boosts, and recommendations configuration.
7. Shopify policy and customer-privacy configuration.
8. A media manifest identifying source asset, mobile/desktop use, alt text, focal point, and owning section.

The result should be reconciled against this register. No Class B, C, or D migration should begin until each current value has a confirmed source and business owner.

