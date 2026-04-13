import pagesRaw from "../../../reports/pages.json";
import navEnRaw from "../../../reports/nav-shell.json";
import navHyRaw from "../../../reports/nav-shell-hy.json";
import navRuRaw from "../../../reports/nav-shell-ru.json";

import type { LegacyNavLink, LegacyPage } from "./types";

export const pages = pagesRaw as unknown as Record<string, LegacyPage>;

const navByLocale = {
  "/": navEnRaw.links,
  "/hy": navHyRaw.links,
  "/ru": navRuRaw.links,
} satisfies Record<string, LegacyNavLink[]>;

export function getLegacyPage(route: string) {
  return pages[route];
}

export function getNavForLocale(localeBase: "/" | "/hy" | "/ru") {
  return navByLocale[localeBase];
}
