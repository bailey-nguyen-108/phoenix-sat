// Top-level shell: sidebar navigation, role switching, Tweaks panel.
const { useState: useStateApp, useEffect: useEffectApp } = React;

const PROTOTYPE_ID = 'sat-prep-v1';

const ACCENTS = {
  'slate-blue': { accent: '#2F4F6F', ink: '#1E3350', soft: '#EEF2F6', border: '#D6DFE8', label: 'Slate blue' },
  'ink': { accent: '#24262B', ink: '#14161A', soft: '#EFEEEB', border: '#DAD8D2', label: 'Ink' },
  'deep-blue': { accent: '#1E3A8A', ink: '#172554', soft: '#EEF0F6', border: '#D3D9E8', label: 'Deep blue' },
  'forest': { accent: '#2F5341', ink: '#1E3A2C', soft: '#EDF1EC', border: '#D4DED2', label: 'Forest' }
};

function App() {
  const defaults = JSON.parse(document.getElementById('tweak-defaults').textContent);
  const [role, setRole] = useStateApp('student'); // student | admin
  const [screen, setScreen] = useStateApp(() => localStorage.getItem('sat.screen') || 'dashboard');
  const [accent, setAccent] = useStateApp(defaults.accent);
  const [density, setDensity] = useStateApp(defaults.density);
  const [tweaks, setTweaks] = useStateApp(false);
  const [lowScore, setLowScore] = useStateApp(() => localStorage.getItem('sat.lowScore') === '1');
  const [boosterDone, setBoosterDone] = useStateApp(false);

  // persist screen + lowScore demo flag
  useEffectApp(() => {localStorage.setItem('sat.screen', screen);}, [screen]);
  useEffectApp(() => {localStorage.setItem('sat.lowScore', lowScore ? '1' : '0');}, [lowScore]);

  // gate: if a low-score booster is required and not yet finished, redirect away from forbidden screens
  const boosterRequired = lowScore && !boosterDone;
  useEffectApp(() => {
    if(role !== 'student' || !boosterRequired) return;
    if(['dashboard','setup','question'].includes(screen)) setScreen('results');
  }, [role, boosterRequired, screen]);

  // apply accent tokens
  useEffectApp(() => {
    const a = ACCENTS[accent] || ACCENTS['slate-blue'];
    const r = document.documentElement.style;
    r.setProperty('--accent', a.accent);
    r.setProperty('--accent-ink', a.ink);
    r.setProperty('--accent-soft', a.soft);
    r.setProperty('--accent-border', a.border);
  }, [accent]);

  useEffectApp(() => {
    document.body.style.fontSize = density === 'compact' ? '14px' : '15px';
  }, [density]);

  // Tweaks protocol
  useEffectApp(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaks(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const studentItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <IHome />, locked: boosterRequired },
  { id: 'setup', label: 'New session', icon: <IPlay />, locked: boosterRequired },
  { id: 'question', label: 'In session', icon: <IBook />, locked: boosterRequired },
  { id: 'results', label: 'Results', icon: <IChart /> },
  ...(boosterRequired ? [{ id: 'booster', label: 'Booster — required', icon: <ILock />, accent: true }] : [])];

  const adminItems = [
  { id: 'bank', label: 'Question bank', icon: <IBook /> },
  { id: 'generate', label: 'Generate with AI', icon: <ISpark /> },
  { id: 'review', label: 'AI review', icon: <IInbox />, badge: 4 },
  { id: 'students', label: 'Students', icon: <IUsers /> },
  { id: 'settings', label: 'Settings', icon: <ISettings /> }];


  // pick default screen when switching roles
  useEffectApp(() => {
    if (role === 'student' && !['dashboard', 'setup', 'question', 'results', 'booster'].includes(screen)) setScreen('dashboard');
    if (role === 'admin' && !['bank', 'generate', 'review', 'students', 'settings'].includes(screen)) setScreen('bank');
  }, [role]);

  const items = role === 'student' ? studentItems : adminItems;
  const screenId = screenIdFor(role, screen);
  const screenLabel = labelFor(role, screen);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-name">SAT Prep</div>
            <div className="brand-sub">{role === 'student' ? 'Student' : 'Admin'} workspace</div>
          </div>
        </div>

        <div className="seg" style={{ marginBottom: 12, alignSelf: 'stretch', display: 'flex' }}>
          <button className={role === 'student' ? 'on' : ''} onClick={() => setRole('student')} style={{ flex: 1 }}>Student</button>
          <button className={role === 'admin' ? 'on' : ''} onClick={() => setRole('admin')} style={{ flex: 1 }}>Admin</button>
        </div>

        {role === 'student' && (
          <div className="seg" style={{ marginBottom: 16, alignSelf: 'stretch', display: 'flex' }}>
            <button className={!lowScore ? 'on' : ''} onClick={() => { setLowScore(false); setBoosterDone(false); }} style={{ flex: 1, fontSize: 13 }}>Above 70%</button>
            <button className={lowScore ? 'on' : ''} onClick={() => { setLowScore(true); setBoosterDone(false); setScreen('results'); }} style={{ flex: 1, fontSize: 13 }}>Below 70%</button>
          </div>
        )}

        <div className="side-label" style={{ marginTop: role === 'admin' ? 4 : 0 }}>{role === 'student' ? 'Practice' : 'Content'}</div>
        {items.map((i) =>
        <button key={i.id}
        className={"side-item " + (screen === i.id ? 'active' : '')}
        disabled={i.locked}
        style={i.locked ? {opacity:.45, cursor:'not-allowed'} : (i.accent ? {background:'var(--accent-soft)', color:'var(--accent-ink)', fontWeight:500} : null)}
        onClick={() => !i.locked && setScreen(i.id)}>
            {i.icon}
            <span>{i.label}</span>
            {i.locked && <span style={{marginLeft:'auto', color:'var(--ink-4)'}}><ILock size={13}/></span>}
            {i.badge && <span className="tag tag-strong" style={{ marginLeft: 'auto', fontSize: 11, padding: '2px 7px' }}>{i.badge}</span>}
          </button>
        )}

        <div className="side-foot">
          <div className="side-user">
            <div className="avatar">LN</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {role === 'student' ? 'Linh Nguyễn' : 'Bảo Phạm'}
              </div>
              <div className="small muted">{role === 'student' ? 'Class of ’26' : 'Admin · Curriculum'}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="crumbs">
            {role === 'student' ? 'Practice' : 'Content'}
            <IChevR size={13} />
            <strong>{screenLabel}</strong>
          </div>
          <div className="top-actions">
            <button className="icon-btn"><ISearch /></button>
            <button className="icon-btn"><IBell /></button>
          </div>
        </div>

        {role === 'student' && screen === 'dashboard' && <StudentDashboard go={setScreen} />}
        {role === 'student' && screen === 'setup' && <SessionSetup go={setScreen} />}
        {role === 'student' && screen === 'question' && <QuestionScreen go={setScreen} />}
        {role === 'student' && screen === 'results' && <ResultsScreen go={setScreen} lowScore={lowScore} startBooster={() => setScreen('booster')} />}
        {role === 'student' && screen === 'booster' && <AdaptiveBooster go={setScreen} finish={() => { setBoosterDone(true); setLowScore(false); }} />}
        {role === 'admin' && screen === 'bank' && <AdminBank go={setScreen} />}
        {role === 'admin' && screen === 'generate' && <AdminGenerate go={setScreen} />}
        {role === 'admin' && screen === 'review' && <AdminReview go={setScreen} />}
        {role === 'admin' && (screen === 'students' || screen === 'settings') && <PlaceholderScreen title={labelFor(role, screen)} />}
      </main>

      <CommentLayer
        prototypeId={PROTOTYPE_ID}
        screenId={screenId}
        screenLabel={screenLabel}
        onNavigateScreen={(nextScreenId) => {
          const next = screenFromScreenId(nextScreenId);
          if (!next) return;
          setRole(next.role);
          setScreen(next.screen);
        }}
      />

      <div className={"tweaks " + (tweaks ? 'on' : '')}>
        <h4>Tweaks</h4>
        <div className="tweak-row">
          <label>Accent color</label>
          <div className="swatches">
            {Object.entries(ACCENTS).map(([k, v]) =>
            <div key={k}
            className={"sw " + (accent === k ? 'active' : '')}
            title={v.label}
            style={{ background: v.accent }}
            onClick={() => {
              setAccent(k);
              window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { accent: k } }, '*');
            }} />
            )}
          </div>
        </div>
        <div className="tweak-row">
          <label>Density</label>
          <div className="seg">
            {['compact', 'comfortable'].map((d) =>
            <button key={d} className={density === d ? 'on' : ''} onClick={() => {
              setDensity(d);
              window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { density: d } }, '*');
            }}>{d}</button>
            )}
          </div>
        </div>
        <div className="tweak-row">
          <label>Score variant</label>
          <div className="seg">
            <button className={!lowScore ? 'on' : ''} onClick={() => { setLowScore(false); setBoosterDone(false); }}>Above 70%</button>
            <button className={lowScore ? 'on' : ''} onClick={() => { setLowScore(true); setBoosterDone(false); setScreen('results'); }}>Below 70%</button>
          </div>
        </div>
        <div className="tweak-row">
          <label>Role</label>
          <div className="seg">
            <button className={role === 'student' ? 'on' : ''} onClick={() => setRole('student')}>Student</button>
            <button className={role === 'admin' ? 'on' : ''} onClick={() => setRole('admin')}>Admin</button>
          </div>
        </div>
      </div>
    </div>);

}

function labelFor(role, screen) {
  return {
    dashboard: 'Dashboard', setup: 'New session', question: 'Question', results: 'Results', booster: 'Adaptive booster',
    bank: 'Question bank', generate: 'Generate with AI', review: 'AI review queue', students: 'Students', settings: 'Settings'
  }[screen] || screen;
}

function screenIdFor(role, screen) {
  const map = {
    student: {
      dashboard: 'student.dashboard',
      setup: 'student.session_setup',
      question: 'student.question',
      results: 'student.results',
      booster: 'student.adaptive_booster'
    },
    admin: {
      bank: 'admin.question_bank',
      generate: 'admin.generate',
      review: 'admin.ai_review',
      students: 'admin.students',
      settings: 'admin.settings'
    }
  };
  return (map[role] && map[role][screen]) || `${role}.${screen}`;
}

function screenFromScreenId(screenId) {
  const map = {
    'student.dashboard': { role: 'student', screen: 'dashboard' },
    'student.session_setup': { role: 'student', screen: 'setup' },
    'student.question': { role: 'student', screen: 'question' },
    'student.results': { role: 'student', screen: 'results' },
    'student.adaptive_booster': { role: 'student', screen: 'booster' },
    'admin.question_bank': { role: 'admin', screen: 'bank' },
    'admin.generate': { role: 'admin', screen: 'generate' },
    'admin.ai_review': { role: 'admin', screen: 'review' },
    'admin.students': { role: 'admin', screen: 'students' },
    'admin.settings': { role: 'admin', screen: 'settings' }
  };
  return map[screenId] || null;
}

function installCommentStyles() {
  if (document.getElementById('prototype-comment-styles')) return;
  const style = document.createElement('style');
  style.id = 'prototype-comment-styles';
  style.textContent = `
    .comment-toolbar {
      position: fixed;
      right: 22px;
      bottom: 22px;
      z-index: 80;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      box-shadow: var(--shadow-lg);
    }
    .comment-toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--ink);
      font: 500 14px var(--sans);
      cursor: pointer;
    }
    .comment-toggle.on {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }
    .comment-overlay {
      position: absolute;
      inset: 0;
      width: 100%;
      min-height: 100%;
      z-index: 70;
      pointer-events: none;
    }
    .comment-overlay.active {
      cursor: crosshair;
      pointer-events: auto;
    }
    .comment-overlay.active::before {
      content: "";
      position: fixed;
      inset: 0;
      background: rgba(255, 255, 255, 0.08);
    }
    .comment-pin {
      position: absolute;
      z-index: 76;
      width: 30px;
      height: 30px;
      transform: translate(-50%, -50%);
      border-radius: 999px 999px 999px 4px;
      border: 2px solid #fff;
      background: #d65b00;
      color: #fff;
      box-shadow: 0 8px 22px rgba(20,20,20,.22);
      display: grid;
      place-items: center;
      font: 700 12px var(--sans);
      cursor: pointer;
      pointer-events: auto;
    }
    .comment-pin.resolved {
      background: var(--ink-4);
      opacity: .8;
    }
    .comment-pin.ai_task_draft {
      background: var(--accent);
    }
    .comment-card {
      position: fixed;
      z-index: 90;
      width: min(560px, calc(100vw - 32px));
      max-height: min(560px, calc(100vh - 32px));
      overflow: auto;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: var(--shadow-lg);
      padding: 18px;
    }
    .comment-scrim {
      position: fixed;
      inset: 0;
      z-index: 85;
      background: rgba(20, 20, 20, .12);
    }
    .comment-card textarea,
    .comment-card input {
      width: 100%;
    }
    .comment-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      color: var(--ink-3);
      font-size: 12px;
      margin-top: 6px;
    }
    .comment-empty {
      position: fixed;
      right: 22px;
      bottom: 74px;
      z-index: 75;
      max-width: 300px;
      padding: 10px 12px;
      border: 1px solid var(--accent-border);
      border-radius: 10px;
      background: var(--accent-soft);
      color: var(--accent-ink);
      box-shadow: var(--shadow);
      font-size: 12px;
      pointer-events: none;
    }
    .comment-inbox {
      position: fixed;
      right: 22px;
      bottom: 86px;
      z-index: 82;
      width: min(420px, calc(100vw - 32px));
      max-height: min(680px, calc(100vh - 112px));
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: var(--shadow-lg);
    }
    .comment-inbox-head {
      padding: 16px 18px;
      border-bottom: 1px solid var(--border);
    }
    .comment-list {
      overflow: auto;
      padding: 10px;
    }
    .comment-inbox-foot {
      padding: 12px;
      border-top: 1px solid var(--border);
      background: var(--surface);
    }
    .comment-list-empty {
      padding: 28px 18px;
      color: var(--ink-3);
      text-align: center;
      font-size: 13px;
    }
    .comment-list-item {
      width: 100%;
      display: grid;
      grid-template-columns: 28px 1fr;
      gap: 10px;
      text-align: left;
      padding: 12px;
      border: 1px solid transparent;
      border-radius: 12px;
      background: transparent;
      cursor: pointer;
    }
    .comment-list-item:hover {
      background: var(--surface-2);
      border-color: var(--border);
    }
    .comment-list-item.active {
      border-color: var(--accent-border);
      background: var(--accent-soft);
    }
    .comment-list-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 6px;
      color: var(--ink);
      font-weight: 600;
      font-size: 13px;
    }
    .comment-list-text {
      color: var(--ink-2);
      font-size: 13px;
      line-height: 1.45;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .comment-check {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      accent-color: var(--accent);
      cursor: pointer;
    }
    .comment-check:disabled {
      cursor: not-allowed;
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}

function nearbyElementLabel(x, y) {
  const ignored = ['comment-overlay', 'comment-toggle', 'comment-card', 'comment-pin', 'comment-scrim'];
  const elements = document.elementsFromPoint(x, y);
  const found = elements.find((el) => {
    if (!el || !el.classList) return false;
    if (ignored.some((className) => el.classList.contains(className))) return false;
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    const text = (el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || el.textContent || '').trim();
    return ['button', 'a', 'input', 'textarea', 'select'].includes(tag) || text.length > 0;
  });

  if (!found) return '';
  const label = found.getAttribute('aria-label') || found.getAttribute('title') || found.innerText || found.textContent || '';
  return label.trim().replace(/\s+/g, ' ').slice(0, 140);
}

function formatCommentDate(value) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return '';
  }
}

function commentStatusLabel(status) {
  if (status === 'ai_task_draft') return 'sent to Saola';
  if (status === 'resolved') return 'resolved';
  return 'open';
}

function CommentLayer({ prototypeId, screenId, screenLabel, onNavigateScreen }) {
  const [commentMode, setCommentMode] = useStateApp(false);
  const [inboxOpen, setInboxOpen] = useStateApp(false);
  const [comments, setComments] = useStateApp([]);
  const [draft, setDraft] = useStateApp(null);
  const [selected, setSelected] = useStateApp(null);
  const [selectedIds, setSelectedIds] = useStateApp([]);
  const [text, setText] = useStateApp('');
  const [createdBy, setCreatedBy] = useStateApp(() => localStorage.getItem('sat.commenter') || '');
  const [saving, setSaving] = useStateApp(false);
  const [error, setError] = useStateApp('');

  useEffectApp(() => {
    installCommentStyles();
  }, []);

  useEffectApp(() => {
    let cancelled = false;
    fetch(`/api/comments?prototypeId=${encodeURIComponent(prototypeId)}`, { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Unable to load comments')))
      .then((data) => {
        if (!cancelled) setComments(Array.isArray(data.comments) ? data.comments : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Unable to load comments');
      });
    return () => { cancelled = true; };
  }, [prototypeId]);

  useEffectApp(() => {
    setDraft(null);
    setSelected((current) => current && current.screenId === screenId ? current : null);
    setText('');
  }, [screenId]);

  useEffectApp(() => {
    if (!selected || selected.screenId !== screenId) return;
    const timer = setTimeout(() => {
      const pinY = selected.yPercent * pageHeight();
      const pinX = selected.xPercent * pageWidth();
      window.scrollTo({
        top: Math.max(0, pinY - window.innerHeight * 0.38),
        left: Math.max(0, pinX - window.innerWidth * 0.5),
        behavior: 'smooth'
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [selected, screenId]);

  useEffectApp(() => {
    if (createdBy.trim()) localStorage.setItem('sat.commenter', createdBy.trim());
  }, [createdBy]);

  useEffectApp(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setCommentMode(false);
        setDraft(null);
        setSelected(null);
        setInboxOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const visibleComments = comments.filter((comment) => comment.screenId === screenId);
  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const selectedComments = comments.filter((comment) => selectedIds.includes(comment.id));

  function pageWidth() {
    return Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth);
  }

  function pageHeight() {
    return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);
  }

  function startDraft(event) {
    if (!commentMode) return;
    if (event.target.closest('.comment-card, .comment-toggle, .comment-pin, .comment-inbox')) return;
    const viewportX = event.clientX;
    const viewportY = event.clientY;
    const x = viewportX + window.scrollX;
    const y = viewportY + window.scrollY;
    setSelected(null);
    setText('');
    setDraft({
      x,
      y,
      viewportX,
      viewportY,
      xPercent: x / Math.max(1, pageWidth()),
      yPercent: y / Math.max(1, pageHeight()),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      elementLabel: nearbyElementLabel(viewportX, viewportY)
    });
  }

  function cardPosition(point) {
    const width = Math.min(560, window.innerWidth - 32);
    const height = 360;
    const left = Math.min(Math.max(16, point.x + 18), window.innerWidth - width - 16);
    const top = Math.min(Math.max(16, point.y + 18), window.innerHeight - height - 16);
    return { left, top };
  }

  function closeCard() {
    setDraft(null);
    setSelected(null);
    setText('');
    setError('');
  }

  function saveComment(status) {
    const body = draft;
    const commentBody = text.trim();
    if (!body || !commentBody) return;
    setSaving(true);
    setError('');
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prototypeId,
        screenId,
        screenLabel,
        x: body.x,
        y: body.y,
        xPercent: body.xPercent,
        yPercent: body.yPercent,
        viewportWidth: body.viewportWidth,
        viewportHeight: body.viewportHeight,
        elementLabel: body.elementLabel,
        commentText: commentBody,
        status,
        createdBy: createdBy.trim() || 'Reviewer'
      })
    })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Unable to save comment')))
      .then((data) => {
        setComments([...comments, data.comment]);
        closeCard();
      })
      .catch((err) => setError(err.message || 'Unable to save comment'))
      .finally(() => setSaving(false));
  }

  function patchStatus(comment, status) {
    return fetch('/api/comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: comment.id, status })
    })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Unable to update comment')))
      .then((data) => data.comment);
  }

  function updateStatus(comment, status) {
    setSaving(true);
    patchStatus(comment, status)
      .then((updated) => {
        setComments(comments.map((item) => item.id === comment.id ? updated : item));
        setSelected(updated);
      })
      .catch((err) => setError(err.message || 'Unable to update comment'))
      .finally(() => setSaving(false));
  }

  function sendSelectedToSaola() {
    const targets = selectedComments.filter((comment) => comment.status !== 'ai_task_draft');
    if (targets.length === 0) return;
    setSaving(true);
    Promise.all(targets.map((comment) => patchStatus(comment, 'ai_task_draft')))
      .then((updatedComments) => {
        const updatedById = Object.fromEntries(updatedComments.map((comment) => [comment.id, comment]));
        setComments(comments.map((comment) => updatedById[comment.id] || comment));
        setSelected((current) => current && updatedById[current.id] ? updatedById[current.id] : current);
        setSelectedIds([]);
      })
      .catch((err) => setError(err.message || 'Unable to send selected comments'))
      .finally(() => setSaving(false));
  }

  function openComment(comment) {
    setDraft(null);
    setSelected(comment);
    setText('');
    setInboxOpen(false);
    if (comment.screenId !== screenId) onNavigateScreen(comment.screenId);
  }

  function toggleSelected(commentId) {
    setSelectedIds((ids) => ids.includes(commentId)
      ? ids.filter((id) => id !== commentId)
      : [...ids, commentId]
    );
  }

  const activePoint = draft || selected;
  const position = activePoint ? cardPosition({
    x: draft ? draft.viewportX : selected.xPercent * pageWidth() - window.scrollX,
    y: draft ? draft.viewportY : selected.yPercent * pageHeight() - window.scrollY
  }) : null;

  return (
    <>
      <div className="comment-toolbar">
        <button
          className={"comment-toggle " + (inboxOpen ? 'on' : '')}
          onClick={() => setInboxOpen(!inboxOpen)}
          title="Open prototype comments"
        >
          Comments
          {comments.length > 0 && <span className="tag" style={{ background: inboxOpen ? 'rgba(255,255,255,.18)' : 'var(--surface-2)', color: inboxOpen ? '#fff' : 'var(--ink-2)' }}>{comments.length}</span>}
        </button>
        <button
          className={"comment-toggle " + (commentMode ? 'on' : '')}
          onClick={() => {
            setCommentMode(!commentMode);
            setInboxOpen(false);
          }}
          title="Toggle add pin mode"
        >
          {commentMode ? 'Adding pin' : 'Add pin'}
        </button>
      </div>

      {inboxOpen && (
        <div className="comment-inbox">
          <div className="comment-inbox-head">
            <div className="row between">
              <div>
                <div className="small muted">Prototype feedback</div>
                <h3 style={{ fontSize: 18, marginTop: 3 }}>All comments</h3>
              </div>
              <button className="icon-btn" onClick={() => setInboxOpen(false)}>×</button>
            </div>
          </div>
          <div className="comment-list">
            {sortedComments.length === 0 && (
              <div className="comment-list-empty">No comments yet. Turn on comment mode to place the first one.</div>
            )}
            {sortedComments.map((comment) => (
              <button
                key={comment.id}
                className={"comment-list-item " + (selected && selected.id === comment.id ? 'active' : '')}
                onClick={() => openComment(comment)}
              >
                <input
                  className="comment-check"
                  type="checkbox"
                  checked={comment.status === 'ai_task_draft' || selectedIds.includes(comment.id)}
                  disabled={comment.status === 'ai_task_draft'}
                  onClick={(event) => event.stopPropagation()}
                  onChange={() => toggleSelected(comment.id)}
                  aria-label={`Select comment on ${comment.screenLabel}`}
                />
                <div>
                  <div className="comment-list-title">
                    <span>{comment.screenLabel}</span>
                    <span className="tag" style={{ fontSize: 11 }}>{commentStatusLabel(comment.status)}</span>
                  </div>
                  <div className="comment-list-text">{comment.commentText}</div>
                  <div className="comment-meta">
                    <span>{comment.createdBy || 'Reviewer'}</span>
                    <span>·</span>
                    <span>{formatCommentDate(comment.createdAt)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="comment-inbox-foot">
            {error && <div className="small" style={{ color: 'var(--bad)', marginBottom: 8 }}>{error}</div>}
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={saving || selectedComments.filter((comment) => comment.status !== 'ai_task_draft').length === 0}
              onClick={sendSelectedToSaola}
            >
              Send To Saola
            </button>
          </div>
        </div>
      )}

      {commentMode && !draft && !selected && !inboxOpen && (
        <div className="comment-empty">
          Add pin is on. Click anywhere on this screen to leave feedback.
        </div>
      )}

      <div className={"comment-overlay " + (commentMode ? 'active' : '')} onClick={startDraft}>
        {visibleComments.map((comment, index) => (
          <button
            key={comment.id}
            className={"comment-pin " + comment.status}
            style={{
              left: `${comment.xPercent * pageWidth()}px`,
              top: `${comment.yPercent * pageHeight()}px`
            }}
            onClick={(event) => {
              event.stopPropagation();
              openComment(comment);
            }}
            title={comment.commentText}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {(draft || selected) && <div className="comment-scrim" onClick={closeCard} />}

      {draft && position && (
        <div className="comment-card" style={{ left: position.left, top: position.top }}>
          <div className="row between" style={{ marginBottom: 14 }}>
            <div>
              <div className="small muted">New comment</div>
              <h3 style={{ fontSize: 18, marginTop: 3 }}>{screenLabel}</h3>
            </div>
            <button className="icon-btn" onClick={closeCard}>×</button>
          </div>
          {draft.elementLabel && (
            <div className="small muted" style={{ marginBottom: 10 }}>
              Near: <span style={{ color: 'var(--ink-2)' }}>{draft.elementLabel}</span>
            </div>
          )}
          <label className="col" style={{ gap: 6, marginBottom: 12 }}>
            <span className="small muted">Your name</span>
            <input value={createdBy} onChange={(event) => setCreatedBy(event.target.value)} placeholder="Reviewer name" />
          </label>
          <textarea
            rows="4"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What should change here?"
            style={{ resize: 'vertical', marginBottom: 12 }}
            autoFocus
          />
          {error && <div className="small" style={{ color: 'var(--bad)', marginBottom: 10 }}>{error}</div>}
          <div className="row between" style={{ gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => saveComment('open')} disabled={saving || !text.trim()}>
              Comment
            </button>
            <button className="btn btn-primary" onClick={() => saveComment('ai_task_draft')} disabled={saving || !text.trim()}>
              Send To Saola
            </button>
          </div>
        </div>
      )}

      {selected && position && (
        <div className="comment-card" style={{ left: position.left, top: position.top }}>
          <div className="row between" style={{ marginBottom: 12 }}>
            <div>
              <div className="small muted">{selected.status === 'ai_task_draft' ? 'Sent to Saola' : selected.status === 'resolved' ? 'Resolved comment' : 'Comment'}</div>
              <h3 style={{ fontSize: 18, marginTop: 3 }}>{selected.screenLabel}</h3>
            </div>
            <button className="icon-btn" onClick={closeCard}>×</button>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 12 }}>{selected.commentText}</p>
          {selected.elementLabel && (
            <div className="small muted" style={{ marginBottom: 8 }}>
              Near: <span style={{ color: 'var(--ink-2)' }}>{selected.elementLabel}</span>
            </div>
          )}
          <div className="comment-meta">
            <span>{selected.createdBy || 'Reviewer'}</span>
            <span>·</span>
            <span>{formatCommentDate(selected.createdAt)}</span>
            <span className="tag" style={{ fontSize: 11 }}>{commentStatusLabel(selected.status)}</span>
          </div>
          {error && <div className="small" style={{ color: 'var(--bad)', marginTop: 10 }}>{error}</div>}
          <div className="row" style={{ gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
            {selected.status === 'resolved' ? (
              <button className="btn btn-ghost" disabled={saving} onClick={() => updateStatus(selected, 'open')}>Reopen</button>
            ) : (
              <button className="btn btn-ghost" disabled={saving} onClick={() => updateStatus(selected, 'resolved')}>Resolve</button>
            )}
            {selected.status !== 'ai_task_draft' && (
              <button className="btn btn-primary" disabled={saving} onClick={() => updateStatus(selected, 'ai_task_draft')}>
                Send To Saola
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function PlaceholderScreen({ title }) {
  return (
    <div className="view screen">
      <h1>{title}</h1>
      <p className="muted" style={{ marginTop: 10, maxWidth: 520 }}>Not part of this round — focusing on Question bank and AI review queue for the admin side.</p>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
