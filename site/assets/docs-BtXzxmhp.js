var e={requirements:[`React 19`],whenToUse:[`Agent products where several tasks run in the background and people come back to see what finished, what failed and what waits for them`,`A sidebar or home screen that collects approvals from many runs in one place, instead of one modal per agent`,`Job queues in general – imports, syncs, evaluations – where each job has a short history and one next step`],whenNotToUse:[`One single approval in the flow of a chat – use Approval Card`,`The plan of one run, step by step – use Agent Plan; for a single tool call use Tool Call Card`,`Hundreds of jobs – the list is for a few dozen at most; page or search a bigger queue in a table`],usage:`import { AgentInbox } from "@/components/ui/agent-inbox";

export function Tasks() {
  return (
    <AgentInbox
      tasks={[
        {
          id: "migrate",
          title: "Migrate users table to Postgres 17",
          agent: "Opus 5.5",
          status: "waiting",
          startedAt: Date.now() - 6 * 60_000,
          steps: [
            { label: "Dry run on staging – no errors", time: "2m ago" },
            { label: "Wants to run it on production", time: "1m ago" },
          ],
        },
        { id: "notes", title: "Write release notes for v2.4", agent: "Sonnet 5.5", status: "running", startedAt: Date.now() - 80_000 },
        { id: "digest", title: "Weekly metrics digest", agent: "Haiku 5.5", status: "done", elapsed: 252_000 },
      ]}
    />
  );
}`,examples:[{title:`Wired to your task queue`,code:`const { tasks, approve, reject, retry } = useAgentTasks();
const [filter, setFilter] = useState<AgentInboxFilter>("needs-you");

<AgentInbox
  tasks={tasks}
  // With handlers the inbox shows exactly what you pass – update the status and it moves on its own
  onApprove={(task) => approve(task.id)}
  onReject={(task) => reject(task.id)}
  onRetry={(task) => retry(task.id)}
  onOpen={(task) => router.push(\`/tasks/\${task.id}\`)}
  filter={filter}
  onFilterChange={setFilter}
  action={{ label: "New task", onClick: openComposer }}
/>`},{title:`On its own, without handlers`,code:`// Approve sets a task running, Reject marks it failed and Retry restarts it – all inside the inbox
<AgentInbox tasks={initialTasks} defaultFilter="needs-you" />`}],props:[{name:`tasks`,type:`AgentTask[]`,description:`{ id, title, agent, status, startedAt?, elapsed?, steps? } – status is "running", "waiting", "done" or "failed"; steps are { label, time? }, oldest first`},{name:`onApprove`,type:`(task: AgentTask) => void`,description:`Approve on a waiting task. Without it the task turns running inside the inbox`},{name:`onReject`,type:`(task: AgentTask) => void`,description:`Reject on a waiting task. Without it the task turns failed with the step "Rejected by you"`},{name:`onRetry`,type:`(task: AgentTask) => void`,description:`Retry on a failed task. Without it the task runs again and its clock starts over`},{name:`onOpen`,type:`(task: AgentTask) => void`,description:`Shows an Open button on running and done tasks`},{name:`filter`,type:`"all" | "needs-you" | "running" | "done"`,description:`Controlled filter. Needs you holds waiting and failed tasks`},{name:`defaultFilter`,type:`AgentInboxFilter`,default:`"all"`,description:`Starting filter when uncontrolled`},{name:`onFilterChange`,type:`(filter: AgentInboxFilter) => void`,description:`Called when a tab is picked`},{name:`action`,type:`{ label: string; onClick: () => void }`,description:`A button on the tray with a plus, e.g. New task`},{name:`className`,type:`string`,description:`Extra class on the root`}],keyboard:[{keys:[`←`,`→`],description:`On the tabs: moves to and picks the previous or next filter; Home and End jump to the first and last`},{keys:[`Tab`],description:`From the tabs through the rows, then the buttons inside an open row and the tray action`},{keys:[`Enter`,`Space`],description:`Opens or closes a row, presses Approve, Reject, Retry or Open`},{keys:[`Esc`],description:`Closes the open row and puts focus back on it`}],accessibility:[`The filter is a radio group with one tab stop; each tab's count is part of its name`,`Each row is a button with aria-expanded that reads title, agent, time and status; a closed row's details are inert`,`Rows hidden by the filter are inert and hidden from screen readers while they fold away`,`Status changes are announced politely once ("Write release notes for v2.4: done"); the hover line on the tray stays quiet`],motion:[`Running tasks spin a small blue ring and their clock ticks every second; a waiting task's amber dot breathes slowly`,`When a status changes, the glyph pops into its new shape and the tag crossfades in place; after a moment the row glides to its new group (FLIP) or folds away if the filter no longer holds it`,`The tab thumb slides to the picked filter; counts roll up or down when tasks change`,`Rows open in place to the last steps as a tiny timeline; new steps rise in, new tasks unfold at their spot`,`Hovering a tab or a part of the tray line fades the rows it doesn't include; hovering a row tells on the tray what it is doing right now`,`With prefers-reduced-motion everything switches without movement`],responsive:[`Fills its container up to 400px. Below 380px the tabs tighten, below 330px the count of All gives way and rows lose a little padding – it works down to 300px`,`Touch screens: taller tabs, rows and buttons`,`Dark mode built in: switches when an ancestor (usually <html>) has the class dark or data-theme="dark"`],aiNotes:[`Pass startedAt for running and waiting tasks so the clock ticks; pass elapsed for finished ones – without it the clock stops where it was when the status changed`,`Rows are sorted into groups: waiting, failed, running, done; inside a group they keep your order, so put new tasks first`,`With a handler the inbox never changes a status by itself – update the task in your state (e.g. waiting → running → done) and it follows`,`Show the last step as what the agent is doing or asking – it is what the tray says when the row is hovered`],related:[`approval-card`,`agent-plan`,`tool-call-card`,`decision-inbox`]};export{e as docs};