import { SiteFooter } from "@/components/layout/site-footer";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { TransitionLink } from "@/components/navigation/transition-link";
import { PageHero } from "@/components/pages/page-hero";
import { SiteHeader } from "@/components/layout/site-header";
import type { GenericPageData } from "@/lib/content/page";

export function GenericContentPageExperience({ data }: { data: GenericPageData }) {
  return (
    <div className="experience-shell">
      <SiteHeader nav={data.nav} />
      <main className="generic-page">
        <PageHero
          eyebrow={data.localeBase === "/" ? "Page" : data.localeBase.replace("/", "").toUpperCase()}
          title={data.title}
          body={data.description}
          imageSrc={data.heroImage}
        />

        <ScrollScene className="generic-content">
          <div className="generic-content__stack">
            {data.items.map((item, index) => {
              if (item.type === "heading") {
                return (
                  <RevealText key={`${item.type}-${index}`} as="h2" className="generic-content__heading" mode="words">
                    {item.value}
                  </RevealText>
                );
              }

              if (item.type === "body") {
                return (
                  <RevealText key={`${item.type}-${index}`} as="p" className="generic-content__body" mode="words">
                    {item.value}
                  </RevealText>
                );
              }

              if (item.type === "image") {
                return (
                  <ParallaxMedia
                    key={`${item.type}-${item.src}-${index}`}
                    src={item.src}
                    alt={item.alt}
                    className="generic-content__media"
                  />
                );
              }

              if (item.type === "embed") {
                return (
                  <div
                    key={`${item.type}-${index}`}
                    className="contact-scene__embed"
                    data-scene-item
                    dangerouslySetInnerHTML={{ __html: item.html }}
                  />
                );
              }

              return (
                <TransitionLink
                  key={`${item.type}-${item.href}-${index}`}
                  href={item.href}
                  className="generic-content__button"
                >
                  {item.label}
                </TransitionLink>
              );
            })}
          </div>
        </ScrollScene>
      </main>
      <SiteFooter footer={data.footer} nav={data.nav} />
    </div>
  );
}
