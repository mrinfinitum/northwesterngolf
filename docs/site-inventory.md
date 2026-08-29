# Northwestern Golf storefront inventory

Audit date: 2026-08-27  
Audited storefront: <https://northwestern.golf>  
Scope: public, read-only storefront inspection. No Shopify settings, DNS, production integrations, or storefront code were changed.

## Method and confidence

The inventory was built from the live HTML, theme CSS and JavaScript, Shopify sitemaps and robots rules, public product/collection JSON, native predictive-search responses, and an isolated temporary cart session. The available interactive browser runtime could not be started, so breakpoint and interaction findings were verified from the live responsive rules and DOM contracts rather than screenshot comparison. Items that cannot be proven without rendered-device testing or Shopify Admin access are explicitly marked.

Evidence labels used below:

- **Observed**: present in live markup, CSS, JSON, response headers, or a public endpoint.
- **Inferred from implementation**: behavior is defined by the live theme code but was not visually exercised.
- **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**: the public storefront does not expose ownership or configuration clearly enough to identify the source.

## Platform snapshot

- Shopify storefront, shop domain `r1kikk-am.myshopify.com`, public domain `northwestern.golf`.
- Published theme: Impact 6.11.2, theme name `Northwestern Site LIVE 2026`, theme ID `152014160035`.
- Currency and market observed: USD / United States.
- Catalog: 20 public products, one vendor (`Northwestern Golf`), empty Shopify product-type values, and tag-driven grouping.
- Blog exists at `/blogs/news` but currently has no articles.
- Customer accounts use Shopify's hosted new-customer-account experience.
- Checkout remains Shopify hosted.

## Route map

```text
/
├── /products/[handle]
├── /collections/[handle]
│   └── /products/[handle]         # alternate Shopify product path; canonical is /products/[handle]
├── /pages/[handle]
├── /blogs/[blog]
│   └── /[article]                 # template convention exists; no live articles in the current blog
├── /search
├── /cart
├── /account
│   └── /login                     # redirects to shopify.com hosted accounts
├── /policies/[policy]
├── /checkout                      # Shopify-hosted checkout
├── /robots.txt
├── /sitemap.xml
└── /404                           # representative missing URL returns an HTTP 404 theme page
```

### Page-template inventory

| Template | Representative URL | Observed state and notes |
|---|---|---|
| Homepage | `/` | Custom video hero, two image-overlay promos, featured collection, custom review scroller, custom footer. |
| Product | `/products/men-s-thunderbird-driver` | Available two-option product with invalid option combinations. |
| Product, sold out | `/products/men-s-talon-ss-full-set` | Two shaft variants; all unavailable; disabled Add to Cart. |
| Product, swatches | `/products/thunderbird-golf-bag` | Four bag-color variants, each associated with an image and color swatch. |
| Product, multi-value option | `/products/men-s-thunderbird-wedge` | Fixed shaft and five loft variants. |
| Collection | `/collections/mens-collection` | Seven products; native filters, sort, grid, product count. |
| Category collection | `/collections/drivers` | Three products; same template with a narrower price range. |
| Single-product collection | `/collections/wedges` | Exercises minimal collection state. |
| All-products collection | `/collections/all` | Exists and is linked from the homepage hero; not listed in the collection sitemap. |
| Nested product alias | `/collections/drivers/products/men-s-thunderbird-driver` | HTTP 200; canonical points to `/products/men-s-thunderbird-driver`. |
| Search | `/search?q=driver&type=product` | Native Shopify search; predictive search is enabled. |
| Cart drawer | Global header cart control | Configured as the primary cart interaction. |
| Cart page | `/cart` | Line items, order note, shipping estimator, total, checkout, payment icons. |
| Account/login | `/account/login` | Redirects to `shopify.com/72808693923/account...`; no theme-rendered login form. |
| Blog index | `/blogs/news` | Empty-state page; no article routes in the sitemap. |
| Article | `/blogs/news/[article]` | URL convention only; no representative article exists. |
| Contact | `/pages/contact` | Contact information and contact form. |
| Company/story | `/pages/our-story` | Brand history and core-values content. |
| Campaign landing page | `/pages/talon-ss` | Image-rich Talon SS landing content. |
| Campaign landing page | `/pages/thunderbird-full-set` | Full-set landing content and product-specific price copy. |
| Editorial/category landing | `/pages/wedges` | Brian Symonds/signature-wedge content. |
| Privacy choices | `/pages/data-sharing-opt-out` | Shopify privacy choices page. |
| Policy | `/policies/refund-policy` | Shopify policy template. |
| Policy | `/policies/privacy-policy` | Shopify policy template. |
| Policy | `/policies/terms-of-service` | Shopify policy template. |
| 404 | Any unknown handle | Proper HTTP 404 with themed empty state. |

No public FAQ page, dealer/store locator, loyalty page, subscription landing page, or promotional blog article was found in the sitemaps or global navigation.

### Sitemap-backed handles

Product handles follow audience + family + club conventions. The catalog comprises three Talon SS full sets; men's, women's, and senior's Thunderbird full sets, irons, fairways, drivers, and hybrids; one men's Thunderbird wedge; and one Thunderbird golf bag. The full product inventory is intentionally not duplicated here; developers should query Shopify by handle.

Public collection handles:

```text
drivers                 fairways                  golf-bags
hybrids                 irons                     mens-collection
senior-s-collection     symonds-wedges            talon-ss-full-set
thunderbird-full-set    wedges                    women-s-collection
northwestern-golf-inc   thunderbird               talon-ss
best-sellers
```

Public page handles:

```text
contact
data-sharing-opt-out
talon-ss
our-story
thunderbird-full-set
wedges
```

## Global site components

### Header

- No native announcement-bar section was found. An AlphaLogic app bar functions as the sitewide promotion: “Sitewide Sale: Take 30% Off All Products,” orange background, white 16 px text, approximately 12 px vertical padding, linked to `/collections/all`.
- Sticky `store-header`, `top: 0`, `z-index: 10`. Theme assets include transparent-header treatment and a light-logo alternative. Home CSS defines translucent blue `#3464826B` over transparent media and white `#FFFFFF` after fill/transition; rendered-device confirmation is still required.
- Logo: approximately 150 px wide on mobile and 200 px on larger screens; encoded image height is approximately 13/17 px in the header layout.
- Desktop navigation appears at 1150 px and above. Menu headings and child links:

  - Talon SS: men's, women's, senior's Talon SS full sets.
  - Thunderbird: men's, women's, senior's Thunderbird full sets.
  - Irons: men's, women's, senior's Thunderbird irons.
  - Woods: men's, women's, senior's Thunderbird fairways.
  - Driver: men's, women's, senior's Thunderbird drivers.
  - Hybrids: men's, women's, senior's Thunderbird hybrids.
  - Wedges: men's Thunderbird wedge.
  - Golf Bags: direct link to Thunderbird Golf Bag.

- Desktop child navigation uses hover-triggered `details/summary` dropdowns rather than a large image-led mega menu. Parent labels also carry data URLs to the Talon, Thunderbird, and Wedges landing pages.
- No separate secondary-navigation row or image-led mega-menu panel was observed.
- Search, account, and cart controls use icons with screen-reader labels. Account is hidden below 700 px; search and cart remain available. Cart includes a live count.
- Mobile/tablet navigation below 1150 px uses a left-opening drawer with nested panels, back buttons, social links, and an Account entry. The hamburger replaces the desktop link row.
- Search and cart are large theme drawers. Their detailed behavior appears under Search and Cart.

Proposed ownership, without implementation:

```text
components/layout/
  PromotionBar.tsx
  Header.tsx
  DesktopNavigation.tsx
  DropdownMenu.tsx
  MobileNavigation.tsx
  SearchButton.tsx
  AccountButton.tsx
  CartButton.tsx
```

### Footer

The footer is a custom theme section, not the stock Impact footer.

- Background `#F8F8F8`, top border `#E5E5E5`, maximum width approximately 1200 px, 15 px side padding, 50 px top and 20 px bottom spacing.
- Desktop: logo/social column plus three navigation groups with approximately 50 px gaps.
- Mobile at 768 px and below: columns stack and center; social spacing reduces from approximately 88 px to 40 px.
- Brand logo approximately 260 px wide.
- Social destinations: Facebook, Instagram, TikTok. The Instagram `href` contains a malformed trailing quote in the live footer and should be corrected during migration.
- About Us: Our Story, Contact.
- Collections: Talon SS Full Set, Thunderbird Full Set, Irons, Fairways, Drivers, Hybrids, Wedges, Golf Bags.
- Information: Return Policy, Privacy Policy, Terms & Conditions.
- Copyright: “© 2026 Northwestern Golf. All rights reserved.”
- No newsletter form, phone/address block, trust badge, or payment-icon row is present in the footer. Payment icons appear on the cart page instead.

```text
components/layout/
  Footer.tsx
  FooterBrand.tsx
  FooterNavigationGroup.tsx
  SocialLinks.tsx
```

## Homepage reverse engineering

### Section tree

```text
Homepage
├── AppPromotionBar
├── Header
├── VideoHero
├── JohnDalyImageOverlay
├── FeaturedCollection (“Most Wanted”)
├── DriverImageOverlay (“Send it like Daly.”)
├── TestimonialScroller (“Golfers Are Talking”)
└── Footer
```

Homepage geometry summary:

| Section | Width / columns | Surface treatment | Source confidence |
|---|---|---|---|
| Video hero | Full viewport width; one centered content layer | Full-bleed video, black backing, no border/radius/shadow | Custom theme section; Admin inspection needed for field ownership. |
| John Daly overlay | Full width; one overlaid content region | Art-directed photo, no visible border/radius/shadow | Theme image-overlay settings. |
| Most Wanted | Wide container, approximately 1460 px; two cards mobile and three around 1000 px+ | White cards/imagery on page surface; card radius approximately 6 px | Shopify collection selected by theme setting. |
| Driver overlay | Full width; one overlaid content region | Art-directed photo, no visible border/radius/shadow | Theme image-overlay settings. |
| Testimonials | Wide container, approximately 1460 px; one card mobile/three desktop | `#F8F8F8` band, white bordered/radiused/shadowed cards | Custom section blocks; Admin inspection needed. |

All image-overlay sections use dedicated mobile source files rather than a desktop image merely resized. Custom orange CTAs have square corners and short color transitions; commerce cards retain theme radii and hover behavior.

### 1. Video hero

- Purpose: primary brand/collection entry.
- Layout: full-bleed, black-backed video, centered white copy; 100 viewport-height desktop and 600 px below 750 px.
- Media: Shopify CDN MP4, 1080p, autoplay, muted, looping, inline playback, `object-fit: cover`.
- Copy: H1 “THE LEGACY LIVES ON.” and “SHOP NOW” linking to `/collections/all`.
- Type: 3.2 rem desktop; 2 rem mobile. Button uses orange `#F96F1E`, square corners, 10 × 32 px padding desktop and 4 × 20 px mobile; hover becomes black.
- Background/spacing: full bleed; button top margin approximately 26 px desktop/22 px mobile.
- Animation: video playback only; button color transition approximately 250 ms.
- Likely source: custom HTML/theme section settings. **SOURCE NEEDS SHOPIFY ADMIN INSPECTION** to distinguish hardcoded section markup from setting fields.

### 2. John Daly image overlay

- Purpose: celebrity partnership/brand campaign.
- Desktop media: `daly-shot.jpg`, 2000 × 1000. Mobile media: `nwxdaly-m-top.jpg`, 975 × 1438. Separate source crops are intentional and must be preserved.
- Copy: John Daly × Northwestern logo, H2 “Grip It. Rip It. Afford It.”, supporting line “Built for performance, priced for the people.”, and “Shop Clubs.”
- Desktop: full-width background, content aligned toward top/start, logo image approximately 70% of the content block, top padding approximately 10%.
- Mobile: centered, max copy width 340 px (310 px at 420 px and below), minimum height 620 px (590 px at 420 px and below), 24/20 px horizontal padding and 34/30 px bottom padding.
- Button: minimum width 170 px on mobile. The live CTA is a `button` without an observed destination; treat this as a possible broken CTA until interactive/admin verification.
- Background overlay opacity is effectively zero; white copy depends directly on the photo.
- Likely source: Shopify theme image-with-text-overlay section and image settings.

### 3. Featured collection — “Most Wanted”

- Purpose: shoppable bestseller/featured-products rail.
- Source: collection-driven; “View all” links to `/collections/mens-collection`.
- Representative sequence: men's Thunderbird full set, irons, hybrid, wedge, driver, fairway.
- Layout: scrollable carousel/grid; two items per row/viewport on small and tablet widths, three at approximately 1000 px and up in this homepage section.
- Cards: image, save-dollar badge, title, sale price, compare-at price, secondary-image hover, and quick add. No vendor, visible reviews, wishlist, or visible card swatches.
- Interaction: multi-variant products open quick-buy UI; single-variant products can add directly. Desktop quick-add appears on pointer hover; mobile retains an icon control.
- Likely source: Shopify collection + product/variant data, configured by a theme section setting.

### 4. Driver image overlay

- Purpose: product-specific driver campaign.
- Desktop media: `daly-swing-soft-focus.jpg`, 2359 × 1000. Mobile media: `daly-swing-closeup-m2.jpg`, 1329 × 1000.
- Copy: “Send it like Daly.” and “SHOP NOW,” linked to `/products/men-s-thunderbird-driver`.
- Responsive layout mirrors the preceding image-overlay section: 620/590 px mobile minimum height and dedicated crop.
- Likely source: Shopify theme image-with-text-overlay section settings.

### 5. Testimonial scroller

- Purpose: social proof; visually distinct from the Okendo product-review widget.
- Copy: eyebrow “Customer Reviews,” H2 “Golfers Are Talking,” supporting sentence, nine hardcoded review cards.
- Background `#F8F8F8`; maximum width approximately 1460 px; vertical spacing 80 px desktop/56 px mobile.
- Desktop at 1000 px+: three cards. Intermediate sizes use cards at least 310 px wide. Mobile: one full-width card.
- Card: white, 1 px `rgba(26,26,26,.12)` border, 30 px desktop/24 px mobile padding, approximately 310/300 px minimum height, shadow `0 12px 30px rgba(26,26,26,.08)`.
- Stars `#FFCF2A`; arrow hover `#FF711F`; arrows hidden on mobile.
- Interaction: advances every three seconds, smooth horizontal scroll, previous/next controls, pauses on mouse enter and resumes on mouse leave. There is no observed pause/play control, creating an accessibility concern.
- Likely source: custom theme section content. It does not appear to be populated by the live Okendo widget. **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**.

## Product architecture

### Catalog-wide model

- Vendor is uniformly `Northwestern Golf`; Shopify `productType` is blank.
- Public tags: Drivers, Fairway, Full Set, Golf Bags, Hybrids, Irons, Men, Retail, Senior, Talon SS, Thunderbird, Wedges, Women.
- Option names observed across all public products: `Shaft Flex`, `Loft`, `Bag Color`.
- Current product prices are uniform across variants within each product, but implementation must not assume that remains true.
- Compare-at prices drive the sale display and dollar-savings badge.
- No selling-plan/subscription data was present in public product data.
- Product descriptions contain legacy Elementor class markup on several items. Sanitize and normalize HTML without silently dropping content.

### Shared product-page layout

- Product section background `#F8F8F8`; fields/cards use white surfaces.
- Below 1000 px: one-column media followed by information. At 1000 px+: approximately `1.1fr / 0.9fr`; product information becomes sticky below the sticky header.
- Media gallery uses rounded 12 px frames, mobile dots/horizontal carousel, thumbnails on larger layouts, click-to-zoom through PhotoSwipe, and responsive Shopify CDN images.
- Product information includes title, sale/compare pricing, variant selectors, quantity, payment terms where eligible, Add to Cart, warranty/trust callouts, and accordions.
- Vendor, SKU, and stock quantity are available in Shopify data but were not visibly rendered in the audited purchase area. An empty rating insertion point exists near the top; full Okendo reviews appear lower on the page.
- No visible dynamic Buy Now button, subscription selector, pickup availability, backorder notice, or low-stock quantity message was observed.
- A sticky quick-add pattern exists: full-width bottom control on mobile and an approximately 35 rem floating product summary at lower right on desktop.
- Supporting content includes product-specific editorial theme sections and a “You may also like” related-products area. Theme JavaScript supports recently-viewed state, but a rendered recently-viewed section was not confirmed on the representative pages.

### Representative product 1: Men’s Talon SS Full Set

URL: `/products/men-s-talon-ss-full-set`

- Price: $489.99; compare at $699.99.
- Availability: sold out across both variants.
- Options: Shaft Flex → Steel S (`NTABmSS`) and Steel R (`NTABmSR`).
- Media: 16 images, predominantly square 3000 × 3000; no video. No variant-specific featured image in public product JSON.
- Selection effect: changes variant ID/SKU and URL query; does not change observed price or image. Add to Cart remains disabled with “Sold out.”
- Supporting accordions: “ABOUT THIS SET,” “WHAT'S INCLUDED,” “SHIPPING & RETURNS.”
- Callouts include one-year warranty/trust messaging.

### Representative product 2: Men’s Thunderbird Driver

URL: `/products/men-s-thunderbird-driver`

- Price: $209.99; compare at $299.99; $90 savings.
- Options: Shaft Flex → Graphite R / Graphite S; Loft → 10.5 Degree / 9.5 Degree.
- Only two valid combinations exist: R + 10.5 (`NTMD105GR`) and S + 9.5 (`NTMD95GS`). The incompatible loft is disabled after a shaft selection.
- Both variants are available and share price/media. Selection updates `?variant=[variant-id]`, availability, and add-to-cart form state.
- Media: six square 3000 × 3000 images, no video or variant-specific image.
- Short marketing line appears separately from the Shopify description: “UNLEASH THE THUNDER...” The ownership of this content **NEEDS SHOPIFY ADMIN INSPECTION**.
- Shop Pay installment message: four payments of approximately $52.49 at the audited price.
- Purchase controls: quantity and Add to Cart. No visible Buy Now, subscription, pickup, or stock-count UI.
- Callouts: “1-YEAR WARRANTY” and “TRUSTED SINCE 1929.”
- Accordions: About this club; What's included; Shipping & returns. Specification content includes loft, lie, length, right-hand-only, shaft, and grip details.
- GOVX eligibility/discount block appears on the page.

### Representative product 3: Thunderbird Golf Bag

URL: `/products/thunderbird-golf-bag`

- Price: $118.99; compare at $169.99.
- Option: Bag Color → Navy (`NTNNGB`), Black (`NTNBGB`), Gray (`NTNGGB`), Green (`NTNGNGB`).
- Each variant maps to a featured image. Observed swatch colors: Navy `#282099`, Black `#000000`, Gray `#808080`, Green `#05AA3D`.
- All variants are available and share price. Selection updates the variant URL/state and displayed featured media.
- Media: 17 images. The first is portrait 1356 × 1652; most others are square, 800–2000+ px. Public alt data is missing on most images, with only a small minority carrying descriptive text.
- Accordions: “ABOUT THIS BAG,” “WHAT'S INCLUDED,” “SHIPPING & RETURNS.”

### Supporting sample: Men’s Thunderbird Wedge

- Price $55.99, compare at $79.99.
- Fixed Shaft Flex `Steel W`; Loft values 52, 54, 56, 58, 60; five available SKUs.
- This validates a selector where one nominal option is fixed and the second drives the actual variant.

### Proposed ProductPage tree

```text
ProductPage
├── Breadcrumbs
├── ProductMain
│   ├── ProductGallery
│   │   ├── ProductMedia
│   │   ├── GalleryThumbnails
│   │   ├── GalleryDots
│   │   └── MediaZoomDialog
│   └── ProductInfo
│       ├── ProductTitle
│       ├── ProductRatingSummary
│       ├── ProductPrice
│       ├── InstallmentTerms
│       ├── VariantSelector
│       │   ├── OptionButtons
│       │   └── ColorSwatches
│       ├── QuantitySelector
│       ├── AddToCart
│       ├── GovxEligibility
│       └── ProductTrustCallouts
├── ProductAccordions
├── ProductEditorialSections
├── ProductReviews
├── RelatedProducts
└── StickyAddToCart
```

## Collection-page audit

Representative URLs: `/collections/mens-collection`, `/collections/drivers`, `/collections/wedges`.

- Centered collection heading in the large display style. Representative collections do not visibly render a description or hero banner, although a collection image may be used for Open Graph metadata.
- Product count is shown; `/collections/mens-collection` contains seven items.
- Grid: two columns on mobile and at 700 px; two content columns alongside the filter sidebar around 1000 px; three product columns from approximately 1200 px upward.
- Desktop filter sidebar appears from 1000 px. Mobile uses a filter/sort drawer.
- Exact exposed filters:

  - Availability → In stock (`filter.v.availability`).
  - Price → minimum/maximum (`filter.v.price.gte`, `filter.v.price.lte`), bounded by collection price range.

- No exposed Brand, Product Type, Color, Size, Category, Rating, or audience filter was observed.
- Filter syntax and native facet markup are consistent with Shopify storefront filtering/Search & Discovery. **SOURCE NEEDS SHOPIFY ADMIN INSPECTION** to confirm whether Search & Discovery manages the configuration.
- Sort options: Featured/manual, Most relevant where applicable, Best selling, Alphabetically A–Z/Z–A, Price low–high/high–low, Date old–new/new–old.
- No infinite scroll or Load More behavior was found. Theme pagination markup/styles exist, but the small current catalog did not exercise a multi-page collection; page-size settings **NEED SHOPIFY ADMIN INSPECTION**.
- Product card supports quick add/quick buy, sale badges, and secondary-image hover. No quick-view modal distinct from quick buy was confirmed.

## Product card audit

- Media: generally square catalog artwork with natural aspect-ratio support and `object-fit: contain`; the second image swaps/fades on pointer hover and may use a fill treatment.
- Content: product title, sale price, compare-at price, save-dollar badge. Vendor, rating stars, wishlist, availability text, and card-level color swatches are not visibly rendered in the audited collection/home cards.
- Corners: approximately 6 px at the card/image boundary. Some theme layouts visually blend the information surface into the card.
- Quick add: approximately 36 px icon on touch/mobile. On precise pointers the control translates/fades into view over roughly 200 ms. Single-variant products submit directly; multi-variant products open quick-buy selection UI.
- Sold-out products use theme sold-out state/badge and cannot add.
- Mobile retains the two-column grid and touch-safe quick-add control; it does not rely on hover for essential information.

Required Storefront API fields for `ProductCard.tsx`:

```text
Product.id, handle, title, availableForSale
Product.featuredImage { url, width, height, altText }
Product.images(first: 2) { nodes { url, width, height, altText } }
Product.priceRange { minVariantPrice, maxVariantPrice }
Product.compareAtPriceRange { minVariantPrice, maxVariantPrice }
Product.options { id, name, optionValues }
Product.variants { id, title, availableForSale, selectedOptions,
                   price, compareAtPrice, image, quantityAvailable? }
Product.tags / badge metafield only if the existing badge source requires them
```

The savings badge should be computed from money values, not scraped text. `quantityAvailable` should only be requested if Shopify permissions and business rules allow stock messaging.

## Cart audit

### Existing behavior

- The primary global cart is a large right-side drawer; `/cart` is also a complete page.
- Empty drawer: cart icon/count, “Your cart is empty,” Continue shopping to `/collections/all`.
- Populated drawer: thumbnail, title, variant title, sale price, quantity control, remove link, total, tax/shipping note, and checkout button.
- Free-shipping progress bar is enabled but its public threshold is `0`, so it immediately says “You are eligible for free shipping.” Confirm whether this is intentional.
- Drawer has no currently rendered discount-code input, upsell, recommendation, order note, gift option, or shipping estimator.
- Cart page adds an order-note textarea and country/province/postal-code shipping estimator.
- Cart page payment icons: American Express, Apple Pay, Diners Club, Discover, Google Pay, Mastercard, PayPal, Shop Pay, Visa.
- No visible cart-page coupon field, gift wrapping, recommendation, or upsell was observed.
- Accelerated checkout assets are loaded, but Wholesale Gorilla CSS hides additional checkout buttons and Shopify payment buttons for applicable wholesale behavior. The visible primary action is Checkout.

### Proposed Storefront Cart API architecture

```text
CartProvider (client state and optimistic status)
├── CartButton / CartCount
├── CartDrawer
│   ├── FreeShippingProgress
│   ├── CartItemList
│   │   └── CartItem
│   │       ├── CartLineImage
│   │       ├── CartLineDetails
│   │       └── QuantitySelector / RemoveLine
│   └── CartSummary
└── CartPage
    ├── CartItemList
    ├── OrderNote
    ├── ShippingEstimator
    ├── PaymentIcons
    └── CartSummary
```

- Store the Shopify cart ID in a secure, HTTP-only, same-site cookie; never expose an Admin token.
- Use Storefront API `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, and `cartNoteUpdate` through server actions/route handlers.
- Use optimistic UI for quantity/count, then reconcile to Shopify's returned cart and user errors.
- Always use Shopify's returned `checkoutUrl` for checkout handoff. Preserve buyer identity/market/country context.
- Wholesale pricing, customer tags, discounts, GOVX, and cart transforms must be validated before treating Storefront Cart API totals as equivalent to the theme cart.

## Search audit

- Header opens a large search drawer with a labeled search input, placeholder “Search for...,” Clear, and Close.
- `predictiveSearch` is enabled. Native `/search/suggest.json` returns grouped products, collections, pages, and articles.
- Example query `th` returned Thunderbird products, Thunderbird collections, a Thunderbird landing page, and no articles. Result URLs include Shopify tracking query parameters.
- Full search page includes search input, product-result count/tab, product grid, Availability and Price filters, mobile filter drawer, and relevance/price sorting.
- Example `driver` product search returned 20 results because Shopify's native matching is broad across product text; relevance quality should be tested with an agreed query set.
- Empty-state and no-result rendering are part of the native theme template, though no custom suggested-search merchandising was observed.
- No public Algolia, Searchspring, or active Boost search asset was found. Theme compatibility selectors alone are not evidence of an installed provider. Native Shopify search is the observed source.

Recommended parity approach: use Storefront API predictive search/search where feature coverage permits, retain resource grouping, debounce input, cancel stale requests, and preserve a complete `/search?q=` route. Do not introduce a third-party provider without a measured relevance requirement.

## Responsive behavior inventory

The live theme's principal breakpoints are 700, 1000, 1150, 1400, and 1600 px, with custom section exceptions at 420, 749/750, and 768 px.

| Width | Observed/defined changes |
|---|---|
| 375 px | Hamburger navigation; no account icon; search/cart visible; 150 px logo; 600 px video hero; dedicated mobile campaign crops; two-column collection cards; one testimonial card; one-column PDP with horizontal media/dots; mobile filter and cart drawers; mobile sticky Add to Cart. |
| 430 px | Same mobile structure; image overlays use 620 px minimum height instead of the ≤420 px 590 px override; two-column product grids remain. |
| 768 px | Account icon becomes visible; header still uses drawer navigation; gutters increase to 32 px; custom video hero switches to viewport height just above 749 px; collection remains two columns; PDP remains one column until 1000 px. |
| 1024 px | Header still uses hamburger until 1150 px; PDP becomes two columns with sticky info; collection gets desktop sidebar plus two product columns; testimonial section shows three cards. |
| 1440 px | Full desktop navigation; approximately 48 px page gutters; three-column collection content; largest typography/section spacing; PDP media/info layout remains. |

Suggested Tailwind screens for faithful recreation:

```text
xs: 430px      # only where custom mobile art/layout needs it
sm: 700px
md: 1000px
lg: 1150px
xl: 1400px
2xl: 1600px
```

Keep component-specific `max-width: 749px` and `max-width: 768px` media rules where exact art direction requires them; forcing every rule into generic screens would reduce fidelity.

## Interaction and animation inventory

| Interaction | Existing behavior | Suggested implementation class |
|---|---|---|
| Sticky/transparent header | Sticky; home transparency/fill styles are present. | CSS sticky + small React state/IntersectionObserver only if fill transition is confirmed. |
| Desktop dropdown | Hover/focus `details/summary` menu. | CSS for presentation; React for reliable open/close and Escape/outside click. |
| Mobile navigation | Left drawer with nested panels/back navigation. | React state + accessible dialog/drawer semantics. |
| Search | Large drawer with predictive results. | React state + Shopify API interaction + Next navigation. |
| Cart | Right drawer and separate page. | React state + Shopify Storefront Cart API. |
| Product card hover | Secondary image and quick-add reveal. | CSS only; touch control always available. |
| Quick buy | Multi-variant selection drawer. | React state + Storefront Cart API. |
| Product media | Swipe/scroll, thumbnails, dots, zoom dialog. | React state; native scroll-snap and accessible dialog are sufficient. |
| Variant selection | Disables impossible combinations, updates URL/media/price/state. | React state + `history.replaceState`/Next router; no server mutation until cart add. |
| Accordions | Expand/collapse supporting content. | Native `details` or small React state. |
| Sticky Add to Cart | Mobile full-width and desktop floating summary. | CSS sticky/fixed + IntersectionObserver/React visibility state. |
| Testimonials | Auto-scroll every 3 s, arrows desktop, hover pause. | React timer + scroll-snap; add reduced-motion and pause handling. |
| Homepage video | Autoplay muted loop. | Native video; respect reduced motion/data preferences where practical. |
| Product recommendations | Related-products rail/grid. | Shopify recommendations API or explicitly modeled references. |

No general-purpose animation library is necessary for observed behavior.

## Image and media strategy

- Product media is served from Shopify CDN with responsive width parameters and `srcset`; first/LCP media is eager/high priority while later images are lazy loaded.
- Product images are commonly 1200–3000 px square. The golf bag proves the gallery must support non-square media without distortion.
- Product cards use contained imagery and a secondary hover image. Preserve the source aspect ratio rather than globally forcing a crop.
- Homepage art direction is deliberate: desktop and mobile image files differ for both John Daly panels.
- Video hero uses a Shopify-hosted 1080p MP4, full bleed and `object-fit: cover`.
- Collection social images are commonly square 2000 px; a visible collection hero was not found.

For `next/image` later:

- Allow only the required Shopify CDN hosts through `remotePatterns`.
- Keep Shopify's CDN URL and request width-appropriate variants; do not download the catalog during migration.
- Set `sizes` per component: roughly two-column mobile cards, two/three-column desktop grids, and approximately 55% desktop PDP media.
- Mark only true above-the-fold LCP media as priority; lazy load subsequent gallery/card images.
- Use `<picture>` or separate `Image` sources for the homepage's mobile art direction.
- Preserve Shopify alt text, but first remediate missing/repetitive product-media alt text in Admin. Decorative background art should remain empty-alt/hidden from assistive technology.

## Accessibility observations

Positive patterns:

- Icon controls include screen-reader labels.
- Navigation and drawers expose `aria-controls`/expanded state and close controls.
- Variant choices are grouped and color swatches have text equivalents.
- Price/sale states include screen-reader-oriented labels.
- Keyboard `:focus-visible` styles and semantic progress-bar markup exist in the base theme.

Migration opportunities to track separately from visual fidelity:

- Homepage includes a logo wrapped in H1 plus the hero H1, creating multiple H1s.
- Refund policy renders “Refund policy” and “30-Day Return Policy” as two H1s.
- The empty blog page does not present a clear conventional blog-title H1.
- Most product-media records lack useful alt text; title fallback repeats the same text across many images.
- Footer Instagram URL contains a malformed trailing quote.
- Auto-advancing testimonials lack an observed explicit pause control and only pause on mouse hover.
- Custom carousel arrows/buttons and transparent-header contrast require keyboard and contrast checks in a rendered browser.
- White text over unshaded photography has no overlay; contrast varies with crop.
- Contact form label/error/focus behavior and all drawer focus traps require device/assistive-technology QA.
- Decorative star characters should have an accessible review-value label and avoid repetitive announcements.

## Content-source summary

| Content | Best-supported source |
|---|---|
| Title, description, price, compare-at, SKU, variants, availability, product media | Shopify Product/Variant. |
| Collection membership and headings | Shopify Collection; membership appears driven by tags/manual rules. |
| Header navigation | Shopify Menu. |
| Footer navigation/logo/social content | Custom theme section settings; **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |
| Homepage hero/video/overlay panels | Theme section settings/custom HTML; **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |
| Homepage featured products | Shopify Collection selected in theme settings. |
| Homepage testimonials | Custom theme section blocks, apparently hardcoded; **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |
| Product accordions, short marketing lines, editorial layouts, badges/callouts | Theme settings, metafields, or app blocks cannot be distinguished publicly; **SOURCE NEEDS SHOPIFY ADMIN INSPECTION**. |
| Product reviews | Okendo integration. |
| Pages and policies | Shopify Page/Policy content plus theme sections. |
| Promotion bar | AlphaLogic Bulk Discount Manager app configuration. |
| Filtering/predictive search | Native Shopify search/facets; Admin configuration needs confirmation. |

## Known content/data inconsistencies

- `/pages/thunderbird-full-set` advertises men's at $949.99 and women's/senior's at $999.99, while live products are $769.99 at audit time. Landing-page price copy is stale or reflects a different pricing basis.
- Public descriptions retain WordPress Elementor wrapper classes, indicating migrated legacy HTML that should be sanitized carefully.
- The free-shipping bar's threshold is zero.
- Instagram footer link markup is malformed.
- `/collections/all` is strategically linked but omitted from the collection sitemap by Shopify.

These should be resolved in content/admin planning, not silently “fixed” by a headless implementation.
