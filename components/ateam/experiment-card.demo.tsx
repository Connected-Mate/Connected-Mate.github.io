import { useEffect, useRef, useState } from "react";
import { ExperimentCard, type ExperimentMetric, type ExperimentVariant } from "./experiment-card";

const metrics: ExperimentMetric[] = [
  { id: "conversion", label: "Conversion", format: (n) => `${n.toFixed(1)}%` },
  { id: "revenue", label: "Revenue", format: (n) => `$${n.toFixed(2)}` },
  { id: "bounce", label: "Bounce", format: (n) => `${n.toFixed(1)}%`, lowerIsBetter: true },
];

const variants: ExperimentVariant[] = [
  {
    id: "a",
    key: "A",
    name: "Start free trial",
    control: true,
    visitors: 4790,
    values: { conversion: 4.2, revenue: 18.4, bounce: 38.2 },
  },
  {
    id: "b",
    key: "B",
    name: "Try it free",
    visitors: 4812,
    values: { conversion: 4.7, revenue: 19.1, bounce: 36.4 },
    confidence: { conversion: 96, revenue: 81, bounce: 88 },
  },
  {
    id: "c",
    key: "C",
    name: "Get started – $0",
    visitors: 4776,
    values: { conversion: 4.0, revenue: 21.6, bounce: 41.5 },
    confidence: { conversion: 64, revenue: 93, bounce: 90 },
  },
];

// The tour: open, step through the metrics, close, start again – until someone takes over.
const TOUR: { at: number; open: boolean; metric: string }[] = [
  { at: 900, open: true, metric: "conversion" },
  { at: 3100, open: true, metric: "revenue" },
  { at: 5300, open: true, metric: "bounce" },
  { at: 7500, open: true, metric: "conversion" },
  { at: 9000, open: false, metric: "conversion" },
];
const LOOP_MS = 11500;

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [metric, setMetric] = useState("conversion");
  const [winner, setWinner] = useState<string | null>(null);
  const touched = useRef(false);

  useEffect(() => {
    let timers: number[] = [];
    const run = () => {
      timers = TOUR.map((step) =>
        window.setTimeout(() => {
          if (touched.current) return;
          setOpen(step.open);
          setMetric(step.metric);
        }, step.at),
      );
    };
    run();
    const loop = window.setInterval(() => {
      if (!touched.current) run();
    }, LOOP_MS);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearInterval(loop);
    };
  }, []);

  const takeOver = () => {
    touched.current = true;
  };

  return (
    <div onPointerDown={takeOver} onPointerEnter={takeOver} onKeyDown={takeOver} onFocus={takeOver} style={{ width: "100%", maxWidth: 340 }}>
      <ExperimentCard
        title="Signup button copy"
        status={{ label: "Running", tone: "green" }}
        note="Day 9 of 14"
        metrics={metrics}
        variants={variants}
        open={open}
        onOpenChange={setOpen}
        metric={metric}
        onMetricChange={setMetric}
        winner={winner}
        onWinnerChange={setWinner}
        action={{ label: (v) => `Ship ${v.key}`, onClick: () => undefined }}
      />
    </div>
  );
}
