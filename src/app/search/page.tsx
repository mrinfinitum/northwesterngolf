import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { searchStore } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Search",
  alternates: { canonical: "/search" },
  robots: { follow: true, index: false },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const rawQuery = (await searchParams).q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery || "";
  const results = query ? await searchStore(query) : [];
  const products = results.filter((result) => result.resultType === "product");
  const content = results.filter((result) => result.resultType !== "product");

  return (
    <div className="search-page page-shell page-shell--wide">
      <header className="search-page__header">
        <h1>Search</h1>
        <form action="/search">
          <label className="sr-only" htmlFor="search-page-input">Search products and content</label>
          <input defaultValue={query} id="search-page-input" name="q" placeholder="Search for..." type="search" />
          <button className="button button--primary" type="submit">Search</button>
        </form>
        {query ? <p>{results.length} results for “{query}”</p> : <p>Search Northwestern Golf products and information.</p>}
      </header>
      {query && products.length ? <ProductGrid products={products} /> : null}
      {query && !results.length ? <div className="empty-state"><h2>No results</h2><p>Check the spelling or try a broader search.</p></div> : null}
      {content.length ? (
        <section className="search-content-results">
          <h2>Pages and articles</h2>
          <ul>
            {content.map((result) => (
              <li key={result.id}>
                <Link href={result.resultType === "page" ? `/pages/${result.handle}` : `/blogs/${result.blog.handle}/${result.handle}`}>{result.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
