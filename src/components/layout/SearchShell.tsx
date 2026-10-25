"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { formatMoney } from "@/components/commerce/Money";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import type { PredictiveSearchResult } from "@/lib/shopify/predictive-search";
import { predictiveSearchAction } from "./search-actions";
import { useDrawer } from "./use-drawer";

const TABS = [
  { key: "products", label: "Products" },
  { key: "queries", label: "Suggestions" },
  { key: "collections", label: "Collections" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function SearchShell({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PredictiveSearchResult | null>(null);
  const [tab, setTab] = useState<TabKey>("products");
  const [, startTransition] = useTransition();
  const drawerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const requestId = useRef(0);

  const close = () => setOpen(false);
  useDrawer(open, close, drawerRef, triggerRef, inputRef);

  useEffect(() => {
    const term = query.trim();
    const id = ++requestId.current;
    if (!term) return;
    const timer = window.setTimeout(() => {
      startTransition(async () => {
        const next = await predictiveSearchAction(term);
        if (id !== requestId.current) return;
        setResults(next);
        setTab((current) => (next[current].length ? current : (TABS.find(({ key }) => next[key].length)?.key ?? "products")));
      });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const visibleTabs = results ? TABS.filter(({ key }) => results[key].length) : [];
  const showResults = Boolean(query.trim() && results);

  return (
    <>
      <button
        aria-controls="search-drawer"
        aria-expanded={open}
        aria-label="Search"
        className={`header-icon${className ? ` ${className}` : ""}`}
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <SearchIcon />
      </button>
      {open ? (
        <div className="drawer drawer--right search-drawer" id="search-drawer">
          <button aria-label="Close search" className="drawer__overlay" onClick={close} tabIndex={-1} type="button" />
          <div aria-label="Search" aria-modal="true" className="drawer__content" ref={drawerRef} role="dialog">
            <form action="/search" className="search-drawer__form" onSubmit={close} role="search">
              <div className="search-drawer__input">
                <input
                  aria-label="Search"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  name="q"
                  onChange={(event) => {
                    setQuery(event.target.value);
                    if (!event.target.value.trim()) setResults(null);
                  }}
                  placeholder="Search for..."
                  ref={inputRef}
                  spellCheck={false}
                  type="search"
                  value={query}
                />
                {query ? (
                  <button
                    className="search-drawer__clear"
                    onClick={() => {
                      setQuery("");
                      setResults(null);
                      inputRef.current?.focus();
                    }}
                    type="button"
                  >
                    Clear
                  </button>
                ) : null}
                <button aria-label="Close" className="search-drawer__close" onClick={close} type="button">
                  <CloseIcon />
                </button>
              </div>

              {showResults && results ? (
                visibleTabs.length ? (
                  <div className="search-drawer__results">
                    <div className="search-drawer__tabs" role="tablist">
                      {visibleTabs.map(({ key, label }) => (
                        <button aria-selected={tab === key} key={key} onClick={() => setTab(key)} role="tab" type="button">
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="search-drawer__panel" role="tabpanel">
                      {tab === "products"
                        ? results.products.map((product) => (
                            <Link className="search-result" href={`/products/${product.handle}`} key={product.id} onClick={close}>
                              {product.featuredImage ? (
                                <Image
                                  alt={product.featuredImage.altText || product.title}
                                  height={product.featuredImage.height ?? 400}
                                  sizes="96px"
                                  src={product.featuredImage.url}
                                  width={product.featuredImage.width ?? 400}
                                />
                              ) : (
                                <span className="search-result__placeholder" />
                              )}
                              <span className="search-result__info">
                                <span className="search-result__title"><span className="reversed-link">{product.title}</span></span>
                                <span className="search-result__price">{formatMoney(product.priceRange.minVariantPrice)}</span>
                              </span>
                            </Link>
                          ))
                        : null}
                      {tab === "queries"
                        ? results.queries.map(({ text }) => (
                            <Link className="search-drawer__suggestion" href={`/search?q=${encodeURIComponent(text)}`} key={text} onClick={close}>
                              <span className="reversed-link">{text}</span>
                            </Link>
                          ))
                        : null}
                      {tab === "collections"
                        ? results.collections.map((collection) => (
                            <Link className="search-drawer__suggestion" href={`/collections/${collection.handle}`} key={collection.id} onClick={close}>
                              <span className="reversed-link">{collection.title}</span>
                            </Link>
                          ))
                        : null}
                    </div>
                    <button className="button search-drawer__submit" type="submit">
                      View all results
                    </button>
                  </div>
                ) : (
                  <p className="search-drawer__empty">No results could be found.</p>
                )
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
