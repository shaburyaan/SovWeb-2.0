import type { CSSProperties } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Magnetic } from "@/components/motion/magnetic";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { TypingText } from "@/components/motion/typing-text";
import { TransitionLink } from "@/components/navigation/transition-link";
import { getBrandDetailModel } from "@/lib/content/page-scenes";
import type { GenericPageData } from "@/lib/content/page";

type BrandDetailPageExperienceProps = {
  data: GenericPageData;
};

export function BrandDetailPageExperience({ data }: BrandDetailPageExperienceProps) {
  const model = getBrandDetailModel(data);
  const backdropStyle = {
    "--brand-detail-hero-image": `url(${model.backdropImage})`,
  } as CSSProperties;

  return (
    <div className="experience-shell">
      <SiteHeader nav={data.nav} />
      <main className="brand-detail-page">
        <section className="brand-detail-hero">
          <div className="brand-detail-hero__backdrop" style={backdropStyle} />
          <div className="brand-detail-hero__veil" />

          <div className="brand-detail-hero__inner">
            <div className="brand-detail-hero__copy">
              <TypingText text={model.title} className="brand-detail-hero__kicker" />
              <RevealText as="h1" className="brand-detail-hero__title" mode="chars">
                {model.title}
              </RevealText>
              {model.subtitle ? (
                <RevealText as="p" className="brand-detail-hero__subtitle" mode="words">
                  {model.subtitle}
                </RevealText>
              ) : null}
              <RevealText as="p" className="brand-detail-hero__body" mode="words">
                {model.body}
              </RevealText>

              {model.backLink ? (
                <div className="brand-detail-hero__actions" data-scene-item>
                  <Magnetic as="span">
                    <TransitionLink
                      href={model.backLink.href}
                      className="brand-detail-hero__button"
                      cursorLabel="Open"
                    >
                      {model.backLink.label}
                    </TransitionLink>
                  </Magnetic>
                </div>
              ) : null}
            </div>

            <div className="brand-detail-hero__visual">
              <ParallaxMedia
                src={model.heroImage}
                alt={model.title}
                className="brand-detail-hero__media"
                fit="contain"
                priority
                sizes="(max-width: 1100px) 100vw, 42vw"
                parallax={false}
              />
              <div className="brand-detail-hero__thumbs">
                {model.overviewGallery.map((item) => (
                  <div key={item.src} className="brand-detail-hero__thumb" data-scene-item>
                    <ParallaxMedia
                      src={item.src}
                      alt={item.alt}
                      className="brand-detail-hero__thumb-media"
                      fit="contain"
                      parallax={false}
                      sizes="(max-width: 800px) 100vw, 18vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ScrollScene className="brand-detail-scene brand-detail-scene--gallery" start="top 86%" end="bottom 58%">
          <div className="brand-detail-scene__header" data-scene-item>
            <RevealText as="p" className="scene-kicker" mode="chars">
              {model.title}
            </RevealText>
            <RevealText as="h2" className="brand-detail-scene__title" mode="words">
              {model.productHeading}
            </RevealText>
          </div>

          <div className="brand-detail-scene__gallery">
            {model.productGallery.map((item) => (
              <article key={item.src} className="brand-detail-scene__card" data-scene-item>
                <ParallaxMedia
                  src={item.src}
                  alt={item.alt}
                  className="brand-detail-scene__media"
                  fit="contain"
                  parallax={false}
                  sizes="(max-width: 800px) 100vw, (max-width: 1100px) 50vw, 22vw"
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
