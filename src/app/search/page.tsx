import type { Metadata } from "next";
import Link from "next/link";
import { SearchIcon } from "@/components/collection/icons";
import {
  activeFilterInputs,
  parseListingState,
  priceCeiling,
  SEARCH_SORT_OPTIONS,
  type SearchParamsRecord,
} from "@/components/collection/listing-state";
import { ProductListing } from "@/components/collection/ProductListing";
import { searchContent, searchProducts } from "@/lib/shopify/listing";
import "../collections/collection.css";
import "./search.css";

export const metadata: Metadata = {
  title: "Search",
  alternates: { canonical: "/search" },
  robots: { follow: true, index: false },
};

type SearchPageProps = { searchParams: Promise<SearchParamsRecord> };

const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

function SearchForm({ query, withButton = false }: { query: string; withButton?: boolean }) {
  return (
    <form action="/search" className="nwg-search-form" method="get" role="search">
      <div className="nwg-search-input">
        <input
          aria-label="Search"
          autoComplete="off"
          autoCorrect="off"
          defaultValue={query}
          name="q"
          placeholder="Search for..."
          spellCheck={false}
          type="search"
        />
        <button aria-label="Search" type="submit"><SearchIcon height={22} width={22} /></button>
      </div>
      {withButton ? <button className="nwg-col-button nwg-col-button--xl" type="submit">Search</button> : null}
    </form>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = single(params.q)?.trim() ?? "";

  if (!query) return <SearchPrompt query="" title="Search" />;

  const state = parseListingState(params, SEARCH_SORT_OPTIONS);
  const sort = state.sort ?? "relevance";
  const [products, content] = await Promise.all([
    searchProducts(query, {
      filters: activeFilterInputs(state),
      reverse: sort === "price-descending",
      sortKey: sort === "relevance" ? "RELEVANCE" : "PRICE",
    }),
    searchContent(query),
  ]);
  const pages = content.filter((result) => result.resultType === "page");
  const articles = content.filter((result) => result.resultType === "article");
  const isFiltered = activeFilterInputs(state).length > 0;
  const hasProducts = products.totalCount > 0 || isFiltered;
  const total = products.totalCount + content.length;

  if (!total && !isFiltered) return <SearchPrompt query={query} title="No results could be found." />;

  const tabs = [
    ...(hasProducts ? [{ label: "Products", type: "product" }] : []),
    ...(pages.length ? [{ label: "Pages", type: "page" }] : []),
    ...(articles.length ? [{ label: "Blog posts", type: "article" }] : []),
  ];
  const requestedType = single(params.type);
  const activeType = tabs.find((tab) => tab.type === requestedType)?.type ?? tabs[0]?.type;
  const tabHref = (type: string) => `/search?${new URLSearchParams({ q: query, type })}`;
  const contentResults = activeType === "page" ? pages : activeType === "article" ? articles : [];

  return (
    <div className="nwg-search">
      <div className="nwg-search-banner">
        <h1 className="nwg-search-title">{total} {total === 1 ? "result" : "results"} for &quot;{query}&quot;</h1>
        <SearchForm query={query} />
        <nav aria-label="Search result types" className="nwg-search-tabs">
          {tabs.map((tab) => (
            <Link aria-current={tab.type === activeType ? "page" : undefined} href={tabHref(tab.type)} key={tab.type} scroll={false}>
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="nwg-col-container">
        {activeType === "product" ? (
          <ProductListing
            clearHref={`/search?${new URLSearchParams({ q: query, type: "product" })}`}
            config={{
              baseParams: { q: query, type: "product" },
              effectiveSort: "relevance",
              pathname: "/search",
              priceMax: priceCeiling(products.filters),
              showAvailability: products.filters.some((filter) => filter.id === "filter.v.availability"),
              sortOptions: SEARCH_SORT_OPTIONS,
              state,
            }}
            products={products.products}
            showCount={false}
          />
        ) : (
          <ul className="nwg-search-content">
            {contentResults.map((result) => (
              <li key={result.id}>
                <Link href={result.resultType === "page" ? `/pages/${result.handle}` : `/blogs/${result.blog.handle}/${result.handle}`}>
                  {result.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SearchPrompt({ query, title }: { query: string; title: string }) {
  return (
    <div className="nwg-search">
      <div className="nwg-col-container">
        <div className="nwg-search-prompt">
          <h1 className="nwg-search-title">{title}</h1>
          <SearchForm query={query} withButton />
        </div>
      </div>
    </div>
  );
}
