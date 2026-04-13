import { RevealText } from "@/components/motion/reveal-text";
import { TypingText } from "@/components/motion/typing-text";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
  imageSrc: string;
};

export function PageHero({ eyebrow, title, body, imageSrc }: PageHeroProps) {
  return (
    <section className="generic-hero">
      <div className="generic-hero__backdrop" style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className="generic-hero__veil" />
      <div className="generic-hero__content">
        <div data-scene-item className="hero-scene__eyebrow">
          <TypingText text={eyebrow} />
        </div>
        <RevealText as="h1" className="generic-hero__title" mode="chars">
          {title}
        </RevealText>
        <RevealText as="p" className="generic-hero__body" mode="words">
          {body}
        </RevealText>
      </div>
    </section>
  );
}
