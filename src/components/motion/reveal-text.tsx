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

    const split = new SplitType(element, {
      types: mode,
      tagName: "span",
    });

    const targets =
      mode === "chars" ? split.chars : mode === "lines" ? split.lines : split.words;

    const animation = gsap.fromTo(
      targets,
      {
        yPercent: 120,
        opacity: 0,
        rotateX: mode === "chars" ? -50 : -18,
      },
      {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: mode === "chars" ? 0.9 : 1.08,
        stagger: mode === "chars" ? 0.012 : 0.035,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
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
