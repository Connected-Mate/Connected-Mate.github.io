"use client";

import { useState } from "react";
import { IntegrationPicker } from "./integration-picker";

export default function Demo() {
  const [note, setNote] = useState("");
  return (
    <div className="ui-ipick-demo">
      <style href="ui-integration-picker-demo" precedence="default">{demoCss}</style>
      <IntegrationPicker
        onToggle={(id, connected) => setNote(`${id} ${connected ? "connected" : "disconnected"}`)}
        onExplore={(id) => setNote(`Opening the ${id} page…`)}
        onBack={() => setNote("Back to the menu")}
        onClose={() => setNote("Menu closed")}
      />
      <p className="ui-ipick-demo__note" aria-live="polite">{note}</p>
    </div>
  );
}

const demoCss = /* css */ `
.ui-ipick-demo { width: 100%; max-width: 660px; display: grid; gap: 10px; }
.ui-ipick-demo__note {
  --demo-muted: rgba(0, 22, 43, 0.54);
  min-height: 18px;
  margin: 0 10px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 12.5px;
  line-height: 18px;
  color: var(--demo-muted);
}
:where(.dark, [data-theme="dark"]) .ui-ipick-demo__note { --demo-muted: rgba(255, 255, 255, 0.56); }
`;
