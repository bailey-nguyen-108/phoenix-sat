// Auth screens — Student login/signup + Admin login
const { useState: useStateAuth } = React;

function AuthGate({ onAuth }) {
  const [role, setRole]       = useStateAuth('student'); // 'student' | 'admin'
  const [mode, setMode]       = useStateAuth('login');   // 'login' | 'signup' | 'forgot' | 'forgot-sent' | 'reset'
  const [name, setName]       = useStateAuth('');
  const [email, setEmail]     = useStateAuth('');
  const [pass, setPass]       = useStateAuth('');
  const [pass2, setPass2]     = useStateAuth('');
  const [newPass, setNewPass]   = useStateAuth('');
  const [newPass2, setNewPass2] = useStateAuth('');
  const [error, setError]     = useStateAuth('');
  const [loading, setLoading] = useStateAuth(false);

  function switchRole(r){ setRole(r); setMode('login'); setError(''); }
  function switchMode(m){ setMode(m); setError(''); }

  function submit(e){
    e.preventDefault();
    setError('');
    if(mode === 'signup'){
      if(!name.trim()){ setError('Please enter your name.'); return; }
      if(!email.trim()){ setError('Please enter your email.'); return; }
      if(pass.length < 6){ setError('Password must be at least 6 characters.'); return; }
      if(pass !== pass2){ setError('Passwords don\'t match.'); return; }
    } else if(mode === 'forgot'){
      if(!email.trim()){ setError('Please enter your email address.'); return; }
      switchMode('forgot-sent');
      return;
    } else if(mode === 'reset'){
      if(newPass.length < 6){ setError('Password must be at least 6 characters.'); return; }
      if(newPass !== newPass2){ setError('Passwords don\'t match.'); return; }
      onAuth(role);
      return;
    } else {
      if(!email.trim()){ setError('Please enter your email.'); return; }
      if(!pass){ setError('Please enter your password.'); return; }
    }
    onAuth(role);
  }

  const isStudent = role === 'student';

  // ── Forgot-password: sent confirmation ──────────────────
  if(mode === 'forgot-sent'){
    return (
      <AuthShell>
        <div className="card" style={{width:'100%', maxWidth:420, padding:'36px 28px', textAlign:'center'}}>
          <div style={{
            width:52, height:52, borderRadius:'50%',
            background:'var(--accent-soft)', border:'1px solid var(--accent-border)',
            display:'grid', placeItems:'center', margin:'0 auto 20px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2 style={{fontFamily:'var(--serif)', fontSize:22, marginBottom:8}}>Check your inbox</h2>
          <p className="muted" style={{fontSize:13.5, marginBottom:24, lineHeight:1.6}}>
            We sent a password reset link to <strong style={{color:'var(--ink)'}}>{email || 'your email'}</strong>.
            It expires in 30 minutes.
          </p>
          <button className="btn btn-primary btn-lg" style={{width:'100%', justifyContent:'center'}}
                  onClick={() => switchMode('reset')}>
            Continue to reset password
          </button>
          <div style={{marginTop:16, fontSize:13, color:'var(--ink-3)'}}>
            Didn't get it?{' '}
            <button type="button" onClick={() => switchMode('forgot')}
              style={{background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontWeight:500, fontFamily:'var(--sans)', padding:0}}>
              Resend
            </button>
            {' '}or{' '}
            <button type="button" onClick={() => switchMode('login')}
              style={{background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontWeight:500, fontFamily:'var(--sans)', padding:0}}>
              back to sign in
            </button>
          </div>
        </div>
        <div className="small muted" style={{marginTop:24}}>Prototype — no real authentication</div>
      </AuthShell>
    );
  }

  // ── Reset password form ──────────────────────────────────
  if(mode === 'reset'){
    return (
      <AuthShell>
        <div className="card" style={{width:'100%', maxWidth:420, padding:0, overflow:'hidden'}}>
          <form onSubmit={submit} style={{padding:'28px 28px 24px'}}>
            <h2 style={{fontFamily:'var(--serif)', fontSize:22, marginBottom:4}}>Set a new password</h2>
            <p className="muted" style={{fontSize:13, marginBottom:24}}>
              Choose a strong password — at least 6 characters.
            </p>
            <div className="col" style={{gap:14}}>
              <label className="col" style={{gap:6}}>
                <span className="small muted">New password</span>
                <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)}
                       placeholder="••••••••" autoFocus style={{width:'100%'}}/>
              </label>
              <label className="col" style={{gap:6}}>
                <span className="small muted">Confirm new password</span>
                <input type="password" value={newPass2} onChange={e=>setNewPass2(e.target.value)}
                       placeholder="••••••••" style={{width:'100%'}}/>
              </label>
            </div>
            {error && (
              <div style={{marginTop:14, padding:'10px 14px', borderRadius:8,
                background:'var(--bad-soft)', color:'var(--bad)', fontSize:13,
                border:'1px solid color-mix(in srgb, var(--bad) 20%, white)'}}>
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-lg"
              style={{width:'100%', justifyContent:'center', marginTop:22}}>
              Reset password &amp; sign in
            </button>
            <div style={{marginTop:16, textAlign:'center', fontSize:13, color:'var(--ink-3)'}}>
              <button type="button" onClick={() => switchMode('login')}
                style={{background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontWeight:500, fontFamily:'var(--sans)', padding:0}}>
                ← Back to sign in
              </button>
            </div>
          </form>
        </div>
        <div className="small muted" style={{marginTop:24}}>Prototype — no real authentication</div>
      </AuthShell>
    );
  }

  // ── Forgot password: email entry ─────────────────────────
  if(mode === 'forgot'){
    return (
      <AuthShell>
        <div className="card" style={{width:'100%', maxWidth:420, padding:0, overflow:'hidden'}}>
          <form onSubmit={submit} style={{padding:'28px 28px 24px'}}>
            <h2 style={{fontFamily:'var(--serif)', fontSize:22, marginBottom:4}}>Forgot your password?</h2>
            <p className="muted" style={{fontSize:13, marginBottom:24}}>
              Enter the email address on your account and we'll send a reset link.
            </p>
            <label className="col" style={{gap:6}}>
              <span className="small muted">Email</span>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                     placeholder="you@example.com" autoFocus style={{width:'100%'}}/>
            </label>
            {error && (
              <div style={{marginTop:14, padding:'10px 14px', borderRadius:8,
                background:'var(--bad-soft)', color:'var(--bad)', fontSize:13,
                border:'1px solid color-mix(in srgb, var(--bad) 20%, white)'}}>
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-lg"
              style={{width:'100%', justifyContent:'center', marginTop:22}}>
              Send reset link
            </button>
            <div style={{marginTop:16, textAlign:'center', fontSize:13, color:'var(--ink-3)'}}>
              <button type="button" onClick={() => switchMode('login')}
                style={{background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontWeight:500, fontFamily:'var(--sans)', padding:0}}>
                ← Back to sign in
              </button>
            </div>
          </form>
        </div>
        <div className="small muted" style={{marginTop:24}}>Prototype — no real authentication</div>
      </AuthShell>
    );
  }

  // ── Main login / signup ──────────────────────────────────
  return (
    <AuthShell>
      <div className="card" style={{width:'100%', maxWidth:420, padding:0, overflow:'hidden'}}>
        {/* Role tabs */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:'1px solid var(--border)'}}>
          {['student','admin'].map(r => (
            <button key={r} onClick={() => switchRole(r)} style={{
              padding:'14px 0', border:'none', cursor:'pointer',
              fontFamily:'var(--sans)', fontSize:14, fontWeight:500,
              background: role===r ? 'var(--surface)' : 'var(--surface-2)',
              color: role===r ? 'var(--ink)' : 'var(--ink-4)',
              borderBottom: role===r ? '2px solid var(--accent)' : '2px solid transparent',
              transition:'color .15s, border-color .15s',
            }}>
              {r==='student' ? 'Student' : 'Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{padding:'28px 28px 24px'}}>
          <h2 style={{fontFamily:'var(--serif)', fontSize:22, marginBottom:4}}>
            {isStudent
              ? (mode==='login' ? 'Welcome back' : 'Create an account')
              : 'Admin sign in'}
          </h2>
          <p className="muted" style={{fontSize:13, marginBottom:24}}>
            {isStudent
              ? (mode==='login' ? 'Sign in to continue your practice.' : 'Join to start your SAT prep.')
              : 'Sign in to manage the question bank and review queue.'}
          </p>

          <div className="col" style={{gap:14}}>
            {isStudent && mode==='signup' && (
              <label className="col" style={{gap:6}}>
                <span className="small muted">Full name</span>
                <input type="text" value={name} onChange={e=>setName(e.target.value)}
                       placeholder="Linh Nguyễn" autoFocus style={{width:'100%'}}/>
              </label>
            )}
            <label className="col" style={{gap:6}}>
              <span className="small muted">Email</span>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                     placeholder="you@example.com"
                     autoFocus={!(isStudent && mode==='signup')}
                     style={{width:'100%'}}/>
            </label>
            <div className="col" style={{gap:6}}>
              <div className="row between">
                <span className="small muted">Password</span>
                {isStudent && mode==='login' && (
                  <button type="button" onClick={() => switchMode('forgot')}
                    style={{background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontWeight:500, fontFamily:'var(--sans)', padding:0, fontSize:12.5}}>
                    Forgot password?
                  </button>
                )}
              </div>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
                     placeholder="••••••••" style={{width:'100%'}}/>
            </div>
            {isStudent && mode==='signup' && (
              <label className="col" style={{gap:6}}>
                <span className="small muted">Confirm password</span>
                <input type="password" value={pass2} onChange={e=>setPass2(e.target.value)}
                       placeholder="••••••••" style={{width:'100%'}}/>
              </label>
            )}
          </div>

          {error && (
            <div style={{marginTop:14, padding:'10px 14px', borderRadius:8,
              background:'var(--bad-soft)', color:'var(--bad)', fontSize:13,
              border:'1px solid color-mix(in srgb, var(--bad) 20%, white)'}}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
            style={{width:'100%', justifyContent:'center', marginTop:22, opacity:loading ? .7 : 1}}>
            {loading ? 'Signing in…' : isStudent ? (mode==='login' ? 'Sign in' : 'Create account') : 'Sign in'}
          </button>

          {isStudent && (
            <div style={{marginTop:18, textAlign:'center', fontSize:13, color:'var(--ink-3)'}}>
              {mode==='login'
                ? <>Don't have an account?{' '}
                    <button type="button" onClick={() => switchMode('signup')}
                      style={{background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontWeight:500, fontFamily:'var(--sans)', padding:0}}>
                      Sign up
                    </button>
                  </>
                : <>Already have an account?{' '}
                    <button type="button" onClick={() => switchMode('login')}
                      style={{background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontWeight:500, fontFamily:'var(--sans)', padding:0}}>
                      Sign in
                    </button>
                  </>
              }
            </div>
          )}
        </form>
      </div>
      <div className="small muted" style={{marginTop:24}}>Prototype — no real authentication</div>
    </AuthShell>
  );
}

function AuthShell({ children }) {
  return (
    <div style={{minHeight:'100vh', background:'var(--bg)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'24px', fontFamily:'var(--sans)'}}>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8, marginBottom:32}}>
        <img
          src="/phoenix-prep-logo.png"
          alt="Phoenix Prep"
          style={{ display:'block', width:260, maxWidth:'72vw', height:'auto' }}
        />
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { AuthGate });
