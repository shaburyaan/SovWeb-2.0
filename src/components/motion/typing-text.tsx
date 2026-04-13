"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type TypingTextProps = {
  text: string;
  className?: string;
  speed?: number;
  triggerKey?: string | number;
};

export function TypingText({
  text,
  className,
  speed = 42,
  triggerKey,
}: TypingTextProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");

    let index = 0;
    let timer = 0;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        index += 1;
        setValue(text.slice(0, index));

        if (index >= text.length) {
          window.clearInterval(timer);
        }
      }, speed);
    }, 40);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(start);
    };
  }, [speed, text, triggerKey]);

  return <span className={cn("typing-text", className)}>{value}</span>;
}
