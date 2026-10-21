import { useEffect, useRef, useState } from "react";
import { ModelPicker, type Effort, type PickerModel } from "./model-picker";

const models: PickerModel[] = [
  { id: "opus", name: "Opus 5.5", description: "Hardest problems", speed: 2, quality: 5, cost: 5, latencyMs: 2100, pricePerM: 25 },
  { id: "sonnet", name: "Sonnet 5.5", description: "Everyday work", speed: 4, quality: 4, cost: 3, latencyMs: 900, pricePerM: 15 },
  { id: "haiku", name: "Haiku 5.5", description: "Quick and light", speed: 5, quality: 3, cost: 1, latencyMs: 400, pricePerM: 4 },
  {
    id: "auto",
    name: "Auto",
    description: "Picks per message",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8 3v10M3 8h10" />
      </svg>
    ),
  },
];

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState("sonnet");
  const [thinking, setThinking] = useState(false);
  const [effort, setEffort] = useState<Effort>("medium");
  const [web, setWeb] = useState(false);
  const [auto, setAuto] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  // Plays the menu once in a loop until someone touches it.
  useEffect(() => {
    if (!auto) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const point = (i: number) => {
      const row = rootRef.current?.querySelectorAll<HTMLElement>("[role=option]")[i];
      row?.dispatchEvent(new PointerEvent("pointermove", { bubbles: true }));
    };
    const leave = () =>
      rootRef.current
        ?.querySelector<HTMLElement>("[role=listbox]")
        ?.dispatchEvent(new PointerEvent("pointerout", { bubbles: true, relatedTarget: document.body }));
    const play = (t0: number) => {
      at(t0 + 500, () => setOpen(true));
      at(t0 + 1300, () => point(0));
      at(t0 + 2700, () => point(2));
      at(t0 + 3900, () => point(1));
      at(t0 + 4700, () => leave());
      at(t0 + 5300, () => setThinking(true));
      at(t0 + 6600, () => setEffort("high"));
      at(t0 + 7800, () => setEffort("medium"));
      at(t0 + 9000, () => setThinking(false));
      at(t0 + 10200, () => setOpen(false));
      at(t0 + 11600, () => play(0));
    };
    play(0);
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [auto]);

  const stop = () => setAuto(false);

  return (
    <div
      ref={rootRef}
      style={{ width: "100%", maxWidth: 360, minHeight: 470 }}
      onPointerDownCapture={(e) => e.isTrusted && stop()}
      onKeyDownCapture={(e) => e.isTrusted && stop()}
    >
      <div className="demo-composer">
        <style href="demo-model-picker" precedence="default">{composerCss}</style>
        <input className="demo-composer__input" placeholder="Ask anything…" aria-label="Message" />
        <div className="demo-composer__bar">
          <ModelPicker
            models={models}
            value={model}
            onChange={(id) => {
              stop();
              setModel(id);
            }}
            open={open}
            onOpenChange={(o) => {
              stop();
              setOpen(o);
            }}
            thinking={thinking}
            onThinkingChange={(t) => {
              stop();
              setThinking(t);
            }}
            effort={effort}
            onEffortChange={(e) => {
              stop();
              setEffort(e);
            }}
            webSearch={web}
            onWebSearchChange={(w) => {
              stop();
              setWeb(w);
            }}
          />
          <button type="button" className="demo-composer__send" aria-label="Send">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 13V3.5M4 7.2L8 3.2l4 4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const composerCss = `
.demo-composer {
  --c-panel: #ffffff; --c-line: #dae2ec; --c-ink: #00162b; --c-muted: rgba(0,22,43,.54);
  --c-drop: 0 8px 16px -8px rgba(26,62,112,.2);
  display: grid; gap: 10px; padding: 14px 10px 10px 14px;
  background: var(--c-panel); border: 1px solid var(--c-line); border-radius: 18px; box-shadow: var(--c-drop);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
}
:where(.dark, [data-theme="dark"]) .demo-composer {
  --c-panel: #16345c; --c-line: rgba(255,255,255,.12); --c-ink: rgba(255,255,255,.94); --c-muted: rgba(255,255,255,.56);
  --c-drop: 0 8px 16px -8px rgba(3,12,28,.6);
}
.demo-composer__input { border: 0; outline: 0; background: transparent; font: inherit; font-size: 15px; color: var(--c-ink); caret-color: #851437; padding: 2px; }
.demo-composer__input::placeholder { color: var(--c-muted); }
.demo-composer__bar { display: flex; align-items: center; justify-content: space-between; }
.demo-composer__send { display: grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: 999px; background: var(--c-ink); color: var(--c-panel); cursor: pointer; }
.demo-composer__send svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
`;
