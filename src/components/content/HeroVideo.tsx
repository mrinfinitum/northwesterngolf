"use client";

import { useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  /** Breakpoint (px) at or below which `mobileSrc` is used. */
  mobileMaxWidth: number;
  mobileSrc: string;
  src: string;
};

/**
 * Background video that never competes with the poster (the LCP element):
 * the source is only attached once the page has finished loading, and it is
 * skipped entirely for reduced-motion and Save-Data visitors.
 */
export function HeroVideo({ mobileMaxWidth, mobileSrc, src }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      video.src = window.matchMedia(`(max-width: ${mobileMaxWidth}px)`).matches ? mobileSrc : src;
      video.play().catch(() => {});
    };
    // A short beat after `load` lets late, above-the-fold work settle first.
    const schedule = () => {
      timer = setTimeout(start, 300);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      clearTimeout(timer);
    };
  }, [mobileMaxWidth, mobileSrc, src]);

  return (
    <video
      aria-hidden="true"
      className={`home-hero__video${playing ? " is-playing" : ""}`}
      disablePictureInPicture
      loop
      muted
      onPlaying={() => setPlaying(true)}
      playsInline
      preload="none"
      ref={ref}
      tabIndex={-1}
    />
  );
}
