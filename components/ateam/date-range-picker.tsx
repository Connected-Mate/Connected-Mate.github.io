"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type DateRange = { start: Date; end: Date };
export type CompareMode = "off" | "previous" | "year";

export type DateRangePreset = {
  id: string;
  label: string;
  /** Builds the range from the reference day. */
  range: (today: Date) => DateRange;
};

export type DateRangePickerProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange, compare: DateRange | null, mode: CompareMode) => void;
  presets?: DateRangePreset[];
  compare?: boolean;
  defaultCompare?: CompareMode;
  weekStartsOn?: 0 | 1;
  min?: Date;
  max?: Date;
  defaultOpen?: boolean;
  today?: Date;
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Date helpers (local days, time stripped)
 * ----------------------------------------------------------------------------------------------*/

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const daysIn = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
function addMonths(d: Date, n: number) {
  const y = d.getFullYear();
  const m = d.getMonth() + n;
  const target = new Date(y, m, 1);
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), daysIn(target.getFullYear(), target.getMonth())));
}
function addYears(d: Date, n: number) {
  const y = d.getFullYear() + n;
  return new Date(y, d.getMonth(), Math.min(d.getDate(), daysIn(y, d.getMonth())));
}
const same = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const span = (r: DateRange) => Math.round((day(r.end).getTime() - day(r.start).getTime()) / 86400000) + 1;
const sorted = (a: Date, b: Date): DateRange => (a <= b ? { start: a, end: b } : { start: b, end: a });
const sameRange = (a: DateRange, b: DateRange) => same(a.start, b.start) && same(a.end, b.end);

const fmtMonth = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const fmtShort = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const fmtFull = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const fmtWeekday = new Intl.DateTimeFormat("en-US", { weekday: "short" });

export function formatRange(r: DateRange) {
  const a = day(r.start);
  const b = day(r.end);
  if (same(a, b)) return `${fmtShort.format(a)}, ${a.getFullYear()}`;
  if (a.getFullYear() === b.getFullYear()) return `${fmtShort.format(a)} – ${fmtShort.format(b)}, ${b.getFullYear()}`;
  return `${fmtShort.format(a)}, ${a.getFullYear()} – ${fmtShort.format(b)}, ${b.getFullYear()}`;
}

/** The comparison range for a range: the same length just before it, or the same days a year earlier. */
export function compareRange(r: DateRange, mode: CompareMode): DateRange | null {
  if (mode === "off") return null;
  if (mode === "year") return { start: addYears(day(r.start), -1), end: addYears(day(r.end), -1) };
  const end = addDays(day(r.start), -1);
  return { start: addDays(end, -(span(r) - 1)), end };
}

export const defaultPresets: DateRangePreset[] = [
  { id: "today", label: "Today", range: (t) => ({ start: day(t), end: day(t) }) },
  { id: "yesterday", label: "Yesterday", range: (t) => ({ start: addDays(t, -1), end: addDays(t, -1) }) },
  { id: "7d", label: "Last 7 days", range: (t) => ({ start: addDays(t, -6), end: day(t) }) },
  { id: "30d", label: "Last 30 days", range: (t) => ({ start: addDays(t, -29), end: day(t) }) },
  { id: "90d", label: "Last 90 days", range: (t) => ({ start: addDays(t, -89), end: day(t) }) },
  { id: "month", label: "This month", range: (t) => ({ start: monthStart(t), end: day(t) }) },
  {
    id: "last-month",
    label: "Last month",
    range: (t) => {
      const s = new Date(t.getFullYear(), t.getMonth() - 1, 1);
      return { start: s, end: new Date(s.getFullYear(), s.getMonth() + 1, 0) };
    },
  },
  {
    id: "quarter",
    label: "This quarter",
    range: (t) => ({ start: new Date(t.getFullYear(), Math.floor(t.getMonth() / 3) * 3, 1), end: day(t) }),
  },
  { id: "ytd", label: "Year to date", range: (t) => ({ start: new Date(t.getFullYear(), 0, 1), end: day(t) }) },
];

const compareLabels: Record<CompareMode, string> = { off: "Off", previous: "Previous period", year: "Previous year" };

/* ------------------------------------------------------------------------------------------------
 * DateRangePicker
 * ----------------------------------------------------------------------------------------------*/

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  presets = defaultPresets,
  compare = true,
  defaultCompare = "previous",
  weekStartsOn = 1,
  min,
  max,
  defaultOpen = false,
  today: todayProp,
  className,
}: DateRangePickerProps) {
  const uid = useId();
  const [today] = useState(() => day(todayProp ?? new Date()));
  const maxDay = day(max ?? today);
  const minDay = min ? day(min) : null;
  const clampDay = useCallback(
    (d: Date) => (d > maxDay ? maxDay : minDay && d < minDay ? minDay : d),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxDay.getTime(), minDay?.getTime()],
  );
  const clampRange = (r: DateRange): DateRange => sorted(clampDay(day(r.start)), clampDay(day(r.end)));
  const disabled = (d: Date) => d > maxDay || (!!minDay && d < minDay);

  const [inner, setInner] = useState<DateRange>(() =>
    clampRange(defaultValue ?? { start: addDays(today, -29), end: today }),
  );
  const committed = value ? { start: day(value.start), end: day(value.end) } : inner;
  const [mode, setMode] = useState<CompareMode>(compare ? defaultCompare : "off");
  const committedMode: CompareMode = compare ? mode : "off";

  const [open, setOpen] = useState(defaultOpen);
  const [draft, setDraft] = useState<DateRange>(committed);
  const [draftMode, setDraftMode] = useState<CompareMode>(committedMode);
  const [anchor, setAnchor] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const [focusDay, setFocusDay] = useState<Date>(committed.end);
  const [view, setView] = useState<Date>(monthStart(committed.end));
  const [dir, setDir] = useState<0 | 1 | -1>(0);
  const [narrow, setNarrow] = useState(false);
  const [announce, setAnnounce] = useState("");
  const focusTick = useRef(0);
  const [focusReq, setFocusReq] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 600px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const openPanel = () => {
    setDraft(committed);
    setDraftMode(committedMode);
    setAnchor(null);
    setHover(null);
    setFocusDay(committed.end);
    setView(monthStart(committed.end));
    setDir(0);
    setOpen(true);
    setFocusReq(++focusTick.current);
  };

  const close = useCallback(
    (apply: boolean) => {
      if (apply) {
        const r = anchor ? { start: anchor, end: anchor } : draft;
        if (!value) setInner(r);
        setMode(draftMode);
        onChange?.(r, compareRange(r, draftMode), draftMode);
      }
      setAnchor(null);
      setHover(null);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [anchor, draft, draftMode, onChange, value],
  );

  // Close without applying when the pointer goes down outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setAnchor(null);
        setHover(null);
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Move real focus to the focused day after keyboard moves or opening.
  useEffect(() => {
    if (!open || !focusReq) return;
    const btn = panelRef.current?.querySelector<HTMLButtonElement>(`[data-day="${key(focusDay)}"]`);
    btn?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusReq, open]);

  const months = narrow ? [view] : [addMonths(view, -1), view];
  const firstShown = months[0];

  const shiftView = (n: number) => {
    const next = addMonths(view, n);
    setDir(n > 0 ? 1 : -1);
    setView(next);
    const shown = narrow ? [next] : [addMonths(next, -1), next];
    setAnnounce(shown.map((m) => fmtMonth.format(m)).join(" – "));
  };

  const ensureVisible = (d: Date) => {
    const m = monthStart(d);
    const lastShown = view;
    if (m > lastShown) {
      const n = (m.getFullYear() - lastShown.getFullYear()) * 12 + m.getMonth() - lastShown.getMonth();
      shiftView(n);
    } else if (m < firstShown) {
      const n = (m.getFullYear() - firstShown.getFullYear()) * 12 + m.getMonth() - firstShown.getMonth();
      shiftView(n);
    }
  };

  const moveFocus = (d: Date) => {
    const next = clampDay(day(d));
    setFocusDay(next);
    ensureVisible(next);
    if (anchor) setHover(next);
    setFocusReq(++focusTick.current);
  };

  const pick = (d: Date) => {
    if (disabled(d)) return;
    setFocusDay(d);
    if (!anchor) {
      setAnchor(d);
      setHover(d);
      setDraft({ start: d, end: d });
      setAnnounce(`Start ${fmtFull.format(d)}. Pick the end date.`);
    } else {
      const r = sorted(anchor, d);
      setDraft(r);
      setAnchor(null);
      setHover(null);
      setAnnounce(`${formatRange(r)}, ${span(r)} days`);
    }
  };

  const onDayKey = (e: ReactKeyboardEvent<HTMLButtonElement>, d: Date) => {
    const wd = (d.getDay() - weekStartsOn + 7) % 7;
    let next: Date | null = null;
    switch (e.key) {
      case "ArrowLeft": next = addDays(d, -1); break;
      case "ArrowRight": next = addDays(d, 1); break;
      case "ArrowUp": next = addDays(d, -7); break;
      case "ArrowDown": next = addDays(d, 7); break;
      case "PageUp": next = e.shiftKey ? addYears(d, -1) : addMonths(d, -1); break;
      case "PageDown": next = e.shiftKey ? addYears(d, 1) : addMonths(d, 1); break;
      case "Home": next = addDays(d, -wd); break;
      case "End": next = addDays(d, 6 - wd); break;
      default: return;
    }
    e.preventDefault();
    moveFocus(next);
  };

  const shown: DateRange | null = anchor && hover ? sorted(anchor, hover) : draft;
  const previewing = !!anchor;
  const cmp = compare ? compareRange(anchor ? { start: anchor, end: anchor } : draft, draftMode) : null;
  const activePreset = anchor ? null : presets.find((p) => sameRange(clampRange(p.range(today)), draft))?.id ?? null;

  const weekdays = useMemo(() => {
    const base = new Date(2024, 0, 7 + weekStartsOn); // a Sunday + offset
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(base, i);
      return { short: fmtWeekday.format(d).slice(0, 2), long: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d) };
    });
  }, [weekStartsOn]);

  const canPrev = !minDay || firstShown > monthStart(minDay);
  const canNext = monthStart(view) < monthStart(maxDay);
  const committedCmp = compareRange(committed, committedMode);

  const renderMonth = (m: Date, i: number) => {
    const y = m.getFullYear();
    const mo = m.getMonth();
    const total = daysIn(y, mo);
    const lead = (new Date(y, mo, 1).getDay() - weekStartsOn + 7) % 7;
    const cells: (Date | null)[] = [...Array(lead).fill(null)];
    for (let dd = 1; dd <= total; dd++) cells.push(new Date(y, mo, dd));
    while (cells.length % 7) cells.push(null);
    const weeks: (Date | null)[][] = [];
    for (let k = 0; k < cells.length; k += 7) weeks.push(cells.slice(k, k + 7));
    const titleId = `${uid}-m${i}`;
    const focusInMonth = focusDay.getMonth() === mo && focusDay.getFullYear() === y;
    const tabDay = focusInMonth ? focusDay : null;

    return (
      <div className="ui-at-drp__month" key={`${y}-${mo}`} data-dir={dir || undefined}>
        <div className="ui-at-drp__month-head">
          {i === 0 ? (
            <button
              type="button"
              className="ui-at-drp__nav"
              aria-label="Previous month"
              disabled={!canPrev}
              onClick={() => shiftView(-1)}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M7.5 2.5L4 6l3.5 3.5" />
              </svg>
            </button>
          ) : (
            <span className="ui-at-drp__nav-space" />
          )}
          <h3 id={titleId} className="ui-at-drp__month-title">
            {fmtMonth.format(m)}
          </h3>
          {i === months.length - 1 ? (
            <button
              type="button"
              className="ui-at-drp__nav"
              aria-label="Next month"
              disabled={!canNext}
              onClick={() => shiftView(1)}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M4.5 2.5L8 6 4.5 9.5" />
              </svg>
            </button>
          ) : (
            <span className="ui-at-drp__nav-space" />
          )}
        </div>
        <div role="grid" aria-labelledby={titleId} className="ui-at-drp__grid">
          <div role="row" className="ui-at-drp__week ui-at-drp__week--head">
            {weekdays.map((w) => (
              <span role="columnheader" key={w.long} className="ui-at-drp__wd">
                <abbr title={w.long}>{w.short}</abbr>
              </span>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div role="row" className="ui-at-drp__week" key={wi}>
              {week.map((d, ci) => {
                if (!d) return <span role="gridcell" key={ci} className="ui-at-drp__cell ui-at-drp__cell--blank" />;
                const inRange = !!shown && d >= shown.start && d <= shown.end;
                const isStart = !!shown && same(d, shown.start);
                const isEnd = !!shown && same(d, shown.end);
                const inCmp = !!cmp && d >= cmp.start && d <= cmp.end;
                const cmpStart = !!cmp && same(d, cmp.start);
                const cmpEnd = !!cmp && same(d, cmp.end);
                const capL = isStart || ci === 0 || d.getDate() === 1;
                const capR = isEnd || ci === 6 || d.getDate() === total;
                const cmpCapL = cmpStart || ci === 0 || d.getDate() === 1;
                const cmpCapR = cmpEnd || ci === 6 || d.getDate() === total;
                const off = disabled(d);
                const isTab = tabDay ? same(d, tabDay) : false;
                return (
                  <span
                    role="gridcell"
                    key={ci}
                    className="ui-at-drp__cell"
                    aria-selected={inRange}
                    data-range={inRange ? "" : undefined}
                    data-preview={inRange && previewing ? "" : undefined}
                    data-cap-l={inRange && capL ? "" : undefined}
                    data-cap-r={inRange && capR ? "" : undefined}
                    data-cmp={inCmp && !inRange ? "" : undefined}
                    data-cmp-cap-l={inCmp && cmpCapL ? "" : undefined}
                    data-cmp-cap-r={inCmp && cmpCapR ? "" : undefined}
                  >
                    <button
                      type="button"
                      className="ui-at-drp__day"
                      data-day={key(d)}
                      data-end={isStart || isEnd ? "" : undefined}
                      data-cmp-end={(cmpStart || cmpEnd) && !inRange ? "" : undefined}
                      data-today={same(d, today) ? "" : undefined}
                      aria-current={same(d, today) ? "date" : undefined}
                      aria-label={fmtFull.format(d)}
                      aria-disabled={off || undefined}
                      tabIndex={isTab ? 0 : -1}
                      onClick={() => pick(d)}
                      onPointerEnter={() => anchor && !off && setHover(d)}
                      onFocus={() => !same(d, focusDay) && setFocusDay(d)}
                      onKeyDown={(e) => onDayKey(e, d)}
                    >
                      {d.getDate()}
                    </button>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={rootRef}
      className={["ui-at-drp", className].filter(Boolean).join(" ")}
      data-open={open ? "" : undefined}
      data-narrow={narrow ? "" : undefined}
    >
      <style href="ui-date-range-picker" precedence="default">
        {css}
      </style>
      <button
        ref={triggerRef}
        type="button"
        className="ui-at-drp__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${uid}-panel`}
        onClick={() => (open ? close(false) : openPanel())}
      >
        <svg className="ui-at-drp__cal" viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="10" rx="2" />
          <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
        </svg>
        <span className="ui-at-drp__trigger-text">
          <span className="ui-at-drp__trigger-range">{formatRange(committed)}</span>
          {committedCmp ? <span className="ui-at-drp__trigger-cmp">vs. {formatRange(committedCmp)}</span> : null}
        </span>
        <svg className="ui-at-drp__chev" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3 4.5L6 7.5l3-3" />
        </svg>
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={`${uid}-panel`}
          className="ui-at-drp__panel"
          role="dialog"
          aria-label="Choose a date range"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              close(false);
            }
          }}
        >
          <div className="ui-at-drp__sheet">
            <div className="ui-at-drp__presets" role="group" aria-label="Presets">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="ui-at-drp__preset"
                  aria-pressed={activePreset === p.id}
                  onClick={() => {
                    const r = clampRange(p.range(today));
                    setDraft(r);
                    setAnchor(null);
                    setHover(null);
                    setFocusDay(r.end);
                    if (!same(monthStart(r.end), view)) {
                      setDir(monthStart(r.end) > view ? 1 : -1);
                      setView(monthStart(r.end));
                    }
                    setAnnounce(`${p.label}: ${formatRange(r)}`);
                  }}
                >
                  {p.label}
                </button>
              ))}
              <span className="ui-at-drp__preset ui-at-drp__preset--custom" aria-hidden="true" data-on={activePreset ? undefined : ""}>
                Custom
              </span>
            </div>
            <div className="ui-at-drp__months" onPointerLeave={() => anchor && setHover(anchor)}>
              {months.map(renderMonth)}
            </div>
          </div>

          <div className="ui-at-drp__foot">
            <div className="ui-at-drp__summary">
              <p className="ui-at-drp__sum-line">
                {anchor ? (
                  <>
                    <strong>{fmtShort.format(anchor)} – …</strong>
                    <span className="ui-at-drp__muted">Pick the end date</span>
                  </>
                ) : (
                  <>
                    <strong>{formatRange(draft)}</strong>
                    <span className="ui-at-drp__muted">
                      {span(draft)} {span(draft) === 1 ? "day" : "days"}
                    </span>
                  </>
                )}
              </p>
              {compare ? (
                <>
                  <div className="ui-at-drp__cmp-row">
                    <span className="ui-at-drp__muted" id={`${uid}-cmp`}>
                      Compare
                    </span>
                    <Segmented value={draftMode} onChange={setDraftMode} labelledBy={`${uid}-cmp`} />
                  </div>
                  <p className="ui-at-drp__cmp-line" data-off={cmp ? undefined : ""}>
                    <span className="ui-at-drp__swatch" aria-hidden="true" />
                    {cmp ? `vs. ${formatRange(cmp)}` : "No comparison"}
                  </p>
                </>
              ) : null}
            </div>
            <div className="ui-at-drp__actions">
              <button type="button" className="ui-at-drp__btn ui-at-drp__btn--ghost" onClick={() => close(false)}>
                Cancel
              </button>
              <button type="button" className="ui-at-drp__btn ui-at-drp__btn--main" onClick={() => close(true)}>
                Apply
              </button>
            </div>
          </div>
          <span className="ui-at-drp__sr" aria-live="polite">
            {announce}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function Segmented({
  value,
  onChange,
  labelledBy,
}: {
  value: CompareMode;
  onChange: (m: CompareMode) => void;
  labelledBy: string;
}) {
  const modes: CompareMode[] = ["off", "previous", "year"];
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="ui-at-drp__seg" role="radiogroup" aria-labelledby={labelledBy}>
      {modes.map((m, i) => (
        <button
          key={m}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={value === m}
          tabIndex={value === m ? 0 : -1}
          className="ui-at-drp__seg-opt"
          onClick={() => onChange(m)}
          onKeyDown={(e) => {
            const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
            if (!step) return;
            e.preventDefault();
            const n = (i + step + modes.length) % modes.length;
            onChange(modes[n]);
            refs.current[n]?.focus();
          }}
        >
          {compareLabels[m]}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-at-drp {
  --drp-frame: #f2f6fa;
  --drp-panel: #ffffff;
  --drp-pale: #fbfcfe;
  --drp-soft: rgba(26, 62, 112, 0.06);
  --drp-line: #dae2ec;
  --drp-firm: #cbd6e4;
  --drp-ink: #00162b;
  --drp-text: rgba(0, 22, 43, 0.66);
  --drp-muted: rgba(0, 22, 43, 0.54);
  --drp-faint: rgba(0, 22, 43, 0.3);
  --drp-berry: #851437;
  --drp-berry-hover: #6d0f2d;
  --drp-info-ink: #1a3e70;
  --drp-info-fill: #eef5ff;
  --drp-info-line: #c1daff;
  --drp-ring: #8fbdf2;
  --drp-band: #e3eefc;
  --drp-band-preview: #f1f6fd;
  --drp-end-ink: #ffffff;
  --drp-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drp-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --drp-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3), 0 8px 16px -8px rgba(26, 62, 112, 0.18);
  --drp-main-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  --drp-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  display: inline-block;
  max-width: 100%;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: var(--drp-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-drp {
  --drp-frame: #0f2747;
  --drp-panel: #16345c;
  --drp-pale: #1a3b66;
  --drp-soft: rgba(255, 255, 255, 0.07);
  --drp-line: rgba(255, 255, 255, 0.12);
  --drp-firm: rgba(255, 255, 255, 0.18);
  --drp-ink: rgba(255, 255, 255, 0.94);
  --drp-text: rgba(255, 255, 255, 0.72);
  --drp-muted: rgba(255, 255, 255, 0.56);
  --drp-faint: rgba(255, 255, 255, 0.3);
  --drp-berry: #a8204d;
  --drp-berry-hover: #bd2a5a;
  --drp-info-ink: #c1daff;
  --drp-info-fill: rgba(143, 189, 242, 0.16);
  --drp-info-line: rgba(143, 189, 242, 0.34);
  --drp-ring: rgba(143, 189, 242, 0.6);
  --drp-band: rgba(143, 189, 242, 0.2);
  --drp-band-preview: rgba(143, 189, 242, 0.1);
  --drp-end-ink: #0f2747;
  --drp-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drp-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --drp-float: 0 24px 48px -24px rgba(3, 12, 28, 0.8), 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --drp-main-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 6px 12px -6px rgba(3, 12, 28, 0.7);
}
.ui-at-drp *, .ui-at-drp *::before, .ui-at-drp *::after { box-sizing: border-box; }
:where(.ui-at-drp) button { font: inherit; color: inherit; }
.ui-at-drp :focus-visible { outline: 2px solid var(--drp-ring); outline-offset: 2px; }

/* Trigger: secondary button. */
.ui-at-drp__trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  min-height: 46px;
  padding: 6px 12px;
  background: var(--drp-pale);
  border: 1px solid var(--drp-firm);
  border-radius: 12px;
  box-shadow: var(--drp-drop);
  cursor: pointer;
  text-align: left;
  transition: border-color 150ms var(--drp-ease), background-color 150ms var(--drp-ease);
}
.ui-at-drp__trigger:hover { border-color: var(--drp-info-line); }
.ui-at-drp__cal, .ui-at-drp__chev { flex: none; fill: none; stroke: var(--drp-text); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.ui-at-drp__cal { width: 16px; height: 16px; }
.ui-at-drp__chev { width: 12px; height: 12px; transition: rotate 150ms var(--drp-ease); }
.ui-at-drp[data-open] .ui-at-drp__chev { rotate: 180deg; }
.ui-at-drp__trigger-text { display: grid; min-width: 0; }
.ui-at-drp__trigger-range { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-drp__trigger-cmp { font-size: 12.5px; color: var(--drp-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Panel: matte frame, raised sheet, footer in the frame. */
.ui-at-drp__panel {
  position: absolute;
  z-index: 40;
  top: calc(100% + 8px);
  left: 0;
  width: var(--ui-at-drp-panel-width, min(652px, calc(100vw - 32px)));
  padding: 6px;
  background: var(--drp-frame);
  border: 1px solid var(--drp-line);
  border-radius: 22px;
  box-shadow: var(--drp-float);
  transform-origin: top left;
  animation: ui-at-drp-open 180ms var(--drp-ease);
}
.ui-at-drp__sheet {
  display: grid;
  grid-template-columns: 136px 1fr;
  background: var(--drp-panel);
  border: 1px solid var(--drp-line);
  border-radius: 16px;
  box-shadow: var(--drp-drop);
  overflow: hidden;
}
.ui-at-drp__presets {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 6px;
  border-right: 1px solid var(--drp-line);
}
.ui-at-drp__preset {
  display: block;
  width: 100%;
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--drp-text);
  font-size: 13.5px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--drp-ease), color 150ms var(--drp-ease);
}
.ui-at-drp__preset:hover { background: var(--drp-soft); color: var(--drp-ink); }
.ui-at-drp__preset[aria-pressed="true"], .ui-at-drp__preset--custom[data-on] {
  position: relative;
  background: var(--drp-info-fill);
  border-color: var(--drp-info-line);
  color: var(--drp-info-ink);
  font-weight: 600;
}
.ui-at-drp__preset[aria-pressed="true"]::before, .ui-at-drp__preset--custom[data-on]::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 2px;
  background: var(--drp-berry);
}
.ui-at-drp__preset--custom { cursor: default; color: var(--drp-muted); }
.ui-at-drp__preset--custom:hover { background: transparent; }

.ui-at-drp__months {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 20px;
  padding: 10px 16px 14px;
  overflow: hidden;
}
.ui-at-drp__month { min-width: 0; animation: ui-at-drp-in 220ms var(--drp-ease); }
.ui-at-drp__month[data-dir="1"] { animation-name: ui-at-drp-from-right; }
.ui-at-drp__month[data-dir="-1"] { animation-name: ui-at-drp-from-left; }
.ui-at-drp__month-head { display: flex; align-items: center; justify-content: space-between; height: 32px; margin-bottom: 6px; }
.ui-at-drp__month-title {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--drp-ink);
}
.ui-at-drp__nav, .ui-at-drp__nav-space { width: 28px; height: 28px; flex: none; }
.ui-at-drp__nav {
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
}
.ui-at-drp__nav:hover:not(:disabled) { background: var(--drp-soft); border-color: var(--drp-line); }
.ui-at-drp__nav:disabled { opacity: 0.35; cursor: default; }
.ui-at-drp__nav svg { width: 12px; height: 12px; fill: none; stroke: var(--drp-ink); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

.ui-at-drp__grid { display: grid; gap: 4px; }
.ui-at-drp__week { display: grid; grid-template-columns: repeat(7, 1fr); }
.ui-at-drp__wd { display: grid; place-items: center; height: 24px; font-size: 11.5px; font-weight: 600; color: var(--drp-muted); }
.ui-at-drp__wd abbr { text-decoration: none; }
.ui-at-drp__cell { position: relative; display: grid; place-items: center; height: 34px; }
.ui-at-drp__cell[data-cmp] { background: var(--drp-soft); }
.ui-at-drp__cell[data-cmp-cap-l] { border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
.ui-at-drp__cell[data-cmp-cap-r] { border-top-right-radius: 10px; border-bottom-right-radius: 10px; }
.ui-at-drp__cell[data-range] { background: var(--drp-band); transition: background-color 150ms var(--drp-ease); }
.ui-at-drp__cell[data-preview] { background: var(--drp-band-preview); }
.ui-at-drp__cell[data-cap-l] { border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
.ui-at-drp__cell[data-cap-r] { border-top-right-radius: 10px; border-bottom-right-radius: 10px; }
.ui-at-drp__day {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  max-width: 36px;
  height: 32px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--drp-ink);
  font-size: 13.5px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: background-color 150ms var(--drp-ease), color 150ms var(--drp-ease), border-color 150ms var(--drp-ease);
}
.ui-at-drp__day:hover:not([aria-disabled]):not([data-end]) { background: var(--drp-panel); border-color: var(--drp-firm); }
.ui-at-drp__day[aria-disabled] { color: var(--drp-faint); cursor: default; }
.ui-at-drp__day[data-cmp-end] { border-color: var(--drp-firm); background: var(--drp-panel); }
.ui-at-drp__day[data-end] {
  background: var(--drp-info-ink);
  border-color: var(--drp-info-ink);
  color: var(--drp-end-ink);
  font-weight: 700;
  box-shadow: var(--drp-drop);
}
.ui-at-drp__day[data-today]::after {
  content: "";
  position: absolute;
  bottom: 3px;
  left: 50%;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 999px;
  background: var(--drp-berry);
}
.ui-at-drp__day[data-today][data-end]::after { background: currentColor; }

.ui-at-drp__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 8px 4px 10px;
}
.ui-at-drp__summary { display: grid; gap: 8px; min-width: 0; }
.ui-at-drp__sum-line { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; margin: 0; }
.ui-at-drp__sum-line strong { font-weight: 600; }
.ui-at-drp__muted { color: var(--drp-muted); font-size: 12.5px; }
.ui-at-drp__cmp-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; }
.ui-at-drp__seg {
  display: inline-flex;
  padding: 3px;
  gap: 2px;
  background: var(--drp-panel);
  border: 1px solid var(--drp-line);
  border-radius: 10px;
  box-shadow: var(--drp-drop);
}
.ui-at-drp__seg-opt {
  padding: 4px 9px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--drp-muted);
  font-size: 12.5px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--drp-ease), color 150ms var(--drp-ease);
}
.ui-at-drp__seg-opt:hover { color: var(--drp-ink); }
.ui-at-drp__seg-opt[aria-checked="true"] {
  background: var(--drp-info-fill);
  border-color: var(--drp-info-line);
  color: var(--drp-info-ink);
  font-weight: 600;
}
.ui-at-drp__cmp-line { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 12.5px; color: var(--drp-muted); }
.ui-at-drp__swatch { width: 16px; height: 8px; border-radius: 4px; background: var(--drp-soft); border: 1px solid var(--drp-firm); }
.ui-at-drp__cmp-line[data-off] .ui-at-drp__swatch { opacity: 0.4; }
.ui-at-drp__actions { display: flex; gap: 8px; flex: none; }
.ui-at-drp__btn {
  height: 38px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms var(--drp-ease), transform 150ms var(--drp-ease);
}
.ui-at-drp__btn--ghost { background: transparent; color: var(--drp-text); }
.ui-at-drp__btn--ghost:hover { background: var(--drp-soft); color: var(--drp-ink); }
.ui-at-drp__btn--main { background: var(--drp-berry); color: #ffffff; box-shadow: var(--drp-main-shadow); }
.ui-at-drp__btn--main:hover { background: var(--drp-berry-hover); }
.ui-at-drp__btn--main:active { transform: translateY(1px); }

.ui-at-drp__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

/* Phones: presets become chips, one month, stacked footer. */
.ui-at-drp[data-narrow] .ui-at-drp__sheet { grid-template-columns: 1fr; }
.ui-at-drp[data-narrow] .ui-at-drp__presets {
  flex-direction: row;
  gap: 6px;
  padding: 8px;
  overflow-x: auto;
  border-right: 0;
  border-bottom: 1px solid var(--drp-line);
  scrollbar-width: none;
}
.ui-at-drp[data-narrow] .ui-at-drp__preset { width: auto; flex: none; border-color: var(--drp-line); border-radius: 999px; padding: 6px 12px; }
.ui-at-drp[data-narrow] .ui-at-drp__preset::before { display: none; }
.ui-at-drp[data-narrow] .ui-at-drp__preset--custom:not([data-on]) { display: none; }
.ui-at-drp[data-narrow] .ui-at-drp__months { padding: 8px 10px 12px; }
.ui-at-drp[data-narrow] .ui-at-drp__foot { flex-direction: column; align-items: stretch; }
.ui-at-drp[data-narrow] .ui-at-drp__actions { justify-content: flex-end; }
.ui-at-drp[data-narrow] .ui-at-drp__panel { left: 0; }

@media (pointer: coarse) {
  .ui-at-drp__cell { height: 42px; }
  .ui-at-drp__day { height: 40px; max-width: 44px; font-size: 15px; }
  .ui-at-drp__btn { height: 44px; }
  .ui-at-drp__nav { width: 36px; height: 36px; }
}

@keyframes ui-at-drp-open { from { opacity: 0; transform: translateY(-4px) scale(0.97); } }
@keyframes ui-at-drp-in { from { opacity: 0.4; } }
@keyframes ui-at-drp-from-right { from { opacity: 0; transform: translateX(18px); } }
@keyframes ui-at-drp-from-left { from { opacity: 0; transform: translateX(-18px); } }

@media (prefers-reduced-motion: reduce) {
  .ui-at-drp *, .ui-at-drp *::before, .ui-at-drp *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
}
`;
