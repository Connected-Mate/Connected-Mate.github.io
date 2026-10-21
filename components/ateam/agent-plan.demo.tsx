import { useEffect, useRef, useState } from "react";
import { AgentPlan, type AgentPlanStatus, type PlanStep } from "./agent-plan";

const proposal: PlanStep[] = [
  { id: "revenue", title: "Pull Q3 revenue and ARR", detail: "Monthly revenue, ARR and net retention", tool: "stripe.query" },
  { id: "launches", title: "Summarize product launches", detail: "Shipped projects and adoption", tool: "linear.search" },
  { id: "slides", title: "Build the KPI slides", detail: "Six charts in the board template", tool: "slides.create" },
  { id: "memo", title: "Draft the board memo", detail: "One page, wins, risks and asks", tool: "docs.write" },
  { id: "send", title: "Send the draft to Maya for review", tool: "gmail.draft" },
];

const STEP_MS = 2000;

export default function Demo() {
  const [steps, setSteps] = useState<PlanStep[]>(proposal);
  const [status, setStatus] = useState<AgentPlanStatus>("draft");
  const wrap = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const failedOnce = useRef(false);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const press = (label: string) =>
    Array.from(wrap.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])
      .find((b) => b.textContent?.trim() === label)
      ?.click();

  /** Runs the steps one by one from `index`; the slides step times out the first time */
  const runFrom = (index: number) => {
    setSteps((list) => list.map((s, i) => (i === index ? { ...s, status: "active" } : s)));
    at(STEP_MS, () => {
      const failed = stepsRef.current[index]?.id === "slides" && !failedOnce.current;
      setSteps((list) =>
        list.map((s, i) =>
          i === index
            ? failed
              ? { ...s, status: "failed", error: "Slides API timed out after 30s" }
              : { ...s, status: "done", error: undefined }
            : s,
        ),
      );
      if (failed) {
        failedOnce.current = true;
        at(2200, () => press("Retry from here"));
      } else if (index + 1 < proposal.length) runFrom(index + 1);
      else {
        setStatus("done");
        at(4200, () => press("Run again"));
      }
    });
  };

  // Draft: the reviewer moves "Draft the board memo" above the slides, then presses Run plan
  const story = () => {
    clear();
    failedOnce.current = false;
    setStatus("draft");
    setSteps(proposal.map((s) => ({ ...s })));
    at(1600, () =>
      setSteps((list) => {
        const next = list.slice();
        const [memo] = next.splice(3, 1);
        next.splice(2, 0, memo);
        return next;
      }),
    );
    at(3600, () => press("Run plan"));
  };

  useEffect(() => {
    story();
    return clear;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrap} style={{ width: "100%", display: "grid", placeItems: "center" }}>
      <AgentPlan
        title="Prepare the Q3 board update"
        estimate="~2 min"
        steps={steps}
        status={status}
        onChange={setSteps}
        onRun={(final) => {
          if (status === "done") return story();
          clear();
          setSteps(final.map((s) => ({ ...s, status: "pending", error: undefined })));
          setStatus("running");
          at(500, () => runFrom(0));
        }}
        onCancel={() => story()}
        onRetry={(id) => {
          const index = steps.findIndex((s) => s.id === id);
          setSteps((list) => list.map((s, i) => (i >= index ? { ...s, status: "pending", error: undefined } : s)));
          at(300, () => runFrom(index));
        }}
      />
    </div>
  );
}
