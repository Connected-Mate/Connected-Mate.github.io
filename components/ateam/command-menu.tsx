"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type Command = {
  id: string;
  label: string;
  /** Muted text after the label, e.g. the tool it runs in. */
  hint?: string;
  /** A brand mark or picture, shown in the pebble. */
  logo?: ReactNode;
  /** A line icon, shown in the pebble when there is no logo. */
  icon?: ReactNode;
  /** Shortcut keys shown on the right, e.g. ["G", "H"]. */
  keys?: string[];
  /** Extra words the search matches. */
  keywords?: string[];
};

export type CommandGroup = {
  id: string;
  label: string;
  commands: Command[];
};

export type CommandMenuProps = {
  groups?: CommandGroup[];
  placeholder?: string;
  onRun?: (id: string, query?: string) => void;
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Icons (line, 16px grid)
 * ----------------------------------------------------------------------------------------------*/

const I = (d: ReactNode) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    {d}
  </svg>
);

export const commandIcons = {
  mail: I(<><rect x="2.5" y="3.5" width="11" height="9" rx="2" /><path d="M3 5l5 3.5L13 5" /></>),
  sparkle: I(<path d="M8 2.5l1.3 3.6 3.7 1.4-3.7 1.4L8 12.5l-1.3-3.6L3 7.5l3.7-1.4z" />),
  task: I(<><rect x="2.5" y="2.5" width="11" height="11" rx="3" /><path d="M5.5 8.2l1.7 1.7 3.3-3.6" /></>),
  contact: I(<><circle cx="6.5" cy="6" r="2.5" /><path d="M2.5 13c.6-2.2 2.2-3.3 4-3.3s3.4 1.1 4 3.3M12 5v4M10 7h4" /></>),
  calendar: I(<><rect x="2.5" y="3.5" width="11" height="10" rx="2" /><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" /></>),
  megaphone: I(<><path d="M3 6.5v3h2l5 3v-9l-5 3z" /><path d="M12.5 6.5c.7.5.7 2.5 0 3" /></>),
  page: I(<><path d="M4 2.5h5l3 3v8H4z" /><path d="M9 2.5v3h3M6 8.5h4M6 11h3" /></>),
  plus: I(<><path d="M4 2.5h5l3 3v8H4z" /><path d="M8 7v4M6 9h4" /></>),
  people: I(<><circle cx="6" cy="6" r="2.2" /><path d="M2.5 12.5c.5-2 1.9-3 3.5-3s3 1 3.5 3M10.5 4.2a2 2 0 010 3.6M11.5 9.6c1 .4 1.7 1.4 2 2.9" /></>),
  upload: I(<><path d="M8 10.5V3M5 5.8L8 3l3 2.8" /><path d="M3 10v2.5h10V10" /></>),
  moon: I(<path d="M12.8 9.6A5 5 0 016.4 3.2a5 5 0 106.4 6.4z" />),
  home: I(<><path d="M2.5 7.5L8 3l5.5 4.5" /><path d="M4 6.5v6.5h8V6.5" /></>),
  inbox: I(<><path d="M2.5 9l1.8-5.5h7.4L13.5 9v3.5h-11z" /><path d="M2.5 9h3l.8 1.5h3.4l.8-1.5h3" /></>),
  chart: I(<><path d="M3 13V3M3 13h10" /><path d="M5.5 10.5V8M8 10.5V5.5M10.5 10.5V7" /></>),
  gear: I(<><circle cx="8" cy="8" r="2" /><path d="M8 2v1.6M8 12.4V14M2 8h1.6M12.4 8H14M3.8 3.8l1.1 1.1M11.1 11.1l1.1 1.1M3.8 12.2l1.1-1.1M11.1 4.9l1.1-1.1" /></>),
  help: I(<><circle cx="8" cy="8" r="5.5" /><path d="M6.4 6.4a1.7 1.7 0 113 1.1c-.6.4-1.4.8-1.4 1.6M8 11.1v.1" /></>),
};

export const defaultCommandGroups: CommandGroup[] = [
  {
    id: "suggestions",
    label: "Suggestions",
    commands: [
      { id: "email", label: "Write an email", hint: "Mail", icon: commandIcons.mail, keywords: ["compose", "message"] },
      { id: "ask", label: "Ask assistant", hint: "Summaries, drafts, answers", icon: commandIcons.sparkle, keywords: ["ai", "chat"] },
      { id: "task", label: "Create a task", hint: "Tasks", icon: commandIcons.task, keywords: ["todo"] },
      { id: "crm", label: "Add contact to CRM", hint: "Contacts", icon: commandIcons.contact, keywords: ["lead", "customer"] },
      { id: "meeting", label: "Schedule a meeting", hint: "Calendar", icon: commandIcons.calendar, keywords: ["event", "call"] },
    ],
  },
  {
    id: "share",
    label: "Share",
    commands: [
      { id: "post", label: "Post an update", hint: "#team-updates", icon: commandIcons.megaphone },
      { id: "save-page", label: "Save as page", hint: "Wiki · Meeting notes", icon: commandIcons.page },
    ],
  },
  {
    id: "general",
    label: "General",
    commands: [
      { id: "new-doc", label: "New document", icon: commandIcons.plus, keys: ["N"] },
      { id: "invite", label: "Invite teammates", icon: commandIcons.people, keys: ["I"] },
      { id: "upload", label: "Upload files", icon: commandIcons.upload, keys: ["U"] },
      { id: "theme", label: "Switch to dark mode", icon: commandIcons.moon, keys: ["⇧", "D"], keywords: ["theme", "light"] },
    ],
  },
  {
    id: "goto",
    label: "Go to",
    commands: [
      { id: "home", label: "Home", icon: commandIcons.home, keys: ["G", "H"] },
      { id: "inbox", label: "Inbox", icon: commandIcons.inbox, keys: ["G", "I"] },
      { id: "reports", label: "Reports", icon: commandIcons.chart, keys: ["G", "R"] },
      { id: "settings", label: "Settings", icon: commandIcons.gear, keys: ["G", "S"] },
      { id: "help", label: "Help & feedback", icon: commandIcons.help, keys: ["?"] },
    ],
  },
];

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

function score(c: Command, group: string, q: string) {
  if (!q) return 1;
  const label = fold(c.label);
  const words = fold(q).split(/\s+/);
  const hay = fold([c.label, c.hint ?? "", group, ...(c.keywords ?? [])].join(" "));
  if (!words.every((w) => hay.includes(w))) return 0;
  return label.startsWith(words[0]) ? 3 : label.includes(words[0]) ? 2 : 1;
}

type Row = { command: Command; group: string; groupIndex: number; id: string; fallback?: boolean };

/* ------------------------------------------------------------------------------------------------
 * CommandMenu
 * ----------------------------------------------------------------------------------------------*/

export function CommandMenu({
  groups = defaultCommandGroups,
  placeholder = "Type a command or search…",
  onRun,
  onClose,
  autoFocus,
  className,
}: CommandMenuProps) {
  const uid = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [pressed, setPressed] = useState<string | null>(null);
  const [ran, setRan] = useState<{ label: string; n: number } | null>(null);
  const [isMac, setIsMac] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const glideRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const p = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform ?? "";
    setIsMac(/mac|iphone|ipad|ipod/i.test(p));
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const sections = useMemo(() => {
    const out: { id: string; label: string; rows: Row[] }[] = [];
    let n = 0;
    groups.forEach((g, gi) => {
      const rows = g.commands
        .map((c) => ({ c, s: score(c, g.label, query) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => (query ? b.s - a.s : 0))
        .map(({ c }) => ({ command: c, group: g.id, groupIndex: gi, id: `${uid}-o${n++}` }));
      if (rows.length) out.push({ id: g.id, label: g.label, rows });
    });
    const q = query.trim();
    if (q) {
      out.push({
        id: "__ask",
        label: "Assistant",
        rows: [
          {
            command: { id: "ask", label: `Ask assistant “${q}”`, icon: commandIcons.sparkle },
            group: "__ask",
            groupIndex: groups.length,
            id: `${uid}-o${n++}`,
            fallback: true,
          },
        ],
      });
    }
    return out;
  }, [groups, query, uid]);

  const rows = useMemo(() => sections.flatMap((s) => s.rows), [sections]);
  const activeIndex = rows.length ? Math.min(active, rows.length - 1) : -1;
  const noMatches = !!query.trim() && rows.length === 1;
  const suggestions = groups.find((g) => g.id === "suggestions")?.commands.slice(0, 5) ?? [];

  const run = (row: Row | undefined) => {
    if (!row) return;
    const q = query.trim();
    setPressed(row.id);
    const name = row.fallback ? `Asked assistant` : row.command.label;
    setRan((r) => ({ label: name, n: (r?.n ?? 0) + 1 }));
    timers.current.push(window.setTimeout(() => setPressed(null), 180));
    timers.current.push(window.setTimeout(() => setRan((r) => (r && r.label === name ? null : r)), 2800));
    onRun?.(row.command.id, row.command.id === "ask" && q ? q : undefined);
  };

  // ⌘K / Ctrl+K focuses the field from anywhere; ⌘1–5 runs a suggestion.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Glide the highlight and keep the active row in view.
  useLayoutEffect(() => {
    const list = listRef.current;
    const glide = glideRef.current;
    if (!list || !glide) return;
    const el = activeIndex >= 0 ? (document.getElementById(rows[activeIndex].id) as HTMLElement | null) : null;
    if (!el) {
      glide.style.opacity = "0";
      return;
    }
    glide.style.opacity = "1";
    glide.style.transform = `translateY(${el.offsetTop}px)`;
    glide.style.height = `${el.offsetHeight}px`;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < list.scrollTop + 4) list.scrollTop = Math.max(0, top - 34);
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 6;
  }, [activeIndex, rows]);

  const sectionStart = (i: number) => {
    let n = 0;
    for (let k = 0; k < i; k++) n += sections[k].rows.length;
    return n;
  };
  const sectionOf = (index: number) => {
    let n = 0;
    for (let k = 0; k < sections.length; k++) {
      n += sections[k].rows.length;
      if (index < n) return k;
    }
    return 0;
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && /^[1-5]$/.test(e.key)) {
      const c = suggestions[Number(e.key) - 1];
      if (c) {
        e.preventDefault();
        const row = rows.find((r) => r.command.id === c.id && r.group === "suggestions");
        run(row ?? { command: c, group: "suggestions", groupIndex: 0, id: "" });
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!rows.length) return;
        const step = e.key === "ArrowDown" ? 1 : -1;
        setActive((activeIndex + step + rows.length) % rows.length);
        return;
      }
      case "Home":
      case "End":
        if (!query) {
          e.preventDefault();
          setActive(e.key === "Home" ? 0 : rows.length - 1);
        }
        return;
      case "PageDown":
      case "PageUp": {
        e.preventDefault();
        const step = e.key === "PageDown" ? 5 : -5;
        setActive(Math.max(0, Math.min(rows.length - 1, activeIndex + step)));
        return;
      }
      case "Tab": {
        if (sections.length < 2) return;
        e.preventDefault();
        const s = sectionOf(activeIndex);
        const nextS = (s + (e.shiftKey ? -1 : 1) + sections.length) % sections.length;
        setActive(sectionStart(nextS));
        return;
      }
      case "Enter":
        e.preventDefault();
        run(rows[activeIndex]);
        return;
      case "Escape":
        e.preventDefault();
        if (query) {
          setQuery("");
          setActive(0);
        } else onClose?.();
        return;
    }
  };

  const modKey = isMac ? "⌘" : "Ctrl";
  let flat = -1;

  return (
    <div className={["ui-cmd", className].filter(Boolean).join(" ")}>
      <style href="ui-command-menu" precedence="default">
        {css}
      </style>
      <div className="ui-cmd__panel">
        <div className="ui-cmd__search">
          <svg className="ui-cmd__lens" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <input
            ref={inputRef}
            className="ui-cmd__input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${uid}-list`}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? rows[activeIndex].id : undefined}
            aria-label="Command"
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
          <span className="ui-cmd__enter" aria-hidden="true">
            <svg viewBox="0 0 12 12">
              <path d="M10 2.5v3.5H3M5 3.8L2.7 6 5 8.2" />
            </svg>
            Enter
          </span>
        </div>

        <div
          ref={listRef}
          id={`${uid}-list`}
          className="ui-cmd__list"
          role="listbox"
          aria-label="Commands"
          onPointerDown={(e) => e.preventDefault()}
        >
          <div ref={glideRef} className="ui-cmd__glide" aria-hidden="true" />
          {noMatches ? (
            <p className="ui-cmd__empty" role="presentation">
              No commands match “{query.trim()}”
            </p>
          ) : null}
          {sections.map((s) => (
            <div key={s.id} className="ui-cmd__group" role="group" aria-labelledby={`${uid}-${s.id}`}>
              <div id={`${uid}-${s.id}`} className="ui-cmd__group-title" role="presentation">
                {s.label}
              </div>
              {s.rows.map((row) => {
                flat++;
                const index = flat;
                const c = row.command;
                const sug = row.group === "suggestions" ? suggestions.findIndex((x) => x.id === c.id) : -1;
                const keys = sug >= 0 ? [modKey, String(sug + 1)] : c.keys;
                return (
                  <div
                    key={row.id}
                    id={row.id}
                    role="option"
                    aria-selected={index === activeIndex}
                    className="ui-cmd__row"
                    data-pressed={pressed === row.id ? "" : undefined}
                    onPointerMove={() => index !== activeIndex && setActive(index)}
                    onClick={() => {
                      setActive(index);
                      run(row);
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                  >
                    <span className="ui-cmd__pebble" aria-hidden="true">
                      {c.logo ?? c.icon}
                    </span>
                    <span className="ui-cmd__text">
                      <span className="ui-cmd__label">{c.label}</span>
                      {c.hint ? <span className="ui-cmd__hint">{c.hint}</span> : null}
                    </span>
                    {keys?.length ? (
                      <span className="ui-cmd__keys" aria-hidden="true">
                        {keys.map((k, i) => (
                          <kbd key={i}>{k}</kbd>
                        ))}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="ui-cmd__foot">
        {ran ? (
          <span className="ui-cmd__ran" key={ran.n}>
            <span className="ui-cmd__ran-check" aria-hidden="true">
              <svg viewBox="0 0 12 12">
                <path d="M2.8 6.3l2.1 2.1 4.3-4.8" />
              </svg>
            </span>
            <span className="ui-cmd__ran-label">{ran.label}</span>
          </span>
        ) : (
          <span className="ui-cmd__tip" aria-hidden="true">
            <kbd>Tab</kbd> to jump between sections
          </span>
        )}
        <span className="ui-cmd__tip ui-cmd__tip--end" aria-hidden="true">
          <kbd>{modKey}</kbd>
          <kbd>K</kbd> to open
        </span>
      </div>
      <span className="ui-cmd__sr" aria-live="polite">
        {ran ? `Ran ${ran.label}` : ""}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-cmd {
  --cmd-frame: #f2f6fa;
  --cmd-panel: #ffffff;
  --cmd-soft: rgba(26, 62, 112, 0.06);
  --cmd-line: #dae2ec;
  --cmd-firm: #cbd6e4;
  --cmd-ink: #00162b;
  --cmd-text: rgba(0, 22, 43, 0.66);
  --cmd-muted: rgba(0, 22, 43, 0.54);
  --cmd-berry: #851437;
  --cmd-info-ink: #1a3e70;
  --cmd-info-fill: #eef5ff;
  --cmd-info-line: #c1daff;
  --cmd-success-ink: #1d6a34;
  --cmd-success-fill: #eafbee;
  --cmd-success-line: #c9f5cf;
  --cmd-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --cmd-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --cmd-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --cmd-ease: cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  max-width: 600px;
  padding: 6px;
  background: var(--cmd-frame);
  border: 1px solid var(--cmd-line);
  border-radius: 22px;
  box-shadow: var(--cmd-raised);
  container-type: inline-size;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: var(--cmd-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-cmd {
  --cmd-frame: #0f2747;
  --cmd-panel: #16345c;
  --cmd-soft: rgba(255, 255, 255, 0.07);
  --cmd-line: rgba(255, 255, 255, 0.12);
  --cmd-firm: rgba(255, 255, 255, 0.18);
  --cmd-ink: rgba(255, 255, 255, 0.94);
  --cmd-text: rgba(255, 255, 255, 0.72);
  --cmd-muted: rgba(255, 255, 255, 0.56);
  --cmd-berry: #a8204d;
  --cmd-info-ink: #c1daff;
  --cmd-info-fill: rgba(143, 189, 242, 0.16);
  --cmd-info-line: rgba(143, 189, 242, 0.34);
  --cmd-success-ink: #7fe0a0;
  --cmd-success-fill: rgba(127, 224, 160, 0.14);
  --cmd-success-line: rgba(127, 224, 160, 0.3);
  --cmd-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --cmd-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --cmd-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
}
.ui-cmd *, .ui-cmd *::before, .ui-cmd *::after { box-sizing: border-box; }

.ui-cmd__panel {
  background: var(--cmd-panel);
  border: 1px solid var(--cmd-line);
  border-radius: 16px;
  box-shadow: var(--cmd-drop);
  overflow: hidden;
}
.ui-cmd__search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid var(--cmd-line);
}
.ui-cmd__lens { flex: none; width: 16px; height: 16px; fill: none; stroke: var(--cmd-muted); stroke-width: 1.6; stroke-linecap: round; }
.ui-cmd__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: 15px;
  color: var(--cmd-ink);
  caret-color: var(--cmd-berry);
}
.ui-cmd__input::placeholder { color: var(--cmd-muted); }
.ui-cmd__search:focus-within { box-shadow: inset 0 -2px 0 -0.5px var(--cmd-info-line); }
.ui-cmd__enter {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--cmd-muted);
}
.ui-cmd__enter svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

.ui-cmd__list {
  position: relative;
  max-height: 340px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px;
  scrollbar-width: thin;
}
.ui-cmd__glide {
  position: absolute;
  left: 6px;
  right: 6px;
  top: 0;
  border-radius: 10px;
  background: var(--cmd-soft);
  box-shadow: inset 0 0 0 1px var(--cmd-line);
  pointer-events: none;
  transition: transform 150ms var(--cmd-ease), height 150ms var(--cmd-ease), opacity 150ms var(--cmd-ease);
}
.ui-cmd__group-title {
  padding: 10px 10px 6px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--cmd-muted);
}
.ui-cmd__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 5px 10px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: transform 150ms var(--cmd-ease);
}
.ui-cmd__row[aria-selected="true"]::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  border-radius: 2px;
  background: var(--cmd-berry);
}
.ui-cmd__row[data-pressed] { transform: scale(0.985); }
.ui-cmd__pebble {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--cmd-panel);
  border: 1px solid var(--cmd-line);
  box-shadow: var(--cmd-pebble);
  color: var(--cmd-info-ink);
}
.ui-cmd__pebble svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.ui-cmd__pebble img { width: 16px; height: 16px; object-fit: contain; }
.ui-cmd__text { display: flex; align-items: baseline; gap: 8px; flex: 1; min-width: 0; }
.ui-cmd__label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
.ui-cmd__hint { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--cmd-muted); font-size: 13px; min-width: 0; }
.ui-cmd__keys { display: inline-flex; gap: 3px; flex: none; }
.ui-cmd kbd {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  color: var(--cmd-text);
  background: var(--cmd-panel);
  border: 1px solid var(--cmd-line);
  border-bottom: 2px solid var(--cmd-firm);
  border-radius: 6px;
}
.ui-cmd__empty { margin: 0; padding: 16px 10px 4px; color: var(--cmd-muted); text-align: center; }

.ui-cmd__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 38px;
  padding: 6px 8px 2px 8px;
  font-size: 12.5px;
  color: var(--cmd-muted);
}
.ui-cmd__tip { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
.ui-cmd__tip kbd + kbd { margin-left: -3px; }
.ui-cmd__ran { display: inline-flex; align-items: center; gap: 8px; min-width: 0; color: var(--cmd-ink); font-weight: 500; animation: ui-cmd-in 300ms var(--cmd-ease); }
.ui-cmd__ran-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-cmd__ran-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: var(--cmd-success-fill);
  border: 1px solid var(--cmd-success-line);
  color: var(--cmd-success-ink);
  animation: ui-cmd-pop 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ui-cmd__ran-check svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

.ui-cmd__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

@container (max-width: 480px) {
  .ui-cmd__hint, .ui-cmd__keys, .ui-cmd__enter, .ui-cmd__tip--end { display: none; }
}
@media (pointer: coarse) {
  .ui-cmd__row { min-height: 44px; }
  .ui-cmd__input { font-size: 16px; }
  .ui-cmd__keys, .ui-cmd__foot .ui-cmd__tip { display: none; }
}

@keyframes ui-cmd-in { from { opacity: 0; transform: translateY(4px); } }
@keyframes ui-cmd-pop { from { transform: scale(0.4); opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .ui-cmd *, .ui-cmd *::before, .ui-cmd *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
  .ui-cmd__row[data-pressed] { transform: none; }
}
`;
