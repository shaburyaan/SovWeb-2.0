import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import type { HomepageData } from "@/lib/content/types";

type StatsSceneProps = {
  stats: HomepageData["stats"];
};

export function StatsScene({ stats }: StatsSceneProps) {
  return (
    <ScrollScene
      className="stats-scene stats-scene--homepage"
      preset="homepage"
      start="top 88%"
      end="bottom 52%"
    >
      <div className="stats-scene__grid">
        {stats.map((item) => (
          <article key={`${item.value}-${item.label}`} className="stats-scene__card" data-scene-item data-cursor-label="View">
            <RevealText as="p" className="stats-scene__value" mode="chars">
              {item.value}
            </RevealText>
            <RevealText as="p" className="stats-scene__label" mode="words">
              {item.label}
            </RevealText>
          </article>
        ))}
      </div>
    </ScrollScene>
  );
}
