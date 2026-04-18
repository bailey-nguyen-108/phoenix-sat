'use client';

import { useState, useEffect, useMemo } from 'react';
import { BOOSTER_BANK } from '@/lib/data';
import { IArrow, ICheck, IX, ISpark } from './icons';

// Lock icon for booster gating
function ILock({ size = 16, ...props }: { size?: number; [key: string]: any }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function pickBoosterQuestions() {
  return [...BOOSTER_BANK];
}

interface AdaptiveBoosterProps {
  onFinish: () => void;
  onNavigate: (screen: string) => void;
}

export function AdaptiveBooster({ onFinish, onNavigate }: AdaptiveBoosterProps) {
  const [questions] = useState(() => pickBoosterQuestions());
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [history, setHistory] = useState<Array<{ ok: boolean; topic: string; qIdx: number }>>([]);
  const [released, setReleased] = useState(false);
  const [showCheckpoint, setShowCheckpoint] = useState(false);

  const TARGET = 0.7;
  const MIN_ATTEMPTED = 4;
  const CHECKPOINT_EVERY = 4;

  const q = questions[idx % questions.length];
  const correctCount = history.filter((h) => h.ok).length;
  const accuracy = history.length === 0 ? 0 : correctCount / history.length;
  const pct = Math.round(accuracy * 100);
  const targetPct = Math.round(TARGET * 100);

  const eligible = history.length >= MIN_ATTEMPTED && accuracy >= TARGET;
  const progress = Math.min(1, history.length === 0 ? 0 : accuracy / TARGET);

  function submit() {
    if (!picked) return;
    setRevealed(true);
  }

  function next() {
    const ok = picked === q.correct;
    const nextHistory = [...history, { ok, topic: q.topic, qIdx: idx }];
    setHistory(nextHistory);
    setPicked(null);
    setRevealed(false);

    const nextCorrect = nextHistory.filter((h) => h.ok).length;
    const nextAcc = nextCorrect / nextHistory.length;
    const reachedTarget = nextHistory.length >= MIN_ATTEMPTED && nextAcc >= TARGET;

    if (reachedTarget) {
      setReleased(true);
      return;
    }

    if (nextHistory.length % CHECKPOINT_EVERY === 0) {
      setShowCheckpoint(true);
      return;
    }
    setIdx(idx + 1);
  }

  const topicStats = useMemo(() => {
    const m: Record<string, { ok: number; n: number }> = {};
    history.forEach((h) => {
      m[h.topic] = m[h.topic] || { ok: 0, n: 0 };
      m[h.topic].n += 1;
      if (h.ok) m[h.topic].ok += 1;
    });
    return Object.entries(m).map(([t, s]) => ({ topic: t, ...s }));
  }, [history]);

  if (released) {
    return (
      <BoosterCleared
        accuracy={accuracy}
        attempted={history.length}
        onNavigate={onNavigate}
        onFinish={onFinish}
      />
    );
  }

  if (showCheckpoint) {
    return (
      <BoosterCheckpoint
        accuracy={accuracy}
        targetPct={targetPct}
        attempted={history.length}
        topicStats={topicStats}
        onContinue={() => {
          setShowCheckpoint(false);
          setIdx(idx + 1);
        }}
      />
    );
  }

  return (
    <div className="view screen" data-screen-label="Student · Adaptive booster" style={{ maxWidth: 1100 }}>
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          borderColor: 'var(--accent-border)',
          background: 'var(--accent-soft)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--accent)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
          }}
        >
          <ILock />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 17,
              color: 'var(--accent-ink)',
              fontWeight: 500,
            }}
          >
            Booster module — required to unlock dashboard
          </div>
          <div className="small" style={{ color: 'var(--accent-ink)', opacity: 0.85, marginTop: 2 }}>
            Reach <strong className="num">{targetPct}%</strong> running accuracy on this adaptive set to
            continue. Built around the sub-topics you missed.
          </div>
        </div>
        <div
          className="num"
          style={{ fontFamily: 'var(--serif)', fontSize: 30, color: 'var(--accent-ink)' }}
        >
          {pct}
          <span style={{ fontSize: 16, opacity: 0.6 }}>%</span>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'flex-start' }}>
        <div className="qshell">
          <div className="qtop">
            <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 500 }}>
              Booster question <span className="num">{history.length + 1}</span>
              <span className="muted"> · {q.topic}</span>
            </div>
            <div className="qsteps" style={{ maxWidth: 360 }}>
              <div className="pbar" style={{ flex: 1, height: 6 }}>
                <span style={{ width: progress * 100 + '%' }} />
              </div>
            </div>
            <div className="small muted num">
              {pct}% / {targetPct}%
            </div>
          </div>

          <div style={{ padding: '32px 36px' }}>
            <div
              className="small muted"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '.08em',
                fontWeight: 500,
                marginBottom: 14,
              }}
            >
              Targeted sub-topic
            </div>
            <p className="qprompt" style={{ marginTop: 0, fontSize: 22 }}>
              {q.prompt}
            </p>

            <div className="col" style={{ gap: 10, marginTop: 24 }}>
              {q.choices.map((c) => {
                const isPicked = picked === c.k;
                const isCorrect = revealed && c.k === q.correct;
                const isWrongPick = revealed && isPicked && c.k !== q.correct;
                let extra: any = {};
                if (isCorrect) extra = { borderColor: 'var(--ok)', background: 'var(--ok-soft)' };
                else if (isWrongPick)
                  extra = { borderColor: 'var(--bad)', background: 'var(--bad-soft)' };
                return (
                  <div
                    key={c.k}
                    className={'choice ' + (isPicked && !revealed ? 'selected' : '')}
                    style={extra}
                    onClick={() => !revealed && setPicked(c.k)}
                  >
                    <div
                      className="key"
                      style={
                        isCorrect
                          ? { background: 'var(--ok)', color: '#fff', borderColor: 'var(--ok)' }
                          : isWrongPick
                            ? { background: 'var(--bad)', color: '#fff', borderColor: 'var(--bad)' }
                            : undefined
                      }
                    >
                      {c.k}
                    </div>
                    <div className="ctext" style={{ flex: 1 }}>
                      {c.t}
                    </div>
                    {isCorrect && <ICheck size={16} style={{ color: 'var(--ok)', marginTop: 4 }} />}
                    {isWrongPick && <IX size={16} style={{ color: 'var(--bad)', marginTop: 4 }} />}
                  </div>
                );
              })}
            </div>

            {revealed && (
              <div
                style={{
                  marginTop: 22,
                  padding: '16px 18px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-2)',
                  borderRadius: 10,
                }}
              >
                <div
                  className="aibadge"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                    color: 'var(--accent-ink)',
                    background: 'var(--accent-soft)',
                    padding: '3px 8px',
                    borderRadius: 999,
                    fontWeight: 500,
                    marginBottom: 8,
                    border: '1px solid var(--accent-border)',
                  }}
                >
                  <ISpark size={11} /> AI explanation
                </div>
                <div
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 15,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  Why <span style={{ color: 'var(--ok)' }}>{q.correct}</span> is correct
                </div>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>{q.why}</p>
              </div>
            )}
          </div>

          <div className="qbottom">
            <div className="small muted">
              {history.length < MIN_ATTEMPTED ? (
                <>
                  Minimum <span className="num">{MIN_ATTEMPTED}</span> questions before release
                </>
              ) : (
                <>
                  Eligible to release once accuracy ≥ <span className="num">{targetPct}%</span>
                </>
              )}
            </div>
            {!revealed ? (
              <button
                className={'btn ' + (picked ? 'btn-primary' : 'btn-ghost')}
                disabled={!picked}
                style={{ opacity: picked ? 1 : 0.55, cursor: picked ? 'pointer' : 'not-allowed' }}
                onClick={submit}
              >
                Submit answer <IArrow />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={next}>
                {picked === q.correct ? 'Continue' : 'Try the next one'} <IArrow />
              </button>
            )}
          </div>
        </div>

        <div className="col" style={{ gap: 14 }}>
          <div className="card" style={{ padding: 22 }}>
            <div className="row between" style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 17 }}>Running accuracy</h3>
              <span className="tag tag-strong">Goal {targetPct}%</span>
            </div>
            <div className="row" style={{ alignItems: 'baseline', gap: 8 }}>
              <div
                className="num"
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 44,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: accuracy >= TARGET ? 'var(--ok)' : 'var(--ink)',
                }}
              >
                {pct}%
              </div>
              <div className="small muted num">
                {correctCount} / {history.length} correct
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="pbar" style={{ height: 6 }}>
                <span
                  style={{
                    width: progress * 100 + '%',
                    background: accuracy >= TARGET ? 'var(--ok)' : 'var(--accent)',
                  }}
                />
              </div>
              <div className="row between small muted" style={{ marginTop: 6 }}>
                <span>0%</span>
                <span style={{ position: 'relative', left: -8 }}>↑ {targetPct}% target</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 17, marginBottom: 12 }}>This session</h3>
            <div className="col" style={{ gap: 8 }}>
              {topicStats.length === 0 && (
                <div className="small muted">Topic accuracy will show after your first answer.</div>
              )}
              {topicStats.map((s, i) => (
                <div key={i} className="row" style={{ gap: 12, alignItems: 'center' }}>
                  <div style={{ flex: 1, fontSize: 13.5 }}>{s.topic}</div>
                  <div style={{ width: 110 }}>
                    <div className="pbar">
                      <span
                        style={{
                          width: (s.ok / s.n) * 100 + '%',
                          background:
                            s.ok === 0 ? 'var(--bad)' : s.ok === s.n ? 'var(--ok)' : 'var(--accent)',
                        }}
                      />
                    </div>
                  </div>
                  <div className="num small" style={{ width: 36, textAlign: 'right', color: 'var(--ink-2)' }}>
                    {s.ok}/{s.n}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 18, background: 'var(--surface-2)' }}>
            <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
              <ISpark size={16} style={{ color: 'var(--accent)', marginTop: 2, flex: 'none' }} />
              <div className="small" style={{ color: 'var(--ink-2)', lineHeight: 1.55 }}>
                Each wrong answer pulls a similar question from the bank. Each right answer raises your
                accuracy and brings the gate closer to opening.
              </div>
            </div>
          </div>

          <button
            className="btn btn-quiet"
            disabled
            style={{ justifyContent: 'center', cursor: 'not-allowed', opacity: 0.55 }}
          >
            <ILock size={14} /> Cannot exit until {targetPct}% reached
          </button>
        </div>
      </div>
    </div>
  );
}

function BoosterCheckpoint({
  accuracy,
  targetPct,
  attempted,
  topicStats,
  onContinue,
}: {
  accuracy: number;
  targetPct: number;
  attempted: number;
  topicStats: Array<{ topic: string; ok: number; n: number }>;
  onContinue: () => void;
}) {
  const pct = Math.round(accuracy * 100);
  const gap = targetPct - pct;
  return (
    <div className="view screen" style={{ maxWidth: 720 }} data-screen-label="Student · Booster checkpoint">
      <div className="card" style={{ padding: 36, textAlign: 'center' }}>
        <div
          className="small muted"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            fontWeight: 500,
            marginBottom: 10,
          }}
        >
          Round checkpoint · {attempted} answered
        </div>
        <h1 style={{ fontSize: 36, marginBottom: 10 }}>
          You&apos;re at <span style={{ color: 'var(--accent-ink)' }}>{pct}%</span>.
        </h1>
        <p className="muted" style={{ maxWidth: 460, margin: '0 auto 24px', fontSize: 15 }}>
          {gap > 0 ? (
            <>
              Keep going —{' '}
              <span className="num" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>
                {gap} percentage points
              </span>{' '}
              short of the gate.
            </>
          ) : (
            <>You&apos;re at the threshold. One more correct answer should unlock the dashboard.</>
          )}
        </p>

        <div style={{ maxWidth: 520, margin: '0 auto 28px' }}>
          <div className="pbar" style={{ height: 8 }}>
            <span
              style={{
                width: Math.min(100, (pct / targetPct) * 100) + '%',
                background: pct >= targetPct ? 'var(--ok)' : 'var(--accent)',
              }}
            />
          </div>
          <div className="row between small muted" style={{ marginTop: 8 }}>
            <span>0%</span>
            <span>Target {targetPct}%</span>
            <span>100%</span>
          </div>
        </div>

        {topicStats.length > 0 && (
          <div style={{ maxWidth: 520, margin: '0 auto 28px', textAlign: 'left' }}>
            <div className="small muted" style={{ marginBottom: 8 }}>
              Topic-by-topic so far
            </div>
            {topicStats.map((s, i) => (
              <div key={i} className="row" style={{ gap: 12, padding: '4px 0' }}>
                <div style={{ flex: 1, fontSize: 13.5 }}>{s.topic}</div>
                <div style={{ width: 140 }}>
                  <div className="pbar">
                    <span
                      style={{
                        width: (s.ok / s.n) * 100 + '%',
                        background: s.ok === s.n ? 'var(--ok)' : s.ok === 0 ? 'var(--bad)' : 'var(--accent)',
                      }}
                    />
                  </div>
                </div>
                <div className="num small" style={{ width: 40, textAlign: 'right' }}>
                  {s.ok}/{s.n}
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="btn btn-primary btn-lg" onClick={onContinue}>
          Continue booster <IArrow />
        </button>
      </div>
    </div>
  );
}

function BoosterCleared({
  accuracy,
  attempted,
  onNavigate,
  onFinish,
}: {
  accuracy: number;
  attempted: number;
  onNavigate: (screen: string) => void;
  onFinish: () => void;
}) {
  const pct = Math.round(accuracy * 100);
  return (
    <div className="view screen" style={{ maxWidth: 720 }} data-screen-label="Student · Booster cleared">
      <div className="card" style={{ padding: 44, textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 18px',
            borderRadius: '50%',
            background: 'var(--ok-soft)',
            color: 'var(--ok)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <ICheck size={28} />
        </div>
        <div
          className="small muted"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          Gate unlocked
        </div>
        <h1 style={{ fontSize: 38, marginBottom: 12 }}>Booster cleared.</h1>
        <p className="muted" style={{ maxWidth: 460, margin: '0 auto 28px', fontSize: 15 }}>
          You finished at{' '}
          <span className="num" style={{ color: 'var(--ink)', fontWeight: 500 }}>
            {pct}%
          </span>{' '}
          across <span className="num">{attempted}</span> questions. Your weak-topic tags will be re-evaluated
          on your next session.
        </p>

        <div className="row" style={{ gap: 10, justifyContent: 'center' }}>
          <button
            className="btn btn-ghost"
            onClick={() => {
              onFinish();
              onNavigate('setup');
            }}
          >
            Start a new session
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              onFinish();
              onNavigate('dashboard');
            }}
          >
            Back to dashboard <IArrow />
          </button>
        </div>
      </div>
    </div>
  );
}
