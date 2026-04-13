import { AboutPageExperience } from "@/components/pages/about-page-experience";
import { BrandDetailPageExperience } from "@/components/pages/brand-detail-page-experience";
import { ContactPageExperience } from "@/components/pages/contact-page-experience";
import { DistributionPageExperience } from "@/components/pages/distribution-page-experience";
import { GenericContentPageExperience } from "@/components/pages/generic-content-page-experience";
import { PartnersPageExperience } from "@/components/pages/partners-page-experience";
import { VacancyPageExperience } from "@/components/pages/vacancy-page-experience";
import type { GenericPageData } from "@/lib/content/page";
import { isBrandDetailPage } from "@/lib/content/page-scenes";

type GenericPageProps = {
  data: GenericPageData;
};

export function GenericPage({ data }: GenericPageProps) {
  if (data.slug === "about-us") {
    return <AboutPageExperience data={data} />;
  }

  if (data.slug === "distribution") {
    return <DistributionPageExperience data={data} />;
  }

  if (data.slug === "our-partners") {
    return <PartnersPageExperience data={data} />;
  }

  if (data.slug === "vacancy") {
    return <VacancyPageExperience data={data} />;
  }

  if (data.slug === "contact-us") {
    return <ContactPageExperience data={data} />;
  }

  if (isBrandDetailPage(data)) {
    return <BrandDetailPageExperience data={data} />;
  }

  return <GenericContentPageExperience data={data} />;
}
