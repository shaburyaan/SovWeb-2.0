import Image from "next/image";

import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import type { HomepageData } from "@/lib/content/types";
import { normalizeAssetSrc } from "@/lib/utils";

type PartnersSceneProps = {
  partners: HomepageData["partners"];
};

export function PartnersScene({ partners }: PartnersSceneProps) {
  return (
    <ScrollScene
      className="partners-scene partners-scene--homepage"
      preset="homepage"
      variant="scrub"
      start="top 92%"
      end="+=560"
      scrub={0.4}
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
                src={normalizeAssetSrc(logo.src)}
                alt={logo.alt}
                width={220}
                height={100}
                sizes="(max-width: 800px) 50vw, (max-width: 1100px) 33vw, 16vw"
              />
          </div>
        ))}
      </div>
    </ScrollScene>
  );
}
