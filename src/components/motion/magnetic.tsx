"use client";

import { type ElementType } from "react";

import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/use-magnetic";

type MagneticProps = {
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

export function Magnetic({ as = "div", children, className, strength }: MagneticProps) {
  const Comp = as;
  const ref = useMagnetic<HTMLElement>({ strength });

  return (
    <Comp ref={ref as never} className={cn("magnetic-node", className)}>
      {children}
    </Comp>
  );
}
