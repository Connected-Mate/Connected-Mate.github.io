import { BreakdownChart, type BreakdownRecord, type Dimension, type Measure } from "./breakdown-chart";

const STATUSES = ["Backlog", "Todo", "In progress", "In review", "Done", "Canceled"];
const PRIORITIES = ["Urgent", "High", "Medium", "Low", "None"];
const TEAMS = ["Web", "Mobile", "Platform", "Data"];
const TYPES = ["Feature", "Bug", "Chore"];

// Tasks per status × priority for sprint 24 (212 in all).
const COUNTS: number[][] = [
  [3, 6, 6, 8, 3],
  [1, 7, 12, 11, 5],
  [1, 9, 12, 7, 5],
  [0, 1, 6, 4, 2],
  [7, 14, 23, 25, 27],
  [0, 1, 3, 1, 2],
];
const POINTS = [1, 2, 3, 5, 8];

function buildTasks(): BreakdownRecord[] {
  const tasks: BreakdownRecord[] = [];
  let n = 0;
  COUNTS.forEach((row, s) =>
    row.forEach((count, p) => {
      for (let i = 0; i < count; i++) {
        n += 1;
        tasks.push({
          id: `T-${100 + n}`,
          status: STATUSES[s],
          priority: PRIORITIES[p],
          team: TEAMS[(n * 7 + s) % TEAMS.length],
          type: TYPES[(n * 5 + p) % TYPES.length],
          points: POINTS[(n * 3 + p + s) % POINTS.length],
        });
      }
    }),
  );
  return tasks;
}

const svg = (children: React.ReactNode) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const STATUS_ICONS = {
  Backlog: svg(<path d="M2.5 9.5 4 3.5h8l1.5 6v3h-11zM2.5 9.5H6l.8 1.5h2.4l.8-1.5h3.5" />),
  Todo: svg(<rect x="3.5" y="3.5" width="9" height="9" rx="2" />),
  "In progress": (
    <span style={{ color: "var(--ui-at-bc-c3)", display: "inline-grid" }}>
      {svg(<><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2 1.5" /></>)}
    </span>
  ),
  "In review": (
    <span style={{ color: "var(--ui-at-bc-c1)", display: "inline-grid" }}>
      {svg(<><path d="M1.8 8S4 3.8 8 3.8 14.2 8 14.2 8 12 12.2 8 12.2 1.8 8 1.8 8z" /><circle cx="8" cy="8" r="1.8" /></>)}
    </span>
  ),
  Done: (
    <span style={{ color: "var(--ui-at-bc-c3)", display: "inline-grid" }}>
      <svg viewBox="0 0 16 16">
        <rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill="currentColor" />
        <path d="m5.3 8.2 1.9 1.9 3.6-4" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ),
  Canceled: svg(<><circle cx="8" cy="8" r="5.5" /><path d="m4.2 11.8 7.6-7.6" /></>),
};

const dimensions: Dimension[] = [
  { key: "status", label: "Status", values: STATUSES, icons: STATUS_ICONS },
  { key: "priority", label: "Priority", values: PRIORITIES },
  { key: "team", label: "Team", values: TEAMS },
  { key: "type", label: "Type", values: TYPES },
];

const measures: Measure[] = [
  { key: "count", label: "Task count", unit: "tasks" },
  { key: "points", label: "Story points", unit: "points", field: "points" },
];

const tasks = buildTasks();

export default function Demo() {
  return (
    <BreakdownChart
      title="Sprint 24"
      records={tasks}
      dimensions={dimensions}
      measures={measures}
      defaultSlice="status"
      defaultSegment="priority"
    />
  );
}
