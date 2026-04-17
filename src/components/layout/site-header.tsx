import Image from "next/image";

import { TransitionLink } from "@/components/navigation/transition-link";
import type { LegacyNavLink } from "@/lib/content/types";

type SiteHeaderProps = {
  nav: LegacyNavLink[];
};

export function SiteHeader({ nav }: SiteHeaderProps) {
  const primary = nav.slice(0, 5);
  const locales = nav.slice(5);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <TransitionLink href="/" className="site-logo" cursorLabel="Open">
          <Image
            src="/optimized-media/homepage/Sovrano Main Logo 1.webp"
            alt="Sovrano Distributions"
            className="site-logo__image"
            width={640}
            height={280}
            priority
            sizes="(max-width: 800px) 34vw, 10rem"
          />
        </TransitionLink>

        <nav className="site-nav" aria-label="Primary">
          {primary.map((item) => (
            <TransitionLink key={`${item.href}-${item.text}`} href={item.href} className="site-nav__link" cursorLabel="Open">
              {item.text}
            </TransitionLink>
          ))}
        </nav>

        <nav className="site-locale" aria-label="Locales">
          {locales.map((item) => (
            <TransitionLink key={`${item.href}-${item.text}`} href={item.href} className="site-locale__link">
              {item.text}
            </TransitionLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
