import Image from "next/image";
import { ourStoryContent } from "@/config/site";
import { StoryValueCarousel } from "./StoryValueCarousel";

export function OurStory() {
  return (
    <article className="our-story-page">
      <section className="our-story-hero">
        <Image
          alt="Northwestern Golf headquarters"
          className="our-story-hero__image"
          fill
          priority
          sizes="100vw"
          src={ourStoryContent.hero.image}
        />
        <div className="our-story-hero__overlay" />
        <div className="our-story-hero__inner">
          <div>
            <h1>{ourStoryContent.hero.title}</h1>
            <span aria-hidden="true" />
          </div>
          <p>{ourStoryContent.hero.body}</p>
        </div>
      </section>

      <section className="our-story-legacy">
        <div className="our-story-legacy__inner">
          <div className="our-story-legacy__image">
            <Image
              alt={ourStoryContent.legacy.title}
              height={1200}
              sizes="(min-width: 1000px) 400px, (min-width: 600px) 38vw, 100vw"
              src={ourStoryContent.legacy.image}
              width={800}
            />
          </div>
          <div className="our-story-legacy__content">
            <h2>{ourStoryContent.legacy.title}</h2>
            {ourStoryContent.legacy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <section className="story-values">
        <div className="story-values__inner">
          <h2>Our Core Values</h2>
          {ourStoryContent.valueGroups.map((items, index) => (
            <StoryValueCarousel items={items} key={index} />
          ))}
        </div>
      </section>
    </article>
  );
}
