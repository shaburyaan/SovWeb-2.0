"use client";

import { useMemo, useState } from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { TypingText } from "@/components/motion/typing-text";
import { TransitionLink } from "@/components/navigation/transition-link";
import type { PartnersPageModel } from "@/lib/content/page-scenes";

type PartnersTabsExperienceProps = {
  title: string;
  localeBase: "/" | "/hy" | "/ru";
  model: PartnersPageModel;
};

export function PartnersTabsExperience({
  title,
  localeBase,
  model,
}: PartnersTabsExperienceProps) {
  const [activeTab, setActiveTab] = useState(model.filters[0]?.slug ?? "all");

  const activeCategory = useMemo(
    () => model.categories.find((category) => category.slug === activeTab) ?? null,
    [activeTab, model.categories],
  );
  const visibleCards = activeTab === "all" ? model.allCards : activeCategory?.cards ?? [];
  const activeLabel = model.filters.find((filter) => filter.slug === activeTab)?.label ?? title;
  const activeBody = activeTab === "all" ? model.lead : visibleCards[0]?.body ?? model.lead;

  return (
    <>
      <ScrollScene
        className="partners-page-scene partners-page-scene--overview"
        start="top 84%"
        end="bottom 58%"
      >
        <div className="partners-page-scene__header" data-scene-item>
          <RevealText as="p" className="scene-kicker" mode="chars">
            Network
          </RevealText>
          <RevealText as="h2" className="partners-page-scene__title" mode="words">
            {model.lead}
          </RevealText>
        </div>

        <div className="partners-page-scene__tabs" data-scene-item>
          {model.filters.map((filter) => (
            <Magnetic key={filter.slug} as="div">
              <button
                type="button"
                className="partners-page-scene__tab"
                data-active={filter.slug === activeTab}
                data-cursor-label="View"
                onClick={() => setActiveTab(filter.slug)}
              >
                {filter.label}
              </button>
            </Magnetic>
          ))}
        </div>

        <div className="partners-page-scene__active" data-scene-item>
          <TypingText
            text={activeLabel}
            triggerKey={`${localeBase}-${activeTab}`}
            className="partners-page-scene__typing"
            speed={28}
          />
          <RevealText key={`${activeTab}-body`} as="p" className="partners-page-scene__active-body" mode="words">
            {activeBody}
          </RevealText>
          <div className="partners-page-scene__active-tags">
            {visibleCards.slice(0, 4).map((card) => (
              <span key={`${activeTab}-${card.title}`} className="partners-page-scene__tag">
                {card.title}
              </span>
            ))}
          </div>
        </div>
      </ScrollScene>

      <ScrollScene className="partners-page-scene partners-page-scene--grid" start="top 84%" end="bottom 55%">
        <div className="partners-page-scene__meta" data-scene-item>
          <RevealText as="p" className="scene-kicker" mode="chars">
            {activeTab === "all" ? "Full Archive" : "Category Focus"}
          </RevealText>
          <RevealText as="h2" className="partners-page-scene__title" mode="words">
            {activeLabel}
          </RevealText>
        </div>

        <div className="partners-page-scene__grid" id="partners-grid">
          {visibleCards.map((card) => (
            <article key={`${card.title}-${card.href}`} className="partners-page-scene__card" data-scene-item>
              <ParallaxMedia
                src={card.imageSrc}
                alt={card.title}
                className="partners-page-scene__media"
                fit="contain"
                parallax={false}
                sizes="(max-width: 800px) 100vw, (max-width: 1100px) 50vw, 24vw"
              />
              <RevealText as="h3" className="partners-page-scene__card-title" mode="words">
                {card.title}
              </RevealText>
              <RevealText as="p" className="partners-page-scene__card-body" mode="words">
                {card.body}
              </RevealText>
              <TransitionLink href={card.href} className="media-scene__card-link" cursorLabel="View">
                {card.label}
              </TransitionLink>
            </article>
          ))}
        </div>
      </ScrollScene>
    </>
  );
}
