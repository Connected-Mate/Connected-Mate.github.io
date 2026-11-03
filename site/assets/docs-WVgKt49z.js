var e={requirements:[`React 19`],whenToUse:[`An agent hits a fork it shouldn't take alone – it asks how to proceed and shows what each way would change`,`Backend calls without much to look at: data cleanups, refunds, rollouts, escalations – the consequences are the content`,`When the agent has a preference but a person decides – its pick is marked, the other ways stay one click away`],whenNotToUse:[`Reviewing finished work – a diff, an email, a refund – one item after another: use Review Center`,`One action that only needs a yes or no, with a countdown – use Approval Card`,`A few quick questions with two answers each – use Decision Inbox`,`An agent asking for access to a tool or scope – use Permission Request`],usage:`import { DecisionTree, type Decision } from "@/components/ui/decision-tree";

const decisions: Decision[] = [
  {
    id: "dupes",
    question: "3 customers have two active subscriptions – how should I proceed?",
    context: "All three signed up twice during the checkout outage.",
    agent: "Billing agent", model: "Sonnet 5.5", risk: "high",
    options: [
      { label: "Cancel the newer ones", pick: true, effects: ["Cancels 3 subscriptions · reversible", "Sends 3 emails"] },
      // A flagged part: marked in the leaf, its note shows on hover or with F
      { label: "Refund the newer ones", effects: [["Refunds ", { text: "$147 · not reversible", note: "One charge is two cycles old." }]] },
      { label: "Ask the customers", effects: ["Sends 3 emails · waits for answers"] },
    ],
  },
];

export function Decisions() {
  return (
    <DecisionTree
      decisions={decisions}
      onChoose={async (decision, choice) => {
        if ("other" in choice) return await agent.instruct(decision.id, choice.other); // its answer shows under your branch
        await agent.resume(decision.id, choice.option.label);
      }}
    />
  );
}`,examples:[{title:`Without "Other…"`,code:`// Only the agent's options – no free-text branch
<DecisionTree decisions={decisions} allowOther={false} />`},{title:`The agent answers your instruction`,code:`// Return a short answer – it appears in the outcome card under your branch
<DecisionTree
  decisions={decisions}
  onChoose={(d, choice) => ("other" in choice ? "Got it – re-running with only EU customers" : undefined)}
/>`},{title:`Drive it from outside`,code:`const tree = useRef<DecisionTreeHandle>(null);
<DecisionTree ref={tree} decisions={decisions} />
// e.g. your own shortcut
tree.current?.choose(0);`}],props:[{name:`decisions`,type:`Decision[]`,description:`{ id, question, context?, agent, model?, icon?, risk?, options } – everything waiting for a call; decided ones leave, new ids join at the end`},{name:`options`,type:`DecisionOption[]`,description:`Per decision, two to four – { label, effects?, pick? }; effects are what the branch leads to, one line each; pick marks the agent's own preference`},{name:`effects`,type:`DecisionText[]`,description:`Per option – a string, or an array of strings and { text, note, source? } flags; flags are marked and explain themselves on hover, focus or F`},{name:`risk`,type:`"high" | "medium" | "low"`,description:`Per decision – high and medium show as a small tag next to the agent`},{name:`onChoose`,type:`(decision, choice) => string | void | Promise<string | void>`,description:`A branch was picked ({ index, option }) or an instruction written ({ other }) – for an instruction, return the agent's short answer`},{name:`allowOther`,type:`boolean`,default:`true`,description:`Shows the "Other…" branch for your own instruction`},{name:`ref`,type:`Ref<DecisionTreeHandle>`,description:`hover, choose, setOther, send, next, previous, peek`},{name:`title`,type:`string`,default:`"Decisions"`,description:`Heading of the bar`},{name:`className`,type:`string`,description:`Extra class on the root`}],keyboard:[{keys:[`1`,`2`,`3`,`4`],description:`Picks a branch; the number after the last option opens "Other…"`},{keys:[`Enter`],description:`In "Other…": sends your instruction – Shift+Enter starts a new line`},{keys:[`ArrowRight`,`ArrowLeft`],description:`Next and previous decision (J and K too)`},{keys:[`F`],description:`Shows the agent's note on the next flagged consequence`},{keys:[`Esc`],description:`Closes "Other…" or a note`}],accessibility:[`Every branch is a real button labelled with its option and, where it applies, "the agent's pick"; shortcuts are set with aria-keyshortcuts`,`Flagged consequences are focusable and point to their note with aria-describedby (role tooltip)`,`The "Other…" field is a labelled textarea; it has no focus ring of its own – its outline darkens instead, so focus stays visible`,`Picks, instructions and the agent's answers are announced in a polite live region`,`The lines are decoration and hidden from assistive tech`],motion:[`A new decision grows in: the question first, then its branches and their consequences, each line drawing itself out a beat after the other`,`Pointing at a branch lights its path and lets the others step back`,`A pick fades the other branches away; the chosen path draws on to its outcome – "Approved · running" or the agent's answer – then the tree fades and the next one grows`,`"Other…" opens as a two-line field and glides taller as you write, up to three lines; its line stays put while it grows`,`With prefers-reduced-motion everything appears at once`],responsive:[`Built on a container query: wide, the tree runs left to right – question, branches, consequences`,`Under 640px it runs top to bottom – the branches hang off a rail under the question, each with its consequences below it; nothing scrolls sideways`,`Dark mode built in: switches when an ancestor (usually <html>) has the class dark or data-theme="dark"`],aiNotes:[`Ask a real question in one sentence and give two to four options – the label says what to do, the effects say what changes`,`Write effects as plain consequences with numbers ("Refunds $147 · not reversible"); flag only the part that worries the agent, with a one-line note and, if you have it, a source`,`Mark at most one option as pick – the agent's honest preference`,`For "Other…", treat the text as a new instruction for the agent and return its short answer from onChoose`,`Colors are variables on .ui-dct, e.g. --ui-dct-link / --ui-dct-link-pick for the lines`,`The icons are Hugeicons Free (MIT) – keep the credit comment when you copy the file`],related:[`review-center`,`approval-card`,`decision-inbox`,`agent-tree`]};export{e as docs};