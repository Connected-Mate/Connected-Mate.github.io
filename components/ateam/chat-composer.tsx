"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";

export type ChatModel = {
  id: string;
  name: string;
  description?: string;
  icon?: ReactNode;
};

export type ChatComposerProps = {
  placeholder?: string;
  models?: ChatModel[];
  /** Duration of the connect and approval loading states, in ms */
  loadMs?: number;
  /** Demo transcript shown while recording – replace with real speech-to-text */
  dictation?: string;
  onSend?: (message: string, details: { model: string }) => void;
  onModelChange?: (model: ChatModel) => void;
  onAttach?: () => void;
  onConnectApps?: () => void;
  onRequestApproval?: () => void;
  onSelectProject?: () => void;
  className?: string;
};

/* ---------- icons ---------- */

const I = ({ children, size = 18 }: { children: ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const IconPlus = () => (
  <I>
    <path d="M12 5v14M5 12h14" />
  </I>
);
const IconHand = () => (
  <I>
    <path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V5.5a1.5 1.5 0 0 1 3 0V13" />
    <path d="M17 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.6-2.8L4 15.6a1.6 1.6 0 0 1 2.5-2L8 15" />
  </I>
);
const IconShield = () => (
  <I size={16}>
    <path d="M12 3 5 6v5.5c0 4.3 3 8.1 7 9.5 4-1.4 7-5.2 7-9.5V6l-7-3Z" />
    <path d="M12 8v4.5M12 15.5v.5" />
  </I>
);
const IconChevron = () => (
  <I size={14}>
    <path d="m6 9 6 6 6-6" />
  </I>
);
const IconMic = () => (
  <I>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
  </I>
);
const IconUp = () => (
  <I size={16}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </I>
);
const IconX = () => (
  <I size={16}>
    <path d="M6 6l12 12M18 6 6 18" />
  </I>
);
const IconCheck = () => (
  <I size={16}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </I>
);
const IconFolder = () => (
  <I size={16}>
    <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h3.6l2 2h7.4a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7.5Z" />
  </I>
);
const IconTick = () => (
  <I size={14}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </I>
);
const IconSpark = () => (
  <I size={16}>
    <path d="M12 3.5 13.8 10.2 20.5 12l-6.7 1.8L12 20.5l-1.8-6.7L3.5 12l6.7-1.8L12 3.5Z" />
  </I>
);
const IconRays = () => (
  <I size={16}>
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
  </I>
);
const IconBolt = () => (
  <I size={16}>
    <path d="M13 3 5 13.5h6L10 21l9-11h-6.2L13 3Z" />
  </I>
);

export const defaultModels: ChatModel[] = [
  { id: "auto", name: "Auto", description: "Picks the best model for each task", icon: <IconSpark /> },
  { id: "claude", name: "Claude", description: "Thoughtful writing and code", icon: <IconRays /> },
  { id: "chatgpt", name: "ChatGPT", description: "Quick answers for everyday tasks", icon: <IconBolt /> },
];

const AppMail = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <rect x="1.5" y="3.5" width="13" height="9" rx="2" fill="none" stroke="var(--berry)" strokeWidth="1.5" />
    <path d="m2.5 4.5 5.5 4 5.5-4" fill="none" stroke="var(--berry)" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const AppChat = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M5.5 2.5v11M10.5 2.5v11M2.5 5.5h11M2.5 10.5h11" stroke="var(--info-ink)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const AppTasks = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path d="m3 8.5 3 3 7-7" fill="none" stroke="var(--ok-ink)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- component ---------- */

type Phase = "idle" | "loading" | "done";

export function ChatComposer({
  placeholder = "Start by typing...",
  models = defaultModels,
  loadMs = 1300,
  dictation = "Draft a short update for the team about the launch moving to Thursday",
  onSend,
  onModelChange,
  onAttach,
  onConnectApps,
  onRequestApproval,
  onSelectProject,
  className,
}: ChatComposerProps) {
  const uid = useId();
  const [text, setText] = useState("");
  const [model, setModel] = useState<ChatModel | undefined>(models[0]);
  const [apps, setApps] = useState<Phase>("idle");
  const [approval, setApproval] = useState<Phase>("idle");
  const [announce, setAnnounce] = useState("");
  const [picker, setPicker] = useState<{ open: boolean; active: number; up: boolean }>({
    open: false,
    active: 0,
    up: true,
  });
  const [rec, setRec] = useState<{ on: boolean; words: number }>({ on: false, words: 0 });

  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const modelBtn = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  // Keep the selected model when the list changes, otherwise fall back to the first one.
  useEffect(() => {
    setModel((m) => models.find((x) => x.id === m?.id) ?? models[0]);
  }, [models]);

  /* field grows with its content */
  useLayoutEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [text, rec.on]);

  const send = () => {
    const message = text.trim();
    if (!message) return;
    onSend?.(message, { model: model?.id ?? "" });
    setText("");
    setAnnounce("Message sent");
    fieldRef.current?.focus();
  };

  /* connect apps */
  const connect = () => {
    if (apps !== "idle") return;
    setApps("loading");
    setAnnounce("Connecting apps…");
    onConnectApps?.();
    later(() => {
      setApps("done");
      setAnnounce("Apps connected. Select a project to continue");
    }, loadMs);
  };

  /* approval */
  const requestApproval = () => {
    if (approval === "loading") return;
    if (approval === "done") {
      setApproval("idle");
      setAnnounce("Access back to normal");
      return;
    }
    setApproval("loading");
    setAnnounce("Requesting approval…");
    onRequestApproval?.();
    later(() => {
      setApproval("done");
      setAnnounce("Approved: unrestricted access for this run");
    }, loadMs);
  };

  /* model picker */
  const openPicker = (active = Math.max(0, models.findIndex((m) => m.id === model?.id))) => {
    const r = modelBtn.current?.getBoundingClientRect();
    const up = r ? r.top > window.innerHeight - r.bottom : true;
    setPicker({ open: true, active, up });
  };
  const closePicker = (focusButton = true) => {
    setPicker((p) => ({ ...p, open: false }));
    if (focusButton) modelBtn.current?.focus();
  };
  const choose = (i: number) => {
    const m = models[i];
    if (!m) return;
    setModel(m);
    onModelChange?.(m);
    setAnnounce(`Model: ${m.name}`);
    closePicker();
  };
  useEffect(() => {
    if (!picker.open) return;
    listRef.current?.focus();
    const away = (e: PointerEvent) => {
      if (!listRef.current?.contains(e.target as Node) && !modelBtn.current?.contains(e.target as Node)) {
        setPicker((p) => ({ ...p, open: false }));
      }
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [picker.open]);

  const listKeys = (e: KeyboardEvent) => {
    const n = models.length;
    const move = (to: number) => {
      e.preventDefault();
      setPicker((p) => ({ ...p, active: (to + n) % n }));
    };
    switch (e.key) {
      case "ArrowDown":
        return move(picker.active + 1);
      case "ArrowUp":
        return move(picker.active - 1);
      case "Home":
        return move(0);
      case "End":
        return move(n - 1);
      case "Enter":
      case " ":
        e.preventDefault();
        return choose(picker.active);
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        return closePicker();
      case "Tab":
        return closePicker(false);
    }
  };

  /* dictation */
  const words = dictation.split(/\s+/).filter(Boolean);
  useEffect(() => {
    if (!rec.on || rec.words >= words.length) return;
    const id = window.setTimeout(() => setRec((r) => ({ ...r, words: r.words + 1 })), 260);
    return () => window.clearTimeout(id);
  }, [rec, words.length]);
  const startRec = () => {
    setRec({ on: true, words: 0 });
    setAnnounce("Recording. Press Escape to discard");
  };
  const discardRec = () => {
    setRec({ on: false, words: 0 });
    setAnnounce("Recording discarded");
    later(() => fieldRef.current?.focus(), 0);
  };
  const confirmRec = () => {
    const heard = words.slice(0, rec.words).join(" ");
    setRec({ on: false, words: 0 });
    if (heard) setText((t) => (t.trim() ? `${t.trimEnd()} ${heard}` : heard));
    setAnnounce(heard ? "Transcript added" : "Nothing heard");
    later(() => {
      const el = fieldRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }, 0);
  };
  const pending = 2; // the last words stay grey until the next ones arrive
  const settled = rec.words >= words.length ? rec.words : Math.max(0, rec.words - pending);

  const focusField = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("button, a, textarea, [role='listbox']")) return;
    e.preventDefault();
    fieldRef.current?.focus();
  };

  const canSend = text.trim().length > 0;

  return (
    <div
      ref={rootRef}
      className={["ui-at-cc", className].filter(Boolean).join(" ")}
      data-apps={apps}
      onKeyDown={(e) => {
        if (e.key === "Escape" && rec.on) {
          e.preventDefault();
          discardRec();
        }
      }}
    >
      <style href="ui-chat-composer" precedence="default">
        {css}
      </style>

      <div className="ui-at-cc__fold" data-open={apps === "done" || undefined}>
        <div className="ui-at-cc__clip" inert={apps !== "done"} aria-hidden={apps !== "done"}>
          <div className="ui-at-cc__top">
            <button type="button" className="ui-at-cc__ghost" onClick={() => onSelectProject?.()}>
              <span className="ui-at-cc__folder">
                <IconFolder />
              </span>
              Select a project
            </button>
          </div>
        </div>
      </div>

      <div className="ui-at-cc__card" onMouseDown={focusField}>
        <div className="ui-at-cc__fieldwrap">
          {rec.on ? (
            <p className="ui-at-cc__transcript" aria-live="off">
              {rec.words === 0 && <span className="ui-at-cc__listening">Listening…</span>}
              {words.slice(0, rec.words).map((w, i) => (
                <span key={i} className="ui-at-cc__word" data-pending={i >= settled || undefined}>
                  {w}{" "}
                </span>
              ))}
            </p>
          ) : (
            <textarea
              ref={fieldRef}
              className="ui-at-cc__field"
              rows={1}
              value={text}
              placeholder={placeholder}
              aria-label="Message"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
            />
          )}
        </div>

        {rec.on ? (
          <div className="ui-at-cc__bar" key="rec">
            <button type="button" className="ui-at-cc__icon" onClick={discardRec} aria-label="Discard recording">
              <IconX />
            </button>
            <span className="ui-at-cc__trace" aria-hidden="true">
              <span />
            </span>
            <button type="button" className="ui-at-cc__send" onClick={confirmRec} aria-label="Use transcript">
              <IconCheck />
            </button>
          </div>
        ) : (
          <div className="ui-at-cc__bar" key="tools">
            <button
              type="button"
              className="ui-at-cc__icon"
              aria-label="Add files"
              title="Add files"
              onClick={() => onAttach?.()}
            >
              <IconPlus />
            </button>
            <button
              type="button"
              className="ui-at-cc__approval"
              data-phase={approval}
              aria-busy={approval === "loading"}
              title={approval === "done" ? "Unrestricted access" : "Request approval"}
              aria-label={
                approval === "done"
                  ? "Unrestricted access – click to go back to normal access"
                  : approval === "loading"
                    ? "Requesting approval"
                    : "Request approval"
              }
              onClick={requestApproval}
            >
              <span className="ui-at-cc__approvalicon" aria-hidden="true">
                {approval === "done" ? <IconShield /> : <IconHand />}
              </span>
              <span className="ui-at-cc__approvallabel" key={approval}>
                {approval === "done" ? "Unrestricted access" : approval === "loading" ? "Requesting…" : "Request approval"}
              </span>
            </button>

            <span className="ui-at-cc__spacer" />

            <div className="ui-at-cc__modelwrap">
              <button
                ref={modelBtn}
                type="button"
                className="ui-at-cc__model"
                aria-haspopup="listbox"
                aria-expanded={picker.open}
                aria-controls={`${uid}-models`}
                aria-label={`Model: ${model?.name ?? "none"}`}
                onClick={() => (picker.open ? closePicker() : openPicker())}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const cur = Math.max(0, models.findIndex((m) => m.id === model?.id));
                    openPicker(cur);
                  }
                }}
              >
                <span className="ui-at-cc__modelname">{model?.name}</span>
                <IconChevron />
              </button>
              {picker.open && (
                <ul
                  ref={listRef}
                  id={`${uid}-models`}
                  role="listbox"
                  tabIndex={-1}
                  aria-label="Model"
                  aria-activedescendant={`${uid}-m-${picker.active}`}
                  className="ui-at-cc__list"
                  data-up={picker.up || undefined}
                  onKeyDown={listKeys}
                >
                  <li
                    role="presentation"
                    className="ui-at-cc__hl"
                    aria-hidden="true"
                    style={{ transform: `translateY(${picker.active * 100}%)` }}
                  />
                  {models.map((m, i) => (
                    <li
                      key={m.id}
                      id={`${uid}-m-${i}`}
                      role="option"
                      aria-selected={m.id === model?.id}
                      className="ui-at-cc__opt"
                      data-active={i === picker.active || undefined}
                      onMouseEnter={() => setPicker((p) => ({ ...p, active: i }))}
                      onClick={() => choose(i)}
                    >
                      <span className="ui-at-cc__opticon" aria-hidden="true">
                        {m.icon ?? m.name.slice(0, 1)}
                      </span>
                      <span className="ui-at-cc__opttext">
                        <span className="ui-at-cc__optname">{m.name}</span>
                        {m.description && <span className="ui-at-cc__optdesc">{m.description}</span>}
                      </span>
                      {m.id === model?.id && (
                        <span className="ui-at-cc__tick" aria-hidden="true">
                          <IconTick />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="button" className="ui-at-cc__icon" onClick={startRec} aria-label="Dictate a message">
              <IconMic />
            </button>
            <button
              type="button"
              className="ui-at-cc__send"
              onClick={send}
              disabled={!canSend}
              aria-label="Send message"
            >
              <IconUp />
            </button>
          </div>
        )}
      </div>

      <div className="ui-at-cc__fold" data-open={apps !== "done" || undefined}>
        <div className="ui-at-cc__clip" inert={apps === "done"} aria-hidden={apps === "done"}>
          <div className="ui-at-cc__bottom">
            <button
              type="button"
              className="ui-at-cc__ghost ui-at-cc__connect"
              data-phase={apps}
              aria-busy={apps === "loading"}
              onClick={connect}
            >
              <span className="ui-at-cc__apps" aria-hidden="true">
                <span>
                  <AppMail />
                </span>
                <span>
                  <AppChat />
                </span>
                <span>
                  <AppTasks />
                </span>
              </span>
              {apps === "loading" ? "Connecting apps…" : "Connect apps"}
            </button>
          </div>
        </div>
      </div>

      <div className="ui-at-cc__sr" role="status" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}

const css = /* css */ `
.ui-at-cc {
  --on-berry: #ffffff; --sweep: rgba(143, 189, 242, 0.35);
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --pebble: #ffffff; --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --field-shade: inset 0 1px 2px rgba(26, 62, 112, 0.05);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  --ease: cubic-bezier(.16, 1, .3, 1);
  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 680px;
  min-width: 0;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 15px;
  color: var(--text);
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-cc {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0;
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --pebble: #1d4170; --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --field-shade: inset 0 1px 2px rgba(3, 12, 28, 0.3);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 12px -6px rgba(3, 12, 28, 0.8);
}
.ui-at-cc *, .ui-at-cc *::before, .ui-at-cc *::after { box-sizing: border-box; }
.ui-at-cc button { font: inherit; color: inherit; }
.ui-at-cc :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-cc__fold { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms var(--ease); }
.ui-at-cc__fold[data-open] { grid-template-rows: 1fr; }
.ui-at-cc__clip { min-height: 0; overflow: hidden; }
.ui-at-cc__fold:not([data-open]) .ui-at-cc__clip > * { opacity: 0; }
.ui-at-cc__clip > * { transition: opacity 300ms var(--ease); }
.ui-at-cc__top { padding: 4px 8px 8px; }
.ui-at-cc__bottom { padding: 8px 8px 4px; }

.ui-at-cc__ghost {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 34px;
  padding: 0 10px 0 6px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  font-size: 14px;
  color: var(--text);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cc__ghost:hover { background: var(--soft); color: var(--ink); }
.ui-at-cc__folder { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 7px; background: var(--pebble); border: 1px solid var(--line); box-shadow: var(--pebble-shade); color: var(--info-ink); }

.ui-at-cc__connect { position: relative; overflow: hidden; }
.ui-at-cc__connect[data-phase="loading"] { color: var(--ink); cursor: progress; }
.ui-at-cc__connect[data-phase="loading"]::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 20%, var(--sweep) 50%, transparent 80%);
  transform: translateX(-100%);
  animation: ui-at-cc-sweep 650ms var(--ease) 2;
}
.ui-at-cc__apps { display: inline-flex; }
.ui-at-cc__apps > span {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
}
.ui-at-cc__apps > span + span { margin-left: -4px; }
.ui-at-cc__connect[data-phase="loading"] .ui-at-cc__apps > span { animation: ui-at-cc-hop 520ms var(--ease) infinite; }
.ui-at-cc__connect[data-phase="loading"] .ui-at-cc__apps > span:nth-child(2) { animation-delay: 90ms; }
.ui-at-cc__connect[data-phase="loading"] .ui-at-cc__apps > span:nth-child(3) { animation-delay: 180ms; }

.ui-at-cc__card {
  position: relative;
  padding: 14px 12px 10px 16px;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--raised);
  cursor: text;
}
.ui-at-cc__fieldwrap { min-height: 30px; padding-right: 4px; }
.ui-at-cc__field {
  display: block;
  width: 100%;
  min-height: 30px;
  max-height: 200px;
  margin: 0;
  padding: 3px 0;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  font: inherit;
  font-size: 16px;
  line-height: 1.5;
  color: var(--ink);
  caret-color: var(--berry);
}
.ui-at-cc__field::placeholder { color: var(--muted); }
.ui-at-cc__field:focus-visible { box-shadow: none; }
.ui-at-cc__card:focus-within { border-color: var(--info-line); }
.ui-at-cc__transcript { margin: 0; padding: 3px 0; font-size: 16px; line-height: 1.5; color: var(--ink); min-height: 30px; }
.ui-at-cc__word { transition: color 300ms var(--ease); animation: ui-at-cc-fade 300ms var(--ease) both; }
.ui-at-cc__word[data-pending] { color: var(--muted); }
.ui-at-cc__listening { color: var(--muted); }

.ui-at-cc__bar { display: flex; align-items: center; gap: 4px; margin-top: 10px; margin-left: -6px; animation: ui-at-cc-fade 300ms var(--ease) both; }
.ui-at-cc__spacer { flex: 1; min-width: 4px; }
.ui-at-cc__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cc__icon:hover { background: var(--soft); color: var(--ink); }
.ui-at-cc__approval {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  height: 34px;
  padding: 0 10px 0 7px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  font-size: 14px;
  color: var(--text);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 300ms var(--ease), border-color 300ms var(--ease), color 300ms var(--ease), padding 300ms var(--ease);
}
.ui-at-cc__approval:hover { background: var(--soft); color: var(--ink); }
.ui-at-cc__approvalicon { display: grid; place-items: center; }
.ui-at-cc__approval[data-phase="loading"] { cursor: progress; color: var(--ink); }
.ui-at-cc__approval[data-phase="loading"] .ui-at-cc__approvalicon { animation: ui-at-cc-wave 650ms var(--ease) 2; transform-origin: 60% 90%; }
.ui-at-cc__approval[data-phase="done"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); font-weight: 600; font-size: 13.5px; }
.ui-at-cc__approval[data-phase="done"] .ui-at-cc__approvalicon { animation: ui-at-cc-pop 300ms var(--ease) both; }
.ui-at-cc__approvallabel { overflow: hidden; text-overflow: ellipsis; animation: ui-at-cc-fade 300ms var(--ease) both; }

.ui-at-cc__modelwrap { position: relative; flex: none; }
.ui-at-cc__model {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 34px;
  padding: 0 8px 0 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  font-size: 14px;
  color: var(--text);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cc__model svg { transition: transform 300ms var(--ease); }
.ui-at-cc__model[aria-expanded="true"] svg { transform: rotate(180deg); }
.ui-at-cc__model:hover, .ui-at-cc__model[aria-expanded="true"] { background: var(--soft); color: var(--ink); }
.ui-at-cc__list {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 10;
  width: 292px;
  max-width: calc(100cqw - 24px);
  margin: 0;
  padding: 6px;
  list-style: none;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--line-firm);
  box-shadow: var(--raised);
  outline: none;
  transform-origin: top right;
  animation: ui-at-cc-morph 200ms var(--ease) both;
}
.ui-at-cc__list[data-up] { top: auto; bottom: calc(100% + 8px); transform-origin: bottom right; }
.ui-at-cc__list:focus-visible { box-shadow: var(--raised), 0 0 0 3px var(--ring); }
.ui-at-cc__hl {
  position: absolute;
  left: 6px;
  right: 6px;
  top: 6px;
  height: 54px;
  border-radius: 10px;
  background: var(--info-fill);
  box-shadow: inset 2px 0 0 var(--berry);
  transition: transform 150ms var(--ease);
  pointer-events: none;
}
.ui-at-cc__opt {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 54px;
  padding: 0 10px;
  border-radius: 10px;
  cursor: pointer;
}
.ui-at-cc__opticon {
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
  color: var(--berry);
  font-size: 12px;
  font-weight: 700;
}
.ui-at-cc__opttext { flex: 1; min-width: 0; display: grid; line-height: 1.3; }
.ui-at-cc__optname { font-size: 14px; font-weight: 600; color: var(--ink); }
.ui-at-cc__optdesc { font-size: 12px; color: var(--muted); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-cc__tick { flex: none; color: var(--berry); }

.ui-at-cc__send {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-left: 2px;
  border: 0;
  border-radius: 10px;
  background: var(--berry);
  color: var(--on-berry) !important;
  box-shadow: var(--berry-shadow);
  cursor: pointer;
  transition: background-color 150ms var(--ease), opacity 300ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-cc__send:hover:not(:disabled) { background: var(--berry-hover); }
.ui-at-cc__send:disabled { background: var(--soft); color: var(--muted) !important; box-shadow: inset 0 0 0 1px var(--line); cursor: default; }

.ui-at-cc__trace {
  flex: 1;
  height: 24px;
  margin: 0 6px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
}
.ui-at-cc__trace span {
  display: block;
  width: 200%;
  height: 100%;
  background-image:
    radial-gradient(circle, var(--berry) 1.6px, transparent 2px),
    radial-gradient(circle, var(--info-ink) 1.3px, transparent 1.8px);
  background-size: 9px 8px, 9px 14px;
  background-position: 0 50%, 4.5px 50%;
  background-repeat: repeat-x;
  opacity: 0.8;
  animation: ui-at-cc-scroll 1.6s linear infinite;
}
.ui-at-cc__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@keyframes ui-at-cc-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-cc-pop { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-cc-morph { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: none; } }
@keyframes ui-at-cc-sweep { to { transform: translateX(100%); } }
@keyframes ui-at-cc-hop { 0%, 100% { transform: none; } 40% { transform: translateY(-4px); } }
@keyframes ui-at-cc-wave { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-16deg); } 60% { transform: rotate(12deg); } }
@keyframes ui-at-cc-scroll { to { transform: translateX(-50%); } }

@container (max-width: 420px) {
  .ui-at-cc__approvallabel { display: none; }
  .ui-at-cc__approval { padding: 0 8px; }
  .ui-at-cc__approval[data-phase="done"] .ui-at-cc__approvallabel { display: inline; max-width: 18ch; }
  .ui-at-cc__card { padding: 12px 10px 8px 14px; }
}
@container (max-width: 330px) {
  .ui-at-cc__approval[data-phase="done"] .ui-at-cc__approvallabel { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-cc *, .ui-at-cc *::before, .ui-at-cc *::after {
    animation-duration: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
  }
}
`;
