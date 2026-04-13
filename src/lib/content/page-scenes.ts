import { normalizeRoute } from "@/lib/utils";

import type { GenericPageData } from "./page";
import { getBackgroundAssetFromBlocks, getRoutePrimaryAsset } from "./legacy-asset-overrides";
import { getLegacyPage } from "./store";
import type { LegacyBlock } from "./types";

export type NarrativeSection = {
  heading: string;
  body: string;
};

export type GalleryCard = {
  src: string;
  alt: string;
};

export type PartnerCard = {
  imageSrc: string;
  title: string;
  body: string;
  href: string;
  label: string;
  categories: string[];
};

export type PartnerCategory = {
  slug: string;
  label: string;
  cards: PartnerCard[];
};

export type PartnersPageModel = {
  lead: string;
  filters: Array<{ slug: string; label: string }>;
  categories: PartnerCategory[];
  allCards: PartnerCard[];
};

type SupplementalPartnerEntry = {
  slug: string;
  title: string;
  category: string;
  body: string;
  imageAlt: string;
};

export type DistributionCard = {
  title: string;
  body: string;
  imageSrc: string;
};

export type BrandDetailModel = {
  title: string;
  subtitle: string;
  body: string;
  heroImage: string;
  backdropImage: string;
  productHeading: string;
  productGallery: GalleryCard[];
  overviewGallery: GalleryCard[];
  backLink: ActionLink | null;
};

export type ActionLink = {
  href: string;
  label: string;
};

const productSectionLabels = new Set(["products", "ապրանքներ", "продукты"]);

const basePartnerCategories = new Set([
  "all",
  "alcoholic beverages",
  "confectionery",
  "tea & coffee",
  "gastronomy",
  "ալկոհոլային խմիչքներ",
  "հրուշակեղեն",
  "թեյ և սուրճ",
  "թեյ եվ սուրճ",
  "գաստրոնոմիա",
  "алкогольные напитки",
  "кондитерка",
  "чай и кофе",
  "гастрономия",
]);

const supplementalPartners: SupplementalPartnerEntry[] = [
  {
    slug: "sazerac",
    title: "Sazerac",
    category: "alcoholic-beverages",
    imageAlt: "Sazerac",
    body:
      "Sazerac is one of the oldest and most respected names in the global spirits industry, with roots dating back to 17th-century France and a deep heritage in New Orleans.",
  },
  {
    slug: "louers-vodka",
    title: "Louers Vodka",
    category: "alcoholic-beverages",
    imageAlt: "Louers Vodka",
    body:
      "LOUERS Vodka is an ultra-premium Dutch vodka crafted from the finest wheat and pure spring water, known for its award-winning quality and iconic LED-lit bottle design.",
  },
  {
    slug: "g-j-distillers",
    title: "G&J Distillers",
    category: "alcoholic-beverages",
    imageAlt: "G&J Distillers",
    body:
      "G&J Distillers is the world's oldest continuous gin distillery, proudly crafting premium spirits in Warrington, England since 1761.",
  },
  {
    slug: "feletti",
    title: "Feletti",
    category: "confectionery",
    imageAlt: "Feletti",
    body:
      "Feletti is a historic Italian chocolate brand founded in 1882 in Turin, known for artisanal craftsmanship and premium chocolates, pralines, and spreads.",
  },
  {
    slug: "grona",
    title: "Grona",
    category: "confectionery",
    imageAlt: "Grona",
    body:
      "Grona is a leading Ukrainian confectionery manufacturer established in 1995, producing biscuits, crackers, puff pastries, confectionery, and pasta.",
  },
  {
    slug: "millennium",
    title: "Millennium",
    category: "confectionery",
    imageAlt: "Millennium",
    body:
      "Millennium Confectionery is a leading Ukrainian chocolate manufacturer established in 1999, known for chocolates and candies under brands like Millennium, Lubimov, and Oskar le Grand.",
  },
  {
    slug: "bezhitsky",
    title: "Bezhitsky",
    category: "confectionery",
    imageAlt: "Bezhitsky",
    body:
      "Bezhitsky Confectionery is a renowned Russian manufacturer specializing in a diverse range of baked goods and snacks, including gingerbread, biscuits, and crispbreads.",
  },
  {
    slug: "lacasitos",
    title: "Lacasitos",
    category: "confectionery",
    imageAlt: "Lacasitos",
    body:
      "Lacasitos is a beloved Spanish confectionery brand launched in 1982 by Chocolates Lacasa, famous for colorful milk chocolate buttons with a playful sugar shell.",
  },
  {
    slug: "bulgari",
    title: "Bulgari",
    category: "confectionery",
    imageAlt: "Bulgari",
    body:
      "Bulgari Confectionery, established in 1880 in Pavone del Mella, Italy, is celebrated for creative and high-quality marshmallow products with over a century of expertise.",
  },
  {
    slug: "delverde",
    title: "Delverde",
    category: "gastronomy",
    imageAlt: "Delverde",
    body:
      "Delverde is a premium Italian pasta brand known for high-quality durum wheat pasta and traditional production methods.",
  },
  {
    slug: "garofalo",
    title: "Garofalo",
    category: "gastronomy",
    imageAlt: "Garofalo",
    body:
      "Garofalo is a renowned Italian pasta manufacturer with over 200 years of tradition, producing premium pasta from the finest durum wheat.",
  },
  {
    slug: "sterilgarda",
    title: "Sterilgarda",
    category: "gastronomy",
    imageAlt: "Sterilgarda",
    body:
      "Sterilgarda is a well-known Italian company engaged in dairy and juice production, founded in 1969 and considered one of Italy's major dairy producers.",
  },
  {
    slug: "caputo",
    title: "Caputo",
    category: "gastronomy",
    imageAlt: "Caputo",
    body:
      "Caputo is the world's most famous flour for pizza, trusted by professional pizzaioli worldwide for authentic Neapolitan pizza.",
  },
  {
    slug: "sacla",
    title: "Sacla",
    category: "gastronomy",
    imageAlt: "Sacla",
    body:
      "Sacla is a well-known Italian brand specializing in canned food production, founded in 1939 in Italy.",
  },
  {
    slug: "virgilio",
    title: "Virgilio",
    category: "gastronomy",
    imageAlt: "Virgilio",
    body:
      "Virgilio is an Italian dairy brand founded in 1965 in the Mantova region of Italy, known for producing high-quality cheeses, especially Grana Padano.",
  },
];

function cleanText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string) {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\u0400-\u04ff\u0530-\u058f]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleFromSlug(href: string) {
  const slug = href.split("/").filter(Boolean).at(-1) ?? "";

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeLookupName(value: string) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function longestText(first: string, second: string) {
  return second.length > first.length ? second : first;
}

function dedupePartnerCards(cards: PartnerCard[]) {
  const byHref = new Map<string, PartnerCard>();

  for (const card of cards) {
    const current = byHref.get(card.href);

    if (!current) {
      byHref.set(card.href, card);
      continue;
    }

    byHref.set(card.href, {
      ...current,
      imageSrc: current.imageSrc || card.imageSrc,
      title: current.title || card.title,
      body: longestText(current.body, card.body),
      label: current.label || card.label,
      categories: Array.from(new Set([...current.categories, ...card.categories])),
    });
  }

  return [...byHref.values()];
}

function buildSupplementalPartnerCards(data: GenericPageData, existingCards: PartnerCard[]) {
  const imageByAlt = new Map(
    data.rawImages.map((image) => [normalizeLookupName(image.alt ?? ""), image.src] as const),
  );
  const existingKeys = new Set(existingCards.map((card) => normalizeLookupName(card.title)));

  return supplementalPartners
    .filter((entry) => !existingKeys.has(normalizeLookupName(entry.title)))
    .map((entry) => {
      const route = data.localeBase === "/" ? `/${entry.slug}/` : `${data.localeBase}/${entry.slug}/`;
      const page = getLegacyPage(route);
      const href = page
        ? data.localeBase === "/" ? `/en/${entry.slug}` : `${data.localeBase}/${entry.slug}`
        : `${data.route.replace(/\/$/, "")}#${entry.slug}`;
      const imageSrc =
        imageByAlt.get(normalizeLookupName(entry.imageAlt)) ??
        page?.images?.[0]?.src ??
        data.heroImage;

      return {
        imageSrc,
        title: entry.title,
        body: entry.body,
        href,
        label: page ? "Read More" : "View",
        categories: [entry.category],
      } satisfies PartnerCard;
    });
}

function parseFilterSlug(html: string, label: string) {
  if (label.toLowerCase() === "all") {
    return "all";
  }

  const ajaxMatch = html.match(/&quot;,?&quot;([^&]+)&quot;\]/i);
  if (ajaxMatch?.[1]) {
    return slugify(ajaxMatch[1]);
  }

  const filterMatch = html.match(/data-filter="\.category-([^"]+)"/i);
  if (filterMatch?.[1]) {
    return slugify(filterMatch[1]);
  }

  return slugify(label);
}

function extractPartnerFilters(blocks: LegacyBlock[]) {
  const galleryBlock = blocks.find((block) => /wpr-grid-filters/i.test(block.html));

  if (!galleryBlock) {
    return [];
  }

  const filters = [...galleryBlock.html.matchAll(/<span[^>]*(?:data-filter|data-ajax-filter)[^>]*>[\s\S]*?<\/span>/gi)]
    .map((match) => {
      const html = match[0];
      const label = cleanText(html);

      if (!label) {
        return null;
      }

      return {
        slug: parseFilterSlug(html, label),
        label,
      };
    })
    .filter((item): item is { slug: string; label: string } => Boolean(item));

  return filters.filter(
    (item, index, list) => list.findIndex((candidate) => candidate.slug === item.slug) === index,
  );
}

function extractCardCategories(articleHtml: string) {
  const matches = [...articleHtml.matchAll(/category-([a-z0-9-]+)/gi)]
    .map((match) => slugify(match[1]))
    .filter((category) => category !== "partners");

  return Array.from(new Set(matches));
}

function extractPartnerCardsFromHtml(html: string, route: string, localeBase: GenericPageData["localeBase"]) {
  const cards = [...html.matchAll(/<article\b[\s\S]*?<\/article>/gi)]
    .map((match) => {
      const articleHtml = match[0];
      const hrefMatch = articleHtml.match(/href="([^"]+)"/i);
      const srcMatch = articleHtml.match(/<img[^>]+src="([^"]+)"/i);
      const ariaMatch = articleHtml.match(/aria-label="Read more about ([^"]+)"/i);
      const labelMatch = articleHtml.match(/elementor-post__read-more[\s\S]*?>([\s\S]*?)<\/a>/i);
      const excerptMatch = articleHtml.match(/elementor-post__excerpt[\s\S]*?<p>([\s\S]*?)<\/p>/i);

      if (!hrefMatch?.[1] || !srcMatch?.[1]) {
        return null;
      }

      let href = normalizeRoute(hrefMatch[1], route);
      if (localeBase === "/" && /^\/[a-z0-9-]+$/i.test(href)) {
        href = `/en${href}`;
      }

      return {
        imageSrc: srcMatch[1],
        title: cleanText(ariaMatch?.[1] ?? "") || titleFromSlug(href),
        body: cleanText(excerptMatch?.[1] ?? ""),
        href,
        label: cleanText(labelMatch?.[1] ?? "") || "Read More",
        categories: extractCardCategories(articleHtml),
      };
    })
    .filter((item): item is PartnerCard => Boolean(item));

  return cards;
}

function extractGalleryCardsFromHtml(html: string, fallbackAlt: string) {
  return [...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)].map((match) => ({
    src: match[1],
    alt: cleanText(match[2]) || fallbackAlt,
  }));
}

function isProductsHeading(value: string) {
  return productSectionLabels.has(cleanText(value).toLowerCase());
}

export function isBrandDetailPage(data: GenericPageData) {
  return data.rawBlocks.some((block) => isProductsHeading(block.textPlain ?? "")) && data.rawImages.length > 1;
}

export function getBrandDetailModel(data: GenericPageData): BrandDetailModel {
  const productHeadingIndex = data.rawBlocks.findIndex((block) => isProductsHeading(block.textPlain ?? ""));
  const introBlocks = productHeadingIndex >= 0 ? data.rawBlocks.slice(0, productHeadingIndex) : data.rawBlocks;
  const introHeadings = introBlocks
    .filter((block) => block.type === "heading")
    .map((block) => cleanText(block.textPlain ?? ""))
    .filter(Boolean);
  const introBodies = introBlocks
    .filter((block) => block.type === "richText")
    .map((block) => cleanText(block.textPlain ?? ""))
    .filter(Boolean);
  const productHeading =
    cleanText(data.rawBlocks[productHeadingIndex]?.textPlain ?? "") ||
    cleanText(data.items.find((item) => item.type === "heading")?.value ?? "") ||
    "PRODUCTS";
  const galleryBlock = productHeadingIndex >= 0 ? data.rawBlocks.slice(productHeadingIndex + 1).find((block) => /<img/i.test(block.html)) : null;
  const galleryFromBlock = galleryBlock ? extractGalleryCardsFromHtml(galleryBlock.html, introHeadings[0] ?? data.title) : [];
  const galleryFromImages = data.rawImages.slice(1).map((image) => ({
    src: image.src,
    alt: cleanText(image.alt ?? "") || introHeadings[0] || data.title,
  }));
  const productGallery = (galleryFromBlock.length ? galleryFromBlock : galleryFromImages).filter(
    (card, index, list) => list.findIndex((candidate) => candidate.src === card.src) === index,
  );
  const backLink =
    data.nav.find((item) => /partners/i.test(item.href) || /partners/i.test(item.text)) ?? null;

  return {
    title: introHeadings[0] ?? data.title,
    subtitle: introHeadings[1] ?? "",
    body: introBodies.join(" ").trim() || data.description,
    heroImage: data.rawImages[0]?.src ?? data.heroImage,
    backdropImage:
      getBackgroundAssetFromBlocks(data.rawBlocks) ||
      getRoutePrimaryAsset(data.route) ||
      data.rawImages[0]?.src ||
      data.heroImage,
    productHeading,
    productGallery,
    overviewGallery: productGallery.slice(0, 3),
    backLink: backLink
      ? {
          href: backLink.href,
          label: backLink.text,
        }
      : null,
  };
}

export function getPartnersPageModel(data: GenericPageData): PartnersPageModel {
  const lead =
    data.rawBlocks
      .map((block) => cleanText(block.textPlain ?? ""))
      .find((text) => text && !basePartnerCategories.has(text.toLowerCase()) && text !== data.title) ??
    data.description;

  const filters = extractPartnerFilters(data.rawBlocks);
  const extractedCards = dedupePartnerCards(
    data.rawBlocks.flatMap((block) =>
      /elementor-post__card/i.test(block.html)
        ? extractPartnerCardsFromHtml(block.html, data.route, data.localeBase)
        : [],
    ),
  );
  const allCards = dedupePartnerCards([...extractedCards, ...buildSupplementalPartnerCards(data, extractedCards)]);

  const orderedFilters = filters.length
    ? filters
    : [{ slug: "all", label: "All" }, ...Array.from(new Set(allCards.flatMap((card) => card.categories))).map((slug) => ({ slug, label: titleFromSlug(`/${slug}`) }))];

  const categories = orderedFilters
    .filter((filter) => filter.slug !== "all")
    .map((filter) => ({
      slug: filter.slug,
      label: filter.label,
      cards: allCards.filter((card) => card.categories.includes(filter.slug)),
    }))
    .filter((category) => category.cards.length);

  const finalFilters = [
    orderedFilters.find((filter) => filter.slug === "all") ?? { slug: "all", label: "All" },
    ...categories.map((category) => ({ slug: category.slug, label: category.label })),
  ];

  return {
    lead,
    filters: finalFilters,
    categories,
    allCards,
  };
}

export function getAboutSections(data: GenericPageData) {
  const headings = data.items.filter((item) => item.type === "heading");
  const bodies = data.items.filter((item) => item.type === "body");
  const images = data.items.filter((item) => item.type === "image");
  const buttons = data.items.filter((item) => item.type === "button");

  const stats = headings
    .map((item, index, list) => {
      const next = list[index + 1];
      if (!/^\d+\+?$/.test(item.value) || !next) {
        return null;
      }

      return {
        value: item.value,
        label: next.value,
      };
    })
    .filter((item): item is { value: string; label: string } => Boolean(item));

  const narratives: NarrativeSection[] = [];

  for (let index = 1; index < headings.length; index += 1) {
    const heading = headings[index];
    const body = bodies[index - 1];

    if (heading && body && !/^\d+\+?$/.test(heading.value)) {
      narratives.push({
        heading: heading.value,
        body: body.value,
      });
    }
  }

  return {
    intro: narratives.slice(0, 2),
    advantages: narratives.slice(2),
    stats,
    gallery: images.map((item) => ({
      src: item.src,
      alt: item.alt,
    })),
    cta: buttons[0] ?? null,
  };
}

export function getDistributionCards(data: GenericPageData): DistributionCard[] {
  const items = data.items;
  const cards: DistributionCard[] = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (item.type !== "heading") continue;

    const nextHeadingIndex = items.findIndex(
      (candidate, candidateIndex) => candidateIndex > index && candidate.type === "heading",
    );
    const segment = items.slice(index + 1, nextHeadingIndex === -1 ? undefined : nextHeadingIndex);
    const body = segment.find((candidate) => candidate.type === "body");
    const image = segment.find((candidate) => candidate.type === "image");

    if (body?.type === "body" && image?.type === "image") {
      cards.push({
        title: item.value,
        body: body.value,
        imageSrc: image.src,
      });
    }
  }

  return cards.filter(
    (card, index, list) => list.findIndex((candidate) => candidate.title === card.title) === index,
  );
}

export function getVacancySections(data: GenericPageData) {
  const sections: NarrativeSection[] = [];
  const headings = data.items.filter((item) => item.type === "heading");
  const bodies = data.items.filter((item) => item.type === "body");
  const actions = data.items.filter((item) => item.type === "button");

  for (let index = 1; index < headings.length; index += 1) {
    const heading = headings[index];
    const body = bodies[index - 1];

    if (heading && body) {
      sections.push({
        heading: heading.value,
        body: body.value,
      });
    }
  }

  return {
    jobTitle: headings[0]?.value ?? data.title,
    sections,
    actions: actions as ActionLink[],
  };
}

export function getContactSections(data: GenericPageData) {
  const narratives: NarrativeSection[] = [];
  const headings = data.items.filter((item) => item.type === "heading");
  const bodies = data.items.filter((item) => item.type === "body");
  const embeds = data.items.filter((item) => item.type === "embed");

  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    const body = bodies[index];

    if (heading && body) {
      narratives.push({
        heading: heading.value,
        body: body.value,
      });
    }
  }

  return {
    narratives,
    embeds: embeds.map((item) => item.html),
  };
}
