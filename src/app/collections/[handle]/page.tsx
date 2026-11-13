import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { allProductsCollection, collectionDefaultSort, FALLBACK_COLLECTION_SORT } from "@/components/collection/collection-config";
import {
  activeFilterInputs,
  COLLECTION_SORT_OPTIONS,
  parseListingState,
  priceCeiling,
  type SearchParamsRecord,
} from "@/components/collection/listing-state";
import { ListingEmptyState, ProductListing } from "@/components/collection/ProductListing";
import {
  getAllProductsListing,
  getCollectionListing,
  type CollectionSortKey,
  type ProductSortKey,
} from "@/lib/shopify/listing";
import { emptyCollectionDestination, missingLegacyCollections } from "@/config/legacy-redirects";
import { metadataTitle, openGraphBase } from "@/lib/seo";
import "../collection.css";

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<SearchParamsRecord>;
};

const collectionSortKeys: Record<string, [CollectionSortKey, boolean]> = {
  "best-selling": ["BEST_SELLING", false],
  "created-ascending": ["CREATED", false],
  "created-descending": ["CREATED", true],
  manual: ["MANUAL", false],
  "most-relevant": ["RELEVANCE", false],
  "price-ascending": ["PRICE", false],
  "price-descending": ["PRICE", true],
  "title-ascending": ["TITLE", false],
  "title-descending": ["TITLE", true],
};

const productSortKeys: Record<string, [ProductSortKey, boolean]> = {
  "best-selling": ["BEST_SELLING", false],
  "created-ascending": ["CREATED_AT", false],
  "created-descending": ["CREATED_AT", true],
  manual: ["BEST_SELLING", false],
  "most-relevant": ["RELEVANCE", false],
  "price-ascending": ["PRICE", false],
  "price-descending": ["PRICE", true],
  "title-ascending": ["TITLE", false],
  "title-descending": ["TITLE", true],
};

const DEFAULT_COLLECTION_QUERY = { filters: [], reverse: false, sortKey: "COLLECTION_DEFAULT" as const };

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  if (handle === "all") {
    const title = "Shop All Golf Club Sets";
    const description =
      "Shop every Northwestern Golf club set: the Men's John Daly Signature Set and the Junior Signature Sets for ages 5-8 and 9-12, each with a matching stand bag.";
    return {
      title: metadataTitle(title),
      description,
      alternates: { canonical: "/collections/all" },
      openGraph: { ...openGraphBase, description, title, url: "/collections/all" },
    };
  }
  const collection = await getCollectionListing(handle, DEFAULT_COLLECTION_QUERY);
  if (!collection) return { title: "Collection not found" };
  const title = collection.seo.title || collection.title;
  const description = collection.seo.description || collection.description || `Shop ${collection.title} golf clubs from Northwestern Golf, built for real golfers and priced for the people.`;

  return {
    title: metadataTitle(title),
    description,
    alternates: { canonical: `/collections/${collection.handle}` },
    openGraph: { ...openGraphBase, description, title, url: `/collections/${collection.handle}` },
    // Legacy collections with no products stay reachable but out of the index (and the sitemap).
    robots: collection.products.length ? undefined : { follow: true, index: false },
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { handle } = await params;
  const state = parseListingState(await searchParams, COLLECTION_SORT_OPTIONS);
  const filters = activeFilterInputs(state);
  const pathname = `/collections/${handle}`;

  let title: string;
  let effectiveSort: string;
  let listing;
  if (handle === "all") {
    effectiveSort = allProductsCollection.defaultSort;
    const [sortKey, reverse] = productSortKeys[state.sort ?? effectiveSort];
    listing = await getAllProductsListing({ filters, reverse, sortKey });
    title = allProductsCollection.title;
  } else {
    effectiveSort = collectionDefaultSort[handle] ?? FALLBACK_COLLECTION_SORT;
    const [sortKey, reverse] = state.sort ? collectionSortKeys[state.sort] : (["COLLECTION_DEFAULT", false] as const);
    const collection = await getCollectionListing(handle, { filters, reverse, sortKey });
    if (!collection) {
      if (missingLegacyCollections.has(handle)) permanentRedirect("/collections/all");
      notFound();
    }
    // Old collections with nothing in them send visitors to the closest live page.
    if (!collection.products.length && !filters.length) permanentRedirect(emptyCollectionDestination(handle));
    listing = collection;
    title = collection.title;
  }

  const isFiltered = filters.length > 0;

  return (
    <div className="nwg-col">
      <header className="nwg-col-header">
        <h1 className="nwg-col-title">{title}</h1>
      </header>
      <div className="nwg-col-container">
        {!listing.products.length && !isFiltered ? (
          <ListingEmptyState actionHref="/collections/all" actionLabel="Continue shopping" title="This collection is empty" />
        ) : (
          <ProductListing
            clearHref={pathname}
            config={{
              baseParams: {},
              effectiveSort,
              pathname,
              priceMax: priceCeiling(listing.filters),
              showAvailability: listing.filters.some((filter) => filter.id === "filter.v.availability"),
              sortOptions: COLLECTION_SORT_OPTIONS,
              state,
            }}
            products={listing.products}
          />
        )}
      </div>
    </div>
  );
}
