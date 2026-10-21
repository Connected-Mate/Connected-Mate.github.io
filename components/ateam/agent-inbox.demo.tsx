import { useEffect, useRef, useState } from "react";
import { AgentInbox, type AgentTask } from "./agent-inbox";

const MIN = 60_000;

function initialTasks(): AgentTask[] {
  const now = Date.now();
  return [
    {
      id: "migrate",
      title: "Migrate users table",
      description: "Split users into accounts and profiles on Postgres 17. The dry run on staging passed.",
      agent: "Opus 5.5",
      status: "running",
      startedAt: now - 6 * MIN,
      sources: 9,
      tools: 14,
      steps: [
        { label: "Read schema and 14 migrations", time: "6m ago" },
        { label: "Wrote migration 0042_split_users", time: "4m ago" },
        { label: "Dry run on staging – no errors", time: "2m ago" },
      ],
    },
    {
      id: "crm",
      title: "Clean up CRM contacts",
      description: "Matched 1,312 likely duplicates, then the merge hit the API rate limit.",
      agent: "Haiku 5.5",
      status: "failed",
      elapsed: 2 * MIN + 14_000,
      sources: 2,
      tools: 6,
      steps: [
        { label: "Loaded 18,240 contacts", time: "9m ago" },
        { label: "Matched 1,312 likely duplicates", time: "8m ago" },
        { label: "Merge stopped – API rate limit (429)", time: "7m ago" },
      ],
    },
    {
      id: "review",
      title: "Review PR #448822",
      description: "Billing webhooks: reading the diff and the test run, writing comments.",
      agent: "Sonnet 5.5",
      status: "running",
      startedAt: now - (3 * MIN + 40_000),
      sources: 12,
      tools: 21,
      steps: [
        { label: "Read 12 changed files", time: "2m ago" },
        { label: "Ran the test suite – 214 passed", time: "1m ago" },
        { label: "Writing review comments", time: "now" },
      ],
    },
    {
      id: "notes",
      title: "Release notes v2.4",
      description: "Grouping 23 merged pull requests into features and fixes.",
      agent: "Sonnet 5.5",
      status: "running",
      startedAt: now - (MIN + 18_000),
      sources: 23,
      tools: 5,
      steps: [
        { label: "Collected 23 merged pull requests", time: "1m ago" },
        { label: "Drafting the highlights", time: "now" },
      ],
    },
    {
      id: "digest",
      title: "Weekly metrics digest",
      description: "Pulled numbers from three dashboards and posted the summary to #metrics.",
      agent: "Haiku 5.5",
      status: "done",
      elapsed: 4 * MIN + 12_000,
      sources: 3,
      tools: 8,
      steps: [
        { label: "Pulled numbers from 3 dashboards", time: "22m ago" },
        { label: "Posted to #metrics", time: "18m ago" },
      ],
    },
  ];
}

const PRODUCTION_STEP = { label: "Wants to run it on production", time: "1m ago" };

export default function Demo() {
  const [tasks, setTasks] = useState<AgentTask[]>(initialTasks);
  const wrap = useRef<HTMLDivElement>(null);

  const update = (id: string, patch: (t: AgentTask) => Partial<AgentTask>) =>
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, ...patch(t) } : t)));

  // A loop that plays the whole story: the migration asks for approval, the card unfolds,
  // Approve is pressed, it glides back to Running, then finishes and lands in Done.
  useEffect(() => {
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const card = (id: string) => wrap.current?.querySelector<HTMLElement>(`[data-task="${id}"]`);

    const cycle = () => {
      setTasks(initialTasks());
      at(1600, () =>
        update("migrate", (t) => ({ status: "waiting", steps: [...(t.steps ?? []), PRODUCTION_STEP] })),
      );
      at(2600, () => {
        const head = card("migrate")?.querySelector<HTMLButtonElement>("button[aria-expanded='false']");
        head?.click();
      });
      at(5200, () => {
        const approve = Array.from(card("migrate")?.querySelectorAll<HTMLButtonElement>("button") ?? []).find(
          (b) => b.textContent === "Approve",
        );
        approve?.click();
      });
      at(6600, () => {
        const head = card("migrate")?.querySelector<HTMLButtonElement>("button[aria-expanded='true']");
        head?.click();
      });
      at(9400, () =>
        update("migrate", (t) => ({
          status: "done",
          elapsed: 6 * MIN + 48_000,
          tools: 17,
          steps: [...(t.steps ?? []).slice(0, 3), { label: "Ran it on production – 2.1M rows", time: "now" }],
        })),
      );
      at(13000, cycle);
    };
    cycle();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <div ref={wrap} style={{ width: "100%", display: "grid", placeItems: "center" }}>
      <AgentInbox
        tasks={tasks}
        onApprove={(t) => update(t.id, () => ({ status: "running" }))}
        onReject={(t) => update(t.id, () => ({ status: "failed", elapsed: Date.now() - Number(t.startedAt ?? Date.now()) }))}
        onRetry={(t) =>
          update(t.id, () => ({ status: "running", startedAt: Date.now(), elapsed: undefined }))
        }
        onOpen={() => {}}
      />
    </div>
  );
}
