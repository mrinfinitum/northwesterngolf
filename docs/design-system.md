# Northwestern Golf visual design system audit

Audit date: 2026-08-27  
Source: live Shopify theme CSS and representative storefront templates at <https://northwestern.golf>. Values are measured from shipped tokens/rules where available and marked approximate where composed by a custom section.

## Design character

The storefront uses a bold, condensed-feeling sports-retail presentation built entirely around Barlow, uppercase headings, near-black commerce UI, bright orange campaign accents, large photography/video, pale-gray surfaces, and restrained radii/shadows. The correct migration goal is to preserve this system, including its intentional mix of pill-shaped theme buttons and square orange campaign CTAs.

## Color tokens

| Role | Value | Evidence/use |
|---|---|---|
| Primary ink / primary button | `#1A1A1A` / `rgb(26 26 26)` | Body text, headings, primary actions, theme color variables. |
| Page background | `#FFFFFF` | Default page. |
| Surface/dialog | `#FFFFFF` | Cards, inputs, drawers. |
| Product section background | `#F8F8F8` | Product main area and custom testimonial band. |
| Campaign accent | `#FF711F` | App promotion bar, custom arrows/hover, recurring Northwestern orange. |
| Hero CTA orange | `#F96F1E` | Homepage video hero; treat as a separate observed shade unless brand owners consolidate it. |
| Theme secondary action | `#F0C417` | Impact secondary button variable. |
| Header translucent | `#3464826B` | Home transparent-header wrapper rule. |
| Footer heading | `#26222F` | Footer group titles and lower divider. |
| Footer/muted link | `#8B8698` | Footer links. |
| General muted | `#6F6F6F` | Testimonial secondary text. |
| Footer/review background | `#F8F8F8` | Large neutral bands. |
| Header border | `#EAEAEA` | Filled header. |
| Footer border | `#E5E5E5` | Footer top boundary. |
| Standard border | `rgb(26 26 26 / 12%)` | Cards, dividers, inputs. |
| Sale/error | `#F83A3A` | Sale price/badge and error token. |
| Success text | `#00A341` | Success token. |
| Success background | `#E0F4E8` | Success message surface. |
| Warning/star | `#FFB74A` | Theme warning and rating color. |
| Warning background | `#FFF6E9` | Warning message surface. |
| Testimonial stars | `#FFCF2A` | Custom homepage testimonial section. |
| Error background | `#FEE7E7` | Error message surface. |
| Sold-out badge | `#1A1A1A` with white text | Theme sold-out state. |
| Primary badge | `#803CEE` with white text | Available theme badge style; use only where current content invokes it. |

Do not replace `#FF711F`, `#F96F1E`, and `#F0C417` with one “close enough” accent before brand approval. Their coexistence is observable in the current theme.

## Typography

### Families and treatment

- Primary, heading, and body family: **Barlow**, served as WOFF/WOFF2 with normal and italic faces.
- Loaded weights: 400 and 700.
- Headings: weight 700, uppercase, letter spacing `-0.02em`.
- Body: weight 400, normal case, default letter spacing `0` and line height approximately `1.6`.
- Buttons: Barlow 700, usually uppercase through content/style context, line height approximately `1.6`.
- `font-display` fallback behavior is present; a Next.js build should self-host licensed font files or use existing Shopify-hosted assets only if permitted.

### Theme typography scale

| Token | <700 px | 700–1399 px | ≥1400 px | Typical use |
|---|---:|---:|---:|---|
| Display / H0 | 48 px | 64 px | 80 px | Collection/display headings. |
| H1 | 40 px | 48 px | 60 px | Page/product primary title. |
| H2 | 32 px | 40 px | 48 px | Major section titles. |
| H3 | 24 px | 32 px | 36 px | Subsections/cards. |
| H4 | 22 px | 26 px | 32 px | Smaller content heading. |
| H5 | 18 px | 20 px | 24 px | Footer/content heading variants. |
| H6 | 16 px | 18 px | 20 px | Eyebrow/supporting heading. |
| Body large | 20 px | 20 px | 20 px | Intro copy. |
| Body | 16 px | 16 px | 16 px | Standard content. |
| Body small | 14 px | 14 px | 14 px | Secondary content and footer. |
| Caption/x-small | 13 px | 12 px | 12 px | Labels, metadata. |
| Button default | 14 px | 14 px | 14 px | Standard actions. |
| Button large/x-large | 16 px | 16 px | 16 px | Hero/strong actions. |

Custom homepage exceptions:

- Video hero H1: approximately 51.2 px (`3.2rem`) desktop and 32 px (`2rem`) mobile.
- Image-overlay headings use custom tight line height around `0.95` and `-0.03em` letter spacing on mobile.
- Footer group headings: approximately 21 px, weight 600 in the custom footer rather than the global 700 token.
- Footer links: approximately 15 px.

## Layout widths and gutters

| Role | Width |
|---|---:|
| Wide site/section maximum | 1460 px |
| Standard/narrow theme container | approximately 1210 px |
| Custom footer maximum | 1200 px |
| Cart page maximum | approximately 1350 px |
| Product-page outer width | wide container, approximately 1460 px |
| Product gallery desktop sizing | approximately `min(760px, 42vw)` per media rule |

Responsive page gutters:

- Under 700 px: 20 px.
- 700–999 px: 32 px.
- 1000 px and above: 48 px.
- Custom footer uses approximately 15 px internal side padding inside its 1200 px wrapper.

Grid gutters are commonly 20 px mobile and 24 px at 700 px and above.

## Spacing scale

The shipped theme exposes a dense even-number scale rather than a strict eight-point-only system:

```text
2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
34, 36, 38, 40, 44, 48, 56, 64, 72, 80, 96 ... up to 384 px
```

Recommended migration tokens should emphasize the recurring subset while retaining named exceptions:

```text
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
14: 56px
16: 64px
18: 72px
20: 80px
24: 96px
```

Recurring section outer spacing scales approximately 48 px mobile, 64 px tablet, 72 px at 1000 px, 80 px at 1150 px, and 96 px at 1400 px. Inner section gaps commonly scale 40 → 48 → 64 → 72 → 80 px.

## Radius, borders, and shadows

### Radius

| Token | Value | Use |
|---|---:|---|
| `xs` | 4 px | Minor controls/badges. |
| `sm` | 6 px | Product cards. |
| default | 12 px | Product media, cards, drawers/content panels. |
| `lg` | 24 px | Larger panels. |
| button | 60 px | Standard pill buttons. |
| full | 9999 px | Circular/pill chips. |
| input | 8 px | Inputs/selects. |

Custom campaign buttons on the homepage intentionally use 0 px radius. Do not apply the global pill radius to them.

### Borders

- Default thickness: 1 px.
- Outline buttons simulate a 2 px inset line.
- Header filled divider: 1 px `#EAEAEA`.
- Standard neutral divider: 1 px at approximately 12% primary ink.
- Selected option/chip outlines are stronger than default borders; exact state color follows current ink/accent tokens.

### Shadows

| Token | CSS |
|---|---|
| Small | `0 2px 8px rgb(26 26 26 / 10%)` |
| Default | `0 5px 15px rgb(26 26 26 / 10%)` |
| Medium | `0 5px 30px rgb(26 26 26 / 10%)` |
| Block | `0 18px 50px rgb(26 26 26 / 10%)` |
| Homepage testimonial card | `0 12px 30px rgb(26 26 26 / 8%)` |

## Inputs and controls

- Standard input height: 42 px mobile and 50 px at 700 px and above.
- Input radius: 8 px.
- Border: 1 px neutral, with stronger focus state.
- Quantity selector uses compact square decrement/increment controls around a numeric input.
- Variant selectors use text chips for shaft/loft and circular/visual swatches for Bag Color.
- Disabled variant choices remain legible and visibly unavailable; valid-combination logic must not rely on color alone.
- Icons are inline SVG line icons, normally inheriting current color. Reuse a single typed icon system rather than adding an external icon package for these basic shapes.

## Button system

### Shared geometry

- Default: 14 px Barlow 700, line height 1.6, pill radius 60 px.
- Mobile default padding: 10 px vertical × 20 px horizontal.
- Desktop default padding: 12 px vertical × 24 px horizontal.
- Small: 12 px text, 8 × 20 px padding.
- Large: 16 px; about 13 × 24 px mobile, 14 × 32 px desktop.
- Extra large: 16 px; about 16 × 32 px mobile, 17.2 × 40 px desktop.
- Generic hover on precise pointers: opacity approximately 0.85, 150 ms ease.

### Variants

| Variant | Default | Hover/active | Disabled |
|---|---|---|---|
| Primary | `#1A1A1A` background, white text | Opacity ~0.85; preserve ink color | Subdued tint, default cursor, `disabled` semantic state. |
| Secondary | `#F0C417` background, `#1A1A1A` text | Opacity ~0.85 | Subdued tint and disabled. |
| Outline | Transparent, 2 px inset outline, current-color text | Slight tint/opacity; no layout shift | Low-contrast outline/text and disabled. |
| Subdued | Approximately 10% ink tint, ink text | Stronger neutral tint | Further reduced contrast and disabled. |
| Text/link | No filled surface, inline label/underline treatment | Underline/color transition | Muted and non-interactive. |
| Orange campaign | `#FF711F` or section-specific `#F96F1E`, white, square | Black on video hero; other custom CTA transitions use ink/orange | No live disabled campaign example. |
| Add to Cart | Primary black pill/full-width | Standard opacity; loading state should lock repeat submission | Sold-out label with subdued disabled style. |
| Checkout | Primary black, lock icon, full width | Standard opacity | Disabled while cart/checkout URL is unavailable. |

`active` is not separately styled in all live custom buttons; the headless implementation should preserve hover and focus fidelity and add a subtle pressed state without changing brand geometry.

## Breakpoint strategy

The existing breakpoints should be used as the migration baseline:

```js
// Proposed Tailwind screen values; documentation only.
{
  xs: '430px',
  sm: '700px',
  md: '1000px',
  lg: '1150px',
  xl: '1400px',
  '2xl': '1600px'
}
```

- 700 px: typography, gutters, input heights, account visibility, many two-column transitions.
- 1000 px: PDP split layout, collection filter sidebar, three-card testimonial layout.
- 1150 px: desktop navigation replaces the drawer trigger.
- 1400 px: largest heading scale and section spacing.
- 1600 px: rare wide-screen tuning.
- Preserve isolated 420, 749/750, and 768 px custom-section rules for homepage art direction/footer behavior.

## Responsive composition notes

- Mobile is not a simple stack of desktop: campaign sections change the actual image source and crop.
- Product grids remain two columns even at 375 px.
- Product gallery changes interaction model from thumbnails/zoom-oriented desktop to a horizontal carousel with dots on mobile.
- Collection filters become a drawer, not an inline stacked form.
- Header does not show full desktop navigation at tablet/1024; it waits until 1150 px.
- Account icon appears at 700 px even while navigation remains in drawer mode.
- Sticky Add to Cart changes from a mobile full-width bottom action to a floating desktop summary.
- Homepage review arrows are removed on touch/mobile, leaving direct horizontal scrolling.

## Motion

- Core control transitions are short: approximately 150–250 ms ease.
- Product image opacity swap: approximately 200 ms.
- Drawer open/close: approximately 200 ms.
- Quick-add reveal: translate/fade over approximately 200 ms.
- Testimonial auto-advance: every three seconds with smooth scrolling.
- Hero media: continuous muted video loop.

No animation framework is justified by the current motion language. Use CSS transitions, scroll-snap, native dialog/drawer primitives, and small React state. Honor `prefers-reduced-motion`, especially for the video and auto-advancing testimonials.

## Fidelity checklist for visual QA

- Compare header height, logo size, and the 1150 px navigation switch.
- Confirm the homepage translucent-to-filled header behavior in a real browser.
- Verify mobile-specific Daly art and focal positions at 375 and 430 px.
- Preserve both square orange campaign buttons and pill commerce buttons.
- Test the unusually dense two-column product grid at 375 px.
- Check non-square golf-bag images for containment and layout shift.
- Validate type at 700 and 1400 px where scales step up.
- Check white-on-photo contrast against the actual source crops.
- Compare drawers, sticky Add to Cart, hover secondary image, and quick-add reveal on pointer and touch devices.
