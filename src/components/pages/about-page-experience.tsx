import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatsScene } from "@/components/home/stats-scene";
import { ActionStrip, GalleryScene, NarrativeScene } from "@/components/pages/page-sections";
import { PageHero } from "@/components/pages/page-hero";
import { getAboutSections } from "@/lib/content/page-scenes";
import type { GenericPageData } from "@/lib/content/page";

export function AboutPageExperience({ data }: { data: GenericPageData }) {
  const about = getAboutSections(data);

  return (
    <div className="experience-shell">
      <SiteHeader nav={data.nav} />
      <main className="generic-page">
        <PageHero
          eyebrow="About Sovrano"
          title={data.title}
          body={data.description}
          imageSrc={data.heroImage}
        />
        <NarrativeScene kicker="Story" title="History and evolution" items={about.intro} />
        {about.stats.length ? <StatsScene stats={about.stats} /> : null}
        <NarrativeScene kicker="Advantages" title="Why Sovrano leads distribution" items={about.advantages} />
        <GalleryScene kicker="Media" title="Team and company atmosphere" gallery={about.gallery} />
        <ActionStrip kicker="Career" title="Join the Sovrano team" actions={about.cta ? [about.cta] : []} />
      </main>
      <SiteFooter footer={data.footer} nav={data.nav} />
    </div>
  );
}
