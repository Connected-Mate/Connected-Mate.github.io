var e=`"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent as ReactClipboardEvent,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type StepErrors = Record<string, string | undefined>;

export type StepContext<V> = {
  values: V;
  setValues: (patch: Partial<V>) => void;
  errors: StepErrors;
  goTo: (step: string | number) => void;
  next: () => void;
};

export type Step<V> = {
  id: string;
  title: string;
  heading?: string;
  description?: string;
  render: (ctx: StepContext<V>) => ReactNode;
  validate?: (values: V) => StepErrors;
};

export type StepperFormProps<V> = {
  steps: Step<V>[];
  initialValues: V;
  onComplete?: (values: V) => void | Promise<void>;
  initialStep?: number;
  step?: number;
  onStepChange?: (step: number) => void;
  submitLabel?: string;
  submittingLabel?: string;
  success?: (values: V, reset: () => void) => ReactNode;
  className?: string;
};

type FormCtx = { errors: StepErrors; shake: number; next: () => void };
const FormContext = createContext<FormCtx>({ errors: {}, shake: 0, next: () => {} });
type FieldCtx = { id: string; describedBy?: string; invalid: boolean; name: string };
const FieldContext = createContext<FieldCtx | null>(null);

const clean = (e: StepErrors) =>
  Object.fromEntries(Object.entries(e).filter(([, v]) => !!v)) as Record<string, string>;

/* ------------------------------------------------------------------------------------------------
 * StepperForm
 * ----------------------------------------------------------------------------------------------*/

export function StepperForm<V extends Record<string, unknown>>({
  steps,
  initialValues,
  onComplete,
  initialStep = 0,
  step: stepProp,
  onStepChange,
  submitLabel = "Finish",
  submittingLabel = "Creating…",
  success,
  className,
}: StepperFormProps<V>) {
  const uid = useId();
  const [values, setAll] = useState<V>(initialValues);
  const [innerStep, setInnerStep] = useState(Math.max(0, Math.min(initialStep, steps.length - 1)));
  const index = Math.max(0, Math.min(stepProp ?? innerStep, steps.length - 1));
  const [errors, setErrors] = useState<StepErrors>({});
  const [shake, setShake] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [height, setHeight] = useState<number | undefined>(undefined);

  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const focusInvalid = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const current = steps[index];
  const liveErrors = clean(current?.validate?.(values) ?? {});
  const stepInvalid = Object.keys(liveErrors).length > 0;

  const setStep = useCallback(
    (n: number) => {
      const next = Math.max(0, Math.min(n, steps.length - 1));
      if (stepProp === undefined) setInnerStep(next);
      onStepChange?.(next);
      moved.current = true;
      setErrors({});
      setSubmitError(null);
      setAnnounce(\`Step \${next + 1} of \${steps.length}: \${steps[next].title}\`);
    },
    [steps, stepProp, onStepChange],
  );

  const setValues = useCallback((patch: Partial<V>) => {
    setAll((v) => ({ ...v, ...patch }));
    setErrors((e) => {
      const keys = Object.keys(patch);
      if (!keys.some((k) => e[k])) return e;
      const copy = { ...e };
      for (const k of keys) delete copy[k];
      return copy;
    });
  }, []);

  const goTo = useCallback(
    (target: string | number) => {
      const n = typeof target === "number" ? target : steps.findIndex((s) => s.id === target);
      if (n < 0 || n === index) return;
      setDir(n > index ? 1 : -1);
      setStep(n);
    },
    [steps, index, setStep],
  );

  const next = useCallback(async () => {
    if (submitting || done) return;
    const found = clean(current.validate?.(values) ?? {});
    if (Object.keys(found).length) {
      setErrors(found);
      setShake((s) => s + 1);
      focusInvalid.current = true;
      setAnnounce(Object.values(found).join(". "));
      return;
    }
    if (index < steps.length - 1) {
      setDir(1);
      setStep(index + 1);
      return;
    }
    setSubmitError(null);
    try {
      const r = onComplete?.(values);
      if (r && typeof (r as Promise<void>).then === "function") {
        setSubmitting(true);
        await r;
      }
      if (!mounted.current) return;
      setSubmitting(false);
      setDone(true);
      moved.current = true;
      setAnnounce("All done");
    } catch (err) {
      if (!mounted.current) return;
      setSubmitting(false);
      const message = err instanceof Error && err.message ? err.message : "Something went wrong. Try again.";
      setSubmitError(message);
      setAnnounce(message);
    }
  }, [current, values, index, steps.length, onComplete, setStep, submitting, done]);

  const reset = useCallback(() => {
    setAll(initialValues);
    setDone(false);
    setDir(-1);
    setStep(0);
  }, [initialValues, setStep]);

  // Glide the card to the height of each step.
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    setHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);
  // Also measure after every render, so the height follows even where resize callbacks are throttled.
  useLayoutEffect(() => {
    const h = innerRef.current?.offsetHeight;
    if (h !== undefined && h !== height) setHeight(h);
  });

  // Focus: the new step's first field (or heading); after a failed Continue, the first invalid field.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (focusInvalid.current) {
      focusInvalid.current = false;
      body.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    if (!moved.current) return;
    moved.current = false;
    const target =
      body.querySelector<HTMLElement>(
        'input:not([disabled]):not([type="hidden"]), textarea, select, [role="radio"][tabindex="0"]',
      ) ?? body.querySelector<HTMLElement>("[data-step-heading]");
    target?.focus({ preventScroll: true });
  });

  const ctx: StepContext<V> = { values, setValues, errors, goTo, next: () => void next() };
  const isLast = index === steps.length - 1;
  const heading = current.heading ?? current.title;

  return (
    <FormContext.Provider value={{ errors, shake, next: () => void next() }}>
      <div className={["ui-step", className].filter(Boolean).join(" ")} data-done={done ? "" : undefined}>
        <style href="ui-stepper-form" precedence="default">
          {css}
        </style>
        <nav aria-label="Progress" className="ui-step__nav">
          <ol className="ui-step__list">
            {steps.map((s, i) => {
              const state = done || i < index ? "done" : i === index ? "current" : "todo";
              return (
                <li key={s.id} className="ui-step__item" data-state={state} aria-current={state === "current" ? "step" : undefined}>
                  {state === "done" && !done ? (
                    <button type="button" className="ui-step__jump" onClick={() => goTo(i)}>
                      <Check />
                      <span>{s.title}</span>
                      <span className="ui-step__sr"> (done, go back)</span>
                    </button>
                  ) : (
                    <span className="ui-step__label">
                      {state === "done" ? <Check /> : <span className="ui-step__num">{i + 1}.</span>}
                      <span>{s.title}</span>
                      {state === "done" ? <span className="ui-step__sr"> (done)</span> : null}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="ui-step__compact" aria-hidden="true">
            {done ? "All done" : \`Step \${index + 1} of \${steps.length} · \${current.title}\`}
          </p>
        </nav>

        <div className="ui-step__card" style={{ height }}>
          <div ref={innerRef} className="ui-step__inner">
            {done ? (
              <div className="ui-step__body" ref={bodyRef} key="done" data-dir="1">
                {success ? success(values, reset) : <StepperSuccess title="All done" onAction={reset} actionLabel="Start over" />}
              </div>
            ) : (
              <form
                noValidate
                className="ui-step__form"
                aria-labelledby={\`\${uid}-h\`}
                onSubmit={(e) => {
                  e.preventDefault();
                  void next();
                }}
              >
                <div className="ui-step__body" ref={bodyRef} key={current.id} data-dir={dir}>
                  <h2 id={\`\${uid}-h\`} className="ui-step__heading" tabIndex={-1} data-step-heading="">
                    {heading}
                  </h2>
                  {current.description ? <p className="ui-step__desc">{current.description}</p> : null}
                  <div className="ui-step__fields">{current.render(ctx)}</div>
                </div>
                <div className="ui-step__foot">
                  {index > 0 ? (
                    <button
                      type="button"
                      className="ui-step__btn ui-step__btn--ghost"
                      disabled={submitting}
                      onClick={() => goTo(index - 1)}
                    >
                      <svg viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M7.5 2.5L4 6l3.5 3.5" />
                      </svg>
                      Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <div className="ui-step__submit">
                    {submitError ? (
                      <span className="ui-step__submit-error" role="alert">
                        {submitError}
                      </span>
                    ) : null}
                    <button
                      type="submit"
                      className="ui-step__btn ui-step__btn--main"
                      data-dim={stepInvalid ? "" : undefined}
                      aria-busy={submitting || undefined}
                    >
                      {submitting ? <span className="ui-step__spin" aria-hidden="true" /> : null}
                      <span key={submitting ? "s" : isLast ? "l" : "c"} className="ui-step__btn-label">
                        {submitting ? submittingLabel : isLast ? submitLabel : "Continue"}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        <span className="ui-step__sr" aria-live="polite">
          {announce}
        </span>
      </div>
    </FormContext.Provider>
  );
}

function Check() {
  return (
    <svg className="ui-step__check" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.6 6.4l2.2 2.2 4.6-5" pathLength={1} />
    </svg>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Field parts
 * ----------------------------------------------------------------------------------------------*/

export function StepperField({
  name,
  label,
  hint,
  optional,
  children,
}: {
  name: string;
  label: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  const uid = useId();
  const { errors, shake } = useContext(FormContext);
  const error = errors[name];
  const ids = { control: \`\${uid}-c\`, hint: \`\${uid}-hint\`, error: \`\${uid}-err\` };
  const describedBy = [error ? ids.error : null, hint ? ids.hint : null].filter(Boolean).join(" ") || undefined;
  return (
    <FieldContext.Provider value={{ id: ids.control, describedBy, invalid: !!error, name }}>
      <div className="ui-step__field" data-invalid={error ? "" : undefined}>
        <label className="ui-step__field-label" htmlFor={ids.control}>
          {label}
          {optional ? <span className="ui-step__optional">Optional</span> : null}
        </label>
        <div className="ui-step__control" key={error ? \`e\${shake}\` : "ok"} data-shake={error ? "" : undefined}>
          {children}
        </div>
        {error ? (
          <p id={ids.error} className="ui-step__error">
            {error}
          </p>
        ) : null}
        {hint ? (
          <p id={ids.hint} className="ui-step__hint">
            {hint}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

export function StepperInput({ prefix, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { prefix?: string }) {
  const field = useContext(FieldContext);
  return (
    <span className={["ui-step__input-wrap", className].filter(Boolean).join(" ")}>
      {prefix ? (
        <span className="ui-step__prefix" aria-hidden="true">
          {prefix}
        </span>
      ) : null}
      <input
        id={field?.id}
        name={field?.name}
        aria-invalid={field?.invalid || undefined}
        aria-describedby={field?.describedBy}
        className="ui-step__input"
        {...rest}
      />
    </span>
  );
}

const EMAIL = /^[^\\s@,;]+@[^\\s@,;]+\\.[^\\s@,;]{2,}$/;

export function StepperTags({
  value,
  onChange,
  validate = (t) => (EMAIL.test(t) ? undefined : \`“\${t}” isn't an email address\`),
  max,
  placeholder = "name@company.com",
}: {
  value: string[];
  onChange: (value: string[]) => void;
  validate?: (entry: string) => string | undefined;
  max?: number;
  placeholder?: string;
}) {
  const field = useContext(FieldContext);
  const { next } = useContext(FormContext);
  const [text, setText] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [armed, setArmed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addMany = (raw: string[]) => {
    const list = [...value];
    const problems: string[] = [];
    for (const r of raw.map((s) => s.trim()).filter(Boolean)) {
      if (list.some((v) => v.toLowerCase() === r.toLowerCase())) continue;
      if (max !== undefined && list.length >= max) {
        problems.push(\`Up to \${max} entries\`);
        break;
      }
      const bad = validate(r);
      if (bad) problems.push(bad);
      else list.push(r);
    }
    if (list.length !== value.length) onChange(list);
    setNote(problems[0] ?? null);
    return problems.length === 0;
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") setArmed(false);
    if (e.key === "Enter") {
      e.preventDefault();
      if (text.trim()) {
        if (addMany([text])) setText("");
      } else next();
    } else if (e.key === "," || e.key === ";") {
      e.preventDefault();
      if (text.trim() && addMany([text])) setText("");
    } else if (e.key === "Backspace" && !text && value.length) {
      e.preventDefault();
      if (armed) {
        onChange(value.slice(0, -1));
        setArmed(false);
      } else setArmed(true);
    }
  };

  const noteId = field ? \`\${field.id}-note\` : undefined;
  const describedBy = [field?.describedBy, note ? noteId : null].filter(Boolean).join(" ") || undefined;

  return (
    <>
      <div
        className="ui-step__tags"
        data-invalid={field?.invalid ? "" : undefined}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button, input")) return;
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        {value.map((v, i) => (
          <span key={v} className="ui-step__tag" data-armed={armed && i === value.length - 1 ? "" : undefined}>
            <span className="ui-step__tag-text">{v}</span>
            <button
              type="button"
              className="ui-step__tag-x"
              aria-label={\`Remove \${v}\`}
              onClick={() => {
                onChange(value.filter((x) => x !== v));
                inputRef.current?.focus();
              }}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M3 3l6 6M9 3l-6 6" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={field?.id}
          name={field?.name}
          className="ui-step__tags-input"
          type="text"
          inputMode="email"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={field?.invalid || !!note || undefined}
          aria-describedby={describedBy}
          placeholder={value.length ? "" : placeholder}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setNote(null);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => {
            setArmed(false);
            if (text.trim() && addMany([text])) setText("");
          }}
          onPaste={(e: ReactClipboardEvent<HTMLInputElement>) => {
            const pasted = e.clipboardData.getData("text");
            if (!/[\\s,;]/.test(pasted.trim())) return;
            e.preventDefault();
            addMany(pasted.split(/[\\s,;]+/));
          }}
        />
      </div>
      {note ? (
        <p id={noteId} className="ui-step__error" role="status">
          {note}
        </p>
      ) : null}
    </>
  );
}

export type StepperChoice = {
  value: string;
  title: string;
  aside?: string;
  description?: string;
  badge?: string;
};

export function StepperChoices({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: StepperChoice[];
  label: string;
}) {
  const { next } = useContext(FormContext);
  const groupRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const selected = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  const place = useCallback(() => {
    const group = groupRef.current;
    const ring = ringRef.current;
    const card = group?.querySelectorAll<HTMLElement>("[role=radio]")[selected];
    if (!group || !ring || !card) return;
    ring.style.transform = \`translate(\${card.offsetLeft}px, \${card.offsetTop}px)\`;
    ring.style.width = \`\${card.offsetWidth}px\`;
    ring.style.height = \`\${card.offsetHeight}px\`;
    ring.style.opacity = options.some((o) => o.value === value) ? "1" : "0";
  }, [selected, options, value]);

  useLayoutEffect(() => {
    place();
    const group = groupRef.current;
    if (!group || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(place);
    ro.observe(group);
    return () => ro.disconnect();
  }, [place]);

  const move = (i: number) => {
    const n = (i + options.length) % options.length;
    onChange(options[n].value);
    groupRef.current?.querySelectorAll<HTMLElement>("[role=radio]")[n]?.focus();
  };

  return (
    <div ref={groupRef} className="ui-step__choices" role="radiogroup" aria-label={label}>
      <span ref={ringRef} className="ui-step__ring" aria-hidden="true" />
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <div
            key={o.value}
            role="radio"
            aria-checked={on}
            tabIndex={i === selected ? 0 : -1}
            className="ui-step__choice"
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                move(i + 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                move(i - 1);
              } else if (e.key === " ") {
                e.preventDefault();
                onChange(o.value);
              } else if (e.key === "Enter") {
                e.preventDefault();
                onChange(o.value);
                next();
              }
            }}
          >
            <span className="ui-step__choice-head">
              <span className="ui-step__choice-title">{o.title}</span>
              {o.badge ? <span className="ui-step__badge">{o.badge}</span> : null}
              <span className="ui-step__radio" aria-hidden="true" />
            </span>
            {o.aside ? <span className="ui-step__choice-aside">{o.aside}</span> : null}
            {o.description ? <span className="ui-step__choice-desc">{o.description}</span> : null}
          </div>
        );
      })}
    </div>
  );
}

export function StepperReview({
  rows,
  onEdit,
}: {
  rows: { label: string; value: ReactNode; detail?: ReactNode; step?: string }[];
  onEdit?: (step: string) => void;
}) {
  return (
    <dl className="ui-step__review">
      {rows.map((r) => (
        <div key={r.label} className="ui-step__review-row">
          <dt>{r.label}</dt>
          <dd>
            <span className="ui-step__review-value">{r.value}</span>
            {r.detail ? <span className="ui-step__review-detail">{r.detail}</span> : null}
          </dd>
          {r.step && onEdit ? (
            <button type="button" className="ui-step__edit" onClick={() => onEdit(r.step!)}>
              Edit<span className="ui-step__sr"> {r.label}</span>
            </button>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export function StepperSuccess({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="ui-step__success">
      <span className="ui-step__success-check" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      </span>
      <h2 className="ui-step__heading" tabIndex={-1} data-step-heading="">
        {title}
      </h2>
      {description ? <p className="ui-step__desc">{description}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" className="ui-step__btn ui-step__btn--secondary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ \`
.ui-step {
  --step-frame: #f2f6fa;
  --step-panel: #ffffff;
  --step-pale: #fbfcfe;
  --step-soft: rgba(26, 62, 112, 0.06);
  --step-line: #dae2ec;
  --step-firm: #cbd6e4;
  --step-ink: #00162b;
  --step-text: rgba(0, 22, 43, 0.66);
  --step-muted: rgba(0, 22, 43, 0.54);
  --step-berry: #851437;
  --step-berry-hover: #6d0f2d;
  --step-info-ink: #1a3e70;
  --step-info-fill: #eef5ff;
  --step-info-line: #c1daff;
  --step-ring: #8fbdf2;
  --step-success-ink: #1d6a34;
  --step-success-fill: #eafbee;
  --step-success-line: #c9f5cf;
  --step-danger-ink: #8a3a22;
  --step-danger-fill: #fdeee8;
  --step-danger-line: #f5d5c9;
  --step-field-shade: inset 0 1px 2px rgba(26, 62, 112, 0.07);
  --step-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --step-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --step-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --step-main-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  --step-ease: cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  max-width: 520px;
  padding: 6px;
  background: var(--step-frame);
  border: 1px solid var(--step-line);
  border-radius: 22px;
  box-shadow: var(--step-raised);
  container-type: inline-size;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: var(--step-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-step {
  --step-frame: #0f2747;
  --step-panel: #16345c;
  --step-pale: #1a3b66;
  --step-soft: rgba(255, 255, 255, 0.07);
  --step-line: rgba(255, 255, 255, 0.12);
  --step-firm: rgba(255, 255, 255, 0.18);
  --step-ink: rgba(255, 255, 255, 0.94);
  --step-text: rgba(255, 255, 255, 0.72);
  --step-muted: rgba(255, 255, 255, 0.56);
  --step-berry: #a8204d;
  --step-berry-hover: #bd2a5a;
  --step-info-ink: #c1daff;
  --step-info-fill: rgba(143, 189, 242, 0.16);
  --step-info-line: rgba(143, 189, 242, 0.34);
  --step-ring: rgba(143, 189, 242, 0.6);
  --step-success-ink: #7fe0a0;
  --step-success-fill: rgba(127, 224, 160, 0.14);
  --step-success-line: rgba(127, 224, 160, 0.3);
  --step-danger-ink: #f2a48c;
  --step-danger-fill: rgba(242, 164, 140, 0.14);
  --step-danger-line: rgba(242, 164, 140, 0.3);
  --step-field-shade: inset 0 1px 2px rgba(3, 12, 28, 0.35);
  --step-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --step-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --step-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --step-main-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 6px 12px -6px rgba(3, 12, 28, 0.7);
}
.ui-step *, .ui-step *::before, .ui-step *::after { box-sizing: border-box; }
:where(.ui-step) button { font: inherit; }
.ui-step :focus-visible { outline: 2px solid var(--step-ring); outline-offset: 2px; }
.ui-step .ui-step__heading:focus-visible { outline: none; }
.ui-step .ui-step__card { box-sizing: content-box; }

.ui-step__nav { padding: 4px 8px 8px; }
.ui-step__list { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; margin: 0; padding: 0; list-style: none; }
.ui-step__item { display: flex; justify-content: center; min-width: 0; font-size: 13px; color: var(--step-muted); }
.ui-step__label, .ui-step__jump { display: inline-flex; align-items: center; gap: 5px; min-width: 0; padding: 4px 6px; white-space: nowrap; }
.ui-step__label > span:not(.ui-step__sr):last-of-type, .ui-step__jump > span:not(.ui-step__sr) { overflow: hidden; text-overflow: ellipsis; }
.ui-step__jump { border: 0; border-radius: 8px; background: transparent; color: var(--step-text); cursor: pointer; transition: background-color 150ms var(--step-ease), color 150ms var(--step-ease); }
.ui-step__jump:hover { background: var(--step-soft); color: var(--step-ink); }
.ui-step__item[data-state="current"] { color: var(--step-ink); font-weight: 600; }
.ui-step__item[data-state="done"] { color: var(--step-text); }
.ui-step__num { font-variant-numeric: tabular-nums; }
.ui-step__check { width: 12px; height: 12px; flex: none; fill: none; stroke: var(--step-berry); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
:where(.dark, [data-theme="dark"]) .ui-step__check { stroke: var(--step-success-ink); }
.ui-step__check path { stroke-dasharray: 1; stroke-dashoffset: 0; animation: ui-step-draw 300ms var(--step-ease) both; }
.ui-step__compact { display: none; margin: 0; padding: 4px 6px; font-size: 13px; font-weight: 600; color: var(--step-ink); }

.ui-step__card {
  overflow: hidden;
  background: var(--step-panel);
  border: 1px solid var(--step-line);
  border-radius: 16px;
  box-shadow: var(--step-drop);
  transition: height 300ms var(--step-ease);
}
.ui-step__inner { padding: 22px 20px 16px; }
.ui-step__form { margin: 0; }
.ui-step__body { animation: ui-step-in 300ms var(--step-ease); }
.ui-step__body[data-dir="-1"] { animation-name: ui-step-in-back; }
.ui-step__heading {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.2;
  color: var(--step-ink);
  outline: none;
}
.ui-step__desc { margin: 4px 0 0; color: var(--step-muted); }
.ui-step__fields { display: grid; gap: 16px; margin-top: 18px; }

.ui-step__field { display: grid; gap: 6px; min-width: 0; }
.ui-step__field-label { display: flex; align-items: baseline; gap: 8px; font-size: 13.5px; font-weight: 600; color: var(--step-ink); }
.ui-step__optional { font-size: 10.5px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: var(--step-muted); }
.ui-step__control[data-shake] { animation: ui-step-shake 360ms var(--step-ease); }
.ui-step__hint { margin: 0; font-size: 12.5px; color: var(--step-muted); }
.ui-step__error { margin: 0; font-size: 12.5px; color: var(--step-danger-ink); animation: ui-step-fold 300ms var(--step-ease); }

.ui-step__input-wrap, .ui-step__tags {
  display: flex;
  align-items: center;
  min-height: 42px;
  width: 100%;
  background: var(--step-panel);
  border: 1px solid var(--step-firm);
  border-radius: 10px;
  box-shadow: var(--step-field-shade);
  transition: border-color 150ms var(--step-ease), box-shadow 150ms var(--step-ease);
}
.ui-step__input-wrap:focus-within, .ui-step__tags:focus-within {
  border-color: var(--step-info-line);
  box-shadow: var(--step-field-shade), 0 0 0 3px color-mix(in srgb, var(--step-ring) 45%, transparent);
}
.ui-step__input-wrap:has([aria-invalid="true"]), .ui-step__tags[data-invalid] { border-color: var(--step-danger-ink); }
.ui-step__prefix { padding-left: 12px; color: var(--step-muted); white-space: nowrap; }
.ui-step__input, .ui-step__tags-input {
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 12px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--step-ink);
  caret-color: var(--step-berry);
  font: inherit;
  font-size: 14.5px;
}
.ui-step__prefix + .ui-step__input { padding-left: 1px; }
.ui-step__input::placeholder, .ui-step__tags-input::placeholder { color: var(--step-muted); }
.ui-step__input:focus-visible, .ui-step__tags-input:focus-visible { outline: none; }

.ui-step__tags { flex-wrap: wrap; gap: 5px; padding: 5px; cursor: text; }
.ui-step__tags-input { height: 30px; padding: 0 6px; flex-basis: 140px; }
.ui-step__tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  max-width: 100%;
  height: 28px;
  padding: 0 3px 0 9px;
  background: var(--step-info-fill);
  border: 1px solid var(--step-info-line);
  border-radius: 8px;
  font-size: 13px;
  animation: ui-step-pop 220ms var(--step-ease);
}
.ui-step__tag[data-armed] { background: var(--step-danger-fill); border-color: var(--step-danger-line); color: var(--step-danger-ink); }
.ui-step__tag-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-step__tag-x { display: grid; place-items: center; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--step-muted); cursor: pointer; }
.ui-step__tag-x:hover { background: var(--step-soft); color: var(--step-ink); }
.ui-step__tag-x svg { width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }

.ui-step__choices { position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; }
.ui-step__ring {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  border: 2px solid var(--step-berry);
  border-radius: 12px;
  pointer-events: none;
  transition: transform 300ms var(--step-ease), width 300ms var(--step-ease), height 300ms var(--step-ease), opacity 150ms;
}
.ui-step__choice {
  display: grid;
  align-content: start;
  gap: 2px;
  padding: 12px;
  background: var(--step-pale);
  border: 1px solid var(--step-line);
  border-radius: 12px;
  box-shadow: var(--step-drop);
  cursor: pointer;
  transition: background-color 150ms var(--step-ease), border-color 150ms var(--step-ease);
}
.ui-step__choice:hover { border-color: var(--step-firm); }
.ui-step__choice[aria-checked="true"] { background: var(--step-info-fill); border-color: var(--step-info-line); }
.ui-step__choice:focus-visible { outline-offset: 3px; }
.ui-step__choice-head { display: flex; align-items: center; gap: 6px; }
.ui-step__choice-title { font-weight: 700; }
.ui-step__badge { padding: 1px 6px; border-radius: 6px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em; color: var(--step-info-ink); background: var(--step-panel); border: 1px solid var(--step-info-line); }
.ui-step__radio { width: 16px; height: 16px; margin-left: auto; flex: none; border-radius: 999px; border: 1.5px solid var(--step-firm); background: var(--step-panel); transition: border-color 150ms var(--step-ease), box-shadow 150ms var(--step-ease); }
.ui-step__choice[aria-checked="true"] .ui-step__radio { border-color: var(--step-berry); box-shadow: inset 0 0 0 3px var(--step-panel), inset 0 0 0 8px var(--step-berry); }
.ui-step__choice-aside { color: var(--step-text); font-variant-numeric: tabular-nums; }
.ui-step__choice-desc { margin-top: 4px; color: var(--step-muted); font-size: 12.5px; }

.ui-step__review { margin: 0; border: 1px solid var(--step-line); border-radius: 12px; overflow: hidden; }
.ui-step__review-row { display: grid; grid-template-columns: 110px 1fr auto; gap: 12px; align-items: start; padding: 12px 14px; }
.ui-step__review-row + .ui-step__review-row { border-top: 1px solid var(--step-line); }
.ui-step__review dt { color: var(--step-muted); font-size: 13px; padding-top: 1px; }
.ui-step__review dd { display: grid; min-width: 0; margin: 0; }
.ui-step__review-value { font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
.ui-step__review-detail { color: var(--step-muted); font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-step__edit { padding: 2px 6px; border: 0; border-radius: 6px; background: transparent; color: var(--step-info-ink); font-weight: 600; font-size: 13px; cursor: pointer; }
.ui-step__edit:hover { background: var(--step-info-fill); }

.ui-step__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 24px; }
.ui-step__submit { display: flex; align-items: center; gap: 12px; min-width: 0; }
.ui-step__submit-error { color: var(--step-danger-ink); font-size: 12.5px; text-align: right; }
.ui-step__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--step-ease), opacity 150ms var(--step-ease), transform 150ms var(--step-ease);
}
.ui-step__btn svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.ui-step__btn--ghost { padding: 0 10px; background: transparent; color: var(--step-text); }
.ui-step__btn--ghost:hover:not(:disabled) { background: var(--step-soft); color: var(--step-ink); }
.ui-step__btn--ghost:disabled { opacity: 0.5; cursor: default; }
.ui-step__btn--main { background: var(--step-berry); color: #ffffff; box-shadow: var(--step-main-shadow); }
.ui-step__btn--main:hover { background: var(--step-berry-hover); }
.ui-step__btn--main:active { transform: translateY(1px); }
.ui-step__btn--main[data-dim] { opacity: 0.62; }
.ui-step__btn--main[aria-busy] { cursor: progress; }
.ui-step__btn--secondary { background: var(--step-pale); border-color: var(--step-firm); color: var(--step-ink); box-shadow: var(--step-drop); }
.ui-step__btn--secondary:hover { border-color: var(--step-info-line); }
.ui-step__btn-label { animation: ui-step-label 300ms var(--step-ease); }
.ui-step__spin { width: 14px; height: 14px; border-radius: 999px; border: 2px solid rgba(255, 255, 255, 0.35); border-top-color: #ffffff; animation: ui-step-spin 800ms linear infinite; }

.ui-step__success { display: grid; justify-items: center; gap: 4px; padding: 18px 0 8px; text-align: center; }
.ui-step__success-check {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: var(--step-success-fill);
  border: 1px solid var(--step-success-line);
  color: var(--step-success-ink);
  box-shadow: var(--step-pebble), var(--step-drop);
  animation: ui-step-pop-big 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ui-step__success-check svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ui-step__success .ui-step__btn { margin-top: 14px; }

.ui-step__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

@container (max-width: 420px) {
  .ui-step__list { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .ui-step__compact { display: block; }
  .ui-step__inner { padding: 18px 14px 14px; }
  .ui-step__choices { grid-template-columns: 1fr; }
  .ui-step__review-row { grid-template-columns: 1fr auto; }
  .ui-step__review dt { grid-column: 1 / -1; }
  .ui-step__review dd { grid-column: 1; }
}
@media (pointer: coarse) {
  .ui-step__input, .ui-step__tags-input { font-size: 16px; }
  .ui-step__btn { min-height: 44px; }
  .ui-step__tag-x { width: 30px; height: 30px; }
}

@keyframes ui-step-in { from { opacity: 0; transform: translateX(24px); } }
@keyframes ui-step-in-back { from { opacity: 0; transform: translateX(-24px); } }
@keyframes ui-step-shake { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
@keyframes ui-step-fold { from { opacity: 0; transform: translateY(-4px); } }
@keyframes ui-step-pop { from { opacity: 0; transform: scale(0.85); } }
@keyframes ui-step-pop-big { from { opacity: 0; transform: scale(0.4); } }
@keyframes ui-step-draw { from { stroke-dashoffset: 1; } }
@keyframes ui-step-label { from { opacity: 0; } }
@keyframes ui-step-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .ui-step *, .ui-step *::before, .ui-step *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
  .ui-step__spin { animation: ui-step-spin 1600ms linear infinite !important; }
  .ui-step__card { transition: none !important; }
}
\`;
`;export{e as default};
