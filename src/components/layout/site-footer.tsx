import { RevealText } from "@/components/motion/reveal-text";
import { TransitionLink } from "@/components/navigation/transition-link";
import type { HomepageData, LegacyNavLink } from "@/lib/content/types";

type SiteFooterProps = {
  footer: HomepageData["footer"];
  nav: LegacyNavLink[];
};

export function SiteFooter({ footer, nav }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__intro">
          <RevealText as="p" className="site-footer__eyebrow" mode="chars">
            {footer.eyebrow}
          </RevealText>
          <RevealText as="h2" className="site-footer__title" mode="words">
            {footer.heading}
          </RevealText>
          <RevealText as="p" className="site-footer__body" mode="words">
            {footer.body}
          </RevealText>
        </div>

        <div className="site-footer__nav">
          {nav.slice(0, 5).map((item) => (
            <TransitionLink key={`${item.href}-${item.text}`} href={item.href} className="site-footer__link">
              {item.text}
            </TransitionLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
