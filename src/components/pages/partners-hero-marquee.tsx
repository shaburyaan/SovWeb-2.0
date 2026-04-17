import Image from "next/image";

import { RevealText } from "@/components/motion/reveal-text";
import { TypingText } from "@/components/motion/typing-text";
import type { PartnerLogo } from "@/lib/content/page-scenes";

type PartnersHeroMarqueeProps = {
  eyebrow: string;
  title: string;
  body: string;
  logos: PartnerLogo[];
};

function rotateLogos(logos: PartnerLogo[], offset: number) {
  if (!logos.length) {
    return logos;
  }

  const normalizedOffset = offset % logos.length;
  return [...logos.slice(normalizedOffset), ...logos.slice(0, normalizedOffset)];
}

function LogoTrack({
  logos,
  rowClassName,
}: {
  logos: PartnerLogo[];
  rowClassName: string;
}) {
  return (
    <div className={`partnersAnimation__row ${rowClassName}`}>
      <div className="partnersAnimation__track">
        <div className="partnersAnimation__group">
          {logos.map((logo) => (
            <div key={`${rowClassName}-${logo.src}`} className="partnersAnimation__logo">
              <Image src={logo.src} alt={logo.alt} width={220} height={88} sizes="(max-width: 800px) 28vw, 14rem" />
            </div>
          ))}
        </div>
        <div className="partnersAnimation__group" aria-hidden="true">
          {logos.map((logo) => (
            <div key={`${rowClassName}-duplicate-${logo.src}`} className="partnersAnimation__logo">
              <Image src={logo.src} alt="" width={220} height={88} sizes="(max-width: 800px) 28vw, 14rem" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PartnersHeroMarquee({
  eyebrow,
  title,
  body,
  logos,
}: PartnersHeroMarqueeProps) {
  const safeLogos = logos.length
    ? logos
    : [
        {
          src: "/optimized-media/homepage/Sovrano Main Logo 1.webp",
          alt: "Sovrano",
        },
      ];

  const rows = [
    rotateLogos(safeLogos, 0),
    rotateLogos(safeLogos, Math.max(1, Math.floor(safeLogos.length / 3))),
    rotateLogos(safeLogos, Math.max(1, Math.floor((safeLogos.length * 2) / 3))),
  ];

  return (
    <section className="generic-hero partners-hero">
      <div className="partnersAnimation" aria-hidden="true">
        <LogoTrack logos={rows[0]} rowClassName="partnersAnimation__row--right partnersAnimation__row--top" />
        <LogoTrack logos={rows[1]} rowClassName="partnersAnimation__row--left partnersAnimation__row--middle" />
        <LogoTrack logos={rows[2]} rowClassName="partnersAnimation__row--right partnersAnimation__row--bottom" />
      </div>
      <div className="partners-hero__veil" />
      <div className="generic-hero__content partners-hero__content">
        <div className="hero-scene__eyebrow">
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
