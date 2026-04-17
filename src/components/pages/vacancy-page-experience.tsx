import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ActionStrip, NarrativeScene } from "@/components/pages/page-sections";
import { PageHero } from "@/components/pages/page-hero";
import { getRoutePrimaryAsset } from "@/lib/content/legacy-asset-overrides";
import { getVacancySections } from "@/lib/content/page-scenes";
import type { GenericPageData } from "@/lib/content/page";
import { getOptimizedAssetSrc } from "@/lib/optimized-media";

export function VacancyPageExperience({ data }: { data: GenericPageData }) {
  const vacancy = getVacancySections(data);

  return (
    <div className="experience-shell">
      <SiteHeader nav={data.nav} />
      <main className="generic-page">
        <PageHero
          eyebrow="Vacancy"
          title={vacancy.jobTitle}
          body={data.description}
          imageSrc={getOptimizedAssetSrc(getRoutePrimaryAsset(data.route) || data.heroImage)}
        />
        <NarrativeScene kicker="Position" title="Open role narrative" items={vacancy.sections.slice(0, 2)} />
        <NarrativeScene kicker="Details" title="Responsibilities and qualifications" items={vacancy.sections.slice(2)} />
        <ActionStrip kicker="Apply" title="Ready to take the first step?" actions={vacancy.actions} />
      </main>
      <SiteFooter footer={data.footer} nav={data.nav} />
    </div>
  );
}
