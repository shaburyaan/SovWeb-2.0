import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { PageHero } from "@/components/pages/page-hero";
import { getContactSections } from "@/lib/content/page-scenes";
import type { GenericPageData } from "@/lib/content/page";

export function ContactPageExperience({ data }: { data: GenericPageData }) {
  const contact = getContactSections(data);

  return (
    <div className="experience-shell">
      <SiteHeader nav={data.nav} />
      <main className="generic-page">
        <PageHero
          eyebrow="Contact"
          title={data.title}
          body={data.description}
          imageSrc={data.heroImage}
        />
        <ScrollScene className="contact-scene">
          <div className="contact-scene__grid">
            <div className="contact-scene__copy">
              <RevealText as="p" className="scene-kicker" mode="chars">
                Contact
              </RevealText>
              <RevealText as="h2" className="contact-scene__title" mode="words">
                Reach Sovrano through direct contact scenes
              </RevealText>
              {contact.narratives.map((item) => (
                <article key={`${item.heading}-${item.body.slice(0, 30)}`} className="contact-scene__card" data-scene-item>
                  <RevealText as="h3" className="contact-scene__card-title" mode="words">
                    {item.heading}
                  </RevealText>
                  <RevealText as="p" className="contact-scene__card-body" mode="words">
                    {item.body}
                  </RevealText>
                </article>
              ))}
            </div>
            <div className="contact-scene__embeds">
              {contact.embeds.map((html, index) => (
                <div
                  key={`embed-${index}`}
                  className="contact-scene__embed"
                  data-scene-item
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ))}
            </div>
          </div>
        </ScrollScene>
      </main>
      <SiteFooter footer={data.footer} nav={data.nav} />
    </div>
  );
}
