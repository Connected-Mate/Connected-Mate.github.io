var e=`"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type Repeat = "once" | "monthly";
export type Duration = "milestone" | 1 | 3 | 6 | 12;

export type CatalogItem = { name: string; repeat: Repeat; price: number };

export type ScheduleLine =
  | { id: string; kind: "product"; name: string; repeat: Repeat; price: number }
  | { id: string; kind: "discount"; percent: number }
  | { id: string; kind: "minimum"; amount: number };

export type BillingScheduleValue = {
  phase: string;
  start: string;
  duration: Duration;
  lines: ScheduleLine[];
};

export type BillingScheduleProps = {
  title?: string;
  phase?: string;
  currency?: string;
  catalog?: CatalogItem[];
  defaultLines?: ScheduleLine[];
  /** yyyy-mm-dd */
  defaultStart?: string;
  defaultDuration?: Duration;
  onChange?: (schedule: BillingScheduleValue) => void;
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const DEFAULT_CATALOG: CatalogItem[] = [
  { name: "Set-up fee", repeat: "once", price: 4999 },
  { name: "Platform licence", repeat: "monthly", price: 1200 },
  { name: "Premium support", repeat: "monthly", price: 350 },
  { name: "Extra seats (10)", repeat: "monthly", price: 240 },
  { name: "Onboarding workshop", repeat: "once", price: 1500 },
];

const DEFAULT_LINES: ScheduleLine[] = [{ id: "setup", kind: "product", name: "Set-up fee", repeat: "once", price: 4999 }];

const DURATIONS: { id: Duration; label: string }[] = [
  { id: "milestone", label: "Milestone" },
  { id: 1, label: "1 month" },
  { id: 3, label: "3 months" },
  { id: 6, label: "6 months" },
  { id: 12, label: "12 months" },
];

let lineCounter = 0;
const newId = () => \`line-\${Date.now().toString(36)}-\${++lineCounter}\`;

const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function parseAmount(text: string) {
  const cleaned = text.replace(/[\\s,]/g, "");
  if (!/^\\d+(\\.\\d{0,2})?$|^\\.\\d{1,2}$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function parseDay(value: string) {
  const match = /^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

const showDay = (date: Date) =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function endOf(start: Date, months: number) {
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + months, start.getUTCDate()));
  end.setUTCDate(end.getUTCDate() - 1);
  return end;
}

export function totalsOf(lines: ScheduleLine[], duration: Duration) {
  const periods = duration === "milestone" ? 1 : duration;
  let once = 0;
  let monthly = 0;
  let percent = 0;
  let minimum = 0;
  for (const line of lines) {
    if (line.kind === "product") {
      if (line.repeat === "once") once += line.price;
      else monthly += line.price;
    } else if (line.kind === "discount") percent = Math.min(100, Math.max(0, line.percent));
    else minimum = Math.max(0, line.amount);
  }
  const keep = 1 - percent / 100;
  const firstInvoice = (once + monthly) * keep;
  const discounted = (once + monthly * periods) * keep;
  const minimumApplies = minimum > 0 && minimum > discounted;
  return { firstInvoice, phaseTotal: minimumApplies ? minimum : discounted, minimumApplies };
}

/* ------------------------------------------------------------------------------------------------
 * Icons
 * ----------------------------------------------------------------------------------------------*/

const icon = (path: ReactNode, size = 14) => (
  <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);
const IconPlus = () => icon(<path d="M8 3.5v9M3.5 8h9" />);
const IconDiscount = () => icon(<><circle cx="8" cy="8" r="5.5" /><path d="M5.8 10.2 10.2 5.8" /><circle cx="6" cy="6" r=".6" fill="currentColor" /><circle cx="10" cy="10" r=".6" fill="currentColor" /></>);
const IconMinimum = () => icon(<path d="M3 13h10M5 10.5h6M8 3v5M6.2 6.2 8 8l1.8-1.8" />);
const IconRepeat = () => icon(<path d="M3 7V6a2 2 0 0 1 2-2h7m-2-2 2 2-2 2M13 9v1a2 2 0 0 1-2 2H4m2 2-2-2 2-2" />);
const IconOnce = () => icon(<><circle cx="8" cy="8" r="5.5" /><path d="M8 5.5V8l1.6 1.6" /></>);
const IconChevron = () => icon(<path d="m4.5 6.5 3.5 3.5 3.5-3.5" />, 13);
const IconRemove = () => icon(<path d="m4.5 4.5 7 7m0-7-7 7" />, 13);
const IconCheck = () => icon(<path d="m3.5 8.3 3 3 6-6.6" />, 13);

/* ------------------------------------------------------------------------------------------------
 * Listbox menu – a button that opens a listbox (Duration, Add product)
 * ----------------------------------------------------------------------------------------------*/

type MenuOption = { id: string; label: string; detail?: string };

function Menu({
  label,
  options,
  selected,
  onSelect,
  className,
  children,
  align = "start",
  buttonRef,
}: {
  label: string;
  options: MenuOption[];
  selected?: string;
  onSelect: (id: string) => void;
  className: string;
  children: ReactNode;
  align?: "start" | "end";
  buttonRef?: RefObject<HTMLButtonElement | null>;
}) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const ownButton = useRef<HTMLButtonElement>(null);
  const button = buttonRef ?? ownButton;
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const show = (index?: number) => {
    const start = index ?? Math.max(0, options.findIndex((o) => o.id === selected));
    setActive(start);
    setOpen(true);
  };
  const close = (focusButton = true) => {
    setOpen(false);
    if (focusButton) button.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const away = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(\`[data-index="\${active}"]\`)?.scrollIntoView?.({ block: "nearest" });
  }, [open, active]);

  const onButtonKey = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      show(event.key === "ArrowUp" ? options.length - 1 : undefined);
    }
  };
  const onListKey = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[active];
      if (option) {
        close();
        onSelect(option.id);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="ui-at-bs__menu" ref={wrapRef}>
      <button
        ref={button}
        type="button"
        className={className}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? \`\${id}-list\` : undefined}
        aria-label={label}
        onClick={() => (open ? close(false) : show())}
        onKeyDown={onButtonKey}
      >
        {children}
      </button>
      {open && (
        <ul
          ref={listRef}
          id={\`\${id}-list\`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={\`\${id}-o\${active}\`}
          className="ui-at-bs__list"
          data-align={align}
          onKeyDown={onListKey}
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              id={\`\${id}-o\${index}\`}
              data-index={index}
              role="option"
              aria-selected={option.id === selected}
              data-active={index === active ? "" : undefined}
              className="ui-at-bs__opt"
              onPointerMove={() => setActive(index)}
              onClick={() => {
                close();
                onSelect(option.id);
              }}
            >
              <span className="ui-at-bs__opt-label">{option.label}</span>
              {option.detail && <span className="ui-at-bs__opt-detail">{option.detail}</span>}
              {option.id === selected && <IconCheck />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Amount field – a price, a percentage or a minimum; commits while typing, tidies on Enter / blur
 * ----------------------------------------------------------------------------------------------*/

function AmountField({
  value,
  onCommit,
  label,
  prefix,
  suffix,
  max,
  decimals = 2,
}: {
  value: number;
  onCommit: (value: number) => void;
  label: string;
  prefix?: string;
  suffix?: ReactNode;
  max?: number;
  decimals?: number;
}) {
  const errorId = useId();
  const show = (n: number) => (decimals === 0 ? \`\${Math.round(n)}\` : money(n));
  const [draft, setDraft] = useState(() => show(value));
  const [focused, setFocused] = useState(false);
  const parsed = parseAmount(draft);
  const invalid = parsed === null || (max !== undefined && parsed > max);

  useEffect(() => {
    if (!focused) setDraft(show(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, focused]);

  const tidy = () => setDraft(show(value));

  return (
    <span className="ui-at-bs__amount" data-invalid={invalid ? "" : undefined}>
      {prefix && <span className="ui-at-bs__affix" aria-hidden="true">{prefix}</span>}
      <input
        className="ui-at-bs__amount-input"
        inputMode="decimal"
        autoComplete="off"
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        value={draft}
        size={Math.max(3, draft.length)}
        onFocus={(event) => {
          setFocused(true);
          event.currentTarget.select();
        }}
        onBlur={() => {
          setFocused(false);
          tidy();
        }}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          const amount = parseAmount(next);
          if (amount !== null && (max === undefined || amount <= max)) onCommit(amount);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            tidy();
          } else if (event.key === "Escape") {
            setDraft(show(value));
          }
        }}
      />
      {suffix && <span className="ui-at-bs__affix ui-at-bs__affix--after" aria-hidden="true">{suffix}</span>}
      {invalid && (
        <span id={errorId} className="ui-at-bs__sr">
          {max !== undefined ? \`Enter a number from 0 to \${max}\` : "Enter an amount, like 1200.00"}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Billing Schedule
 * ----------------------------------------------------------------------------------------------*/

export function BillingSchedule({
  title = "Create a billing schedule",
  phase: defaultPhase = "Build-out phase",
  currency = "$",
  catalog = DEFAULT_CATALOG,
  defaultLines = DEFAULT_LINES,
  defaultStart = "2026-01-01",
  defaultDuration = "milestone",
  onChange,
  className,
}: BillingScheduleProps) {
  const titleId = useId();
  const startId = useId();
  const durationId = useId();
  const [phase, setPhase] = useState(defaultPhase);
  const [start, setStart] = useState(defaultStart);
  const [duration, setDuration] = useState<Duration>(defaultDuration);
  const [lines, setLines] = useState<ScheduleLine[]>(defaultLines);
  const [fresh, setFresh] = useState<string | null>(null);
  const addProductRef = useRef<HTMLButtonElement>(null);

  // Report every change, never the first render.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    onChangeRef.current?.({ phase, start, duration, lines });
  }, [phase, start, duration, lines]);

  const startDate = parseDay(start);
  const endLabel =
    duration === "milestone" ? "Milestone" : startDate ? showDay(endOf(startDate, duration)) : \`\${duration} months\`;
  const { firstInvoice, phaseTotal, minimumApplies } = totalsOf(lines, duration);
  const hasDiscount = lines.some((line) => line.kind === "discount");
  const hasMinimum = lines.some((line) => line.kind === "minimum");
  const durationLabel = DURATIONS.find((d) => d.id === duration)?.label ?? "Milestone";

  const add = (line: ScheduleLine) => {
    setLines((current) => {
      // Products go above the discount and the minimum, which stay at the end.
      if (line.kind !== "product") return [...current, line];
      const firstAdjust = current.findIndex((l) => l.kind !== "product");
      if (firstAdjust < 0) return [...current, line];
      return [...current.slice(0, firstAdjust), line, ...current.slice(firstAdjust)];
    });
    setFresh(line.id);
  };
  const update = (id: string, patch: Partial<ScheduleLine>) =>
    setLines((current) => current.map((line) => (line.id === id ? ({ ...line, ...patch } as ScheduleLine) : line)));
  const remove = (id: string) => {
    setLines((current) => current.filter((line) => line.id !== id));
    addProductRef.current?.focus();
  };

  const lineName = (line: ScheduleLine) =>
    line.kind === "product" ? line.name : line.kind === "discount" ? "Discount" : "Minimum commitment";

  return (
    <section className={["ui-at-bs", className].filter(Boolean).join(" ")} aria-labelledby={titleId}>
      <style href="ui-billing-schedule" precedence="default">
        {css}
      </style>
      <h3 className="ui-at-bs__title" id={titleId}>
        {title}
      </h3>

      <div className="ui-at-bs__panel">
        <div className="ui-at-bs__summary">
          <input
            className="ui-at-bs__phase"
            aria-label="Phase name"
            value={phase}
            placeholder="Phase name"
            maxLength={80}
            size={Math.max(8, phase.length || 10)}
            onChange={(event) => setPhase(event.target.value)}
            onBlur={() => !phase.trim() && setPhase(defaultPhase)}
          />
          <span className="ui-at-bs__range">
            <span>{startDate ? showDay(startDate) : "No start date"}</span>
            <span aria-hidden="true">→</span>
            <span key={endLabel} className="ui-at-bs__end">
              {endLabel}
            </span>
          </span>
        </div>

        <div className="ui-at-bs__fields">
          <div className="ui-at-bs__field">
            <label htmlFor={startId}>Start date</label>
            <input
              id={startId}
              className="ui-at-bs__input"
              type="date"
              value={start}
              required
              aria-invalid={!startDate || undefined}
              onChange={(event) => setStart(event.target.value)}
            />
          </div>
          <div className="ui-at-bs__field">
            <span id={durationId}>Duration</span>
            <Menu
              label="Duration"
              options={DURATIONS.map((d) => ({ id: String(d.id), label: d.label }))}
              selected={String(duration)}
              onSelect={(id) => setDuration(id === "milestone" ? "milestone" : (Number(id) as Duration))}
              className="ui-at-bs__input ui-at-bs__select"
            >
              <span>{durationLabel}</span>
              <IconChevron />
            </Menu>
          </div>
        </div>

        <div className="ui-at-bs__table-wrap">
          <table className="ui-at-bs__table">
            <caption className="ui-at-bs__sr">Lines of the {phase || "phase"}</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col" className="ui-at-bs__col-repeat">
                  Repeats
                </th>
                <th scope="col" className="ui-at-bs__col-price">
                  Price
                </th>
                <th scope="col" className="ui-at-bs__col-act">
                  <span className="ui-at-bs__sr">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.length === 0 && (
                <tr>
                  <td colSpan={4} className="ui-at-bs__empty">
                    No lines yet – add a product to start the phase.
                  </td>
                </tr>
              )}
              {lines.map((line) => (
                <tr key={line.id} data-kind={line.kind} data-fresh={fresh === line.id ? "" : undefined}>
                  <th scope="row" className="ui-at-bs__name">
                    <span className="ui-at-bs__name-in">
                      {line.kind !== "product" && (
                        <span className="ui-at-bs__pebble" aria-hidden="true">
                          {line.kind === "discount" ? <IconDiscount /> : <IconMinimum />}
                        </span>
                      )}
                      <span>{lineName(line)}</span>
                    </span>
                  </th>
                  <td className="ui-at-bs__col-repeat">
                    {line.kind === "product" ? (
                      <span className="ui-at-bs__repeat">
                        {line.repeat === "once" ? <IconOnce /> : <IconRepeat />}
                        {line.repeat === "once" ? "Once" : "Monthly"}
                      </span>
                    ) : (
                      <span className="ui-at-bs__muted">Whole phase</span>
                    )}
                  </td>
                  <td className="ui-at-bs__col-price">
                    {line.kind === "product" && (
                      <>
                        <AmountField
                          label={\`Price of \${line.name}\`}
                          value={line.price}
                          prefix={currency}
                          suffix={line.repeat === "once" ? "/ once" : "/ month"}
                          onCommit={(price) => update(line.id, { price })}
                        />
                        <span className="ui-at-bs__note">Billed in advance</span>
                      </>
                    )}
                    {line.kind === "discount" && (
                      <AmountField
                        label="Discount in percent"
                        value={line.percent}
                        decimals={0}
                        max={100}
                        suffix="% off"
                        onCommit={(percent) => update(line.id, { percent })}
                      />
                    )}
                    {line.kind === "minimum" && (
                      <>
                        <AmountField
                          label="Minimum commitment for the phase"
                          value={line.amount}
                          prefix={currency}
                          suffix="min."
                          onCommit={(amount) => update(line.id, { amount })}
                        />
                        <span className="ui-at-bs__note">{minimumApplies ? "Applies to this phase" : "Not reached – no effect"}</span>
                      </>
                    )}
                  </td>
                  <td className="ui-at-bs__col-act">
                    <button type="button" className="ui-at-bs__remove" aria-label={\`Remove \${lineName(line)}\`} onClick={() => remove(line.id)}>
                      <IconRemove />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ui-at-bs__actions">
          <Menu
            label="Add product"
            options={catalog.map((item, index) => ({
              id: String(index),
              label: item.name,
              detail: \`\${currency}\${money(item.price)} · \${item.repeat === "once" ? "once" : "monthly"}\`,
            }))}
            onSelect={(index) => {
              const item = catalog[Number(index)];
              if (item) add({ id: newId(), kind: "product", name: item.name, repeat: item.repeat, price: item.price });
            }}
            className="ui-at-bs__button"
            buttonRef={addProductRef}
          >
            <IconPlus />
            <span>Add product</span>
          </Menu>
          <span className="ui-at-bs__spacer" />
          <button
            type="button"
            className="ui-at-bs__button"
            disabled={hasDiscount}
            onClick={() => add({ id: newId(), kind: "discount", percent: 10 })}
          >
            <IconDiscount />
            <span>Add discount</span>
          </button>
          <button
            type="button"
            className="ui-at-bs__button"
            disabled={hasMinimum}
            onClick={() => add({ id: newId(), kind: "minimum", amount: 10000 })}
          >
            <IconMinimum />
            <span>Add minimum</span>
          </button>
        </div>
      </div>

      <footer className="ui-at-bs__totals" role="status" aria-live="polite">
        <span>
          First invoice <strong>{currency}{money(firstInvoice)}</strong>
        </span>
        <span>
          Phase total <strong>{currency}{money(phaseTotal)}</strong>
          {minimumApplies && <em> minimum applies</em>}
        </span>
      </footer>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ \`
.ui-at-bs {
  --ui-at-bs-frame: #f2f6fa;
  --ui-at-bs-panel: #ffffff;
  --ui-at-bs-pale: #fbfcfe;
  --ui-at-bs-soft: rgba(26, 62, 112, 0.06);
  --ui-at-bs-line: #dae2ec;
  --ui-at-bs-firm: #cbd6e4;
  --ui-at-bs-ink: #00162b;
  --ui-at-bs-text: rgba(0, 22, 43, 0.66);
  --ui-at-bs-muted: rgba(0, 22, 43, 0.54);
  --ui-at-bs-berry: #851437;
  --ui-at-bs-ring: #8fbdf2;
  --ui-at-bs-info-ink: #1a3e70;
  --ui-at-bs-info-fill: #eef5ff;
  --ui-at-bs-bad-ink: #8a3a22;
  --ui-at-bs-bad-fill: #fdeee8;
  --ui-at-bs-bad-line: #f5d5c9;
  --ui-at-bs-inner: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  --ui-at-bs-pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --ui-at-bs-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-at-bs-short: 0 2px 4px -2px rgba(26, 62, 112, 0.18);
  --ui-at-bs-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-at-bs-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-at-bs-ease: cubic-bezier(0.16, 1, 0.3, 1);

  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 560px;
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-at-bs-frame);
  border: 1px solid var(--ui-at-bs-line);
  box-shadow: var(--ui-at-bs-floating);
  color: var(--ui-at-bs-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-bs {
  --ui-at-bs-frame: #0f2747;
  --ui-at-bs-panel: #16345c;
  --ui-at-bs-pale: #1d416f;
  --ui-at-bs-soft: rgba(255, 255, 255, 0.07);
  --ui-at-bs-line: rgba(255, 255, 255, 0.12);
  --ui-at-bs-firm: rgba(255, 255, 255, 0.18);
  --ui-at-bs-ink: rgba(255, 255, 255, 0.94);
  --ui-at-bs-text: rgba(255, 255, 255, 0.72);
  --ui-at-bs-muted: rgba(255, 255, 255, 0.56);
  --ui-at-bs-berry: #a8204d;
  --ui-at-bs-ring: rgba(143, 189, 242, 0.6);
  --ui-at-bs-info-ink: #c1daff;
  --ui-at-bs-info-fill: rgba(143, 189, 242, 0.16);
  --ui-at-bs-bad-ink: #f2a48c;
  --ui-at-bs-bad-fill: rgba(242, 164, 140, 0.14);
  --ui-at-bs-bad-line: rgba(242, 164, 140, 0.4);
  --ui-at-bs-inner: inset 0 1px 2px rgba(3, 12, 28, 0.4);
  --ui-at-bs-pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --ui-at-bs-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-at-bs-short: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
  --ui-at-bs-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-at-bs-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}

.ui-at-bs__title {
  margin: 0;
  padding: 10px 12px 8px;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
}
.ui-at-bs__panel {
  padding: 12px;
  border-radius: 16px;
  background: var(--ui-at-bs-panel);
  border: 1px solid var(--ui-at-bs-line);
  box-shadow: var(--ui-at-bs-raised);
}

.ui-at-bs__summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 14px;
  padding: 0 2px 10px;
}
.ui-at-bs__phase {
  min-width: 0;
  max-width: 100%;
  margin: 0 -6px;
  padding: 3px 6px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-at-bs-ink);
  caret-color: var(--ui-at-bs-berry);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  transition: border-color 150ms var(--ui-at-bs-ease), background-color 150ms var(--ui-at-bs-ease);
}
.ui-at-bs__phase:hover { border-color: var(--ui-at-bs-line); }
.ui-at-bs__phase:focus { outline: none; border-color: var(--ui-at-bs-firm); background: var(--ui-at-bs-pale); box-shadow: 0 0 0 3px var(--ui-at-bs-ring); }
.ui-at-bs__range {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ui-at-bs-muted);
  white-space: nowrap;
}
.ui-at-bs__end { animation: ui-at-bs-fade 300ms var(--ui-at-bs-ease) both; }

.ui-at-bs__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  background: var(--ui-at-bs-soft);
}
.ui-at-bs__field { display: grid; gap: 5px; min-width: 0; }
.ui-at-bs__field > label, .ui-at-bs__field > span { color: var(--ui-at-bs-muted); font-size: 12px; }
.ui-at-bs__menu { position: relative; min-width: 0; }
.ui-at-bs__input {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--ui-at-bs-firm);
  background: var(--ui-at-bs-panel);
  box-shadow: var(--ui-at-bs-inner);
  color: var(--ui-at-bs-ink);
  caret-color: var(--ui-at-bs-berry);
  font: inherit;
  font-size: 13px;
  color-scheme: light;
  transition: border-color 150ms var(--ui-at-bs-ease), box-shadow 150ms var(--ui-at-bs-ease);
}
:where(.dark, [data-theme="dark"]) .ui-at-bs__input { color-scheme: dark; }
.ui-at-bs__input:focus, .ui-at-bs__input:focus-visible { outline: none; box-shadow: var(--ui-at-bs-inner), 0 0 0 3px var(--ui-at-bs-ring); }
.ui-at-bs__input[aria-invalid="true"] { border-color: var(--ui-at-bs-bad-line); background: var(--ui-at-bs-bad-fill); }
.ui-at-bs__select { cursor: pointer; text-align: left; }
.ui-at-bs__select > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-bs__select svg { flex: none; color: var(--ui-at-bs-muted); transition: transform 150ms var(--ui-at-bs-ease); }
.ui-at-bs__select[aria-expanded="true"] svg { transform: rotate(180deg); }

.ui-at-bs__list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  box-sizing: border-box;
  min-width: 100%;
  max-height: 260px;
  margin: 0;
  padding: 4px;
  overflow-y: auto;
  list-style: none;
  border-radius: 12px;
  background: var(--ui-at-bs-panel);
  border: 1px solid var(--ui-at-bs-firm);
  box-shadow: var(--ui-at-bs-floating), var(--ui-at-bs-drop);
  outline: none;
  transform-origin: top left;
  animation: ui-at-bs-scale 150ms var(--ui-at-bs-ease) both;
}
.ui-at-bs__list[data-align="end"] { left: auto; right: 0; transform-origin: top right; }
.ui-at-bs__list:focus-visible { box-shadow: var(--ui-at-bs-floating), 0 0 0 3px var(--ui-at-bs-ring); }
.ui-at-bs__opt {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 12px;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}
.ui-at-bs__opt[data-active] { background: var(--ui-at-bs-info-fill); }
.ui-at-bs__opt[aria-selected="true"] { color: var(--ui-at-bs-info-ink); font-weight: 600; }
.ui-at-bs__opt svg { grid-column: 2; grid-row: 1; color: var(--ui-at-bs-info-ink); }
.ui-at-bs__opt-label { overflow: hidden; text-overflow: ellipsis; }
.ui-at-bs__opt-detail { grid-column: 1 / -1; color: var(--ui-at-bs-muted); font-size: 11.5px; }

.ui-at-bs__table-wrap { margin-top: 6px; }
.ui-at-bs__table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.ui-at-bs__table th, .ui-at-bs__table td { padding: 0 6px; text-align: left; vertical-align: middle; }
.ui-at-bs__table thead th {
  height: 38px;
  border-bottom: 1px solid var(--ui-at-bs-line);
  color: var(--ui-at-bs-muted);
  font-size: 12px;
  font-weight: 500;
}
.ui-at-bs__table tbody tr { border-bottom: 1px solid var(--ui-at-bs-line); }
.ui-at-bs__table tbody tr[data-fresh] { animation: ui-at-bs-slide 300ms var(--ui-at-bs-ease) both; }
.ui-at-bs__table tbody td, .ui-at-bs__table tbody th { height: 56px; padding-top: 8px; padding-bottom: 8px; }
.ui-at-bs__col-repeat { width: 26%; }
.ui-at-bs__col-price { width: 40%; text-align: right !important; }
.ui-at-bs__col-act { width: 34px; text-align: right !important; padding-right: 0 !important; }
.ui-at-bs__name { font-weight: 500; overflow-wrap: anywhere; }
.ui-at-bs__name-in { display: flex; align-items: center; gap: 8px; min-width: 0; }
.ui-at-bs__pebble {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--ui-at-bs-panel);
  border: 1px solid var(--ui-at-bs-line);
  box-shadow: var(--ui-at-bs-pebble-shade);
  color: var(--ui-at-bs-info-ink);
}
.ui-at-bs__repeat { display: inline-flex; align-items: center; gap: 6px; color: var(--ui-at-bs-text); }
.ui-at-bs__repeat svg { color: var(--ui-at-bs-muted); }
.ui-at-bs__muted { color: var(--ui-at-bs-muted); }
.ui-at-bs__note { display: block; margin-top: 2px; color: var(--ui-at-bs-muted); font-size: 12px; }
.ui-at-bs__empty { height: 64px; color: var(--ui-at-bs-muted); text-align: center !important; }

.ui-at-bs__amount {
  display: inline-flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 5px;
  max-width: 100%;
}
.ui-at-bs__affix { color: var(--ui-at-bs-text); white-space: nowrap; }
.ui-at-bs__affix--after { color: var(--ui-at-bs-muted); font-size: 12px; }
.ui-at-bs__amount-input {
  min-width: 2.5em;
  max-width: 9em;
  padding: 2px 6px;
  margin: -3px -2px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--ui-at-bs-ink);
  caret-color: var(--ui-at-bs-berry);
  font: inherit;
  font-size: 13.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  text-align: right;
  transition: border-color 150ms var(--ui-at-bs-ease), background-color 150ms var(--ui-at-bs-ease);
}
.ui-at-bs__amount-input:hover { border-color: var(--ui-at-bs-line); }
.ui-at-bs__amount-input:focus { outline: none; border-color: var(--ui-at-bs-firm); background: var(--ui-at-bs-pale); box-shadow: 0 0 0 3px var(--ui-at-bs-ring); }
.ui-at-bs__amount[data-invalid] .ui-at-bs__amount-input { border-color: var(--ui-at-bs-bad-line); background: var(--ui-at-bs-bad-fill); color: var(--ui-at-bs-bad-ink); }

.ui-at-bs__remove {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-at-bs-muted);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms var(--ui-at-bs-ease), background-color 150ms var(--ui-at-bs-ease), color 150ms var(--ui-at-bs-ease);
}
.ui-at-bs__table tbody tr:hover .ui-at-bs__remove, .ui-at-bs__table tbody tr:focus-within .ui-at-bs__remove { opacity: 1; }
.ui-at-bs__remove:hover { background: var(--ui-at-bs-bad-fill); color: var(--ui-at-bs-bad-ink); }
.ui-at-bs__remove:focus-visible { opacity: 1; outline: 3px solid var(--ui-at-bs-ring); }
@media (hover: none) { .ui-at-bs__remove { opacity: 1; } }

.ui-at-bs__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px;
  border-radius: 12px;
  background: var(--ui-at-bs-soft);
}
.ui-at-bs__spacer { flex: 1 1 0; }
.ui-at-bs__button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 13px;
  border-radius: 10px;
  border: 1px solid var(--ui-at-bs-firm);
  background: var(--ui-at-bs-pale);
  color: var(--ui-at-bs-ink);
  box-shadow: var(--ui-at-bs-short);
  font: inherit;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 150ms var(--ui-at-bs-ease), opacity 300ms var(--ui-at-bs-ease), transform 150ms var(--ui-at-bs-ease);
}
.ui-at-bs__button svg { color: var(--ui-at-bs-muted); }
.ui-at-bs__button:hover:not(:disabled) { border-color: var(--ui-at-bs-muted); }
.ui-at-bs__button:active:not(:disabled) { transform: translateY(1px); }
.ui-at-bs__button:focus-visible { outline: 3px solid var(--ui-at-bs-ring); outline-offset: 1px; }
.ui-at-bs__button:disabled { cursor: default; opacity: 0.45; box-shadow: none; }

.ui-at-bs__totals {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
  padding: 10px 10px 6px;
  color: var(--ui-at-bs-muted);
  font-size: 12.5px;
}
.ui-at-bs__totals strong { margin-left: 6px; color: var(--ui-at-bs-ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-at-bs__totals em { font-style: normal; color: var(--ui-at-bs-info-ink); font-size: 12px; }
.ui-at-bs__sr {
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

@container (max-width: 460px) {
  .ui-at-bs__fields { grid-template-columns: 1fr; }
  .ui-at-bs__col-repeat { display: none; }
  .ui-at-bs__col-price { width: 52%; }
  .ui-at-bs__spacer { display: none; }
  .ui-at-bs__actions .ui-at-bs__menu, .ui-at-bs__actions > .ui-at-bs__button { flex: 1 1 auto; }
  .ui-at-bs__actions .ui-at-bs__button { justify-content: center; width: 100%; }
}
@media (pointer: coarse) {
  .ui-at-bs__input, .ui-at-bs__button { height: 42px; }
  .ui-at-bs__remove { width: 34px; height: 34px; }
  .ui-at-bs__opt { padding: 11px 10px; }
}

@keyframes ui-at-bs-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-bs-scale { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes ui-at-bs-slide { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  .ui-at-bs *, .ui-at-bs *::before, .ui-at-bs *::after {
    animation: none !important;
    transition: none !important;
  }
}
\`;
`;export{e as default};
