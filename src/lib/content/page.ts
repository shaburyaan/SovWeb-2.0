import { normalizeAssetSrc, normalizeRoute } from "@/lib/utils";

import { getHomepageData } from "./home";
import { getLegacyPage } from "./store";
import type { LegacyBlock, LegacyPageMeta } from "./types";

type GenericContentItem =
  | { type: "heading"; value: string }
  | { type: "body"; value: string }
  | { type: "image"; src: string; alt: string }
  | { type: "button"; href: string; label: string }
  | { type: "embed"; html: string };

export type GenericPageData = {
  meta: LegacyPageMeta;
  localeBase: "/" | "/hy" | "/ru";
  route: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  items: GenericContentItem[];
  rawBlocks: LegacyBlock[];
  rawImages: Array<{ src: string; alt: string | null }>;
  rawLinks: string[];
  nav: ReturnType<typeof getHomepageData>["nav"];
  footer: ReturnType<typeof getHomepageData>["footer"];
};

function text(block: LegacyBlock | undefined) {
  return block?.textPlain?.replace(/\s+/g, " ").trim() ?? "";
}

function firstImage(html: string) {
  const srcMatch = html.match(/src="([^"]+)"/i);
  const altMatch = html.match(/alt="([^"]*)"/i);

  return {
    src: normalizeAssetSrc(srcMatch?.[1] ?? ""),
    alt: altMatch?.[1] ?? "",
  };
}

export function getGenericPageData(route: string, localeBase: "/" | "/hy" | "/ru"): GenericPageData {
  const page = getLegacyPage(route);

  if (!page) {
    throw new Error(`Missing page content for route "${route}"`);
  }

  const homepageData = getHomepageData(localeBase);

  const items = page.blocks.flatMap<GenericContentItem>((block) => {
    const blockText = text(block);

    if (block.type === "heading" && blockText) {
      return [{ type: "heading", value: blockText }];
    }

    if (block.type === "richText" && blockText) {
      return [{ type: "body", value: blockText }];
    }

    if (block.type === "button" && block.ctaLabel) {
      return [
        {
          type: "button",
          href: normalizeRoute(block.ctaHref ?? "/", route),
          label: block.ctaLabel,
        },
      ];
    }

    if (block.type === "image" || /<img/i.test(block.html)) {
      const image = firstImage(block.html);

      if (image.src) {
        return [{ type: "image", src: image.src, alt: image.alt || blockText || "Sovrano visual" }];
      }
    }

    if (/<iframe|<form|wpcf7|elementor-form/i.test(block.html)) {
      return [{ type: "embed", html: block.html }];
    }

    return [];
  });

  const firstVisual = items.find((item) => item.type === "image");

  return {
    meta: page.meta,
    localeBase,
    route,
    slug: route.split("/").filter(Boolean).at(-1) ?? "page",
    title: page.meta.ogTitle ?? page.meta.title ?? "Sovrano",
    description: page.meta.description ?? "Sovrano Distributions",
    heroImage: firstVisual?.type === "image" ? firstVisual.src : homepageData.hero.backgroundSrc,
    items,
    rawBlocks: page.blocks,
    rawImages: page.images ?? [],
    rawLinks: page.links ?? [],
    nav: homepageData.nav,
    footer: homepageData.footer,
  };
}
