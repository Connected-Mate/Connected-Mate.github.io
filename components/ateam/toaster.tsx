"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type ToastId = string | number;
export type ToastType = "default" | "success" | "error" | "info" | "loading";
export type ToasterPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastAction = {
  label: string;
  onClick: (event: ReactMouseEvent<HTMLButtonElement>) => void;
};

export type ToastOptions = {
  id?: ToastId;
  description?: ReactNode;
  action?: ToastAction;
  duration?: number;
  icon?: ReactNode;
  toaster?: string;
  onDismiss?: (id: ToastId) => void;
};

export type ToastMessage = ReactNode | { title: ReactNode; description?: ReactNode };

export type ToastPromiseMessages<T> = {
  loading: ToastMessage;
  success: ToastMessage | ((result: T) => ToastMessage);
  error: ToastMessage | ((error: unknown) => ToastMessage);
};

export type ToasterProps = {
  position?: ToasterPosition;
  inline?: boolean;
  id?: string;
  duration?: number;
  visibleToasts?: number;
  expand?: boolean;
  offset?: number;
  gap?: number;
  hotkey?: string | null;
  hairline?: boolean;
  closeButton?: boolean;
  label?: string;
  className?: string;
};

type ToastRecord = {
  id: ToastId;
  type: ToastType;
  title: ReactNode;
  description?: ReactNode;
  action?: ToastAction;
  duration?: number;
  icon?: ReactNode;
  toaster?: string;
  onDismiss?: (id: ToastId) => void;
  /** Bumped on every update: restarts the timer and crossfades the text. */
  version: number;
  closing: boolean;
};

/* ------------------------------------------------------------------------------------------------
 * Store – module level, so toast() works from anywhere without a hook or context
 * ----------------------------------------------------------------------------------------------*/

const EXIT_MS = 220;
let records: ToastRecord[] = [];
let counter = 0;
const listeners = new Set<() => void>();

function emit() {
  records = records.slice();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => records;
const EMPTY: ToastRecord[] = [];
const getServerSnapshot = () => EMPTY;

function upsert(type: ToastType, title: ReactNode, options: ToastOptions = {}): ToastId {
  const id = options.id ?? `t${++counter}`;
  const index = records.findIndex((item) => item.id === id);
  if (index >= 0) {
    const previous = records[index];
    records[index] = {
      ...previous,
      ...options,
      id,
      type,
      title,
      description: "description" in options ? options.description : previous.description,
      version: previous.version + 1,
      closing: false,
    };
  } else {
    records.push({ ...options, id, type, title, version: 0, closing: false });
  }
  emit();
  return id;
}

function dismiss(id?: ToastId) {
  const targets = records.filter((item) => !item.closing && (id === undefined || item.id === id));
  if (!targets.length) return;
  const closingIds = new Set(targets.map((item) => item.id));
  records = records.map((item) => (closingIds.has(item.id) ? { ...item, closing: true } : item));
  emit();
  for (const item of targets) item.onDismiss?.(item.id);
  setTimeout(() => {
    const ids = new Set(targets.map((item) => item.id));
    const before = records.length;
    records = records.filter((item) => !(ids.has(item.id) && item.closing));
    if (records.length !== before) emit();
  }, EXIT_MS);
}

function splitMessage(message: ToastMessage): { title: ReactNode; description?: ReactNode } {
  if (message && typeof message === "object" && "title" in (message as object)) {
    return message as { title: ReactNode; description?: ReactNode };
  }
  return { title: message as ReactNode };
}

type ToastFn = {
  (title: ReactNode, options?: ToastOptions): ToastId;
  success: (title: ReactNode, options?: ToastOptions) => ToastId;
  error: (title: ReactNode, options?: ToastOptions) => ToastId;
  info: (title: ReactNode, options?: ToastOptions) => ToastId;
  loading: (title: ReactNode, options?: ToastOptions) => ToastId;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: ToastPromiseMessages<T>,
    options?: ToastOptions,
  ) => Promise<T>;
  dismiss: (id?: ToastId) => void;
};

export const toast: ToastFn = Object.assign(
  (title: ReactNode, options?: ToastOptions) => upsert("default", title, options),
  {
    success: (title: ReactNode, options?: ToastOptions) => upsert("success", title, options),
    error: (title: ReactNode, options?: ToastOptions) => upsert("error", title, options),
    info: (title: ReactNode, options?: ToastOptions) => upsert("info", title, options),
    loading: (title: ReactNode, options?: ToastOptions) => upsert("loading", title, options),
    promise<T>(
      promise: Promise<T> | (() => Promise<T>),
      messages: ToastPromiseMessages<T>,
      options: ToastOptions = {},
    ): Promise<T> {
      const loading = splitMessage(messages.loading);
      const id = upsert("loading", loading.title, { ...options, description: loading.description });
      let running: Promise<T>;
      try {
        running = typeof promise === "function" ? promise() : promise;
      } catch (error) {
        running = Promise.reject(error);
      }
      running.then(
        (result) => {
          const message = typeof messages.success === "function"
            ? (messages.success as (r: T) => ToastMessage)(result)
            : messages.success;
          const next = splitMessage(message);
          upsert("success", next.title, { ...options, id, description: next.description });
        },
        (error) => {
          const message = typeof messages.error === "function"
            ? (messages.error as (e: unknown) => ToastMessage)(error)
            : messages.error;
          const next = splitMessage(message);
          upsert("error", next.title, { ...options, id, description: next.description });
        },
      );
      return running;
    },
    dismiss,
  },
);

/* ------------------------------------------------------------------------------------------------
 * Small hooks
 * ----------------------------------------------------------------------------------------------*/

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useDocumentHidden() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const update = () => setHidden(document.visibilityState === "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return hidden;
}

function sentence(title: ReactNode, description: ReactNode): string {
  const head = textOf(title).trim();
  const tail = textOf(description).trim();
  if (!head || !tail) return head || tail;
  return /[.…!?:]$/.test(head) ? `${head} ${tail}` : `${head}. ${tail}`;
}

function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/* ------------------------------------------------------------------------------------------------
 * Toaster
 * ----------------------------------------------------------------------------------------------*/

export function Toaster({
  position = "bottom-right",
  inline = false,
  id,
  duration = 4000,
  visibleToasts = 3,
  expand = false,
  offset,
  gap = 10,
  hotkey = "F8",
  hairline = true,
  closeButton = true,
  label = "Notifications",
  className,
}: ToasterProps) {
  const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mine = useMemo(
    () => all.filter((item) => (id ? item.toaster === id : !item.toaster)),
    [all, id],
  );
  // Newest first. Only the newest `visibleToasts` are shown; the rest wait with a paused timer.
  const ordered = useMemo(() => mine.slice().reverse(), [mine]);
  const shown = ordered.slice(0, Math.max(1, visibleToasts));

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);
  const expanded = expand || hovered || focused || tapped;
  const hidden = useDocumentHidden();
  const paused = hovered || focused || tapped || hidden;

  const regionRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [heights, setHeights] = useState<Record<string, number>>({});

  const [vertical, horizontal] = position.split("-") as ["top" | "bottom", "left" | "center" | "right"];
  const fromBottom = vertical === "bottom";

  const setHeight = useCallback((key: string, height: number) => {
    setHeights((current) => (current[key] === height ? current : { ...current, [key]: height }));
  }, []);

  // Forget heights of toasts that are gone.
  useEffect(() => {
    setHeights((current) => {
      const alive = new Set(mine.map((item) => String(item.id)));
      const next: Record<string, number> = {};
      let changed = false;
      for (const key of Object.keys(current)) {
        if (alive.has(key)) next[key] = current[key];
        else changed = true;
      }
      return changed ? next : current;
    });
  }, [mine]);

  // Collapse when the stack empties.
  useEffect(() => {
    if (!mine.length) {
      setHovered(false);
      setTapped(false);
    }
  }, [mine.length]);

  // Hotkey: move focus to the newest toast.
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== hotkey && event.code !== hotkey) return;
      const first = regionRef.current?.querySelector<HTMLElement>("[data-toast]:not([data-closing])");
      if (!first) return;
      event.preventDefault();
      if (!regionRef.current?.contains(document.activeElement)) {
        returnFocusRef.current = document.activeElement as HTMLElement | null;
      }
      first.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey]);

  // Tap outside closes a stack fanned out by touch.
  useEffect(() => {
    if (!tapped) return;
    const onDown = (event: PointerEvent) => {
      if (!regionRef.current?.contains(event.target as Node)) setTapped(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [tapped]);

  // Announcements: polite for everything, assertive for errors.
  const [politeText, setPoliteText] = useState("");
  const [alertText, setAlertText] = useState("");
  const announcedRef = useRef(new Map<ToastId, number>());
  useEffect(() => {
    for (const item of mine) {
      if (item.closing) continue;
      if (announcedRef.current.get(item.id) === item.version) continue;
      announcedRef.current.set(item.id, item.version);
      const text = sentence(item.title, item.description);
      if (item.type === "error") setAlertText(text);
      else setPoliteText(text);
    }
    const alive = new Set(mine.map((item) => item.id));
    for (const key of announcedRef.current.keys()) {
      if (!alive.has(key)) announcedRef.current.delete(key);
    }
  }, [mine]);

  const focusAfterDismiss = useCallback((dismissedId: ToastId) => {
    const nodes = Array.from(
      regionRef.current?.querySelectorAll<HTMLElement>("[data-toast]:not([data-closing])") ?? [],
    ).filter((node) => node.dataset.toast !== String(dismissedId));
    if (nodes.length) {
      nodes[0].focus();
    } else {
      const back = returnFocusRef.current;
      returnFocusRef.current = null;
      if (back && document.contains(back)) back.focus();
      else (document.activeElement as HTMLElement | null)?.blur?.();
    }
  }, []);

  // Layout: newest is index 0, at the edge; older toasts go inward.
  const frontKey = shown[0] ? String(shown[0].id) : "";
  const frontHeight = heights[frontKey] ?? 64;
  const PEEK = 10;
  let cursor = 0;
  const layout = shown.map((item, index) => {
    const key = String(item.id);
    const height = heights[key] ?? frontHeight;
    const y = expanded ? cursor : index * PEEK;
    if (expanded) cursor += height + gap;
    return { item, index, key, y, height };
  });
  const listHeight = shown.length
    ? expanded
      ? Math.max(0, cursor - gap)
      : frontHeight + (shown.length - 1) * PEEK
    : 0;

  const regionLabel = hotkey ? `${label} (${hotkey})` : label;
  const edgeOffset = offset ?? (inline ? 20 : 24);

  const style = {
    "--ui-toast-offset": `${edgeOffset}px`,
    "--ui-toast-gap": `${gap}px`,
  } as CSSProperties;

  return (
    <section
      ref={regionRef}
      className={["ui-toaster", className].filter(Boolean).join(" ")}
      aria-label={regionLabel}
      tabIndex={-1}
      data-position={position}
      data-y={vertical}
      data-x={horizontal}
      data-inline={inline ? "" : undefined}
      data-expanded={expanded ? "" : undefined}
      data-empty={shown.length ? undefined : ""}
      style={style}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovered(false);
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse" && shown.length > 1) setTapped(true);
      }}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <style href="ui-toaster" precedence="default">{css}</style>
      <ol className="ui-toaster__list" style={{ height: listHeight }}>
        {layout.map(({ item, index, key, y, height }) => (
          <ToastItem
            key={key}
            record={item}
            index={index}
            y={y}
            height={expanded || index === 0 ? height : frontHeight}
            fromBottom={fromBottom}
            expanded={expanded}
            paused={paused}
            defaultDuration={duration}
            hairline={hairline}
            closeButton={closeButton}
            onHeight={setHeight}
            onEscape={focusAfterDismiss}
          />
        ))}
      </ol>
      {/* Waiting toasts are not shown; their timers do not run. */}
      <div className="ui-toaster__sr" role="status" aria-live="polite" aria-atomic="true">
        {politeText}
      </div>
      <div className="ui-toaster__sr" role="alert" aria-atomic="true">
        {alertText}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * One toast
 * ----------------------------------------------------------------------------------------------*/

type ToastItemProps = {
  record: ToastRecord;
  index: number;
  y: number;
  height: number;
  fromBottom: boolean;
  expanded: boolean;
  paused: boolean;
  defaultDuration: number;
  hairline: boolean;
  closeButton: boolean;
  onHeight: (key: string, height: number) => void;
  onEscape: (id: ToastId) => void;
};

const SWIPE_DISTANCE = 56;

function ToastItem({
  record,
  index,
  y,
  height,
  fromBottom,
  expanded,
  paused,
  defaultDuration,
  hairline,
  closeButton,
  onHeight,
  onEscape,
}: ToastItemProps) {
  const { id, type, title, description, action, icon, closing, version } = record;
  const key = String(id);
  const innerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [swipe, setSwipe] = useState<{ x: number; y: number; dragging: boolean; out: boolean }>({
    x: 0,
    y: 0,
    dragging: false,
    out: false,
  });
  const dragRef = useRef<{ x: number; y: number; t: number; pointer: number; moved: boolean } | null>(null);

  // Entry: render once off-edge, then glide in.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Measure the natural height of the content, so the stack can glide between heights.
  useIsoLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) return;
    const measure = () => onHeight(key, Math.ceil(node.getBoundingClientRect().height));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [key, onHeight]);

  // Timer: restarts on every update; pauses while the stack is in use or the tab is hidden.
  const total = type === "loading" ? Infinity : record.duration ?? defaultDuration;
  const remainingRef = useRef(total);
  useEffect(() => {
    remainingRef.current = total;
  }, [total, version]);
  useEffect(() => {
    if (closing || paused || !Number.isFinite(total)) return;
    const started = Date.now();
    const timer = setTimeout(() => dismiss(id), Math.max(0, remainingRef.current));
    return () => {
      clearTimeout(timer);
      remainingRef.current -= Date.now() - started;
    };
  }, [closing, paused, total, version, id]);

  const close = useCallback(() => dismiss(id), [id]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLLIElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    onEscape(id);
    dismiss(id);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLLIElement>) => {
    if (closing || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;
    dragRef.current = { x: event.clientX, y: event.clientY, t: performance.now(), pointer: event.pointerId, moved: false };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLLIElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointer !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    let dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    // Only toward the near edge (down for a bottom stack, up for a top one); the other way rubber-bands.
    const outward = fromBottom ? dy > 0 : dy < 0;
    if (!outward) dy = dy * 0.15;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    setSwipe({ x: horizontal ? dx : 0, y: horizontal ? 0 : dy, dragging: true, out: false });
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLLIElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || !drag.moved) return;
    const elapsed = Math.max(1, performance.now() - drag.t);
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    const outward = fromBottom ? dy > 0 : dy < 0;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const distance = horizontal ? Math.abs(dx) : outward ? Math.abs(dy) : 0;
    const velocity = distance / elapsed;
    if (distance > SWIPE_DISTANCE || (distance > 16 && velocity > 0.45)) {
      const width = event.currentTarget.offsetWidth;
      setSwipe({
        x: horizontal ? Math.sign(dx) * (width + 40) : 0,
        y: horizontal ? 0 : Math.sign(dy) * 120,
        dragging: false,
        out: true,
      });
      dismiss(id);
    } else {
      setSwipe({ x: 0, y: 0, dragging: false, out: false });
    }
  };

  const onPointerCancel = () => {
    dragRef.current = null;
    setSwipe({ x: 0, y: 0, dragging: false, out: false });
  };

  const direction = fromBottom ? -1 : 1;
  const behind = !expanded && index > 0;
  const scale = behind ? 1 - index * 0.05 : 1;
  const enterShift = fromBottom ? 24 : -24;
  const translateY = !mounted
    ? enterShift
    : closing && !swipe.out
      ? direction * y - direction * 6
      : direction * y;

  const style = {
    "--ui-toast-y": `${translateY + swipe.y}px`,
    "--ui-toast-x": `${swipe.x}px`,
    "--ui-toast-scale": scale,
    height,
    zIndex: 100 - index,
  } as CSSProperties;

  const role = type === "error" ? "alert" : "status";
  const live = Number.isFinite(total) && hairline;

  return (
    <li
      className="ui-toaster__toast"
      data-toast={key}
      data-type={type}
      data-front={index === 0 ? "" : undefined}
      data-behind={behind ? "" : undefined}
      data-mounted={mounted ? "" : undefined}
      data-closing={closing ? "" : undefined}
      data-dragging={swipe.dragging ? "" : undefined}
      data-swiped={swipe.out ? "" : undefined}
      tabIndex={0}
      aria-roledescription="notification"
      aria-label={sentence(title, description) || undefined}
      aria-hidden={behind ? true : undefined}
      // Hidden toasts behind the front one must not be reachable.
      inert={behind || closing ? true : undefined}
      style={style}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div ref={innerRef} className="ui-toaster__inner" data-role={role}>
        <span className="ui-toaster__icon" aria-hidden="true">
          {icon ?? <StatusIcon type={type} />}
        </span>
        <div className="ui-toaster__text" key={version}>
          <div className="ui-toaster__title">{title}</div>
          {description ? <div className="ui-toaster__description">{description}</div> : null}
        </div>
        {action ? (
          <button
            type="button"
            className="ui-toaster__action"
            onClick={(event) => {
              action.onClick(event);
              if (!event.defaultPrevented) close();
            }}
          >
            {action.label}
          </button>
        ) : null}
        {closeButton ? (
          <button
            type="button"
            className="ui-toaster__close"
            aria-label={`Close notification${textOf(title) ? `: ${textOf(title)}` : ""}`}
            onClick={close}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
            </svg>
          </button>
        ) : null}
      </div>
      {live ? (
        <span
          key={`h${version}`}
          className="ui-toaster__hairline"
          aria-hidden="true"
          style={{
            animationDuration: `${total}ms`,
            animationPlayState: paused || closing ? "paused" : "running",
          }}
        />
      ) : null}
    </li>
  );
}

function StatusIcon({ type }: { type: ToastType }) {
  if (type === "default") {
    return (
      <svg viewBox="0 0 20 20" className="ui-toaster__glyph" data-kind="bell">
        <path d="M10 3.2a4.2 4.2 0 0 0-4.2 4.2v2.4L4.4 13h11.2l-1.4-3.2V7.4A4.2 4.2 0 0 0 10 3.2Z" />
        <path d="M8.2 15.4a1.9 1.9 0 0 0 3.6 0" />
      </svg>
    );
  }
  if (type === "info") {
    return (
      <svg viewBox="0 0 20 20" className="ui-toaster__glyph" data-kind="info">
        <circle cx="10" cy="10" r="7.25" />
        <path d="M10 9v4.6M10 6.4v.1" />
      </svg>
    );
  }
  // loading, success and error share one ring, so the arc can close into it.
  return (
    <svg viewBox="0 0 20 20" className="ui-toaster__status" data-kind={type}>
      <circle className="ui-toaster__ring" cx="10" cy="10" r="7.25" pathLength={100} />
      <path className="ui-toaster__mark" data-mark="check" d="M6.6 10.3l2.3 2.3 4.6-4.9" pathLength={100} />
      <path className="ui-toaster__mark" data-mark="cross" d="M7.4 7.4l5.2 5.2M12.6 7.4l-5.2 5.2" pathLength={100} />
    </svg>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-toaster {
  --ui-toast-panel: #ffffff;
  --ui-toast-hairline: #dae2ec;
  --ui-toast-firm: #cbd6e4;
  --ui-toast-soft: rgba(26, 62, 112, 0.06);
  --ui-toast-ink: #00162b;
  --ui-toast-text: rgba(0, 22, 43, 0.66);
  --ui-toast-muted: rgba(0, 22, 43, 0.54);
  --ui-toast-secondary: #fbfcfe;
  --ui-toast-ring: #8fbdf2;
  --ui-toast-info: #1a3e70;
  --ui-toast-success: #1d6a34;
  --ui-toast-danger: #8a3a22;
  --ui-toast-shadow: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-toast-shadow-back: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-toast-drop: 0 2px 4px -2px rgba(26, 62, 112, 0.2);
  --ui-toast-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: fixed;
  z-index: 2147483000;
  width: 356px;
  max-width: calc(100vw - 2 * var(--ui-toast-offset));
  box-sizing: border-box;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--ui-toast-ink);
  outline: none;
  pointer-events: none;
}
:where(.dark, [data-theme="dark"]) .ui-toaster {
  --ui-toast-panel: #16345c;
  --ui-toast-hairline: rgba(255, 255, 255, 0.12);
  --ui-toast-firm: rgba(255, 255, 255, 0.18);
  --ui-toast-soft: rgba(255, 255, 255, 0.07);
  --ui-toast-ink: rgba(255, 255, 255, 0.94);
  --ui-toast-text: rgba(255, 255, 255, 0.72);
  --ui-toast-muted: rgba(255, 255, 255, 0.56);
  --ui-toast-secondary: rgba(255, 255, 255, 0.07);
  --ui-toast-ring: rgba(143, 189, 242, 0.6);
  --ui-toast-info: #c1daff;
  --ui-toast-success: #7fe0a0;
  --ui-toast-danger: #f2a48c;
  --ui-toast-shadow: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-toast-shadow-back: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-toast-drop: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
}
.ui-toaster[data-inline] { position: absolute; z-index: 20; max-width: calc(100% - 2 * var(--ui-toast-offset)); }
.ui-toaster[data-y="top"] { top: var(--ui-toast-offset); }
.ui-toaster[data-y="bottom"] { bottom: var(--ui-toast-offset); }
.ui-toaster[data-x="left"] { left: var(--ui-toast-offset); }
.ui-toaster[data-x="right"] { right: var(--ui-toast-offset); }
.ui-toaster[data-x="center"] { left: 50%; transform: translateX(-50%); }
@media (max-width: 599px) {
  .ui-toaster:not([data-inline]) { left: 12px; right: 12px; width: auto; max-width: none; transform: none; }
  .ui-toaster:not([data-inline])[data-y="top"] { top: calc(12px + env(safe-area-inset-top, 0px)); }
  .ui-toaster:not([data-inline])[data-y="bottom"] { bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }
}

.ui-toaster__list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  transition: height 300ms var(--ui-toast-ease);
}

.ui-toaster__toast {
  position: absolute;
  left: 0;
  right: 0;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 16px;
  background: var(--ui-toast-panel);
  border: 1px solid var(--ui-toast-hairline);
  box-shadow: var(--ui-toast-shadow);
  pointer-events: auto;
  touch-action: none;
  outline: none;
  opacity: 0;
  transform: translate3d(var(--ui-toast-x), var(--ui-toast-y), 0) scale(var(--ui-toast-scale));
  transition:
    transform 400ms var(--ui-toast-ease),
    opacity 300ms var(--ui-toast-ease),
    height 300ms var(--ui-toast-ease),
    box-shadow 300ms var(--ui-toast-ease);
  user-select: none;
  -webkit-user-select: none;
}
.ui-toaster[data-y="bottom"] .ui-toaster__toast { bottom: 0; transform-origin: 50% 0%; }
.ui-toaster[data-y="top"] .ui-toaster__toast { top: 0; transform-origin: 50% 100%; }
.ui-toaster__toast[data-mounted] { opacity: 1; }
.ui-toaster__toast[data-behind] { box-shadow: var(--ui-toast-shadow-back); }
.ui-toaster__toast[data-behind] .ui-toaster__inner { opacity: 0; }
.ui-toaster__toast[data-closing] { opacity: 0; pointer-events: none; }
.ui-toaster__toast[data-swiped] { transition: transform 260ms var(--ui-toast-ease), opacity 260ms linear; }
.ui-toaster__toast[data-dragging] { transition: none; cursor: grabbing; }
.ui-toaster__toast:focus-visible { box-shadow: 0 0 0 3px var(--ui-toast-ring), var(--ui-toast-shadow); }

.ui-toaster__inner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 14px 14px 16px;
  transition: opacity 200ms var(--ui-toast-ease);
}
.ui-toaster__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  color: var(--ui-toast-muted);
}
.ui-toaster__icon svg { width: 20px; height: 20px; display: block; }
.ui-toaster__glyph { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.ui-toaster__glyph[data-kind="info"] { color: var(--ui-toast-info); }

.ui-toaster__status { fill: none; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; overflow: visible; }
.ui-toaster__ring {
  stroke: currentColor;
  stroke-dasharray: 100 100;
  transform-origin: 10px 10px;
  transition: stroke-dasharray 420ms var(--ui-toast-ease), stroke 300ms ease;
}
.ui-toaster__mark { stroke: currentColor; stroke-dasharray: 100 100; stroke-dashoffset: 100; opacity: 0; }
.ui-toaster__status[data-kind="loading"] .ui-toaster__ring {
  stroke-dasharray: 24 100;
  animation: ui-toaster-spin 800ms linear infinite;
}
.ui-toaster__icon:has([data-kind="success"]) { color: var(--ui-toast-success); }
.ui-toaster__icon:has([data-kind="error"]) { color: var(--ui-toast-danger); }
.ui-toaster__status[data-kind="success"] [data-mark="check"],
.ui-toaster__status[data-kind="error"] [data-mark="cross"] {
  opacity: 1;
  animation: ui-toaster-draw 380ms 120ms var(--ui-toast-ease) forwards;
}

.ui-toaster__text { flex: 1; min-width: 0; animation: ui-toaster-fade 300ms var(--ui-toast-ease); }
.ui-toaster__title {
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: var(--ui-toast-ink);
  overflow-wrap: anywhere;
}
.ui-toaster__description {
  margin-top: 2px;
  font-size: 13px;
  line-height: 18px;
  color: var(--ui-toast-text);
  overflow-wrap: anywhere;
}

.ui-toaster__action {
  flex: none;
  align-self: center;
  position: relative;
  height: 30px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--ui-toast-firm);
  background: var(--ui-toast-secondary);
  box-shadow: var(--ui-toast-drop);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-toast-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ui-toast-ease), border-color 150ms var(--ui-toast-ease);
}
.ui-toaster__action:hover { background: var(--ui-toast-soft); }
.ui-toaster__action:focus-visible,
.ui-toaster__close:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-toast-ring); }

.ui-toaster__close {
  position: absolute;
  top: 6px;
  right: 6px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid var(--ui-toast-hairline);
  border-radius: 999px;
  background: var(--ui-toast-panel);
  color: var(--ui-toast-muted);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms var(--ui-toast-ease), color 150ms var(--ui-toast-ease);
}
.ui-toaster__close svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
.ui-toaster__close:hover { color: var(--ui-toast-ink); }
.ui-toaster__toast:hover .ui-toaster__close,
.ui-toaster__toast:focus-within .ui-toaster__close { opacity: 1; }
.ui-toaster__toast:has(.ui-toaster__close) .ui-toaster__inner { padding-right: 30px; }

.ui-toaster__hairline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--ui-toast-firm);
  transform-origin: 0 50%;
  animation-name: ui-toaster-time;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.ui-toaster__sr {
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

@media (hover: none) {
  .ui-toaster__close { opacity: 1; }
  .ui-toaster__close::after { content: ""; position: absolute; inset: -10px; }
  .ui-toaster__action { height: 36px; padding: 0 14px; }
}

@keyframes ui-toaster-spin { to { transform: rotate(360deg); } }
@keyframes ui-toaster-draw { to { stroke-dashoffset: 0; } }
@keyframes ui-toaster-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-toaster-time { from { transform: scaleX(1); } to { transform: scaleX(0); } }

@media (prefers-reduced-motion: reduce) {
  .ui-toaster__list,
  .ui-toaster__toast,
  .ui-toaster__toast[data-swiped],
  .ui-toaster__inner,
  .ui-toaster__ring { transition: none; }
  .ui-toaster__text { animation: none; }
  .ui-toaster__status[data-kind="success"] [data-mark="check"],
  .ui-toaster__status[data-kind="error"] [data-mark="cross"] { animation: none; stroke-dashoffset: 0; }
  .ui-toaster__hairline { animation: none; opacity: 0; }
}
`;
