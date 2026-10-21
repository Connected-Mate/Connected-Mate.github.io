"use client";

import { useState } from "react";
import { PromptLibrary, type PromptTemplate } from "./prompt-library";

const TEMPLATES: PromptTemplate[] = [
  {
    id: "meeting",
    title: "Summarize a meeting",
    category: "Notes",
    body: "Summarize the meeting below for {audience} in under {length}. List decisions first, then open questions with an owner each.",
    variables: {
      audience: { description: "Who will read the summary" },
      length: { description: "Maximum length", default: "150 words" },
    },
  },
  {
    id: "release",
    title: "Write release notes",
    category: "Product",
    body: "Write release notes for {product} {version} for {audience}. Keep the tone {tone} and group the changes into New, Improved and Fixed.",
    variables: {
      product: { description: "Name of the product", default: "Relay" },
      version: { description: "Version number, e.g. 2.4", default: "2" },
      audience: { description: "Who the notes are for" },
      tone: { description: "How it should sound", default: "friendly" },
    },
  },
  {
    id: "error",
    title: "Explain an error",
    category: "Debug",
    body: "Explain this {language} error in plain words, say what most likely caused it and suggest one fix: {error}",
    variables: {
      language: { description: "Programming language", default: "TypeScript" },
      error: { description: "The error message" },
    },
  },
  {
    id: "outreach",
    title: "Draft a cold email",
    category: "Sales",
    body: "Draft a short first email to {name}, {role} at {company}, about {topic}. Three sentences at most, one clear question at the end.",
    variables: {
      name: { description: "First name of the person" },
      role: { description: "Their job title" },
      company: { description: "Their company" },
      topic: { description: "What you want to talk about" },
    },
  },
];

export default function Demo() {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div style={{ width: "100%", maxWidth: 640, display: "grid", gap: 12 }}>
      <PromptLibrary templates={TEMPLATES} defaultValue="release" onUse={(prompt) => setLast(prompt)} />
      <style href="ui-prompt-library-demo" precedence="default">{demoCss}</style>
      <p className="ui-plib-demo__sent" aria-live="polite">
        {last ? `Sent to the composer: “${last.slice(0, 90)}${last.length > 90 ? "…" : ""}”` : ""}
      </p>
    </div>
  );
}

const demoCss = /* css */ `
.ui-plib-demo__sent {
  --demo-muted: rgba(0, 22, 43, 0.54);
  min-height: 36px;
  margin: 0 8px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 12.5px;
  line-height: 18px;
  color: var(--demo-muted);
  overflow-wrap: anywhere;
}
:where(.dark, [data-theme="dark"]) .ui-plib-demo__sent { --demo-muted: rgba(255, 255, 255, 0.56); }
`;
