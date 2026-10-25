"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronIcon } from "./icons";

export type SortLink = { href: string; label: string; selected: boolean; value: string };

/** "Sort by: <value>" control with the theme's anchored listbox popover. */
export function SortPopover({ options }: { options: SortLink[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const current = options.find((option) => option.selected) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="nwg-col-sort" ref={rootRef}>
      <span className="nwg-col-sort__label" id={`${id}-label`}>Sort by:</span>
      <button
        aria-controls={`${id}-popover`}
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        className="nwg-col-sort__button"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="nwg-col-sort__value" id={`${id}-value`}>{current?.label}</span>
        <span className="nwg-col-chevron"><ChevronIcon /></span>
      </button>
      <div className="nwg-col-sort__popover" hidden={!open} id={`${id}-popover`}>
        <ul aria-labelledby={`${id}-label`} className="nwg-col-sort__list" role="listbox">
          {options.map((option) => (
            <li aria-selected={option.selected} key={option.value} role="option">
              <Link href={option.href} onClick={() => setOpen(false)} prefetch={false} scroll={false}>
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
