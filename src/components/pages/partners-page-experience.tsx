import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PartnersHeroMarquee } from "@/components/pages/partners-hero-marquee";
import { PartnersTabsExperience } from "@/components/pages/partners-tabs-experience";
import { getPartnersPageModel } from "@/lib/content/page-scenes";
import type { GenericPageData } from "@/lib/content/page";

export function PartnersPageExperience({ data }: { data: GenericPageData }) {
  const model = getPartnersPageModel(data);

  return (
    <div className="experience-shell">
      <SiteHeader nav={data.nav} />
      <main className="generic-page">
        <PartnersHeroMarquee
          eyebrow="Partners"
          title={data.title}
          body={data.description}
          logos={model.logos}
        />
        <PartnersTabsExperience title={data.title} localeBase={data.localeBase} model={model} />
      </main>
      <SiteFooter footer={data.footer} nav={data.nav} />
    </div>
  );
}
