import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroScene } from "@/components/home/hero-scene";
import { HistoryScene } from "@/components/home/history-scene";
import { MediaScene } from "@/components/home/media-scene";
import { PartnersScene } from "@/components/home/partners-scene";
import { ServicesScene } from "@/components/home/services-scene";
import { StatsScene } from "@/components/home/stats-scene";
import { TestimonialsScene } from "@/components/home/testimonials-scene";
import type { HomepageData } from "@/lib/content/types";

type HomepageExperienceProps = {
  data: HomepageData;
};

export function HomepageExperience({ data }: HomepageExperienceProps) {
  return (
    <div className="experience-shell">
      <SiteHeader nav={data.nav} />
      <main className="homepage-main">
        <HeroScene hero={data.hero} />
        <HistoryScene history={data.history} />
        <StatsScene stats={data.stats} />
        <MediaScene media={data.media} />
        <TestimonialsScene testimonials={data.testimonials} />
        <PartnersScene partners={data.partners} />
        <ServicesScene services={data.services} />
      </main>
      <SiteFooter footer={data.footer} nav={data.nav} />
    </div>
  );
}
