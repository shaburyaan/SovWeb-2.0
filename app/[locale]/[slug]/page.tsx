import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GenericPage } from "@/components/pages/generic-page";
import { getGenericPageData } from "@/lib/content/page";
import { getLegacyPage } from "@/lib/content/store";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function localeBase(locale: string) {
  if (locale === "en") {
    return "/" as const;
  }

  if (locale === "hy") {
    return "/hy" as const;
  }

  if (locale === "ru") {
    return "/ru" as const;
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const base = localeBase(locale);
  const route = base === "/" ? `/${slug}/` : `${base}/${slug}/`;

  if (!base || !getLegacyPage(route)) {
    return {};
  }

  const data = getGenericPageData(route, base);

  return {
    title: data.meta.title ?? data.title,
    description: data.meta.description ?? data.description,
    alternates: {
      canonical: data.meta.canonical ?? undefined,
    },
  };
}

export default async function LocaleContentPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const base = localeBase(locale);
  const route = base === "/" ? `/${slug}/` : `${base}/${slug}/`;

  if (!base || !getLegacyPage(route)) {
    notFound();
  }

  const data = getGenericPageData(route, base);

  return <GenericPage data={data} />;
}
