import { normalizeAssetSrc } from "@/lib/utils";

import type { LegacyBlock } from "./types";

const routeAssetOverrides: Record<string, { primary?: string; accent?: string }> = {
  "/": {
    primary: "/homepage/01.jpg",
    accent: "/homepage/03.JPG",
  },
  "/hy/": {
    primary: "/homepage/01.jpg",
    accent: "/homepage/03.JPG",
  },
  "/ru/": {
    primary: "/homepage/01.jpg",
    accent: "/homepage/03.JPG",
  },
  "/vacancy/": {
    primary: "/homepage/03.JPG",
  },
  "/ru/vacancy/": {
    primary: "/homepage/03.JPG",
  },
  "/sladonezh/": {
    primary: "/wp-content/uploads/2022/09/sladonezh-hero-bg.jpg",
  },
  "/hy/sladonezh/": {
    primary: "/wp-content/uploads/2022/09/sladonezh-hero-bg.jpg",
  },
  "/ru/sladonezh/": {
    primary: "/wp-content/uploads/2022/09/sladonezh-hero-bg.jpg",
  },
};

function extractBackgroundImage(value: string) {
  const backgroundImageMatch = value.match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/i);

  if (backgroundImageMatch?.[2]) {
    return normalizeAssetSrc(backgroundImageMatch[2]);
  }

  const backgroundMatch = value.match(/background:\s*url\((['"]?)([^)'"]+)\1\)/i);

  return normalizeAssetSrc(backgroundMatch?.[2] ?? "");
}

export function getRoutePrimaryAsset(route: string) {
  return routeAssetOverrides[route]?.primary ?? "";
}

export function getRouteAccentAsset(route: string) {
  return routeAssetOverrides[route]?.accent ?? "";
}

export function getBackgroundAssetFromBlocks(blocks: LegacyBlock[]) {
  for (const block of blocks) {
    const fromHtml = extractBackgroundImage(block.html ?? "");

    if (fromHtml) {
      return fromHtml;
    }

    const fromText = extractBackgroundImage(block.textPlain ?? "");

    if (fromText) {
      return fromText;
    }
  }

  return "";
}
