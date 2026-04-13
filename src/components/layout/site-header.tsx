import { Magnetic } from "@/components/motion/magnetic";
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
          <span className="site-logo__label">Sovrano</span>
          <span className="site-logo__subline">Distributions</span>
        </TransitionLink>

        <nav className="site-nav" aria-label="Primary">
          {primary.map((item) => (
            <Magnetic key={`${item.href}-${item.text}`} as="span" className="site-nav__magnetic">
              <TransitionLink href={item.href} className="site-nav__link" cursorLabel="Open">
                {item.text}
              </TransitionLink>
            </Magnetic>
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
