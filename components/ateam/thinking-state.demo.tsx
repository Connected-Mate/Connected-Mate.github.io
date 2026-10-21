import { ThinkingState, type ThinkingStep } from "./thinking-state";

const steps: ThinkingStep[] = [
  {
    kind: "search",
    label: "Searched",
    activeLabel: "Searching your workspace and the web",
    sources: [
      { label: "Slack – #team-offsite", href: "https://slack.com", tooltip: "slack.com/archives/team-offsite" },
      { label: "X – @lisbonguide", href: "https://x.com/lisbonguide" },
      { label: "Notion – Offsite plan", href: "https://www.notion.so", tooltip: "Team offsite plan, updated yesterday" },
      { label: "Wikipedia – Lisbon", href: "https://en.wikipedia.org/wiki/Lisbon" },
    ],
    moreSources: [
      { label: "Google Flights – BER → LIS", href: "https://www.google.com/travel/flights" },
      { label: "Airbnb – Alfama houses", href: "https://www.airbnb.com" },
      { label: "Booking.com – Baixa hotels", href: "https://www.booking.com" },
    ],
  },
  { kind: "step", label: "Reading 7 sources about the trip" },
  { kind: "step", label: "Comparing flights and hotels" },
  { kind: "step", label: "Checking dates against the team calendar" },
  { kind: "step", label: "Drafting the offsite agenda" },
];

export default function Demo() {
  return <ThinkingState steps={steps} loop />;
}
