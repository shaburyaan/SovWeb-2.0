"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { usePageTransition } from "@/components/providers/page-transition-provider";

type TransitionLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    cursorLabel?: "View" | "Open";
  };

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, className, cursorLabel = "Open", onClick, onMouseEnter, ...props }, ref) => {
    const hrefValue = typeof href === "string" ? href : href.toString();
    const router = useRouter();
    const { navigate, prefetch } = usePageTransition();

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className)}
        data-cursor-label={cursorLabel}
        onClick={(event) => {
          onClick?.(event);

          if (
            event.defaultPrevented ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            props.target === "_blank" ||
            !hrefValue.startsWith("/")
          ) {
            return;
          }

          event.preventDefault();
          navigate(hrefValue);
        }}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          prefetch(hrefValue);
          router.prefetch(hrefValue);
        }}
        {...props}
      />
    );
  },
);

TransitionLink.displayName = "TransitionLink";
