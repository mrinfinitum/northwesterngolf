"use client";

import { useEffect, useState } from "react";
import { FacetForm, type FacetConfig } from "./FacetForm";
import { CloseIcon, FiltersIcon } from "./icons";

/**
 * Mobile/tablet "Filter and sort" floating button and drawer (bottom sheet
 * below 700px, left drawer up to 1000px), mirroring the live theme.
 */
export function FacetDrawer({ config }: { config: FacetConfig }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="nwg-col-floating">
        <button aria-expanded={open} aria-haspopup="dialog" className="nwg-col-button nwg-col-floating__button" onClick={() => setOpen(true)} type="button">
          <FiltersIcon />
          Filter and sort
        </button>
      </div>
      <div aria-label="Filters" aria-modal="true" className="nwg-col-drawer" data-open={open || undefined} hidden={!open} role="dialog">
        <div className="nwg-col-drawer__overlay" onClick={() => setOpen(false)} />
        <button aria-label="Close" className="nwg-col-drawer__outside-close" onClick={() => setOpen(false)} type="button">
          <CloseIcon />
        </button>
        <div className="nwg-col-drawer__content">
          <header className="nwg-col-drawer__header">
            <p>Filters</p>
            <button aria-label="Close" onClick={() => setOpen(false)} type="button"><CloseIcon /></button>
          </header>
          <div className="nwg-col-drawer__body">
            {open ? <FacetForm config={config} onApplied={() => setOpen(false)} variant="drawer" /> : null}
          </div>
        </div>
      </div>
    </>
  );
}
