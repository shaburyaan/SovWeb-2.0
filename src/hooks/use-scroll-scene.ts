"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SceneOptions = {
  selector?: string;
  start?: string;
  end?: string;
  once?: boolean;
  pin?: boolean;
  scrub?: boolean | number;
  variant?: "reveal" | "scrub";
  preset?: "default" | "homepage";
};

export function useScrollScene(
  scopeRef: RefObject<HTMLElement | null>,
  {
    selector = "[data-scene-item]",
    start = "top 80%",
    end = "bottom 65%",
    once = true,
    pin = false,
    scrub = 0.45,
    variant = "reveal",
    preset = "default",
  }: SceneOptions = {},
) {
  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(scope.querySelectorAll(selector), {
        clearProps: "all",
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const targets = scope.querySelectorAll(selector);
      const isHomepage = preset === "homepage";
      const scrubValue =
        typeof scrub === "number"
          ? scrub
          : scrub
            ? 0.55
            : false;

      if (!targets.length) {
        return;
      }

      if (variant === "scrub") {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start,
            end,
            pin,
            scrub: scrubValue,
          },
        });

        timeline.fromTo(
          targets,
          {
            opacity: 0.24,
            y: isHomepage ? 110 : 72,
            scale: isHomepage ? 0.95 : 0.97,
            transformOrigin: "50% 50%",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "none",
            stagger: isHomepage ? 0.08 : 0.05,
          },
        );

        return;
      }

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: isHomepage ? 112 : 52,
          scale: isHomepage ? 0.955 : 0.985,
          transformOrigin: "50% 50%",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: isHomepage ? 1.28 : 0.95,
          ease: "power3.out",
          stagger: isHomepage ? 0.095 : 0.06,
          scrollTrigger: {
            trigger: scope,
            start,
            end,
            once,
          },
        },
      );
    }, scope);

    return () => {
      ctx.revert();
    };
  }, [end, once, pin, preset, scopeRef, scrub, selector, start, variant]);
}
