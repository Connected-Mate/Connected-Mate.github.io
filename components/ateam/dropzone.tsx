"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent as ReactDragEvent,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type UploadStatus = "uploading" | "done" | "error" | "rejected";

export type UploadItem = {
  id: string;
  name: string;
  size: number;
  status: UploadStatus;
  /** 0 to 1. */
  progress: number;
  error?: string;
  file?: File;
};

export type DropzoneProps = {
  accept?: string[];
  maxSize?: number;
  onUpload?: (file: File, onProgress: (p: number) => void) => Promise<void>;
  onChange?: (items: UploadItem[]) => void;
  hint?: string;
  autoplay?: boolean;
  className?: string;
};

type Row = UploadItem & { startedAt: number; leaving?: boolean; shake?: number; order: number };

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const MB = 1024 * 1024;

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < MB) return `${Math.max(1, Math.round(n / 1024))} KB`;
  if (n < 1024 * MB) return `${(n / MB).toFixed(1).replace(/\.0$/, "")} MB`;
  return `${(n / (1024 * MB)).toFixed(1).replace(/\.0$/, "")} GB`;
}

const ext = (name: string) => {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i + 1).toLowerCase() : "";
};

function tone(e: string) {
  if (e === "pdf") return "danger";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "heic", "avif"].includes(e)) return "info";
  if (["xls", "xlsx", "csv", "numbers", "ods"].includes(e)) return "success";
  if (["mp4", "mov", "webm", "mp3", "wav", "m4a"].includes(e)) return "waiting";
  if (["doc", "docx", "txt", "md", "pages", "rtf"].includes(e)) return "info";
  return "neutral";
}

function defaultHint(accept: string[] | undefined, maxSize: number) {
  const size = `up to ${formatBytes(maxSize)} each`;
  if (!accept?.length) return `Any file · ${size}`;
  const names = accept.map((a) => a.replace(/^\./, "").toUpperCase());
  const shown = names.length > 3 ? `${names.slice(0, 3).join(", ")} and more` : names.join(", ");
  return `${shown} · ${size}`;
}

/** Fake upload for previews: steady speed, optional failure part-way. */
function simulate(size: number, onProgress: (p: number) => void, timers: Set<number>, opts?: { failAt?: number; seconds?: number }) {
  return new Promise<void>((resolve, reject) => {
    const seconds = opts?.seconds ?? Math.min(6, 1.6 + size / (1.4 * MB));
    const started = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - started) / (seconds * 1000));
      if (opts?.failAt !== undefined && p >= opts.failAt) {
        onProgress(opts.failAt);
        reject(new Error("Connection lost"));
        return;
      }
      onProgress(p);
      if (p >= 1) resolve();
      else {
        const t = window.setTimeout(() => {
          timers.delete(t);
          tick();
        }, 120);
        timers.add(t);
      }
    };
    tick();
  });
}

/* ------------------------------------------------------------------------------------------------
 * Dropzone
 * ----------------------------------------------------------------------------------------------*/

export function Dropzone({
  accept,
  maxSize = 25 * MB,
  onUpload,
  onChange,
  hint,
  autoplay = false,
  className,
}: DropzoneProps) {
  const uid = useId();
  const [rows, setRows] = useState<Row[]>([]);
  const [dragCount, setDragCount] = useState(0);
  const [announce, setAnnounce] = useState("");
  const [, setNow] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef(new Set<number>());
  const alive = useRef(new Set<string>());
  const sims = useRef(new Map<string, { failAt?: number; seconds?: number }>());
  const depth = useRef(0);
  const seq = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const later = useCallback((fn: () => void, ms: number) => {
    const t = window.setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, ms);
    timers.current.add(t);
  }, []);

  useEffect(() => {
    const set = timers.current;
    const live = alive.current;
    return () => {
      set.forEach((t) => window.clearTimeout(t));
      set.clear();
      live.clear();
    };
  }, []);

  // Report every change of the list (rows folding away are already gone for the caller).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onChangeRef.current?.(
      rows
        .filter((r) => !r.leaving)
        .map(({ id, name, size, status, progress, error, file }) => ({ id, name, size, status, progress, error, file })),
    );
  }, [rows]);

  // Re-render while uploading so "time left" stays fresh.
  const uploading = rows.some((r) => r.status === "uploading");
  useEffect(() => {
    if (!uploading) return;
    const t = window.setInterval(() => setNow((n) => n + 1), 500);
    return () => window.clearInterval(t);
  }, [uploading]);

  const patch = (id: string, p: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)));

  const start = (row: Pick<Row, "id" | "name" | "size" | "file">) => {
    alive.current.add(row.id);
    patch(row.id, { status: "uploading", progress: 0, error: undefined, startedAt: performance.now() });
    const onProgress = (p: number) => {
      if (!alive.current.has(row.id)) return;
      const v = Math.max(0, Math.min(1, Number.isFinite(p) ? p : 0));
      setRows((rs) => rs.map((r) => (r.id === row.id && r.status === "uploading" ? { ...r, progress: Math.max(r.progress, v) } : r)));
    };
    const sim = sims.current.get(row.id);
    let job: Promise<void>;
    try {
      job =
        onUpload && row.file && !sim
          ? onUpload(row.file, onProgress)
          : simulate(row.size, onProgress, timers.current, sim);
    } catch (e) {
      job = Promise.reject(e);
    }
    job.then(
      () => {
        if (!alive.current.has(row.id)) return;
        patch(row.id, { status: "done", progress: 1 });
        setAnnounce(`${row.name} uploaded`);
      },
      (err: unknown) => {
        if (!alive.current.has(row.id)) return;
        const message = err instanceof Error && err.message ? err.message : "Upload failed";
        setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status: "error", error: message, shake: (r.shake ?? 0) + 1 } : r)));
        setAnnounce(`${row.name} failed: ${message}`);
      },
    );
  };

  const add = (files: { name: string; size: number; file?: File; sim?: { failAt?: number; seconds?: number } }[]) => {
    const allowed = accept?.map((a) => a.toLowerCase().replace(/^\./, ""));
    const fresh: Row[] = [];
    const rejected: string[] = [];
    for (const f of files) {
      const id = `${uid}-f${seq.current++}`;
      const e = ext(f.name);
      let error: string | undefined;
      if (allowed && !allowed.includes(e)) error = `Not allowed – ${allowed.map((a) => a.toUpperCase()).slice(0, 4).join(", ")} only`;
      else if (f.size > maxSize) error = `Too large – max ${formatBytes(maxSize)}`;
      if (f.sim) sims.current.set(id, f.sim);
      if (error) rejected.push(`${f.name}: ${error}`);
      fresh.push({
        id,
        name: f.name,
        size: f.size,
        file: f.file,
        status: error ? "rejected" : "uploading",
        progress: 0,
        error,
        startedAt: performance.now(),
        order: fresh.length,
      });
    }
    setRows((rs) => [...rs, ...fresh]);
    for (const r of fresh) if (r.status === "uploading") start(r);
    if (rejected.length) setAnnounce(rejected.join(". "));
  };

  const remove = (row: Row) => {
    alive.current.delete(row.id);
    sims.current.delete(row.id);
    patch(row.id, { leaving: true });
    setAnnounce(`${row.name} removed`);
    later(() => setRows((rs) => rs.filter((r) => r.id !== row.id)), 200);
  };

  // Sample drop for previews.
  useEffect(() => {
    if (!autoplay) return;
    later(() => setDragCount(4), 500);
    later(() => {
      setDragCount(0);
      add([
        { name: "Q3-Board-Report.pdf", size: 4.2 * MB, sim: { seconds: 7 } },
        { name: "Hero-Shot.png", size: 2.6 * MB, sim: { seconds: 5.5 } },
        { name: "Budget-2027.xlsx", size: 1.8 * MB, sim: { seconds: 4, failAt: 0.62 } },
        { name: "Product-Demo.mp4", size: 48 * MB },
      ]);
    }, 1700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay]);

  const filesIn = (e: ReactDragEvent) =>
    e.dataTransfer?.items ? [...e.dataTransfer.items].filter((i) => i.kind === "file").length : 0;

  const visible = rows.filter((r) => !r.leaving);
  const active = visible.filter((r) => r.status === "uploading");
  const done = visible.filter((r) => r.status === "done").length;
  const failed = visible.filter((r) => r.status === "error" || r.status === "rejected").length;
  const loaded = active.reduce((s, r) => s + r.size * r.progress, 0);
  const total = active.reduce((s, r) => s + r.size, 0);
  const summary = active.length
    ? `Uploading ${active.length} of ${visible.length} · ${formatBytes(loaded)} of ${formatBytes(total)}`
    : visible.length
      ? `${done} of ${visible.length} uploaded${failed ? ` · ${failed} failed` : ""}`
      : "";
  const hintText = hint ?? defaultHint(accept, maxSize);

  return (
    <div
      className={["ui-drop", className].filter(Boolean).join(" ")}
      data-drag={dragCount ? "" : undefined}
      onDragEnter={(e) => {
        if (![...(e.dataTransfer?.types ?? [])].includes("Files")) return;
        e.preventDefault();
        depth.current++;
        setDragCount(Math.max(1, filesIn(e)));
      }}
      onDragOver={(e) => {
        if (![...(e.dataTransfer?.types ?? [])].includes("Files")) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1);
        if (!depth.current) setDragCount(0);
      }}
      onDrop={(e) => {
        e.preventDefault();
        depth.current = 0;
        setDragCount(0);
        const list = [...(e.dataTransfer?.files ?? [])];
        if (list.length) add(list.map((f) => ({ name: f.name, size: f.size, file: f })));
      }}
    >
      <style href="ui-dropzone" precedence="default">
        {css}
      </style>
      <div className="ui-drop__panel">
        <button
          type="button"
          className="ui-drop__area"
          aria-describedby={`${uid}-hint`}
          onClick={() => inputRef.current?.click()}
        >
          <span className="ui-drop__docs" aria-hidden="true">
            <span className="ui-drop__doc ui-drop__doc--l" />
            <span className="ui-drop__doc ui-drop__doc--r" />
            <span className="ui-drop__doc ui-drop__doc--c">
              <svg viewBox="0 0 16 16">
                <path d="M8 10.5V3M5 5.8L8 3l3 2.8M3 10v2.5h10V10" />
              </svg>
            </span>
          </span>
          <span className="ui-drop__title">
            {dragCount ? (
              <span key="drag">
                Drop {dragCount} {dragCount === 1 ? "file" : "files"}
              </span>
            ) : (
              <span key="idle">
                Drop files here or <span className="ui-drop__browse">browse</span>
              </span>
            )}
          </span>
          <span id={`${uid}-hint`} className="ui-drop__hint">
            {hintText}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          tabIndex={-1}
          accept={accept?.join(",")}
          onChange={(e) => {
            const list = [...(e.target.files ?? [])];
            if (list.length) add(list.map((f) => ({ name: f.name, size: f.size, file: f })));
            e.target.value = "";
          }}
        />

        {rows.length ? (
          <ul className="ui-drop__list" aria-label="Uploads">
            {rows.map((r) => (
              <FileRow key={r.id} row={r} onRemove={() => remove(r)} onRetry={() => {
                  const sim = sims.current.get(r.id);
                  if (sim) sims.current.set(r.id, { seconds: sim.seconds });
                  start(r);
                }}
              />
            ))}
          </ul>
        ) : null}
      </div>
      {summary ? (
        <p className="ui-drop__foot" aria-hidden="true">
          {summary}
        </p>
      ) : null}
      <span className="ui-drop__sr" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}

function FileRow({ row, onRemove, onRetry }: { row: Row; onRemove: () => void; onRetry: () => void }) {
  const e = ext(row.name);
  const loaded = row.size * row.progress;
  let meta: string;
  if (row.status === "uploading") {
    const elapsed = (performance.now() - row.startedAt) / 1000;
    const speed = elapsed > 0.3 && row.progress > 0 ? loaded / elapsed : 0;
    const left = speed ? (row.size - loaded) / speed : Infinity;
    const when = !speed ? "starting…" : row.progress >= 0.9 || left < 1.5 ? "almost done" : `${Math.ceil(left)}s left`;
    meta = `${formatBytes(loaded)} of ${formatBytes(row.size)} · ${when}`;
  } else if (row.status === "done") meta = `${formatBytes(row.size)} · Uploaded`;
  else meta = row.error ?? "Upload failed";
  const bad = row.status === "error" || row.status === "rejected";

  return (
    <li
      className="ui-drop__row"
      data-status={row.status}
      data-leaving={row.leaving ? "" : undefined}
      data-shake={row.shake ? row.shake % 2 : undefined}
      style={{ "--i": row.order } as CSSProperties}
    >
      <span className="ui-drop__badge" data-tone={tone(e)} aria-hidden="true">
        <svg viewBox="0 0 24 28">
          <path d="M4 2.5h11l5.5 5.5v17.5H4z" />
          <path d="M15 2.5V8h5.5" />
        </svg>
        <span className="ui-drop__ext">{(e || "file").slice(0, 4)}</span>
      </span>
      <span className="ui-drop__body">
        <span className="ui-drop__name" title={row.name}>
          {row.name}
        </span>
        <span className="ui-drop__meta" data-bad={bad ? "" : undefined}>
          {meta}
        </span>
        {row.status === "uploading" || row.status === "error" ? (
          <span
            className="ui-drop__bar"
            role="progressbar"
            aria-label={`Upload of ${row.name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(row.progress * 100)}
          >
            <span className="ui-drop__fill" style={{ transform: `scaleX(${row.progress})` }} />
          </span>
        ) : null}
      </span>
      <span className="ui-drop__actions">
        {row.status === "done" ? (
          <span className="ui-drop__ok" aria-hidden="true">
            <svg viewBox="0 0 12 12">
              <path d="M2.8 6.3l2.1 2.1 4.3-4.8" />
            </svg>
          </span>
        ) : null}
        {row.status === "error" ? (
          <button type="button" className="ui-drop__icon" aria-label={`Retry ${row.name}`} onClick={onRetry}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M13 8a5 5 0 11-1.5-3.6M13 2.8v2.6h-2.6" />
            </svg>
          </button>
        ) : null}
        <button type="button" className="ui-drop__icon" aria-label={`Remove ${row.name}`} onClick={onRemove}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
          </svg>
        </button>
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-drop {
  --drop-frame: #f2f6fa;
  --drop-panel: #ffffff;
  --drop-soft: rgba(26, 62, 112, 0.06);
  --drop-line: #dae2ec;
  --drop-firm: #cbd6e4;
  --drop-ink: #00162b;
  --drop-text: rgba(0, 22, 43, 0.66);
  --drop-muted: rgba(0, 22, 43, 0.54);
  --drop-berry: #851437;
  --drop-info-ink: #1a3e70;
  --drop-info-fill: #eef5ff;
  --drop-info-line: #c1daff;
  --drop-ring: #8fbdf2;
  --drop-success-ink: #1d6a34;
  --drop-success-fill: #eafbee;
  --drop-success-line: #c9f5cf;
  --drop-waiting-ink: #775810;
  --drop-waiting-fill: #fdf6dd;
  --drop-waiting-line: #fae6a0;
  --drop-danger-ink: #8a3a22;
  --drop-danger-fill: #fdeee8;
  --drop-danger-line: #f5d5c9;
  --drop-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --drop-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --drop-ease: cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  max-width: 520px;
  padding: 6px;
  background: var(--drop-frame);
  border: 1px solid var(--drop-line);
  border-radius: 22px;
  box-shadow: var(--drop-raised);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: var(--drop-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-drop {
  --drop-frame: #0f2747;
  --drop-panel: #16345c;
  --drop-soft: rgba(255, 255, 255, 0.07);
  --drop-line: rgba(255, 255, 255, 0.12);
  --drop-firm: rgba(255, 255, 255, 0.18);
  --drop-ink: rgba(255, 255, 255, 0.94);
  --drop-text: rgba(255, 255, 255, 0.72);
  --drop-muted: rgba(255, 255, 255, 0.56);
  --drop-berry: #a8204d;
  --drop-info-ink: #c1daff;
  --drop-info-fill: rgba(143, 189, 242, 0.16);
  --drop-info-line: rgba(143, 189, 242, 0.34);
  --drop-ring: rgba(143, 189, 242, 0.6);
  --drop-success-ink: #7fe0a0;
  --drop-success-fill: rgba(127, 224, 160, 0.14);
  --drop-success-line: rgba(127, 224, 160, 0.3);
  --drop-waiting-ink: #f3d27a;
  --drop-waiting-fill: rgba(243, 210, 122, 0.14);
  --drop-waiting-line: rgba(243, 210, 122, 0.3);
  --drop-danger-ink: #f2a48c;
  --drop-danger-fill: rgba(242, 164, 140, 0.14);
  --drop-danger-line: rgba(242, 164, 140, 0.3);
  --drop-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --drop-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
}
.ui-drop *, .ui-drop *::before, .ui-drop *::after { box-sizing: border-box; }
.ui-drop button { font: inherit; }

.ui-drop__panel {
  padding: 6px;
  background: var(--drop-panel);
  border: 1px solid var(--drop-line);
  border-radius: 16px;
  box-shadow: var(--drop-drop);
}
.ui-drop__area {
  display: grid;
  justify-items: center;
  gap: 4px;
  width: 100%;
  padding: 24px 16px 22px;
  background: var(--drop-soft);
  border: 1.5px dashed var(--drop-firm);
  border-radius: 12px;
  color: var(--drop-ink);
  text-align: center;
  cursor: pointer;
  transition: background-color 150ms var(--drop-ease), border-color 150ms var(--drop-ease);
}
.ui-drop__area:hover { border-color: var(--drop-info-line); }
.ui-drop__area:focus-visible { outline: none; border-style: solid; border-color: var(--drop-info-line); box-shadow: 0 0 0 3px color-mix(in srgb, var(--drop-ring) 45%, transparent); }
.ui-drop[data-drag] .ui-drop__area { border-style: solid; border-color: var(--drop-info-ink); background: var(--drop-info-fill); }

.ui-drop__docs { position: relative; width: 56px; height: 46px; margin-bottom: 8px; }
.ui-drop__doc {
  position: absolute;
  left: 50%;
  top: 2px;
  width: 34px;
  height: 40px;
  margin-left: -17px;
  background: var(--drop-panel);
  border: 1px solid var(--drop-line);
  border-radius: 8px;
  box-shadow: var(--drop-pebble), var(--drop-drop);
  transition: transform 300ms var(--drop-ease);
}
.ui-drop__doc--l { transform: translateX(-5px) rotate(-8deg); }
.ui-drop__doc--r { transform: translateX(5px) rotate(8deg); }
.ui-drop__doc--l::after, .ui-drop__doc--r::after {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 7px;
  height: 5px;
  border-radius: 2px;
  background: var(--drop-danger-line);
}
.ui-drop__doc--r::after { background: var(--drop-info-line); }
.ui-drop__doc--c { display: grid; place-items: center; color: var(--drop-ink); }
.ui-drop__doc--c svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; transition: transform 300ms var(--drop-ease); }
.ui-drop[data-drag] .ui-drop__doc--l { transform: translateX(-20px) translateY(4px) rotate(-16deg); }
.ui-drop[data-drag] .ui-drop__doc--r { transform: translateX(20px) translateY(4px) rotate(16deg); }
.ui-drop[data-drag] .ui-drop__doc--c { transform: translateY(-4px); }
.ui-drop[data-drag] .ui-drop__doc--c svg { transform: translateY(-2px); }

.ui-drop__title { font-weight: 600; font-size: 15px; }
.ui-drop__title > span { display: inline-block; animation: ui-drop-fade 300ms var(--drop-ease); }
.ui-drop__browse { color: var(--drop-info-ink); text-decoration: underline; text-decoration-color: var(--drop-info-line); text-underline-offset: 3px; }
.ui-drop__hint { color: var(--drop-muted); font-size: 12.5px; }

.ui-drop__list { list-style: none; margin: 4px 0 0; padding: 0; }
.ui-drop__row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 11px 6px 11px 8px;
  border-top: 1px solid var(--drop-line);
  animation: ui-drop-grow 300ms var(--drop-ease) both;
  animation-delay: calc(var(--i, 0) * 90ms);
}
.ui-drop__row:first-child { border-top: 0; }
.ui-drop__row[data-leaving] { max-height: 90px; animation: ui-drop-fold 200ms var(--drop-ease) forwards; overflow: hidden; }
.ui-drop__row[data-shake="1"] { animation: ui-drop-shake 380ms var(--drop-ease); }
.ui-drop__row[data-shake="0"] { animation: ui-drop-shake2 380ms var(--drop-ease); }

.ui-drop__badge { position: relative; display: grid; width: 30px; height: 36px; flex: none; }
.ui-drop__badge svg { width: 30px; height: 36px; fill: var(--drop-panel); stroke: var(--drop-firm); stroke-width: 1; stroke-linejoin: round; }
.ui-drop__ext {
  position: absolute;
  left: -1px;
  bottom: 6px;
  padding: 1px 3px;
  border-radius: 4px;
  font-size: 7.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--drop-muted);
  background: var(--drop-soft);
  border: 1px solid var(--drop-line);
}
.ui-drop__badge[data-tone="danger"] .ui-drop__ext { color: var(--drop-danger-ink); background: var(--drop-danger-fill); border-color: var(--drop-danger-line); }
.ui-drop__badge[data-tone="info"] .ui-drop__ext { color: var(--drop-info-ink); background: var(--drop-info-fill); border-color: var(--drop-info-line); }
.ui-drop__badge[data-tone="success"] .ui-drop__ext { color: var(--drop-success-ink); background: var(--drop-success-fill); border-color: var(--drop-success-line); }
.ui-drop__badge[data-tone="waiting"] .ui-drop__ext { color: var(--drop-waiting-ink); background: var(--drop-waiting-fill); border-color: var(--drop-waiting-line); }

.ui-drop__body { display: grid; gap: 2px; min-width: 0; }
.ui-drop__name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-drop__meta { color: var(--drop-muted); font-size: 12.5px; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-drop__meta[data-bad] { color: var(--drop-danger-ink); }
.ui-drop__bar { position: relative; display: block; height: 4px; margin-top: 6px; overflow: hidden; border-radius: 999px; background: var(--drop-soft); box-shadow: inset 0 0 0 1px var(--drop-line); }
.ui-drop__fill { position: absolute; inset: 0; border-radius: inherit; background: var(--drop-berry); transform-origin: left center; transition: transform 300ms linear, background-color 300ms var(--drop-ease); }
.ui-drop__row[data-status="error"] .ui-drop__fill { background: var(--drop-danger-ink); }

.ui-drop__actions { display: flex; align-items: center; gap: 2px; }
.ui-drop__icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--drop-muted);
  cursor: pointer;
  transition: background-color 150ms var(--drop-ease), color 150ms var(--drop-ease);
}
.ui-drop__icon:hover { background: var(--drop-soft); color: var(--drop-ink); border-color: var(--drop-line); }
.ui-drop__icon:focus-visible { outline: 2px solid var(--drop-ring); outline-offset: 1px; }
.ui-drop__icon svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.ui-drop__ok {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  border-radius: 999px;
  background: var(--drop-success-fill);
  border: 1px solid var(--drop-success-line);
  color: var(--drop-success-ink);
  animation: ui-drop-pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ui-drop__ok svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

.ui-drop__foot { margin: 0; padding: 10px 10px 4px; color: var(--drop-muted); font-size: 12.5px; font-variant-numeric: tabular-nums; }

.ui-drop__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

@media (pointer: coarse) {
  .ui-drop__icon { width: 40px; height: 40px; }
}

@keyframes ui-drop-grow { from { opacity: 0; transform: translateY(-6px); } }
@keyframes ui-drop-fold { to { opacity: 0; transform: scale(0.98); max-height: 0; padding-top: 0; padding-bottom: 0; } }
@keyframes ui-drop-fade { from { opacity: 0; transform: translateY(3px); } }
@keyframes ui-drop-pop { from { opacity: 0; transform: scale(0.3); } }
@keyframes ui-drop-shake { 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
@keyframes ui-drop-shake2 { 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }

@media (prefers-reduced-motion: reduce) {
  .ui-drop *, .ui-drop *::before, .ui-drop *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
  .ui-drop__fill { transition: none !important; }
}
`;
