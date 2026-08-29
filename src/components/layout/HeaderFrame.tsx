"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const transparentHeaderRoutes = new Set(["/pages/our-story"]);

export function HeaderFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [filled, setFilled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const previousScrollY = useRef(0);
  const transparent = transparentHeaderRoutes.has(pathname);

  useEffect(() => {
    let animationFrame = 0;

    const update = () => {
      const currentScrollY = window.scrollY;
      const movement = currentScrollY - previousScrollY.current;

      setFilled(currentScrollY > 0);

      if (currentScrollY <= 16) {
        setHidden(false);
      } else if (Math.abs(movement) >= 6) {
        setHidden(movement > 0);
      }

      previousScrollY.current = currentScrollY;
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(update);
    };

    previousScrollY.current = window.scrollY;
    update();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <header
      className={`site-header${transparent ? " site-header--transparent" : ""}${filled ? " is-filled" : ""}${hidden ? " is-hidden" : ""}`}
      onFocusCapture={() => setHidden(false)}
    >
      {children}
    </header>
  );
}
