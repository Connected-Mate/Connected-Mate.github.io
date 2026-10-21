import { useEffect, useRef, useState } from "react";
import { AgentSteering, type SteerNote, type SteerRunStatus, type SteerStep } from "./agent-steering";

const NOTE_1 = "Use Postgres 16 syntax – prod isn't on 17 yet";
const NOTE_2 = "Keep the old users view for a week";
const LOOP_MS = 25_000;

function startSteps(now: number): SteerStep[] {
  return [
    { id: "read", title: "Read schema and 14 migrations", status: "done", duration: 1400 },
    { id: "plan", title: "Plan the split into accounts and profiles", status: "active", startedAt: now },
    { id: "write", title: "Write migration 0042_split_users", status: "pending" },
    { id: "dry", title: "Dry run on staging", status: "pending" },
    { id: "pr", title: "Open a pull request for review", status: "pending" },
  ];
}

export default function Demo() {
  const [steps, setSteps] = useState<SteerStep[]>(() => startSteps(Date.now()));
  const [queue, setQueue] = useState<SteerNote[]>([]);
  const [status, setStatus] = useState<SteerRunStatus>("running");
  const [startedAt, setStartedAt] = useState(() => Date.now() - 124_000);
  const [draft, setDraft] = useState("");
  const queueRef = useRef(queue);
  queueRef.current = queue;
  const timers = useRef<number[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const seq = useRef(0);

  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  /** Types `text` into the field, then presses Enter once the last letter has rendered */
  const type = (from: number, text: string) => {
    for (let i = 1; i <= text.length; i++)
      at(from + i * 32, () => {
        setDraft(text.slice(0, i));
        if (i === text.length) at(350, pressEnter);
      });
    return from + text.length * 32;
  };
  const pressEnter = () => {
    const field = wrap.current?.querySelector("textarea");
    field?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  };

  /** The agent starts the step at `index`, taking every queued note in */
  const advance = (index: number, rename?: string) => {
    const now = Date.now();
    const taken = queueRef.current.map((n) => ({ ...n, picked: "next" as const }));
    setSteps((list) =>
      list.map((s, i) => {
        if (s.status === "active") return { ...s, status: "done", duration: now - Number(s.startedAt ?? now) };
        if (i === index) return { ...s, title: rename ?? s.title, status: "active", startedAt: now, notes: [...(s.notes ?? []), ...taken] };
        return s;
      }),
    );
    setQueue([]);
  };
  const finish = () => {
    const now = Date.now();
    setSteps((list) => list.map((s) => (s.status === "active" ? { ...s, status: "done", duration: now - Number(s.startedAt ?? now) } : s)));
    setStatus("done");
  };

  const story = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    const now = Date.now();
    setSteps(startSteps(now));
    setQueue([]);
    setDraft("");
    setStatus("running");
    setStartedAt(now - 124_000);

    let t = type(1000, NOTE_1);
    at(t + 2600, () => advance(2, "Write migration 0042 for Postgres 16"));
    t = type(t + 4000, NOTE_2);
    at(t + 2000, () =>
      wrap.current
        ?.querySelectorAll<HTMLButtonElement>("button")
        .forEach((b) => b.textContent?.trim() === "Now" && b.click()),
    );
    at(t + 6500, () => advance(3));
    at(t + 8500, () => advance(4));
    at(t + 10000, finish);
    at(LOOP_MS, story);
  };

  useEffect(() => {
    story();
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrap} style={{ width: "100%", display: "grid", placeItems: "center" }}>
      <AgentSteering
        title="Migrate users table"
        agent="Opus 5.5"
        steps={steps}
        queue={queue}
        status={status}
        startedAt={startedAt}
        draft={draft}
        onDraftChange={setDraft}
        onQueue={(text) => setQueue((q) => [...q, { id: `note-${++seq.current}`, text }])}
        onInterrupt={(text, queuedId) => {
          const id = queuedId ?? `note-${++seq.current}`;
          if (queuedId) setQueue((q) => q.filter((n) => n.id !== queuedId));
          setSteps((list) =>
            list.map((s) =>
              s.status === "active"
                ? { ...s, startedAt: Date.now(), notes: [...(s.notes ?? []), { id, text, picked: "now" }] }
                : s,
            ),
          );
        }}
        onRemove={(id) => setQueue((q) => q.filter((n) => n.id !== id))}
        onPause={() => setStatus("paused")}
        onResume={() => setStatus("running")}
      />
    </div>
  );
}
