"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";

export function SearchShell() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        aria-expanded={open}
        aria-label="Search"
        className="icon-button"
        onClick={() => setOpen(true)}
        type="button"
      >
        <SearchIcon />
      </button>
      {open ? (
        <div aria-modal="true" className="search-overlay" role="dialog">
          <form action="/search" className="search-overlay__form">
            <SearchIcon />
            <label className="sr-only" htmlFor="site-search">Search the store</label>
            <input id="site-search" name="q" placeholder="Search for..." ref={inputRef} type="search" />
            <button aria-label="Close search" className="icon-button" onClick={() => setOpen(false)} type="button">
              <CloseIcon />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
