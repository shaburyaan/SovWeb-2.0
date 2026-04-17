import { Magnetic } from "@/components/motion/magnetic";
import { RevealText } from "@/components/motion/reveal-text";
import { TypingText } from "@/components/motion/typing-text";
import { TransitionLink } from "@/components/navigation/transition-link";
import type { HomepageData } from "@/lib/content/types";

type HeroSceneProps = {
  hero: HomepageData["hero"];
};

export function HeroScene({ hero }: HeroSceneProps) {
  return (
    <section className="hero-scene hero-scene--home">
      <div
        className="hero-scene__backdrop"
        style={{ backgroundImage: `url(${hero.backgroundSrc})` }}
      />
      {hero.accentSrc ? (
        <div
          className="hero-scene__backdrop hero-scene__backdrop--accent"
          style={{ backgroundImage: `url(${hero.accentSrc})` }}
        />
      ) : null}
      <div className="hero-scene__veil" />

      <div className="hero-scene__content">
        <div data-scene-item className="hero-scene__eyebrow">
          <TypingText text={hero.eyebrow} />
        </div>

        <RevealText as="h1" className="hero-scene__title" mode="chars">
          {hero.title}
        </RevealText>

        <RevealText as="p" className="hero-scene__body" mode="words">
          {hero.body}
        </RevealText>

        <div data-scene-item className="hero-scene__actions">
          <Magnetic as="span" strength={0.14}>
            <TransitionLink
              href={hero.ctaHref}
              className="hero-scene__button"
              cursorLabel="Open"
            >
              <span>{hero.ctaLabel}</span>
              <span aria-hidden="true">+</span>
            </TransitionLink>
          </Magnetic>
        </div>
      </div>

      <div className="hero-scene__indicator" data-scene-item>
        <span className="hero-scene__indicator-line" />
        <span className="hero-scene__indicator-text">Scroll</span>
      </div>
    </section>
  );
}
