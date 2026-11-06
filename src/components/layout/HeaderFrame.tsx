"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Routes whose first section sits under a translucent, non-sticky header. */
const transparentHeaderRoutes = new Set(["/pages/contact", "/pages/our-story"]);

export function HeaderFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const transparent = transparentHeaderRoutes.has(pathname);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    // Mirrors the theme: expose the rendered header height for sections that
    // need to tuck beneath it (the nav can wrap to two rows near 1150px).
    const update = () => {
      document.documentElement.style.setProperty("--header-height", `${Math.round(header.offsetHeight)}px`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(header);
    update();
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`site-header${transparent ? " site-header--transparent" : ""}`} ref={ref}>
      {children}
    </header>
  );
}
