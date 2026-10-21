import { useEffect, useRef, useState } from "react";
import { UsageMeter, type UsageDay, type UsageLimit, type UsagePart } from "./usage-meter";

const PERIODS = [
  { id: "month", label: "This month" },
  { id: "last", label: "Last month" },
  { id: "7d", label: "7 days" },
];

const MONTH = [312, 388, 402, 330, 346, 260, 268, 384, 390, 356, 362, 280, 262, 360, 398, 408, 372, 352, 312, 300];
const LAST = [210, 352, 360, 330, 338, 248, 240, 362, 362, 340, 340, 252, 234, 360, 368, 354, 346, 352, 298, 286, 386, 340, 392, 368, 330, 290, 312, 330];

const days = (values: (number | null)[], from: number): UsageDay[] =>
  values.map((value, index) => ({ label: `Oct ${from + index}`, value }));

const DATA: Record<string, { used: UsagePart[]; limits: UsageLimit[]; daily: UsageDay[] }> = {
  month: {
    used: [
      { label: "Chat", value: 3980 },
      { label: "Search", value: 1640 },
      { label: "Image", value: 1120 },
      { label: "API", value: 680 },
    ],
    limits: [
      { label: "Seats", used: 8, total: 10 },
      { label: "Storage", used: 3.2, total: 5, unit: "GB" },
      { label: "Projects", used: 12, total: null },
    ],
    daily: days([...MONTH.slice(0, 22), ...Array(9).fill(null)], 1),
  },
  last: {
    used: [
      { label: "Chat", value: 5210 },
      { label: "Search", value: 2140 },
      { label: "Image", value: 1690 },
      { label: "API", value: 960 },
    ],
    limits: [
      { label: "Seats", used: 10, total: 10 },
      { label: "Storage", used: 2.9, total: 5, unit: "GB" },
      { label: "Projects", used: 11, total: null },
    ],
    daily: days(LAST, 1),
  },
  "7d": {
    used: [
      { label: "Chat", value: 1180 },
      { label: "Search", value: 560 },
      { label: "API", value: 400 },
    ],
    limits: [
      { label: "Seats", used: 8, total: 10 },
      { label: "Storage", used: 3.2, total: 5, unit: "GB" },
      { label: "Projects", used: 12, total: null },
    ],
    daily: days([298, 334, 312, 286, 302, 318, 290], 16),
  },
};

const TOUR = ["month", "last", "7d", "month"];

export default function Demo() {
  const [period, setPeriod] = useState("month");
  const touched = useRef(false);
  const [resetAt] = useState(() => Date.now() + 8.5 * 86_400_000);

  // One tour through the periods on first view, then it waits for people.
  useEffect(() => {
    const timers = TOUR.slice(1).map((id, index) =>
      window.setTimeout(() => {
        if (!touched.current) setPeriod(id);
      }, 3000 * (index + 1)),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const data = DATA[period];
  return (
    <UsageMeter
      title="Acme AI"
      plan="Pro plan"
      total={10000}
      used={data.used}
      limits={data.limits}
      daily={data.daily}
      periods={PERIODS}
      period={period}
      onPeriodChange={(id) => {
        touched.current = true;
        setPeriod(id);
      }}
      resetAt={resetAt}
      onUpgrade={() => undefined}
    />
  );
}
