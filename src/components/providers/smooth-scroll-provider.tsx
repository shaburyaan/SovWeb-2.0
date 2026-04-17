"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const isHomeLocale = pathname === "/" || pathname === "/hy" || pathname === "/ru";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ?? false;

    if (isHomeLocale || reduceMotion || coarsePointer || saveData) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.9,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.92,
    });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    let syncFrame = 0;
    const syncScroll = () => {
      if (syncFrame) {
        return;
      }

      syncFrame = window.requestAnimationFrame(() => {
        syncFrame = 0;
        ScrollTrigger.update();
      });
    };
    const refresh = () => lenis.resize();

    lenis.on("scroll", syncScroll);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.addEventListener("refresh", refresh);
    ScrollTrigger.refresh();

    return () => {
      if (syncFrame) {
        window.cancelAnimationFrame(syncFrame);
      }

      ScrollTrigger.removeEventListener("refresh", refresh);
      lenis.off("scroll", syncScroll);
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, [pathname]);

  return <>{children}</>;
}
