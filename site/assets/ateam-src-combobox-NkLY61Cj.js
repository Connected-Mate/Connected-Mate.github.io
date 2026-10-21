var e=`"use client";

import {
  useCallback,
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

export type ComboboxOption = {
  value: string;
  label: string;
  /** Short second line shown next to the label, e.g. a role. */
  hint?: string;
  /** Image URL, or \`true\` for initials. */
  avatar?: string | boolean;
  /** Colour dot, e.g. for labels. */
  color?: string;
  icon?: ReactNode;
  /** Options with the same group are listed under one title. */
  group?: string;
  /** Extra words the search matches. */
  keywords?: string[];
};

export type ComboboxProps = {
  options: ComboboxOption[];
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[], options: ComboboxOption[]) => void;
  placeholder?: string;
  creatable?: boolean;
  onCreate?: (text: string) => ComboboxOption | void;
  createLabel?: (text: string) => string;
  maxVisibleTags?: number;
  label?: string;
  defaultOpen?: boolean;
  emptyText?: string;
  className?: string;
};

type Row =
  | { kind: "option"; option: ComboboxOption; id: string }
  | { kind: "create"; text: string; id: string };

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

function initials(label: string) {
  const parts = label.trim().split(/\\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] ?? "");
  return (first + last).toUpperCase();
}

function matches(option: ComboboxOption, query: string) {
  if (!query) return true;
  const hay = fold(
    [option.label, option.hint ?? "", option.group ?? "", ...(option.keywords ?? [])].join(" "),
  );
  return fold(query)
    .split(/\\s+/)
    .every((word) => hay.includes(word));
}

/* ------------------------------------------------------------------------------------------------
 * Combobox
 * ----------------------------------------------------------------------------------------------*/

export function Combobox({
  options,
  multiple = true,
  value,
  defaultValue = [],
  onChange,
  placeholder = "Search…",
  creatable = false,
  onCreate,
  createLabel = (text) => \`Create “\${text}”\`,
  maxVisibleTags,
  label,
  defaultOpen = false,
  emptyText = "No results",
  className,
}: ComboboxProps) {
  const uid = useId();
  const ids = {
    label: \`\${uid}-label\`,
    input: \`\${uid}-input\`,
    list: \`\${uid}-list\`,
    status: \`\${uid}-status\`,
    row: (i: number) => \`\${uid}-row-\${i}\`,
  };

  const [inner, setInner] = useState<string[]>(defaultValue);
  const selected = value ?? inner;
  const [created, setCreated] = useState<ComboboxOption[]>([]);
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [chipArmed, setChipArmed] = useState(false);
  const [announce, setAnnounce] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const glideRef = useRef<HTMLDivElement>(null);

  const all = useMemo(() => {
    const seen = new Set(options.map((o) => o.value));
    return [...options, ...created.filter((o) => !seen.has(o.value))];
  }, [options, created]);
  const byValue = useMemo(() => new Map(all.map((o) => [o.value, o])), [all]);
  const picked = selected.map((v) => byValue.get(v)).filter(Boolean) as ComboboxOption[];

  // Rows: filtered options in group order, then the create row.
  const { rows, groups } = useMemo(() => {
    const filtered = all.filter((o) => matches(o, query));
    const order: string[] = [];
    const buckets = new Map<string, ComboboxOption[]>();
    for (const o of filtered) {
      const g = o.group ?? "";
      if (!buckets.has(g)) {
        buckets.set(g, []);
        order.push(g);
      }
      buckets.get(g)!.push(o);
    }
    const rows: Row[] = [];
    const groups: { title: string; start: number; count: number }[] = [];
    for (const g of order) {
      const list = buckets.get(g)!;
      groups.push({ title: g, start: rows.length, count: list.length });
      for (const option of list) rows.push({ kind: "option", option, id: ids.row(rows.length) });
    }
    const text = query.trim();
    if (creatable && text && !all.some((o) => fold(o.label) === fold(text))) {
      rows.push({ kind: "create", text, id: ids.row(rows.length) });
    }
    return { rows, groups };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, query, creatable, uid]);

  const activeIndex = rows.length ? Math.min(active, rows.length - 1) : -1;

  const commit = useCallback(
    (next: string[], message: string) => {
      if (value === undefined) setInner(next);
      onChange?.(next, next.map((v) => byValue.get(v)).filter(Boolean) as ComboboxOption[]);
      const count = next.length;
      setAnnounce(\`\${message}. \${count} selected.\`);
    },
    [value, onChange, byValue],
  );

  const toggle = (option: ComboboxOption) => {
    const isOn = selected.includes(option.value);
    if (!multiple) {
      commit(isOn ? [] : [option.value], \`\${isOn ? "Removed" : "Picked"} \${option.label}\`);
      setQuery("");
      setOpen(false);
      return;
    }
    const next = isOn ? selected.filter((v) => v !== option.value) : [...selected, option.value];
    commit(next, \`\${isOn ? "Removed" : "Added"} \${option.label}\`);
  };

  const create = (text: string) => {
    const made = onCreate?.(text) ?? { value: text, label: text };
    setCreated((c) => [...c.filter((o) => o.value !== made.value), made]);
    const next = multiple ? [...selected.filter((v) => v !== made.value), made.value] : [made.value];
    if (value === undefined) setInner(next);
    onChange?.(next, next.map((v) => (v === made.value ? made : byValue.get(v))).filter(Boolean) as ComboboxOption[]);
    setAnnounce(\`Created \${made.label}. \${next.length} selected.\`);
    setQuery("");
    if (!multiple) setOpen(false);
  };

  const remove = (option: ComboboxOption) => {
    commit(
      selected.filter((v) => v !== option.value),
      \`Removed \${option.label}\`,
    );
    setChipArmed(false);
  };

  const runRow = (row: Row | undefined) => {
    if (!row) return;
    if (row.kind === "create") create(row.text);
    else toggle(row.option);
  };

  // Close when the pointer goes down outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Glide the highlight to the active row and keep it in view.
  useLayoutEffect(() => {
    const list = listRef.current;
    const glide = glideRef.current;
    if (!open || !list || !glide) return;
    const el = activeIndex >= 0 ? (list.querySelector(\`#\${CSS.escape(ids.row(activeIndex))}\`) as HTMLElement | null) : null;
    if (!el) {
      glide.style.opacity = "0";
      return;
    }
    glide.style.opacity = "1";
    glide.style.transform = \`translateY(\${el.offsetTop}px)\`;
    glide.style.height = \`\${el.offsetHeight}px\`;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < list.scrollTop + 4) list.scrollTop = Math.max(0, top - 30);
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 6;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, open, rows]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") setChipArmed(false);
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        if (!rows.length) return;
        const step = e.key === "ArrowDown" ? 1 : -1;
        setActive((activeIndex + step + rows.length) % rows.length);
        return;
      }
      case "Home":
      case "End":
        if (open && rows.length && !query) {
          e.preventDefault();
          setActive(e.key === "Home" ? 0 : rows.length - 1);
        }
        return;
      case "Enter":
        if (open && activeIndex >= 0) {
          e.preventDefault();
          runRow(rows[activeIndex]);
        } else if (!open) {
          e.preventDefault();
          setOpen(true);
        }
        return;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        } else if (query) {
          e.preventDefault();
          setQuery("");
        }
        return;
      case "Tab":
        setOpen(false);
        return;
      case "Backspace": {
        if (query || !picked.length) return;
        e.preventDefault();
        if (chipArmed) remove(picked[picked.length - 1]);
        else setChipArmed(true);
        return;
      }
    }
  };

  const visibleCount =
    maxVisibleTags !== undefined && picked.length > maxVisibleTags ? Math.max(0, maxVisibleTags) : picked.length;
  const hidden = picked.length - visibleCount;
  const status =
    selected.length === 0 ? "Nothing selected" : multiple ? \`\${selected.length} selected\` : "1 selected";

  return (
    <div
      ref={rootRef}
      className={["ui-at-cbx", className].filter(Boolean).join(" ")}
      data-open={open ? "" : undefined}
      data-multiple={multiple ? "" : undefined}
    >
      <style href="ui-combobox" precedence="default">
        {css}
      </style>
      {label ? (
        <label id={ids.label} htmlFor={ids.input} className="ui-at-cbx__label">
          {label}
        </label>
      ) : null}

      <div
        className="ui-at-cbx__field"
        onPointerDown={(e) => {
          if (e.target === inputRef.current) return;
          if ((e.target as HTMLElement).closest("button")) return;
          e.preventDefault();
          inputRef.current?.focus();
          setOpen(true);
        }}
      >
        {picked.slice(0, visibleCount).map((o, i) => (
          <span
            key={o.value}
            className="ui-at-cbx__chip"
            data-armed={chipArmed && i === picked.length - 1 ? "" : undefined}
          >
            <Glyph option={o} small />
            <span className="ui-at-cbx__chip-text">{o.label}</span>
            <button
              type="button"
              className="ui-at-cbx__chip-x"
              aria-label={\`Remove \${o.label}\`}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => {
                remove(o);
                inputRef.current?.focus();
              }}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M3 3l6 6M9 3l-6 6" />
              </svg>
            </button>
          </span>
        ))}
        {hidden > 0 ? (
          <span className="ui-at-cbx__more" key={hidden} title={picked.slice(visibleCount).map((o) => o.label).join(", ")}>
            +{hidden}
          </span>
        ) : null}
        <input
          ref={inputRef}
          id={ids.input}
          className="ui-at-cbx__input"
          role="combobox"
          type="text"
          autoComplete="off"
          spellCheck={false}
          aria-expanded={open}
          aria-controls={ids.list}
          aria-autocomplete="list"
          aria-labelledby={label ? ids.label : undefined}
          aria-label={label ? undefined : placeholder}
          aria-activedescendant={open && activeIndex >= 0 ? rows[activeIndex]?.id : undefined}
          aria-describedby={ids.status}
          placeholder={picked.length ? "" : placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
            setChipArmed(false);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => setChipArmed(false)}
        />
        <button
          type="button"
          className="ui-at-cbx__toggle"
          tabIndex={-1}
          aria-label={open ? "Close list" : "Open list"}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => {
            setOpen((o) => !o);
            inputRef.current?.focus();
          }}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3 7.5L6 4.5l3 3" />
          </svg>
        </button>
      </div>

      <div className="ui-at-cbx__pop" hidden={!open}>
        <div
          ref={listRef}
          id={ids.list}
          className="ui-at-cbx__list"
          role="listbox"
          aria-labelledby={label ? ids.label : undefined}
          aria-label={label ? undefined : placeholder}
          aria-multiselectable={multiple || undefined}
          onPointerDown={(e) => e.preventDefault()}
        >
          <div ref={glideRef} className="ui-at-cbx__glide" aria-hidden="true" />
          {groups.map((g, gi) => (
            <div
              key={g.title || \`g\${gi}\`}
              role="group"
              aria-labelledby={g.title ? \`\${uid}-g\${gi}\` : undefined}
              className="ui-at-cbx__group"
            >
              {g.title ? (
                <div id={\`\${uid}-g\${gi}\`} className="ui-at-cbx__group-title" role="presentation">
                  {g.title}
                </div>
              ) : null}
              {rows.slice(g.start, g.start + g.count).map((row, k) => {
                const index = g.start + k;
                if (row.kind !== "option") return null;
                const isOn = selected.includes(row.option.value);
                return (
                  <div
                    key={row.option.value}
                    id={row.id}
                    role="option"
                    aria-selected={isOn}
                    className="ui-at-cbx__row"
                    data-active={index === activeIndex ? "" : undefined}
                    onPointerMove={() => index !== activeIndex && setActive(index)}
                    onClick={() => runRow(row)}
                  >
                    <Glyph option={row.option} />
                    <span className="ui-at-cbx__row-text">
                      <span className="ui-at-cbx__row-label">{row.option.label}</span>
                      {row.option.hint ? <span className="ui-at-cbx__row-hint">{row.option.hint}</span> : null}
                    </span>
                    {isOn ? (
                      <svg className="ui-at-cbx__check" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3.5 8.5l3 3 6-7" />
                      </svg>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
          {rows.map((row, index) =>
            row.kind === "create" ? (
              <div
                key="create"
                id={row.id}
                role="option"
                aria-selected={false}
                className="ui-at-cbx__row ui-at-cbx__row--create"
                data-active={index === activeIndex ? "" : undefined}
                onPointerMove={() => index !== activeIndex && setActive(index)}
                onClick={() => runRow(row)}
              >
                <span className="ui-at-cbx__glyph ui-at-cbx__glyph--plus" aria-hidden="true">
                  <svg viewBox="0 0 12 12">
                    <path d="M6 2.5v7M2.5 6h7" />
                  </svg>
                </span>
                <span className="ui-at-cbx__row-label">{createLabel(row.text)}</span>
              </div>
            ) : null,
          )}
          {rows.length === 0 ? (
            <div className="ui-at-cbx__empty" role="presentation">
              {emptyText}
            </div>
          ) : null}
        </div>
        <div className="ui-at-cbx__foot" aria-hidden="true">
          <span className="ui-at-cbx__count" key={selected.length}>
            {status}
          </span>
          <span className="ui-at-cbx__keys">
            <kbd>↑</kbd>
            <kbd>↓</kbd> to move <kbd>↵</kbd> to {multiple ? "toggle" : "pick"}
          </span>
        </div>
      </div>

      <span id={ids.status} className="ui-at-cbx__sr" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}

function Glyph({ option, small }: { option: ComboboxOption; small?: boolean }) {
  const cls = \`ui-at-cbx__glyph\${small ? " ui-at-cbx__glyph--sm" : ""}\`;
  if (option.icon) return <span className={cls} aria-hidden="true">{option.icon}</span>;
  if (typeof option.avatar === "string")
    return (
      <span className={cls} aria-hidden="true">
        <img src={option.avatar} alt="" />
      </span>
    );
  if (option.avatar) return <span className={cls} aria-hidden="true">{initials(option.label)}</span>;
  if (option.color)
    return <span className="ui-at-cbx__dot" aria-hidden="true" style={{ background: option.color }} />;
  return null;
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ \`
.ui-at-cbx {
  --cbx-frame: #f2f6fa;
  --cbx-panel: #ffffff;
  --cbx-soft: rgba(26, 62, 112, 0.06);
  --cbx-line: #dae2ec;
  --cbx-firm: #cbd6e4;
  --cbx-ink: #00162b;
  --cbx-text: rgba(0, 22, 43, 0.66);
  --cbx-muted: rgba(0, 22, 43, 0.54);
  --cbx-berry: #851437;
  --cbx-info-ink: #1a3e70;
  --cbx-info-fill: #eef5ff;
  --cbx-info-line: #c1daff;
  --cbx-ring: #8fbdf2;
  --cbx-check: #851437;
  --cbx-danger-ink: #8a3a22;
  --cbx-danger-fill: #fdeee8;
  --cbx-danger-line: #f5d5c9;
  --cbx-field-shade: inset 0 1px 2px rgba(26, 62, 112, 0.07);
  --cbx-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --cbx-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --cbx-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3), 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --cbx-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  width: 100%;
  max-width: 420px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: var(--cbx-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-cbx {
  --cbx-frame: #0f2747;
  --cbx-panel: #16345c;
  --cbx-soft: rgba(255, 255, 255, 0.07);
  --cbx-line: rgba(255, 255, 255, 0.12);
  --cbx-firm: rgba(255, 255, 255, 0.18);
  --cbx-ink: rgba(255, 255, 255, 0.94);
  --cbx-text: rgba(255, 255, 255, 0.72);
  --cbx-muted: rgba(255, 255, 255, 0.56);
  --cbx-berry: #a8204d;
  --cbx-info-ink: #c1daff;
  --cbx-info-fill: rgba(143, 189, 242, 0.16);
  --cbx-info-line: rgba(143, 189, 242, 0.34);
  --cbx-ring: rgba(143, 189, 242, 0.6);
  --cbx-check: #c1daff;
  --cbx-danger-ink: #f2a48c;
  --cbx-danger-fill: rgba(242, 164, 140, 0.14);
  --cbx-danger-line: rgba(242, 164, 140, 0.34);
  --cbx-field-shade: inset 0 1px 2px rgba(3, 12, 28, 0.35);
  --cbx-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --cbx-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --cbx-float: 0 24px 48px -24px rgba(3, 12, 28, 0.8), 0 8px 16px -8px rgba(3, 12, 28, 0.6);
}
.ui-at-cbx *, .ui-at-cbx *::before, .ui-at-cbx *::after { box-sizing: border-box; }

.ui-at-cbx__label {
  display: block;
  margin: 0 0 8px 2px;
  font-weight: 600;
  font-size: 13.5px;
  color: var(--cbx-ink);
}

.ui-at-cbx__field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  min-height: 44px;
  padding: 5px 38px 5px 6px;
  position: relative;
  background: var(--cbx-panel);
  border: 1px solid var(--cbx-firm);
  border-radius: 12px;
  box-shadow: var(--cbx-field-shade), var(--cbx-drop);
  cursor: text;
  transition: border-color 150ms var(--cbx-ease), box-shadow 150ms var(--cbx-ease);
}
.ui-at-cbx__field:focus-within {
  border-color: var(--cbx-info-line);
  box-shadow: var(--cbx-field-shade), 0 0 0 3px color-mix(in srgb, var(--cbx-ring) 45%, transparent), var(--cbx-drop);
}

.ui-at-cbx__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  min-width: 0;
  height: 28px;
  padding: 0 4px 0 4px;
  background: var(--cbx-info-fill);
  border: 1px solid var(--cbx-info-line);
  border-radius: 8px;
  color: var(--cbx-ink);
  font-size: 13px;
  font-weight: 500;
  animation: ui-at-cbx-pop 220ms var(--cbx-ease);
  transition: background-color 150ms var(--cbx-ease), border-color 150ms var(--cbx-ease);
}
.ui-at-cbx__chip[data-armed] {
  background: var(--cbx-danger-fill);
  border-color: var(--cbx-danger-line);
  color: var(--cbx-danger-ink);
}
.ui-at-cbx__chip-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.ui-at-cbx__chip-x {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--cbx-muted);
  cursor: pointer;
  transition: background-color 150ms var(--cbx-ease), color 150ms var(--cbx-ease);
}
.ui-at-cbx__chip-x:hover { background: var(--cbx-soft); color: var(--cbx-ink); }
.ui-at-cbx__chip-x:focus-visible { outline: 2px solid var(--cbx-ring); outline-offset: 1px; }
.ui-at-cbx__chip-x svg { width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }

.ui-at-cbx__more {
  display: inline-grid;
  place-items: center;
  height: 28px;
  min-width: 34px;
  padding: 0 8px;
  border-radius: 8px;
  background: var(--cbx-soft);
  border: 1px solid var(--cbx-line);
  color: var(--cbx-text);
  font-size: 12.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  animation: ui-at-cbx-roll 220ms var(--cbx-ease);
}

.ui-at-cbx__input {
  flex: 1 1 80px;
  min-width: 60px;
  height: 30px;
  padding: 0 6px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--cbx-ink);
  caret-color: var(--cbx-berry);
  font: inherit;
}
.ui-at-cbx__input::placeholder { color: var(--cbx-muted); }

.ui-at-cbx__toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  translate: 0 -50%;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--cbx-muted);
  cursor: pointer;
}
.ui-at-cbx__toggle:hover { background: var(--cbx-soft); color: var(--cbx-ink); }
.ui-at-cbx__toggle svg {
  width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round;
  rotate: 180deg;
  transition: rotate 150ms var(--cbx-ease);
}
.ui-at-cbx[data-open] .ui-at-cbx__toggle svg { rotate: 0deg; }

/* Popover: matte frame, raised list panel, footer in the frame. */
.ui-at-cbx__pop {
  position: absolute;
  z-index: 30;
  left: 0;
  right: 0;
  top: calc(100% + 6px);
  padding: 5px;
  background: var(--cbx-frame);
  border: 1px solid var(--cbx-line);
  border-radius: 18px;
  box-shadow: var(--cbx-float);
  transform-origin: top center;
  animation: ui-at-cbx-open 180ms var(--cbx-ease);
}
.ui-at-cbx__pop[hidden] { display: none; }
.ui-at-cbx__list {
  position: relative;
  max-height: 300px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px;
  background: var(--cbx-panel);
  border: 1px solid var(--cbx-line);
  border-radius: 13px;
  box-shadow: var(--cbx-drop);
  scrollbar-width: thin;
}
.ui-at-cbx__glide {
  position: absolute;
  left: 6px;
  right: 6px;
  top: 0;
  border-radius: 9px;
  background: var(--cbx-soft);
  pointer-events: none;
  transition: transform 150ms var(--cbx-ease), height 150ms var(--cbx-ease), opacity 150ms var(--cbx-ease);
}
.ui-at-cbx__group + .ui-at-cbx__group { margin-top: 4px; }
.ui-at-cbx__group-title {
  padding: 8px 10px 6px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--cbx-muted);
}
.ui-at-cbx__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 5px 10px;
  border-radius: 9px;
  cursor: pointer;
  user-select: none;
}
.ui-at-cbx__row[aria-selected="true"] { background: color-mix(in srgb, var(--cbx-info-fill) 70%, transparent); }
.ui-at-cbx__row[aria-selected="true"][data-active] { background: var(--cbx-info-fill); box-shadow: inset 0 0 0 1px var(--cbx-info-line); }
.ui-at-cbx__row[aria-selected="true"]::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 9px;
  bottom: 9px;
  width: 2px;
  border-radius: 2px;
  background: var(--cbx-berry);
}
.ui-at-cbx__row-text { display: flex; align-items: baseline; gap: 8px; min-width: 0; flex: 1; }
.ui-at-cbx__row-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--cbx-ink); font-weight: 500; }
.ui-at-cbx__row-hint { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--cbx-muted); font-size: 12.5px; }
.ui-at-cbx__row--create .ui-at-cbx__row-label { color: var(--cbx-info-ink); font-weight: 600; }
.ui-at-cbx__check {
  flex: none;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: var(--cbx-check);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: ui-at-cbx-check 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ui-at-cbx__empty { padding: 18px 10px; text-align: center; color: var(--cbx-muted); }

.ui-at-cbx__glyph {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--cbx-panel);
  border: 1px solid var(--cbx-line);
  box-shadow: var(--cbx-pebble);
  color: var(--cbx-info-ink);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
}
.ui-at-cbx__glyph img { width: 100%; height: 100%; object-fit: cover; }
.ui-at-cbx__glyph svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
.ui-at-cbx__glyph--sm { width: 20px; height: 20px; font-size: 8px; }
.ui-at-cbx__glyph--plus { border-radius: 8px; }
.ui-at-cbx__dot { flex: none; width: 9px; height: 9px; margin: 0 4px; border-radius: 999px; box-shadow: 0 0 0 2px var(--cbx-panel), 0 0 0 3px var(--cbx-line); }

.ui-at-cbx__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 8px 3px 10px;
  font-size: 12.5px;
  color: var(--cbx-muted);
}
.ui-at-cbx__count { font-variant-numeric: tabular-nums; animation: ui-at-cbx-roll 220ms var(--cbx-ease); }
.ui-at-cbx__keys { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
.ui-at-cbx__keys kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  font: inherit;
  font-size: 11px;
  color: var(--cbx-text);
  background: var(--cbx-panel);
  border: 1px solid var(--cbx-line);
  border-bottom-color: var(--cbx-firm);
  border-bottom-width: 2px;
  border-radius: 6px;
}
.ui-at-cbx__keys kbd + kbd { margin-left: -1px; }

.ui-at-cbx__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

@media (max-width: 420px) { .ui-at-cbx__keys { display: none; } }
@media (pointer: coarse) {
  .ui-at-cbx__row { min-height: 44px; }
  .ui-at-cbx__input { font-size: 16px; }
  .ui-at-cbx__chip { height: 32px; }
  .ui-at-cbx__chip-x { width: 28px; height: 28px; }
  .ui-at-cbx__keys { display: none; }
}

@keyframes ui-at-cbx-open { from { opacity: 0; transform: translateY(-4px) scale(0.98); } }
@keyframes ui-at-cbx-pop { from { opacity: 0; transform: scale(0.85); } }
@keyframes ui-at-cbx-check { from { opacity: 0; transform: scale(0.4); } }
@keyframes ui-at-cbx-roll { from { opacity: 0; transform: translateY(40%); } }

@media (prefers-reduced-motion: reduce) {
  .ui-at-cbx *, .ui-at-cbx *::before, .ui-at-cbx *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
}
\`;
`;export{e as default};
