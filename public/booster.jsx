// Adaptive Booster — mandatory remediation when score < 70%.
// Mini-batches of questions targeting weak sub-topics. Student must reach
// running accuracy >= 70% over the booster's questions before being released.
const { useState: useStateB, useEffect: useEffectB, useMemo: useMemoB } = React;

// A small bank of booster questions, weighted to topics the student missed.
const BOOSTER_BANK = [
  { topic:"Transitions",     prompt:"The committee debated for weeks. ______ no consensus emerged before the deadline.",
    choices:[{k:"A",t:"Therefore,"},{k:"B",t:"However,"},{k:"C",t:"Similarly,"},{k:"D",t:"For instance,"}], correct:"B",
    why:"The two clauses contrast — long debate vs. no consensus. A contrast transition is needed." },
  { topic:"Transitions",     prompt:"Most reviewers praised the novel’s pacing. ______ several criticized its abrupt ending.",
    choices:[{k:"A",t:"Likewise,"},{k:"B",t:"As a result,"},{k:"C",t:"Still,"},{k:"D",t:"In other words,"}], correct:"C",
    why:"“Still,” preserves a contrastive but mild concession — fits the shift from praise to criticism." },
  { topic:"Data inferences", prompt:"Based only on the table, which conclusion is most directly supported?",
    choices:[{k:"A",t:"District A’s rate has steadily risen each year."},
             {k:"B",t:"In 2022, District A had a higher rate than District B."},
             {k:"C",t:"District B will surpass A by 2025."},
             {k:"D",t:"The rate doubled between 2018 and 2022."}], correct:"B",
    why:"Only B states a fact you can read directly from the two reported years." },
  { topic:"Linear equations", prompt:"If 4(x − 2) = 2x + 6, what is the value of x?",
    choices:[{k:"A",t:"5"},{k:"B",t:"7"},{k:"C",t:"−7"},{k:"D",t:"1"}], correct:"B",
    why:"4x − 8 = 2x + 6 → 2x = 14 → x = 7." },
  { topic:"Transitions",     prompt:"Solar capacity has tripled in five years. ______ grid storage has lagged behind.",
    choices:[{k:"A",t:"Meanwhile,"},{k:"B",t:"Therefore,"},{k:"C",t:"For example,"},{k:"D",t:"Moreover,"}], correct:"A",
    why:"“Meanwhile,” signals a parallel-but-different development happening at the same time." },
  { topic:"Data inferences", prompt:"Which choice most accurately reflects what the figure shows?",
    choices:[{k:"A",t:"Group X grew faster than Group Y in every quarter."},
             {k:"B",t:"Group Y grew faster than Group X in Q3."},
             {k:"C",t:"Both groups peaked in Q1."},
             {k:"D",t:"Neither group changed across the period."}], correct:"B",
    why:"Only B reflects a single quarter’s relative growth and matches the chart." },
  { topic:"Linear equations", prompt:"If 5x + 3 = 2(x + 9), what is x?",
    choices:[{k:"A",t:"3"},{k:"B",t:"5"},{k:"C",t:"−5"},{k:"D",t:"7"}], correct:"B",
    why:"5x + 3 = 2x + 18 → 3x = 15 → x = 5." },
  { topic:"Transitions",     prompt:"The exhibition draws record crowds in major cities. ______ small towns rarely see touring shows of this scale.",
    choices:[{k:"A",t:"By contrast,"},{k:"B",t:"In addition,"},{k:"C",t:"Therefore,"},{k:"D",t:"Likewise,"}], correct:"A",
    why:"The two halves set up a contrast between major cities and small towns." },
];

function pickBoosterQuestions(){
  // Round-robin so we get a balanced topic distribution
  return [...BOOSTER_BANK];
}

function AdaptiveBooster({ go, finish }){
  const [questions] = useStateB(() => pickBoosterQuestions());
  const [idx, setIdx] = useStateB(0);
  const [picked, setPicked] = useStateB(null);
  const [revealed, setRevealed] = useStateB(false);
  const [history, setHistory] = useStateB([]); // [{ok:true|false, topic, qIdx}]
  const [released, setReleased] = useStateB(false);
  const [showCheckpoint, setShowCheckpoint] = useStateB(false);

  const TARGET = 0.70;
  const MIN_ATTEMPTED = 4;          // must answer at least this many before release
  const CHECKPOINT_EVERY = 4;       // show a checkpoint every N answers

  const q = questions[idx % questions.length];
  const correctCount = history.filter(h => h.ok).length;
  const accuracy = history.length === 0 ? 0 : correctCount / history.length;
  const pct = Math.round(accuracy * 100);
  const targetPct = Math.round(TARGET * 100);

  // progress toward release: we need accuracy >= TARGET AND at least MIN_ATTEMPTED answered
  const eligible = history.length >= MIN_ATTEMPTED && accuracy >= TARGET;
  // visual progress bar fills relative to target accuracy
  const progress = Math.min(1, history.length === 0 ? 0 : accuracy / TARGET);

  function submit(){
    if(!picked) return;
    setRevealed(true);
  }

  function next(){
    const ok = picked === q.correct;
    const nextHistory = [...history, { ok, topic: q.topic, qIdx: idx }];
    setHistory(nextHistory);
    setPicked(null);
    setRevealed(false);

    const nextCorrect = nextHistory.filter(h=>h.ok).length;
    const nextAcc = nextCorrect / nextHistory.length;
    const reachedTarget = nextHistory.length >= MIN_ATTEMPTED && nextAcc >= TARGET;

    if(reachedTarget){
      setReleased(true);
      return;
    }
    // checkpoint between rounds
    if(nextHistory.length % CHECKPOINT_EVERY === 0){
      setShowCheckpoint(true);
      return;
    }
    setIdx(idx + 1);
  }

  // Topic breakdown for the side panel
  const topicStats = useMemoB(() => {
    const m = {};
    history.forEach(h => {
      m[h.topic] = m[h.topic] || { ok:0, n:0 };
      m[h.topic].n += 1;
      if(h.ok) m[h.topic].ok += 1;
    });
    return Object.entries(m).map(([t, s]) => ({ topic:t, ...s }));
  }, [history]);

  if(released){
    return <BoosterCleared accuracy={accuracy} attempted={history.length} go={go} finish={finish}/>;
  }

  if(showCheckpoint){
    return (
      <BoosterCheckpoint
        accuracy={accuracy}
        targetPct={targetPct}
        attempted={history.length}
        topicStats={topicStats}
        onContinue={() => { setShowCheckpoint(false); setIdx(idx + 1); }}
      />
    );
  }

  return (
    <div className="view screen" data-screen-label="Student · Adaptive booster" style={{maxWidth: 1100}}>
      {/* Lock banner */}
      <div className="card" style={{padding:'16px 20px', marginBottom: 20, display:'flex', alignItems:'center', gap:14, borderColor:'var(--accent-border)', background:'var(--accent-soft)'}}>
        <div style={{width:36, height:36, borderRadius:10, background:'var(--accent)', color:'#fff', display:'grid', placeItems:'center', flex:'none'}}>
          <ILock/>
        </div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontFamily:'var(--serif)', fontSize:17, color:'var(--accent-ink)', fontWeight:500}}>
            Booster module — required to unlock dashboard
          </div>
          <div className="small" style={{color:'var(--accent-ink)', opacity:.85, marginTop:2}}>
            Reach <strong className="num">{targetPct}%</strong> running accuracy on this adaptive set to continue. Built around the sub-topics you missed.
          </div>
        </div>
        <div className="num" style={{fontFamily:'var(--serif)', fontSize:30, color:'var(--accent-ink)'}}>
          {pct}<span style={{fontSize:16, opacity:.6}}>%</span>
        </div>
      </div>

      <div className="grid-2" style={{gridTemplateColumns:'1.6fr 1fr', alignItems:'flex-start'}}>
        {/* Question card */}
        <div className="qshell">
          <div className="qtop">
            <div style={{fontFamily:'var(--serif)', fontSize: 15, fontWeight:500}}>
              Booster question <span className="num">{history.length + 1}</span>
              <span className="muted"> · {q.topic}</span>
            </div>
            <div className="qsteps" style={{maxWidth: 360}}>
              <div className="pbar" style={{flex:1, height:6}}>
                <span style={{width: (progress*100)+'%'}}/>
              </div>
            </div>
            <div className="small muted num">
              {pct}% / {targetPct}%
            </div>
          </div>

          <div style={{padding: '32px 36px'}}>
            <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.08em', fontWeight:500, marginBottom: 14}}>
              Targeted sub-topic
            </div>
            <p className="qprompt" style={{marginTop: 0, fontSize: 22}}>{q.prompt}</p>

            <div className="col" style={{gap: 10, marginTop: 24}}>
              {q.choices.map(c => {
                const isPicked = picked === c.k;
                const isCorrect = revealed && c.k === q.correct;
                const isWrongPick = revealed && isPicked && c.k !== q.correct;
                let extra = {};
                if(isCorrect) extra = {borderColor:'var(--ok)', background:'var(--ok-soft)'};
                else if(isWrongPick) extra = {borderColor:'var(--bad)', background:'var(--bad-soft)'};
                return (
                  <div key={c.k}
                       className={"choice " + (isPicked && !revealed ? 'selected' : '')}
                       style={extra}
                       onClick={() => !revealed && setPicked(c.k)}>
                    <div className="key" style={isCorrect ? {background:'var(--ok)', color:'#fff', borderColor:'var(--ok)'} :
                                                isWrongPick ? {background:'var(--bad)', color:'#fff', borderColor:'var(--bad)'} : null}>
                      {c.k}
                    </div>
                    <div className="ctext" style={{flex:1}}>{c.t}</div>
                    {isCorrect && <ICheck size={16} style={{color:'var(--ok)', marginTop:4}}/>}
                    {isWrongPick && <IX size={16} style={{color:'var(--bad)', marginTop:4}}/>}
                  </div>
                );
              })}
            </div>

            {revealed && (
              <div style={{marginTop: 22, padding:'16px 18px', background:'var(--surface-2)', border:'1px solid var(--border-2)', borderRadius:10}}>
                <div className="aibadge" style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:11, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--accent-ink)', background:'var(--accent-soft)', padding:'3px 8px', borderRadius:999, fontWeight:500, marginBottom:8, border:'1px solid var(--accent-border)'}}>
                  <ISpark size={11}/> AI explanation
                </div>
                <div style={{fontFamily:'var(--serif)', fontSize:15, fontWeight:500, marginBottom:6}}>
                  Why <span style={{color:'var(--ok)'}}>{q.correct}</span> is correct
                </div>
                <p style={{fontSize:14, color:'var(--ink-2)', lineHeight:1.6}}>{q.why}</p>
              </div>
            )}
          </div>

          <div className="qbottom">
            <div className="small muted">
              {history.length < MIN_ATTEMPTED
                ? <>Minimum <span className="num">{MIN_ATTEMPTED}</span> questions before release</>
                : <>Eligible to release once accuracy ≥ <span className="num">{targetPct}%</span></>}
            </div>
            {!revealed
              ? <button className={"btn " + (picked ? 'btn-primary' : 'btn-ghost')}
                        disabled={!picked}
                        style={{opacity: picked?1:.55, cursor: picked?'pointer':'not-allowed'}}
                        onClick={submit}>Submit answer <IArrow/></button>
              : <button className="btn btn-primary" onClick={next}>
                  {picked === q.correct ? 'Continue' : 'Try the next one'} <IArrow/>
                </button>}
          </div>
        </div>

        {/* Side panel */}
        <div className="col" style={{gap: 14}}>
          <div className="card" style={{padding: 22}}>
            <div className="row between" style={{marginBottom: 12}}>
              <h3 style={{fontSize: 17}}>Running accuracy</h3>
              <span className="tag tag-strong">Goal {targetPct}%</span>
            </div>
            <div className="row" style={{alignItems:'baseline', gap: 8}}>
              <div className="num" style={{fontFamily:'var(--serif)', fontSize: 44, fontWeight:500, letterSpacing:'-0.02em', lineHeight:1, color: accuracy >= TARGET ? 'var(--ok)' : 'var(--ink)'}}>{pct}%</div>
              <div className="small muted num">{correctCount} / {history.length} correct</div>
            </div>
            <div style={{marginTop: 14}}>
              <div className="pbar" style={{height: 6}}>
                <span style={{width: (progress*100)+'%', background: accuracy >= TARGET ? 'var(--ok)' : 'var(--accent)'}}/>
              </div>
              <div className="row between small muted" style={{marginTop: 6}}>
                <span>0%</span>
                <span style={{position:'relative', left: -8}}>↑ {targetPct}% target</span>
              </div>
            </div>
          </div>

          <div className="card" style={{padding: 22}}>
            <h3 style={{fontSize: 17, marginBottom: 12}}>This session</h3>
            <div className="col" style={{gap: 8}}>
              {topicStats.length === 0 && (
                <div className="small muted">Topic accuracy will show after your first answer.</div>
              )}
              {topicStats.map((s,i) => (
                <div key={i} className="row" style={{gap:12, alignItems:'center'}}>
                  <div style={{flex:1, fontSize: 13.5}}>{s.topic}</div>
                  <div style={{width: 110}}>
                    <div className="pbar"><span style={{width: (s.ok/s.n)*100+'%', background: s.ok===0 ? 'var(--bad)' : s.ok===s.n ? 'var(--ok)' : 'var(--accent)'}}/></div>
                  </div>
                  <div className="num small" style={{width: 36, textAlign:'right', color:'var(--ink-2)'}}>{s.ok}/{s.n}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{padding: 18, background:'var(--surface-2)'}}>
            <div className="row" style={{gap:10, alignItems:'flex-start'}}>
              <ISpark size={16} style={{color:'var(--accent)', marginTop: 2, flex:'none'}}/>
              <div className="small" style={{color:'var(--ink-2)', lineHeight:1.55}}>
                Each wrong answer pulls a similar question from the bank. Each right answer raises your accuracy and brings the gate closer to opening.
              </div>
            </div>
          </div>

          <button className="btn btn-quiet" disabled style={{justifyContent:'center', cursor:'not-allowed', opacity:.55}}>
            <ILock size={14}/> Cannot exit until {targetPct}% reached
          </button>
        </div>
      </div>
    </div>
  );
}

function BoosterCheckpoint({ accuracy, targetPct, attempted, topicStats, onContinue }){
  const pct = Math.round(accuracy * 100);
  const gap = targetPct - pct;
  return (
    <div className="view screen" style={{maxWidth: 720}} data-screen-label="Student · Booster checkpoint">
      <div className="card" style={{padding: 36, textAlign:'center'}}>
        <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.08em', fontWeight:500, marginBottom: 10}}>
          Round checkpoint · {attempted} answered
        </div>
        <h1 style={{fontSize: 36, marginBottom: 10}}>
          You’re at <span style={{color: 'var(--accent-ink)'}}>{pct}%</span>.
        </h1>
        <p className="muted" style={{maxWidth: 460, margin:'0 auto 24px', fontSize: 15}}>
          {gap > 0
            ? <>Keep going — <span className="num" style={{color:'var(--ink-2)', fontWeight:500}}>{gap} percentage points</span> short of the gate.</>
            : <>You’re at the threshold. One more correct answer should unlock the dashboard.</>}
        </p>

        <div style={{maxWidth: 520, margin:'0 auto 28px'}}>
          <div className="pbar" style={{height: 8}}>
            <span style={{width: Math.min(100, pct/targetPct*100)+'%', background: pct >= targetPct ? 'var(--ok)' : 'var(--accent)'}}/>
          </div>
          <div className="row between small muted" style={{marginTop: 8}}>
            <span>0%</span>
            <span>Target {targetPct}%</span>
            <span>100%</span>
          </div>
        </div>

        {topicStats.length > 0 && (
          <div style={{maxWidth: 520, margin:'0 auto 28px', textAlign:'left'}}>
            <div className="small muted" style={{marginBottom: 8}}>Topic-by-topic so far</div>
            {topicStats.map((s,i) => (
              <div key={i} className="row" style={{gap:12, padding:'4px 0'}}>
                <div style={{flex:1, fontSize: 13.5}}>{s.topic}</div>
                <div style={{width: 140}}>
                  <div className="pbar"><span style={{width:(s.ok/s.n)*100+'%', background: s.ok===s.n ? 'var(--ok)' : s.ok===0 ? 'var(--bad)' : 'var(--accent)'}}/></div>
                </div>
                <div className="num small" style={{width: 40, textAlign:'right'}}>{s.ok}/{s.n}</div>
              </div>
            ))}
          </div>
        )}

        <button className="btn btn-primary btn-lg" onClick={onContinue}>
          Continue booster <IArrow/>
        </button>
      </div>
    </div>
  );
}

function BoosterCleared({ accuracy, attempted, go, finish }){
  const pct = Math.round(accuracy * 100);
  return (
    <div className="view screen" style={{maxWidth: 720}} data-screen-label="Student · Booster cleared">
      <div className="card" style={{padding: 44, textAlign:'center'}}>
        <div style={{width: 64, height: 64, margin:'0 auto 18px', borderRadius:'50%', background:'var(--ok-soft)', color:'var(--ok)', display:'grid', placeItems:'center'}}>
          <ICheck size={28}/>
        </div>
        <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.08em', fontWeight:500, marginBottom: 8}}>
          Gate unlocked
        </div>
        <h1 style={{fontSize: 38, marginBottom: 12}}>Booster cleared.</h1>
        <p className="muted" style={{maxWidth: 460, margin:'0 auto 28px', fontSize: 15}}>
          You finished at <span className="num" style={{color:'var(--ink)', fontWeight:500}}>{pct}%</span> across <span className="num">{attempted}</span> questions. Your weak-topic tags will be re-evaluated on your next session.
        </p>

        <div className="row" style={{gap: 10, justifyContent:'center'}}>
          <button className="btn btn-ghost" onClick={() => { finish(); go('setup'); }}>
            Start a new session
          </button>
          <button className="btn btn-primary btn-lg" onClick={() => { finish(); go('dashboard'); }}>
            Back to dashboard <IArrow/>
          </button>
        </div>
      </div>
    </div>
  );
}

// Lock icon (one-off, not in icons.jsx since only used here)
function ILock({ size = 16, ...p }){
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="4" y="11" width="16" height="10" rx="2"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  );
}

Object.assign(window, { AdaptiveBooster, ILock });
