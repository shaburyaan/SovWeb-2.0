"use client";

import { useEffect, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type RevealTextProps = {
  as?: ElementType;
  children: string;
  className?: string;
  mode?: "lines" | "words" | "chars";
  once?: boolean;
};

export function RevealText({
  as = "p",
  children,
  className,
  mode = "words",
  once = true,
}: RevealTextProps) {
  const Comp = as;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      return;
    }

    const isHeroText = Boolean(element.closest(".hero-scene, .generic-hero, .brand-detail-hero"));
    const isHeroTitle = Boolean(
      element.closest(".hero-scene__title, .generic-hero__title, .brand-detail-hero__title"),
    );
    const isHomepageBlock = Boolean(element.closest(".homepage-main"));
    const resolvedMode =
      mode === "chars"
        ? isHeroTitle
          ? "chars"
          : "words"
        : !isHeroText && mode === "words" && children.length > 220
          ? "lines"
          : mode;

    const split = new SplitType(element, {
      types: resolvedMode,
      tagName: "span",
    });

    const targets =
      (resolvedMode === "chars" ? split.chars : resolvedMode === "lines" ? split.lines : split.words) ?? [];

    if (!targets.length) {
      split.revert();
      return;
    }

    const animation = gsap.fromTo(
      targets,
      {
        yPercent: isHomepageBlock && resolvedMode !== "chars" ? 136 : 120,
        opacity: 0,
        rotateX: resolvedMode === "chars" ? -50 : isHomepageBlock ? -16 : -12,
      },
      {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: resolvedMode === "chars" ? 0.9 : isHomepageBlock ? 1.02 : 0.92,
        stagger: resolvedMode === "chars" ? 0.012 : isHomepageBlock ? 0.034 : 0.028,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: isHomepageBlock ? "top 88%" : "top 85%",
          once,
        },
      },
    );

    return () => {
      animation.kill();
      split.revert();
    };
  }, [children, mode, once]);

  return (
    <Comp ref={ref as never} className={cn("reveal-text", className)}>
      {children}
    </Comp>
  );
}
