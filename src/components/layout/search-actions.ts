"use server";

import { predictiveSearch, type PredictiveSearchResult } from "@/lib/shopify/predictive-search";

const EMPTY: PredictiveSearchResult = { collections: [], products: [], queries: [] };

export async function predictiveSearchAction(query: string): Promise<PredictiveSearchResult> {
  const term = query.trim().slice(0, 100);
  if (!term) return EMPTY;

  try {
    return await predictiveSearch(term);
  } catch {
    return EMPTY;
  }
}
