import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GenericPage } from "@/components/pages/generic-page";
import { getGenericPageData } from "@/lib/content/page";
import { getLegacyPage, pages } from "@/lib/content/store";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages)
    .filter((route) => route.startsWith("/hy/"))
    .map((route) => route.split("/").filter(Boolean).at(-1) ?? "")
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = `/hy/${slug}/`;

  if (!getLegacyPage(route)) {
    return {};
  }

  const data = getGenericPageData(route, "/hy");

  return {
    title: data.meta.title ?? data.title,
    description: data.meta.description ?? data.description,
    alternates: {
      canonical: data.meta.canonical ?? undefined,
    },
  };
}

export default async function ArmenianContentPage({ params }: PageProps) {
  const { slug } = await params;
  const route = `/hy/${slug}/`;

  if (!getLegacyPage(route)) {
    notFound();
  }

  const data = getGenericPageData(route, "/hy");

  return <GenericPage data={data} />;
}
