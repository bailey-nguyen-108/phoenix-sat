'use client';

import { useState } from 'react';
import { AdaptiveBooster } from '@/components/adaptive-booster';
import { AdminGenerate } from '@/components/admin-generate';

export default function DemoPage() {
  const [view, setView] = useState<'selector' | 'booster' | 'generator'>('selector');
  const [boosterCompleted, setBoosterCompleted] = useState(false);

  if (view === 'booster') {
    return (
      <AdaptiveBooster
        onFinish={() => {
          setBoosterCompleted(true);
          setView('selector');
        }}
        onNavigate={(screen) => {
          console.log('Navigate to:', screen);
          setView('selector');
        }}
      />
    );
  }

  if (view === 'generator') {
    return (
      <div style={{ minHeight: '100vh' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <button className="btn btn-ghost" onClick={() => setView('selector')}>
            ← Back to Demo Selector
          </button>
        </div>
        <AdminGenerate onNavigate={(screen) => console.log('Navigate to:', screen)} />
      </div>
    );
  }

  return (
    <div className="view screen" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="small muted" style={{ marginBottom: '8px' }}>
          Interactive Demo
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', marginBottom: '12px' }}>
          Test V2 Features
        </h1>
        <p className="muted" style={{ marginBottom: '24px', maxWidth: '700px', lineHeight: '1.6' }}>
          Select a feature below to test the new V2 components. The Adaptive Booster simulates the
          remediation flow when a student scores below 70%. The AI Generator lets you create SAT-style
          questions.
        </p>
      </div>

      <div className="grid-2" style={{ gap: '20px', marginBottom: '32px' }}>
        <div
          className="card"
          style={{
            padding: '28px',
            background: 'var(--accent-soft)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'var(--accent)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontSize: '24px',
              marginBottom: '16px',
            }}
          >
            🔒
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', marginBottom: '8px' }}>
            Adaptive Booster
          </h2>
          <p className="small muted" style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Experience the mandatory remediation flow. You&apos;ll need to reach 70% running accuracy across
            at least 4 questions to unlock the gate and return to the dashboard.
          </p>
          <div
            className="small"
            style={{
              padding: '12px 14px',
              background: 'var(--accent-ink)',
              color: '#fff',
              borderRadius: '8px',
              marginBottom: '16px',
              opacity: 0.9,
            }}
          >
            <strong>How it works:</strong> Answer questions on your weak topics. Checkpoints appear every 4
            questions. Reach 70% accuracy to clear the gate.
          </div>
          {boosterCompleted && (
            <div
              className="small"
              style={{
                padding: '10px 12px',
                background: 'var(--ok-soft)',
                color: 'var(--ok)',
                borderRadius: '8px',
                marginBottom: '12px',
                border: '1px solid var(--ok)',
              }}
            >
              ✓ You&apos;ve completed the booster in this session!
            </div>
          )}
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setView('booster')}
          >
            {boosterCompleted ? 'Try Again' : 'Start Booster'} →
          </button>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'var(--accent)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontSize: '24px',
              marginBottom: '16px',
            }}
          >
            ✨
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', marginBottom: '8px' }}>
            AI Question Generator
          </h2>
          <p className="small muted" style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Generate 1-10 SAT-style questions with Claude Sonnet. Select topics, set difficulty mix, and
            review drafts with Keep/Reject/Edit actions before sending to the review queue.
          </p>
          <div
            className="small"
            style={{
              padding: '12px 14px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-2)',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            <strong>Admin tool:</strong> Pick topics (with weak-area indicators), adjust difficulty
            percentages, customize style guidance, and batch-approve generated questions.
          </div>
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setView('generator')}
          >
            Open Generator →
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', background: 'var(--surface-2)' }}>
        <h3 style={{ fontSize: '17px', marginBottom: '12px', fontWeight: 500 }}>
          Other ways to explore V2
        </h3>
        <div className="col" style={{ gap: '12px' }}>
          <a
            href="/SAT Prep App.html"
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start' }}
          >
            📱 Full V2 Prototype (HTML)
            <span className="small muted" style={{ marginLeft: 'auto' }}>
              Complete app with all screens
            </span>
          </a>
          <a href="/" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
            🏠 Back to Home
          </a>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: '20px',
          marginTop: '32px',
          background: 'linear-gradient(135deg, var(--accent-soft) 0%, var(--surface-2) 100%)',
          border: '1px solid var(--accent-border)',
        }}
      >
        <div className="row" style={{ gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '24px' }}>💡</div>
          <div className="small" style={{ color: 'var(--ink-2)', lineHeight: '1.6', flex: 1 }}>
            <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
              Tip for testing the booster:
            </strong>
            Try answering a few questions wrong intentionally to see how the running accuracy adjusts. The
            checkpoint screen appears every 4 questions, and you need at least 70% accuracy to clear the
            gate.
          </div>
        </div>
      </div>
    </div>
  );
}
