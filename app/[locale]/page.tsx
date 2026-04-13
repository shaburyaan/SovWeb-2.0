import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomepageExperience } from "@/components/home/homepage-experience";
import { getHomepageData } from "@/lib/content/home";

type PageProps = {
  params: Promise<{ locale: string }>;
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
  const { locale } = await params;
  const base = localeBase(locale);

  if (!base) {
    return {};
  }

  const data = getHomepageData(base);

  return {
    title: data.meta.title ?? data.hero.title,
    description: data.meta.description ?? data.hero.body,
    alternates: {
      canonical: data.meta.canonical ?? undefined,
    },
  };
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { locale } = await params;
  const base = localeBase(locale);

  if (!base) {
    notFound();
  }

  const data = getHomepageData(base);

  return <HomepageExperience data={data} />;
}
