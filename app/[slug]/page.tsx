import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GenericPage } from "@/components/pages/generic-page";
import { getGenericPageData } from "@/lib/content/page";
import { getLegacyPage, pages } from "@/lib/content/store";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const EXPLICIT_ROOT_ROUTES = new Set(["about-us", "our-partners", "distribution", "vacancy", "contact-us"]);

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages)
    .filter((route) => route !== "/" && !route.startsWith("/hy/") && !route.startsWith("/ru/"))
    .map((route) => route.split("/").filter(Boolean).at(-1) ?? "")
    .filter((slug) => slug && !EXPLICIT_ROOT_ROUTES.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = `/${slug}/`;

  if (!getLegacyPage(route) || EXPLICIT_ROOT_ROUTES.has(slug)) {
    return {};
  }

  const data = getGenericPageData(route, "/");

  return {
    title: data.meta.title ?? data.title,
    description: data.meta.description ?? data.description,
    alternates: {
      canonical: data.meta.canonical ?? undefined,
    },
  };
}

export default async function EnglishContentPage({ params }: PageProps) {
  const { slug } = await params;
  const route = `/${slug}/`;

  if (!getLegacyPage(route) || EXPLICIT_ROOT_ROUTES.has(slug)) {
    notFound();
  }

  const data = getGenericPageData(route, "/");

  return <GenericPage data={data} />;
}
