"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

import { cn, normalizeAssetSrc } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type ParallaxMediaProps = {
  src: string;
  alt: string;
  className?: string;
  fit?: "cover" | "contain";
  parallax?: boolean;
  priority?: boolean;
  sizes?: string;
};

export function ParallaxMedia({
  src,
  alt,
  className,
  fit = "cover",
  parallax = true,
  priority = false,
  sizes = "(max-width: 800px) 100vw, 33vw",
}: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const normalizedSrc = normalizeAssetSrc(src);

  useEffect(() => {
    const element = ref.current;

    if (!element || !parallax || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const media = element.querySelector("[data-parallax-target]");

    if (!media) {
      return;
    }

    const tween = gsap.fromTo(
      media,
      {
        yPercent: -2,
        scale: 1,
      },
      {
        yPercent: 2,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.35,
        },
      },
    );

    return () => {
      tween.kill();
    };
  }, [parallax]);

  return (
    <div ref={ref} className={cn("parallax-media", className)}>
      {normalizedSrc ? (
        <Image
          src={normalizedSrc}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("parallax-media__image", fit === "contain" && "parallax-media__image--contain")}
          data-parallax-target
        />
      ) : null}
    </div>
  );
}
