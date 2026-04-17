import { ParallaxMedia } from "@/components/motion/parallax-media";
import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { TransitionLink } from "@/components/navigation/transition-link";
import type { HomepageData } from "@/lib/content/types";

type MediaSceneProps = {
  media: HomepageData["media"];
};

export function MediaScene({ media }: MediaSceneProps) {
  return (
    <ScrollScene
      className="media-scene media-scene--homepage"
      preset="homepage"
      start="top 92%"
      end="bottom 56%"
    >
      <div className="media-scene__header" data-scene-item>
        <RevealText as="p" className="scene-kicker" mode="chars">
          {media.kicker}
        </RevealText>
        <RevealText as="h2" className="media-scene__title" mode="words">
          {media.heading}
        </RevealText>
      </div>

      <div className="media-scene__grid">
        {media.cards.map((card) => (
          <article key={`${card.title}-${card.imageSrc}`} className="media-scene__card" data-scene-item>
            <ParallaxMedia
              src={card.imageSrc}
              alt={card.title}
              className="media-scene__media"
              fit="contain"
              sizes="(max-width: 800px) 100vw, 30vw"
              parallax={false}
            />
            <RevealText as="h3" className="media-scene__card-title" mode="words">
              {card.title}
            </RevealText>
            <RevealText as="p" className="media-scene__card-body" mode="words">
              {card.body}
            </RevealText>
            <TransitionLink href={card.href} className="media-scene__card-link" cursorLabel="View">
              {card.ctaLabel}
            </TransitionLink>
          </article>
        ))}
      </div>
    </ScrollScene>
  );
}
