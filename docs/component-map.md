# Proposed Next.js component map

Status: architecture proposal only. No components or routes have been implemented.

The map prioritizes visual parity, Shopify-owned commerce data, reusable presentation primitives, and clear isolation of app integrations. Page components should compose shared sections rather than duplicate markup by product, collection, or landing handle.

## Route composition

```text
app/
├── layout                         # promotion, header, cart/search portals, footer
├── page                           # homepage section composition
├── products/[handle]/page         # ProductPage
├── collections/[handle]/page      # CollectionPage
├── collections/[handle]/products/[productHandle]
│   └── page                       # resolve/redirect or render with base-product canonical
├── pages/[handle]/page            # ContentPage / mapped campaign layouts
├── blogs/[blog]/page              # BlogIndexPage
├── blogs/[blog]/[article]/page    # ArticlePage
├── search/page                    # SearchPage
├── cart/page                      # CartPage
├── account/...                    # hosted Shopify handoff/callback plan
├── policies/[handle]/page         # PolicyPage
├── sitemap                        # sitemap generation/proxy strategy
├── robots                         # robots policy
└── not-found                      # themed 404
```

Exact file/API conventions must be checked against the installed Next.js documentation before implementation, per repository instructions. This document describes ownership, not code syntax.

## Component directory

```text
components/
├── layout/
│   ├── PromotionBar
│   ├── Header
│   ├── HeaderLogo
│   ├── DesktopNavigation
│   ├── NavigationDropdown
│   ├── MobileNavigation
│   ├── MobileNavigationPanel
│   ├── SearchButton
│   ├── AccountButton
│   ├── CartButton
│   ├── Footer
│   ├── FooterBrand
│   ├── FooterNavigationGroup
│   └── SocialLinks
├── commerce/
│   ├── Money
│   ├── ProductPrice
│   ├── ProductBadge
│   ├── ProductCard
│   ├── ProductCardMedia
│   ├── ProductCardQuickAdd
│   ├── ProductGrid
│   ├── ProductCarousel
│   ├── ProductGallery
│   ├── GalleryThumbnails
│   ├── GalleryDots
│   ├── MediaZoomDialog
│   ├── VariantSelector
│   ├── OptionButtonGroup
│   ├── ColorSwatchGroup
│   ├── QuantitySelector
│   ├── AddToCart
│   ├── StickyAddToCart
│   ├── InstallmentTerms
│   ├── ProductTrustCallouts
│   ├── ProductAccordions
│   ├── ProductRecommendations
│   └── RecentlyViewedProducts
├── collection/
│   ├── CollectionHeader
│   ├── CollectionToolbar
│   ├── CollectionProductCount
│   ├── CollectionFilters
│   ├── CollectionFilterGroup
│   ├── PriceRangeFilter
│   ├── AvailabilityFilter
│   ├── CollectionSort
│   ├── MobileFilterDrawer
│   └── CollectionPagination
├── cart/
│   ├── CartProvider
│   ├── CartDrawer
│   ├── CartEmptyState
│   ├── CartItemList
│   ├── CartItem
│   ├── CartLineImage
│   ├── CartLineDetails
│   ├── CartSummary
│   ├── FreeShippingProgress
│   ├── OrderNote
│   ├── ShippingEstimator
│   ├── PaymentIcons
│   └── CheckoutButton
├── search/
│   ├── SearchDrawer
│   ├── SearchForm
│   ├── PredictiveSearchResults
│   ├── PredictiveProductResult
│   ├── PredictiveResourceGroup
│   ├── SearchResults
│   ├── SearchTabs
│   └── SearchEmptyState
├── content/
│   ├── VideoHero
│   ├── ImageOverlay
│   ├── FeaturedCollection
│   ├── TestimonialScroller
│   ├── RichText
│   ├── ImageText
│   ├── PromoGrid
│   ├── ValueGrid
│   ├── ContactForm
│   ├── BlogCard
│   ├── ArticleHeader
│   └── PolicyContent
├── integrations/
│   ├── OkendoReviews
│   ├── OkendoRatingSummary
│   ├── GovxEligibility
│   ├── WholesaleBoundary
│   ├── AnalyticsProvider
│   └── ConsentBoundary
├── seo/
│   ├── Breadcrumbs
│   ├── JsonLd
│   ├── ProductJsonLd
│   ├── OrganizationJsonLd
│   └── ArticleJsonLd
└── ui/
    ├── Button
    ├── IconButton
    ├── Input
    ├── Textarea
    ├── Select
    ├── Checkbox
    ├── RadioGroup
    ├── Badge
    ├── Accordion
    ├── Dialog
    ├── Drawer
    ├── Spinner
    ├── VisuallyHidden
    └── Icon
```

## Global shell

```text
RootLayout
├── AnalyticsProvider / ConsentBoundary
├── PromotionBar
├── Header
│   ├── MobileNavigation trigger
│   ├── HeaderLogo
│   ├── DesktopNavigation
│   │   └── NavigationDropdown
│   └── SearchButton / AccountButton / CartButton
├── Main
├── SearchDrawer
├── CartDrawer
└── Footer
    ├── FooterBrand / SocialLinks
    └── FooterNavigationGroup × 3
```

The cart and search drawers are globally mounted so state persists across Next.js navigation. The account control should initially link through the proven Shopify hosted-account flow. PromotionBar needs an integration-owned content source until AlphaLogic behavior is resolved.

## Homepage

```text
HomePage
├── VideoHero
├── ImageOverlay (John Daly partnership)
├── FeaturedCollection
│   └── ProductCarousel
│       └── ProductCard × N
├── ImageOverlay (driver campaign)
└── TestimonialScroller
    └── TestimonialCard × 9
```

Use one `ImageOverlay` with configuration for desktop/mobile assets, alignment, logo/copy, CTA, overlay opacity, and crop. Do not create a separate component for each Daly panel.

`FeaturedCollection` should accept a Shopify collection reference and reuse the same `ProductCard` as collection/search/recommendation surfaces, with view-context props limited to layout differences.

## Product page

```text
ProductPage
├── Breadcrumbs
├── ProductMain
│   ├── ProductGallery
│   │   ├── GalleryThumbnails
│   │   ├── ProductMedia
│   │   ├── GalleryDots
│   │   └── MediaZoomDialog
│   └── ProductInfo
│       ├── ProductTitle
│       ├── OkendoRatingSummary
│       ├── ProductPrice
│       ├── InstallmentTerms
│       ├── VariantSelector
│       │   ├── OptionButtonGroup
│       │   └── ColorSwatchGroup
│       ├── QuantitySelector
│       ├── AddToCart
│       ├── GovxEligibility
│       └── ProductTrustCallouts
├── ProductAccordions
├── ProductEditorialSections
├── OkendoReviews
├── ProductRecommendations
└── StickyAddToCart
```

Product state contract:

- Server-render product content, metadata, canonical, initial selected variant, and JSON-LD.
- A client `ProductSelection` boundary owns option selection, valid-combination resolution, selected image, quantity, current money/availability, variant query, and Add to Cart status.
- The selected variant object—not independent option strings—is the purchase identity.
- `ProductGallery` supports image now and remains ready for Shopify video/model media without exposing unsupported controls.
- `ProductAccordions` receives structured entries after Admin source mapping; it must not scrape description HTML.
- Integrations are isolated so an Okendo/GOVX failure does not break the purchase form.

## Product card

```text
ProductCard
├── ProductCardMedia
│   ├── PrimaryImage
│   ├── SecondaryImage
│   ├── ProductBadge
│   └── ProductCardQuickAdd
└── ProductCardInfo
    ├── ProductTitleLink
    └── ProductPrice
```

One component serves homepage featured collection, collection grids, search results, related products, and recently viewed. Context controls only presentational needs such as image sizes or carousel semantics.

Data contract:

```text
id, handle, title, availableForSale
featuredImage, secondImage
priceRange, compareAtPriceRange
options, variants required for quick-add behavior
computed badge inputs
```

Do not render vendor/reviews/swatches in the base card because the existing card does not. If later requirements add them, use explicit feature flags/layout variants rather than hidden data-dependent markup.

## Collection page

```text
CollectionPage
├── Breadcrumbs
├── CollectionHeader
├── CollectionToolbar
│   ├── CollectionProductCount
│   ├── MobileFilterDrawer trigger
│   └── CollectionSort
├── CollectionContent
│   ├── CollectionFilters
│   │   └── CollectionFilterGroup
│   └── ProductGrid
│       └── ProductCard × N
└── CollectionPagination
```

Filter and sort state belongs in the URL so results are shareable and server render correctly. Parse only an allow-listed mapping to Shopify's supported filters; preserve unrelated analytics parameters without treating them as search identity. On mobile the same filter definitions render inside `Drawer`, not a second implementation.

## Search

```text
SearchDrawer
├── SearchForm
└── PredictiveSearchResults
    ├── PredictiveResourceGroup: Products
    ├── PredictiveResourceGroup: Collections
    ├── PredictiveResourceGroup: Pages
    └── PredictiveResourceGroup: Articles

SearchPage
├── SearchForm
├── SearchTabs / result count
├── CollectionToolbar-style filters and sort
├── SearchResults
│   └── ProductGrid / content result lists
└── SearchEmptyState
```

Reuse `ProductCard`, `CollectionFilters`, sort primitives, and pagination. Predictive results should use compact result components, not full cards. The drawer owns debounce/cancellation/keyboard selection; submitting navigates to the full search route.

## Cart

```text
CartProvider
├── CartButton / CartCount
├── CartDrawer
│   ├── CartEmptyState OR CartItemList
│   ├── FreeShippingProgress
│   └── CartSummary / CheckoutButton
└── CartPage
    ├── CartItemList
    ├── OrderNote
    ├── ShippingEstimator
    ├── CartSummary / CheckoutButton
    └── PaymentIcons
```

`CartItem` and `CartSummary` are shared between drawer and page. Mutations run server-side and return the canonical Shopify cart fragment. The client provider manages optimistic status and drawer visibility, not price calculations. Wholesale/GOVX/discount state must be represented through Shopify/app responses rather than component conditionals based on guessed tags.

## Content pages

### Generic Shopify page

```text
ContentPage
├── Breadcrumbs
├── PageHeader
└── RichText
```

### Campaign/brand page

```text
CampaignPage
├── Breadcrumbs
└── ContentSectionRenderer
    ├── ImageOverlay
    ├── ImageText
    ├── RichText
    ├── FeaturedCollection
    ├── PromoGrid
    └── ValueGrid
```

Use a finite typed section registry after the current theme content has been mapped to Shopify-readable data. Avoid a generic “render arbitrary Liquid/HTML” system and avoid a unique React component per handle.

### Blog/article

```text
BlogIndexPage
├── PageHeader
├── BlogCardGrid OR EmptyState
└── Pagination

ArticlePage
├── Breadcrumbs
├── ArticleHeader
├── ArticleContent
├── ArticleShareLinks
└── RelatedArticles (only if current/future requirement)
```

## Server/client boundaries

Prefer server-rendered components/data for:

- layout content and navigation;
- home/collection/page/blog content;
- product detail and initial variant;
- search result pages;
- metadata, canonical links, and JSON-LD;
- policy content.

Use client state only for:

- drawers/dialogs and nested mobile navigation;
- predictive search input/keyboard state;
- variant selection and media synchronization;
- quantity/Add to Cart pending state;
- gallery carousel/zoom;
- filters before navigation/submission;
- cart optimistic state;
- auto-scrolling testimonials and sticky-header/add-to-cart visibility.

This prevents the entire storefront becoming a hydrated client application while preserving interaction parity.

## Data and service modules

```text
lib/
├── shopify/
│   ├── client
│   ├── fragments/
│   │   ├── money
│   │   ├── image-media
│   │   ├── product-card
│   │   ├── product-detail
│   │   ├── collection
│   │   ├── cart
│   │   └── seo
│   ├── products
│   ├── collections
│   ├── menus
│   ├── pages
│   ├── blogs
│   ├── search
│   ├── cart
│   └── recommendations
├── integrations/
│   ├── okendo
│   ├── govx
│   ├── wholesale
│   └── analytics
├── seo/
│   ├── metadata
│   ├── json-ld
│   └── urls
├── content/
│   └── section-normalization
└── validation/
    └── environment
```

Do not implement app modules until vendor/Admin investigation defines their contracts.

## UI primitive rules

- `Button` owns theme primary/secondary/outline/subdued and size tokens; campaign CTA remains an explicit square style.
- `Drawer` owns focus trap, Escape, outside click, scroll lock, labeling, return focus, and animation. Navigation/search/cart compose it.
- `Dialog` owns the same accessibility contract for media zoom/modals.
- `Accordion` should use native semantics where possible and accept rich content without coupling to product data.
- `Money` owns locale/currency formatting only; Shopify owns amounts.
- `Image` wrappers own responsive `sizes`, aspect-ratio containment, alt, and priority policy per context.
- `Icon` uses the existing simple inline SVG vocabulary; do not add a general icon dependency without need.

## Reuse decisions

| Pattern | Reuse approach |
|---|---|
| Homepage and collection product cards | Same `ProductCard`; context-specific `sizes` and carousel/grid wrapper. |
| Related/recently viewed products | Same `ProductCard` and `ProductCarousel/Grid`. |
| Collection and search filters | Same filter primitives populated by each Shopify response. |
| Search/cart/mobile panels | Shared accessible `Drawer`, separate domain components. |
| Two Daly panels | One configurable `ImageOverlay`. |
| Product accordions and generic FAQs | Same `Accordion` primitive; different typed content adapters. |
| Drawer/page cart lines | Same `CartItem`/summary; different layout wrappers. |
| Product and social image rendering | Shared responsive image policy, context-specific aspect/crop. |
| Metadata/schema | Shared Shopify-to-SEO mapping, template-specific schema builders. |

## Error/loading/empty states

Required states are first-class components, not afterthoughts:

- unknown product/collection/page/article → themed 404 with correct status;
- product sold out and selected variant unavailable;
- cart mutation/user error and stale variant/price;
- empty cart;
- empty collection/filter result;
- search initial, loading, no results, API failure;
- reviews/GOVX unavailable without blocking purchase;
- hosted account redirect failure;
- checkout URL unavailable;
- missing optional media/alt/second image;
- Shopify rate limit/upstream error with request correlation.

## Component verification matrix

Each shared commerce component should be verified with at least:

- Men's Talon SS Full Set: sold out, two variants, no variant media.
- Men's Thunderbird Driver: sparse option combinations and `?variant=` state.
- Thunderbird Golf Bag: color swatches, variant media, non-square first image.
- Men's Thunderbird Wedge: fixed first option plus five lofts.
- Anonymous retail cart, signed-in retail customer, and every supported wholesale state.
- 375, 430, 768, 1024, and 1440 px layouts; touch, keyboard, mouse, and reduced motion.
