import { CitedAnswer, type CitedSegment, type CitedSource } from "./cited-answer";

const sources: CitedSource[] = [
  {
    id: "caching",
    site: "Tokenwise",
    title: "Prompt caching, explained: what gets stored and for how long",
    url: "https://tokenwise.dev/blog/prompt-caching",
    date: "Sep 18, 2026",
    quote:
      "A cached prefix is read instead of recomputed. On prompts over 10,000 tokens this cut time to first token by up to 80% in our tests, and cached input is billed at a fraction of the normal rate.",
    highlight: ["read instead of recomputed", "cut time to first token by up to 80%"],
  },
  {
    id: "layout",
    site: "Latency Notes",
    title: "Designing cache-friendly prompts",
    url: "https://latencynotes.io/cache-friendly-prompts",
    date: "Aug 2, 2026",
    quote:
      "Keep the stable part – system prompt, tool definitions, long documents – at the very start, and put anything that changes per request after it. A single changed character early on invalidates everything behind it.",
    highlight: ["at the very start", "anything that changes per request after it", "invalidates everything behind it"],
  },
  {
    id: "semantic",
    site: "Inference Weekly",
    title: "Semantic caching for LLM apps in production",
    url: "https://inferenceweekly.com/semantic-caching",
    date: "Jul 24, 2026",
    quote:
      "For FAQ-style traffic, the semantic cache answered 31% of requests without calling the model at all, at a median of 40 ms. We only serve a stored answer above a similarity of 0.92.",
    highlight: ["answered 31% of requests", "median of 40 ms"],
  },
];

const segments: CitedSegment[] = [
  {
    text: "The biggest win is prompt caching: the provider reuses the processed start of your prompt, so a long system prompt isn't recomputed on every call.",
    cite: ["caching"],
  },
  { text: " On prompts over 10K tokens that can cut time to first token by up to 80%.", cite: ["caching"] },
  {
    text: " It only works while that start stays identical, so put the system prompt, tools and long documents first and anything that changes per request last.",
    cite: ["layout", "caching"],
  },
  {
    text: "For repeated questions, add a semantic cache in front of the model: close matches get a stored answer in about 40 ms,",
    cite: ["semantic"],
    paragraph: true,
  },
  { text: " which covered nearly a third of FAQ-style traffic in one production setup.", cite: ["semantic"] },
  { text: " Stream the rest, so people see the first words while the answer is still being written." },
];

export default function Demo() {
  return (
    <CitedAnswer
      segments={segments}
      sources={sources}
      pagesRead={12}
      defaultOpen="layout"
      action={{ label: "Follow up", onClick: () => {} }}
    />
  );
}
