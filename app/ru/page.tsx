import type { Metadata } from "next";

import { HomepageExperience } from "@/components/home/homepage-experience";
import { getHomepageData } from "@/lib/content/home";

export function generateMetadata(): Metadata {
  const data = getHomepageData("/ru");

  return {
    title: data.meta.title ?? data.hero.title,
    description: data.meta.description ?? data.hero.body,
    alternates: {
      canonical: data.meta.canonical ?? undefined,
    },
  };
}

export default function RussianHomePage() {
  const data = getHomepageData("/ru");

  return <HomepageExperience data={data} />;
}
