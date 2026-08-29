# SEO migration audit and preservation plan

Audit date: 2026-08-27  
Canonical origin: `https://northwestern.golf`

The primary migration rule is to keep the domain, handles, canonical routes, content intent, metadata, schema, internal links, and status codes stable. Improvements should be staged after parity and baseline measurement unless they fix a clear defect without changing search intent.

## Current URL behavior

| Resource | Pattern | Current behavior |
|---|---|---|
| Home | `/` | Canonical to trailing-slash root. |
| Product | `/products/[handle]` | Primary canonical product route. |
| Nested product | `/collections/[collection]/products/[handle]` | Returns 200, canonicalizes to `/products/[handle]`. |
| Product variant | `/products/[handle]?variant=[id]` | Variant deep link; Product schema Offer URLs include variant query. Canonical remains base product. |
| Collection | `/collections/[handle]` | Self canonical. |
| Filter/sort | `/collections/[handle]?...` | Canonical strips filter/sort query to base collection. Robots rules suppress many sort/multi-filter crawl traps. |
| Pagination | `/collections/[handle]?page=N` | Self canonical including `?page=N`; title includes “Page N.” |
| Page | `/pages/[handle]` | Self canonical. |
| Blog | `/blogs/[blog]` | Self canonical. |
| Article | `/blogs/[blog]/[article]` | Standard Shopify convention; no live articles to verify. |
| Search | `/search?q=...` | Canonical retains the query and resource type. No meta robots tag observed. |
| Cart | `/cart` | Self canonical; `/cart/` is disallowed in robots, while the exact `/cart` is not. |
| Account | `/account`, `/account/login` | Account is disallowed; login allowed and redirects to Shopify hosted accounts. |
| Checkout | `/checkout` | Disallowed; remains Shopify hosted. |
| Policy | `/policies/[policy]` | Self canonical Shopify policy route. |

## URLs that must remain unchanged

### Products

```text
/products/men-s-talon-ss-full-set
/products/women-s-talon-ss-full-set
/products/senior-s-talon-ss-full-set
/products/men-s-thunderbird-full-set
/products/women-s-thunderbird-full-set
/products/senior-s-thunderbird-full-set
/products/men-s-thunderbird-irons-set
/products/women-s-thunderbird-irons-set
/products/senior-s-thunderbird-irons-set
/products/men-s-thunderbird-fairway
/products/women-s-thunderbird-fairway
/products/senior-s-thunderbird-fairway
/products/men-s-thunderbird-driver
/products/women-s-thunderbird-driver
/products/senior-s-thunderbird-driver
/products/men-s-thunderbird-hybrid
/products/women-s-thunderbird-hybrids
/products/senior-s-thunderbird-hybrid
/products/men-s-thunderbird-wedge
/products/thunderbird-golf-bag
```

Note the current women's hybrid handle is plural (`hybrids`) while the men's and senior's handles are singular. Do not “correct” it without a permanent redirect and link/schema update.

### Collections

```text
/collections/drivers
/collections/fairways
/collections/golf-bags
/collections/hybrids
/collections/irons
/collections/mens-collection
/collections/senior-s-collection
/collections/symonds-wedges
/collections/talon-ss-full-set
/collections/thunderbird-full-set
/collections/wedges
/collections/women-s-collection
/collections/northwestern-golf-inc
/collections/thunderbird
/collections/talon-ss
/collections/best-sellers
/collections/all
```

`/collections/all` is not in the collection sitemap but is linked prominently and must continue working.

### Pages, blog, and policies

```text
/
/pages/contact
/pages/data-sharing-opt-out
/pages/talon-ss
/pages/our-story
/pages/thunderbird-full-set
/pages/wedges
/blogs/news
/policies/refund-policy
/policies/privacy-policy
/policies/terms-of-service
/search
/cart
/account/login
```

Support existing nested product URLs with their current canonical behavior. Any handle change discovered during development needs a one-to-one 301 map; do not redirect multiple meaningful routes to the homepage.

## Representative metadata

| Page | Title | Meta description | Canonical / social |
|---|---|---|---|
| Home | `Northwestern Golf` | No `meta[name=description]` observed | Canonical `/`; OG website/title/url/site name; Twitter summary. Twitter description falls back to brand name. |
| Men's Thunderbird Driver | `Men’s Thunderbird Driver` | Auto-derived long product description ending mid-content near 320 characters | Canonical base product; OG product, availability and 3000 × 3000 image; Twitter summary image. |
| Men's Collection | `Men's Collection` | None observed | Canonical collection; OG/Twitter image 2000 × 2000 and blank Twitter description. |
| Our Story | `Our Legacy | Northwestern Golf Since 1929` | `Discover nearly 100 years of making golf affordable & fun. See how we’re redefining the game for everyday players.` | Complete canonical, OG, and Twitter description. |
| News | `News` | None observed | Canonical blog; OG/Twitter website metadata. |
| Search example | `Search: 20 results found for "driver"` | None observed | Canonical includes `?q=driver&type=product`; no meta robots tag observed. |
| Cart | `Your Shopping Cart` | None observed | Self canonical; no meta robots tag observed. |

Current metadata is uneven. Preserve exact route behavior at launch, but use Shopify SEO title/description fields where populated and document any launch-time remediation. The product's automatically derived meta description is too long and includes legacy/specification content; editing it is a content/SEO decision, not a technical parity change.

## Heading structure

- Home: logo is wrapped in an H1 and the video hero is also an H1 (“THE LEGACY LIVES ON.”), producing multiple H1s.
- Product: product title is the primary H1; accordion/editorial sections contribute lower headings, with some generated sections containing empty or irregular H2/H3 elements.
- Collection: collection title is the large primary heading.
- Contact: “Contact Us” is the main heading; “Customer service” and “Get in touch” follow.
- Our Story: content hierarchy includes Our Story, Our Legacy, Reimagined, and Our Core Values.
- Thunderbird Full Set landing: “A Full Bag Without Emptying Yours” followed by separate men's/women's/senior's price headings.
- Wedges landing: Brian Symonds and Signature Wedges content headings.
- Refund policy: both “Refund policy” and “30-Day Return Policy” render as H1, a duplicate-H1 defect.
- Blog empty state: “This blog is empty” is styled as an H4-like heading; the page does not expose a strong conventional News H1 in extracted structure.

For migration, assign exactly one clear content H1 per page without changing visible words/layout unless necessary. Treat this as semantic cleanup, not a redesign.

## Structured data

### Current

- Global/home: `WebSite` with `SearchAction`, `Organization`, and `BreadcrumbList` (home-only crumb).
- Product: `ProductGroup` with `Brand`, per-variant `Product` and `Offer`, SKU/GTIN where available, availability, USD price, image, URL, name, and productGroupID.
- Template-level `BreadcrumbList` is emitted across pages.
- No live `Article` schema can be audited because the blog has no articles.
- The sampled native ProductGroup schema did not show an Okendo `aggregateRating` in the same block. Check the complete rendered DOM for separate Okendo schema before adding one.

### Required headless output

- `Organization` and `WebSite` on appropriate global pages, with the same canonical origin and search target.
- `BreadcrumbList` reflecting actual visible/navigation hierarchy.
- `ProductGroup` or valid Product/variant structure with stable canonical/variant URLs, money currency, availability, SKU, GTIN, brand, media, and seller/offer fields supported by Shopify data.
- One aggregate-rating/review source only, owned by the Okendo integration if it supplies compliant data.
- `CollectionPage`/ItemList only if implemented accurately; do not fabricate positions for filtered/paginated results.
- `Article` plus author/dateModified/datePublished/image when articles are eventually published.

Generate JSON-LD from the same Shopify/API data used on screen. Validate sample pages with Schema.org and Google rich-results tools before cutover.

## Breadcrumbs

Breadcrumb structured data is present. Product schema and URL conventions treat `/products/[handle]` as primary, even when a visitor enters through `/collections/.../products/...`. The headless app should not make collection context part of the canonical product identity.

If visual breadcrumbs include a collection crumb, choose a deterministic collection context from navigation/request state while keeping canonical and Product URL stable. Rendered visual-breadcrumb parity still needs browser QA.

## Sitemap

Current root sitemap: `https://northwestern.golf/sitemap.xml`.

It references Shopify-generated child sitemaps for products, pages, collections, and blogs, plus an agentic sitemap. Product sitemap entries include last-modified/image data; the blog sitemap currently has only the empty blog index.

Headless options:

1. Let Shopify continue serving sitemaps on the same domain through a proxy/routing arrangement; or
2. generate Next.js sitemaps from Storefront/Admin-accessible content.

Whichever is selected must include every indexable current URL, image metadata where useful, correct `lastmod`, only canonical 200 pages, and pagination/scale handling. Compare old and new URL sets mechanically before DNS/cutover.

## Robots directives

The live `robots.txt` is Shopify-generated and currently:

- allows the public storefront;
- disallows Admin, checkout/checkouts, orders, account except login, internal services, Ajax cart/recommendations, web-pixel bundles, previews, and selected query crawl traps;
- disallows sort and multi-filter patterns while allowing ordinary collection/product/page/blog crawling;
- declares `https://northwestern.golf/sitemap.xml`;
- includes current Shopify agent/UCP guidance.

Search and exact `/cart` are not blanket-disallowed by the present rules, and the HTML does not emit `noindex` on sampled search/cart pages. That may not be ideal SEO policy, but changing it must be intentional and documented. Do not copy Shopify's robots file blindly if the routes/endpoints differ in headless; preserve its indexation outcome and transactional protections.

## Pagination, filters, and query parameters

- Collection pagination uses `?page=N`, self-canonical, and a title suffix such as “Page 2.”
- Filter/sort combinations canonicalize to the base collection.
- Robots suppress `sort_by` and multi-filter crawl traps; a single filter may remain crawlable under some patterns.
- Predictive-search result URLs contain `_pos`, `_psq`, `_psid`, `_ss`; canonical product/page/collection metadata drops those tracking parameters.
- Product `?variant=` URLs canonicalize to the product but are used in Offer schema and should resolve to the selected variant.

Headless routing must ignore tracking parameters for content identity, keep selected variant behavior, and avoid generating infinite URLs from filter state. Test canonical output for empty, invalid, filtered, sorted, paginated, nested-product, and variant URLs.

## Open Graph and Twitter

- OG type is `product` on product pages and `website` elsewhere.
- Product OG includes availability and large source image dimensions.
- Twitter uses `summary`, not `summary_large_image`, on audited pages.
- Many pages inherit blank/minimal descriptions.
- Product Twitter image alt is blank in the sampled driver page.

At parity, preserve title/description/image selection from Shopify SEO and primary media. Do not change social-card style as part of the platform migration. Missing alt/description fields can be remediated as a separate content task.

## Internal-link preservation

- Preserve all header/footer link targets and case/punctuation in handles.
- Parent dropdown campaign destinations must remain clickable, not become open-only controls.
- Homepage CTAs currently point to `/collections/all` and the men's Thunderbird Driver product.
- “Most Wanted” View all points to `/collections/mens-collection`.
- Fix the malformed Instagram URL in footer markup while preserving the destination.
- The first Daly “Shop Clubs” CTA has no observed destination; **SOURCE NEEDS SHOPIFY ADMIN/INTERACTIVE INSPECTION** before assigning a URL.

## Content and SEO risks

- Thunderbird landing-page price copy ($949.99/$999.99) conflicts with live product price ($769.99). Search snippets/users can see inconsistent price claims.
- Several product descriptions include legacy Elementor wrappers and automatically generated descriptions.
- Home/collection/blog pages lack useful meta descriptions.
- Duplicate or unclear H1 patterns exist.
- Product-media alt text is mostly missing or repeated through title fallback.
- Current Organization schema is minimal (name and URL only).
- Empty blog is indexable and offers little content value.
- Okendo review schema ownership is unclear.

Do not bundle all remediation into launch. Record a baseline, distinguish parity-critical changes from approved improvements, and monitor their effects separately.

## Redirect requirements

- Prefer zero redirects by matching current routes exactly.
- Create explicit 301s for any unavoidable handle/path change.
- Preserve query strings where meaningful; prevent chains and loops.
- Keep legacy nested product paths resolving and canonicalizing, or 301 them directly to the matching product only after confirming traffic/backlinks.
- Return 404/410 for truly removed resources; do not soft-404 to the homepage.
- Import any existing Shopify URL redirects from Admin. **SOURCE NEEDS SHOPIFY ADMIN INSPECTION.** Public crawling cannot inventory unpublished/historical redirect rules.

## Cutover SEO checklist

### Before build freeze

- Export Shopify URL redirects, Search Console top pages/queries, analytics landing pages, backlink targets, and indexed-page reports.
- Crawl the current site and save status, title, description, canonical, H1, schema types, indexability, internal links, image URLs, and response times.
- Freeze handle/metadata changes or maintain a change log through launch.

### Staging

- Block staging from indexing with authentication and/or `noindex`; do not rely only on robots.
- Diff every sitemap URL between Shopify and Next.js.
- Verify 200/301/404 status, canonical host/protocol/path, variant/nested/filter/pagination behavior, metadata, headings, and JSON-LD.
- Verify image rendering and alt text without copying every original asset.
- Test Google/Meta/unknown pixels without sending production conversions.

### Cutover

- Preserve `https://northwestern.golf` and HTTPS.
- Publish robots and sitemap atomically with the route switch.
- Keep Shopify checkout/account destinations working.
- Submit sitemap and inspect sample URLs in Search Console.
- Record a timestamped route/metadata snapshot for rollback comparison.

### Post-launch

- Monitor 404s, 5xx, redirect chains, canonical mismatches, excluded/indexed counts, structured-data errors, Core Web Vitals, organic landing traffic, revenue, and search-query coverage daily during the initial window.
- Re-crawl after deploy and compare to the baseline.
- Keep redirects indefinitely where external links/indexation exist.
- Separate later metadata/content experiments from infrastructure fixes.
