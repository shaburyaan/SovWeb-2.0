import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeAssetSrc(src: string) {
  if (!src) {
    return "";
  }

  return src
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/\/index\.html$/i, "")
    .replace(/index\.html$/i, "")
    .replace(/\/+/g, "/")
    .trim();
}

export function normalizeRoute(href: string, fromRoute = "/") {
  if (!href) {
    return "/";
  }

  try {
    const basePath = fromRoute.endsWith("/") ? fromRoute : `${fromRoute}/`;
    const resolved = new URL(href, `https://sovrano.local${basePath}`);
    const cleaned = resolved.pathname
      .replace(/\/index\.html$/i, "/")
      .replace(/index\.html$/i, "")
      .replace(/\/+/g, "/");

    if (cleaned === "" || cleaned === "/") {
      return "/";
    }

    return cleaned.startsWith("/") ? cleaned.replace(/\/$/, "") || "/" : `/${cleaned.replace(/\/$/, "")}`;
  } catch {
    const cleaned = href
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/\/index\.html$/i, "/")
      .replace(/index\.html$/i, "")
      .replace(/\/+/g, "/");

    if (cleaned === "" || cleaned === "/") {
      return "/";
    }

    return cleaned.startsWith("/") ? cleaned.replace(/\/$/, "") || "/" : `/${cleaned.replace(/\/$/, "")}`;
  }
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
