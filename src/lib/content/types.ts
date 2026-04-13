export type LegacyPageMeta = {
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogUrl?: string | null;
  htmlLang?: string | null;
};

export type LegacyNavLink = {
  href: string;
  text: string;
};

export type LegacyBlock = {
  type: string;
  html: string;
  textPlain?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  src?: string | null;
  alt?: string | null;
};

export type LegacyPage = {
  route: string;
  sourceFile: string;
  meta: LegacyPageMeta;
  blocks: LegacyBlock[];
  heroTagline?: string | null;
  images?: Array<{
    src: string;
    alt: string | null;
  }>;
  links?: string[];
  headerHtml?: string;
  footerHtml?: string;
  chrome?: {
    textPlainFooter?: string | null;
    textPlainHeader?: string | null;
  };
};

export type HomepageStat = {
  value: string;
  label: string;
};

export type HomepageService = {
  title: string;
  body: string;
  icon: string;
};

export type HomepageLogo = {
  src: string;
  alt: string;
};

export type HomepageMediaCard = {
  imageSrc: string;
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
};

export type HomepageTestimonial = {
  quote: string;
  author: string;
};

export type HomepageData = {
  meta: LegacyPageMeta;
  locale: string;
  nav: LegacyNavLink[];
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    backgroundSrc: string;
    accentSrc?: string | null;
    ctaHref: string;
    ctaLabel: string;
  };
  history: {
    kicker: string;
    heading: string;
    lead: string;
    body: string;
  };
  stats: HomepageStat[];
  media: {
    kicker: string;
    heading: string;
    cards: HomepageMediaCard[];
  };
  testimonials: {
    kicker: string;
    heading: string;
    items: HomepageTestimonial[];
  };
  partners: {
    kicker: string;
    heading: string;
    logos: HomepageLogo[];
  };
  services: {
    kicker: string;
    heading: string;
    items: HomepageService[];
  };
  footer: {
    eyebrow: string;
    heading: string;
    body: string;
  };
};
