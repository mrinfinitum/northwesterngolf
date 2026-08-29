"use client";

export function CollectionSort({
  availability,
  maxPrice,
  minPrice,
  value,
}: {
  availability: boolean;
  maxPrice?: number;
  minPrice?: number;
  value: string;
}) {
  return (
    <form action="" className="collection-sort">
      {availability ? <input name="availability" type="hidden" value="in-stock" /> : null}
      {minPrice !== undefined ? <input name="price_min" type="hidden" value={minPrice} /> : null}
      {maxPrice !== undefined ? <input name="price_max" type="hidden" value={maxPrice} /> : null}
      <label htmlFor="collection-sort">Sort by</label>
      <select
        defaultValue={value}
        id="collection-sort"
        name="sort_by"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        <option value="featured">Featured</option>
        <option value="best-selling">Best selling</option>
        <option value="title-ascending">Alphabetically, A–Z</option>
        <option value="title-descending">Alphabetically, Z–A</option>
        <option value="price-ascending">Price, low to high</option>
        <option value="price-descending">Price, high to low</option>
        <option value="created-ascending">Date, old to new</option>
        <option value="created-descending">Date, new to old</option>
      </select>
    </form>
  );
}
