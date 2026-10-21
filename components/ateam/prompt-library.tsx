"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type PromptTone = "blue" | "violet" | "amber" | "green" | "red" | "gray";
export type PromptVariable = { description?: string; default?: string };

export type PromptTemplate = {
  id: string;
  title: string;
  category?: string;
  tone?: PromptTone;
  body: string;
  variables?: Record<string, PromptVariable>;
};

export type PromptLibraryProps = {
  templates: PromptTemplate[];
  value?: string;
  defaultValue?: string;
  onSelect?: (id: string) => void;
  onUse?: (prompt: string, template: PromptTemplate, values: Record<string, string>) => void;
  onCopy?: (prompt: string) => void;
  title?: string;
  useLabel?: string;
  className?: string;
};

type Part = { kind: "text"; text: string } | { kind: "var"; name: string };

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const VARIABLE = /\{([A-Za-z0-9_-]+)\}/g;
const TONE_ORDER: PromptTone[] = ["blue", "violet", "amber", "green", "red", "gray"];

function parse(body: string): Part[] {
  const parts: Part[] = [];
  let last = 0;
  for (const match of body.matchAll(VARIABLE)) {
    const at = match.index ?? 0;
    if (at > last) parts.push({ kind: "text", text: body.slice(last, at) });
    parts.push({ kind: "var", name: match[1] });
    last = at + match[0].length;
  }
  if (last < body.length) parts.push({ kind: "text", text: body.slice(last) });
  return parts;
}

function variableNames(parts: Part[]) {
  const seen: string[] = [];
  for (const part of parts) if (part.kind === "var" && !seen.includes(part.name)) seen.push(part.name);
  return seen;
}

function fill(parts: Part[], values: Record<string, string>) {
  return parts.map((part) => (part.kind === "text" ? part.text : values[part.name]?.trim() || `{${part.name}}`)).join("");
}

function defaultsOf(template: PromptTemplate): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [name, variable] of Object.entries(template.variables ?? {})) {
    if (variable.default) values[name] = variable.default;
  }
  return values;
}

function humanize(name: string) {
  return name.replace(/[-_]+/g, " ");
}

async function writeClipboard(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the older way
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ------------------------------------------------------------------------------------------------
 * Prompt library
 * ----------------------------------------------------------------------------------------------*/

export function PromptLibrary({
  templates,
  value,
  defaultValue,
  onSelect,
  onUse,
  onCopy,
  title = "Prompts",
  useLabel = "Use prompt",
  className,
}: PromptLibraryProps) {
  const uid = useId().replace(/:/g, "");
  const [ownId, setOwnId] = useState(defaultValue ?? templates[0]?.id ?? "");
  const selectedId = value ?? ownId;
  const template = templates.find((item) => item.id === selectedId) ?? templates[0];

  const [query, setQuery] = useState("");
  const [valuesById, setValuesById] = useState<Record<string, Record<string, string>>>({});
  const [flash, setFlash] = useState<{ name: string; key: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [announce, setAnnounce] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const fieldsRef = useRef(new Map<string, HTMLInputElement>());

  // Category tones follow the order categories appear in, unless a template sets one.
  const toneOf = useMemo(() => {
    const map = new Map<string, PromptTone>();
    for (const item of templates) {
      if (!item.category) continue;
      if (item.tone && !map.has(item.category)) map.set(item.category, item.tone);
    }
    let next = 0;
    for (const item of templates) {
      if (!item.category || map.has(item.category)) continue;
      map.set(item.category, TONE_ORDER[next++ % TONE_ORDER.length]);
    }
    return (item: PromptTemplate): PromptTone => item.tone ?? (item.category ? map.get(item.category) ?? "gray" : "gray");
  }, [templates]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return templates;
    return templates.filter((item) =>
      [item.title, item.category ?? "", item.body].some((text) => text.toLowerCase().includes(needle)),
    );
  }, [templates, query]);

  const select = useCallback(
    (id: string) => {
      if (id === selectedId) return;
      if (value === undefined) setOwnId(id);
      onSelect?.(id);
    },
    [selectedId, value, onSelect],
  );

  const parts = useMemo(() => (template ? parse(template.body) : []), [template]);
  const names = useMemo(() => variableNames(parts), [parts]);
  const values = useMemo(
    () => (template ? { ...defaultsOf(template), ...(valuesById[template.id] ?? {}) } : {}),
    [template, valuesById],
  );
  const filled = names.filter((name) => values[name]?.trim()).length;
  const missing = names.length - filled;
  const prompt = useMemo(() => fill(parts, values), [parts, values]);
  const tokens = Math.max(0, Math.ceil(prompt.length / 4));

  // Use pulses once – and the region speaks – when the last empty variable gets filled.
  const lastMissing = useRef<{ id?: string; missing: number }>({});
  useEffect(() => {
    const previous = lastMissing.current;
    if (previous.id === template?.id && previous.missing > 0 && missing === 0) {
      setPulse((count) => count + 1);
      setAnnounce("All variables filled. Ready to use.");
    }
    lastMissing.current = { id: template?.id, missing };
  }, [missing, template?.id]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => setFlash(null), 900);
    return () => clearTimeout(timer);
  }, [flash]);

  // Outgoing template, kept for one fade underneath the new one.
  const [outgoing, setOutgoing] = useState<PromptTemplate | null>(null);
  const shownId = useRef(template?.id);
  useEffect(() => {
    if (shownId.current === template?.id) return;
    const previous = templates.find((item) => item.id === shownId.current) ?? null;
    shownId.current = template?.id;
    setOutgoing(previous);
    setCopied(false);
    const timer = setTimeout(() => setOutgoing(null), 320);
    return () => clearTimeout(timer);
  }, [template?.id, templates]);

  // The highlight slides to the chosen row.
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(null);
  const measureMarker = useCallback(() => {
    const row = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    setMarker(row ? { top: row.offsetTop, height: row.offsetHeight } : null);
  }, []);
  useIsoLayoutEffect(measureMarker, [measureMarker, selectedId, filtered]);
  useEffect(() => {
    const node = listRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measureMarker);
    observer.observe(node);
    return () => observer.disconnect();
  }, [measureMarker]);

  const setValue = (name: string, next: string) => {
    if (!template) return;
    setValuesById((current) => ({
      ...current,
      [template.id]: { ...defaultsOf(template), ...(current[template.id] ?? {}), [name]: next },
    }));
    setFlash((current) => ({ name, key: (current?.key ?? 0) + 1 }));
  };

  const focusOption = (id: string) => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`);
    node?.focus();
    node?.scrollIntoView?.({ block: "nearest" });
  };

  const onListKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!filtered.length) return;
    const index = Math.max(0, filtered.findIndex((item) => item.id === selectedId));
    let next = -1;
    if (event.key === "ArrowDown") next = Math.min(filtered.length - 1, index + 1);
    else if (event.key === "ArrowUp") next = index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = filtered.length - 1;
    else return;
    event.preventDefault();
    if (next < 0) {
      searchRef.current?.focus();
      return;
    }
    select(filtered[next].id);
    focusOption(filtered[next].id);
  };

  const onSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && query) {
      event.preventDefault();
      setQuery("");
    } else if (event.key === "ArrowDown" && filtered.length) {
      event.preventDefault();
      const target = filtered.find((item) => item.id === selectedId) ?? filtered[0];
      select(target.id);
      focusOption(target.id);
    }
  };

  const focusFirstEmpty = (after?: string) => {
    const start = after ? names.indexOf(after) + 1 : 0;
    const order = [...names.slice(start), ...names.slice(0, start)];
    const empty = order.find((name) => !values[name]?.trim() && name !== after);
    if (empty) fieldsRef.current.get(empty)?.focus();
    return Boolean(empty);
  };

  const use = () => {
    if (!template) return;
    if (missing > 0) {
      setAnnounce(`${missing} ${missing === 1 ? "variable is" : "variables are"} still empty.`);
      focusFirstEmpty();
      return;
    }
    const finished: Record<string, string> = {};
    for (const name of names) finished[name] = values[name].trim();
    onUse?.(prompt, template, finished);
    setAnnounce(`Prompt used: ${template.title}.`);
  };

  const copy = async () => {
    const ok = await writeClipboard(prompt);
    if (ok) {
      setCopied(true);
      setAnnounce("Prompt copied.");
      onCopy?.(prompt);
    } else {
      setAnnounce("Could not copy – select the preview text instead.");
    }
  };

  const onFieldKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>, name: string) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const moved = focusFirstEmpty(name);
    if (!moved && !values[name]?.trim()) return;
    if (!moved && missing === 0) use();
  };

  const style = marker
    ? ({ "--ui-plib-marker-y": `${marker.top}px`, "--ui-plib-marker-h": `${marker.height}px` } as CSSProperties)
    : undefined;

  const renderTemplate = (item: PromptTemplate, live: boolean) => {
    const itemParts = live ? parts : parse(item.body);
    const itemNames = live ? names : variableNames(itemParts);
    const itemValues = live ? values : { ...defaultsOf(item), ...(valuesById[item.id] ?? {}) };
    const itemFilled = itemNames.filter((name) => itemValues[name]?.trim()).length;
    const vars = item.variables ?? {};
    return (
      <div
        className="ui-plib__view"
        data-live={live ? "" : undefined}
        key={live ? `live-${item.id}` : `out-${item.id}`}
        inert={live ? undefined : true}
        aria-hidden={live ? undefined : true}
      >
        <div className="ui-plib__view-head">
          <h3 className="ui-plib__view-title">{item.title}</h3>
          {item.category ? (
            <span className="ui-plib__chip" data-tone={toneOf(item)}>{item.category}</span>
          ) : null}
          {itemNames.length ? (
            <span className="ui-plib__progress">
              <span className="ui-plib__bars" aria-hidden="true">
                {itemNames.map((name) => (
                  <span key={name} className="ui-plib__bar" data-on={itemValues[name]?.trim() ? "" : undefined} />
                ))}
              </span>
              <span className="ui-plib__progress-text">
                {itemFilled} of {itemNames.length} filled
              </span>
            </span>
          ) : null}
        </div>

        <p className="ui-plib__sentence">
          {itemParts.map((part, index) => {
            if (part.kind === "text") return <Fragment key={index}>{part.text}</Fragment>;
            const name = part.name;
            const current = itemValues[name] ?? "";
            const description = vars[name]?.description;
            const firstUse = itemParts.findIndex((p) => p.kind === "var" && p.name === name) === index;
            return (
              <span
                key={index}
                className="ui-plib__field"
                data-filled={current.trim() ? "" : undefined}
                data-flash={live && flash?.name === name ? flash.key % 2 ? "a" : "b" : undefined}
                data-value={current || humanize(name)}
              >
                <input
                  ref={(node) => {
                    if (!live || !firstUse) return;
                    if (node) fieldsRef.current.set(name, node);
                    else fieldsRef.current.delete(name);
                  }}
                  className="ui-plib__input"
                  value={current}
                  placeholder={humanize(name)}
                  size={1}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label={description ? `${humanize(name)} – ${description}` : humanize(name)}
                  title={description}
                  tabIndex={live ? undefined : -1}
                  onChange={(event) => setValue(name, event.target.value)}
                  onKeyDown={(event) => onFieldKeyDown(event, name)}
                />
              </span>
            );
          })}
        </p>

        <div className="ui-plib__label" id={`${uid}-${live ? "preview" : "preview-out"}`}>Preview</div>
        <p className="ui-plib__preview" aria-labelledby={`${uid}-${live ? "preview" : "preview-out"}`}>
          {itemParts.map((part, index) => {
            if (part.kind === "text") return <Fragment key={index}>{part.text}</Fragment>;
            const current = itemValues[part.name]?.trim();
            return current ? (
              <strong
                key={index}
                className="ui-plib__filled"
                data-flash={live && flash?.name === part.name ? flash.key % 2 ? "a" : "b" : undefined}
              >
                {current}
              </strong>
            ) : (
              <span key={index} className="ui-plib__hole">{`{${part.name}}`}</span>
            );
          })}
        </p>
      </div>
    );
  };

  return (
    <div
      className={["ui-plib", className].filter(Boolean).join(" ")}
      role="group"
      aria-labelledby={`${uid}-title`}
    >
      <style href="ui-prompt-library" precedence="default">{css}</style>
      <div className="ui-plib__frame">
        <div className="ui-plib__panel">
          <div className="ui-plib__side">
            <div className="ui-plib__side-head">
              <h2 className="ui-plib__title" id={`${uid}-title`}>{title}</h2>
              <span className="ui-plib__count" aria-label={`${templates.length} templates`}>{templates.length}</span>
            </div>
            <label className="ui-plib__search">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="4.4" />
                <path d="M10.3 10.3l3.2 3.2" />
              </svg>
              <input
                ref={searchRef}
                type="search"
                value={query}
                placeholder="Search templates"
                aria-label="Search templates"
                aria-controls={`${uid}-list`}
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onSearchKeyDown}
              />
            </label>
            <div
              ref={listRef}
              className="ui-plib__list"
              id={`${uid}-list`}
              role="listbox"
              aria-label={title}
              style={style}
              onKeyDown={onListKeyDown}
            >
              {marker ? <span className="ui-plib__marker" aria-hidden="true" /> : null}
              {filtered.map((item) => {
                const selected = item.id === template?.id;
                const reachable = selected || (!filtered.some((f) => f.id === template?.id) && item === filtered[0]);
                return (
                  <div
                    key={item.id}
                    data-id={item.id}
                    role="option"
                    aria-selected={selected}
                    tabIndex={reachable ? 0 : -1}
                    className="ui-plib__option"
                    onClick={() => select(item.id)}
                  >
                    <span className="ui-plib__option-title">{item.title}</span>
                    {item.category ? (
                      <span className="ui-plib__chip" data-tone={toneOf(item)}>{item.category}</span>
                    ) : null}
                  </div>
                );
              })}
              {!filtered.length ? (
                <div className="ui-plib__empty">
                  No template matches “{query.trim()}”.
                  <button type="button" className="ui-plib__ghost" onClick={() => { setQuery(""); searchRef.current?.focus(); }}>
                    Clear search
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="ui-plib__main">
            {template ? (
              <div className="ui-plib__stack">
                {outgoing && outgoing.id !== template.id ? renderTemplate(outgoing, false) : null}
                {renderTemplate(template, true)}
              </div>
            ) : (
              <div className="ui-plib__blank">No templates yet. Saved prompts will show up here.</div>
            )}
          </div>
        </div>

        <div className="ui-plib__tray">
          <span className="ui-plib__tokens" title="Estimate – about four characters per token">
            ~<span className="ui-plib__tokens-num" key={tokens}>{tokens}</span> tokens
          </span>
          <span className="ui-plib__tray-note" aria-hidden={missing === 0 ? true : undefined}>
            {template && missing > 0 ? `${missing} to fill` : ""}
          </span>
          <button
            type="button"
            className="ui-plib__copy"
            onClick={copy}
            disabled={!template}
            data-copied={copied ? "" : undefined}
            aria-label={copied ? "Copied" : "Copy prompt"}
          >
            <span className="ui-plib__copy-icon" aria-hidden="true">
              {copied ? (
                <svg viewBox="0 0 16 16"><path d="M3.6 8.4l2.9 2.9 6-6.5" /></svg>
              ) : (
                <svg viewBox="0 0 16 16">
                  <rect x="5.4" y="5.4" width="7.6" height="7.6" rx="1.6" />
                  <path d="M10.4 3.6V3.4A1.4 1.4 0 0 0 9 2H4.4A1.4 1.4 0 0 0 3 3.4V8a1.4 1.4 0 0 0 1.4 1.4h.2" />
                </svg>
              )}
            </span>
            <span className="ui-plib__copy-label">{copied ? "Copied" : "Copy"}</span>
          </button>
          <button
            type="button"
            className="ui-plib__use"
            aria-disabled={missing > 0 || !template ? true : undefined}
            aria-describedby={`${uid}-missing`}
            data-pulse={pulse ? pulse % 2 ? "a" : "b" : undefined}
            onClick={use}
          >
            {useLabel}
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h8.6M8.6 4.4 12.2 8l-3.6 3.6" /></svg>
          </button>
          <span className="ui-plib__sr" id={`${uid}-missing`}>
            {missing > 0 ? `${missing} ${missing === 1 ? "variable" : "variables"} still empty` : "Ready"}
          </span>
        </div>
      </div>
      <div className="ui-plib__sr" role="status" aria-live="polite" aria-atomic="true">{announce}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-plib {
  --ui-plib-frame: #f2f6fa;
  --ui-plib-panel: #ffffff;
  --ui-plib-soft: rgba(26, 62, 112, 0.06);
  --ui-plib-hairline: #dae2ec;
  --ui-plib-firm: #cbd6e4;
  --ui-plib-ink: #00162b;
  --ui-plib-text: rgba(0, 22, 43, 0.66);
  --ui-plib-muted: rgba(0, 22, 43, 0.54);
  --ui-plib-secondary: #fbfcfe;
  --ui-plib-field: #ffffff;
  --ui-plib-berry: #851437;
  --ui-plib-berry-hover: #6d0f2d;
  --ui-plib-ring: #8fbdf2;
  --ui-plib-info-ink: #1a3e70;
  --ui-plib-info-fill: #eef5ff;
  --ui-plib-info-line: #c1daff;
  --ui-plib-success-ink: #1d6a34;
  --ui-plib-success-fill: #eafbee;
  --ui-plib-success-line: #c9f5cf;
  --ui-plib-waiting-ink: #775810;
  --ui-plib-waiting-fill: #fdf6dd;
  --ui-plib-waiting-line: #fae6a0;
  --ui-plib-danger-ink: #8a3a22;
  --ui-plib-danger-fill: #fdeee8;
  --ui-plib-danger-line: #f5d5c9;
  --ui-plib-brand-ink: #851437;
  --ui-plib-brand-fill: #fbeef2;
  --ui-plib-brand-line: #f1cdd8;
  --ui-plib-inner: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  --ui-plib-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-plib-short: 0 2px 4px -2px rgba(26, 62, 112, 0.2);
  --ui-plib-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-plib-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-plib-ease: cubic-bezier(0.16, 1, 0.3, 1);
  container-type: inline-size;
  width: 100%;
  max-width: 640px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--ui-plib-ink);
}
:where(.dark, [data-theme="dark"]) .ui-plib {
  --ui-plib-frame: #0f2747;
  --ui-plib-panel: #16345c;
  --ui-plib-soft: rgba(255, 255, 255, 0.07);
  --ui-plib-hairline: rgba(255, 255, 255, 0.12);
  --ui-plib-firm: rgba(255, 255, 255, 0.18);
  --ui-plib-ink: rgba(255, 255, 255, 0.94);
  --ui-plib-text: rgba(255, 255, 255, 0.72);
  --ui-plib-muted: rgba(255, 255, 255, 0.56);
  --ui-plib-secondary: rgba(255, 255, 255, 0.05);
  --ui-plib-field: rgba(255, 255, 255, 0.04);
  --ui-plib-berry: #a8204d;
  --ui-plib-berry-hover: #bd2a5a;
  --ui-plib-ring: rgba(143, 189, 242, 0.6);
  --ui-plib-info-ink: #c1daff;
  --ui-plib-info-fill: rgba(143, 189, 242, 0.16);
  --ui-plib-info-line: rgba(143, 189, 242, 0.3);
  --ui-plib-success-ink: #7fe0a0;
  --ui-plib-success-fill: rgba(127, 224, 160, 0.14);
  --ui-plib-success-line: rgba(127, 224, 160, 0.28);
  --ui-plib-waiting-ink: #f3d27a;
  --ui-plib-waiting-fill: rgba(243, 210, 122, 0.14);
  --ui-plib-waiting-line: rgba(243, 210, 122, 0.28);
  --ui-plib-danger-ink: #f2a48c;
  --ui-plib-danger-fill: rgba(242, 164, 140, 0.14);
  --ui-plib-danger-line: rgba(242, 164, 140, 0.28);
  --ui-plib-brand-ink: #f3a3bd;
  --ui-plib-brand-fill: rgba(243, 163, 189, 0.14);
  --ui-plib-brand-line: rgba(243, 163, 189, 0.28);
  --ui-plib-inner: inset 0 1px 2px rgba(3, 12, 28, 0.4);
  --ui-plib-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-plib-short: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
  --ui-plib-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-plib-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.8);
}
.ui-plib *, .ui-plib *::before, .ui-plib *::after { box-sizing: border-box; }

.ui-plib__frame {
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-plib-frame);
  border: 1px solid var(--ui-plib-hairline);
  box-shadow: var(--ui-plib-floating), var(--ui-plib-drop);
}
.ui-plib__panel {
  display: grid;
  grid-template-columns: minmax(180px, 34%) 1fr;
  border-radius: 16px;
  background: var(--ui-plib-panel);
  border: 1px solid var(--ui-plib-hairline);
  box-shadow: var(--ui-plib-raised);
  overflow: hidden;
}

/* List side */
.ui-plib__side { display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 14px 8px 10px; border-right: 1px solid var(--ui-plib-hairline); }
.ui-plib__side-head { display: flex; align-items: baseline; gap: 6px; padding: 0 6px; }
.ui-plib__title {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
}
.ui-plib__count { font-size: 12px; font-weight: 600; color: var(--ui-plib-muted); font-variant-numeric: tabular-nums; }

.ui-plib__search {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  margin: 0 2px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid var(--ui-plib-firm);
  background: var(--ui-plib-field);
  box-shadow: var(--ui-plib-inner);
  transition: box-shadow 150ms var(--ui-plib-ease), border-color 150ms var(--ui-plib-ease);
}
.ui-plib__search:focus-within { border-color: var(--ui-plib-info-line); box-shadow: var(--ui-plib-inner), 0 0 0 3px var(--ui-plib-ring); }
.ui-plib__search svg { flex: none; width: 14px; height: 14px; fill: none; stroke: var(--ui-plib-muted); stroke-width: 1.5; stroke-linecap: round; }
.ui-plib__search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  outline: none;
  font: inherit;
  font-size: 13px;
  color: var(--ui-plib-ink);
  caret-color: var(--ui-plib-berry);
}
.ui-plib__search input::placeholder { color: var(--ui-plib-muted); }
.ui-plib__search input::-webkit-search-cancel-button { display: none; }

.ui-plib__list { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); align-content: start; gap: 2px; min-height: 0; max-height: 260px; overflow-y: auto; padding: 0 2px; scrollbar-width: thin; }
.ui-plib__marker {
  position: absolute;
  left: 2px;
  right: 2px;
  top: 0;
  height: var(--ui-plib-marker-h);
  transform: translateY(var(--ui-plib-marker-y));
  border-radius: 10px;
  background: var(--ui-plib-info-fill);
  box-shadow: inset 2px 0 0 var(--ui-plib-berry);
  transition: transform 300ms var(--ui-plib-ease), height 300ms var(--ui-plib-ease);
  pointer-events: none;
}
.ui-plib__option {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  min-height: 36px;
  padding: 6px 8px 6px 10px;
  border-radius: 10px;
  font-size: 13.5px;
  color: var(--ui-plib-text);
  cursor: pointer;
  outline: none;
  transition: background-color 150ms var(--ui-plib-ease), color 150ms var(--ui-plib-ease);
}
.ui-plib__option:hover:not([aria-selected="true"]) { background: var(--ui-plib-soft); }
.ui-plib__option[aria-selected="true"] { color: var(--ui-plib-ink); font-weight: 600; }
.ui-plib__option:focus-visible { box-shadow: 0 0 0 3px var(--ui-plib-ring); }
.ui-plib__option-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-plib__empty { display: grid; justify-items: start; gap: 6px; padding: 8px 8px 4px; font-size: 13px; color: var(--ui-plib-muted); overflow-wrap: anywhere; }
.ui-plib__ghost {
  padding: 4px 8px;
  margin-left: -8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ui-plib-info-ink);
  cursor: pointer;
}
.ui-plib__ghost:hover { background: var(--ui-plib-soft); }
.ui-plib__ghost:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-plib-ring); }

/* Chips – fill + hairline + ink */
.ui-plib__chip {
  --tone-ink: var(--ui-plib-muted);
  --tone-fill: var(--ui-plib-soft);
  --tone-line: var(--ui-plib-hairline);
  flex: none;
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid var(--tone-line);
  background: var(--tone-fill);
  color: var(--tone-ink);
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}
.ui-plib__chip[data-tone="blue"] { --tone-ink: var(--ui-plib-info-ink); --tone-fill: var(--ui-plib-info-fill); --tone-line: var(--ui-plib-info-line); }
.ui-plib__chip[data-tone="violet"] { --tone-ink: var(--ui-plib-brand-ink); --tone-fill: var(--ui-plib-brand-fill); --tone-line: var(--ui-plib-brand-line); }
.ui-plib__chip[data-tone="amber"] { --tone-ink: var(--ui-plib-waiting-ink); --tone-fill: var(--ui-plib-waiting-fill); --tone-line: var(--ui-plib-waiting-line); }
.ui-plib__chip[data-tone="green"] { --tone-ink: var(--ui-plib-success-ink); --tone-fill: var(--ui-plib-success-fill); --tone-line: var(--ui-plib-success-line); }
.ui-plib__chip[data-tone="red"] { --tone-ink: var(--ui-plib-danger-ink); --tone-fill: var(--ui-plib-danger-fill); --tone-line: var(--ui-plib-danger-line); }

/* Template side */
.ui-plib__main { position: relative; min-width: 0; }
.ui-plib__stack { display: grid; }
.ui-plib__view { grid-area: 1 / 1; min-width: 0; padding: 16px 16px 16px; }
.ui-plib__view[data-live] { animation: ui-plib-in 300ms var(--ui-plib-ease); }
.ui-plib__view:not([data-live]) { animation: ui-plib-out 300ms var(--ui-plib-ease) forwards; pointer-events: none; }
.ui-plib__view-head { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; margin-bottom: 12px; }
.ui-plib__view-title {
  margin: 0;
  min-width: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  overflow-wrap: anywhere;
}
.ui-plib__progress { display: inline-flex; align-items: center; gap: 7px; margin-left: auto; font-size: 12px; color: var(--ui-plib-muted); white-space: nowrap; }
.ui-plib__bars { display: inline-flex; gap: 3px; }
.ui-plib__bar { width: 9px; height: 4px; border-radius: 2px; background: var(--ui-plib-firm); transition: background-color 300ms var(--ui-plib-ease); }
.ui-plib__bar[data-on] { background: var(--ui-plib-berry); }

.ui-plib__sentence { margin: 0; font-size: 14px; line-height: 30px; color: var(--ui-plib-text); overflow-wrap: anywhere; }

/* Inline field that grows with what is typed */
.ui-plib__field {
  display: inline-grid;
  vertical-align: middle;
  max-width: 100%;
  margin: 0 1px;
}
.ui-plib__field::after,
.ui-plib__input {
  grid-area: 1 / 1;
  min-width: 2ch;
  padding: 0 7px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
}
.ui-plib__field::after {
  content: attr(data-value) " ";
  visibility: hidden;
  white-space: pre;
  overflow: hidden;
  border: 1px solid transparent;
}
.ui-plib__input {
  width: 100%;
  min-width: 0;
  height: 26px;
  border-radius: 7px;
  border: 1px solid var(--ui-plib-firm);
  background: var(--ui-plib-field);
  box-shadow: var(--ui-plib-inner);
  color: var(--ui-plib-ink);
  caret-color: var(--ui-plib-berry);
  outline: none;
  text-overflow: ellipsis;
  transition: border-color 150ms var(--ui-plib-ease), background-color 300ms var(--ui-plib-ease), box-shadow 150ms var(--ui-plib-ease);
}
.ui-plib__input::placeholder { color: var(--ui-plib-muted); font-weight: 500; }
.ui-plib__field[data-filled] .ui-plib__input { border-color: var(--ui-plib-info-line); background: var(--ui-plib-info-fill); color: var(--ui-plib-info-ink); box-shadow: none; }
.ui-plib__input:focus { border-color: var(--ui-plib-info-line); box-shadow: 0 0 0 3px var(--ui-plib-ring); }
.ui-plib__field[data-flash="a"] .ui-plib__input { animation: ui-plib-glow-a 900ms var(--ui-plib-ease); }
.ui-plib__field[data-flash="b"] .ui-plib__input { animation: ui-plib-glow-b 900ms var(--ui-plib-ease); }

.ui-plib__label {
  margin: 16px 0 6px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--ui-plib-muted);
}
.ui-plib__preview {
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--ui-plib-hairline);
  background: var(--ui-plib-frame);
  font-size: 13.5px;
  line-height: 21px;
  color: var(--ui-plib-text);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  user-select: text;
}
.ui-plib__filled { font-weight: 600; color: var(--ui-plib-ink); border-radius: 4px; }
.ui-plib__filled[data-flash="a"] { animation: ui-plib-mark-a 900ms var(--ui-plib-ease); }
.ui-plib__filled[data-flash="b"] { animation: ui-plib-mark-b 900ms var(--ui-plib-ease); }
.ui-plib__hole { color: var(--ui-plib-muted); font-style: italic; }
.ui-plib__blank { display: grid; place-items: center; min-height: 200px; padding: 24px; text-align: center; font-size: 13.5px; color: var(--ui-plib-muted); }

/* Tray */
.ui-plib__tray { display: flex; align-items: center; gap: 8px; min-height: 48px; padding: 6px 2px 0 10px; }
.ui-plib__tokens { display: inline-flex; overflow: hidden; font-size: 12.5px; color: var(--ui-plib-muted); font-variant-numeric: tabular-nums; white-space: pre; }
.ui-plib__tokens-num { display: inline-block; animation: ui-plib-roll 300ms var(--ui-plib-ease); }
.ui-plib__tray-note { flex: 1; min-width: 0; font-size: 12.5px; color: var(--ui-plib-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-plib__copy {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--ui-plib-firm);
  background: var(--ui-plib-secondary);
  box-shadow: var(--ui-plib-short);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-plib-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ui-plib-ease), color 150ms var(--ui-plib-ease);
}
.ui-plib__copy:hover { background: var(--ui-plib-soft); }
.ui-plib__copy[data-copied] { color: var(--ui-plib-success-ink); }
.ui-plib__copy-icon { display: grid; place-items: center; }
.ui-plib__copy-icon svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.ui-plib__copy[data-copied] .ui-plib__copy-icon svg { animation: ui-plib-pop 300ms var(--ui-plib-ease); }
.ui-plib__use {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px 0 14px;
  border: 0;
  border-radius: 10px;
  background: var(--ui-plib-berry);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ui-plib-ease), opacity 300ms var(--ui-plib-ease), transform 150ms var(--ui-plib-ease);
}
.ui-plib__use svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.ui-plib__use:hover { background: var(--ui-plib-berry-hover); }
.ui-plib__use:active { transform: translateY(1px); }
.ui-plib__use[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16); }
.ui-plib__use[aria-disabled="true"]:hover { background: var(--ui-plib-berry); }
.ui-plib__use[data-pulse="a"] { animation: ui-plib-pulse-a 600ms var(--ui-plib-ease); }
.ui-plib__use[data-pulse="b"] { animation: ui-plib-pulse-b 600ms var(--ui-plib-ease); }
.ui-plib__copy:focus-visible,
.ui-plib__use:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-plib-ring); }
.ui-plib__copy:disabled { opacity: 0.5; cursor: not-allowed; }

.ui-plib__sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* Touch: taller targets */
@media (hover: none), (pointer: coarse) {
  .ui-plib__option { min-height: 44px; }
  .ui-plib__search { height: 40px; }
  .ui-plib__input { height: 32px; }
  .ui-plib__sentence { line-height: 36px; }
  .ui-plib__copy, .ui-plib__use { height: 40px; }
}

/* Narrow: list on top */
@container (max-width: 539px) {
  .ui-plib__panel { grid-template-columns: 1fr; }
  .ui-plib__side { border-right: 0; border-bottom: 1px solid var(--ui-plib-hairline); }
  .ui-plib__list { max-height: 168px; }
}
@container (max-width: 359px) {
  .ui-plib__copy { padding: 0 9px; }
  .ui-plib__copy-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .ui-plib__tray-note { display: none; }
  .ui-plib__tray { padding-left: 6px; }
  .ui-plib__view { padding: 14px 12px; }
  .ui-plib__progress { margin-left: 0; }
}

@keyframes ui-plib-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-plib-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes ui-plib-roll { from { transform: translateY(70%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-plib-pop { from { transform: scale(0.6); } to { transform: scale(1); } }
@keyframes ui-plib-glow-a { from { box-shadow: 0 0 0 3px var(--ui-plib-ring); } }
@keyframes ui-plib-glow-b { from { box-shadow: 0 0 0 3px var(--ui-plib-ring); } }
@keyframes ui-plib-mark-a { from { background: var(--ui-plib-info-fill); box-shadow: 0 0 0 2px var(--ui-plib-info-fill); } }
@keyframes ui-plib-mark-b { from { background: var(--ui-plib-info-fill); box-shadow: 0 0 0 2px var(--ui-plib-info-fill); } }
@keyframes ui-plib-pulse-a { 0% { box-shadow: 0 0 0 0 rgba(133, 20, 55, 0.45); } 100% { box-shadow: 0 0 0 10px rgba(133, 20, 55, 0); } }
@keyframes ui-plib-pulse-b { 0% { box-shadow: 0 0 0 0 rgba(133, 20, 55, 0.45); } 100% { box-shadow: 0 0 0 10px rgba(133, 20, 55, 0); } }

@media (prefers-reduced-motion: reduce) {
  .ui-plib__marker,
  .ui-plib__option,
  .ui-plib__bar,
  .ui-plib__input,
  .ui-plib__use { transition: none; }
  .ui-plib__view[data-live],
  .ui-plib__tokens-num,
  .ui-plib__copy[data-copied] .ui-plib__copy-icon svg,
  .ui-plib__use[data-pulse="a"],
  .ui-plib__use[data-pulse="b"] { animation: none; }
  .ui-plib__view:not([data-live]) { display: none; }
  .ui-plib__use:active { transform: none; }
}
`;
