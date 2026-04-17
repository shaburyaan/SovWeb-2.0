import Image from "next/image";

import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import type { HomepageData } from "@/lib/content/types";
import { getOptimizedAssetSrc } from "@/lib/optimized-media";

type PartnersSceneProps = {
  partners: HomepageData["partners"];
};

export function PartnersScene({ partners }: PartnersSceneProps) {
  return (
    <ScrollScene
      className="partners-scene partners-scene--homepage"
      preset="homepage"
      start="top 92%"
      end="bottom 56%"
    >
      <div className="partners-scene__header" data-scene-item>
        <RevealText as="p" className="scene-kicker" mode="chars">
          {partners.kicker}
        </RevealText>
        <RevealText as="h2" className="partners-scene__title" mode="words">
          {partners.heading}
        </RevealText>
      </div>

      <div className="partners-scene__rail" data-scene-item>
        {partners.logos.map((logo) => (
          <div key={`${logo.src}-${logo.alt}`} className="partners-scene__logo" data-cursor-label="View">
              <Image
                src={getOptimizedAssetSrc(logo.src)}
                alt={logo.alt}
                width={320}
                height={160}
                sizes="(max-width: 800px) 50vw, (max-width: 1100px) 33vw, 18vw"
              />
          </div>
        ))}
      </div>
    </ScrollScene>
  );
}
