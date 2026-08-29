import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import {
  CollectionControls,
  CollectionFilterSidebar,
  type CollectionFilterState,
} from "@/components/collection/CollectionControls";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { getCollection, getProducts } from "@/lib/shopify";
import { metadataTitle } from "@/lib/seo";

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const sortOptions = {
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  "created-ascending": { sortKey: "CREATED", reverse: true },
  "created-descending": { sortKey: "CREATED", reverse: false },
  featured: { sortKey: "COLLECTION_DEFAULT", reverse: false },
  "price-ascending": { sortKey: "PRICE", reverse: false },
  "price-descending": { sortKey: "PRICE", reverse: true },
  "title-ascending": { sortKey: "TITLE", reverse: false },
  "title-descending": { sortKey: "TITLE", reverse: true },
} as const;

async function resolveCollection(handle: string, state?: CollectionFilterState) {
  if (handle === "all") {
    let products = await getProducts({ first: 48, sortKey: "BEST_SELLING" });
    if (state?.availability) products = products.filter((product) => product.availableForSale);
    if (state?.minPrice !== undefined) products = products.filter((product) => Number(product.priceRange.minVariantPrice.amount) >= state.minPrice!);
    if (state?.maxPrice !== undefined) products = products.filter((product) => Number(product.priceRange.minVariantPrice.amount) <= state.maxPrice!);
    if (state?.sort.startsWith("title")) products.sort((a, b) => a.title.localeCompare(b.title) * (state.sort.endsWith("descending") ? -1 : 1));
    if (state?.sort.startsWith("price")) products.sort((a, b) => (Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount)) * (state.sort.endsWith("descending") ? -1 : 1));
    return {
      description: "",
      handle: "all",
      products,
      seo: { description: null, title: null },
      title: "Shop All",
    };
  }
  const sort = state ? sortOptions[state.sort as keyof typeof sortOptions] ?? sortOptions.featured : sortOptions.featured;
  const filters = state ? [
    ...(state.availability ? [{ available: true }] : []),
    ...(state.minPrice !== undefined || state.maxPrice !== undefined ? [{ price: { max: state.maxPrice, min: state.minPrice } }] : []),
  ] : [];
  return getCollection(handle, { filters, reverse: sort.reverse, sortKey: sort.sortKey });
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await resolveCollection(handle);
  if (!collection) return { title: "Collection not found" };
  const title = collection.seo.title || collection.title;
  const description = collection.seo.description || collection.description || `Shop ${collection.title} from Northwestern Golf.`;

  return {
    title: metadataTitle(title),
    description,
    alternates: { canonical: `/collections/${collection.handle}` },
    openGraph: { description, title, url: `/collections/${collection.handle}` },
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { handle } = await params;
  const query = await searchParams;
  const single = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const parsePrice = (value: string | undefined) => value && Number.isFinite(Number(value)) ? Number(value) : undefined;
  const requestedSort = single(query.sort_by) || "featured";
  const state: CollectionFilterState = {
    availability: single(query.availability) === "in-stock",
    maxPrice: parsePrice(single(query.price_max)),
    minPrice: parsePrice(single(query.price_min)),
    sort: requestedSort in sortOptions ? requestedSort : "featured",
  };
  const [baseCollection, collection] = await Promise.all([
    resolveCollection(handle),
    resolveCollection(handle, state),
  ]);
  if (!collection) notFound();
  if (!baseCollection) notFound();
  const maximumPrice = Math.max(0, ...baseCollection.products.map((product) => Number(product.priceRange.maxVariantPrice.amount)));

  return (
    <div className="collection-page page-shell page-shell--wide">
      <CollectionHeader title={collection.title} />
      <CollectionControls count={collection.products.length} handle={handle} maximumPrice={maximumPrice} state={state} />
      <div className="collection-content">
        <CollectionFilterSidebar handle={handle} maximumPrice={maximumPrice} state={state} />
        <ProductGrid products={collection.products} />
      </div>
    </div>
  );
}
