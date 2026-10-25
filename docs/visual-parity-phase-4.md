# Northwestern Golf — Phase 4 Live Theme Parity

Date: October 25, 2026
Status: **VISUAL PARITY WITH LIVE IMPACT THEME; COMMERCE GATE REMAINS CLOSED**

## Why

The live storefront moved to a new Impact 6.11.2 theme ("Northwestern Site LIVE
2026") with redesigned navigation, homepage, footer, and long per-product
templates. The previous "premium" restyle in this repo had diverged from it.
This phase rebuilt every route to match the live theme and removed
`premium.css` and the Daly editorial PDP.

Unlike earlier phases, real browser QA was available: live and local pages were
captured with Playwright and compared side by side at 1440, 1024, 768, and
390px.

## Shopify sync

| Source | Data |
| --- | --- |
| Storefront API (tokenless, live) | Products, variants, prices, availability, swatches, collections, filters, sort, search, predictive search, Pages, policies, **menus** (`main-menu`, `footer`, `collections`, `information`) |
| Static mirror of theme-only content | Homepage hero/campaigns/reviews (`src/config/site.ts`), page template sections (`src/components/pages/page-sections.ts`), per-product template content (`src/lib/product-content/templates.ts`), Okendo reviews (`src/lib/product-content/reviews.ts`) |
| Instafeed public endpoint (hourly) | PDP Instagram carousel; hidden on failure |

Product template content is regenerated from the live site with
`scripts/theme-sync/` (see its README). Metafields are not readable without a
Storefront token (`unauthenticated_read_metafields`), so that content cannot be
read from Shopify directly yet.

## Routes

- Global shell: header and dropdowns at live breakpoints, transparent header on
  Our Story/Contact, mobile bottom-sheet/side drawer with sub-panels, predictive
  search drawer, light footer from Shopify menus.
- Home: full-bleed video hero, Daly campaigns, Most Wanted (first 6 of
  `mens-collection`), review scroller.
- Collections/search: centered title, Filters sidebar (in-stock toggle, price
  range), sort popover, mobile filter drawer; live URL parameters
  (`filter.v.availability`, `filter.v.price.gte/lte`, `sort_by`).
- Pages: Our Story, Contact (posts to Shopify `/contact`), Talon SS,
  Thunderbird Full Set, Wedges landing pages, policies, 404.
- PDP: live main section plus all template sections for all 20 products.

## Known differences

- Search ranking: Storefront API order differs from the live theme's.
- Collection default sort label is mapped in `collection-config.ts`.
- PDP info column is not sticky; Instagram items open in a new tab.
- "You may also like" lists are static; Storefront recommendations are empty
  for this shop.
- Contact form not submitted end to end (would email the store); depends on the
  Online Store channel remaining enabled.
- Video frames differ between captures; comparisons pause videos at 2s.

## Still gated

Cart and checkout remain disabled (`SHOPIFY_CART_ENABLED=false`) until a
Storefront API token is provisioned and the Phase 3B matrix is run. Wholesale
Gorilla, GOVX transactions, and customer-aware pricing remain deferred.
