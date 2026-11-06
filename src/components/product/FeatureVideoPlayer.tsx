"use client";

import { useEffect, useRef, useState } from "react";
import type { PdpVideo } from "@/lib/product-content";

const PATHS = {
  muted: "M11 5 6 9H3v6h3l5 4V5zM16 9l5 6M21 9l-5 6",
  pause: "M8 5h3v14H8zM13 5h3v14h-3z",
  play: "M8 5v14l11-7z",
  sound: "M11 5 6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13",
};

function Glyph({ name }: { name: keyof typeof PATHS }) {
  const filled = name === "play" || name === "pause";
  return (
    <svg aria-hidden="true" fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d={PATHS[name]} />
    </svg>
  );
}

/**
 * Full-bleed product film: plays muted on loop, with small YouTube-style
 * controls in the bottom corner (play/pause, sound) and a thin progress bar.
 */
export function FeatureVideoPlayer({ video }: { video: PdpVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  // A phone-only source (`media`) is the vertical cut, so the frame goes 9:16 there.
  const verticalOnPhones = video.sources.some((source) => source.media);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.play().catch(() => undefined);
  }, []);

  function togglePlay() {
    const element = ref.current;
    if (!element) return;
    if (element.paused) element.play().catch(() => undefined);
    else element.pause();
  }

  function toggleSound() {
    const element = ref.current;
    if (!element) return;
    element.muted = !element.muted;
    if (!element.muted) {
      element.volume = 1;
      if (element.paused) element.play().catch(() => undefined);
    }
    setMuted(element.muted);
  }

  function seek(event: React.MouseEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element?.duration) return;
    const box = event.currentTarget.getBoundingClientRect();
    element.currentTime = ((event.clientX - box.left) / box.width) * element.duration;
  }

  return (
    <div className={`nwg-film${verticalOnPhones ? " nwg-film--vertical-phone" : ""}`}>
      <video
        autoPlay
        className="nwg-film__video"
        loop
        muted
        onClick={togglePlay}
        onPause={() => setPaused(true)}
        onPlay={() => setPaused(false)}
        onTimeUpdate={(event) => {
          const element = event.currentTarget;
          if (element.duration) setProgress(element.currentTime / element.duration);
        }}
        playsInline
        poster={video.poster}
        preload="metadata"
        ref={ref}
      >
        {video.sources.map((source) => (
          <source key={source.src} media={source.media} src={source.src} type={source.type} />
        ))}
      </video>
      <div className="nwg-film__bar">
        <div aria-hidden="true" className="nwg-film__progress" onClick={seek}>
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="nwg-film__controls">
          <button aria-label={paused ? "Play video" : "Pause video"} className="nwg-film__button" onClick={togglePlay} type="button">
            <Glyph name={paused ? "play" : "pause"} />
          </button>
          <button aria-label={muted ? "Turn sound on" : "Mute"} aria-pressed={!muted} className="nwg-film__button" onClick={toggleSound} type="button">
            <Glyph name={muted ? "muted" : "sound"} />
          </button>
        </div>
      </div>
    </div>
  );
}
