"use client";

import { useEffect, useRef } from "react";

type MagneticOptions = {
  strength?: number;
};

export function useMagnetic<T extends HTMLElement>({
  strength = 0.24,
}: MagneticOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let frame = 0;

    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);

      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        element.style.transform = `translate3d(${offsetX * strength}px, ${offsetY * strength}px, 0)`;
      });
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        element.style.transform = "translate3d(0, 0, 0)";
      });
    };

    element.addEventListener("mousemove", handleMove);
    element.addEventListener("mouseleave", reset);

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("mousemove", handleMove);
      element.removeEventListener("mouseleave", reset);
    };
  }, [strength]);

  return ref;
}
