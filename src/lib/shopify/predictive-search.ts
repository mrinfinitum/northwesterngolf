import "server-only";

import { shopifyFetch, type Money } from ".";
import { PREDICTIVE_SEARCH_QUERY } from "./queries/predictive-search";

export type PredictiveSearchResult = {
  collections: Array<{ handle: string; id: string; title: string }>;
  products: Array<{
    compareAtPriceRange: { maxVariantPrice: Money };
    featuredImage: { altText: string | null; height: number | null; url: string; width: number | null } | null;
    handle: string;
    id: string;
    priceRange: { minVariantPrice: Money };
    title: string;
  }>;
  queries: Array<{ text: string }>;
};

export async function predictiveSearch(query: string, limit = 10): Promise<PredictiveSearchResult> {
  const data = await shopifyFetch<{ predictiveSearch: PredictiveSearchResult | null }>({
    query: PREDICTIVE_SEARCH_QUERY,
    tags: ["search"],
    variables: { limit, query },
  });

  return data.predictiveSearch ?? { collections: [], products: [], queries: [] };
}
