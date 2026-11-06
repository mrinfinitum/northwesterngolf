"use client";

import { useEffect, useRef, useState } from "react";
import type { PdpVideo } from "@/lib/product-content";

/**
 * Full-bleed product film. Plays muted on loop as a preview; "Play with sound"
 * restarts it from the top with audio and native player controls.
 */
export function FeatureVideoPlayer({ video }: { video: PdpVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [withSound, setWithSound] = useState(false);
  // A phone-only source (`media`) is the vertical cut, so the frame goes 9:16 there.
  const verticalOnPhones = video.sources.some((source) => source.media);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.play().catch(() => undefined);
  }, []);

  function playWithSound() {
    const element = ref.current;
    if (!element) return;
    element.loop = false;
    element.currentTime = 0;
    element.muted = false;
    element.volume = 1;
    setWithSound(true);
    element.play().catch(() => undefined);
  }

  return (
    <div className={`nwg-film${verticalOnPhones ? " nwg-film--vertical-phone" : ""}${withSound ? " is-playing" : ""}`}>
      <video
        autoPlay
        className="nwg-film__video"
        controls={withSound}
        loop={!withSound}
        muted
        playsInline
        poster={video.poster}
        preload="metadata"
        ref={ref}
      >
        {video.sources.map((source) => (
          <source key={source.src} media={source.media} src={source.src} type={source.type} />
        ))}
      </video>
      {withSound ? null : (
        <button className="nwg-film__play" onClick={playWithSound} type="button">
          <span aria-hidden="true" className="nwg-film__play-icon">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          </span>
          <span className="nwg-film__play-label">Play with sound</span>
        </button>
      )}
    </div>
  );
}
