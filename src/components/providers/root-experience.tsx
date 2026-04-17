"use client";

import { usePathname } from "next/navigation";

import { CursorProvider } from "@/components/providers/cursor-provider";
import { PageTransitionProvider } from "@/components/providers/page-transition-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

function LightLayer({ className = "" }: { className?: string }) {
  const fullClassName = className ? `global-light-layer ${className}` : "global-light-layer";

  return (
    <div aria-hidden="true" className={fullClassName}>
      <span className="global-light-layer__orb global-light-layer__orb--primary" />
      <span className="global-light-layer__orb global-light-layer__orb--secondary" />
      <span className="global-light-layer__orb global-light-layer__orb--tertiary" />
    </div>
  );
}

export function RootExperience({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showForegroundLight = false;
  const showBackdropLight = pathname === "/our-partners" || pathname.endsWith("/our-partners");

  return (
    <PageTransitionProvider>
      <SmoothScrollProvider>
        <div className="experience-root">
          {showBackdropLight ? <LightLayer className="global-light-layer--backdrop" /> : null}
          <div className="experience-content">
            <CursorProvider>{children}</CursorProvider>
          </div>
          {showForegroundLight ? <LightLayer className="global-light-layer--foreground" /> : null}
        </div>
      </SmoothScrollProvider>
    </PageTransitionProvider>
  );
}
