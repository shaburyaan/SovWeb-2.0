import type { Metadata } from "next";

import { GenericPage } from "@/components/pages/generic-page";
import { getGenericPageData } from "@/lib/content/page";

export function generateMetadata(): Metadata {
  const data = getGenericPageData("/vacancy/", "/");

  return {
    title: data.meta.title ?? data.title,
    description: data.meta.description ?? data.description,
    alternates: {
      canonical: data.meta.canonical ?? undefined,
    },
  };
}

export default function VacancyPage() {
  const data = getGenericPageData("/vacancy/", "/");

  return <GenericPage data={data} />;
}
