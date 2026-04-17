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
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

type PageTransitionContextValue = {
  navigate: (href: string) => void;
  prefetch: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigate: () => undefined,
  prefetch: () => undefined,
});

const PUSH_DELAY_MS = 420;
const SETTLE_DELAY_MS = 780;
const FAILSAFE_RESET_MS = 2200;

function normalizeTransitionPath(value: string | null | undefined) {
  const cleaned = (value ?? "").split(/[?#]/, 1)[0]?.trim() ?? "";

  if (!cleaned || cleaned === "/") {
    return "/";
  }

  return cleaned.replace(/\/+$/, "") || "/";
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [stage, setStage] = useState<"idle" | "out" | "in">("idle");
  const pushTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const failsafeTimerRef = useRef<number | null>(null);
  const targetHrefRef = useRef<string | null>(null);

  const clearTimer = (timerRef: { current: number | null }) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearTimers = useCallback(() => {
    clearTimer(pushTimerRef);
    clearTimer(settleTimerRef);
    clearTimer(failsafeTimerRef);
  }, []);

  const resetTransition = useCallback(() => {
    clearTimers();
    targetHrefRef.current = null;
    setStage("idle");
  }, [clearTimers]);

  const navigate = useCallback(
    (href: string) => {
      const normalizedHref = normalizeTransitionPath(href);
      const normalizedPathname = normalizeTransitionPath(pathname);

      if (!normalizedHref || normalizedHref === normalizedPathname || targetHrefRef.current) {
        return;
      }

      targetHrefRef.current = normalizedHref;
      setStage("out");
      clearTimers();
      pushTimerRef.current = window.setTimeout(() => {
        router.push(href);
      }, PUSH_DELAY_MS);
      failsafeTimerRef.current = window.setTimeout(() => {
        resetTransition();
      }, FAILSAFE_RESET_MS);
    },
    [clearTimers, pathname, resetTransition, router],
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
      setStage("idle");
      return;
    }

    setStage("in");
    clearTimer(settleTimerRef);
    settleTimerRef.current = window.setTimeout(() => {
      resetTransition();
    }, SETTLE_DELAY_MS);

    return () => clearTimer(settleTimerRef);
  }, [pathname, resetTransition]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

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
      {stage !== "idle" ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-110 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage === "out" ? 1 : 0 }}
          transition={{ duration: stage === "out" ? 0.36 : 0.54, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-0 bg-black/84 backdrop-blur-[28px]"
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={
              stage === "out"
                ? { scaleY: 1, transformOrigin: "top" }
                : { scaleY: 0, transformOrigin: "bottom" }
            }
            transition={{ duration: stage === "out" ? 0.56 : 0.62, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-[10vw] bottom-[11vh] h-px bg-[rgba(214,176,106,0.42)]"
            initial={{ scaleX: 0, x: "-10%", opacity: 0 }}
            animate={
              stage === "out"
                ? { scaleX: 1, x: 0, opacity: 1 }
                : { scaleX: 0.72, x: "8%", opacity: 0 }
            }
            transition={{ duration: stage === "out" ? 0.62 : 0.46, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      ) : null}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(PageTransitionContext);
}
