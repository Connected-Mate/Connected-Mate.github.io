"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Toaster, toast } from "./toaster";

const TOASTER = "ateam-toaster-demo";
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function saveDraft() {
  toast.success("Draft saved", { toaster: TOASTER, description: "Q3 Board Report · all changes kept" });
}

function deleteFile() {
  toast("File moved to trash", {
    toaster: TOASTER,
    description: "Q3-Board-Report.pdf",
    action: {
      label: "Undo",
      onClick: () => toast.info("File restored", { toaster: TOASTER, description: "Back in Finance" }),
    },
  });
}

function uploadReport() {
  toast
    .promise(
      wait(2200).then(() => ({ people: 12 })),
      {
        loading: { title: "Uploading report…", description: "Q3-Board-Report.pdf · 4.2 MB" },
        success: (result) => ({ title: "Report uploaded", description: `Shared with ${result.people} people` }),
        error: { title: "Upload failed", description: "Try again in a moment" },
      },
      { toaster: TOASTER },
    )
    .catch(() => {});
}

function sync() {
  toast
    .promise(
      wait(1800).then(() => Promise.reject(new Error("offline"))),
      {
        loading: { title: "Syncing with Drive…", description: "3 files" },
        success: { title: "Everything is in sync" },
        error: { title: "Sync failed", description: "Drive is unreachable · we'll retry in 5 min" },
      },
      { toaster: TOASTER },
    )
    .catch(() => {});
}

export default function Demo() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Plays the four actions once on its own, until someone uses the card.
  useEffect(() => {
    let stopped = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const steps: [number, () => void][] = [
      [700, uploadReport],
      [4200, saveDraft],
      [6200, deleteFile],
      [8600, sync],
    ];
    for (const [at, run] of steps) timers.push(setTimeout(() => !stopped && run(), at));
    const stop = () => {
      stopped = true;
      timers.forEach(clearTimeout);
    };
    const node = rootRef.current;
    node?.addEventListener("pointerdown", stop, { once: true });
    node?.addEventListener("keydown", stop, { once: true });
    node?.addEventListener("click", stop, { once: true });
    return () => {
      stop();
      node?.removeEventListener("pointerdown", stop);
      node?.removeEventListener("keydown", stop);
      node?.removeEventListener("click", stop);
      toast.dismiss();
    };
  }, []);

  return (
    <div ref={rootRef} className="ui-toaster-demo">
      <style href="ui-toaster-demo" precedence="default">{demoCss}</style>
      <div className="ui-toaster-demo__frame">
        <div className="ui-toaster-demo__panel">
          <div className="ui-toaster-demo__head">
            <span className="ui-toaster-demo__pebble" aria-hidden="true">
              <Icon d="M6 2.75h5.2L15 6.6v10.15a.5.5 0 0 1-.5.5h-8.5a.5.5 0 0 1-.5-.5V3.25a.5.5 0 0 1 .5-.5ZM11 2.9v3.85h3.85M7.9 10.5h4.2M7.9 13.3h4.2" />
            </span>
            <div>
              <div className="ui-toaster-demo__title">Q3 Board Report</div>
              <div className="ui-toaster-demo__meta">Finance · edited 2 min ago</div>
            </div>
          </div>
          <div className="ui-toaster-demo__actions">
            <ActionButton onClick={saveDraft} icon="M4.75 3.25h8.4l2.1 2.1v10.9a.5.5 0 0 1-.5.5H4.75a.5.5 0 0 1-.5-.5V3.75a.5.5 0 0 1 .5-.5ZM7 3.4v3.35h5.4V3.4M7 16.6v-4.6h6v4.6">
              Save draft
            </ActionButton>
            <ActionButton onClick={deleteFile} icon="M4 5.75h12M8.25 5.6V4.1a.6.6 0 0 1 .6-.6h2.3a.6.6 0 0 1 .6.6v1.5M5.6 5.9l.75 10.35a.8.8 0 0 0 .8.75h5.7a.8.8 0 0 0 .8-.75l.75-10.35M8.6 8.9v5.2M11.4 8.9v5.2">
              Delete file
            </ActionButton>
            <ActionButton onClick={uploadReport} icon="M10 12.75V3.9M6.6 7.1 10 3.7l3.4 3.4M4 11.9v3.6a.75.75 0 0 0 .75.75h10.5a.75.75 0 0 0 .75-.75v-3.6">
              Upload report
            </ActionButton>
            <ActionButton onClick={sync} icon="M15.3 8.3A5.5 5.5 0 0 0 5.2 6.4M4.7 11.7a5.5 5.5 0 0 0 10.1 1.9M15.6 3.9v4.5h-4.5M4.4 16.1v-4.5h4.5">
              Sync
            </ActionButton>
          </div>
        </div>
        <p className="ui-toaster-demo__hint">
          Press <kbd>F8</kbd> to jump to notifications
        </p>
      </div>
      <div className="ui-toaster-demo__stage">
        <Toaster id={TOASTER} inline position="top-center" offset={0} />
      </div>
    </div>
  );
}

function ActionButton({ icon, onClick, children }: { icon: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="ui-toaster-demo__button" onClick={onClick}>
      <Icon d={icon} />
      <span>{children}</span>
    </button>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="ui-toaster-demo__icon">
      <path d={d} />
    </svg>
  );
}

const demoCss = /* css */ `
.ui-toaster-demo {
  --demo-frame: #f2f6fa;
  --demo-panel: #ffffff;
  --demo-hairline: #dae2ec;
  --demo-firm: #cbd6e4;
  --demo-soft: rgba(26, 62, 112, 0.06);
  --demo-ink: #00162b;
  --demo-text: rgba(0, 22, 43, 0.66);
  --demo-muted: rgba(0, 22, 43, 0.54);
  --demo-secondary: #fbfcfe;
  --demo-ring: #8fbdf2;
  --demo-pebble-light: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --demo-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --demo-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --demo-short: 0 2px 4px -2px rgba(26, 62, 112, 0.2);
  width: 100%;
  max-width: 356px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--demo-ink);
}
:where(.dark, [data-theme="dark"]) .ui-toaster-demo {
  --demo-frame: #0f2747;
  --demo-panel: #16345c;
  --demo-hairline: rgba(255, 255, 255, 0.12);
  --demo-firm: rgba(255, 255, 255, 0.18);
  --demo-soft: rgba(255, 255, 255, 0.07);
  --demo-ink: rgba(255, 255, 255, 0.94);
  --demo-text: rgba(255, 255, 255, 0.72);
  --demo-muted: rgba(255, 255, 255, 0.56);
  --demo-secondary: rgba(255, 255, 255, 0.05);
  --demo-ring: rgba(143, 189, 242, 0.6);
  --demo-pebble-light: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --demo-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --demo-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --demo-short: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
}
.ui-toaster-demo__frame {
  padding: 6px;
  border-radius: 22px;
  background: var(--demo-frame);
  border: 1px solid var(--demo-hairline);
  box-shadow: var(--demo-drop);
}
.ui-toaster-demo__panel {
  padding: 14px;
  border-radius: 16px;
  background: var(--demo-panel);
  border: 1px solid var(--demo-hairline);
  box-shadow: var(--demo-raised);
}
.ui-toaster-demo__head { display: flex; align-items: center; gap: 12px; padding: 2px 2px 14px; min-width: 0; }
.ui-toaster-demo__head > div { min-width: 0; }
.ui-toaster-demo__pebble {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--demo-panel);
  border: 1px solid var(--demo-hairline);
  box-shadow: var(--demo-pebble-light);
  color: var(--demo-ink);
}
.ui-toaster-demo__title {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-toaster-demo__meta { font-size: 12.5px; line-height: 18px; color: var(--demo-muted); }
.ui-toaster-demo__actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(128px, 1fr)); gap: 6px; }
.ui-toaster-demo__button {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--demo-firm);
  background: var(--demo-secondary);
  box-shadow: var(--demo-short);
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--demo-ink);
  cursor: pointer;
  text-align: left;
  transition: background-color 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
.ui-toaster-demo__button:hover { background: var(--demo-soft); }
.ui-toaster-demo__button:active { transform: translateY(1px); }
.ui-toaster-demo__button:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--demo-ring); }
.ui-toaster-demo__icon {
  flex: none;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: var(--demo-muted);
}
.ui-toaster-demo__pebble .ui-toaster-demo__icon { color: var(--demo-ink); }
.ui-toaster-demo__hint { margin: 0; padding: 9px 8px 5px; text-align: center; font-size: 12.5px; color: var(--demo-muted); }
.ui-toaster-demo__hint kbd {
  display: inline-block;
  min-width: 18px;
  padding: 1px 5px;
  margin: 0 2px;
  border-radius: 6px;
  border: 1px solid var(--demo-hairline);
  border-bottom-color: var(--demo-firm);
  border-bottom-width: 2px;
  background: var(--demo-panel);
  font: inherit;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--demo-ink);
}
.ui-toaster-demo__stage { position: relative; height: 200px; margin-top: 14px; }
.ui-toaster-demo__stage .ui-toaster { width: 100%; max-width: 100%; }
@media (prefers-reduced-motion: reduce) {
  .ui-toaster-demo__button { transition: none; }
  .ui-toaster-demo__button:active { transform: none; }
}
`;
