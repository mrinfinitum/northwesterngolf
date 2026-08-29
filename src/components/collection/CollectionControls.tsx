import Link from "next/link";
import { CollectionSort } from "./CollectionSort";

export type CollectionFilterState = {
  availability: boolean;
  maxPrice?: number;
  minPrice?: number;
  sort: string;
};

export function CollectionControls({
  count,
  handle,
  maximumPrice,
  state,
}: {
  count: number;
  handle: string;
  maximumPrice: number;
  state: CollectionFilterState;
}) {
  return (
    <>
      <div className="collection-toolbar">
        <p>{count} {count === 1 ? "product" : "products"}</p>
        <details className="mobile-filters">
          <summary>Filter</summary>
          <div className="mobile-filters__panel">
            <FilterForm handle={handle} maximumPrice={maximumPrice} prefix="mobile" state={state} />
          </div>
        </details>
        <CollectionSort availability={state.availability} maxPrice={state.maxPrice} minPrice={state.minPrice} value={state.sort} />
      </div>
    </>
  );
}

export function CollectionFilterSidebar({
  handle,
  maximumPrice,
  state,
}: {
  handle: string;
  maximumPrice: number;
  state: CollectionFilterState;
}) {
  return (
    <aside aria-label="Product filters" className="collection-filters">
      <FilterForm handle={handle} maximumPrice={maximumPrice} prefix="desktop" state={state} />
    </aside>
  );
}

function FilterForm({
  handle,
  maximumPrice,
  prefix,
  state,
}: {
  handle: string;
  maximumPrice: number;
  prefix: string;
  state: CollectionFilterState;
}) {
  return (
    <form action={`/collections/${handle}`}>
      <input name="sort_by" type="hidden" value={state.sort} />
      <fieldset>
        <legend>Availability</legend>
        <label className="filter-checkbox" htmlFor={`${prefix}-availability`}>
          <input
            defaultChecked={state.availability}
            id={`${prefix}-availability`}
            name="availability"
            type="checkbox"
            value="in-stock"
          />
          <span>In stock</span>
        </label>
      </fieldset>
      <fieldset>
        <legend>Price</legend>
        <p className="filter-help">The highest price is ${maximumPrice.toFixed(2)}</p>
        <div className="price-filter">
          <label htmlFor={`${prefix}-min-price`}><span>$</span><input defaultValue={state.minPrice} id={`${prefix}-min-price`} min="0" name="price_min" placeholder="From" step="0.01" type="number" /></label>
          <label htmlFor={`${prefix}-max-price`}><span>$</span><input defaultValue={state.maxPrice} id={`${prefix}-max-price`} min="0" name="price_max" placeholder="To" step="0.01" type="number" /></label>
        </div>
      </fieldset>
      <div className="filter-actions">
        <button className="button button--primary" type="submit">Apply</button>
        <Link href={`/collections/${handle}?sort_by=${state.sort}`}>Clear</Link>
      </div>
    </form>
  );
}
