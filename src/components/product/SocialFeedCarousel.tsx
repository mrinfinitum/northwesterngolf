"use client";

import { useEffect, useRef } from "react";
import type { SocialPost } from "@/lib/product-content/social-feed";

export function SocialFeedCarousel({ posts }: { posts: SocialPost[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Instafeed auto-loops the reels that are on screen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && !reduceMotion) {
            video.muted = true;
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        }
      },
      { root: track, threshold: 0.6 },
    );
    track.querySelectorAll("video").forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [posts]);

  function move(direction: 1 | -1) {
    const track = trackRef.current;
    const item = track?.firstElementChild as HTMLElement | null;
    if (!track || !item) return;
    track.scrollBy({ behavior: "smooth", left: direction * item.offsetWidth });
  }

  return (
    <div className="nwg-pdp-social">
      <div className="nwg-pdp-social__track" ref={trackRef}>
        {posts.map((post) => (
          <a className="nwg-pdp-social__item" href={post.link} key={post.id} rel="noopener noreferrer" target="_blank">
            {post.video ? (
              <video loop muted playsInline poster={post.poster} preload="none" src={post.video} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" loading="lazy" src={post.poster} />
            )}
            {post.collaborator ? <span className="nwg-pdp-social__tag">{post.collaborator}</span> : null}
            <span className="sr-only">Open Instagram post</span>
          </a>
        ))}
      </div>
      <button aria-label="previous post" className="nwg-pdp-social__arrow is-prev" onClick={() => move(-1)} type="button">
        <svg aria-hidden="true" height="12" viewBox="0 0 8 12" width="8"><path d="M6.5 1 1.5 6l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
      </button>
      <button aria-label="next post" className="nwg-pdp-social__arrow is-next" onClick={() => move(1)} type="button">
        <svg aria-hidden="true" height="12" viewBox="0 0 8 12" width="8"><path d="m1.5 1 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
      </button>
    </div>
  );
}
