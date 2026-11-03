var e={requirements:[`React 19`],whenToUse:[`Several agents work on tasks one after another – research, analysis, writing, review – and people need to see what each one passed on`,`Debugging multi-agent pipelines: where did the context get lost?`,`Letting people push a task on to a later agent and watch it travel down the relay`],whenNotToUse:[`Agents working side by side at the same time – use Agent Lanes`,`Who started whom, as a hierarchy – use Agent Tree`],usage:`import { AgentHandoff, type HandoffAgent, type Handoff } from "@/components/ui/agent-handoff";

const agents: HandoffAgent[] = [
  { id: "research", name: "Researcher", model: "Opus 5.5", avatar: <ClaudeLogo /> },
  { id: "writer", name: "Writer", model: "GPT-5", avatar: <OpenAILogo /> },
];

const handoffs: Handoff[] = [
  {
    id: "launch-1", from: "research", to: "writer", task: "Launch post",
    items: [
      { id: "brief", label: "launch-brief.md", kind: "file" },
      { id: "quotes", label: "3 user quotes", kind: "note", lost: true, why: "Over the writer's context budget" },
    ],
  },
];

<AgentHandoff
  agents={agents}
  handoffs={handoffs}
  tasks={[
    { id: "launch", title: "Launch post", logo: <NotionLogo />, status: "working", agent: "writer", note: "Drafting" },
    { id: "pricing", title: "Pricing page copy", logo: <NotionLogo />, status: "todo" },
  ]}
  onAssign={(task, agent) => run(task.id, agent.id)}
  onRestore={(handoff, item) => passOn(handoff.id, item.id)}
/>`,props:[{name:`agents`,type:`HandoffAgent[]`,description:`In relay order: { id, name, model?, avatar?, description? } – each card shows what it's for and the task it's on, taken from tasks`},{name:`handoffs`,type:`Handoff[]`,description:`What was handed over: { id, from, to, task, items } – each lands as a card in the column between from and to, latest on top; a new id sends light along its lines`},{name:`items`,type:`HandoffItem[]`,description:`Per handoff: { id, label, kind?: "file" | "source" | "fact" | "decision" | "note", lost?, why? } – lost ones are struck through, why shows on hover`},{name:`tasks`,type:`HandoffTask[]`,description:`Every task: { id, title, logo?, status: "todo" | "working" | "done" | "warning", agent?, note? } – handoffs refer to them by title for the logo and where the task is now; the first agent shows the next todo one as up next`},{name:`onAssign`,type:`(task, agent) => void`,description:`A handoff card was dropped on an agent to the right of its column – give that task to it and keep handoffs and tasks up to date. Cards only move on down the relay, never back`},{name:`onRestore`,type:`(handoff, item) => void`,description:`Adds "Add back" to a lost item's card – pass it on after all`},{name:`className`,type:`string`,description:`Extra class on the root`}],keyboard:[{keys:[`Tab`],description:`Moves through the waiting tasks, the agents (while a task is picked up) and the handed-over items`},{keys:[`Enter`,`Space`],description:`Opens a card or an agent's task; with a card picked up, gives it to the focused agent; on a lost item: shows why, and Add back`}],accessibility:[`Tasks can be given to an agent without dragging: double-tap a card, then tap an agent to its right`,`Each column and each handoff's items are labelled lists; cards and lost items are buttons with aria-expanded`],motion:[`At a handoff a short streak of light with a soft glow runs along the rounded line into the top of the column, the card drops in, and the light runs on out of it to the next agent`,`A card opens in place to show everything that went along; a lost thing opens to say why`,`A dragged card follows the pointer; an agent it can go to lifts and rings in blue, the ones it has passed step back`,`Cards keep their size – an agent shows one line for its task, a handoff card three lines; the columns fade out at the bottom`,`With prefers-reduced-motion everything appears at once`],responsive:[`Below about 760px the status shows as an icon only; below 620px the relay stacks into one column – an agent, its handoff, the next agent `,`Dark mode built in: switches when an ancestor (usually <html>) has the class dark or data-theme="dark"`],aiNotes:[`The component draws – your code runs the relay: on onAssign, set that task to working with the agent; when it finishes, push a Handoff to the next agent and move the task on (or to done / warning at the end)`,`Mark what didn't make it with lost: true and a short why – that's the point of the component`],related:[`agent-lanes`,`agent-tree`,`context-map`,`trace-waterfall`]};export{e as docs};