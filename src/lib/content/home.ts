import { normalizeAssetSrc, normalizeRoute } from "@/lib/utils";

import { getRouteAccentAsset, getRoutePrimaryAsset } from "./legacy-asset-overrides";
import { getLegacyPage, getNavForLocale } from "./store";
import type {
  HomepageData,
  HomepageMediaCard,
  HomepageService,
  HomepageStat,
  HomepageTestimonial,
  LegacyBlock,
} from "./types";

const localeContent = {
  "/": {
    locale: "English",
    heroTitle: "Largest Distributor in Armenia",
    historyKicker: "History",
    mediaKicker: "Media",
    mediaHeading: "Our Firm In The Media",
    testimonialsKicker: "Reviews",
    testimonialsHeading: "Reviews From Our Clients",
    partnersKicker: "Partners",
    partnersHeading: "Our Partners",
    servicesKicker: "Services",
    servicesHeading: "OFFERED SERVICES",
    footerEyebrow: "Contacts",
    footerHeading: "Sovrano",
  },
  "/hy": {
    locale: "Armenian",
    heroTitle: "Խոշորագույն դիստրիբյուտորը Հայաստանում",
    historyKicker: "Պատմություն",
    mediaKicker: "Մեդիա",
    mediaHeading: "Մեր մասին լրատվամիջոցներում",
    testimonialsKicker: "Կարծիքներ",
    testimonialsHeading: "Կարծիքներ մեր հաճախորդներից",
    partnersKicker: "Գործընկերներ",
    partnersHeading: "Գործընկերներ",
    servicesKicker: "Ծառայություններ",
    servicesHeading: "Մեր առաջարկած ծառայությունները",
    footerEyebrow: "Կոնտակտներ",
    footerHeading: "Sovrano",
  },
  "/ru": {
    locale: "Russian",
    heroTitle: "Крупнейший дистрибьютор в Армении",
    historyKicker: "История",
    mediaKicker: "Медиа",
    mediaHeading: "О нас в СМИ",
    testimonialsKicker: "Отзывы",
    testimonialsHeading: "Отзывы наших клиентов",
    partnersKicker: "Партнеры",
    partnersHeading: "Наши партнеры",
    servicesKicker: "Услуги",
    servicesHeading: "ПРЕДЛАГАЕМЫЕ УСЛУГИ",
    footerEyebrow: "Контакты",
    footerHeading: "Sovrano",
  },
} satisfies Record<
  "/" | "/hy" | "/ru",
  {
    locale: string;
    heroTitle: string;
    historyKicker: string;
    mediaKicker: string;
    mediaHeading: string;
    testimonialsKicker: string;
    testimonialsHeading: string;
    partnersKicker: string;
    partnersHeading: string;
    servicesKicker: string;
    servicesHeading: string;
    footerEyebrow: string;
    footerHeading: string;
  }
>;

function getText(block: LegacyBlock | undefined) {
  return block?.textPlain?.replace(/\s+/g, " ").trim() ?? "";
}

function getFirstImageSrc(html: string) {
  const srcMatch = html.match(/src="([^"]+)"/i);
  return normalizeAssetSrc(srcMatch?.[1] ?? "");
}

function getRenderableMediaSrc(html: string, fallbackSrc: string) {
  const src = getFirstImageSrc(html);

  if (!src) {
    return fallbackSrc;
  }

  if (/\/media-0\d-free-img\.jpg$/i.test(src)) {
    return fallbackSrc;
  }

  return src;
}

function getIconClass(html: string) {
  const classMatch = html.match(/class="([^"]*fa-[^"]+)"/i);
  return classMatch?.[1] ?? "fas fa-arrow-right";
}

function extractImages(html: string) {
  const images = [...html.matchAll(/src="([^"]+)"[^>]*alt="([^"]*)"/gi)];
  return images.map((match) => ({
    src: normalizeAssetSrc(match[1]),
    alt: match[2] || "Partner logo",
  }));
}

function isVideoBlock(block: LegacyBlock | undefined) {
  return /elementor-custom-embed-image-overlay/i.test(block?.html ?? "");
}

function isTestimonialBlock(block: LegacyBlock | undefined) {
  return /elementor-testimonial-wrapper/i.test(block?.html ?? "");
}

function isPartnersCarousel(block: LegacyBlock | undefined) {
  return /elementor-image-carousel/i.test(block?.html ?? "");
}

function isServiceIcon(block: LegacyBlock | undefined) {
  return /elementor-icon-wrapper/i.test(block?.html ?? "");
}

function firstSentence(value: string) {
  const cleaned = value.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return "";
  }

  const sentinel = cleaned.search(/\b(Facebook|Youtube|Instagram|Contacts|Navigation|Partners)\b/i);
  const section = sentinel >= 0 ? cleaned.slice(0, sentinel).trim() : cleaned;
  const sentenceMatch = section.match(/.+?[.!?](?:\s|$)/);

  return (sentenceMatch?.[0] ?? section).trim();
}

function extractHeroBody(blocks: LegacyBlock[], heroTitle: string, fallback: string) {
  const heroIndex = blocks.findIndex((block) => getText(block) === heroTitle);

  if (heroIndex >= 0) {
    for (let index = heroIndex + 1; index < blocks.length; index += 1) {
      const block = blocks[index];
      const text = getText(block);

      if (block?.type === "richText" && text) {
        return text;
      }
    }
  }

  return fallback;
}

function extractStats(blocks: LegacyBlock[]): HomepageStat[] {
  const stats: HomepageStat[] = [];
  const firstButtonIndex = blocks.findIndex((block) => block.type === "button");

  for (let index = firstButtonIndex + 1; index < blocks.length - 1; index += 1) {
    const value = getText(blocks[index]);
    const label = getText(blocks[index + 1]);

    if (/^\d+\+?$/.test(value) && label) {
      stats.push({ value, label });
      index += 1;
    } else if (stats.length) {
      break;
    }
  }

  return stats;
}

function extractMediaCards(blocks: LegacyBlock[], route: string): HomepageMediaCard[] {
  const startIndex = blocks.findIndex((block) => isVideoBlock(block));
  const fallbackSrc = getFirstImageSrc(blocks[0]?.html ?? "");

  if (startIndex < 0) {
    return [];
  }

  const cards: HomepageMediaCard[] = [];

  for (let index = startIndex; index < blocks.length; index += 4) {
    if (!isVideoBlock(blocks[index])) {
      break;
    }

    const title = getText(blocks[index + 1]);
    const body = getText(blocks[index + 2]);
    const buttonBlock = blocks[index + 3];

    if (!title || !body || buttonBlock?.type !== "button") {
      break;
    }

    cards.push({
      imageSrc: getRenderableMediaSrc(blocks[index]?.html ?? "", fallbackSrc),
      title,
      body,
      href: normalizeRoute(buttonBlock.ctaHref ?? "#", route),
      ctaLabel: buttonBlock.ctaLabel ?? getText(buttonBlock) ?? "Read more",
    });
  }

  return cards;
}

function extractTestimonials(blocks: LegacyBlock[]): HomepageTestimonial[] {
  const startIndex = blocks.findIndex((block) => isTestimonialBlock(block));

  if (startIndex < 0) {
    return [];
  }

  const items: HomepageTestimonial[] = [];

  for (let index = startIndex; index < blocks.length; index += 2) {
    if (!isTestimonialBlock(blocks[index])) {
      break;
    }

    const quote = getText(blocks[index]);
    const author = getText(blocks[index + 1]);

    if (!quote || !author) {
      break;
    }

    items.push({ quote, author });
  }

  return items;
}

function extractServices(blocks: LegacyBlock[], routeLabels: (typeof localeContent)["/"]): HomepageService[] {
  let headingIndex = blocks.findIndex((block) => getText(block) === routeLabels.servicesHeading);

  if (headingIndex < 0) {
    headingIndex = blocks.findIndex(
      (block, index) => block.type === "heading" && isServiceIcon(blocks[index + 1]) && isServiceIcon(blocks[index + 5]),
    );
  }

  if (headingIndex < 0) {
    return [];
  }

  const items: HomepageService[] = [];

  for (let index = headingIndex + 1; index < blocks.length; index += 4) {
    const iconBlock = blocks[index];

    if (!isServiceIcon(iconBlock)) {
      if (items.length) {
        break;
      }

      continue;
    }

    const title = getText(blocks[index + 1]);
    const body = getText(blocks[index + 3]) || getText(blocks[index + 2]);

    if (!title || !body) {
      break;
    }

    items.push({
      icon: getIconClass(iconBlock?.html ?? ""),
      title,
      body,
    });
  }

  return items;
}

export function getHomepageData(localeBase: "/" | "/hy" | "/ru" = "/"): HomepageData {
  const page = getLegacyPage(localeBase === "/" ? "/" : `${localeBase}/`);

  if (!page) {
    throw new Error(`Homepage content missing for locale "${localeBase}"`);
  }

  const localeLabels = localeContent[localeBase];
  const blocks = page.blocks;
  const heroTitle = page.heroTagline?.trim() || localeLabels.heroTitle;
  const heroBackgroundSrc = getRoutePrimaryAsset(page.route) || getFirstImageSrc(blocks[0]?.html ?? "");
  const heroAccentSrc = getRouteAccentAsset(page.route) || null;
  const heroBody = extractHeroBody(blocks, heroTitle, page.meta.description ?? "Sovrano Distributions");
  const stats = extractStats(blocks);
  const mediaCards = extractMediaCards(blocks, page.route);
  const testimonials = extractTestimonials(blocks);
  const partnersIndex = blocks.findIndex((block) => isPartnersCarousel(block));
  const services = extractServices(blocks, localeLabels);
  const footerBody = firstSentence(page.chrome?.textPlainFooter ?? "") || heroBody;
  const historyHeading = getText(blocks[1]);
  const historyLead = getText(blocks[3]);
  const historyBody = getText(blocks[4]);

  return {
    meta: page.meta,
    locale: localeLabels.locale,
    nav: getNavForLocale(localeBase).map((link) => ({
      ...link,
      href: normalizeRoute(link.href, page.route),
    })),
    hero: {
      eyebrow: "Sovrano Distributions",
      title: heroTitle,
      body: heroBody,
      backgroundSrc: heroBackgroundSrc,
      accentSrc: heroAccentSrc,
      ctaHref: normalizeRoute(blocks[5]?.ctaHref ?? "/about-us", page.route),
      ctaLabel: blocks[5]?.ctaLabel ?? "Read More",
    },
    history: {
      kicker: localeLabels.historyKicker,
      heading: historyHeading,
      lead: historyLead,
      body: historyBody,
    },
    stats,
    media: {
      kicker: localeLabels.mediaKicker,
      heading: localeLabels.mediaHeading,
      cards: mediaCards,
    },
    testimonials: {
      kicker: localeLabels.testimonialsKicker,
      heading: localeLabels.testimonialsHeading,
      items: testimonials,
    },
    partners: {
      kicker: localeLabels.partnersKicker,
      heading: localeLabels.partnersHeading,
      logos: partnersIndex >= 0 ? extractImages(blocks[partnersIndex]?.html ?? "") : [],
    },
    services: {
      kicker: localeLabels.servicesKicker,
      heading: getText(blocks.find((block) => getText(block) === localeLabels.servicesHeading)) || localeLabels.servicesHeading,
      items: services,
    },
    footer: {
      eyebrow: localeLabels.footerEyebrow,
      heading: localeLabels.footerHeading,
      body: footerBody,
    },
  };
}
