"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

type PageTransitionContextValue = {
  navigate: (href: string) => void;
  prefetch: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigate: () => undefined,
  prefetch: () => undefined,
});

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [stage, setStage] = useState<"idle" | "out" | "in">("in");
  const timerRef = useRef<number | null>(null);
  const targetHrefRef = useRef<string | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const navigate = useCallback(
    (href: string) => {
      if (!href || href === pathname || targetHrefRef.current) {
        return;
      }

      targetHrefRef.current = href;
      setStage("out");
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        router.push(href);
      }, 420);
    },
    [pathname, router],
  );

  const prefetch = useCallback(
    (href: string) => {
      if (!href.startsWith("/")) {
        return;
      }

      router.prefetch(href);
    },
    [router],
  );

  useEffect(() => {
    if (!targetHrefRef.current) {
      setStage("in");
      return;
    }

    if (pathname !== targetHrefRef.current) {
      return;
    }

    setStage("in");
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      targetHrefRef.current = null;
      setStage("idle");
    }, 780);

    return clearTimer;
  }, [pathname]);

  const value = useMemo(
    () => ({
      navigate,
      prefetch,
    }),
    [navigate, prefetch],
  );

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <AnimatePresence mode="wait">
        {stage !== "idle" ? (
          <motion.div
            key={stage}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[110] overflow-hidden"
            initial={{ opacity: stage === "out" ? 0 : 1 }}
            animate={{ opacity: stage === "out" ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: stage === "out" ? 0.42 : 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              initial={{ scaleY: stage === "out" ? 0 : 1, transformOrigin: "top" }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0, transformOrigin: "bottom" }}
              transition={{ duration: 0.64, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="absolute inset-x-[12vw] bottom-[12vh] h-px bg-white/30"
              initial={{ scaleX: 0, x: "-8%" }}
              animate={{ scaleX: 1, x: 0 }}
              exit={{ scaleX: 0, x: "8%" }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(PageTransitionContext);
}
