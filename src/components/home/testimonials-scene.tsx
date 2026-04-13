import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import type { HomepageData } from "@/lib/content/types";

type TestimonialsSceneProps = {
  testimonials: HomepageData["testimonials"];
};

export function TestimonialsScene({ testimonials }: TestimonialsSceneProps) {
  return (
    <ScrollScene
      className="testimonials-scene testimonials-scene--homepage"
      preset="homepage"
      start="top 88%"
      end="bottom 52%"
    >
      <div className="testimonials-scene__header" data-scene-item>
        <RevealText as="p" className="scene-kicker" mode="chars">
          {testimonials.kicker}
        </RevealText>
        <RevealText as="h2" className="testimonials-scene__title" mode="words">
          {testimonials.heading}
        </RevealText>
      </div>

      <div className="testimonials-scene__grid">
        {testimonials.items.map((item) => (
          <article key={`${item.author}-${item.quote}`} className="testimonials-scene__card" data-scene-item data-cursor-label="View">
            <RevealText as="p" className="testimonials-scene__quote" mode="words">
              {item.quote}
            </RevealText>
            <RevealText as="p" className="testimonials-scene__author" mode="chars">
              {item.author}
            </RevealText>
          </article>
        ))}
      </div>
    </ScrollScene>
  );
}
