"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { clamp } from "@/lib/utils";

type CursorLabel = "View" | "Open" | "";
type CursorMode = "default" | "hover" | "active";

type CursorContextValue = {
  setForcedLabel: (label: CursorLabel) => void;
};

const CursorContext = createContext<CursorContextValue>({
  setForcedLabel: () => undefined,
});

function resolveCursorState(target: EventTarget | null): {
  label: CursorLabel;
  mode: CursorMode;
} {
  if (!(target instanceof Element)) {
    return { label: "", mode: "default" };
  }

  const interactive = target.closest<HTMLElement>("[data-cursor-label], a, button");

  if (!interactive) {
    return { label: "", mode: "default" };
  }

  const datasetLabel = interactive.dataset.cursorLabel as CursorLabel | undefined;
  const label = datasetLabel ?? (interactive.tagName === "A" ? "Open" : "View");
  return { label, mode: "hover" };
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const orbRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const initializedRef = useRef(false);
  const frameRef = useRef(0);
  const lastMoveAtRef = useRef(0);
  const modeRef = useRef<CursorMode>("default");
  const labelValueRef = useRef<CursorLabel>("");
  const forcedLabelRef = useRef<CursorLabel>("");
  const [forcedLabel, setForcedLabel] = useState<CursorLabel>("");
  const [cursorMode, setCursorMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState<CursorLabel>("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) {
      return;
    }

    setEnabled(true);

    const setModeIfChanged = (nextMode: CursorMode) => {
      if (modeRef.current === nextMode) {
        return;
      }

      modeRef.current = nextMode;
      setCursorMode(nextMode);
    };

    const setLabelIfChanged = (nextLabel: CursorLabel) => {
      if (labelValueRef.current === nextLabel) {
        return;
      }

      labelValueRef.current = nextLabel;
      setLabel(nextLabel);
    };

    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.34;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.34;

      const orb = orbRef.current;

      if (orb) {
        orb.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0) translate(-50%, -50%) scale(var(--cursor-scale, 1))`;
      }

      const dx = Math.abs(targetRef.current.x - currentRef.current.x);
      const dy = Math.abs(targetRef.current.y - currentRef.current.y);
      const idleFor = performance.now() - lastMoveAtRef.current;

      if (idleFor > 120 && dx < 0.1 && dy < 0.1) {
        frameRef.current = 0;
        return;
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    const ensureTicking = () => {
      if (frameRef.current) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    const handleMove = (event: MouseEvent) => {
      lastMoveAtRef.current = performance.now();
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;

      if (!initializedRef.current) {
        currentRef.current.x = event.clientX;
        currentRef.current.y = event.clientY;
        initializedRef.current = true;
      }

      ensureTicking();

      const state = resolveCursorState(event.target);
      setModeIfChanged(state.mode);
      setLabelIfChanged(forcedLabelRef.current || state.label);
    };

    const handleOver = (event: MouseEvent) => {
      const state = resolveCursorState(event.target);
      setModeIfChanged(state.mode);
      setLabelIfChanged(forcedLabelRef.current || state.label);
    };

    const handleDown = () => {
      if (modeRef.current === "hover") {
        setModeIfChanged("active");
      }
    };

    const handleUp = (event: MouseEvent) => {
      const state = resolveCursorState(event.target);
      setModeIfChanged(state.mode);
      setLabelIfChanged(forcedLabelRef.current || state.label);
    };

    const handleLeave = () => {
      setModeIfChanged("default");
      setLabelIfChanged("");
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    forcedLabelRef.current = forcedLabel;
  }, [forcedLabel]);

  useEffect(() => {
    if (!labelRef.current) {
      return;
    }

    labelRef.current.style.opacity = label ? "1" : "0";
    labelRef.current.style.transform = `translateY(${label ? "0" : "8px"})`;
  }, [label]);

  const contextValue = useMemo(
    () => ({
      setForcedLabel: (nextLabel: CursorLabel) => {
        forcedLabelRef.current = nextLabel;
        setForcedLabel(nextLabel);
        setLabel(nextLabel);
      },
    }),
    [],
  );

  return (
    <CursorContext.Provider value={contextValue}>
      {children}
      {enabled ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-120 hidden md:block"
          style={{
            opacity: clamp(cursorMode === "default" ? 0.92 : 1, 0, 1),
          }}
        >
          <div
            ref={orbRef}
            className="cursor-orb"
            data-mode={cursorMode}
          >
            <span ref={labelRef} className="cursor-orb__label">
              {label}
            </span>
          </div>
        </div>
      ) : null}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
