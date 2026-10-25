"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { ShopifyImage } from "@/lib/shopify";
import { ChevronIcon, CloseIcon, ZoomIcon } from "./icons";

type GalleryProps = {
  activeIndex: number;
  media: ShopifyImage[];
  onActiveIndexChange: (index: number) => void;
  productTitle: string;
};

/**
 * Impact-style product gallery: scroll-snapping carousel, custom arrow cursor
 * and thumbnail strip on desktop, page dots on mobile, zoom lightbox.
 */
export function ProductGallery({ activeIndex, media, onActiveIndexChange, productTitle }: GalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const programmaticScroll = useRef(false);
  const hasMounted = useRef(false);
  const [cursor, setCursor] = useState<{ side: "next" | "prev"; x: number; y: number } | null>(null);
  const [thumbOverflow, setThumbOverflow] = useState({ end: false, start: false });
  const [zoomIndex, setZoomIndex] = useState(0);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    programmaticScroll.current = true;
    track.scrollTo({ behavior, left: slide.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || "0") });
    window.setTimeout(() => {
      programmaticScroll.current = false;
    }, behavior === "smooth" ? 600 : 0);
  }, []);

  // Keep the carousel in sync when the active image changes (thumbnails, variants).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[activeIndex] as HTMLElement | undefined;
    if (!slide) return;
    const current = Math.round(track.scrollLeft / Math.max(1, slide.offsetWidth));
    if (current !== activeIndex) scrollToIndex(activeIndex, hasMounted.current ? "smooth" : "instant");
    hasMounted.current = true;
    const thumb = thumbsRef.current?.children[activeIndex] as HTMLElement | undefined;
    const thumbs = thumbsRef.current;
    if (thumb && thumbs) {
      const left = thumb.offsetLeft - thumbs.offsetLeft;
      if (left < thumbs.scrollLeft || left + thumb.offsetWidth > thumbs.scrollLeft + thumbs.clientWidth) {
        thumbs.scrollTo({ behavior: "smooth", left: left - thumbs.clientWidth / 2 + thumb.offsetWidth / 2 });
      }
    }
  }, [activeIndex, scrollToIndex]);

  const updateThumbOverflow = useCallback(() => {
    const thumbs = thumbsRef.current;
    if (!thumbs) return;
    setThumbOverflow({
      end: thumbs.scrollLeft + thumbs.clientWidth < thumbs.scrollWidth - 1,
      start: thumbs.scrollLeft > 1,
    });
  }, []);

  useEffect(() => {
    updateThumbOverflow();
    window.addEventListener("resize", updateThumbOverflow);
    return () => window.removeEventListener("resize", updateThumbOverflow);
  }, [updateThumbOverflow, media.length]);

  function onTrackScroll() {
    const track = trackRef.current;
    if (!track || programmaticScroll.current) return;
    const width = (track.children[0] as HTMLElement | undefined)?.offsetWidth ?? track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    const index = Math.round(track.scrollLeft / (width + gap));
    if (index !== activeIndex && index >= 0 && index < media.length) onActiveIndexChange(index);
  }

  function go(delta: number) {
    if (media.length < 2) return;
    onActiveIndexChange((activeIndex + delta + media.length) % media.length);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || media.length < 2) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    setCursor({ side: x < rect.width / 2 ? "prev" : "next", x, y: event.clientY - rect.top });
  }

  function openZoom() {
    setZoomIndex(activeIndex);
    dialogRef.current?.showModal();
  }

  function scrollThumbs(direction: 1 | -1) {
    const thumbs = thumbsRef.current;
    if (!thumbs) return;
    thumbs.scrollBy({ behavior: "smooth", left: direction * thumbs.clientWidth * 0.8 });
  }

  if (!media.length) {
    return <div className="nwg-pdp-gallery nwg-pdp-gallery--empty" />;
  }

  const zoomImage = media[zoomIndex] ?? media[0];

  return (
    <div className="nwg-pdp-gallery">
      <div className="nwg-pdp-gallery__viewport">
        <div
          className={`nwg-pdp-gallery__track${media.length > 1 ? " has-cursor" : ""}`}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("button")) return;
            if (cursor) go(cursor.side === "next" ? 1 : -1);
          }}
          onPointerLeave={() => setCursor(null)}
          onPointerMove={onPointerMove}
          onScroll={onTrackScroll}
          ref={trackRef}
        >
          {media.map((image, index) => (
            <div aria-hidden={index !== activeIndex} className="nwg-pdp-gallery__slide" key={image.id}>
              <Image
                alt={image.altText || productTitle}
                height={image.height ?? 3000}
                priority={index === 0}
                sizes="(max-width: 999px) calc(100vw - 40px), min(760px, 50vw)"
                src={image.url}
                width={image.width ?? 3000}
              />
            </div>
          ))}
        </div>
        {cursor ? (
          <span
            aria-hidden="true"
            className={`nwg-pdp-gallery__cursor is-${cursor.side}`}
            style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
          >
            <ChevronIcon />
          </span>
        ) : null}
        <button aria-label="Zoom" className="nwg-pdp-gallery__zoom" onClick={openZoom} type="button">
          <ZoomIcon />
        </button>
      </div>

      {media.length > 1 ? (
        <div aria-label="Choose image" className="nwg-pdp-gallery__dots" role="group">
          {media.map((image, index) => (
            <button
              aria-current={index === activeIndex}
              aria-label={`Go to item ${index + 1}`}
              key={image.id}
              onClick={() => onActiveIndexChange(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}

      {media.length > 1 ? (
        <div className="nwg-pdp-gallery__thumbs-wrapper">
          <button
            aria-label="Previous"
            className="nwg-pdp-gallery__thumbs-nav is-prev"
            disabled={!thumbOverflow.start}
            onClick={() => scrollThumbs(-1)}
            type="button"
          >
            <ChevronIcon />
          </button>
          <div className="nwg-pdp-gallery__thumbs" onScroll={updateThumbOverflow} ref={thumbsRef}>
            {media.map((image, index) => (
              <button
                aria-current={index === activeIndex}
                aria-label={`Go to item ${index + 1}`}
                className="nwg-pdp-gallery__thumb"
                key={image.id}
                onClick={() => onActiveIndexChange(index)}
                type="button"
              >
                <Image alt={image.altText || productTitle} height={64} sizes="64px" src={image.url} width={64} />
              </button>
            ))}
          </div>
          <button
            aria-label="Next"
            className="nwg-pdp-gallery__thumbs-nav is-next"
            disabled={!thumbOverflow.end}
            onClick={() => scrollThumbs(1)}
            type="button"
          >
            <ChevronIcon />
          </button>
        </div>
      ) : null}

      <dialog aria-label={`${productTitle} zoom`} className="nwg-pdp-zoom" onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }} ref={dialogRef}>
        <div className="nwg-pdp-zoom__canvas">
          <Image alt={zoomImage.altText || productTitle} fill sizes="100vw" src={zoomImage.url} />
        </div>
        <div className="nwg-pdp-zoom__controls">
          {media.length > 1 ? (
            <button aria-label="Previous" className="nwg-pdp-zoom__button is-prev" onClick={() => setZoomIndex((zoomIndex - 1 + media.length) % media.length)} type="button">
              <ChevronIcon />
            </button>
          ) : null}
          <button aria-label="Close" className="nwg-pdp-zoom__button" onClick={() => dialogRef.current?.close()} type="button">
            <CloseIcon />
          </button>
          {media.length > 1 ? (
            <button aria-label="Next" className="nwg-pdp-zoom__button" onClick={() => setZoomIndex((zoomIndex + 1) % media.length)} type="button">
              <ChevronIcon />
            </button>
          ) : null}
        </div>
      </dialog>
    </div>
  );
}
