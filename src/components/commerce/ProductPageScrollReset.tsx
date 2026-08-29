"use client";

import { useEffect } from "react";

export function ProductPageScrollReset({ productHandle }: { productHandle: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";
    window.scrollTo({ left: 0, top: 0 });

    const restoreScrollBehavior = window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });

    return () => {
      window.cancelAnimationFrame(restoreScrollBehavior);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [productHandle]);

  return null;
}
