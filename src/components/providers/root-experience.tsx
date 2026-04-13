"use client";

import { CursorProvider } from "@/components/providers/cursor-provider";
import { PageTransitionProvider } from "@/components/providers/page-transition-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

export function RootExperience({ children }: { children: React.ReactNode }) {
  return (
    <PageTransitionProvider>
      <SmoothScrollProvider>
        <CursorProvider>{children}</CursorProvider>
      </SmoothScrollProvider>
    </PageTransitionProvider>
  );
}
