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

export type Memory = {
  id: string;
  text: string;
  category: string;
  /** Shown as given, e.g. "From chat". */
  source?: string;
  /** Shown as given, e.g. "Oct 12". */
  date?: string;
  paused?: boolean;
};

export type MemoryPanelProps = {
  memories: Memory[];
  /** Called with the full list after any change. With it the panel shows exactly what you pass. */
  onChange?: (memories: Memory[]) => void;
  onAdd?: (memory: Memory) => void;
  onEdit?: (id: string, text: string) => void;
  onPause?: (id: string, paused: boolean) => void;
  onForget?: (id: string) => void;
  onRestore?: (memory: Memory) => void;
  enabled?: boolean;
  defaultEnabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  /** Order of the groups and the choices for new memories. */
  categories?: string[];
  title?: string;
  /** Height of the list in px before it scrolls. */
  maxHeight?: number;
  /** How long Undo stays on the tray after forgetting, in ms. */
  undoFor?: number;
  addedSource?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
};

const ALL = "\u0000all";

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

function short(text: string, n = 28) {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > n ? `${t.slice(0, n).trimEnd()}…` : t;
}

function today() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function newId() {
  return `mem-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function reduced() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

/* ------------------------------------------------------------------------------------------------
 * Icons (drawn for this file)
 * ----------------------------------------------------------------------------------------------*/

const stroke = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
const EditIcon = () => (
  <svg {...stroke}>
    <path d="M10.25 3 13 5.75 6 12.75H3.25V10z" />
  </svg>
);
const PauseIcon = () => (
  <svg {...stroke}>
    <path d="M6 4v8M10 4v8" />
  </svg>
);
const PlayIcon = () => (
  <svg {...stroke}>
    <path d="M5.25 3.75v8.5L12 8z" />
  </svg>
);
const ForgetIcon = () => (
  <svg {...stroke}>
    <path d="M2.75 4.25h10.5M6.25 4.25V2.75h3.5v1.5M4.25 4.25l.6 9h6.3l.6-9" />
  </svg>
);
const SearchIcon = () => (
  <svg {...stroke}>
    <circle cx="7" cy="7" r="4.25" />
    <path d="m10.25 10.25 3 3" />
  </svg>
);
const CloseIcon = () => (
  <svg {...stroke}>
    <path d="m4.5 4.5 7 7m0-7-7 7" />
  </svg>
);
const PlusIcon = () => (
  <svg {...stroke}>
    <path d="M8 3.25v9.5M3.25 8h9.5" />
  </svg>
);
const UndoIcon = () => (
  <svg {...stroke}>
    <path d="M5.5 3.75 2.75 6.5 5.5 9.25" />
    <path d="M2.75 6.5h6.5a3.5 3.5 0 0 1 0 7h-2" />
  </svg>
);

/* A number that rolls to its new value. */
function Roll({ value }: { value: number }) {
  const prev = useRef(value);
  const dir = value > prev.current ? "up" : value < prev.current ? "down" : "none";
  useEffect(() => {
    prev.current = value;
  }, [value]);
  return (
    <span className="ui-at-mem__roll">
      <span key={value} data-dir={dir}>
        {value}
      </span>
    </span>
  );
}

/* A textarea that grows with its text. */
function Field({
  value,
  onChange,
  onKeyDown,
  label,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: ReactKeyboardEvent<HTMLTextAreaElement>) => void;
  label: string;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  useEffect(() => {
    if (!autoFocus) return;
    const el = ref.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.setSelectionRange(el.value.length, el.value.length);
  }, [autoFocus]);
  return (
    <textarea
      ref={ref}
      className="ui-at-mem__field"
      rows={1}
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}

/* ------------------------------------------------------------------------------------------------
 * Component
 * ----------------------------------------------------------------------------------------------*/

export function MemoryPanel({
  memories,
  onChange,
  onAdd,
  onEdit,
  onPause,
  onForget,
  onRestore,
  enabled: enabledProp,
  defaultEnabled = true,
  onEnabledChange,
  categories: categoriesProp,
  title = "Memory",
  maxHeight = 360,
  undoFor = 5000,
  addedSource = "You added",
  action,
  className,
}: MemoryPanelProps) {
  const uid = useId();
  const controlled = !!onChange;
  const [inner, setInner] = useState<Memory[]>(memories);
  const list = controlled ? memories : inner;
  const listRef = useRef(list);
  listRef.current = list;

  const [innerEnabled, setInnerEnabled] = useState(defaultEnabled);
  const enabled = enabledProp ?? innerEnabled;

  const [category, setCategory] = useState<string>(ALL);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null);
  const [adding, setAdding] = useState<{ text: string; category: string } | null>(null);
  const [leaving, setLeaving] = useState<string[]>([]);
  const [entering, setEntering] = useState<string[]>([]);
  const [undo, setUndo] = useState<{ memory: Memory; index: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const undoBtnRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const undoTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const focusAfter = useRef<{ id?: string; undo?: boolean; add?: boolean } | null>(null);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      clearTimeout(undoTimer.current);
    },
    [],
  );
  const later = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const commit = (next: Memory[]) => {
    if (!controlled) setInner(next);
    onChange?.(next);
  };

  const cats = useMemo(() => {
    const seen: string[] = [...(categoriesProp ?? [])];
    for (const m of list) if (!seen.includes(m.category)) seen.push(m.category);
    if (undo && !seen.includes(undo.memory.category)) seen.push(undo.memory.category);
    return seen;
  }, [categoriesProp, list, undo]);

  // A filter on a category that has gone away falls back to All.
  useEffect(() => {
    if (category !== ALL && !cats.includes(category)) setCategory(ALL);
  }, [cats, category]);

  const q = query.trim().toLowerCase();
  const live = list.filter((m) => !leaving.includes(m.id));
  const matches = (m: Memory) =>
    (category === ALL || m.category === category) && (!q || m.text.toLowerCase().includes(q));
  const pausedCount = live.filter((m) => m.paused).length;
  const visibleCount = live.filter(matches).length;

  /* Actions --------------------------------------------------------------------------------------- */
  const setEnabled = (next: boolean) => {
    if (enabledProp === undefined) setInnerEnabled(next);
    onEnabledChange?.(next);
  };

  const togglePause = (m: Memory) => {
    const paused = !m.paused;
    commit(listRef.current.map((x) => (x.id === m.id ? { ...x, paused } : x)));
    onPause?.(m.id, paused);
  };

  const forget = (m: Memory) => {
    if (leaving.includes(m.id)) return;
    const hadFocus = !!rootRef.current?.contains(document.activeElement);
    if (editing?.id === m.id) setEditing(null);
    setLeaving((l) => [...l, m.id]);
    later(reduced() ? 0 : 300, () => {
      const current = listRef.current;
      const index = current.findIndex((x) => x.id === m.id);
      setLeaving((l) => l.filter((id) => id !== m.id));
      if (index < 0) return;
      commit(current.filter((x) => x.id !== m.id));
      onForget?.(m.id);
      setUndo({ memory: current[index]!, index });
      if (hadFocus) focusAfter.current = { undo: true };
      clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => setUndo(null), undoFor);
    });
  };

  const restore = () => {
    if (!undo) return;
    clearTimeout(undoTimer.current);
    const { memory, index } = undo;
    const current = listRef.current.filter((x) => x.id !== memory.id);
    const next = [...current.slice(0, index), memory, ...current.slice(index)];
    commit(next);
    onRestore?.(memory);
    setUndo(null);
    setEntering((e) => [...e, memory.id]);
    // If the filter would hide it, show everything so it can be seen coming back.
    if (!matches(memory)) {
      setCategory(ALL);
      setQuery("");
    }
    focusAfter.current = { id: memory.id };
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntering((e) => e.filter((id) => id !== memory.id))),
    );
  };

  const saveEdit = () => {
    if (!editing) return;
    const text = editing.text.trim();
    if (!text) return;
    const before = listRef.current.find((m) => m.id === editing.id);
    if (before && before.text !== text) {
      commit(listRef.current.map((m) => (m.id === editing.id ? { ...m, text } : m)));
      onEdit?.(editing.id, text);
    }
    focusAfter.current = { id: editing.id };
    setEditing(null);
  };

  const saveNew = () => {
    if (!adding) return;
    const text = adding.text.trim();
    if (!text) return;
    const memory: Memory = { id: newId(), text, category: adding.category, source: addedSource, date: today() };
    commit([...listRef.current, memory]);
    onAdd?.(memory);
    setAdding(null);
    setEntering((e) => [...e, memory.id]);
    if (!matches(memory)) {
      setCategory(ALL);
      setQuery("");
    }
    focusAfter.current = { add: true };
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntering((e) => e.filter((id) => id !== memory.id))),
    );
  };

  const fieldKeys = (save: () => void, cancel: () => void) => (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      cancel();
    }
  };

  /* Focus after a change, and scroll a restored memory into view ------------------------------- */
  useEffect(() => {
    const f = focusAfter.current;
    if (!f) return;
    focusAfter.current = null;
    const root = rootRef.current;
    if (!root) return;
    if (f.undo) undoBtnRef.current?.focus({ preventScroll: true });
    if (f.add) root.querySelector<HTMLElement>(".ui-at-mem__add")?.focus({ preventScroll: true });
    if (f.id) {
      const row = root.querySelector<HTMLElement>(`[data-memory-id="${CSS.escape(f.id)}"]`);
      row?.querySelector<HTMLElement>("[data-act='edit']")?.focus({ preventScroll: true });
      row?.scrollIntoView({ block: "nearest", behavior: reduced() ? "auto" : "smooth" });
    }
  });

  /* Chips: one tab stop, arrow keys ------------------------------------------------------------ */
  const chips = [ALL, ...cats];
  const chipKeys = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const i = chips.indexOf(category);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % chips.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + chips.length) % chips.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = chips.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setCategory(chips[next]!);
    const btn = e.currentTarget.querySelectorAll<HTMLElement>("[role=radio]")[next];
    btn?.focus();
    btn?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const catKeys = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!adding) return;
    const i = cats.indexOf(adding.category);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % cats.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + cats.length) % cats.length;
    if (next < 0) return;
    e.preventDefault();
    setAdding({ ...adding, category: cats[next]! });
    e.currentTarget.querySelectorAll<HTMLElement>("[role=radio]")[next]?.focus();
  };

  const openSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  };
  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  /* Tray line ------------------------------------------------------------------------------------- */
  let trayKey = "counts";
  let trayText: ReactNode = (
    <>
      <strong>
        <Roll value={live.length} />
      </strong>{" "}
      {live.length === 1 ? "memory" : "memories"}
      {pausedCount > 0 && (
        <>
          {" · "}
          <Roll value={pausedCount} /> paused
        </>
      )}
    </>
  );
  let traySpoken = `${plural(live.length, "memory", "memories")}${pausedCount ? `, ${pausedCount} paused` : ""}`;
  if (editing || adding) {
    trayKey = "hint";
    trayText = (
      <>
        <kbd>Enter</kbd> to save · <kbd>Shift</kbd> + <kbd>Enter</kbd> new line · <kbd>Esc</kbd> to cancel
      </>
    );
    traySpoken = "Enter to save, Shift Enter for a new line, Escape to cancel";
  } else if (undo) {
    trayKey = `undo-${undo.memory.id}`;
    trayText = (
      <>
        Forgot “<strong>{undo.memory.text}</strong>”
      </>
    );
    traySpoken = `Forgot “${undo.memory.text}”. Undo is available.`;
  } else if (q && !visibleCount) {
    trayKey = "none";
  }

  /* Render ---------------------------------------------------------------------------------------- */
  const noteId = `${uid}-note`;
  const empty = list.length === 0 && leaving.length === 0;

  return (
    <div
      ref={rootRef}
      className={["ui-at-mem", className].filter(Boolean).join(" ")}
      role="group"
      aria-labelledby={`${uid}-title`}
      data-off={!enabled || undefined}
    >
      <style href="ui-memory-panel" precedence="default">
        {css}
      </style>
      <div className="ui-at-mem__panel">
        <div className="ui-at-mem__head">
          <h3 id={`${uid}-title`} className="ui-at-mem__title">
            {title}
            <span className="ui-at-mem__badge" aria-label={plural(live.length, "memory", "memories")}>
              <Roll value={live.length} />
            </span>
          </h3>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-controls={noteId}
            aria-label="Use memory"
            className="ui-at-mem__switch"
            onClick={() => setEnabled(!enabled)}
          >
            <span className="ui-at-mem__switch-label" aria-hidden="true">
              Use memory
            </span>
            <span className="ui-at-mem__track" aria-hidden="true">
              <span className="ui-at-mem__knob" />
            </span>
          </button>
        </div>

        <div id={noteId} className="ui-at-mem__fold" data-open={!enabled || undefined} inert={enabled}>
          <div>
            <p className="ui-at-mem__note">
              Memory is off. The assistant won't use or save memories in new chats – what's here stays until you
              forget it.
            </p>
          </div>
        </div>

        {!empty && (
          <div className="ui-at-mem__filters">
            {searchOpen ? (
              <div className="ui-at-mem__search">
                <SearchIcon />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  placeholder="Search memories"
                  aria-label="Search memories"
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault();
                      closeSearch();
                      requestAnimationFrame(() =>
                        rootRef.current?.querySelector<HTMLElement>(".ui-at-mem__search-btn")?.focus(),
                      );
                    }
                  }}
                />
                <button type="button" className="ui-at-mem__icon-btn" aria-label="Close search" onClick={closeSearch}>
                  <CloseIcon />
                </button>
              </div>
            ) : (
              <>
                <div className="ui-at-mem__chips" role="radiogroup" aria-label="Category" onKeyDown={chipKeys}>
                  {chips.map((c) => {
                    const n = live.filter((m) => c === ALL || m.category === c).length;
                    const on = c === category;
                    return (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        tabIndex={on ? 0 : -1}
                        className="ui-at-mem__chip"
                        onClick={() => setCategory(c)}
                      >
                        {c === ALL ? "All" : c}
                        <span className="ui-at-mem__chip-n">
                          <Roll value={n} />
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="ui-at-mem__icon-btn ui-at-mem__search-btn"
                  aria-label="Search memories"
                  onClick={openSearch}
                >
                  <SearchIcon />
                </button>
              </>
            )}
          </div>
        )}

        <div ref={scrollRef} className="ui-at-mem__scroll" style={{ maxHeight }}>
          {empty ? (
            <p className="ui-at-mem__empty">
              Nothing remembered yet. What you add here, or what the assistant keeps from your chats, shows up here.
            </p>
          ) : (
            <>
              {cats.map((cat) => {
                const rows = list.filter((m) => m.category === cat);
                if (!rows.length) return null;
                const open = rows.some((m) => matches(m) && !leaving.includes(m.id));
                return (
                  <section
                    key={cat}
                    className="ui-at-mem__fold"
                    data-open={open || undefined}
                    inert={!open}
                    aria-labelledby={`${uid}-g-${cat}`}
                  >
                    <div>
                      <h4 id={`${uid}-g-${cat}`} className="ui-at-mem__group">
                        {cat}
                      </h4>
                      {rows.map((m) => {
                        const shown = matches(m) && !leaving.includes(m.id) && !entering.includes(m.id);
                        const isEditing = editing?.id === m.id;
                        return (
                          <div
                            key={m.id}
                            className="ui-at-mem__fold ui-at-mem__fold--row"
                            data-open={shown || undefined}
                            data-leaving={leaving.includes(m.id) || undefined}
                            data-memory-id={m.id}
                            inert={!shown}
                          >
                            <div>
                              <article className="ui-at-mem__row" data-paused={m.paused || undefined} data-editing={isEditing || undefined}>
                                {isEditing ? (
                                  <div className="ui-at-mem__editor">
                                    <Field
                                      value={editing.text}
                                      label={`Edit memory “${short(m.text)}”`}
                                      onChange={(text) => setEditing({ id: m.id, text })}
                                      onKeyDown={fieldKeys(saveEdit, () => {
                                        focusAfter.current = { id: m.id };
                                        setEditing(null);
                                      })}
                                      autoFocus
                                    />
                                    <div className="ui-at-mem__editor-actions">
                                      <button
                                        type="button"
                                        className="ui-at-mem__btn"
                                        data-variant="ghost"
                                        onClick={() => {
                                          focusAfter.current = { id: m.id };
                                          setEditing(null);
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        className="ui-at-mem__btn"
                                        data-variant="primary"
                                        aria-disabled={!editing.text.trim() || undefined}
                                        onClick={saveEdit}
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="ui-at-mem__body">
                                      <p className="ui-at-mem__text">{m.text}</p>
                                      <p className="ui-at-mem__meta">
                                        {[m.source, m.date].filter(Boolean).join(" · ")}
                                        <span className="ui-at-mem__paused" data-on={m.paused || undefined}>
                                          Paused
                                        </span>
                                      </p>
                                    </div>
                                    <div className="ui-at-mem__acts">
                                      <button
                                        type="button"
                                        data-act="edit"
                                        className="ui-at-mem__icon-btn"
                                        aria-label={`Edit “${short(m.text)}”`}
                                        title="Edit"
                                        onClick={() => {
                                          setAdding(null);
                                          setEditing({ id: m.id, text: m.text });
                                        }}
                                      >
                                        <EditIcon />
                                      </button>
                                      <button
                                        type="button"
                                        data-act="pause"
                                        className="ui-at-mem__icon-btn"
                                        aria-label={`${m.paused ? "Resume" : "Pause"} “${short(m.text)}”`}
                                        title={m.paused ? "Resume" : "Pause"}
                                        onClick={() => togglePause(m)}
                                      >
                                        <span className="ui-at-mem__swap" key={m.paused ? "play" : "pause"}>
                                          {m.paused ? <PlayIcon /> : <PauseIcon />}
                                        </span>
                                      </button>
                                      <button
                                        type="button"
                                        data-act="forget"
                                        className="ui-at-mem__icon-btn"
                                        data-tone="danger"
                                        aria-label={`Forget “${short(m.text)}”`}
                                        title="Forget"
                                        onClick={() => forget(m)}
                                      >
                                        <ForgetIcon />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </article>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
              {visibleCount === 0 && (
                <p className="ui-at-mem__empty">
                  {q ? `No memories match “${query.trim()}”.` : "No memories in this category."}
                </p>
              )}
            </>
          )}
        </div>

        <div className="ui-at-mem__foot">
          {adding ? (
            <div className="ui-at-mem__new">
              <Field
                value={adding.text}
                label="New memory"
                onChange={(text) => setAdding({ ...adding, text })}
                onKeyDown={fieldKeys(saveNew, () => {
                  focusAfter.current = { add: true };
                  setAdding(null);
                })}
                autoFocus
              />
              <div className="ui-at-mem__new-row">
                <div className="ui-at-mem__cats" role="radiogroup" aria-label="Category of the new memory" onKeyDown={catKeys}>
                  {cats.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={adding.category === c}
                      tabIndex={adding.category === c ? 0 : -1}
                      className="ui-at-mem__chip"
                      data-size="s"
                      onClick={() => setAdding({ ...adding, category: c })}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="ui-at-mem__editor-actions">
                  <button
                    type="button"
                    className="ui-at-mem__btn"
                    data-variant="ghost"
                    onClick={() => {
                      focusAfter.current = { add: true };
                      setAdding(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="ui-at-mem__btn"
                    data-variant="primary"
                    aria-disabled={!adding.text.trim() || undefined}
                    onClick={saveNew}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="ui-at-mem__add"
              onClick={() => {
                setEditing(null);
                setAdding({ text: "", category: category !== ALL ? category : (cats[0] ?? "General") });
              }}
            >
              <PlusIcon />
              New memory
            </button>
          )}
        </div>
      </div>

      <div className="ui-at-mem__tray">
        <p className="ui-at-mem__tray-text" key={trayKey} aria-hidden="true">
          {trayKey === "none" ? "Nothing found" : trayText}
        </p>
        <span className="ui-at-mem__sr" role="status" aria-live="polite">
          {traySpoken}
        </span>
        {undo && !editing && !adding ? (
          <button ref={undoBtnRef} type="button" className="ui-at-mem__tray-btn" onClick={restore}>
            <UndoIcon />
            Undo
          </button>
        ) : (
          action && (
            <button type="button" className="ui-at-mem__tray-btn" onClick={action.onClick}>
              {action.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-at-mem {
  --frame: #f2f6fa;
  --panel: #ffffff;
  --soft: rgba(26, 62, 112, 0.06);
  --hairline: #dae2ec;
  --firm: #cbd6e4;
  --ink: #00162b;
  --text: rgba(0, 22, 43, 0.66);
  --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437;
  --berry-hover: #6d0f2d;
  --secondary: #fbfcfe;
  --info-ink: #1a3e70;
  --info-fill: #eef5ff;
  --info-line: #c1daff;
  --ring: #8fbdf2;
  --bad-ink: #8a3a22;
  --bad-fill: #fdeee8;
  --track-off: #cbd6e4;
  --shadow-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --shadow-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --shadow-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);

  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 380px;
  min-width: 0;
  container-type: inline-size;
  background: var(--frame);
  border: 1px solid var(--hairline);
  border-radius: 22px;
  padding: 6px;
  box-shadow: var(--shadow-float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-mem {
  --frame: #0f2747;
  --panel: #16345c;
  --soft: rgba(255, 255, 255, 0.07);
  --hairline: rgba(255, 255, 255, 0.12);
  --firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94);
  --text: rgba(255, 255, 255, 0.72);
  --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d;
  --berry-hover: #bd2a5a;
  --secondary: rgba(255, 255, 255, 0.06);
  --info-ink: #c1daff;
  --info-fill: rgba(143, 189, 242, 0.16);
  --info-line: rgba(143, 189, 242, 0.3);
  --ring: rgba(143, 189, 242, 0.6);
  --bad-ink: #f2a48c;
  --bad-fill: rgba(242, 164, 140, 0.14);
  --track-off: rgba(255, 255, 255, 0.22);
  --shadow-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --shadow-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --shadow-float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-mem *, .ui-at-mem *::before, .ui-at-mem *::after { box-sizing: border-box; }
.ui-at-mem p, .ui-at-mem h3, .ui-at-mem h4 { margin: 0; }

.ui-at-mem__panel {
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  box-shadow: var(--shadow-raised);
  overflow: hidden;
}
.ui-at-mem__head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 12px 8px 14px; }
.ui-at-mem__title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
}
.ui-at-mem__badge {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid var(--hairline);
  background: var(--soft);
  color: var(--text);
  font: 600 11.5px/1 "Avenir Next", Avenir, system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
}
.ui-at-mem__roll { display: inline-block; overflow: hidden; vertical-align: bottom; line-height: inherit; }
.ui-at-mem__roll > span { display: inline-block; }
.ui-at-mem__roll > span[data-dir="up"] { animation: ui-at-mem-up 300ms var(--ease) both; }
.ui-at-mem__roll > span[data-dir="down"] { animation: ui-at-mem-down 300ms var(--ease) both; }

.ui-at-mem__switch {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px 4px 8px;
  margin: -4px -4px -4px 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text);
  font: inherit;
  cursor: pointer;
}
.ui-at-mem__switch:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__track {
  position: relative;
  width: 30px;
  height: 18px;
  border-radius: 999px;
  background: var(--track-off);
  box-shadow: inset 0 1px 2px rgba(0, 22, 43, 0.15);
  transition: background-color 300ms var(--ease);
}
.ui-at-mem__switch[aria-checked="true"] .ui-at-mem__track { background: var(--berry); }
.ui-at-mem__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 22, 43, 0.3);
  transition: transform 150ms var(--ease);
}
.ui-at-mem__switch[aria-checked="true"] .ui-at-mem__knob { transform: translateX(12px); }

/* Folding: rows, groups and the off note open and close on a grid track. */
.ui-at-mem__fold {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms var(--ease), opacity 300ms var(--ease), filter 300ms var(--ease);
}
.ui-at-mem__fold > div { min-height: 0; overflow: hidden; }
.ui-at-mem__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-at-mem__fold[data-leaving] { filter: blur(3px); }

.ui-at-mem__note {
  margin: 0 12px 8px !important;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--info-line);
  background: var(--info-fill);
  color: var(--info-ink);
  font-size: 12px;
}

.ui-at-mem__filters {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px 8px 12px;
  border-bottom: 1px solid var(--hairline);
  min-width: 0;
}
.ui-at-mem__chips {
  flex: 1;
  display: flex;
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 2px;
  margin: -2px;
  mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
}
.ui-at-mem__chips::-webkit-scrollbar { display: none; }
.ui-at-mem__chip {
  appearance: none;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 9px;
  border-radius: 9px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-mem__chip:hover { color: var(--ink); background: var(--soft); }
.ui-at-mem__chip[aria-checked="true"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-mem__chip:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__chip[data-size="s"] { height: 26px; font-size: 12px; }
.ui-at-mem__chip-n { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.ui-at-mem__chip[aria-checked="true"] .ui-at-mem__chip-n { color: inherit; opacity: 0.75; }

.ui-at-mem__icon-btn {
  appearance: none;
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), transform 150ms var(--ease);
}
.ui-at-mem__icon-btn svg { width: 15px; height: 15px; }
.ui-at-mem__icon-btn:hover { background: var(--soft); color: var(--ink); }
.ui-at-mem__icon-btn[data-tone="danger"]:hover { background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-mem__icon-btn:active { transform: scale(0.92); }
.ui-at-mem__icon-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-mem__search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 2px 0 10px;
  border-radius: 10px;
  border: 1px solid var(--firm);
  background: var(--panel);
  box-shadow: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  color: var(--muted);
  animation: ui-at-mem-fade 150ms var(--ease) both;
}
.ui-at-mem__search:focus-within { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__search > svg { width: 14px; height: 14px; flex: none; }
.ui-at-mem__search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  caret-color: var(--berry);
  font: inherit;
}
.ui-at-mem__search input::-webkit-search-cancel-button { display: none; }
.ui-at-mem__search .ui-at-mem__icon-btn { width: 26px; height: 26px; }

.ui-at-mem__scroll { overflow-y: auto; overscroll-behavior: contain; padding: 6px 0; scrollbar-width: thin; }
.ui-at-mem__group { padding: 8px 14px 2px; font-size: 12px; font-weight: 500; color: var(--muted); }
.ui-at-mem__row {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 8px 6px 14px;
  transition: background-color 150ms var(--ease);
}
.ui-at-mem__row:hover, .ui-at-mem__row:focus-within { background: var(--soft); }
.ui-at-mem__row[data-editing] { background: transparent; }
.ui-at-mem__body { flex: 1; min-width: 0; }
.ui-at-mem__text { color: var(--ink); overflow-wrap: anywhere; transition: color 300ms var(--ease); }
.ui-at-mem__row[data-paused] .ui-at-mem__text { color: var(--muted); }
.ui-at-mem__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 0 6px; margin-top: 2px !important; color: var(--muted); font-size: 12px; }
.ui-at-mem__paused {
  display: none;
  height: 18px;
  padding: 0 6px;
  border-radius: 5px;
  border: 1px solid var(--info-line);
  background: var(--info-fill);
  color: var(--info-ink);
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
}
.ui-at-mem__paused[data-on] { display: inline-block; animation: ui-at-mem-fade 300ms var(--ease) both; }
.ui-at-mem__acts {
  position: absolute;
  top: 4px;
  right: 6px;
  display: flex;
  gap: 1px;
  padding: 2px;
  border-radius: 10px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-drop);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms var(--ease);
}
.ui-at-mem__row:hover .ui-at-mem__acts, .ui-at-mem__row:focus-within .ui-at-mem__acts { pointer-events: auto; }
.ui-at-mem__row:hover .ui-at-mem__acts, .ui-at-mem__row:focus-within .ui-at-mem__acts { opacity: 1; }
.ui-at-mem__swap { display: grid; animation: ui-at-mem-pop 150ms var(--ease) both; }

.ui-at-mem__editor, .ui-at-mem__new { flex: 1; display: grid; gap: 8px; min-width: 0; }
.ui-at-mem__field {
  display: block;
  width: 100%;
  min-height: 36px;
  max-height: 160px;
  padding: 8px 10px;
  resize: none;
  border-radius: 10px;
  border: 1px solid var(--firm);
  background: var(--panel);
  box-shadow: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  color: var(--ink);
  caret-color: var(--berry);
  font: inherit;
  line-height: 1.45;
  outline: none;
}
.ui-at-mem__field:focus { border-color: var(--ring); box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__editor-actions { display: flex; justify-content: flex-end; gap: 6px; flex: none; }
.ui-at-mem__btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms var(--ease), transform 150ms var(--ease), opacity 150ms var(--ease);
}
.ui-at-mem__btn:active:not([aria-disabled]) { transform: scale(0.97); }
.ui-at-mem__btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__btn[data-variant="ghost"] { background: transparent; color: var(--ink); }
.ui-at-mem__btn[data-variant="ghost"]:hover { background: var(--soft); }
.ui-at-mem__btn[data-variant="primary"] {
  background: var(--berry);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-mem__btn[data-variant="primary"]:hover:not([aria-disabled]) { background: var(--berry-hover); }
.ui-at-mem__btn[aria-disabled] { opacity: 0.45; cursor: default; }

.ui-at-mem__foot { border-top: 1px solid var(--hairline); padding: 6px; }
.ui-at-mem__add {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-mem__add svg { width: 14px; height: 14px; }
.ui-at-mem__add:hover { background: var(--soft); color: var(--ink); }
.ui-at-mem__add:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__new { padding: 4px; animation: ui-at-mem-fade 150ms var(--ease) both; }
.ui-at-mem__new-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: space-between; }
.ui-at-mem__cats { display: flex; gap: 2px; flex-wrap: wrap; min-width: 0; }

.ui-at-mem__empty { padding: 18px 16px !important; text-align: center; color: var(--muted); font-size: 12.5px; }

.ui-at-mem__tray { display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 4px 4px 2px 10px; }
.ui-at-mem__tray-text {
  flex: 1;
  min-width: 0;
  color: var(--muted);
  font-size: 12.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: ui-at-mem-fade 300ms var(--ease) both;
}
.ui-at-mem__tray-text strong { color: var(--ink); font-weight: 600; }
.ui-at-mem__tray-text kbd {
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 17px;
  padding: 0 4px;
  border-radius: 5px;
  border: 1px solid var(--hairline);
  border-bottom-color: var(--firm);
  background: var(--panel);
  color: var(--text);
  font: 500 10.5px/1 "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-mem__tray-btn {
  appearance: none;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid var(--firm);
  background: var(--secondary);
  box-shadow: var(--shadow-drop);
  color: var(--ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  animation: ui-at-mem-fade 300ms var(--ease) both;
  transition: transform 150ms var(--ease);
}
.ui-at-mem__tray-btn svg { width: 14px; height: 14px; }
.ui-at-mem__tray-btn:active { transform: scale(0.97); }
.ui-at-mem__tray-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-mem[data-off] .ui-at-mem__scroll, .ui-at-mem[data-off] .ui-at-mem__filters { opacity: 0.5; transition: opacity 300ms var(--ease); }
.ui-at-mem__scroll, .ui-at-mem__filters { transition: opacity 300ms var(--ease); }

.ui-at-mem__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@keyframes ui-at-mem-up { from { transform: translateY(70%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-mem-down { from { transform: translateY(-70%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-mem-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-mem-pop { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }

@container (max-width: 340px) {
  .ui-at-mem__chip-n { display: none; }
}
@container (max-width: 320px) {
  .ui-at-mem__switch-label { display: none; }
}
@media (hover: none) {
  .ui-at-mem__acts { position: static; opacity: 1; pointer-events: auto; padding: 0; border: 0; background: none; box-shadow: none; }
  .ui-at-mem__icon-btn { width: 36px; height: 36px; }
  .ui-at-mem__chip { height: 36px; }
  .ui-at-mem__add, .ui-at-mem__btn, .ui-at-mem__tray-btn { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-mem, .ui-at-mem *, .ui-at-mem *::before, .ui-at-mem *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
  }
}
`;
