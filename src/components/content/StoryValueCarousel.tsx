"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type StoryValue = {
  body: string;
  image: string;
  title: string;
};

export function StoryValueCarousel({ items }: { items: readonly StoryValue[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children.item(index) as HTMLElement | null;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActive(index);
  }

  function updateActive() {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const center = track.scrollLeft + track.clientWidth / 2;
    const closest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      return distance < best.distance ? { distance, index } : best;
    }, { distance: Number.POSITIVE_INFINITY, index: 0 });
    setActive(closest.index);
  }

  return (
    <div className="story-values__carousel">
      <div className="story-values__track" onScroll={updateActive} ref={trackRef}>
        {items.map((item) => (
          <article className="story-value" key={item.title}>
            <Image alt="" aria-hidden="true" height={92} src={item.image} width={92} />
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <div aria-label="Choose core value" className="story-values__dots">
        {items.map((item, index) => (
          <button
            aria-label={`Show ${item.title}`}
            aria-pressed={active === index}
            key={item.title}
            onClick={() => goTo(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
