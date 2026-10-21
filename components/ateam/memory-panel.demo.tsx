"use client";

import { useEffect, useRef, useState } from "react";
import { MemoryPanel, type Memory } from "./memory-panel";

const MEMORIES: Memory[] = [
  { id: "ts", text: "Prefers TypeScript examples over plain JavaScript", category: "Preferences", source: "From chat", date: "Oct 12" },
  { id: "short", text: "Likes short answers first, details only when asked", category: "Preferences", source: "You added", date: "Oct 2", paused: true },
  { id: "grid", text: "Designs with Inter and a 4px spacing grid", category: "Preferences", source: "From Figma", date: "Oct 7" },
  { id: "role", text: "Product designer and front-end developer at a small studio", category: "Work", source: "From chat", date: "Sep 28" },
  { id: "stack", text: "Ships with React, Vite and Tailwind; deploys on Vercel", category: "Work", source: "From chat", date: "Oct 3" },
  { id: "notes", text: "Sends release notes to clients every Friday", category: "Work", source: "From chat", date: "Oct 9" },
  { id: "fintech", text: "Redesigning the onboarding flow for a fintech client, due Oct 24", category: "Projects", source: "From chat", date: "Oct 11" },
  { id: "tokens", text: "Keeps design tokens in one tokens.json shared with the code", category: "Projects", source: "From chat", date: "Oct 5" },
];

// What the preview plays, as a person would do it, until someone takes over.
type Step = { wait: number; run: (root: HTMLElement) => void };
const click = (root: HTMLElement, selector: string) => root.querySelector<HTMLElement>(selector)?.click();
const chip = (root: HTMLElement, name: string) =>
  Array.from(root.querySelectorAll<HTMLElement>(".ui-at-mem__chips [role=radio]"))
    .find((b) => b.textContent?.startsWith(name))
    ?.click();

const SCRIPT: Step[] = [
  { wait: 1400, run: (r) => click(r, '[data-memory-id="ts"] [data-act="forget"]') },
  { wait: 2600, run: (r) => Array.from(r.querySelectorAll<HTMLElement>(".ui-at-mem__tray-btn")).find((b) => b.textContent?.includes("Undo"))?.click() },
  { wait: 1600, run: (r) => chip(r, "Projects") },
  { wait: 1800, run: (r) => chip(r, "All") },
  { wait: 1400, run: (r) => click(r, '[data-memory-id="short"] [data-act="pause"]') },
  { wait: 1600, run: (r) => click(r, '[data-memory-id="short"] [data-act="pause"]') },
];

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const [autoplay, setAutoplay] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    const s = SCRIPT[step]!;
    const t = setTimeout(() => {
      if (ref.current) s.run(ref.current);
      setStep((i) => (i + 1) % SCRIPT.length);
    }, s.wait);
    return () => clearTimeout(t);
  }, [step, autoplay]);

  // Real clicks and keys stop the loop; the panel is then the visitor's.
  const takeOver = (e: { isTrusted: boolean }) => {
    if (e.isTrusted) setAutoplay(false);
  };

  return (
    <div
      ref={ref}
      style={{ width: "100%", maxWidth: 380 }}
      onPointerDownCapture={takeOver}
      onKeyDownCapture={takeOver}
    >
      <MemoryPanel memories={MEMORIES} maxHeight={330} />
    </div>
  );
}
