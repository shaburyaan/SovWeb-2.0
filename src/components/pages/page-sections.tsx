import { Magnetic } from "@/components/motion/magnetic";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { RevealText } from "@/components/motion/reveal-text";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { TransitionLink } from "@/components/navigation/transition-link";
import type { ActionLink } from "@/lib/content/page-scenes";

export function NarrativeScene({
  kicker,
  title,
  items,
}: {
  kicker: string;
  title: string;
  items: Array<{ heading: string; body: string }>;
}) {
  return (
    <ScrollScene className="generic-narrative-scene">
      <div className="generic-narrative-scene__header" data-scene-item>
        <RevealText as="p" className="scene-kicker" mode="chars">
          {kicker}
        </RevealText>
        <RevealText as="h2" className="generic-narrative-scene__title" mode="words">
          {title}
        </RevealText>
      </div>

      <div className="generic-narrative-scene__grid">
        {items.map((item) => (
          <article key={`${item.heading}-${item.body.slice(0, 30)}`} className="generic-narrative-scene__card" data-scene-item>
            <RevealText as="h3" className="generic-narrative-scene__card-title" mode="words">
              {item.heading}
            </RevealText>
            <RevealText as="p" className="generic-narrative-scene__body" mode="words">
              {item.body}
            </RevealText>
          </article>
        ))}
      </div>
    </ScrollScene>
  );
}

export function GalleryScene({
  kicker,
  title,
  gallery,
}: {
  kicker: string;
  title: string;
  gallery: Array<{ src: string; alt: string }>;
}) {
  if (!gallery.length) return null;

  return (
    <ScrollScene className="generic-gallery-scene">
      <div className="generic-gallery-scene__header" data-scene-item>
        <RevealText as="p" className="scene-kicker" mode="chars">
          {kicker}
        </RevealText>
        <RevealText as="h2" className="generic-gallery-scene__title" mode="words">
          {title}
        </RevealText>
      </div>
      <div className="generic-gallery-scene__grid">
        {gallery.map((item) => (
          <ParallaxMedia key={`${item.src}-${item.alt}`} src={item.src} alt={item.alt} className="generic-gallery-scene__media" />
        ))}
      </div>
    </ScrollScene>
  );
}

export function ActionStrip({
  kicker,
  title,
  actions,
}: {
  kicker: string;
  title: string;
  actions: ActionLink[];
}) {
  if (!actions.length) return null;

  return (
    <ScrollScene className="action-strip-scene">
      <div className="action-strip-scene__inner" data-scene-item>
        <RevealText as="p" className="scene-kicker" mode="chars">
          {kicker}
        </RevealText>
        <RevealText as="h2" className="action-strip-scene__title" mode="words">
          {title}
        </RevealText>
        <div className="action-strip-scene__actions">
          {actions.map((action) => (
            <Magnetic key={`${action.href}-${action.label}`} as="span">
              <TransitionLink href={action.href} className="hero-scene__button">
                {action.label}
              </TransitionLink>
            </Magnetic>
          ))}
        </div>
      </div>
    </ScrollScene>
  );
}
