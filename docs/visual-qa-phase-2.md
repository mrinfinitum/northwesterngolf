# Northwestern Golf — Phase 2 Visual QA

Date: August 27, 2026  
Status: **SOURCE-FIDELITY PASS COMPLETE; SCREENSHOT SIGN-OFF NOT VERIFIED**

## Scope and method

This pass refined the independent Next.js storefront only. It made no changes to Shopify, DNS, checkout, customer accounts, Wholesale Gorilla, GOVX, AlphaLogic, analytics, pixels, or any production integration. Cart and Add to Cart remain intentionally gated.

The comparison used:

- all Phase 1 audit and build documents requested for this phase;
- the live storefront's public HTML, rendered image references, and theme CSS;
- locally rendered routes backed by real Shopify Storefront API data;
- type checking, linting, a production build, and HTTP route smoke tests.

The in-app browser runtime was checked and reported that no browser was available. Under the browser tooling rules, no standalone browser or screenshot substitute was used. Therefore, side-by-side screenshots and computed-style inspection at the requested viewport widths could not be completed, and no viewport is marked `PASS`.

## Fixed

### Global typography and tokens

- Kept Barlow as the storefront typeface and limited loading to the live storefront's observed 400 and 700 weights.
- Reconciled body line height, uppercase headings, compressed heading line heights, letter spacing, container widths, responsive gutters, campaign orange, surface gray, border color, and reusable control sizing with the design audit.
- Added consistent keyboard focus treatment and reduced-motion behavior without adding an animation library.

### Announcement bar and header

- Matched the current announcement copy, 16px weight-400 type, white-on-`#ff711f` color treatment, and 12px vertical padding.
- Replaced the temporary CSS-built logo with the exact public Shopify SVG used by the live header.
- Matched the observed logo widths: 150px below 700px and 200px on larger screens.
- Matched source-derived header heights: 49px below 700px and 85px from 700px upward.
- Preserved the 1150px desktop-navigation transition, sticky header, desktop dropdown hover/focus behavior, account/search/cart placement, and the deliberately disabled cart trigger.
- Added Account and the observed Facebook, Instagram, and TikTok destinations to the mobile drawer's secondary area.

### Homepage

- Replaced the provisional still-image hero with the live homepage's public autoplaying, muted, looping, inline MP4.
- Matched the hero's exact 600px mobile height and 100vh desktop height, video cover treatment, centered content, 3.2rem desktop heading, 2rem mobile heading, square orange button, and black hover state.
- Added a reduced-motion fallback that suppresses the moving hero media.
- Corrected the John Daly partnership and driver campaign sections to use their distinct desktop and mobile Shopify CDN artwork.
- Corrected mobile image switching at the observed 700px image-source boundary and the special 420px short-screen treatment.
- Reconciled first-campaign top alignment, second-campaign centered alignment, text width, desktop 2:1 treatment, button labels, and call-to-action destinations with the live markup.
- Matched the “Most Wanted” section to two visible product columns on small screens and three columns from 1000px, with the real Men's Collection destination.
- Expanded the testimonial rail to the nine live review cards, with one card on mobile, three on desktop, desktop arrows, three-second progression, pause-on-hover/focus, scroll snapping, and reduced-motion protection.

### Product cards

- Changed product imagery to the live card's contained presentation on white, with responsive sizing and a secondary-image hover transition only on hover-capable pointer devices.
- Matched the sparse information hierarchy: product title, Shopify price, compare-at price, and sale presentation without introducing vendor, ratings, swatches, or stock copy not shown on live cards.
- Removed the prior card-level availability message so card content matches the sparse live presentation.
- Preserved Shopify-returned current and compare-at pricing as authoritative; no AlphaLogic pricing calculation was added.
- Reconciled mobile two-column grids, desktop three-column collection grids, card spacing, row gaps, and image proportions.

### Collections

- Reworked the collection header, count placement, grid/container widths, responsive columns, and empty state to follow the audited layout.
- Added native Shopify Storefront API availability and price filters plus Shopify sort keys, including a compact mobile filter panel and a 1000px desktop sidebar boundary.
- Kept filter and sort state in the URL and server-rendered the result; no client data-fetching library was introduced.
- Added narrow-screen safeguards for the sort control to avoid horizontal overflow.
- Kept `/collections/all` behavior consistent with Shopify's route convention while applying the same presentation and controls.

### Product detail page

- Matched the light-gray PDP surface, white contained gallery media, 1.1/0.9 desktop column proportions, thumbnail rail, responsive mobile gallery controls, and sticky desktop product summary.
- Removed vendor, SKU, and generic stock copy where they were not visibly present on the audited live PDP.
- Preserved actual Shopify variants, prices, compare-at prices, availability, and variant images.
- Added observed option treatments, including Bag Color swatches and ordered disabling of invalid sparse combinations.
- Variant changes now preserve the selected Shopify variant in `?variant=` without client-side price calculations.
- Reconciled labels, option controls, quantity presentation, and the disabled Add to Cart visual state. No cart mutation or fake success path was added.

### Buttons, controls, interactions, and footer

- Reconciled campaign, primary, light, disabled, variant, filter, select, search, and quantity control heights, padding, borders, radii, typography, hover, focus, and disabled states.
- Kept interactive JavaScript limited to drawers, search, galleries, variant selection, sorting submission, and the testimonial rail.
- Reworked the footer to the live light surface, 1200px width, responsive centered/mobile and columnar/desktop layouts, exact SVG logo, typography hierarchy, social set, legal divider, and observed spacing.
- Removed the non-live footer tagline and did not invent newsletter, payment, or trust-badge UI.

## Remaining differences

| Item | Difference | Reason |
| --- | --- | --- |
| Viewport screenshot sign-off | No side-by-side image comparison or pixel-diff artifacts were produced. | **Browser QA unavailable.** The in-app browser runtime returned no available browser. |
| Transparent-header transition | The Next.js header stays on its stable white sticky surface; any theme-specific transparent-logo mode is not reproduced. | **Theme-only behavior** and not safely verifiable without visual browser interaction across page/scroll states. |
| Hero reduced-motion artwork | With reduced motion enabled, the moving video is suppressed against the black hero surface rather than replaced by a dedicated poster. | **Source asset unavailable.** The live markup exposes no authoritative poster image. |
| Touch gallery gesture | Mobile gallery navigation has accessible controls and position indicators but does not add a custom swipe library. | **Unsupported interaction** in this phase; adding a library without evidence would violate the performance guardrail. Native image display remains intact. |
| Predictive search | Search overlay and results page exist, but live predictive product suggestions are not reproduced. | Previously deferred functionality; provider/source behavior remains insufficiently specified. |
| Homepage merchant editing | Announcement, campaign copy, campaign media references, navigation, and testimonials remain isolated static configuration. | **Theme-only content.** Migration to structured Shopify data still follows `theme-content-migration.md`; production Shopify was not changed. |
| Theme reveal effects | Theme-specific reveal-on-scroll animation is not duplicated. | Intentionally omitted: it is decorative, source-library-dependent, and unnecessary for faithful layout. |
| Cart count and purchase actions | Cart remains disabled and Add to Cart remains non-operational. | **Intentionally deferred commerce** at the Wholesale Gorilla/customer-aware pricing gate. |
| Account, GOVX, wholesale, discount, and analytics behavior | No behavior was added or altered. | **Needs Shopify Admin/vendor access** or belongs to the later commerce/integration phases. |
| Custom theme-only Page sections | Shopify Page bodies render, but Page-template-only composition may still differ. | **Theme-only behavior** and **needs Shopify Admin access** for authoritative section settings. |

## Responsive QA

The statuses below deliberately distinguish responsive implementation from visual proof. Source rules and responsive CSS were reviewed, and rendered routes were smoke-tested, but the requested screenshot comparison could not run.

| Viewport | Status | Source-level checks completed | Visual evidence still required |
| --- | --- | --- | --- |
| 375px | **NOT VERIFIED** | Two-column product grids, 20px gutters, compact sort/filter controls, 600px hero, 590px campaign exception below 420px, mobile header/drawer, PDP stack, centered footer. | Side-by-side home, collection, PDP, search, drawer, and footer screenshots; horizontal-overflow inspection. |
| 430px | **NOT VERIFIED** | Two-column product grids, 20px gutters, mobile navigation, 600px hero, campaign artwork, PDP stack, footer stack. | Same screenshot set and exact crop/text-wrap comparison. |
| 768px | **NOT VERIFIED** | 32px gutters, 85px header, mobile navigation retained, desktop campaign art above 700px, two-card featured rail, stacked PDP below 1000px, footer transition just above 768px. | Exact tablet transition, image crop, footer breakpoint, and control-width comparison. |
| 1024px | **NOT VERIFIED** | 48px gutters, collection filter sidebar, three-card featured section, split PDP/gallery, mobile header navigation retained until 1150px. | Tablet/desktop hybrid screenshot comparison and sticky-summary inspection. |
| 1440px | **NOT VERIFIED** | 1460px wide container, 1210px content width, desktop navigation/dropdowns, three-column collection grid, split PDP, desktop footer and testimonial controls. | Full desktop side-by-side screenshots and computed measurements. |

## Architecture and performance guardrails

- Product, collection, Page, policy, and search retrieval remains server-side.
- Client components remain narrowly scoped; no global storefront client wrapper was introduced.
- Shopify catalog imagery continues to use `next/image` and Shopify CDN URLs; catalog images were not copied into the repository.
- The homepage video uses the public Shopify-hosted media URL and does not expose a secret.
- No new runtime dependency, UI framework, animation library, state store, or client-fetching package was added.
- Shopify caching and the explicit commerce boundary remain unchanged.

## Validation

Completed successfully after the final visual-source changes:

- `npm run typecheck` — passed with no suppressed TypeScript errors.
- `npm run lint` — passed with no lint errors.
- `npm run build` — passed under Next.js 16.3.3; all expected static and dynamic routes were generated.
- Local production-server HTTP smoke tests — all returned `200`:
  - `/`
  - `/collections/drivers`
  - `/products/men-s-thunderbird-driver`
  - `/search`
  - `/pages/our-story`
  - `/policies/privacy-policy`

## Required follow-up for visual sign-off

Run the same representative route set side by side with the live Shopify storefront in an actual browser at 375, 430, 768, 1024, and 1440px. Capture the homepage, collection, PDP, search, open mobile navigation, and footer states. Resolve only evidence-backed discrepancies, then change viewport statuses from `NOT VERIFIED` to `PASS` or `PASS WITH NOTES` individually.
