import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import type { HomepageData } from "@/lib/content/types";

type HistorySceneProps = {
  history: HomepageData["history"];
};

export function HistoryScene({ history }: HistorySceneProps) {
  return (
    <ScrollScene
      className="history-scene history-scene--homepage"
      preset="homepage"
      start="top 88%"
      end="bottom 52%"
    >
      <div className="history-scene__grid">
        <RevealText as="p" className="scene-kicker" mode="chars">
          {history.kicker}
        </RevealText>
        <RevealText as="h2" className="history-scene__heading" mode="words">
          {history.heading}
        </RevealText>
        <RevealText as="p" className="history-scene__lead" mode="words">
          {history.lead}
        </RevealText>
        <RevealText as="p" className="history-scene__body" mode="words">
          {history.body}
        </RevealText>
      </div>
    </ScrollScene>
  );
}
