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
  const frameRef = useRef(0);
  const [forcedLabel, setForcedLabel] = useState<CursorLabel>("");
  const [cursorMode, setCursorMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState<CursorLabel>("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    setEnabled(true);

    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.18;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.18;

      const orb = orbRef.current;

      if (orb) {
        orb.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    const handleMove = (event: MouseEvent) => {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;

      const state = resolveCursorState(event.target);
      setCursorMode(state.mode);
      setLabel(forcedLabel || state.label);
    };

    const handleOver = (event: MouseEvent) => {
      const state = resolveCursorState(event.target);
      setCursorMode(state.mode);
      setLabel(forcedLabel || state.label);
    };

    const handleDown = () => {
      setCursorMode((mode) => (mode === "hover" ? "active" : mode));
    };

    const handleUp = (event: MouseEvent) => {
      const state = resolveCursorState(event.target);
      setCursorMode(state.mode);
      setLabel(forcedLabel || state.label);
    };

    const handleLeave = () => {
      setCursorMode("default");
      setLabel("");
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(frameRef.current);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseleave", handleLeave);
    };
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
          className="pointer-events-none fixed inset-0 z-[120] hidden md:block"
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
