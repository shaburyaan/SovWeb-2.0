"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";
import { useScrollScene } from "@/hooks/use-scroll-scene";

type ScrollSceneProps = {
  className?: string;
  children: React.ReactNode;
  start?: string;
  end?: string;
  once?: boolean;
  pin?: boolean;
  scrub?: boolean | number;
  variant?: "reveal" | "scrub";
  preset?: "default" | "homepage";
};

export function ScrollScene({
  className,
  children,
  start,
  end,
  once,
  pin,
  scrub,
  variant,
  preset,
}: ScrollSceneProps) {
  const ref = useRef<HTMLElement | null>(null);

  useScrollScene(ref, {
    start,
    end,
    once,
    pin,
    scrub,
    variant,
    preset,
  });

  return (
    <section ref={ref} className={cn("scene-section", className)}>
      {children}
    </section>
  );
}
