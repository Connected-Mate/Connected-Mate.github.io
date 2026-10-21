"use client";

import { useEffect, useState } from "react";
import {
  PermissionRequest,
  type PermissionDecision,
  type PermissionScope,
} from "./permission-request";

/* Marks drawn for the demo – generic, no brand logos. */
const svg = { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const CodeMark = () => (
  <svg {...svg}>
    <path d="m5.5 4.75-3.25 3.25 3.25 3.25M10.5 4.75l3.25 3.25-3.25 3.25" />
  </svg>
);
const MailMark = () => (
  <svg {...svg}>
    <rect x="2.25" y="3.5" width="11.5" height="9" rx="2" />
    <path d="m2.75 4.75 5.25 4 5.25-4" />
  </svg>
);
const SparkMark = () => (
  <svg {...svg}>
    <path d="M8 2.5c.4 2.7 1.8 4.1 4.5 4.5-2.7.4-4.1 1.8-4.5 4.5C7.6 8.8 6.2 7.4 3.5 7c2.7-.4 4.1-1.8 4.5-4.5Z" />
  </svg>
);
const RepoMark = () => (
  <svg {...svg}>
    <path d="M4 2.75h7.25v8.5H4.75A1.25 1.25 0 0 0 3.5 12.5V3.25c0-.28.22-.5.5-.5Z" />
    <path d="M3.5 12.5c0 .7.56 1.25 1.25 1.25h6.5v-2.5" />
  </svg>
);
const CardMark = () => (
  <svg {...svg}>
    <rect x="2" y="3.75" width="12" height="8.5" rx="1.75" />
    <path d="M2 6.5h12" />
  </svg>
);
const PersonMark = () => (
  <svg {...svg}>
    <circle cx="8" cy="5.75" r="2.5" />
    <path d="M3.5 13.25c.6-2.2 2.4-3.5 4.5-3.5s3.9 1.3 4.5 3.5" />
  </svg>
);
const RocketMark = () => (
  <svg {...svg}>
    <path d="M9.5 2.75c2 0 3.75 1.75 3.75 3.75L8.5 11.25 4.75 7.5z" />
    <path d="m5.5 10.5-2.75 2.75M4.75 7.5 2.75 7l1.5-1.75h2.5M8.5 11.25l.5 2 1.75-1.5v-2.5" />
  </svg>
);
const ReceiptMark = () => (
  <svg {...svg}>
    <path d="M4 2.25h8v11.5l-2-1.25-2 1.25-2-1.25-2 1.25z" />
    <path d="M6 5.5h4M6 8h4" />
  </svg>
);

const Diff = ({ plus, minus }: { plus: number; minus: number }) => (
  <span>
    <span style={{ color: "var(--plus)" }}>+{plus}</span> <span style={{ color: "var(--minus)" }}>−{minus}</span>
  </span>
);

const MIN = 60000;
const START = new Date(2026, 9, 21, 14, 45).getTime();

type Slot = { visible: boolean; scope: PermissionScope; decision: PermissionDecision | null };
const fresh = (scope: PermissionScope = "once"): Slot => ({ visible: false, scope, decision: null });

export default function Demo() {
  // A demo clock that runs fast, so an hour-long grant drains in a few seconds.
  const [clock, setClock] = useState(START);
  const [fast, setFast] = useState(false);
  const [a, setA] = useState<Slot>({ ...fresh(), visible: true });
  const [b, setB] = useState<Slot>(fresh());
  const [c, setC] = useState<Slot>(fresh());

  useEffect(() => {
    if (!fast) return;
    const t = setInterval(() => setClock((n) => n + 3 * MIN), 250);
    return () => clearInterval(t);
  }, [fast]);

  useEffect(() => {
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(() => alive && fn(), ms));
    let now = START;
    const run = () => {
      now = START;
      setClock(START);
      setFast(false);
      setA({ ...fresh(), visible: true });
      setB(fresh());
      setC(fresh());
      at(1000, () => setA((s) => ({ ...s, scope: "timed" })));
      at(2000, () => {
        setA((s) => ({ ...s, decision: { allow: true, scope: "timed", at: now, until: now + 60 * MIN } }));
        setFast(true);
      });
      at(2800, () => setB((s) => ({ ...s, visible: true })));
      at(6200, () => setB((s) => ({ ...s, decision: { allow: false, scope: "once", at: now } })));
      at(7000, () => setC((s) => ({ ...s, visible: true })));
      at(9600, () => setC((s) => ({ ...s, decision: { allow: true, scope: "once", at: START + 60 * MIN } })));
      at(12600, run);
    };
    run();
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  // Stop the fast clock once no timed grant is running any more.
  const running = [a, b, c].some((s) => s.decision?.allow && s.decision.until !== undefined && clock < s.decision.until);
  useEffect(() => {
    if (fast && !running) setFast(false);
  }, [fast, running]);

  const view = (slot: Slot, set: (fn: (s: Slot) => Slot) => void) => ({
    scope: slot.scope,
    onScopeChange: (scope: PermissionScope) => set((s) => ({ ...s, scope })),
    decision: slot.decision,
    onDecisionChange: (d: PermissionDecision | null) => {
      set((s) => ({ ...s, decision: d }));
      if (d?.allow && d.until !== undefined) setFast(true);
    },
    now: clock,
  });

  return (
    <div style={{ width: "100%", maxWidth: 400, display: "grid", gap: 12 }}>
      {a.visible && (
        <PermissionRequest
          agent={{ name: "Coder", model: "Code model", avatar: <CodeMark /> }}
          action="push to main"
          target="acme/web"
          toolIcon={<RepoMark />}
          risk="risky"
          reason="The fix for the flaky checkout test passed review and all 214 checks."
          preview={[
            { id: "cart", label: "src/checkout/cart.ts", meta: <Diff plus={12} minus={4} /> },
            { id: "spec", label: "tests/checkout.spec.ts", meta: <Diff plus={31} minus={2} /> },
            { id: "deploy", label: "Deploys to production after the merge", icon: <RocketMark /> },
          ]}
          {...view(a, setA)}
        />
      )}
      {b.visible && (
        <PermissionRequest
          agent={{ name: "Sales agent", avatar: <MailMark /> }}
          action="send 40 emails"
          target="Mail · to customers"
          toolIcon={<MailMark />}
          risk="risky"
          reason="Follow-ups for everyone who started a trial last week and hasn't logged in since."
          previewTitle="Recipients"
          preview={[
            { id: "1", label: "anna.berg@northwind.com", meta: "Trial ends Fri", icon: <PersonMark /> },
            { id: "2", label: "j.chen@lumen.io", meta: "Trial ends Sat", icon: <PersonMark /> },
            { id: "3", label: "maria@acme-retail.co", meta: "Trial ends Sat", icon: <PersonMark /> },
            ...Array.from({ length: 37 }, (_, i) => ({ id: `r${i + 4}`, label: `customer-${i + 4}@example.com` })),
          ]}
          {...view(b, setB)}
        />
      )}
      {c.visible && (
        <PermissionRequest
          agent={{ name: "Ops agent", avatar: <SparkMark /> }}
          action="refund $240"
          target="Payments · live mode"
          toolIcon={<CardMark />}
          risk="destructive"
          reason="Two orders were charged twice after the checkout outage this morning."
          previewTitle="Refunds"
          preview={[
            { id: "o1", label: "Order #44882211 · Lena Fischer", meta: "$120.00", icon: <ReceiptMark /> },
            { id: "o2", label: "Order #44882222 · Tom Okafor", meta: "$120.00", icon: <ReceiptMark /> },
          ]}
          {...view(c, setC)}
        />
      )}
    </div>
  );
}
