import type { Metadata } from "next";

import { GenericPage } from "@/components/pages/generic-page";
import { getGenericPageData } from "@/lib/content/page";

export function generateMetadata(): Metadata {
  const data = getGenericPageData("/our-partners/", "/");

  return {
    title: data.meta.title ?? data.title,
    description: data.meta.description ?? data.description,
    alternates: {
      canonical: data.meta.canonical ?? undefined,
    },
  };
}

export default function OurPartnersPage() {
  const data = getGenericPageData("/our-partners/", "/");

  return <GenericPage data={data} />;
}
