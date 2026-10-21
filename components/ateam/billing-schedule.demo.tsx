import { BillingSchedule } from "./billing-schedule";

export default function Demo() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <BillingSchedule phase="Build-out phase" defaultStart="2026-01-01" onChange={() => undefined} />
    </div>
  );
}
