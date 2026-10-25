"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { ChevronIcon } from "./icons";
import { listingHref, PARAM, type ListingState, type SortOption } from "./listing-state";
import { PriceRange } from "./PriceRange";

export type FacetConfig = {
  baseParams: Record<string, string>;
  /** Sort shown as selected when the URL has no explicit `sort_by`. */
  effectiveSort: string;
  pathname: string;
  /** Ceiling of the price facet; `undefined` hides the price filter. */
  priceMax?: number;
  showAvailability: boolean;
  sortOptions: SortOption[];
  state: ListingState;
};

/**
 * Facet form shared by the desktop sidebar (applies on change, like the live
 * theme's `update-on-change` form) and the mobile drawer (collects a draft and
 * applies with the "Apply" button). Without JavaScript it is a plain GET form.
 */
export function FacetForm({
  config,
  onApplied,
  variant,
}: {
  config: FacetConfig;
  onApplied?: () => void;
  variant: "drawer" | "sidebar";
}) {
  const { baseParams, effectiveSort, pathname, priceMax, showAvailability, sortOptions, state } = config;
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [draft, setDraft] = useState<ListingState>(state);
  const [draftSort, setDraftSort] = useState(state.sort ?? effectiveSort);
  const idPrefix = `facet-${variant}`;

  function navigate(next: ListingState) {
    startTransition(() => router.push(listingHref(pathname, baseParams, next), { scroll: false }));
  }

  function update(next: ListingState, commit: boolean) {
    setDraft(next);
    if (variant === "sidebar" && commit) {
      const changed = next.inStock !== state.inStock || next.priceMin !== state.priceMin || next.priceMax !== state.priceMax;
      if (changed) navigate(next);
    }
  }

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (variant === "drawer") {
      navigate({ ...draft, sort: !state.sort && draftSort === effectiveSort ? undefined : draftSort });
      onApplied?.();
    } else {
      navigate(draft);
    }
  }

  const activeCount = 1 + (draft.inStock ? 1 : 0) + (draft.priceMin !== undefined || draft.priceMax !== undefined ? 1 : 0);

  return (
    <form action={pathname} className={`nwg-col-facets nwg-col-facets--${variant}`} method="get" onSubmit={apply}>
      {Object.entries(baseParams).map(([name, value]) => <input key={name} name={name} type="hidden" value={value} />)}
      {variant === "sidebar" && state.sort ? <input name={PARAM.sort} type="hidden" value={state.sort} /> : null}

      {variant === "drawer" ? (
        <details className="nwg-col-accordion">
          <summary className="nwg-col-accordion__toggle">
            <span>Sort by</span>
            <span className="nwg-col-chevron"><ChevronIcon /></span>
          </summary>
          <div className="nwg-col-accordion__content">
            <div className="nwg-col-radios">
              {sortOptions.map((option) => (
                <label className="nwg-col-radio" htmlFor={`${idPrefix}-sort-${option.value}`} key={option.value}>
                  <input
                    checked={draftSort === option.value}
                    id={`${idPrefix}-sort-${option.value}`}
                    name={PARAM.sort}
                    onChange={() => setDraftSort(option.value)}
                    type="radio"
                    value={option.value}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </details>
      ) : null}

      {showAvailability ? (
        <div className="nwg-col-accordion">
          <div className="nwg-col-accordion__toggle">
            <label htmlFor={`${idPrefix}-availability`}>In stock only</label>
            <input
              checked={draft.inStock}
              className="nwg-col-switch"
              id={`${idPrefix}-availability`}
              name={PARAM.availability}
              onChange={(event) => update({ ...draft, inStock: event.target.checked }, true)}
              role="switch"
              type="checkbox"
              value="1"
            />
          </div>
        </div>
      ) : null}

      {priceMax !== undefined ? (
        <details className="nwg-col-accordion">
          <summary className="nwg-col-accordion__toggle">
            <span>Price</span>
            <span className="nwg-col-chevron"><ChevronIcon /></span>
          </summary>
          <div className="nwg-col-accordion__content">
            <PriceRange
              idPrefix={idPrefix}
              max={priceMax}
              maxValue={draft.priceMax}
              minValue={draft.priceMin}
              onChange={(min, max, commit) => update({ ...draft, priceMax: max, priceMin: min }, commit)}
            />
          </div>
        </details>
      ) : null}

      {variant === "drawer" ? (
        <div className="nwg-col-facets__apply">
          <button className="nwg-col-button nwg-col-button--block" type="submit">
            {`Apply (${activeCount})`}
          </button>
        </div>
      ) : (
        <noscript>
          <button className="nwg-col-button nwg-col-button--block nwg-col-facets__noscript" type="submit">Apply</button>
        </noscript>
      )}
    </form>
  );
}
