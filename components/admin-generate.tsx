'use client';

import { useState, useMemo } from 'react';
import {
  ISpark,
  ICheck,
  IX,
  IClock,
  IArrow,
  IEdit,
} from './icons';

const TOPIC_CATALOG = {
  Math: [
    {
      group: 'Algebra',
      items: [
        { id: 'lin-eq', label: 'Linear equations', weak: true },
        { id: 'systems', label: 'Systems of equations', weak: false },
        { id: 'inequal', label: 'Inequalities', weak: false },
      ],
    },
    {
      group: 'Advanced math',
      items: [
        { id: 'quad', label: 'Quadratics', weak: false },
        { id: 'exp', label: 'Exponentials', weak: false },
        { id: 'poly', label: 'Polynomials', weak: false },
      ],
    },
    {
      group: 'Problem-solving & data',
      items: [
        { id: 'ratios', label: 'Ratios & rates', weak: true },
        { id: 'percent', label: 'Percentages', weak: false },
        { id: 'stats', label: 'Statistics', weak: false },
      ],
    },
    {
      group: 'Geometry & trig',
      items: [
        { id: 'circles', label: 'Circle theorems', weak: true },
        { id: 'triangle', label: 'Triangle properties', weak: false },
        { id: 'trig', label: 'Trigonometry', weak: false },
      ],
    },
  ],
  'R&W': [
    {
      group: 'Information & ideas',
      items: [
        { id: 'central', label: 'Central idea', weak: false },
        { id: 'evidence', label: 'Command of evidence', weak: false },
        { id: 'data-inf', label: 'Data inferences', weak: true },
      ],
    },
    {
      group: 'Craft & structure',
      items: [
        { id: 'word-ctx', label: 'Word in context', weak: false },
        { id: 'text-str', label: 'Text structure', weak: false },
      ],
    },
    {
      group: 'Expression of ideas',
      items: [
        { id: 'trans', label: 'Transitions', weak: true },
        { id: 'rhet-syn', label: 'Rhetorical synthesis', weak: false },
      ],
    },
    {
      group: 'Standard English',
      items: [
        { id: 'bound', label: 'Boundaries (punctuation)', weak: false },
        { id: 'agreement', label: 'Subject-verb agreement', weak: false },
      ],
    },
  ],
};

interface AdminGenerateProps {
  onNavigate: (screen: string) => void;
}

export function AdminGenerate({ onNavigate }: AdminGenerateProps) {
  const [subject, setSubject] = useState<'Math' | 'R&W'>('R&W');
  const [selected, setSelected] = useState(['trans', 'data-inf']);
  const [count, setCount] = useState(5);
  const [mix, setMix] = useState({ Easy: 20, Medium: 60, Hard: 20 });
  const [style, setStyle] = useState(
    'Match the official Bluebook tone. Vietnamese cultural context welcome but not required.'
  );
  const [generated, setGenerated] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const topics = TOPIC_CATALOG[subject];
  const allInSubject = topics.flatMap((g) => g.items.map((i) => i.id));

  function changeSubject(s: 'Math' | 'R&W') {
    setSubject(s);
    const allowed = TOPIC_CATALOG[s].flatMap((g) => g.items.map((i) => i.id));
    setSelected((prev) => prev.filter((id) => allowed.includes(id)));
  }

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const breakdown = useMemo(() => {
    if (selected.length === 0) return [];
    const base = Math.floor(count / selected.length);
    let rem = count - base * selected.length;
    return selected
      .map((id) => {
        const item = topics.flatMap((g) => g.items).find((i) => i.id === id);
        const n = base + (rem > 0 ? 1 : 0);
        if (rem > 0) rem--;
        return { id, label: item?.label || id, n };
      })
      .filter((b) => b.n > 0);
  }, [selected, count, subject, topics]);

  const diffCounts = useMemo(() => {
    const total = mix.Easy + mix.Medium + mix.Hard || 1;
    return {
      Easy: Math.round((count * mix.Easy) / total),
      Medium: Math.round((count * mix.Medium) / total),
      Hard: Math.round((count * mix.Hard) / total),
    };
  }, [mix, count]);

  function generate() {
    if (selected.length === 0) return;
    setLoading(true);
    setGenerated(null);
    setTimeout(() => {
      const items = mockGenerate(breakdown, diffCounts, subject);
      setGenerated(items);
      setLoading(false);
    }, 1100);
  }

  function reset() {
    setGenerated(null);
  }

  return (
    <div className="view screen" data-screen-label="Admin · Generate questions">
      <div className="row between" style={{ marginBottom: 22 }}>
        <div>
          <div className="small muted">Content · AI tools</div>
          <h1 style={{ marginTop: 6 }}>Generate questions</h1>
          <p className="muted" style={{ marginTop: 6, fontSize: 14, maxWidth: 620 }}>
            Draft 1–10 SAT-style questions per run, scoped to the topics you select. Generated drafts land in the
            AI review queue for approval before going live.
          </p>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <span className="tag">
            <ISpark size={11} /> Powered by Claude Sonnet
          </span>
          <a className="btn btn-quiet" href="#" onClick={(e) => e.preventDefault()}>
            View prompt template
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        <div className="col" style={{ gap: 24 }}>
          <SectionG title="1 · Subject">
            <div className="seg" style={{ padding: 3 }}>
              {(['Math', 'R&W'] as const).map((s) => (
                <button
                  key={s}
                  className={subject === s ? 'on' : ''}
                  onClick={() => changeSubject(s)}
                  style={{ padding: '8px 16px', fontSize: 14 }}
                >
                  {s === 'R&W' ? 'Reading & Writing' : 'Math'}
                </button>
              ))}
            </div>
          </SectionG>

          <SectionG
            title="2 · Topics"
            hint={`${selected.length} selected`}
            action={
              <div className="row" style={{ gap: 8 }}>
                <button
                  className="btn btn-ghost"
                  style={{ padding: '6px 10px', fontSize: 12 }}
                  onClick={() => setSelected(allInSubject)}
                >
                  <ICheck /> Select all
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ padding: '6px 10px', fontSize: 12 }}
                  onClick={() => setSelected([])}
                >
                  <IX /> Clear
                </button>
              </div>
            }
          >
            <p className="small muted" style={{ marginBottom: 14, maxWidth: 560 }}>
              Topics tagged with a small dot are this cohort&apos;s weakest areas — generating here directly
              replenishes the booster pool.
            </p>
            <div className="col" style={{ gap: 18 }}>
              {topics.map((g) => (
                <div key={g.group}>
                  <div
                    className="small muted"
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    {g.group}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {g.items.map((t) => {
                      const on = selected.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          onClick={() => toggle(t.id)}
                          className="tag"
                          style={{
                            cursor: 'pointer',
                            padding: '7px 12px',
                            fontSize: 13,
                            background: on ? 'var(--accent)' : 'var(--surface)',
                            borderColor: on ? 'var(--accent)' : 'var(--border)',
                            color: on ? '#fff' : 'var(--ink-2)',
                          }}
                        >
                          {t.weak && (
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: on ? '#fff' : 'var(--bad)',
                                marginRight: 4,
                              }}
                            />
                          )}
                          {t.label}
                          {on && <ICheck size={12} style={{ marginLeft: 4 }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </SectionG>

          <SectionG title="3 · Question count" hint="1 to 10 per run">
            <div className="row" style={{ gap: 18, alignItems: 'center' }}>
              <div className="stepper">
                <button onClick={() => setCount(Math.max(1, count - 1))}>–</button>
                <div className="val num">{count}</div>
                <button onClick={() => setCount(Math.min(10, count + 1))}>+</button>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent)' }}
              />
              <div className="row" style={{ gap: 6 }}>
                {[1, 3, 5, 10].map((n) => (
                  <button
                    key={n}
                    className={'btn ' + (count === n ? 'btn-primary' : 'btn-ghost')}
                    style={{ padding: '7px 12px', fontSize: 13 }}
                    onClick={() => setCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </SectionG>

          <SectionG title="4 · Difficulty mix" hint={`${diffCounts.Easy} · ${diffCounts.Medium} · ${diffCounts.Hard}`}>
            <div className="col" style={{ gap: 12 }}>
              {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                <div key={d} className="row" style={{ gap: 14, alignItems: 'center' }}>
                  <DiffPillG level={d} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={mix[d]}
                    onChange={(e) => setMix({ ...mix, [d]: Number(e.target.value) })}
                    style={{ flex: 1, accentColor: 'var(--accent)' }}
                  />
                  <div className="num small" style={{ width: 44, textAlign: 'right', color: 'var(--ink-2)' }}>
                    {mix[d]}%
                  </div>
                  <div className="num small" style={{ width: 30, textAlign: 'right', color: 'var(--ink-3)' }}>
                    ·{diffCounts[d]}
                  </div>
                </div>
              ))}
            </div>
          </SectionG>

          <SectionG title="5 · Style guidance" hint="Optional — passed verbatim to the model">
            <textarea
              rows={3}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              style={{ width: '100%', resize: 'vertical', fontFamily: 'var(--sans)', fontSize: 14 }}
            />
          </SectionG>
        </div>

        <div className="col" style={{ gap: 16, position: 'sticky', top: 80 }}>
          {!generated && !loading && (
            <PreviewCard
              subject={subject}
              breakdown={breakdown}
              diffCounts={diffCounts}
              count={count}
              onGenerate={generate}
              disabled={selected.length === 0}
            />
          )}
          {loading && <LoadingCard count={count} />}
          {generated && <GeneratedList items={generated} onRedo={reset} goReview={() => onNavigate('review')} />}
        </div>
      </div>
    </div>
  );
}

function SectionG({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="row between" style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 17 }}>{title}</h3>
        <div className="row" style={{ gap: 10 }}>
          {hint && <span className="small muted">{hint}</span>}
          {action}
        </div>
      </div>
      {children}
    </div>
  );
}

function DiffPillG({ level }: { level: 'Easy' | 'Medium' | 'Hard' }) {
  const map = {
    Easy: { bg: '#EDF2ED', fg: '#406348' },
    Medium: { bg: '#F1EEE6', fg: '#6B5B37' },
    Hard: { bg: '#F1E7E4', fg: '#7A3D35' },
  };
  const s = map[level] || map.Medium;
  return (
    <span
      className="tag"
      style={{
        background: s.bg,
        borderColor: s.bg,
        color: s.fg,
        width: 70,
        justifyContent: 'center',
      }}
    >
      {level}
    </span>
  );
}

function PreviewCard({
  subject,
  breakdown,
  diffCounts,
  count,
  onGenerate,
  disabled,
}: {
  subject: string;
  breakdown: Array<{ id: string; label: string; n: number }>;
  diffCounts: { Easy: number; Medium: number; Hard: number };
  count: number;
  onGenerate: () => void;
  disabled: boolean;
}) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div
        className="small muted"
        style={{
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          fontWeight: 500,
          marginBottom: 12,
        }}
      >
        Preview
      </div>
      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, marginBottom: 4 }}>
        Generate <span className="num">{count}</span> {count === 1 ? 'question' : 'questions'}
      </h3>
      <p className="small muted" style={{ marginBottom: 18 }}>
        Subject: <span style={{ color: 'var(--ink-2)' }}>{subject === 'R&W' ? 'Reading & Writing' : 'Math'}</span>
      </p>

      {breakdown.length === 0 ? (
        <div
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            background: 'var(--surface-2)',
            borderRadius: 10,
            border: '1px dashed var(--border)',
          }}
        >
          <div className="muted small">Select at least one topic to preview the run.</div>
        </div>
      ) : (
        <>
          <div className="small muted" style={{ marginBottom: 8 }}>
            By topic
          </div>
          <div className="col" style={{ gap: 6, marginBottom: 16 }}>
            {breakdown.map((b) => (
              <div
                key={b.id}
                className="row between"
                style={{ padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8 }}
              >
                <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{b.label}</span>
                <span className="num small" style={{ color: 'var(--ink)', fontWeight: 500 }}>
                  × {b.n}
                </span>
              </div>
            ))}
          </div>

          <div className="small muted" style={{ marginBottom: 8 }}>
            By difficulty
          </div>
          <div className="row" style={{ gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
            {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
              <div
                key={d}
                className="row"
                style={{ gap: 6, padding: '6px 10px', background: 'var(--surface-2)', borderRadius: 8 }}
              >
                <DiffPillG level={d} />
                <span className="num small" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>
                  × {diffCounts[d]}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="divider" style={{ margin: '4px 0 14px' }} />
      <div className="row between small muted" style={{ marginBottom: 14 }}>
        <span>
          <IClock size={13} /> Est. {Math.max(8, count * 4)}s
        </span>
        <span>Drafts → AI review queue</span>
      </div>
      <button
        className="btn btn-primary btn-lg"
        disabled={disabled}
        style={{
          width: '100%',
          justifyContent: 'center',
          opacity: disabled ? 0.55 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={onGenerate}
      >
        <ISpark size={14} /> Generate {count} {count === 1 ? 'question' : 'questions'}
      </button>
      {disabled && (
        <div className="small muted" style={{ marginTop: 8, textAlign: 'center' }}>
          Pick at least one topic above.
        </div>
      )}
    </div>
  );
}

function LoadingCard({ count }: { count: number }) {
  return (
    <div className="card" style={{ padding: 28, textAlign: 'center' }}>
      <div
        className="small muted"
        style={{
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          fontWeight: 500,
          marginBottom: 14,
        }}
      >
        Generating
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'var(--serif)',
          fontSize: 18,
          marginBottom: 18,
        }}
      >
        <span
          className="dot-pulse"
          style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}
        />
        Drafting <span className="num">{count}</span> {count === 1 ? 'question' : 'questions'}…
      </div>
      <div className="col" style={{ gap: 8, textAlign: 'left' }}>
        {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: '12px 14px',
              background: 'var(--surface-2)',
              borderRadius: 8,
              border: '1px solid var(--border-2)',
            }}
          >
            <div
              style={{
                height: 10,
                background: 'var(--border)',
                borderRadius: 4,
                width: '85%',
                marginBottom: 8,
              }}
            />
            <div style={{ height: 8, background: 'var(--border-2)', borderRadius: 4, width: '65%' }} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes dotpulse { 0%,100%{opacity:.4; transform:scale(.85)} 50%{opacity:1; transform:scale(1.15)} }
        .dot-pulse{ animation: dotpulse 1.1s ease-in-out infinite; display:inline-block }
      `}</style>
    </div>
  );
}

function GeneratedList({
  items: initialItems,
  onRedo,
  goReview,
}: {
  items: any[];
  onRedo: () => void;
  goReview: () => void;
}) {
  const [items, setItems] = useState(initialItems);
  const [acted, setActed] = useState<Record<string, 'kept' | 'rejected'>>({});
  const [editing, setEditing] = useState<any>(null);
  const [sent, setSent] = useState<{ kept: number; rejected: number } | null>(null);

  function act(id: string, k: 'kept' | 'rejected' | null) {
    if (k === null) {
      setActed((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setActed({ ...acted, [id]: k });
    }
  }

  function keepAll() {
    const next: Record<string, 'kept' | 'rejected'> = { ...acted };
    items.forEach((q) => {
      if (next[q.id] !== 'rejected') next[q.id] = 'kept';
    });
    setActed(next);
  }

  function clearAll() {
    setActed({});
  }

  function send() {
    if (keptCount === 0) return;
    setSent({ kept: keptCount, rejected: rejectedCount });
  }

  function regenerate(id: string) {
    setItems(
      items.map((q) =>
        q.id === id
          ? {
              ...q,
              id: 'AI-' + Math.floor(2100 + Math.random() * 900),
              text: q.text.replace(/\.$/, '') + ' (re-drafted alternative)',
              confidence: 0.72 + Math.random() * 0.25,
            }
          : q
      )
    );
    setActed((prev) => {
      const c = { ...prev };
      delete c[id];
      return c;
    });
  }

  function saveEdit(updated: any) {
    setItems(items.map((q) => (q.id === updated.id ? updated : q)));
    setEditing(null);
  }

  const keptCount = Object.values(acted).filter((v) => v === 'kept').length;
  const rejectedCount = Object.values(acted).filter((v) => v === 'rejected').length;

  if (sent) {
    return (
      <div className="card" style={{ padding: 36, textAlign: 'center' }}>
        <div
          style={{
            width: 60,
            height: 60,
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'var(--ok-soft)',
            color: 'var(--ok)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <ICheck size={26} />
        </div>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, marginBottom: 6 }}>Sent to review queue</h3>
        <p className="small muted" style={{ marginBottom: 22, maxWidth: 360, margin: '0 auto 22px' }}>
          <span className="num" style={{ color: 'var(--ink)', fontWeight: 500 }}>
            {sent.kept}
          </span>{' '}
          drafts queued for approval.
          {sent.rejected > 0 && (
            <>
              {' '}
              <span className="num">{sent.rejected}</span> rejected drafts were discarded.
            </>
          )}
        </p>
        <div className="row" style={{ gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onRedo}>
            <ISpark /> Generate more
          </button>
          <button className="btn btn-primary btn-lg" onClick={goReview}>
            Open review queue <IArrow />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="card"
        style={{
          padding: 18,
          background: 'var(--ok-soft)',
          borderColor: 'color-mix(in srgb, var(--ok) 25%, white)',
        }}
      >
        <div className="row between">
          <div className="row" style={{ gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--ok)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <ICheck size={14} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--ok)', fontWeight: 500 }}>
                {items.length} drafts ready
              </div>
              <div className="small" style={{ color: 'var(--ok)', opacity: 0.85 }}>
                Review individually or bulk-action below.
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onRedo} style={{ background: '#fff' }}>
            <ISpark /> Generate again
          </button>
        </div>
        <div
          className="row"
          style={{
            gap: 8,
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid color-mix(in srgb, var(--ok) 18%, transparent)',
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={keepAll}
            style={{ background: '#fff', padding: '7px 12px', fontSize: 13 }}
          >
            <ICheck /> Keep all
          </button>
          <button
            className="btn btn-ghost"
            onClick={clearAll}
            style={{ background: '#fff', padding: '7px 12px', fontSize: 13 }}
          >
            Clear selections
          </button>
          <div style={{ flex: 1 }} />
          <span className="small" style={{ color: 'var(--ok)', fontWeight: 500, alignSelf: 'center' }}>
            <span className="num">{keptCount}</span> / {items.length} selected to send
          </span>
        </div>
      </div>

      <div className="col" style={{ gap: 10, maxHeight: '60vh', overflow: 'auto', paddingRight: 4 }}>
        {items.map((q) => (
          <div
            key={q.id}
            className="card"
            style={{ padding: 16, opacity: acted[q.id] === 'rejected' ? 0.55 : 1 }}
          >
            <div className="row between" style={{ marginBottom: 8 }}>
              <div className="row" style={{ gap: 6 }}>
                <span className="mono small muted">{q.id}</span>
                <span className="tag tag-strong" style={{ fontSize: 11 }}>
                  {q.topic}
                </span>
                <DiffPillG level={q.difficulty} />
              </div>
              <span
                className="tag"
                style={{
                  fontSize: 11,
                  background: q.confidence >= 0.85 ? 'var(--ok-soft)' : 'var(--warn-soft)',
                  color: q.confidence >= 0.85 ? 'var(--ok)' : 'var(--warn)',
                  borderColor: 'transparent',
                }}
              >
                {Math.round(q.confidence * 100)}% conf.
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 15,
                color: 'var(--ink)',
                lineHeight: 1.45,
                marginBottom: 10,
              }}
            >
              {q.text}
            </div>
            <div className="small muted" style={{ marginBottom: 12 }}>
              Correct: <strong style={{ color: 'var(--ok)' }}>{q.correctKey}</strong> — {q.correctText}
            </div>
            <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
              {acted[q.id] === 'kept' && (
                <span className="tag tag-ok">
                  <ICheck size={11} /> Queued
                </span>
              )}
              {acted[q.id] === 'rejected' && (
                <span className="tag tag-bad">
                  <IX size={11} /> Rejected
                </span>
              )}
              {acted[q.id] && (
                <button
                  className="btn btn-quiet"
                  onClick={() => act(q.id, null)}
                  style={{ padding: '5px 10px', fontSize: 12 }}
                >
                  Undo
                </button>
              )}
              {!acted[q.id] && (
                <>
                  <button
                    className="btn btn-ghost"
                    title="Regenerate — replace with a fresh draft"
                    style={{ padding: '7px 10px', fontSize: 13 }}
                    onClick={() => regenerate(q.id)}
                  >
                    <ISpark /> Regenerate
                  </button>
                  <button
                    className="btn btn-ghost"
                    title="Edit this draft"
                    style={{ padding: '7px 10px', fontSize: 13 }}
                    onClick={() => setEditing(q)}
                  >
                    <IEdit /> Edit
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{
                      padding: '7px 12px',
                      fontSize: 13,
                      color: 'var(--bad)',
                      borderColor: 'color-mix(in srgb, var(--bad) 30%, var(--border))',
                    }}
                    onClick={() => act(q.id, 'rejected')}
                  >
                    <IX /> Reject
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '7px 12px', fontSize: 13 }}
                    onClick={() => act(q.id, 'kept')}
                  >
                    <ICheck /> Keep
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && <EditDraftModal question={editing} onSave={saveEdit} onClose={() => setEditing(null)} />}

      <div
        className="card"
        style={{ padding: 16, position: 'sticky', bottom: 0, background: 'var(--surface)' }}
      >
        <div className="row between" style={{ marginBottom: 10 }}>
          <span className="small muted">
            <span className="num" style={{ color: 'var(--ink)', fontWeight: 500 }}>
              {keptCount}
            </span>{' '}
            kept · <span className="num">{rejectedCount}</span> rejected ·{' '}
            <span className="num">{items.length - keptCount - rejectedCount}</span> pending
          </span>
        </div>
        <button
          className="btn btn-primary btn-lg"
          style={{
            width: '100%',
            justifyContent: 'center',
            opacity: keptCount === 0 ? 0.55 : 1,
            cursor: keptCount === 0 ? 'not-allowed' : 'pointer',
          }}
          disabled={keptCount === 0}
          onClick={send}
        >
          <IArrow /> Send {keptCount} to review queue
        </button>
      </div>
    </>
  );
}

function EditDraftModal({
  question,
  onSave,
  onClose,
}: {
  question: any;
  onSave: (updated: any) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(question.text);
  const [topic, setTopic] = useState(question.topic);
  const [difficulty, setDifficulty] = useState(question.difficulty);
  const [choices, setChoices] = useState(question.choices);
  const [correctKey, setCorrectKey] = useState(question.correctKey);

  function setChoice(idx: number, t: string) {
    setChoices(choices.map((c: any, i: number) => (i === idx ? { ...c, t } : c)));
  }

  function save() {
    const correctText = choices.find((c: any) => c.k === correctKey)?.t || '';
    onSave({ ...question, text, topic, difficulty, choices, correctKey, correctText });
  }

  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,20,20,0.4)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
        padding: 24,
      }}
    >
      <div
        onClick={stop}
        className="card"
        style={{
          width: 'min(680px, 100%)',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 0,
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          className="row between"
          style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <div className="small muted">{question.id}</div>
            <h3 style={{ marginTop: 2 }}>Edit draft</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <IX />
          </button>
        </div>

        <div className="col" style={{ padding: '20px 22px', gap: 18 }}>
          <div className="row" style={{ gap: 14 }}>
            <label className="col" style={{ flex: 1, gap: 6 }}>
              <span className="small muted">Sub-topic</span>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </label>
            <label className="col" style={{ flex: 1, gap: 6 }}>
              <span className="small muted">Difficulty</span>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>
          </div>

          <label className="col" style={{ gap: 6 }}>
            <span className="small muted">Question text</span>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'var(--serif)', fontSize: 15, lineHeight: 1.5 }}
            />
          </label>

          <div className="col" style={{ gap: 8 }}>
            <span className="small muted">Answer choices · pick the correct one</span>
            {choices.map((c: any, i: number) => (
              <div key={c.k} className="row" style={{ gap: 10, alignItems: 'center' }}>
                <button
                  onClick={() => setCorrectKey(c.k)}
                  title="Mark as correct"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    flex: 'none',
                    border: '1px solid ' + (correctKey === c.k ? 'var(--ok)' : 'var(--border)'),
                    background: correctKey === c.k ? 'var(--ok)' : 'var(--surface)',
                    color: correctKey === c.k ? '#fff' : 'var(--ink-2)',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {c.k}
                </button>
                <input
                  type="text"
                  value={c.t}
                  onChange={(e) => setChoice(i, e.target.value)}
                  style={{ flex: 1 }}
                />
                {correctKey === c.k && (
                  <span className="tag tag-ok" style={{ fontSize: 11 }}>
                    Correct
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className="row between"
          style={{
            padding: '14px 22px',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface-2)',
          }}
        >
          <span className="small muted">Edits stay local until you Keep this draft.</span>
          <div className="row" style={{ gap: 10 }}>
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={save}>
              <ICheck /> Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function mockGenerate(
  breakdown: Array<{ id: string; label: string; n: number }>,
  diffCounts: { Easy: number; Medium: number; Hard: number },
  subject: string
) {
  const samples: Record<string, string[]> = {
    Transitions: [
      "The film's opening sequence relies almost entirely on natural light. ______ the cinematographer credited a small team of gaffers in interviews about the shoot.",
      "Most household appliances now ship with low-power standby modes. ______ a single home's baseline electricity draw can still total dozens of watts at any moment.",
      'Coffee farmers in the Central Highlands have shifted toward shade-grown plots. ______ yields per hectare have dropped only modestly.',
    ],
    'Data inferences': [
      'Based on the table, which statement is most directly supported by the data on monthly rainfall in the Mekong Delta?',
      'The graph plots library visits per capita across five districts. Which conclusion is best supported?',
    ],
    'Linear equations': [
      'If 2(x + 4) − 3x = x − 6, what is the value of x?',
      'A taxi service charges a flat $3.50 plus $1.25 per kilometer. Which equation gives the fare f for a ride of d kilometers?',
    ],
    Quadratics: ['If x² − 5x − 14 = 0, what is the sum of the solutions?'],
    'Word in context': ["As used in the passage, \"______\" most nearly means 'intentionally restrained.'"],
    'Central idea': ['Which choice best states the main idea of the passage?'],
  };
  const choicesPool = [
    [
      { k: 'A', t: 'However,' },
      { k: 'B', t: 'As a result,' },
      { k: 'C', t: 'For example,' },
      { k: 'D', t: 'Likewise,' },
    ],
    [
      { k: 'A', t: 'Moreover,' },
      { k: 'B', t: 'Nevertheless,' },
      { k: 'C', t: 'Therefore,' },
      { k: 'D', t: 'Similarly,' },
    ],
    [
      { k: 'A', t: '4' },
      { k: 'B', t: '−4' },
      { k: 'C', t: '5' },
      { k: 'D', t: '−5' },
    ],
  ];

  const diffPool = [
    ...Array(diffCounts.Easy).fill('Easy'),
    ...Array(diffCounts.Medium).fill('Medium'),
    ...Array(diffCounts.Hard).fill('Hard'),
  ];

  const out = [];
  let nextId = 2050;
  let dIdx = 0;
  for (const b of breakdown) {
    for (let i = 0; i < b.n; i++) {
      const sampList = samples[b.label] || [
        'A newly drafted SAT-style question for ' + b.label + ' will appear here.',
      ];
      const text = sampList[out.length % sampList.length];
      const choices = choicesPool[out.length % choicesPool.length];
      const correctKey = choices[Math.floor(Math.random() * 4)].k;
      const correctText = choices.find((c) => c.k === correctKey)!.t;
      out.push({
        id: 'AI-' + nextId++,
        topic: b.label,
        subject,
        difficulty: diffPool[dIdx % diffPool.length] || 'Medium',
        text,
        choices,
        correctKey,
        correctText,
        confidence: 0.72 + Math.random() * 0.25,
      });
      dIdx++;
    }
  }
  return out;
}
