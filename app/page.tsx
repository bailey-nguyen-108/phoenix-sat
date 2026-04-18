export default function Home() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <div className="small muted" style={{ marginBottom: "8px" }}>
          V2 Implementation
        </div>
        <h1 style={{ fontFamily: "var(--serif)", marginBottom: "12px" }}>
          SAT Prep App — V2 with Adaptive Booster
        </h1>
        <p style={{ marginBottom: "24px", color: "var(--ink-3)", lineHeight: "1.6" }}>
          The V2 design has been fully implemented with two major new features: an Adaptive Booster
          system that gates students below 70% accuracy, and an AI Question Generator for admins to
          create SAT-style questions with Claude.
        </p>
        <div className="row" style={{ gap: "12px" }}>
          <a
            href="/demo"
            className="btn btn-primary btn-lg"
            style={{ display: "inline-flex" }}
          >
            🧪 Interactive Demo →
          </a>
          <a
            href="/SAT Prep App.html"
            className="btn btn-ghost"
            style={{ display: "inline-flex" }}
          >
            View Full Prototype
          </a>
        </div>
        <p className="small muted" style={{ marginTop: "12px" }}>
          Try the Adaptive Booster and AI Generator with live React components
        </p>
      </div>

      <div
        className="card"
        style={{
          padding: "24px",
          marginBottom: "32px",
          background: "var(--accent-soft)",
          borderColor: "var(--accent-border)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "20px",
            marginBottom: "12px",
            color: "var(--accent-ink)",
          }}
        >
          ✨ New in V2
        </h2>
        <div className="col" style={{ gap: "16px" }}>
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "6px", fontWeight: 500 }}>
              1. Adaptive Booster System
            </h3>
            <p className="small" style={{ color: "var(--ink-2)", lineHeight: "1.6" }}>
              When students score below 70% on a session, they&apos;re automatically redirected to a
              mandatory booster module. The booster presents targeted questions on their weak topics
              and requires them to maintain 70% running accuracy before unlocking access to the
              dashboard and new sessions.
            </p>
            <div className="row" style={{ gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
              <span className="tag tag-strong" style={{ fontSize: "12px" }}>
                Gated navigation
              </span>
              <span className="tag tag-strong" style={{ fontSize: "12px" }}>
                Running accuracy tracking
              </span>
              <span className="tag tag-strong" style={{ fontSize: "12px" }}>
                Checkpoint progress UI
              </span>
              <span className="tag tag-strong" style={{ fontSize: "12px" }}>
                AI explanations
              </span>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "6px", fontWeight: 500 }}>
              2. AI Question Generator (Admin)
            </h3>
            <p className="small" style={{ color: "var(--ink-2)", lineHeight: "1.6" }}>
              Admins can now generate 1-10 SAT-style questions per run, powered by Claude Sonnet.
              Select topics (with weak-area indicators), set difficulty distribution, customize
              style guidance, and review drafts in a batch approval workflow with
              Keep/Reject/Regenerate/Edit actions.
            </p>
            <div className="row" style={{ gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
              <span className="tag tag-strong" style={{ fontSize: "12px" }}>
                Topic catalog
              </span>
              <span className="tag tag-strong" style={{ fontSize: "12px" }}>
                Difficulty mix control
              </span>
              <span className="tag tag-strong" style={{ fontSize: "12px" }}>
                Batch review workflow
              </span>
              <span className="tag tag-strong" style={{ fontSize: "12px" }}>
                Inline editing
              </span>
            </div>
          </div>
        </div>
      </div>

      <div id="features" style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "22px",
            marginBottom: "16px",
          }}
        >
          Complete Feature Set
        </h2>
        <div className="grid-2" style={{ gap: "16px" }}>
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "17px", marginBottom: "12px", fontWeight: 500 }}>
              Student Experience
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                color: "var(--ink-2)",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              <li>✓ Dashboard with streak tracking & weak topics</li>
              <li>✓ Session setup with adaptive difficulty</li>
              <li>✓ Interactive question interface</li>
              <li>✓ Detailed results with AI explanations</li>
              <li>✓ Score-based booster gating (new)</li>
              <li>✓ Adaptive remediation module (new)</li>
            </ul>
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "17px", marginBottom: "12px", fontWeight: 500 }}>
              Admin Tools
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                color: "var(--ink-2)",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              <li>✓ Question bank management</li>
              <li>✓ AI review queue for approvals</li>
              <li>✓ Student progress tracking</li>
              <li>✓ AI question generator (new)</li>
              <li>✓ Topic-based generation (new)</li>
              <li>✓ Batch approval workflow (new)</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "22px",
            marginBottom: "16px",
          }}
        >
          Design System
        </h2>
        <div className="card" style={{ padding: "20px" }}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              color: "var(--ink-2)",
              fontSize: "14px",
              lineHeight: "1.8",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px",
            }}
          >
            <li>✓ Custom design tokens</li>
            <li>✓ Typography system (Fraunces, DM Sans)</li>
            <li>✓ 4 accent color schemes</li>
            <li>✓ Density toggle (compact/comfortable)</li>
            <li>✓ Component library (cards, buttons, tags)</li>
            <li>✓ Interactive question UI</li>
            <li>✓ Progress bars & indicators</li>
            <li>✓ Modal & checkpoint screens</li>
          </ul>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: "24px",
          background: "var(--surface-2)",
          textAlign: "center",
        }}
      >
        <div className="small muted" style={{ marginBottom: "12px" }}>
          Ready to explore
        </div>
        <div className="row" style={{ gap: "12px", justifyContent: "center" }}>
          <a
            href="/demo"
            className="btn btn-primary btn-lg"
            style={{ display: "inline-flex" }}
          >
            🧪 Interactive Demo →
          </a>
          <a
            href="/SAT Prep App.html"
            className="btn btn-ghost"
            style={{ display: "inline-flex" }}
          >
            Full Prototype
          </a>
        </div>
        <p className="small muted" style={{ marginTop: "12px" }}>
          Test the Adaptive Booster and AI Generator with live components
        </p>
      </div>
    </div>
  );
}
