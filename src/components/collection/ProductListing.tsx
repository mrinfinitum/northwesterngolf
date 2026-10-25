import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import type { Product } from "@/lib/shopify";
import { FacetDrawer } from "./FacetDrawer";
import { FacetForm, type FacetConfig } from "./FacetForm";
import { CloseIcon, EmptyIcon, FiltersIcon } from "./icons";
import { listingHref } from "./listing-state";
import { SortPopover } from "./SortPopover";

/**
 * Filters sidebar + "Sort by" bar + 3-column product grid shared by
 * collection and search result pages (Impact theme `collection--filters-sidebar`).
 */
export function ProductListing({
  clearHref,
  config,
  products,
  showCount = true,
}: {
  clearHref: string;
  config: FacetConfig;
  products: Product[];
  /** Mobile "N products" line; the live search template omits it. */
  showCount?: boolean;
}) {
  const { baseParams, effectiveSort, pathname, sortOptions, state } = config;
  const sortLinks = sortOptions.map((option) => ({
    ...option,
    href: listingHref(pathname, baseParams, { ...state, sort: option.value }),
    selected: option.value === (state.sort ?? effectiveSort),
  }));
  const formKey = listingHref(pathname, baseParams, state);
  const chips = [
    ...(state.inStock ? [{ href: listingHref(pathname, baseParams, { ...state, inStock: false }), label: "In stock", name: "In stock" }] : []),
    ...(state.priceMin !== undefined || state.priceMax !== undefined
      ? [{
          href: listingHref(pathname, baseParams, { ...state, priceMax: undefined, priceMin: undefined }),
          label: `$${state.priceMin ?? 0} - $${state.priceMax ?? config.priceMax ?? 0}`,
          name: "Price",
        }]
      : []),
  ];

  return (
    <div className="nwg-col-layout">
      <div className="nwg-col-topbar">
        <div className="nwg-col-topbar__filters"><FiltersIcon />Filters</div>
        <div className="nwg-col-topbar__summary">
          {chips.length ? (
            <div className="nwg-col-chips">
              <ActiveFacetChips chips={chips} />
              <Link className="nwg-col-chips__clear" href={clearHref} scroll={false}>Clear all</Link>
            </div>
          ) : null}
          <SortPopover options={sortLinks} />
        </div>
      </div>
      <FacetDrawer config={config} key={`drawer:${formKey}`} />
      <aside aria-label="Filters" className="nwg-col-sidebar">
        <div className="nwg-col-sidebar__sticky">
          <FacetForm config={config} key={`sidebar:${formKey}`} variant="sidebar" />
        </div>
      </aside>
      <div className="nwg-col-results">
        {products.length ? (
          <>
            {showCount || chips.length ? (
              <div className="nwg-col-mobile-summary">
                {showCount ? <p className="nwg-col-count">{products.length} {products.length === 1 ? "product" : "products"}</p> : null}
                {chips.length ? <div className="nwg-col-chips"><ActiveFacetChips chips={chips} /></div> : null}
              </div>
            ) : null}
            <div className="nwg-col-grid">
              {products.map((product, index) => <ProductCard key={product.id} priority={index < 3} product={product} />)}
            </div>
          </>
        ) : (
          <ListingEmptyState actionHref={clearHref} actionLabel="Clear all" headingLevel="h5" title="No products match those filters." />
        )}
      </div>
    </div>
  );
}

function ActiveFacetChips({ chips }: { chips: Array<{ href: string; label: string; name: string }> }) {
  return chips.map((chip) => (
    <div className="nwg-col-chip" key={chip.name}>
      {chip.label}
      <Link aria-label={`Remove filter "${chip.name}"`} href={chip.href} scroll={false}><CloseIcon height={10} width={10} /></Link>
    </div>
  ));
}

export function ListingEmptyState({
  actionHref,
  actionLabel,
  headingLevel = "h4",
  title,
}: {
  actionHref: string;
  actionLabel: string;
  headingLevel?: "h4" | "h5";
  title: string;
}) {
  return (
    <div className="nwg-col-empty">
      <div className="nwg-col-empty__icon">
        <EmptyIcon />
        <span>0</span>
      </div>
      <div>
        <p className={`nwg-col-empty__title nwg-col-empty__title--${headingLevel}`}>{title}</p>
        <Link className="nwg-col-button nwg-col-button--xl" href={actionHref}>{actionLabel}</Link>
      </div>
    </div>
  );
}
