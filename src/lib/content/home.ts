import { normalizeAssetSrc, normalizeRoute } from "@/lib/utils";
import { getOptimizedAssetSrc } from "@/lib/optimized-media";

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

const homepageFallbacks = {
  "/": {
    media: [
      {
        imageSrc: "/homepage/01.jpg",
        title: "Brand portfolio with precise market positioning",
        body:
          "Sovrano curates every category with a clear commercial strategy, turning international brands into visible, scalable retail stories across Armenia.",
      },
      {
        imageSrc: "/homepage/02.jpg",
        title: "Retail execution that protects visibility",
        body:
          "Merchandising standards, disciplined shelf presence, and field coordination help every product arrive with the presentation quality expected from a premium distributor.",
      },
      {
        imageSrc: "/homepage/03.JPG",
        title: "Logistics built for consistent nationwide coverage",
        body:
          "Warehouse capacity, route planning, and regional reach allow Sovrano to move from brand promise to on-shelf availability with speed and reliability.",
      },
    ],
    testimonials: [
      {
        quote: "Sovrano combines strong execution, premium positioning, and a team that understands how to build trust with both partners and customers.",
        author: "Anna Mkrtchyan",
      },
      {
        quote: "The portfolio is presented with care, the communication is clear, and the level of operational discipline is felt at every stage.",
        author: "David Harutyunyan",
      },
      {
        quote: "From assortment strategy to delivery consistency, the company creates the kind of experience that makes brands feel confidently represented.",
        author: "Mariam Sargsyan",
      },
    ],
  },
  "/hy": {
    media: [
      {
        imageSrc: "/homepage/01.jpg",
        title: "Բրենդային պորտֆել հստակ շուկայական դիրքավորմամբ",
        body:
          "Սովրանոն յուրաքանչյուր կատեգորիա ներկայացնում է հստակ կոմերցիոն տրամաբանությամբ՝ միջազգային բրենդերը վերածելով տեսանելի և աճող retail պատմությունների Հայաստանում։",
      },
      {
        imageSrc: "/homepage/02.jpg",
        title: "Retail ներկայացվածություն, որը պահպանում է տեսանելիությունը",
        body:
          "Մերչենդայզինգի չափանիշները, ճիշտ դասավորությունն ու դաշտային վերահսկողությունը օգնում են, որ յուրաքանչյուր ապրանք ներկայանա պրեմիում մակարդակով։",
      },
      {
        imageSrc: "/homepage/03.JPG",
        title: "Լոգիստիկ համակարգ ամբողջ հանրապետության համար",
        body:
          "Պահեստային հզորությունները, երթուղիների պլանավորումը և տարածաշրջանային ծածկույթը թույլ են տալիս ապահովել կայուն և արագ մատակարարում։",
      },
    ],
    testimonials: [
      {
        quote: "Սովրանոն միավորում է պրոֆեսիոնալ ներկայացվածությունը, հուսալի կատարումը և գործընկերային վստահությունը մեկ ամբողջական փորձառության մեջ։",
        author: "Աննա Մկրտչյան",
      },
      {
        quote: "Թիմի գործելաոճում զգացվում է կարգապահությունը, ուշադրությունը մանրուքներին և բրենդների հանդեպ պատասխանատվությունը։",
        author: "Դավիթ Հարությունյան",
      },
      {
        quote: "Տեսականու ընտրությունից մինչև մատակարարման կայունություն՝ ամեն քայլում պահպանվում է բարձր պրոֆեսիոնալ մակարդակ։",
        author: "Մարիամ Սարգսյան",
      },
    ],
  },
  "/ru": {
    media: [
      {
        imageSrc: "/homepage/01.jpg",
        title: "Портфель брендов с точным рыночным позиционированием",
        body:
          "Sovrano выстраивает каждую категорию как коммерчески сильную историю, превращая международные бренды в заметное и устойчивое retail-присутствие в Армении.",
      },
      {
        imageSrc: "/homepage/02.jpg",
        title: "Retail-исполнение, которое сохраняет видимость бренда",
        body:
          "Стандарты мерчандайзинга, правильная выкладка и постоянный полевой контроль помогают каждому продукту выглядеть на полке премиально и убедительно.",
      },
      {
        imageSrc: "/homepage/03.JPG",
        title: "Логистика, рассчитанная на стабильное покрытие страны",
        body:
          "Складская инфраструктура, продуманная маршрутизация и региональное присутствие позволяют обеспечивать быструю и надежную дистрибуцию.",
      },
    ],
    testimonials: [
      {
        quote: "Sovrano сочетает сильную операционную дисциплину, премиальную подачу и уважительное партнерское отношение на каждом этапе работы.",
        author: "Анна Мкртчян",
      },
      {
        quote: "По качеству коммуникации, представленности ассортимента и аккуратности исполнения это команда, которой легко доверять бренд.",
        author: "Давид Арутюнян",
      },
      {
        quote: "От стратегии ассортимента до стабильности поставок компания создает цельный и уверенный опыт для рынка и партнеров.",
        author: "Мариам Саргсян",
      },
    ],
  },
} satisfies Record<
  "/" | "/hy" | "/ru",
  {
    media: Array<Pick<HomepageMediaCard, "imageSrc" | "title" | "body">>;
    testimonials: HomepageTestimonial[];
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
    return getOptimizedAssetSrc(fallbackSrc);
  }

  if (/\/media-0\d-free-img\.jpg$/i.test(src)) {
    return getOptimizedAssetSrc(fallbackSrc);
  }

  return getOptimizedAssetSrc(src);
}

function getIconClass(html: string) {
  const classMatch = html.match(/class="([^"]*fa-[^"]+)"/i);
  return classMatch?.[1] ?? "fas fa-arrow-right";
}

function extractImages(html: string) {
  const images = [...html.matchAll(/src="([^"]+)"[^>]*alt="([^"]*)"/gi)];
  return images.map((match) => ({
    src: getOptimizedAssetSrc(match[1]),
    alt: match[2] || "Partner logo",
  }));
}

function isPlaceholderText(value: string) {
  return /(lorem|ipsum|dolor sit amet|consectetur adipisicing|eiusmod tempor|ut enim ad minim veniam)/i.test(value);
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

function finalizeMediaCards(
  localeBase: "/" | "/hy" | "/ru",
  mediaCards: HomepageMediaCard[],
  fallbackLabel: string,
) {
  const shouldReplace =
    mediaCards.length < 3 ||
    mediaCards.some((card) => isPlaceholderText(card.title) || isPlaceholderText(card.body));

  if (!shouldReplace) {
    return mediaCards;
  }

  return homepageFallbacks[localeBase].media.map((item, index) => ({
    ...item,
    imageSrc: getOptimizedAssetSrc(item.imageSrc),
    href: mediaCards[index]?.href ?? "/about-us",
    ctaLabel: mediaCards[index]?.ctaLabel ?? fallbackLabel,
  }));
}

function finalizeTestimonials(localeBase: "/" | "/hy" | "/ru", testimonials: HomepageTestimonial[]) {
  const shouldReplace =
    testimonials.length < 3 ||
    testimonials.some((item) => isPlaceholderText(item.quote) || isPlaceholderText(item.author));

  if (!shouldReplace) {
    return testimonials;
  }

  return homepageFallbacks[localeBase].testimonials;
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
  const heroBackgroundSrc = getOptimizedAssetSrc(
    getRoutePrimaryAsset(page.route) || getFirstImageSrc(blocks[0]?.html ?? ""),
  );
  const heroAccentSrc = getRouteAccentAsset(page.route) ? getOptimizedAssetSrc(getRouteAccentAsset(page.route)) : null;
  const heroBody = extractHeroBody(blocks, heroTitle, page.meta.description ?? "Sovrano Distributions");
  const stats = extractStats(blocks);
  const mediaCards = finalizeMediaCards(localeBase, extractMediaCards(blocks, page.route), blocks[5]?.ctaLabel ?? "Read More");
  const testimonials = finalizeTestimonials(localeBase, extractTestimonials(blocks));
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
