import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { PageHero } from "@/components/pages/page-hero";
import { getDistributionCards } from "@/lib/content/page-scenes";
import type { GenericPageData } from "@/lib/content/page";

export function DistributionPageExperience({ data }: { data: GenericPageData }) {
  const cards = getDistributionCards(data);

  return (
    <div className="experience-shell">
      <SiteHeader nav={data.nav} />
      <main className="generic-page">
        <PageHero
          eyebrow="Distribution"
          title={data.title}
          body={data.description}
          imageSrc={data.heroImage}
        />
        <ScrollScene className="distribution-scene">
          <div className="distribution-scene__header" data-scene-item>
            <RevealText as="p" className="scene-kicker" mode="chars">
              Operations
            </RevealText>
            <RevealText as="h2" className="distribution-scene__title" mode="words">
              End-to-end nationwide distribution scenes
            </RevealText>
          </div>
          <div className="distribution-scene__stack">
            {cards.map((card, index) => (
              <article key={`${card.title}-${index}`} className="distribution-scene__card" data-scene-item>
                <div className="distribution-scene__copy">
                  <RevealText as="p" className="distribution-scene__index" mode="chars">
                    {`0${index + 1}`}
                  </RevealText>
                  <RevealText as="h3" className="distribution-scene__card-title" mode="words">
                    {card.title}
                  </RevealText>
                  <RevealText as="p" className="distribution-scene__card-body" mode="words">
                    {card.body}
                  </RevealText>
                </div>
                <ParallaxMedia
                  src={card.imageSrc}
                  alt={card.title}
                  className="distribution-scene__media"
                  fit="contain"
                  parallax={false}
                  sizes="(max-width: 1100px) 100vw, 46vw"
                />
              </article>
            ))}
          </div>
        </ScrollScene>
      </main>
      <SiteFooter footer={data.footer} nav={data.nav} />
    </div>
  );
}
