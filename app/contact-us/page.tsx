import type { Metadata } from "next";

import { GenericPage } from "@/components/pages/generic-page";
import { getGenericPageData } from "@/lib/content/page";

export function generateMetadata(): Metadata {
  const data = getGenericPageData("/contact-us/", "/");

  return {
    title: data.meta.title ?? data.title,
    description: data.meta.description ?? data.description,
    alternates: {
      canonical: data.meta.canonical ?? undefined,
    },
  };
}

export default function ContactUsPage() {
  const data = getGenericPageData("/contact-us/", "/");

  return <GenericPage data={data} />;
}
