// Admin · Generate questions with AI — Phase 1 (simple form).
const { useState: useStateG } = React;

const SUBTOPICS = {
  'Reading': ['Central idea', 'Command of evidence', 'Data inferences', 'Word in context', 'Text structure', 'Transitions', 'Rhetorical synthesis', 'Boundaries', 'Subject-verb agreement'],
  'Math':    ['Linear equations', 'Systems of equations', 'Inequalities', 'Quadratics', 'Exponentials', 'Polynomials', 'Ratios & rates', 'Percentages', 'Statistics', 'Circle theorems', 'Triangle properties', 'Trigonometry'],
};

function AdminGenerate({ go }){
  const [subject,    setSubject]    = useStateG('Reading');
  const [subtopic,   setSubtopic]   = useStateG('Any');
  const [difficulty, setDifficulty] = useStateG('Medium');
  const [count,      setCount]      = useStateG(5);

  function changeSubject(s){ setSubject(s); setSubtopic('Any'); }
  const [loading,    setLoading]    = useStateG(false);
  const [done,       setDone]       = useStateG(false);

  function generate(){
    setLoading(true);
    setDone(false);
    setTimeout(() => { setLoading(false); setDone(true); }, 1200);
  }

  function reset(){ setDone(false); }

  if(done){
    return (
      <div className="view screen" data-screen-label="Admin · Generate questions">
        <div style={{maxWidth: 520, margin:'80px auto 0', textAlign:'center'}}>
          <div style={{width:64, height:64, margin:'0 auto 20px', borderRadius:'50%',
            background:'var(--ok-soft)', color:'var(--ok)', display:'grid', placeItems:'center'}}>
            <ICheck size={28}/>
          </div>
          <h2 style={{fontFamily:'var(--serif)', marginBottom:10}}>Sent to review queue</h2>
          <p className="muted" style={{fontSize:14, marginBottom:28, maxWidth:380, margin:'0 auto 28px'}}>
            <span className="num" style={{color:'var(--ink)', fontWeight:500}}>{count}</span> AI-generated {count===1?'question':'questions'} ({subject}{subtopic !== 'Any' ? ` · ${subtopic}` : ''} · {difficulty}) are now pending approval in the AI Review Queue.
          </p>
          <div className="row" style={{gap:12, justifyContent:'center'}}>
            <button className="btn btn-ghost" onClick={reset}>
              <ISpark/> Generate more
            </button>
            <button className="btn btn-primary" onClick={() => go && go('review')}>
              Open review queue <IArrow/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view screen" data-screen-label="Admin · Generate questions">
      <div className="row between" style={{marginBottom: 32}}>
        <div>
          <div className="small muted">Content · AI tools</div>
          <div className="row" style={{gap:12, alignItems:'center', marginTop: 6}}>
            <h1>Generate questions</h1>
            <span className="tag"><ISpark size={11}/> AI-generated</span>
          </div>
          <p className="muted" style={{marginTop: 6, fontSize: 14, maxWidth: 560}}>
            AI-generated drafts route directly to the review queue for approval before going live.
          </p>
        </div>
      </div>

      <div style={{maxWidth: 560}}>
        <div className="card" style={{padding: 28}}>
          <div className="col" style={{gap: 28}}>

            {/* Subject */}
            <div>
              <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.07em', fontWeight:500, marginBottom: 12}}>Subject</div>
              <div className="seg" style={{padding:3}}>
                {['Math','Reading'].map(s => (
                  <button key={s}
                          className={subject===s ? 'on' : ''}
                          onClick={() => changeSubject(s)}
                          style={{padding:'9px 20px', fontSize:14}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-topic */}
            <div>
              <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.07em', fontWeight:500, marginBottom: 12}}>Sub-topic</div>
              <div style={{display:'flex', flexWrap:'wrap', gap: 8}}>
                {['Any', ...SUBTOPICS[subject]].map(t => (
                  <button key={t}
                          onClick={() => setSubtopic(t)}
                          className="tag"
                          style={{
                            cursor:'pointer', padding:'7px 12px', fontSize: 13,
                            background: subtopic===t ? 'var(--accent)' : 'var(--surface)',
                            borderColor: subtopic===t ? 'var(--accent)' : 'var(--border)',
                            color: subtopic===t ? '#fff' : 'var(--ink-2)',
                          }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.07em', fontWeight:500, marginBottom: 12}}>Difficulty</div>
              <div className="row" style={{gap: 10, flexWrap:'wrap'}}>
                {['Easy','Medium','Hard'].map(d => {
                  const map = { Easy:{bg:'#EDF2ED',fg:'#406348'}, Medium:{bg:'#F1EEE6',fg:'#6B5B37'}, Hard:{bg:'#F1E7E4',fg:'#7A3D35'} };
                  const s = map[d];
                  const on = difficulty === d;
                  return (
                    <button key={d}
                            onClick={() => setDifficulty(d)}
                            style={{
                              padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                              border: '1px solid ' + (on ? 'transparent' : 'var(--border)'),
                              background: on ? s.bg : 'var(--surface)',
                              color: on ? s.fg : 'var(--ink-3)',
                              cursor: 'pointer', fontFamily: 'var(--sans)',
                            }}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.07em', fontWeight:500, marginBottom: 12}}>
                Quantity <span style={{textTransform:'none', letterSpacing:0, fontWeight:400}}>— 1 to 10 per run</span>
              </div>
              <div className="row" style={{gap: 16, alignItems:'center'}}>
                <div className="stepper">
                  <button onClick={() => setCount(Math.max(1, count-1))}>–</button>
                  <div className="val num">{count}</div>
                  <button onClick={() => setCount(Math.min(10, count+1))}>+</button>
                </div>
                <input type="range" min="1" max="10" value={count}
                       onChange={e => setCount(Number(e.target.value))}
                       style={{flex:1, accentColor:'var(--accent)'}}/>
                <div className="row" style={{gap: 6}}>
                  {[1,3,5,10].map(n => (
                    <button key={n}
                            className={"btn " + (count===n ? 'btn-primary' : 'btn-ghost')}
                            style={{padding:'7px 12px', fontSize:13}}
                            onClick={() => setCount(n)}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="divider"/>

            {/* Generate */}
            <div>
              <div className="row between" style={{marginBottom: 10}}>
                <div className="small muted">
                  <IClock size={13}/> Est. {Math.max(8, count*4)}s · drafts → AI review queue
                </div>
              </div>
              <button className="btn btn-primary btn-lg"
                      style={{width:'100%', justifyContent:'center'}}
                      disabled={loading}
                      onClick={generate}>
                {loading
                  ? <><span className="dot-pulse" style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,255,255,.8)',display:'inline-block'}}/> Generating…</>
                  : <><ISpark size={15}/> Generate {count} {count===1?'question':'questions'}</>
                }
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes dotpulse{0%,100%{opacity:.4;transform:scale(.85)}50%{opacity:1;transform:scale(1.15)}}
          .dot-pulse{animation:dotpulse 1.1s ease-in-out infinite}
        `}</style>
      </div>
    </div>
  );
}

Object.assign(window, { AdminGenerate });
