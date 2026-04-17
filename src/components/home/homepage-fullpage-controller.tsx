"use client";

import { Children, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { clamp, cn } from "@/lib/utils";

type HomepageFullpageSection = {
  id: string;
  label: string;
};

type HomepageFullpageControllerProps = {
  sections: HomepageFullpageSection[];
  children: React.ReactNode;
};

const SECTION_TRANSITION_MS = 980;

export function HomepageFullpageController({ sections, children }: HomepageFullpageControllerProps) {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);
  const lockedUntilRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const frameRef = useRef(0);
  const childArray = useMemo(() => Children.toArray(children), [children]);

  const scrollToSection = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const targetIndex = clamp(index, 0, sections.length - 1);
      const panel = panelRefs.current[targetIndex];

      if (!panel) {
        return;
      }

      activeIndexRef.current = targetIndex;
      setActiveIndex(targetIndex);
      lockedUntilRef.current = performance.now() + SECTION_TRANSITION_MS;
      window.scrollTo({
        top: panel.offsetTop,
        behavior,
      });

      const nextHash = targetIndex === 0 ? "" : `#${sections[targetIndex]?.id ?? ""}`;
      window.history.replaceState(window.history.state, "", `${pathname}${nextHash}`);
    },
    [pathname, sections],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px), (pointer: coarse), (prefers-reduced-motion: reduce)");
    const apply = () => {
      setEnabled(!mediaQuery.matches);
    };

    apply();
    mediaQuery.addEventListener("change", apply);

    return () => mediaQuery.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const matchFromHash = window.location.hash.replace(/^#/, "");
    const initialIndex = sections.findIndex((section) => section.id === matchFromHash);

    window.requestAnimationFrame(() => {
      scrollToSection(initialIndex >= 0 ? initialIndex : 0, "auto");
    });
  }, [enabled, pathname, scrollToSection, sections]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const updateActiveSection = () => {
      frameRef.current = 0;
      const viewportCenter = window.scrollY + window.innerHeight * 0.5;
      let nextIndex = 0;
      let smallestDistance = Number.POSITIVE_INFINITY;

      panelRefs.current.forEach((panel, index) => {
        if (!panel) {
          return;
        }

        const panelCenter = panel.offsetTop + panel.offsetHeight * 0.5;
        const distance = Math.abs(panelCenter - viewportCenter);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          nextIndex = index;
        }
      });

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        const nextHash = nextIndex === 0 ? "" : `#${sections[nextIndex]?.id ?? ""}`;
        window.history.replaceState(window.history.state, "", `${pathname}${nextHash}`);
      }
    };

    const handleScroll = () => {
      if (frameRef.current) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(updateActiveSection);
    };

    const moveByDirection = (direction: 1 | -1) => {
      if (performance.now() < lockedUntilRef.current) {
        return;
      }

      scrollToSection(activeIndexRef.current + direction);
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 18) {
        return;
      }

      event.preventDefault();
      moveByDirection(event.deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        moveByDirection(1);
      }

      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        moveByDirection(-1);
      }

      if (event.key === "Home") {
        event.preventDefault();
        scrollToSection(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        scrollToSection(sections.length - 1);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartRef.current == null) {
        return;
      }

      const touchEnd = event.changedTouches[0]?.clientY ?? touchStartRef.current;
      const delta = touchStartRef.current - touchEnd;
      touchStartRef.current = null;

      if (Math.abs(delta) < 42) {
        return;
      }

      moveByDirection(delta > 0 ? 1 : -1);
    };

    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const matchedIndex = sections.findIndex((section) => section.id === hash);

      if (matchedIndex >= 0) {
        scrollToSection(matchedIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [enabled, pathname, scrollToSection, sections]);

  if (!enabled) {
    return <main className="homepage-main">{children}</main>;
  }

  return (
    <>
      <main className="homepage-main homepage-main--fullpage">
        <div className="homepage-fullpage__bullets" aria-label="Homepage sections">
          {sections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              className="homepage-fullpage__bullet"
              data-active={index === activeIndex}
              aria-label={section.label}
              onClick={() => scrollToSection(index)}
            >
              <span className="homepage-fullpage__bullet-dot" />
              <span className="homepage-fullpage__bullet-label">{section.label}</span>
            </button>
          ))}
        </div>

        <div className="homepage-fullpage__panels">
          {childArray.map((child, index) => {
            const section = sections[index];
            const isActive = index === activeIndex;

            return (
              <div
                key={section?.id ?? index}
                id={section?.id}
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                className={cn("homepage-fullpage__panel", isActive && "homepage-fullpage__panel--active")}
                data-active={isActive}
                data-panel-id={section?.id ?? `section-${index + 1}`}
              >
                {child}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
