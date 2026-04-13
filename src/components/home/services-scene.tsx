import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import type { HomepageData } from "@/lib/content/types";

type ServicesSceneProps = {
  services: HomepageData["services"];
};

export function ServicesScene({ services }: ServicesSceneProps) {
  return (
    <ScrollScene
      className="services-scene services-scene--homepage"
      preset="homepage"
      start="top 88%"
      end="bottom 52%"
    >
      <div className="services-scene__header" data-scene-item>
        <RevealText as="p" className="scene-kicker" mode="chars">
          {services.kicker}
        </RevealText>
        <RevealText as="h2" className="services-scene__title" mode="words">
          {services.heading}
        </RevealText>
      </div>

      <div className="services-scene__grid">
        {services.items.map((item) => (
          <article key={item.title} className="services-scene__card" data-scene-item data-cursor-label="View">
            <div className="services-scene__icon" aria-hidden="true">
              <span>{item.icon.replace(/^.*fa-/, "")}</span>
            </div>
            <RevealText as="h3" className="services-scene__card-title" mode="words">
              {item.title}
            </RevealText>
            <RevealText as="p" className="services-scene__card-body" mode="words">
              {item.body}
            </RevealText>
          </article>
        ))}
      </div>
    </ScrollScene>
  );
}
