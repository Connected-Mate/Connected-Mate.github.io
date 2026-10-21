"use client";

import { useEffect, useRef, useState } from "react";
import { ApprovalCard, type ApprovalStatus } from "./approval-card";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const RECIPIENTS = ["Mia", "Jonas", "Sara", "Alex"];

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.25" y="3.5" width="11.5" height="9" rx="2" />
      <path d="m2.75 4.75 5.25 4 5.25-4" />
    </svg>
  );
}

function Recipients() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
      <span style={{ display: "flex", flex: "none" }} aria-hidden="true">
        {RECIPIENTS.map((name, i) => (
          <span
            key={name}
            className="demo-at-approve__avatar"
            style={{ marginLeft: i ? -6 : 0, zIndex: RECIPIENTS.length - i }}
          >
            {name[0]}
          </span>
        ))}
      </span>
      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <span className="demo-at-approve__names">{RECIPIENTS.join(", ")}</span>{" "}
        <span className="demo-at-approve__more">+38 more</span>
      </span>
    </div>
  );
}

export default function Demo() {
  const [status, setStatus] = useState<ApprovalStatus>("pending");
  const reset = useRef<ReturnType<typeof setTimeout>>(undefined);

  // After a decision the row stays for a moment, then a fresh request comes in.
  useEffect(() => {
    if (status === "pending") return;
    reset.current = setTimeout(() => setStatus("pending"), 2600);
    return () => clearTimeout(reset.current);
  }, [status]);

  return (
    <div className="demo-at-approve">
      <style href="demo-at-approve" precedence="default">{demoCss}</style>
      <div className="demo-at-approve__bubble">
        <span className="demo-at-approve__agent" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M8 2.5c.4 2.7 1.8 4.1 4.5 4.5-2.7.4-4.1 1.8-4.5 4.5C7.6 8.8 6.2 7.4 3.5 7c2.7-.4 4.1-1.8 4.5-4.5Z" />
          </svg>
        </span>
        <p>I drafted the October newsletter. Ready to send?</p>
      </div>
      <ApprovalCard
        title="Send campaign email"
        description="October product update · Newsletter"
        risk="medium"
        icon={<MailIcon />}
        status={status}
        details={[
          { label: "Subject", value: "What's new in October" },
          { label: "Send", value: "Today, 9:00 AM" },
        ]}
        onApprove={async () => {
          await wait(900);
          setStatus("approved");
        }}
        onDeny={() => setStatus("denied")}
      >
        <Recipients />
      </ApprovalCard>
    </div>
  );
}

const demoCss = /* css */ `
.demo-at-approve {
  --ink: #00162b;
  --bubble: #eef5ff;
  --bubble-line: #c1daff;
  --avatar: #ffffff;
  --avatar-line: #dae2ec;
  --muted: rgba(0, 22, 43, 0.54);
  width: 100%;
  max-width: 440px;
  display: grid;
  gap: 14px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
}
:where(.dark, [data-theme="dark"]) .demo-at-approve {
  --ink: rgba(255, 255, 255, 0.94);
  --bubble: rgba(143, 189, 242, 0.16);
  --bubble-line: rgba(143, 189, 242, 0.3);
  --avatar: #16345c;
  --avatar-line: rgba(255, 255, 255, 0.18);
  --muted: rgba(255, 255, 255, 0.56);
}
.demo-at-approve__bubble { display: flex; align-items: center; gap: 10px; min-width: 0; }
.demo-at-approve__bubble p {
  margin: 0;
  padding: 8px 14px;
  border-radius: 16px;
  background: var(--bubble);
  border: 1px solid var(--bubble-line);
  color: var(--ink);
  font-size: 14px;
  line-height: 1.4;
}
.demo-at-approve__agent {
  flex: none;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #00162b;
  color: #fff;
}
:where(.dark, [data-theme="dark"]) .demo-at-approve__agent { background: #ffffff; color: #00162b; }
.demo-at-approve__agent svg { width: 12px; height: 12px; fill: currentColor; }
.demo-at-approve__avatar {
  position: relative;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--avatar);
  border: 1px solid var(--avatar-line);
  color: var(--ink);
  font-size: 10.5px;
  font-weight: 600;
}
.demo-at-approve__names { color: var(--ink); }
.demo-at-approve__more { color: var(--muted); }
`;
