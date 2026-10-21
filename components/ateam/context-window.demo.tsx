"use client";

import { useEffect, useRef, useState } from "react";
import { ContextWindow, type ContextPart } from "./context-window";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const START: ContextPart[] = [
  { id: "system", label: "System prompt", tokens: 4200, locked: true },
  { id: "tools", label: "Tools", tokens: 12800 },
  {
    id: "files",
    label: "Files",
    items: [
      { id: "schema", label: "schema.prisma", tokens: 9400 },
      { id: "billing", label: "billing.ts", tokens: 21300 },
      { id: "notes", label: "meeting-notes.md", tokens: 15400 },
    ],
  },
  { id: "chat", label: "Conversation", tokens: 108600, compact: true },
  { id: "memory", label: "Memory", tokens: 3900 },
];

function ModelMark() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round">
      <path d="M6 1.5v9M1.5 6h9M2.8 2.8l6.4 6.4M9.2 2.8 2.8 9.2" />
    </svg>
  );
}

// What the preview plays, as a person would do it, until someone takes over.
type Step = { wait: number; run: (root: HTMLElement, reset: () => void) => void };
const press = (root: HTMLElement, selector: string) => root.querySelector<HTMLElement>(selector)?.click();
const SCRIPT: Step[] = [
  { wait: 1500, run: (r) => press(r, 'button[aria-controls$="items-files"]') },
  { wait: 1300, run: (r) => press(r, 'button[aria-label="Remove schema.prisma"]') },
  { wait: 1500, run: (r) => press(r, 'button[aria-label="Compact Conversation"]') },
  { wait: 4200, run: (r) => press(r, 'button[aria-controls$="items-files"]') },
  { wait: 2200, run: (_, reset) => reset() },
];

export default function Demo() {
  const [parts, setParts] = useState<ContextPart[]>(START);
  const [autoplay, setAutoplay] = useState(true);
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoplay) return;
    const s = SCRIPT[step]!;
    const t = setTimeout(() => {
      if (ref.current) s.run(ref.current, () => setParts(START));
      setStep((i) => (i + 1) % SCRIPT.length);
    }, s.wait);
    return () => clearTimeout(t);
  }, [step, autoplay]);

  const takeOver = (e: { isTrusted: boolean }) => {
    if (e.isTrusted) setAutoplay(false);
  };

  return (
    <div ref={ref} style={{ width: "100%", maxWidth: 360 }} onPointerDownCapture={takeOver} onKeyDownCapture={takeOver}>
      <ContextWindow
        limit={200_000}
        model="claude-sonnet-5-5"
        modelIcon={<ModelMark />}
        parts={parts}
        onRemoveItem={(partId, itemId) =>
          setParts((ps) =>
            ps.map((p) => (p.id === partId ? { ...p, items: p.items?.filter((i) => i.id !== itemId) } : p)),
          )
        }
        onCompact={async (partId) => {
          await wait(1400);
          setParts((ps) => ps.map((p) => (p.id === partId ? { ...p, tokens: 30400 } : p)));
        }}
        action={{ label: "New chat", onClick: () => setParts(START) }}
      />
    </div>
  );
}
