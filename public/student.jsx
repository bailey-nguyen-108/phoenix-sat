// Student-facing screens: Dashboard, Session setup, Question, Results.
const { useState } = React;

/* ---------------- Dashboard ---------------- */
function StudentDashboard({ go }) {
  const d = DASHBOARD;
  return (
    <div className="view screen" data-screen-label="Student · Dashboard">
      <div className="row between" style={{marginBottom: 28}}>
        <div>
          <div className="small muted" style={{marginBottom: 6}}>Thursday · April 18</div>
          <h1>Chào, {d.name}.</h1>
          <p className="muted" style={{marginTop: 8, fontSize: 15, maxWidth: 520}}>
            You’re on a {d.streak}-day streak. Keep it moving — 20 minutes today keeps your pacing on track for the May test.
          </p>
        </div>
        <div className="col" style={{alignItems:'flex-end', gap:10}}>
          <button className="btn btn-primary btn-lg" onClick={() => go('setup')}>
            Start practice <IArrow />
          </button>
          <div className="small muted">~ 15–20 min · picks up your weak topics</div>
        </div>
      </div>

      <div className="grid-4" style={{marginBottom: 24}}>
        <StatCard label="Day streak"   value={<><span>{d.streak}</span><span style={{fontSize:22, color:'var(--ink-3)'}}> days</span></>}
                  sub={<span className="row" style={{gap:6}}><IFire size={13}/> longest: 18</span>}
                  accent="var(--orange)" />
        <StatCard label="Sessions"     value={d.sessions} sub="completed this month" />
        <StatCard label="Avg accuracy" value={<span className="num">{Math.round(d.avgAccuracy*100)}%</span>}
                  sub="last 14 sessions" />
        <StatCard label="Recent score" value={<span className="num">{d.estScore}</span>}
                  sub="last full session" />
      </div>

      <div className="grid-2">
        <div className="card" style={{padding: 24}}>
          <div className="row between" style={{marginBottom: 14}}>
            <h3>Weak sub-topics</h3>
            <span className="small muted">Ranked by recent accuracy</span>
          </div>
          <p className="small muted" style={{marginBottom: 16, maxWidth: 520}}>
            The practice engine will weight these first in your next session. Tap a tag to drill it specifically.
          </p>
          <div style={{display:'flex', flexWrap:'wrap', gap: 10, marginBottom: 18}}>
            {d.weakTopics.map(t => (
              <button key={t.tag} className="tag tag-strong" style={{cursor:'pointer', padding: '7px 12px', fontSize:13}}>
                {t.tag}
                <span style={{color:'var(--ink-4)', marginLeft: 6, fontVariantNumeric:'tabular-nums'}}>
                  {Math.round(t.accuracy*100)}%
                </span>
              </button>
            ))}
          </div>

          <div className="divider" style={{margin:'6px 0 18px'}}/>
          <div className="row between" style={{marginBottom: 12}}>
            <h3 style={{fontSize:16}}>Last 4 sessions</h3>
          </div>
          <div className="col" style={{gap: 10}}>
            {d.recent.map((r, i) => {
              const pct = Math.round(r.correct / r.total * 100);
              return (
                <div key={i} className="row" style={{gap: 14}}>
                  <div className="mono small" style={{width: 40, color:'var(--ink-3)'}}>{r.date}</div>
                  <div style={{width: 52, fontSize: 13}}>{r.subject}</div>
                  <div style={{flex:1}}>
                    <div className="pbar"><span style={{width: pct+'%'}}/></div>
                  </div>
                  <div className="num small" style={{width: 70, textAlign:'right', color:'var(--ink-2)'}}>
                    {r.correct}<span className="muted">/{r.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col" style={{gap: 16}}>
          <div className="card" style={{padding: 24}}>
            <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.08em', fontWeight:500, marginBottom: 12}}>Last session scores</div>
            <div className="row" style={{gap: 20, alignItems:'center'}}>
              <ScoreDonut value={d.estScore} max={1600} />
              <div className="col" style={{gap: 10, flex: 1}}>
                <Line label="Math"              val={670} max={800} />
                <Line label="Reading" val={670} max={800} />
              </div>
            </div>

          </div>

          <div className="card" style={{padding: 24}}>
            <div className="row between" style={{marginBottom: 10}}>
              <h3 style={{fontSize: 17}}>Next up</h3>

            </div>
            <p className="muted" style={{fontSize: 14, marginBottom: 14}}>
              We built a focused set around your two weakest topics. 12 questions, mixed difficulty.
            </p>
            <div className="row" style={{gap: 8, flexWrap:'wrap', marginBottom: 16}}>
              <span className="tag">Transitions · 5</span>
              <span className="tag">Linear equations · 4</span>
              <span className="tag">Mixed review · 3</span>
            </div>
            <button className="btn btn-ghost" onClick={() => go('setup')}>
              Customize <IArrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="card card-hov stat" style={accent ? {borderTop: `3px solid ${accent}`} : {}}>
      <div className="label">{label}</div>
      <div className="value num" style={accent ? {color: accent} : {}}>{value}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}

function Line({label, val, max}) {
  const pct = val/max*100;
  return (
    <div>
      <div className="row between" style={{marginBottom:4}}>
        <span style={{fontSize:13, color:'var(--ink-2)'}}>{label}</span>
        <span className="num small" style={{color:'var(--ink)'}}>{val}<span className="muted">/{max}</span></span>
      </div>
      <div className="pbar"><span style={{width: pct+'%'}}/></div>
    </div>
  );
}

function ScoreDonut({ value, max }) {
  const pct = value/max;
  const r = 64, c = 2 * Math.PI * r;
  return (
    <div className="donut">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--border-2)" strokeWidth="10"/>
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--accent)" strokeWidth="10"
                strokeDasharray={c} strokeDashoffset={c*(1-pct)}
                strokeLinecap="round"
                transform="rotate(-90 80 80)" />
      </svg>
      <div className="lbl">
        <div className="big num">{value}</div>
        <div className="small">/ {max}</div>
      </div>
    </div>
  );
}

/* ---------------- Session Setup ---------------- */
function SessionSetup({ go }) {
  const [subject, setSubject]       = useState('Math');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount]           = useState(15);
  const [subtopic, setSubtopic]     = useState('Any');

  const SUBTOPICS = {
    'Math':    ['Linear equations', 'Systems of equations', 'Inequalities', 'Quadratics', 'Exponentials', 'Polynomials', 'Ratios & rates', 'Percentages', 'Statistics', 'Circle theorems', 'Triangle properties', 'Trigonometry'],
    'Reading': ['Central idea', 'Command of evidence', 'Data inferences', 'Word in context', 'Text structure', 'Transitions', 'Rhetorical synthesis', 'Boundaries', 'Subject-verb agreement'],
  };

  function changeSubject(s){ setSubject(s); setSubtopic('Any'); }

  return (
    <div className="view screen" data-screen-label="Student · Session setup" style={{maxWidth: 880}}>
      <div style={{marginBottom: 28}}>
        <button className="btn btn-quiet" onClick={() => go('dashboard')} style={{marginLeft:-10, marginBottom: 8}}>
          ← Back
        </button>
        <h1>Build a practice session</h1>
        <p className="muted" style={{marginTop: 8, fontSize: 15, maxWidth: 560}}>
          Pick a subject and difficulty. We’ll pull questions from the bank and bias toward your weak sub-topics when it helps.
        </p>
      </div>

      <div className="col" style={{gap: 32}}>
        <Section title="1 · Subject" hint="Pick one">
          <div className="grid-2" style={{gridTemplateColumns:'1fr 1fr', gap: 14}}>
            <OptCard selected={subject==='Math'} onClick={()=>changeSubject('Math')}
                     title="Math" desc="Algebra, advanced math, problem-solving & data, geometry" />
            <OptCard selected={subject==='Reading'}  onClick={()=>changeSubject('Reading')}
                     title="Reading" desc="Craft &amp; structure, information &amp; ideas, standard English, expression" />
          </div>
        </Section>

        <Section title="2 · Difficulty" hint="Adaptive mixes all three">
          <div className="grid-3" style={{gap: 14}}>
            {['Easy','Medium','Hard'].map(d => (
              <OptCard key={d} selected={difficulty===d} onClick={()=>setDifficulty(d)}
                       title={d}
                       desc={d==='Easy' ? 'Warm-up level. ~60s / q.' :
                             d==='Medium' ? 'On-test average. ~75s / q.' :
                                            'Above-test difficulty. ~95s / q.'} />
            ))}
          </div>
        </Section>

        <Section title="3 · Question count" hint="10–30">
          <div className="row" style={{gap: 20}}>
            <div className="stepper">
              <button onClick={() => setCount(Math.max(10, count - 5))}>–</button>
              <div className="val num">{count}</div>
              <button onClick={() => setCount(Math.min(30, count + 5))}>+</button>
            </div>
            <div className="row" style={{gap: 8}}>
              {[10,15,20,25].map(n => (
                <button key={n}
                        className={"btn " + (count===n ? 'btn-primary' : 'btn-ghost')}
                        onClick={() => setCount(n)}>
                  {n}
                </button>
              ))}
            </div>
            <div className="small muted" style={{marginLeft: 'auto'}}>
              Est. <span className="num" style={{color:'var(--ink-2)'}}>{Math.round(count * (difficulty==='Easy'?1:difficulty==='Medium'?1.25:1.6))} min</span>
            </div>
          </div>
        </Section>

        <Section title="4 · Sub-topic" hint="Optional">
          <div style={{display:'flex', flexWrap:'wrap', gap: 8}}>
            {['Any', ...SUBTOPICS[subject]].map(t => (
              <button key={t}
                      onClick={() => setSubtopic(t)}
                      className="tag"
                      style={{
                        cursor:'pointer', padding:'8px 14px', fontSize: 13,
                        background: subtopic===t ? 'var(--accent)' : 'var(--surface)',
                        borderColor: subtopic===t ? 'var(--accent)' : 'var(--border)',
                        color: subtopic===t ? '#fff' : 'var(--ink-2)',
                      }}>
                {t}
              </button>
            ))}
          </div>
        </Section>

        <div className="card" style={{padding: 18, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div className="row" style={{gap: 14}}>
            <div>
              <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.06em', fontWeight:500}}>Ready</div>
              <div style={{fontFamily:'var(--serif)', fontSize:18, marginTop: 4}}>
                {subject} · {difficulty} · {count} questions{subtopic !== 'Any' ? ` · ${subtopic}` : ''}
              </div>
            </div>
          </div>
          <div className="row" style={{gap: 10}}>
            <button className="btn btn-ghost" onClick={()=>go('dashboard')}>Cancel</button>
            <button className="btn btn-primary btn-lg" onClick={()=>go('question')}>
              Begin session <IArrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, hint, children }) {
  return (
    <div>
      <div className="row between" style={{marginBottom: 14}}>
        <h3 style={{fontSize: 17}}>{title}</h3>
        <span className="small muted">{hint}</span>
      </div>
      {children}
    </div>
  );
}

function OptCard({ title, desc, selected, onClick }) {
  return (
    <div className={"optcard" + (selected ? ' selected':'')} onClick={onClick}>
      <span className="ok"/>
      <h4 dangerouslySetInnerHTML={{__html:title}}/>
      <p dangerouslySetInnerHTML={{__html:desc}}/>
    </div>
  );
}

/* ---------------- Question screen ---------------- */
function QuestionScreen({ go }) {
  const q = QUESTION;
  const [picked, setPicked] = useState(null);
  const [marked, setMarked] = useState(false);

  return (
    <div className="view screen" data-screen-label="Student · Question">
      <div className="row between" style={{marginBottom: 22}}>
        <div className="row" style={{gap: 12}}>
          <span className="tag">{q.subject}</span>
          <span className="tag tag-strong">{q.topic}</span>
        </div>
        <div className="row" style={{gap: 16, color:'var(--ink-3)', fontSize: 13}}>
          <span className="row" style={{gap:6}}><IClock size={14}/> 18:42</span>
          <button className="btn btn-quiet" onClick={() => setMarked(!marked)}>
            <IFlag /> {marked ? 'Marked' : 'Mark for review'}
          </button>
          <button className="btn btn-quiet" onClick={() => go('dashboard')}><IX /> Exit</button>
        </div>
      </div>

      <div className="qshell">
        <div className="qtop">
          <div style={{fontFamily:'var(--serif)', fontSize: 15, fontWeight:500}}>
            Question <span className="num">{q.index}</span>
            <span className="muted"> of {q.total}</span>
          </div>
          <div className="qsteps">
            {Array.from({length:q.total}).map((_,i) => (
              <div key={i} className={"qstep " + (i < q.index-1 ? 'done' : i===q.index-1 ? 'cur' : '')}/>
            ))}
          </div>
          <div className="small muted num">{Math.round((q.index-1)/q.total*100)}%</div>
        </div>

        <div className="qbody">
          <div className="qleft">
            <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.08em', fontWeight:500, marginBottom: 14}}>Passage</div>
            <p className="qpassage">{q.passage}</p>
            <p className="qprompt">{q.prompt}</p>
          </div>
          <div className="qright">
            {q.choices.map(c => (
              <div key={c.k}
                   className={"choice " + (picked===c.k ? 'selected' : '')}
                   onClick={() => setPicked(c.k)}>
                <div className="key">{c.k}</div>
                <div className="ctext">{c.text}</div>
              </div>
            ))}
            <div style={{flex:1}}/>
            <div className="small muted" style={{marginTop: 10}}>
              Tip: skipped questions stay in your queue and come back at the end.
            </div>
          </div>
        </div>

        <div className="qbottom">
          <button className="btn btn-ghost" onClick={()=>go('dashboard')}>Previous</button>
          <div className="small muted num">Q {q.index} / {q.total}</div>
          <button className={"btn " + (picked ? 'btn-primary' : 'btn-ghost')}
                  disabled={!picked}
                  style={{opacity: picked?1:.55, cursor: picked?'pointer':'not-allowed'}}
                  onClick={()=>go('results')}>
            Submit answer <IArrow/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Results ---------------- */
function ResultsScreen({ go, lowScore, startBooster }) {
  const baseR = RESULT;
  // When `lowScore` is true, present a sub-70% variant of the same data.
  const r = lowScore
    ? { ...baseR, score: 8, total: 15, accuracy: 8/15,
        rows: baseR.rows.map((row,i) => i < 7 ? {...row, ok:false,
          userPick: row.userPick || ['A','B','C','D'][i%4],
          correct: row.correct || ['B','C','A','D'][i%4],
          why: row.why || 'You picked a transition that doesn’t match the logical relationship between the two clauses. The correct option preserves the cause/contrast set up in the passage.'} : {...row, ok:true}) }
    : baseR;
  const [open, setOpen] = useState(3);
  const pct = Math.round(r.score/r.total*100);
  const belowGate = pct < 70;

  return (
    <div className="view screen" data-screen-label="Student · Results">
      {belowGate && (
        <div className="card" style={{padding:'20px 24px', marginBottom: 22, display:'flex', alignItems:'center', gap:18, borderColor:'var(--accent-border)', background:'var(--accent-soft)'}}>
          <div style={{width:42, height:42, borderRadius:11, background:'var(--accent)', color:'#fff', display:'grid', placeItems:'center', flex:'none'}}>
            <ILock/>
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontFamily:'var(--serif)', fontSize:19, color:'var(--accent-ink)', fontWeight:500}}>
              Booster module required
            </div>
            <div className="small" style={{color:'var(--accent-ink)', opacity:.85, marginTop:3, lineHeight:1.5, maxWidth: 620}}>
              You scored <strong className="num">{pct}%</strong>, below the <strong className="num">70%</strong> threshold. Complete an adaptive booster targeting your weak sub-topics to unlock the dashboard and your next session.
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={startBooster}>
            Start booster <IArrow/>
          </button>
        </div>
      )}

      <div className="row between" style={{marginBottom: 24}}>
        <div>
          <div className="small muted">Session complete · {r.subject}</div>
          <h1 style={{marginTop: 6}}>
            {belowGate
              ? <>You got <span style={{color:'var(--accent-ink)'}}>{r.score} of {r.total}</span>. Let’s shore that up.</>
              : <>Nice work, you got <span style={{color:'var(--accent-ink)'}}>{r.score} of {r.total}</span>.</>}
          </h1>
        </div>
        <div className="row" style={{gap: 10}}>
          {belowGate ? (
            <>
              <button className="btn btn-ghost" disabled style={{opacity:.55, cursor:'not-allowed'}}>
                <ILock size={13}/> Dashboard locked
              </button>
              <button className="btn btn-primary" onClick={startBooster}>Begin booster <IArrow/></button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={()=>go('dashboard')}>Back to dashboard</button>
              <button className="btn btn-primary" onClick={()=>go('setup')}>Practice again <IArrow/></button>
            </>
          )}
        </div>
      </div>

      <div className="grid-4" style={{marginBottom: 24}}>
        <StatCard label="Accuracy"  value={<span className="num">{pct}%</span>} sub={`${r.score} correct · ${r.total - r.score} wrong`} />
        <StatCard label="Time"      value={<span className="num" style={{fontSize:34}}>{r.duration}</span>} sub="avg 89s / question" />
        <StatCard label="Pace"      value={<span style={{fontSize: 24}}>On target</span>} sub="within recommended window" />

      </div>

      <div className="grid-2">
        <div className="card" style={{padding: 0}}>
          <div className="row between" style={{padding:'18px 22px', borderBottom:'1px solid var(--border)'}}>
            <h3 style={{fontSize:17}}>Question breakdown</h3>
            <span className="small muted">Tap a wrong answer for the explanation</span>
          </div>
          <div>
            {r.rows.map(row => (
              <React.Fragment key={row.n}>
                <div className={"qrow " + (row.ok ? '' : 'bad ') + (open===row.n ? 'open':'')}
                     onClick={() => !row.ok && setOpen(open===row.n ? null : row.n)}
                     style={{cursor: row.ok ? 'default' : 'pointer'}}>
                  <div className="ind">
                    {row.ok ? <ICheck size={15}/> : <IX size={15}/>}
                  </div>
                  <div style={{minWidth:0}}>
                    <div className="qtxt">
                      <span className="num muted" style={{marginRight:8}}>{String(row.n).padStart(2,'0')}</span>
                      {row.topic}
                    </div>
                    <div className="qsub">
                      {row.ok
                        ? 'Correct'
                        : <>Your answer: <strong style={{color:'var(--bad)'}}>{row.userPick}</strong> · Correct: <strong style={{color:'var(--ok)'}}>{row.correct}</strong></>}
                    </div>
                  </div>
                  <div className="small muted num">{Math.round(30+Math.random()*60)}s</div>
                  <div className="caret">{row.ok ? '' : <IChevR/>}</div>
                </div>
                {!row.ok && open===row.n && (
                  <div className="explain">
                    <div className="aibadge"><ISpark size={11}/> AI explanation</div>
                    <h5>Why {row.correct} is correct</h5>
                    <p>{row.why}</p>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="col" style={{gap: 16}}>
          <div className="card" style={{padding: 22}}>
            <h3 style={{fontSize:17, marginBottom: 12}}>By sub-topic</h3>
            {[
              {t:'Central idea',       ok:3, n:3},
              {t:'Transitions',        ok:0, n:3},
              {t:'Word in context',    ok:2, n:2},
              {t:'Data inferences',    ok:0, n:1},
              {t:'Rhetorical synthesis', ok:2, n:2},
              {t:'Boundaries',         ok:2, n:2},
              {t:'Text structure',     ok:1, n:1},
              {t:'Command of evidence',ok:1, n:1},
            ].map((s,i) => (
              <div key={i} className="row" style={{gap:12, padding:'8px 0'}}>
                <div style={{flex:1, fontSize: 13.5}}>{s.t}</div>
                <div style={{width: 120}}>
                  <div className="pbar"><span style={{width: (s.ok/s.n)*100+'%', background: s.ok===0 ? 'var(--bad)' : s.ok===s.n ? 'var(--ok)' : 'var(--accent)'}}/></div>
                </div>
                <div className="num small" style={{width: 36, textAlign:'right', color:'var(--ink-2)'}}>{s.ok}/{s.n}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{padding: 22}}>
            <div className="row between" style={{marginBottom: 8}}>
              <h3 style={{fontSize:17}}>Suggested next session</h3>
              <span className="tag tag-strong"><ISpark size={11}/> AI</span>
            </div>
            <p className="muted small" style={{marginBottom:14}}>
              You missed three Transitions questions. A 10-question focused drill should take ~12 minutes.
            </p>
            <button className="btn btn-primary" onClick={()=>go('setup')}>Start focused drill <IArrow/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StudentDashboard, SessionSetup, QuestionScreen, ResultsScreen });
