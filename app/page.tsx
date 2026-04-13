import type { Metadata } from "next";

import { HomepageExperience } from "@/components/home/homepage-experience";
import { getHomepageData } from "@/lib/content/home";

export function generateMetadata(): Metadata {
  const data = getHomepageData("/");

  return {
    title: data.meta.title ?? "Sovrano Distributions",
    description: data.meta.description ?? "Sovrano Distributions",
    openGraph: {
      title: data.meta.ogTitle ?? data.meta.title ?? "Sovrano Distributions",
      description: data.meta.ogDescription ?? data.meta.description ?? "Sovrano Distributions",
      url: data.meta.ogUrl ?? data.meta.canonical ?? undefined,
      siteName: "Sovrano Distributions",
      type: "website",
    },
    alternates: {
      canonical: data.meta.canonical ?? undefined,
    },
  };
}

export default function HomePage() {
  const data = getHomepageData("/");

  return <HomepageExperience data={data} />;
}
