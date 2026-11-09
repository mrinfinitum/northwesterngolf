"use client";

import { useEffect, useRef } from "react";
import type { PdpVideo } from "@/lib/product-content";

/** Muted looping background video (React does not serialize `muted` during SSR). */
export function AutoplayVideo({ className, video }: { className?: string; video: PdpVideo }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.play().catch(() => undefined);
  }, []);

  return (
    <video autoPlay className={className} loop muted playsInline poster={video.poster} preload="metadata" ref={ref}>
      {video.sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
