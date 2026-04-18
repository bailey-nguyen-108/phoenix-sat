// Top-level shell: sidebar navigation, role switching, Tweaks panel.
const { useState: useStateApp, useEffect: useEffectApp } = React;

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
            <strong>{labelFor(role, screen)}</strong>
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

function PlaceholderScreen({ title }) {
  return (
    <div className="view screen">
      <h1>{title}</h1>
      <p className="muted" style={{ marginTop: 10, maxWidth: 520 }}>Not part of this round — focusing on Question bank and AI review queue for the admin side.</p>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);