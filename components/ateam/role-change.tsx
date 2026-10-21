"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/*
 * Role Change – shows a change to the database before and while it is applied: who keeps,
 * gains or loses access to an app. A project card on top carries the plan (the task list),
 * a table shows each person's role before → after, and the footer asks for a decision.
 * Apply walks the plan step by step, rows confirm one by one, and the card ends on
 * "Applied" with an undo window. Single self-contained file; styles injected below.
 */

export type Role = "Admin" | "Éditeur" | "Lecteur" | "Aucun accès" | (string & {});

export type RoleChangeRow = {
  id: string;
  name: string;
  email?: string;
  before: Role;
  after: Role;
};

export type PlanStep = { id: string; label: string; detail?: string };

export type RoleChangeStatus = "review" | "applying" | "applied" | "cancelled" | "undone";

export type RoleChangeProps = {
  /** e.g. "Rôles d'accès – Formulaires" */
  title: string;
  /** The app or table the change touches, e.g. "app_formulaires.membres" */
  target?: string;
  rows: RoleChangeRow[];
  /** The plan shown in the project card; the last steps run when the change is applied */
  steps?: PlanStep[];
  /** How many steps are already done before the decision (reading, preparing…) */
  doneBefore?: number;
  /** Who asked for the change */
  requestedBy?: string;
  /** Runs the change. Resolve when it is saved; reject to show the error. Without it, the card simulates. */
  onApply?: (rows: RoleChangeRow[]) => Promise<void>;
  onCancel?: () => void;
  onUndo?: (rows: RoleChangeRow[]) => Promise<void> | void;
  /** Seconds during which Undo stays available after applying */
  undoSeconds?: number;
  className?: string;
};

const DEFAULT_STEPS: PlanStep[] = [
  { id: "read", label: "Lire les accès actuels", detail: "membres de l'application" },
  { id: "prepare", label: "Préparer le changement", detail: "rôle avant → rôle après" },
  { id: "check", label: "Vérifier l'impact", detail: "au moins un admin reste" },
  { id: "apply", label: "Appliquer en base", detail: "une seule transaction" },
  { id: "notify", label: "Prévenir les personnes", detail: "courriel automatique" },
];

const RANK: Record<string, number> = { "Aucun accès": 0, Lecteur: 1, Éditeur: 2, Admin: 3 };

type Kind = "added" | "removed" | "up" | "down" | "same";
const kindOf = (r: RoleChangeRow): Kind => {
  if (r.before === r.after) return "same";
  if (r.before === "Aucun accès") return "added";
  if (r.after === "Aucun accès") return "removed";
  return (RANK[r.after] ?? 0) > (RANK[r.before] ?? 0) ? "up" : "down";
};
const KIND_LABEL: Record<Kind, string> = {
  added: "Accès ajouté",
  removed: "Accès retiré",
  up: "Rôle élevé",
  down: "Rôle réduit",
  same: "Inchangé",
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/* ---------- icons ---------- */

const Svg = ({ children, size = 14 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
);
const IconDb = () => (
  <Svg size={16}>
    <ellipse cx="8" cy="3.8" rx="5" ry="1.8" />
    <path d="M3 3.8v8.4c0 1 2.2 1.8 5 1.8s5-.8 5-1.8V3.8M3 8c0 1 2.2 1.8 5 1.8S13 9 13 8" />
  </Svg>
);
const IconCheck = () => (
  <Svg size={12}>
    <path d="m3.5 8.4 3 2.9 6-6.3" />
  </Svg>
);
const IconArrow = () => (
  <Svg size={12}>
    <path d="M3 8h10M9.5 4.5 13 8l-3.5 3.5" />
  </Svg>
);
const IconUndo = () => (
  <Svg size={13}>
    <path d="M5.5 4 2.5 7l3 3" />
    <path d="M2.5 7h7a4 4 0 0 1 0 8H8" />
  </Svg>
);
const Spinner = () => (
  <svg className="ui-at-rc__spin" width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
    <path d="M8 2.4a5.6 5.6 0 0 1 5.6 5.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ---------- component ---------- */

export function RoleChange({
  title,
  target,
  rows,
  steps = DEFAULT_STEPS,
  doneBefore = 3,
  requestedBy,
  onApply,
  onCancel,
  onUndo,
  undoSeconds = 30,
  className,
}: RoleChangeProps) {
  const uid = useId();
  const reduced = useReducedMotion();
  const changes = rows.filter((r) => kindOf(r) !== "same");

  const [status, setStatus] = useState<RoleChangeStatus>("review");
  const [done, setDone] = useState(Math.min(doneBefore, steps.length));
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState(undoSeconds);
  const [announce, setAnnounce] = useState("");
  const alive = useRef(true);
  const applyBtn = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Undo countdown once applied
  useEffect(() => {
    if (status !== "applied") return;
    setLeft(undoSeconds);
    const id = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [status, undoSeconds]);

  const pace = (ms: number) => wait(reduced ? 0 : ms);

  const apply = async () => {
    if (status === "applying" || !changes.length) return;
    setError(null);
    setStatus("applying");
    setConfirmed(new Set());
    setAnnounce(`Application de ${changes.length} changement${changes.length > 1 ? "s" : ""}`);
    try {
      const write = onApply ? onApply(rows) : pace(900);
      // The plan advances while the write runs: verification, then the write itself
      for (let s = done; s < steps.length - 1; s++) {
        await pace(500);
        if (!alive.current) return;
        if (s === steps.length - 2) await write;
        setDone(s + 1);
      }
      if (done >= steps.length - 1) await write;
      // Rows confirm one after the other
      for (const r of changes) {
        await pace(220);
        if (!alive.current) return;
        setConfirmed((c) => new Set(c).add(r.id));
      }
      await pace(350);
      if (!alive.current) return;
      setDone(steps.length);
      setStatus("applied");
      setAnnounce(`${changes.length} rôle${changes.length > 1 ? "s" : ""} changé${changes.length > 1 ? "s" : ""}. Annulation possible ${undoSeconds} secondes.`);
      window.setTimeout(() => resultRef.current?.focus(), 0);
    } catch (e) {
      if (!alive.current) return;
      const message = e instanceof Error && e.message ? e.message : "La base n'a pas accepté le changement";
      setError(message);
      setStatus("review");
      setAnnounce(`Échec : ${message}. Rien n'a été modifié.`);
      window.setTimeout(() => applyBtn.current?.focus(), 0);
    }
  };

  const cancel = () => {
    setStatus("cancelled");
    setAnnounce("Changement abandonné, rien n'a été modifié");
    onCancel?.();
  };

  const undo = async () => {
    try {
      await onUndo?.(rows);
      setStatus("undone");
      setConfirmed(new Set());
      setDone(Math.min(doneBefore, steps.length));
      setAnnounce("Changement annulé, les rôles d'avant sont revenus");
    } catch {
      setAnnounce("L'annulation a échoué, les nouveaux rôles sont toujours en place");
    }
  };

  const restart = () => {
    setStatus("review");
    setConfirmed(new Set());
    setDone(Math.min(doneBefore, steps.length));
    setError(null);
  };

  const progress = steps.length ? done / steps.length : 0;
  const ring = 2 * Math.PI * 15;
  const counts = {
    added: changes.filter((r) => kindOf(r) === "added").length,
    removed: changes.filter((r) => kindOf(r) === "removed").length,
    moved: changes.filter((r) => ["up", "down"].includes(kindOf(r))).length,
  };
  const chip =
    status === "applied"
      ? { tone: "ok", text: "Appliqué" }
      : status === "applying"
        ? { tone: "info", text: "En cours" }
        : status === "cancelled"
          ? { tone: "muted", text: "Abandonné" }
          : status === "undone"
            ? { tone: "muted", text: "Annulé" }
            : error
              ? { tone: "bad", text: "Échec" }
              : { tone: "wait", text: "À valider" };

  return (
    <section className={["ui-at-rc", className].filter(Boolean).join(" ")} data-status={status} aria-labelledby={`${uid}-t`}>
      <style href="ui-role-change" precedence="default">
        {css}
      </style>

      {/* Project card: the plan */}
      <div className="ui-at-rc__project">
        <div className="ui-at-rc__head">
          <span className="ui-at-rc__ring" aria-hidden="true">
            <svg viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" className="ui-at-rc__ring-bg" />
              <circle cx="18" cy="18" r="15" className="ui-at-rc__ring-fg"
                style={{ strokeDasharray: ring, strokeDashoffset: ring * (1 - progress) }} />
            </svg>
            <span>{done}</span>
          </span>
          <div className="ui-at-rc__titles">
            <h3 id={`${uid}-t`} className="ui-at-rc__title">{title}</h3>
            <p className="ui-at-rc__sub">
              <span className="ui-at-rc__chip" data-tone={chip.tone}>{chip.text}</span>
              {target ? (
                <span className="ui-at-rc__target">
                  <IconDb />
                  {target}
                </span>
              ) : null}
            </p>
          </div>
          {requestedBy ? (
            <span className="ui-at-rc__avatar" title={`Demandé par ${requestedBy}`} aria-label={`Demandé par ${requestedBy}`}>
              {initials(requestedBy)}
            </span>
          ) : null}
        </div>

        <ol className="ui-at-rc__plan" aria-label="Étapes du changement">
          {steps.map((s, i) => {
            const state = i < done ? "done" : i === done && status === "applying" ? "active" : "todo";
            return (
              <li key={s.id} className="ui-at-rc__step" data-state={state}>
                <span className="ui-at-rc__marker" aria-hidden="true">
                  {state === "done" ? <IconCheck /> : state === "active" ? <Spinner /> : i + 1}
                </span>
                <span className="ui-at-rc__step-text">
                  <span className="ui-at-rc__step-label">{s.label}</span>
                  {s.detail ? <span className="ui-at-rc__step-detail">{s.detail}</span> : null}
                </span>
                <span className="ui-at-rc__sr">{state === "done" ? "fait" : state === "active" ? "en cours" : "à faire"}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* The change itself */}
      <div className="ui-at-rc__panel">
        <div className="ui-at-rc__summary">
          <span className="ui-at-rc__kicker">Changement en base</span>
          <span className="ui-at-rc__counts">
            {counts.added ? <span data-tone="ok">+{counts.added} accès</span> : null}
            {counts.moved ? <span data-tone="info">{counts.moved} rôle{counts.moved > 1 ? "s" : ""} modifié{counts.moved > 1 ? "s" : ""}</span> : null}
            {counts.removed ? <span data-tone="bad">−{counts.removed} accès</span> : null}
          </span>
        </div>

        {rows.length ? (
          <div className="ui-at-rc__scroll">
            <table className="ui-at-rc__table">
              <thead>
                <tr>
                  <th scope="col">Personne</th>
                  <th scope="col">Rôle avant</th>
                  <th scope="col" aria-label="devient" />
                  <th scope="col">Rôle après</th>
                  <th scope="col" className="ui-at-rc__th-state">État</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const k = kindOf(r);
                  const ok = confirmed.has(r.id) || (status === "applied" && k !== "same");
                  return (
                    <tr key={r.id} data-kind={k} data-ok={ok || undefined} style={{ animationDelay: `${i * 60}ms` }}>
                      <td>
                        <span className="ui-at-rc__person">
                          <span className="ui-at-rc__pebble" aria-hidden="true">{initials(r.name)}</span>
                          <span className="ui-at-rc__who">
                            <span className="ui-at-rc__name">{r.name}</span>
                            {r.email ? <span className="ui-at-rc__email">{r.email}</span> : null}
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className="ui-at-rc__role" data-old={k !== "same" || undefined}>{r.before}</span>
                      </td>
                      <td className="ui-at-rc__arrow" aria-hidden="true">
                        <IconArrow />
                      </td>
                      <td>
                        <span className="ui-at-rc__role" data-new={k !== "same" ? k : undefined}>{r.after}</span>
                      </td>
                      <td className="ui-at-rc__state">
                        {ok ? (
                          <span className="ui-at-rc__done">
                            <IconCheck />
                            Fait
                          </span>
                        ) : (
                          <span className="ui-at-rc__kind" data-kind={k}>{KIND_LABEL[k]}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="ui-at-rc__empty">Aucun changement à appliquer.</p>
        )}

        {error ? (
          <p className="ui-at-rc__error" role="alert">
            {error}. Rien n'a été modifié.
          </p>
        ) : null}
      </div>

      {/* Decision, in the frame */}
      <div className="ui-at-rc__foot">
        {status === "applied" ? (
          <>
            <p className="ui-at-rc__result" tabIndex={-1} ref={resultRef}>
              <span className="ui-at-rc__result-mark" aria-hidden="true"><IconCheck /></span>
              {changes.length} rôle{changes.length > 1 ? "s" : ""} changé{changes.length > 1 ? "s" : ""}
              {left > 0 ? <span className="ui-at-rc__left"> · annulable {left} s</span> : null}
            </p>
            {left > 0 ? (
              <button type="button" className="ui-at-rc__btn" onClick={undo}>
                <IconUndo />
                Annuler
              </button>
            ) : null}
          </>
        ) : status === "cancelled" || status === "undone" ? (
          <>
            <p className="ui-at-rc__result ui-at-rc__result--muted">
              {status === "cancelled" ? "Changement abandonné, rien n'a été modifié." : "Changement annulé, les rôles d'avant sont revenus."}
            </p>
            <button type="button" className="ui-at-rc__btn" onClick={restart}>Revoir le changement</button>
          </>
        ) : (
          <>
            <span className="ui-at-rc__hint">
              {status === "applying" ? "Écriture en base…" : `${changes.length} personne${changes.length > 1 ? "s" : ""} concernée${changes.length > 1 ? "s" : ""}`}
            </span>
            <div className="ui-at-rc__actions">
              <button type="button" className="ui-at-rc__btn ui-at-rc__btn--ghost" onClick={cancel} disabled={status === "applying"}>
                Abandonner
              </button>
              <button
                ref={applyBtn}
                type="button"
                className="ui-at-rc__btn ui-at-rc__btn--main"
                onClick={apply}
                disabled={status === "applying" || !changes.length}
                aria-busy={status === "applying"}
              >
                {status === "applying" ? <Spinner /> : null}
                {status === "applying" ? "Application…" : error ? "Réessayer" : "Appliquer le changement"}
              </button>
            </div>
          </>
        )}
      </div>
      <p className="ui-at-rc__sr" role="status" aria-live="polite">{announce}</p>
    </section>
  );
}

/* ---------- styles ---------- */

const css = /* css */ `
.ui-at-rc {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --secondary: #fbfcfe;
  --pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 680px;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: var(--text);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-rc {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --secondary: rgba(255, 255, 255, 0.06);
  --pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-rc *, .ui-at-rc *::before, .ui-at-rc *::after { box-sizing: border-box; }
.ui-at-rc button { font: inherit; }
.ui-at-rc :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-rc__sr { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* Project card */
.ui-at-rc__project {
  background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised);
  padding: 16px 16px 12px;
}
.ui-at-rc__head { display: flex; align-items: center; gap: 12px; }
.ui-at-rc__ring { position: relative; flex: none; width: 40px; height: 40px; display: grid; place-items: center; }
.ui-at-rc__ring svg { position: absolute; inset: 0; transform: rotate(-90deg); }
.ui-at-rc__ring circle { fill: none; stroke-width: 3; }
.ui-at-rc__ring-bg { stroke: var(--soft); }
.ui-at-rc__ring-fg { stroke: var(--berry); stroke-linecap: round; transition: stroke-dashoffset 450ms var(--ease); }
.ui-at-rc__ring > span { font-size: 13px; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; }
.ui-at-rc__titles { min-width: 0; flex: 1; }
.ui-at-rc__title {
  margin: 0; color: var(--ink); font-weight: 700; font-size: 18px; line-height: 1.25;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif; overflow-wrap: anywhere;
}
.ui-at-rc__sub { margin: 4px 0 0; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 12.5px; color: var(--muted); }
.ui-at-rc__chip {
  display: inline-flex; align-items: center; height: 22px; padding: 0 9px; border-radius: 999px; border: 1px solid;
  font-weight: 600; transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-rc__chip[data-tone="wait"] { background: var(--wait-fill); color: var(--wait-ink); border-color: var(--wait-line); }
.ui-at-rc__chip[data-tone="info"] { background: var(--info-fill); color: var(--info-ink); border-color: var(--info-line); }
.ui-at-rc__chip[data-tone="ok"] { background: var(--ok-fill); color: var(--ok-ink); border-color: var(--ok-line); }
.ui-at-rc__chip[data-tone="bad"] { background: var(--bad-fill); color: var(--bad-ink); border-color: var(--bad-line); }
.ui-at-rc__chip[data-tone="muted"] { background: var(--soft); color: var(--muted); border-color: var(--line); }
.ui-at-rc__target { display: inline-flex; align-items: center; gap: 5px; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px; }
.ui-at-rc__avatar {
  flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 999px;
  background: var(--info-fill); border: 1px solid var(--info-line); color: var(--info-ink); font-size: 11.5px; font-weight: 700;
}

.ui-at-rc__plan { list-style: none; margin: 14px 0 0; padding: 12px 0 0; border-top: 1px solid var(--line); display: grid; gap: 2px; }
.ui-at-rc__step { position: relative; display: flex; align-items: flex-start; gap: 10px; padding: 5px 6px; border-radius: 10px; }
.ui-at-rc__step:not(:last-child)::after {
  content: ""; position: absolute; left: 16px; top: 28px; bottom: -6px; width: 1px; background: var(--line);
}
.ui-at-rc__step[data-state="done"]:not(:last-child)::after { background: var(--berry); opacity: .45; }
.ui-at-rc__step[data-state="active"] { background: var(--info-fill); box-shadow: inset 2px 0 0 var(--berry); }
.ui-at-rc__marker {
  position: relative; z-index: 1; flex: none; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 999px;
  background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--pebble);
  font-size: 11px; font-weight: 700; color: var(--muted); font-variant-numeric: tabular-nums;
  transition: background-color 300ms var(--ease), border-color 300ms var(--ease), color 300ms var(--ease);
}
.ui-at-rc__step[data-state="done"] .ui-at-rc__marker { background: var(--berry); border-color: var(--berry); color: #fff; box-shadow: none; animation: ui-at-rc-pop 300ms var(--ease); }
.ui-at-rc__step[data-state="active"] .ui-at-rc__marker { color: var(--info-ink); border-color: var(--info-line); }
.ui-at-rc__step-text { display: grid; min-width: 0; padding-top: 1px; }
.ui-at-rc__step-label { color: var(--ink); font-weight: 600; font-size: 13.5px; }
.ui-at-rc__step[data-state="todo"] .ui-at-rc__step-label { color: var(--text); font-weight: 500; }
.ui-at-rc__step-detail { font-size: 12px; color: var(--muted); }
.ui-at-rc__spin { animation: ui-at-rc-spin 900ms linear infinite; }

/* The change */
.ui-at-rc__panel {
  margin-top: 6px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised);
  overflow: hidden;
}
.ui-at-rc__summary { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding: 12px 16px 10px; }
.ui-at-rc__kicker { font-size: 10.5px; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; color: var(--muted); }
.ui-at-rc__counts { display: inline-flex; flex-wrap: wrap; gap: 6px; }
.ui-at-rc__counts > span { height: 22px; display: inline-flex; align-items: center; padding: 0 8px; border-radius: 999px; border: 1px solid; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-at-rc__counts [data-tone="ok"] { background: var(--ok-fill); color: var(--ok-ink); border-color: var(--ok-line); }
.ui-at-rc__counts [data-tone="info"] { background: var(--info-fill); color: var(--info-ink); border-color: var(--info-line); }
.ui-at-rc__counts [data-tone="bad"] { background: var(--bad-fill); color: var(--bad-ink); border-color: var(--bad-line); }

.ui-at-rc__scroll { overflow-x: auto; scrollbar-width: thin; }
.ui-at-rc__table { width: 100%; min-width: 520px; border-collapse: collapse; font-size: 13.5px; }
.ui-at-rc__table th {
  height: 34px; padding: 0 12px; text-align: left; font-weight: 600; font-size: 11.5px; color: var(--muted);
  border-top: 1px solid var(--line); background: var(--soft);
}
.ui-at-rc__table td { height: 52px; padding: 0 12px; border-top: 1px solid var(--line); vertical-align: middle; }
.ui-at-rc__table tbody tr { animation: ui-at-rc-rise 300ms var(--ease) both; transition: background-color 300ms var(--ease); }
.ui-at-rc__table tbody tr[data-kind="same"] { opacity: .62; }
.ui-at-rc__table tbody tr[data-ok] { background: color-mix(in srgb, var(--ok-fill) 55%, transparent); }
.ui-at-rc__th-state { text-align: right !important; }
.ui-at-rc__person { display: flex; align-items: center; gap: 10px; min-width: 0; }
.ui-at-rc__pebble {
  flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 9px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--pebble);
  font-size: 11px; font-weight: 700; color: var(--info-ink);
}
.ui-at-rc__who { display: grid; min-width: 0; }
.ui-at-rc__name { color: var(--ink); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-rc__email { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-rc__role {
  display: inline-flex; align-items: center; height: 24px; padding: 0 9px; border-radius: 8px; white-space: nowrap;
  background: var(--soft); border: 1px solid var(--line); color: var(--text); font-weight: 500;
}
.ui-at-rc__role[data-old] { text-decoration: line-through; text-decoration-color: var(--bad-ink); color: var(--muted); }
.ui-at-rc__role[data-new] { font-weight: 600; }
.ui-at-rc__role[data-new="added"], .ui-at-rc__role[data-new="up"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-at-rc__role[data-new="down"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-rc__role[data-new="removed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-rc__arrow { width: 28px; padding: 0 !important; color: var(--muted); }
.ui-at-rc__state { text-align: right; white-space: nowrap; }
.ui-at-rc__kind { font-size: 12px; color: var(--muted); }
.ui-at-rc__kind[data-kind="added"], .ui-at-rc__kind[data-kind="up"] { color: var(--ok-ink); }
.ui-at-rc__kind[data-kind="removed"] { color: var(--bad-ink); }
.ui-at-rc__kind[data-kind="down"] { color: var(--wait-ink); }
.ui-at-rc__done {
  display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 999px;
  background: var(--ok-fill); border: 1px solid var(--ok-line); color: var(--ok-ink); font-size: 12px; font-weight: 600;
  animation: ui-at-rc-pop 300ms var(--ease);
}
.ui-at-rc__empty { margin: 0; padding: 18px 16px 20px; color: var(--muted); border-top: 1px solid var(--line); }
.ui-at-rc__error {
  margin: 0; padding: 10px 16px; border-top: 1px solid var(--bad-line); background: var(--bad-fill); color: var(--bad-ink);
  font-size: 13px; font-weight: 600;
}

/* Footer, in the frame */
.ui-at-rc__foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; min-height: 52px; padding: 8px 6px 2px 12px; }
.ui-at-rc__hint { font-size: 13px; color: var(--muted); }
.ui-at-rc__actions { display: flex; gap: 8px; margin-left: auto; }
.ui-at-rc__btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 36px; padding: 0 14px;
  border-radius: 10px; border: 1px solid var(--line-firm); background: var(--secondary); box-shadow: var(--drop);
  color: var(--ink); font-size: 13.5px; font-weight: 600; cursor: pointer; white-space: nowrap;
  transition: background-color 150ms var(--ease), transform 150ms var(--ease), opacity 150ms var(--ease);
}
.ui-at-rc__btn:hover:not(:disabled) { background: var(--soft); }
.ui-at-rc__btn:active:not(:disabled) { transform: translateY(1px); }
.ui-at-rc__btn:disabled { opacity: .55; cursor: default; }
.ui-at-rc__btn--ghost { background: transparent; border-color: transparent; box-shadow: none; color: var(--text); }
.ui-at-rc .ui-at-rc__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-rc .ui-at-rc__btn--main:hover:not(:disabled) { background: var(--berry-hover); border-color: var(--berry-hover); }
.ui-at-rc__result { margin: 0; display: inline-flex; align-items: center; gap: 8px; color: var(--ink); font-weight: 600; outline: none; }
.ui-at-rc__result:focus-visible { box-shadow: none; }
.ui-at-rc__result--muted { color: var(--text); font-weight: 500; }
.ui-at-rc__result-mark {
  display: grid; place-items: center; width: 22px; height: 22px; border-radius: 999px;
  background: var(--ok-fill); border: 1px solid var(--ok-line); color: var(--ok-ink); animation: ui-at-rc-pop 300ms var(--ease);
}
.ui-at-rc__left { color: var(--muted); font-weight: 500; font-variant-numeric: tabular-nums; }

@keyframes ui-at-rc-spin { to { transform: rotate(360deg); } }
@keyframes ui-at-rc-pop { from { transform: scale(.6); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-rc-rise { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

@media (max-width: 560px) {
  .ui-at-rc__table { min-width: 0; }
  .ui-at-rc__table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .ui-at-rc__table tbody tr {
    display: grid; grid-template-columns: auto auto 1fr; align-items: center; gap: 8px 8px;
    padding: 12px 14px; border-top: 1px solid var(--line);
  }
  .ui-at-rc__table td { height: auto; padding: 0; border: 0; }
  .ui-at-rc__table td:first-child { grid-column: 1 / -1; }
  .ui-at-rc__state { grid-column: 1 / -1; text-align: left; }
}
@media (max-width: 480px) {
  .ui-at-rc__project { padding: 14px 12px 10px; }
  .ui-at-rc__actions { width: 100%; }
  .ui-at-rc__actions .ui-at-rc__btn--main { flex: 1; }
}
@media (pointer: coarse) {
  .ui-at-rc__btn { height: 44px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-rc *, .ui-at-rc *::before, .ui-at-rc *::after { animation: none !important; transition-duration: 0ms !important; }
}
`;
