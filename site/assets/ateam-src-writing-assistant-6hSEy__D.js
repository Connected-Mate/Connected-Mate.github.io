var e=`"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

export type WritingAssistantProps = {
  name?: string;
  tagline?: string;
  greeting?: string;
  suggestions?: string[];
  placeholder?: string;
  /** Your answer for a message; a sample writer is used by default */
  respond?: (message: string) => string | Promise<string>;
  /** auto uses the browser's speech recognition when available, simulate always plays a sample take */
  speech?: "auto" | "simulate";
  /** Sentence used for simulated dictation */
  dictation?: string;
  className?: string;
};

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  /** Words shown so far while a reply streams in */
  shown?: number;
  error?: boolean;
  /** The message this reply answers, to try again */
  prompt?: string;
};

const DEFAULT_SUGGESTIONS = ["Polish my email", "Make it shorter", "Fix the tone", "Draft a reply"];

function sampleWriter(message: string) {
  const m = message.toLowerCase();
  if (/short|tight|trim|brief/.test(m))
    return "Here's a tighter version: “Thanks for the quick turnaround – the new draft reads much better. Let's ship it Friday.”";
  if (/polish|email|mail/.test(m))
    return "Polished: “Hi Sam, thanks for sending the draft over. I've added two comments on pricing – could you take a look before Thursday? Happy to jump on a call if that's easier.”";
  if (/tone|friend|warm|polite/.test(m))
    return "Warmer tone: “Thanks so much for pulling this together – it's really close. Could we tweak the intro so it sounds a little more like us?”";
  if (/reply|answer|respond/.test(m))
    return "Draft reply: “Thanks for the update! Thursday works for us. I'll share the final slides by Wednesday evening so you have time to review.”";
  return \`Here's a first draft: “\${message.trim().replace(/[.!?]*$/, "")} – I've kept it short and clear so it's easy to send as is.” Want it more formal or more casual?\`;
}

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function getRecognition(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/* ---------- icons ---------- */

const IconMic = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
  </svg>
);
const IconUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/* ---------- component ---------- */

export function WritingAssistant({
  name = "Quill",
  tagline = "Your writing companion.",
  greeting = "What should we write?",
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = "Ask anything…",
  respond = sampleWriter,
  speech = "auto",
  dictation = "Make my note to the client sound a bit friendlier",
  className,
}: WritingAssistantProps) {
  const uid = useId();
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [announce, setAnnounce] = useState("");

  const nextId = useRef(1);
  const session = useRef(0);
  const timers = useRef<number[]>([]);
  const recRef = useRef<Recognition | null>(null);
  const heard = useRef("");
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(
    () => () => {
      clearTimers();
      recRef.current?.abort();
    },
    [],
  );

  /* field grows up to four lines, then scrolls */
  useLayoutEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    el.style.height = "auto";
    const line = parseFloat(getComputedStyle(el).lineHeight) || 22;
    el.style.height = \`\${Math.min(el.scrollHeight, line * 4 + 2)}px\`;
  }, [text]);

  /* keep the newest message in view */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, reduced]);

  const stream = useCallback(
    (id: number, reply: string, mine: number) => {
      const total = reply.split(/(?<=\\s)/).length;
      if (reduced) {
        setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, text: reply, shown: total } : m)));
        setBusy(false);
        setAnnounce(reply);
        return;
      }
      setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, text: reply, shown: 0 } : m)));
      let n = 0;
      const tick = () => {
        if (session.current !== mine) return;
        n += 1;
        setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, shown: n } : m)));
        if (n < total) timers.current.push(window.setTimeout(tick, 45));
        else {
          setBusy(false);
          setAnnounce(reply);
        }
      };
      timers.current.push(window.setTimeout(tick, 45));
    },
    [reduced],
  );

  const ask = useCallback(
    async (message: string, replyId?: number) => {
      const mine = session.current;
      const id = replyId ?? nextId.current++;
      setBusy(true);
      if (replyId === undefined) {
        setMessages((ms) => [
          ...ms,
          { id: nextId.current++, role: "user", text: message },
          { id, role: "assistant", text: "", prompt: message },
        ]);
      } else {
        setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, text: "", error: false, shown: undefined } : m)));
      }
      setAnnounce(\`\${name} is writing\`);
      try {
        const reply = await respond(message);
        if (session.current !== mine) return;
        stream(id, String(reply ?? ""), mine);
      } catch {
        if (session.current !== mine) return;
        setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, error: true } : m)));
        setBusy(false);
        setAnnounce("Couldn't write a reply. Try again");
      }
    },
    [name, respond, stream],
  );

  const send = (raw = text) => {
    const message = raw.trim();
    if (!message || busy) return;
    setText("");
    void ask(message);
  };

  const newChat = () => {
    session.current += 1;
    clearTimers();
    recRef.current?.abort();
    setListening(false);
    setMessages([]);
    setBusy(false);
    setText("");
    setAnnounce("New chat");
    fieldRef.current?.focus();
  };

  /* ---------- dictation ---------- */

  const finishListening = (finalText: string) => {
    setListening(false);
    recRef.current = null;
    const said = finalText.trim();
    if (said) {
      setText("");
      void ask(said);
    } else setAnnounce("Didn't catch that");
  };

  const simulate = () => {
    const words = dictation.split(/\\s+/).filter(Boolean);
    const mine = session.current;
    let i = 0;
    setText("");
    const tick = () => {
      if (session.current !== mine) return;
      i += 1;
      const now = words.slice(0, i).join(" ");
      setText(now);
      if (i < words.length) timers.current.push(window.setTimeout(tick, 190));
      else timers.current.push(window.setTimeout(() => session.current === mine && finishListening(now), 650));
    };
    timers.current.push(window.setTimeout(tick, 450));
  };

  const startListening = () => {
    if (busy) return;
    setListening(true);
    setAnnounce("Listening");
    const Rec = speech === "auto" ? getRecognition() : null;
    if (!Rec) {
      simulate();
      return;
    }
    try {
      const rec = new Rec();
      rec.lang = document.documentElement.lang || navigator.language || "en-US";
      rec.interimResults = true;
      rec.continuous = false;
      heard.current = "";
      rec.onresult = (e) => {
        let all = "";
        for (let i = 0; i < e.results.length; i++) all += e.results[i][0].transcript;
        heard.current = all;
        setText(all);
      };
      rec.onerror = (e) => {
        recRef.current = null;
        setListening(false);
        setAnnounce(
          e.error === "not-allowed" || e.error === "service-not-allowed"
            ? "Microphone blocked – you can type instead"
            : "Couldn't hear you – try again or type",
        );
      };
      rec.onend = () => {
        if (recRef.current === rec) finishListening(heard.current);
      };
      recRef.current = rec;
      rec.start();
    } catch {
      simulate();
    }
  };

  const stopListening = () => {
    if (recRef.current) recRef.current.stop();
    else {
      // simulated take: send what was heard so far
      session.current += 1;
      clearTimers();
      finishListening(text);
    }
  };

  const started = messages.length > 0;

  return (
    <section className={["ui-at-wa", className].filter(Boolean).join(" ")} aria-label={\`\${name} – writing assistant\`}>
      <style href="ui-writing-assistant" precedence="default">
        {css}
      </style>
      <header className="ui-at-wa__head">
        <div className="ui-at-wa__titles">
          <h3 className="ui-at-wa__name">{name}</h3>
          <p className="ui-at-wa__tagline">{tagline}</p>
        </div>
        {started && (
          <button type="button" className="ui-at-wa__new" onClick={newChat} aria-label="New chat" title="New chat">
            <IconPlus />
          </button>
        )}
      </header>

      <div className="ui-at-wa__stage">
        <div className="ui-at-wa__glow" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        {!started ? (
          <div className="ui-at-wa__welcome" key="welcome">
            <p className="ui-at-wa__greeting">{greeting}</p>
            {suggestions.length > 0 && (
              <div className="ui-at-wa__chips" role="group" aria-label="Suggestions">
                {suggestions.map((s) => (
                  <button key={s} type="button" className="ui-at-wa__chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="ui-at-wa__log" ref={logRef} role="log" aria-label="Conversation" key="log">
            {messages.map((m) => {
              if (m.role === "user") {
                return (
                  <p key={m.id} className="ui-at-wa__msg" data-role="user">
                    {m.text}
                  </p>
                );
              }
              if (m.error) {
                return (
                  <div key={m.id} className="ui-at-wa__msg" data-role="assistant" data-error="">
                    <span>Couldn't write that one.</span>
                    <button type="button" onClick={() => m.prompt && void ask(m.prompt, m.id)} disabled={busy}>
                      Try again
                    </button>
                  </div>
                );
              }
              if (m.shown === undefined) {
                return (
                  <p key={m.id} className="ui-at-wa__msg ui-at-wa__typing" data-role="assistant" role="img" aria-label={\`\${name} is writing\`}>
                    <span />
                    <span />
                    <span />
                  </p>
                );
              }
              const words = m.text.split(/(?<=\\s)/);
              return (
                <p key={m.id} className="ui-at-wa__msg" data-role="assistant">
                  {words.slice(0, m.shown).map((w, i) => (
                    <span key={i} className="ui-at-wa__w">
                      {w}
                    </span>
                  ))}
                </p>
              );
            })}
          </div>
        )}

        <form
          className="ui-at-wa__prompt"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <div className="ui-at-wa__field" data-listening={listening || undefined}>
            <textarea
              ref={fieldRef}
              id={\`\${uid}-field\`}
              rows={1}
              value={text}
              placeholder={listening ? "Listening…" : placeholder}
              aria-label="Message"
              readOnly={listening}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            {text.trim() && !listening && (
              <button type="submit" className="ui-at-wa__send" aria-label="Send" disabled={busy}>
                <IconUp />
              </button>
            )}
          </div>
          <button
            type="button"
            className="ui-at-wa__mic"
            aria-pressed={listening}
            aria-label={listening ? "Stop dictation and send" : "Start dictation"}
            disabled={busy && !listening}
            onClick={() => (listening ? stopListening() : startListening())}
          >
            {listening ? (
              <span className="ui-at-wa__bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            ) : (
              <IconMic />
            )}
          </button>
        </form>
      </div>
      <div className="ui-at-wa__sr" role="status" aria-live="polite">
        {announce}
      </div>
    </section>
  );
}

const css = /* css */ \`
.ui-at-wa {
  --on-berry: #ffffff;
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --stage: #fbfcfe;
  --glow-a: rgba(133, 20, 55, 0.26); --glow-b: rgba(143, 189, 242, 0.5); --glow-c: rgba(133, 20, 55, 0.14);
  --user-fill: #1a3e70; --user-ink: #ffffff;
  --mic-on: #00162b; --mic-on-ink: #ffffff;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --field-shade: inset 0 1px 3px rgba(26, 62, 112, 0.08);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 380px;
  min-width: 0;
  height: 460px;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--text);
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-wa {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --stage: #12305a;
  --glow-a: rgba(168, 32, 77, 0.4); --glow-b: rgba(143, 189, 242, 0.24); --glow-c: rgba(168, 32, 77, 0.22);
  --user-fill: #c1daff; --user-ink: #00162b;
  --mic-on: #f2f6fa; --mic-on-ink: #00162b;
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --field-shade: inset 0 1px 3px rgba(3, 12, 28, 0.3);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 12px -6px rgba(3, 12, 28, 0.8);
}
.ui-at-wa *, .ui-at-wa *::before, .ui-at-wa *::after { box-sizing: border-box; }
.ui-at-wa button { font: inherit; color: inherit; }
.ui-at-wa :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-wa__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 12px 14px 12px 18px; }
.ui-at-wa__titles { min-width: 0; }
.ui-at-wa__name {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--ink);
}
.ui-at-wa__tagline { margin: 1px 0 0; font-size: 13px; color: var(--muted); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-wa__new {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid var(--line-firm);
  background: var(--panel);
  box-shadow: var(--pebble-shade), var(--drop);
  color: var(--ink);
  cursor: pointer;
  animation: ui-at-wa-pop 300ms var(--ease) both;
  transition: border-color 150ms var(--ease);
}
.ui-at-wa__new:hover { border-color: var(--info-line); }

.ui-at-wa__stage {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: var(--stage);
  border: 1px solid var(--line);
  box-shadow: var(--raised);
  isolation: isolate;
}
.ui-at-wa__glow { position: absolute; inset: 40% -20% -30%; z-index: -1; filter: blur(34px); pointer-events: none; }
.ui-at-wa__glow span { position: absolute; border-radius: 50%; animation: ui-at-wa-drift 14s ease-in-out infinite alternate; }
.ui-at-wa__glow span:nth-child(1) { left: 10%; top: 10%; width: 62%; height: 70%; background: var(--glow-a); }
.ui-at-wa__glow span:nth-child(2) { right: 4%; top: 30%; width: 55%; height: 70%; background: var(--glow-b); animation-duration: 17s; animation-delay: -5s; }
.ui-at-wa__glow span:nth-child(3) { left: 32%; bottom: 0; width: 46%; height: 50%; background: var(--glow-c); animation-duration: 11s; animation-delay: -8s; }

.ui-at-wa__welcome { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 12px; padding: 18px 16px 12px; animation: ui-at-wa-rise 420ms var(--ease) both; }
.ui-at-wa__greeting { margin: 0; font-size: 23px; font-weight: 600; line-height: 1.25; letter-spacing: -0.005em; color: var(--ink); overflow-wrap: anywhere; }
.ui-at-wa__chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ui-at-wa__chip {
  padding: 6px 13px;
  border-radius: 999px;
  border: 1px solid var(--line-firm);
  background: var(--panel);
  box-shadow: var(--drop);
  font-size: 13px;
  color: var(--ink);
  cursor: pointer;
  transition: border-color 150ms var(--ease), transform 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-wa__chip:hover { border-color: var(--info-line); transform: translateY(-1px); }

.ui-at-wa__log {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 14px 10px;
  scrollbar-width: thin;
  -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 18px);
  mask-image: linear-gradient(180deg, transparent 0, #000 18px);
  animation: ui-at-wa-rise 420ms var(--ease) both;
}
.ui-at-wa__log > :first-child { margin-top: auto; }
.ui-at-wa__msg {
  max-width: 86%;
  margin: 0;
  padding: 9px 13px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.45;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  animation: ui-at-wa-rise 300ms var(--ease) both;
}
.ui-at-wa__msg[data-role="user"] { align-self: flex-end; border-bottom-right-radius: 5px; background: var(--user-fill); color: var(--user-ink); }
.ui-at-wa__msg[data-role="assistant"] {
  align-self: flex-start;
  border-bottom-left-radius: 5px;
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--drop);
  color: var(--ink);
}
.ui-at-wa__msg[data-error] { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-wa__msg[data-error] button {
  padding: 2px 10px;
  border-radius: 8px;
  border: 1px solid var(--bad-line);
  background: var(--panel);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--bad-ink);
  cursor: pointer;
}
.ui-at-wa__w { animation: ui-at-wa-word 300ms var(--ease) both; }
.ui-at-wa__typing { display: inline-flex; gap: 4px; padding: 13px 14px; }
.ui-at-wa__typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: ui-at-wa-dot 1.1s ease-in-out infinite; }
.ui-at-wa__typing span:nth-child(2) { animation-delay: 150ms; }
.ui-at-wa__typing span:nth-child(3) { animation-delay: 300ms; }

.ui-at-wa__prompt { display: flex; align-items: flex-end; gap: 8px; padding: 10px 12px 12px; }
.ui-at-wa__field {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  min-height: 50px;
  padding: 6px 6px 6px 18px;
  border-radius: 25px;
  background: var(--panel);
  border: 1px solid var(--line-firm);
  box-shadow: var(--field-shade), var(--drop);
  transition: border-color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-wa__field:focus-within { border-color: var(--info-line); box-shadow: var(--field-shade), 0 0 0 3px var(--ring); }
.ui-at-wa__field[data-listening] { border-color: var(--info-line); }
.ui-at-wa__field textarea {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 7px 0;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  font: inherit;
  font-size: 15px;
  line-height: 22px;
  color: var(--ink);
  caret-color: var(--berry);
  overflow-y: auto;
}
.ui-at-wa__field textarea:focus-visible { box-shadow: none; }
.ui-at-wa__field textarea::placeholder { color: var(--muted); }
.ui-at-wa__send {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: var(--berry);
  color: var(--on-berry) !important;
  box-shadow: var(--berry-shadow);
  cursor: pointer;
  animation: ui-at-wa-pop 200ms var(--ease) both;
  transition: background-color 150ms var(--ease);
}
.ui-at-wa__send:hover:not(:disabled) { background: var(--berry-hover); }
.ui-at-wa__send:disabled { opacity: 0.5; cursor: default; }
.ui-at-wa__mic {
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid var(--line-firm);
  background: var(--panel);
  box-shadow: var(--pebble-shade), var(--drop);
  color: var(--ink);
  cursor: pointer;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-wa__mic:hover:not(:disabled) { border-color: var(--info-line); }
.ui-at-wa__mic:disabled { opacity: 0.5; cursor: default; }
.ui-at-wa__mic[aria-pressed="true"] { background: var(--mic-on); border-color: var(--mic-on); color: var(--mic-on-ink); }
.ui-at-wa__mic[aria-pressed="true"]::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  border: 2px solid var(--mic-on);
  animation: ui-at-wa-breathe 1.8s var(--ease) infinite;
  pointer-events: none;
}
.ui-at-wa__bars { display: inline-flex; align-items: center; gap: 3px; height: 18px; }
.ui-at-wa__bars span { width: 3px; height: 8px; border-radius: 2px; background: currentColor; animation: ui-at-wa-bar 900ms ease-in-out infinite; }
.ui-at-wa__bars span:nth-child(2) { animation-delay: 150ms; }
.ui-at-wa__bars span:nth-child(3) { animation-delay: 300ms; }
.ui-at-wa__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@keyframes ui-at-wa-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-wa-pop { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: none; } }
@keyframes ui-at-wa-word { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-wa-dot { 0%, 100% { opacity: 0.3; transform: none; } 40% { opacity: 1; transform: translateY(-2px); } }
@keyframes ui-at-wa-drift {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(8%, -6%) scale(1.08); }
  100% { transform: translate(-6%, 4%) scale(0.95); }
}
@keyframes ui-at-wa-breathe { from { transform: scale(1); opacity: 0.55; } to { transform: scale(1.45); opacity: 0; } }
@keyframes ui-at-wa-bar { 0%, 100% { height: 6px; } 50% { height: 16px; } }

@media (max-width: 360px) {
  .ui-at-wa__greeting { font-size: 21px; }
  .ui-at-wa__mic { width: 46px; height: 46px; }
  .ui-at-wa__field { min-height: 46px; padding-left: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-wa *, .ui-at-wa *::before, .ui-at-wa *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
  }
  .ui-at-wa__mic[aria-pressed="true"]::after { display: none; }
}
\`;
`;export{e as default};
