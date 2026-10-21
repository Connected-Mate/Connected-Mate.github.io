"use client";

import { useEffect, useRef, useState } from "react";
import { AutonomyDial, type AgentAction, type AutonomyLevel } from "./autonomy-dial";

/* Generic marks drawn for the demo – no brand logos. */
const svg = { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const DocIcon = () => (
  <svg {...svg}>
    <path d="M4.25 2.25h5l2.5 2.5v9h-7.5z" />
    <path d="M6.25 7.5h3.5M6.25 10h3.5" />
  </svg>
);
const DraftIcon = () => (
  <svg {...svg}>
    <path d="M10.5 2.75 13.25 5.5 6 12.75H3.25V10z" />
  </svg>
);
const CrmIcon = () => (
  <svg {...svg}>
    <circle cx="6" cy="6" r="2.25" />
    <path d="M2.25 13c.5-2 1.9-3.25 3.75-3.25S9.25 11 9.75 13M10.5 4.5h3.25M10.5 7h3.25M11.5 9.5h2.25" />
  </svg>
);
const SendIcon = () => (
  <svg {...svg}>
    <path d="M13.75 2.25 7 9M13.75 2.25 9.5 13.75 7 9 2.25 6.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg {...svg}>
    <path d="M2.75 4.25h10.5M6.25 4.25V2.75h3.5v1.5M4.25 4.25l.6 9h6.3l.6-9" />
  </svg>
);
const CardIcon = () => (
  <svg {...svg}>
    <rect x="2" y="3.75" width="12" height="8.5" rx="1.75" />
    <path d="M2 6.5h12M4.5 9.75h2" />
  </svg>
);

const ACTIONS: AgentAction[] = [
  { id: "read", label: "Read files and docs", risk: "safe", icon: <DocIcon /> },
  { id: "draft", label: "Draft emails", risk: "safe", icon: <DraftIcon /> },
  { id: "crm", label: "Update CRM records", risk: "risky", icon: <CrmIcon /> },
  { id: "send", label: "Send emails", risk: "risky", icon: <SendIcon /> },
  { id: "delete", label: "Delete files", risk: "destructive", icon: <TrashIcon /> },
  { id: "spend", label: "Spend money", risk: "destructive", icon: <CardIcon /> },
];

// The loop the preview plays until someone takes over.
const SCRIPT: { level: AutonomyLevel; pinned: string[] }[] = [
  { level: 1, pinned: ["spend"] },
  { level: 2, pinned: ["spend"] },
  { level: 2, pinned: ["spend", "delete"] },
  { level: 0, pinned: ["spend", "delete"] },
  { level: 1, pinned: ["spend", "delete"] },
  { level: 1, pinned: ["spend"] },
];

export default function Demo() {
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<AutonomyLevel>(SCRIPT[0]!.level);
  const [pinned, setPinned] = useState<string[]>(SCRIPT[0]!.pinned);
  const [autoplay, setAutoplay] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => {
      const next = (step + 1) % SCRIPT.length;
      setStep(next);
      setLevel(SCRIPT[next]!.level);
      setPinned(SCRIPT[next]!.pinned);
    }, 1600);
    return () => clearTimeout(t);
  }, [step, autoplay]);

  // As soon as someone touches the dial, the loop stops and the dial is theirs.
  const takeOver = () => setAutoplay(false);

  return (
    <div
      ref={wrap}
      style={{ width: "100%", maxWidth: 400 }}
      onPointerDownCapture={takeOver}
      onKeyDownCapture={takeOver}
    >
      <AutonomyDial
        title="Sales agent"
        actions={ACTIONS}
        level={level}
        onLevelChange={setLevel}
        pinned={pinned}
        onPinnedChange={setPinned}
      />
    </div>
  );
}
