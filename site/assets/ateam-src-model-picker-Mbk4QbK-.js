var e=`"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type PickerModel = {
  id: string;
  name: string;
  description?: string;
  icon?: ReactNode;
  /** 1 to 5. */
  speed?: number;
  /** 1 to 5. */
  quality?: number;
  /** 1 to 5, 5 is the most expensive. */
  cost?: number;
  /** Time to first token without thinking. */
  latencyMs?: number;
  /** Price per million tokens, in dollars. */
  pricePerM?: number;
};

export type Effort = "low" | "medium" | "high";

export type ModelPickerProps = {
  models: PickerModel[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  thinking?: boolean;
  defaultThinking?: boolean;
  onThinkingChange?: (on: boolean) => void;
  webSearch?: boolean;
  defaultWebSearch?: boolean;
  onWebSearchChange?: (on: boolean) => void;
  effort?: Effort;
  defaultEffort?: Effort;
  onEffortChange?: (effort: Effort) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "end";
  side?: "bottom" | "top";
  className?: string;
};

const EFFORTS: Effort[] = ["low", "medium", "high"];
const EFFORT_LABEL: Record<Effort, string> = { low: "Low", medium: "Medium", high: "High" };
/** First-token time grows with thinking effort. */
const EFFORT_FACTOR: Record<Effort, number> = { low: 1.6, medium: 2.5, high: 4 };

function useControllable<T>(value: T | undefined, initial: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(initial);
  const current = value === undefined ? inner : value;
  const set = useCallback(
    (v: T) => {
      if (value === undefined) setInner(v);
      onChange?.(v);
    },
    [value, onChange],
  );
  return [current, set] as const;
}

const isRouter = (m: PickerModel) => m.speed === undefined && m.quality === undefined && m.cost === undefined;

/* ------------------------------------------------------------------------------------------------
 * ModelPicker
 * ----------------------------------------------------------------------------------------------*/

export function ModelPicker({
  models,
  value,
  defaultValue,
  onChange,
  thinking: thinkingProp,
  defaultThinking = false,
  onThinkingChange,
  webSearch: webProp,
  defaultWebSearch = false,
  onWebSearchChange,
  effort: effortProp,
  defaultEffort = "medium",
  onEffortChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  align = "start",
  side = "bottom",
  className,
}: ModelPickerProps) {
  const uid = useId();
  const [selectedId, setSelected] = useControllable(value, defaultValue ?? models[0]?.id ?? "", onChange);
  const [thinking, setThinking] = useControllable(thinkingProp, defaultThinking, onThinkingChange);
  const [web, setWeb] = useControllable(webProp, defaultWebSearch, onWebSearchChange);
  const [effort, setEffort] = useControllable(effortProp, defaultEffort, onEffortChange);
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);

  const selectedIndex = Math.max(0, models.findIndex((m) => m.id === selectedId));
  const selected = models[selectedIndex];
  const [hot, setHot] = useState(selectedIndex);
  const [announce, setAnnounce] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const focusList = useRef(false);

  // Re-centre the highlight on the chosen model each time the menu opens.
  useEffect(() => {
    if (!open) return;
    setHot(selectedIndex);
    if (focusList.current) {
      focusList.current = false;
      listRef.current?.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, setOpen]);

  const hotModel = models[Math.min(hot, models.length - 1)] ?? selected;
  const factor = thinking ? EFFORT_FACTOR[effort] : 1;
  const latency = hotModel?.latencyMs !== undefined ? (hotModel.latencyMs * factor) / 1000 : undefined;
  const price = hotModel?.pricePerM;

  // Announce the tray once it settles, not while the numbers roll.
  useEffect(() => {
    if (!open || !hotModel) return;
    const t = window.setTimeout(() => {
      setAnnounce(
        latency === undefined && price === undefined
          ? \`\${hotModel.name}: speed and price vary by message\`
          : \`\${hotModel.name}: about \${latency?.toFixed(1)} seconds to first token\${price !== undefined ? \`, $\${price} per million tokens\` : ""}\`,
      );
    }, 700);
    return () => window.clearTimeout(t);
  }, [open, hotModel, latency, price]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  const pick = (i: number) => {
    const m = models[i];
    if (!m) return;
    setSelected(m.id);
    close();
  };

  const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      if (open) {
        listRef.current?.focus();
        return;
      }
      focusList.current = true;
      setOpen(true);
    }
  };

  const onListKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const last = models.length - 1;
    let n: number | null = null;
    if (e.key === "ArrowDown") n = Math.min(last, hot + 1);
    else if (e.key === "ArrowUp") n = Math.max(0, hot - 1);
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = last;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(hot);
      return;
    }
    if (n === null) return;
    e.preventDefault();
    setHot(n);
  };

  return (
    <div
      ref={rootRef}
      className={["ui-mdl", className].filter(Boolean).join(" ")}
      data-open={open ? "" : undefined}
      data-side={side}
      data-align={align}
    >
      <style href="ui-model-picker" precedence="default">
        {css}
      </style>
      <button
        ref={triggerRef}
        type="button"
        className="ui-mdl__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={\`\${uid}-menu\`}
        aria-label={\`Model: \${selected?.name ?? "none"}\${thinking ? ", extended thinking on" : ""}\`}
        onClick={() => {
          if (!open) focusList.current = true;
          setOpen(!open);
        }}
        onKeyDown={onTriggerKey}
      >
        <span className="ui-mdl__glyph ui-mdl__glyph--sm" aria-hidden="true">
          {selected?.icon ?? selected?.name.charAt(0)}
        </span>
        <span className="ui-mdl__trigger-name" key={selected?.id}>
          {selected?.name}
        </span>
        <span className="ui-mdl__bulb" data-on={thinking ? "" : undefined} aria-hidden="true">
          <BulbIcon />
        </span>
        <svg className="ui-mdl__chev" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3 7.5L6 4.5l3 3" />
        </svg>
      </button>

      <div
        id={\`\${uid}-menu\`}
        className="ui-mdl__menu"
        role="dialog"
        aria-label="Model settings"
        inert={!open}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            close();
          }
        }}
      >
        <div className="ui-mdl__panel">
          <div className="ui-mdl__head" aria-hidden="true">
            <span>Model</span>
            <span className="ui-mdl__cols">
              <span>Speed</span>
              <span>Quality</span>
              <span>Cost</span>
            </span>
          </div>
          <div
            ref={listRef}
            className="ui-mdl__list"
            role="listbox"
            tabIndex={0}
            aria-label="Model"
            aria-activedescendant={\`\${uid}-m\${hot}\`}
            data-pointing={hot !== selectedIndex ? "" : undefined}
            onKeyDown={onListKey}
            onPointerLeave={() => setHot(selectedIndex)}
          >
            {models.map((m, i) => {
              const chosen = i === selectedIndex;
              return (
                <div
                  key={m.id}
                  id={\`\${uid}-m\${i}\`}
                  role="option"
                  aria-selected={chosen}
                  className="ui-mdl__row"
                  data-hot={i === hot ? "" : undefined}
                  onPointerMove={() => i !== hot && setHot(i)}
                  onClick={() => pick(i)}
                >
                  <span className="ui-mdl__glyph" aria-hidden="true">
                    {m.icon ?? m.name.charAt(0)}
                  </span>
                  <span className="ui-mdl__text">
                    <span className="ui-mdl__name">
                      {m.name}
                      {chosen ? (
                        <svg className="ui-mdl__tick" viewBox="0 0 12 12" aria-hidden="true">
                          <path d="M2.8 6.3l2.1 2.1 4.3-4.8" />
                        </svg>
                      ) : null}
                    </span>
                    {m.description ? <span className="ui-mdl__desc">{m.description}</span> : null}
                  </span>
                  {isRouter(m) ? (
                    <span className="ui-mdl__varies">Varies</span>
                  ) : (
                    <span className="ui-mdl__cols ui-mdl__bars" aria-hidden="true">
                      <Bars n={m.speed} />
                      <Bars n={m.quality} />
                      <Bars n={m.cost} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="ui-mdl__sep" />

          <Setting id={\`\${uid}-think\`} icon={<BulbIcon />} label="Extended thinking" on={thinking} onToggle={() => setThinking(!thinking)} />
          <div className="ui-mdl__effort-wrap" data-show={thinking ? "" : undefined} inert={!thinking}>
            <div className="ui-mdl__effort-inner">
              <div className="ui-mdl__setting ui-mdl__setting--effort">
                <span className="ui-mdl__setting-icon" aria-hidden="true" />
                <span className="ui-mdl__setting-label" id={\`\${uid}-effort\`}>
                  Effort
                </span>
                <EffortControl value={effort} onChange={setEffort} labelledBy={\`\${uid}-effort\`} />
              </div>
            </div>
          </div>
          <Setting id={\`\${uid}-web\`} icon={<GlobeIcon />} label="Web search" on={web} onToggle={() => setWeb(!web)} />
        </div>

        <div className="ui-mdl__tray">
          <span className="ui-mdl__stats" aria-hidden="true">
            {latency === undefined && price === undefined ? (
              <span>Speed and price vary by message</span>
            ) : (
              <>
                {latency !== undefined ? (
                  <span>
                    ~<b><Roll value={latency} format={(v) => \`\${v.toFixed(1)}s\`} /></b> first token
                  </span>
                ) : null}
                {latency !== undefined && price !== undefined ? <span className="ui-mdl__dot">·</span> : null}
                {price !== undefined ? (
                  <span>
                    <b><Roll value={price} format={(v) => \`$\${Math.round(v)}\`} /></b> / M tokens
                  </span>
                ) : null}
              </>
            )}
          </span>
          <span className="ui-mdl__keys" aria-hidden="true">
            <kbd>↑↓</kbd>
            <kbd>↵</kbd>
          </span>
        </div>
        <span className="ui-mdl__sr" aria-live="polite">
          {announce}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Parts
 * ----------------------------------------------------------------------------------------------*/

function Bars({ n = 0 }: { n?: number }) {
  const v = Math.max(0, Math.min(5, Math.round(n)));
  return (
    <span className="ui-mdl__bar">
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} data-on={i < v ? "" : undefined} style={{ transitionDelay: \`\${i * 30}ms\` }} />
      ))}
    </span>
  );
}

function Setting({
  id,
  icon,
  label,
  on,
  onToggle,
}: {
  id: string;
  icon: ReactNode;
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="ui-mdl__setting"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        onToggle();
      }}
    >
      <span className="ui-mdl__setting-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="ui-mdl__setting-label" id={\`\${id}-l\`}>
        {label}
      </span>
      <button type="button" role="switch" aria-checked={on} aria-labelledby={\`\${id}-l\`} className="ui-mdl__switch" onClick={onToggle}>
        <span className="ui-mdl__knob" />
      </button>
    </div>
  );
}

function EffortControl({ value, onChange, labelledBy }: { value: Effort; onChange: (e: Effort) => void; labelledBy: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = EFFORTS.indexOf(value);
  return (
    <div className="ui-mdl__effort" role="radiogroup" aria-labelledby={labelledBy} style={{ ["--i" as string]: index }}>
      <span className="ui-mdl__thumb" aria-hidden="true" />
      {EFFORTS.map((e, i) => (
        <button
          key={e}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={value === e}
          tabIndex={value === e ? 0 : -1}
          className="ui-mdl__effort-opt"
          onClick={() => onChange(e)}
          onKeyDown={(ev) => {
            const step = ev.key === "ArrowRight" || ev.key === "ArrowDown" ? 1 : ev.key === "ArrowLeft" || ev.key === "ArrowUp" ? -1 : 0;
            if (!step) return;
            ev.preventDefault();
            const n = Math.max(0, Math.min(EFFORTS.length - 1, i + step));
            onChange(EFFORTS[n]);
            refs.current[n]?.focus();
          }}
        >
          {EFFORT_LABEL[e]}
        </button>
      ))}
    </div>
  );
}

/** Shows a number that rolls up into place whenever it changes. */
function Roll({ value, format }: { value: number; format: (v: number) => string }) {
  const text = format(value);
  return (
    <span className="ui-mdl__roll">
      <span key={text}>{text}</span>
    </span>
  );
}

function BulbIcon() {
  return (
    <svg viewBox="0 0 16 16">
      <path d="M6 12.5h4M6.5 14.5h3M8 1.8a4.2 4.2 0 00-2.5 7.6c.5.4.8 1 .8 1.6v.3h3.4V11c0-.6.3-1.2.8-1.6A4.2 4.2 0 008 1.8z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="5.8" />
      <path d="M2.2 8h11.6M8 2.2c1.6 1.6 2.4 3.6 2.4 5.8S9.6 12.2 8 13.8M8 2.2C6.4 3.8 5.6 5.8 5.6 8s.8 4.2 2.4 5.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ \`
.ui-mdl {
  --mdl-frame: #f2f6fa;
  --mdl-panel: #ffffff;
  --mdl-soft: rgba(26, 62, 112, 0.06);
  --mdl-line: #dae2ec;
  --mdl-firm: #cbd6e4;
  --mdl-ink: #00162b;
  --mdl-text: rgba(0, 22, 43, 0.66);
  --mdl-muted: rgba(0, 22, 43, 0.54);
  --mdl-faint: rgba(0, 22, 43, 0.36);
  --mdl-berry: #851437;
  --mdl-info-ink: #1a3e70;
  --mdl-info-fill: #eef5ff;
  --mdl-info-line: #c1daff;
  --mdl-ring: #8fbdf2;
  --mdl-seg-on: #00162b;
  --mdl-seg-dim: #b9c6d6;
  --mdl-seg-off: #e6ecf3;
  --mdl-switch-off: #d5dee9;
  --mdl-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --mdl-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --mdl-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3), 0 8px 16px -8px rgba(26, 62, 112, 0.18);
  --mdl-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  display: inline-block;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: var(--mdl-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-mdl {
  --mdl-frame: #0f2747;
  --mdl-panel: #16345c;
  --mdl-soft: rgba(255, 255, 255, 0.07);
  --mdl-line: rgba(255, 255, 255, 0.12);
  --mdl-firm: rgba(255, 255, 255, 0.18);
  --mdl-ink: rgba(255, 255, 255, 0.94);
  --mdl-text: rgba(255, 255, 255, 0.72);
  --mdl-muted: rgba(255, 255, 255, 0.56);
  --mdl-faint: rgba(255, 255, 255, 0.36);
  --mdl-berry: #a8204d;
  --mdl-info-ink: #c1daff;
  --mdl-info-fill: rgba(143, 189, 242, 0.16);
  --mdl-info-line: rgba(143, 189, 242, 0.34);
  --mdl-ring: rgba(143, 189, 242, 0.6);
  --mdl-seg-on: rgba(255, 255, 255, 0.94);
  --mdl-seg-dim: rgba(255, 255, 255, 0.32);
  --mdl-seg-off: rgba(255, 255, 255, 0.1);
  --mdl-switch-off: rgba(255, 255, 255, 0.2);
  --mdl-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --mdl-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --mdl-float: 0 24px 48px -24px rgba(3, 12, 28, 0.8), 0 8px 16px -8px rgba(3, 12, 28, 0.6);
}
.ui-mdl *, .ui-mdl *::before, .ui-mdl *::after { box-sizing: border-box; }
:where(.ui-mdl) button { font: inherit; color: inherit; }
.ui-mdl :focus-visible { outline: 2px solid var(--mdl-ring); outline-offset: 2px; }

.ui-mdl__trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 32px;
  padding: 0 8px 0 5px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: var(--mdl-soft);
  cursor: pointer;
  font-weight: 600;
  transition: background-color 150ms var(--mdl-ease), border-color 150ms var(--mdl-ease);
}
.ui-mdl__trigger:hover, .ui-mdl[data-open] .ui-mdl__trigger { border-color: var(--mdl-line); background: var(--mdl-panel); }
.ui-mdl__trigger-name { white-space: nowrap; animation: ui-mdl-fade 300ms var(--mdl-ease); }
.ui-mdl__bulb { display: grid; place-items: center; width: 0; overflow: hidden; opacity: 0; color: var(--mdl-berry); transition: width 150ms var(--mdl-ease), opacity 150ms var(--mdl-ease); }
.ui-mdl__bulb[data-on] { width: 14px; opacity: 1; }
.ui-mdl__bulb svg { width: 14px; height: 14px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.ui-mdl__chev { width: 11px; height: 11px; fill: none; stroke: var(--mdl-muted); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; rotate: 180deg; transition: rotate 150ms var(--mdl-ease); }
.ui-mdl[data-side="top"] .ui-mdl__chev { rotate: 0deg; }
.ui-mdl[data-open] .ui-mdl__chev { rotate: 0deg; }
.ui-mdl[data-open][data-side="top"] .ui-mdl__chev { rotate: 180deg; }

.ui-mdl__glyph {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--mdl-panel);
  border: 1px solid var(--mdl-line);
  box-shadow: var(--mdl-pebble);
  color: var(--mdl-info-ink);
  font-size: 11px;
  font-weight: 700;
}
.ui-mdl__glyph svg { width: 13px; height: 13px; }
.ui-mdl__glyph--sm { width: 22px; height: 22px; border-radius: 7px; font-size: 10px; }

/* Menu: matte frame, raised panel, tray in the frame. Kept mounted and inert while closed. */
.ui-mdl__menu {
  position: absolute;
  z-index: 40;
  width: 320px;
  max-width: calc(100vw - 32px);
  padding: 6px;
  background: var(--mdl-frame);
  border: 1px solid var(--mdl-line);
  border-radius: 20px;
  box-shadow: var(--mdl-float);
  opacity: 0;
  visibility: hidden;
  transform: scale(0.96);
  transition: opacity 150ms var(--mdl-ease), transform 150ms var(--mdl-ease), visibility 0s linear 150ms;
}
.ui-mdl[data-open] .ui-mdl__menu { opacity: 1; visibility: visible; transform: none; transition: opacity 150ms var(--mdl-ease), transform 150ms var(--mdl-ease), visibility 0s; }
.ui-mdl[data-side="bottom"] .ui-mdl__menu { top: calc(100% + 8px); }
.ui-mdl[data-side="top"] .ui-mdl__menu { bottom: calc(100% + 8px); }
.ui-mdl[data-align="start"] .ui-mdl__menu { left: 0; }
.ui-mdl[data-align="end"] .ui-mdl__menu { right: 0; }
.ui-mdl[data-side="bottom"][data-align="start"] .ui-mdl__menu { transform-origin: top left; }
.ui-mdl[data-side="bottom"][data-align="end"] .ui-mdl__menu { transform-origin: top right; }
.ui-mdl[data-side="top"][data-align="start"] .ui-mdl__menu { transform-origin: bottom left; }
.ui-mdl[data-side="top"][data-align="end"] .ui-mdl__menu { transform-origin: bottom right; }

.ui-mdl__panel {
  padding: 6px;
  background: var(--mdl-panel);
  border: 1px solid var(--mdl-line);
  border-radius: 15px;
  box-shadow: var(--mdl-drop);
}
.ui-mdl__head { display: flex; align-items: center; justify-content: space-between; padding: 6px 9px 6px 10px; font-size: 11.5px; color: var(--mdl-muted); }
.ui-mdl__cols { display: grid; grid-template-columns: repeat(3, 34px); gap: 4px; text-align: center; flex: none; }
.ui-mdl__list { display: grid; gap: 2px; outline: none; border-radius: 10px; }
.ui-mdl__list:focus-visible { box-shadow: 0 0 0 2px var(--mdl-ring); outline: none; }
.ui-mdl__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 150ms var(--mdl-ease), border-color 150ms var(--mdl-ease);
}
.ui-mdl__row[data-hot] { background: var(--mdl-soft); border-color: var(--mdl-line); }
.ui-mdl__row[aria-selected="true"]::before {
  content: "";
  position: absolute;
  left: 2px;
  top: 12px;
  bottom: 12px;
  width: 2px;
  border-radius: 2px;
  background: var(--mdl-berry);
}
.ui-mdl__text { display: grid; flex: 1; min-width: 0; transition: opacity 150ms var(--mdl-ease); }
.ui-mdl__list[data-pointing] .ui-mdl__row:not([data-hot]) .ui-mdl__text { opacity: 0.55; }
.ui-mdl__name { display: inline-flex; align-items: center; gap: 5px; font-weight: 500; white-space: nowrap; }
.ui-mdl__tick { width: 12px; height: 12px; fill: none; stroke: var(--mdl-berry); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
:where(.dark, [data-theme="dark"]) .ui-mdl__tick { stroke: var(--mdl-info-ink); }
.ui-mdl__desc { font-size: 12.5px; color: var(--mdl-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-mdl__varies { width: 110px; flex: none; text-align: center; font-size: 12px; color: var(--mdl-faint); }
.ui-mdl__bar { display: inline-flex; justify-content: center; gap: 1.5px; }
.ui-mdl__bar i { width: 5px; height: 4px; border-radius: 1.5px; background: var(--mdl-seg-off); transition: background-color 150ms var(--mdl-ease); }
.ui-mdl__bar i[data-on] { background: var(--mdl-seg-dim); }
.ui-mdl__row[data-hot] .ui-mdl__bar i[data-on] { background: var(--mdl-seg-on); }

.ui-mdl__sep { height: 1px; margin: 6px 4px; background: var(--mdl-line); }
.ui-mdl__setting { display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 4px 8px; border-radius: 10px; cursor: pointer; }
.ui-mdl__setting:hover { background: var(--mdl-soft); }
.ui-mdl__setting--effort { cursor: default; }
.ui-mdl__setting--effort:hover { background: transparent; }
.ui-mdl__setting-icon { display: grid; place-items: center; width: 26px; flex: none; color: var(--mdl-text); }
.ui-mdl__setting-icon svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.ui-mdl__setting-label { flex: 1; color: var(--mdl-text); }
.ui-mdl__switch {
  position: relative;
  flex: none;
  width: 30px;
  height: 18px;
  padding: 0;
  border: 1px solid var(--mdl-firm);
  border-radius: 999px;
  background: var(--mdl-switch-off);
  cursor: pointer;
  transition: background-color 150ms var(--mdl-ease), border-color 150ms var(--mdl-ease);
}
.ui-mdl__knob { position: absolute; top: 1px; left: 1px; width: 14px; height: 14px; border-radius: 999px; background: #ffffff; box-shadow: 0 1px 2px rgba(0, 22, 43, 0.3); transition: transform 150ms var(--mdl-ease); }
.ui-mdl__switch[aria-checked="true"] { background: var(--mdl-berry); border-color: var(--mdl-berry); }
.ui-mdl__switch[aria-checked="true"] .ui-mdl__knob { transform: translateX(12px); }

.ui-mdl__effort-wrap { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 300ms var(--mdl-ease), opacity 150ms var(--mdl-ease); }
.ui-mdl__effort-wrap[data-show] { grid-template-rows: 1fr; opacity: 1; }
.ui-mdl__effort-inner { overflow: hidden; min-height: 0; }
.ui-mdl__effort {
  --i: 1;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 178px;
  padding: 2px;
  background: var(--mdl-soft);
  border: 1px solid var(--mdl-line);
  border-radius: 9px;
}
.ui-mdl__thumb {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  width: calc((100% - 4px) / 3);
  border-radius: 7px;
  background: var(--mdl-panel);
  border: 1px solid var(--mdl-line);
  box-shadow: var(--mdl-drop);
  transform: translateX(calc(var(--i) * 100%));
  transition: transform 150ms var(--mdl-ease);
}
.ui-mdl__effort-opt { position: relative; height: 26px; padding: 0 6px; border: 0; background: transparent; border-radius: 7px; color: var(--mdl-muted); font-size: 12.5px; cursor: pointer; transition: color 150ms var(--mdl-ease); }
.ui-mdl__effort-opt[aria-checked="true"] { color: var(--mdl-ink); font-weight: 600; }

.ui-mdl__tray { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 6px 2px 10px; font-size: 12.5px; color: var(--mdl-muted); }
.ui-mdl__stats { display: inline-flex; flex-wrap: wrap; gap: 0 5px; }
.ui-mdl__stats b { color: var(--mdl-ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-mdl__keys { display: inline-flex; gap: 3px; }
.ui-mdl__roll { display: inline-flex; overflow: hidden; vertical-align: bottom; }
.ui-mdl__roll > span { display: inline-block; animation: ui-mdl-roll 300ms var(--mdl-ease); }
.ui-mdl kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  font: inherit;
  font-size: 11px;
  color: var(--mdl-text);
  background: var(--mdl-panel);
  border: 1px solid var(--mdl-line);
  border-bottom: 2px solid var(--mdl-firm);
  border-radius: 6px;
}

.ui-mdl__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

@media (max-width: 300px) {
  .ui-mdl__row > .ui-mdl__glyph, .ui-mdl__keys, .ui-mdl__setting-icon { display: none; }
  .ui-mdl__cols { grid-template-columns: repeat(3, 32px); gap: 2px; }
}
@media (pointer: coarse) {
  .ui-mdl__trigger { height: 40px; }
  .ui-mdl__row { padding: 10px 8px; }
  .ui-mdl__setting { min-height: 44px; }
  .ui-mdl__switch { width: 40px; height: 24px; }
  .ui-mdl__knob { width: 20px; height: 20px; }
  .ui-mdl__switch[aria-checked="true"] .ui-mdl__knob { transform: translateX(16px); }
  .ui-mdl__effort-opt { height: 34px; }
  .ui-mdl__keys { display: none; }
}

@keyframes ui-mdl-fade { from { opacity: 0; } }
@keyframes ui-mdl-roll { from { opacity: 0; transform: translateY(70%); } }

@media (prefers-reduced-motion: reduce) {
  .ui-mdl *, .ui-mdl *::before, .ui-mdl *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
  .ui-mdl__menu, .ui-mdl[data-open] .ui-mdl__menu { transform: none; transition-property: opacity, visibility !important; }
}
\`;
`;export{e as default};
