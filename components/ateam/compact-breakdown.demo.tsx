import { useEffect, useRef, useState } from "react";
import { CompactBreakdown, type BreakdownItem } from "./compact-breakdown";

const PERIODS = [
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "90d", label: "90d" },
];

const DATA: Record<string, { items: BreakdownItem[]; delta: number }> = {
  "7d": {
    delta: 12.4,
    items: [
      { id: "direct", label: "Direct", value: 4210 },
      { id: "organic", label: "Organic search", value: 3980 },
      { id: "referrals", label: "Referrals", value: 2360 },
      { id: "social", label: "Social", value: 1840 },
      { id: "email", label: "Email", value: 1200 },
    ],
  },
  "30d": {
    delta: 8.1,
    items: [
      { id: "direct", label: "Direct", value: 16900 },
      { id: "organic", label: "Organic search", value: 18400 },
      { id: "referrals", label: "Referrals", value: 7300 },
      { id: "social", label: "Social", value: 9800 },
      { id: "email", label: "Email", value: 5200 },
    ],
  },
  "90d": {
    delta: -3.2,
    items: [
      { id: "direct", label: "Direct", value: 47600 },
      { id: "organic", label: "Organic search", value: 58300 },
      { id: "referrals", label: "Referrals", value: 21900 },
      { id: "social", label: "Social", value: 36400 },
    ],
  },
};

const ORDER = PERIODS.map((p) => p.id);

export default function Demo() {
  const [period, setPeriod] = useState("7d");
  const touched = useRef(false);

  // Tour the periods until someone picks one themselves.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (touched.current) return;
      setPeriod((current) => ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  const { items, delta } = DATA[period];
  return (
    <CompactBreakdown
      title="Revenue by channel"
      periods={PERIODS}
      period={period}
      onPeriodChange={(id) => {
        touched.current = true;
        setPeriod(id);
      }}
      items={items}
      delta={delta}
      format={(n) => `$${Math.round(n).toLocaleString("en-US")}`}
      totalLabel="Total revenue"
    />
  );
}
