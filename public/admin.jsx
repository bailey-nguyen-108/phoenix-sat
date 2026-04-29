// Admin screens: Question bank + AI review queue.
const { useState: useStateA, useEffect: useEffectA } = React;

function AdminBank({ go }) {
  const [subject, setSubject]       = useStateA('All');
  const [difficulty, setDifficulty] = useStateA('All');
  const [status, setStatus]         = useStateA('All');
  const [query, setQuery]           = useStateA('');
  const [newOpen, setNewOpen]       = useStateA(false);
  const [editRow,  setEditRow]       = useStateA(null);
  const [filterOpen, setFilterOpen] = useStateA(false);

  const activeFilters = [subject, difficulty, status].filter(v => v !== 'All').length;
  const rows = BANK.filter(r =>
    (subject === 'All' || r.subject === subject) &&
    (difficulty === 'All' || r.difficulty === difficulty) &&
    (status === 'All' || r.status === status) &&
    (query === '' || (r.topic + r.id).toLowerCase().includes(query.toLowerCase()))
  );

  useEffectA(() => {
    const handler = (event) => {
      const comment = event.detail || {};
      if (comment.screenId !== 'admin.question_bank') return;
      const context = parseCommentContext(comment.elementLabel);
      if (context?.modal === 'admin.question_bank.new') {
        setNewOpen(true);
        setEditRow(null);
        return;
      }
      if (context?.modal === 'admin.question_bank.edit') {
        const target = rows.find((row) => row.id === context.target) || rows[0] || BANK[0];
        if (target) {
          setEditRow(target);
          setNewOpen(false);
        }
      }
    };
    window.addEventListener('sat:open-comment-context', handler);
    return () => window.removeEventListener('sat:open-comment-context', handler);
  }, [rows]);

  return (
    <div className="view screen" data-screen-label="Admin · Question bank">
      <div className="row between" style={{marginBottom: 22}}>
        <div>
          <div className="small muted">Content</div>
          <h1 style={{marginTop:6}}>Question bank</h1>
          <p className="muted" style={{marginTop: 6, fontSize: 14}}>
            {BANK.length} questions · {BANK.filter(b=>b.status==='pending').length} awaiting review
          </p>
        </div>
        <div className="row" style={{gap:10}}>
          <div style={{position:'relative'}}>
            <button className="btn btn-ghost" onClick={()=>setFilterOpen(f=>!f)}>
              <IFilter/> Filter{activeFilters > 0 && <span style={{marginLeft:4, background:'var(--accent)', color:'#fff', borderRadius:'50%', width:17, height:17, fontSize:11, display:'inline-grid', placeItems:'center'}}>{activeFilters}</span>}
            </button>
            {filterOpen && (
              <div className="card" style={{position:'absolute', right:0, top:'calc(100% + 6px)', zIndex:30, padding:18, minWidth:280, boxShadow:'var(--shadow-lg)'}}>
                <div className="row between" style={{marginBottom:14}}>
                  <span style={{fontSize:13, fontWeight:500}}>Filters</span>
                  {activeFilters > 0 && <button className="btn btn-quiet" style={{padding:'3px 8px', fontSize:12}} onClick={()=>{setSubject('All');setDifficulty('All');setStatus('All');}}>Clear all</button>}
                </div>
                <div className="col" style={{gap:12}}>
                  <FilterSel label="Subject"    value={subject}    onChange={setSubject}    options={['All','Math','Reading']}/>
                  <FilterSel label="Difficulty" value={difficulty} onChange={setDifficulty} options={['All','Easy','Medium','Hard']}/>
                  <FilterSel label="Status"     value={status}     onChange={setStatus}     options={['All','live','pending']}/>
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={()=>setNewOpen(true)}><IPlus/> New question</button>
        </div>
      </div>

      <div className="card" style={{padding: 0, overflow:'hidden'}}>
        <div className="row" style={{gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border)'}}>
          <div style={{position:'relative', flex:1, minWidth: 240}}>
            <ISearch size={15} style={{position:'absolute', left:12, top:11, color:'var(--ink-4)'}}/>
            <input type="search" placeholder="Search by ID or sub-topic…"
                   value={query} onChange={e=>setQuery(e.target.value)}
                   style={{paddingLeft: 34, width: '100%'}}/>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style={{width:40, paddingLeft:22}}><input type="checkbox"/></th>
              <th>ID</th>
              <th>Sub-topic</th>
              <th>Subject</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Author</th>
              <th>Updated</th>
              <th style={{textAlign:'right', paddingRight: 22}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={{paddingLeft: 22}}><input type="checkbox"/></td>
                <td className="mono" style={{color:'var(--ink-3)', fontSize:13}}>{r.id}</td>
                <td style={{color:'var(--ink)', fontWeight:450}}>{r.topic}</td>
                <td>{r.subject}</td>
                <td>
                  <DiffPill level={r.difficulty}/>
                </td>
                <td>
                  {r.status === 'live'
                    ? <span className="tag tag-ok"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--ok)'}}/> Live</span>
                    : <span className="tag tag-warn"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--warn)'}}/> Pending 
</span>}
                </td>
                <td className="muted">{r.author}</td>
                <td className="muted">{r.updated}</td>
                <td style={{textAlign:'right', paddingRight: 22}}>
                  <button className="icon-btn" title="Edit" onClick={()=>setEditRow(r)}><IEdit/></button>
                  <button className="icon-btn" title="Delete"><ITrash/></button>
                  <button className="icon-btn" title="More"><IMore/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="row between" style={{padding:'14px 22px', borderTop:'1px solid var(--border)', color:'var(--ink-3)', fontSize:13}}>
          <span>Showing <span className="num" style={{color:'var(--ink)'}}>{rows.length}</span> of {BANK.length}</span>
          <div className="row" style={{gap: 6}}>
            <button className="btn btn-ghost btn-sm" style={{padding:'6px 10px', fontSize:13}}>‹</button>
            <button className="btn btn-primary"      style={{padding:'6px 10px', fontSize:13}}>1</button>
            <button className="btn btn-ghost"        style={{padding:'6px 10px', fontSize:13}}>2</button>
            <button className="btn btn-ghost"        style={{padding:'6px 10px', fontSize:13}}>3</button>
            <button className="btn btn-ghost"        style={{padding:'6px 10px', fontSize:13}}>›</button>
          </div>
        </div>
      </div>

      {newOpen   && <NewQuestionModal onClose={()=>setNewOpen(false)}/>}
      {editRow   && <NewQuestionModal editing={editRow} onClose={()=>setEditRow(null)}/>}
    </div>
  );
}

function NewQuestionModal({ onClose, editing }){
  const [subject, setSubject] = useStateA(editing?.subject || 'Math');
  const [difficulty, setDifficulty] = useStateA(editing?.difficulty || 'Medium');
  const [topic, setTopic] = useStateA(editing?.topic || 'Linear equations');
  const [text, setText] = useStateA(editing?.text || '');
  const [choices, setChoices] = useStateA(editing?.choices || [{k:'A',t:''},{k:'B',t:''},{k:'C',t:''},{k:'D',t:''}]);
  const [correct, setCorrect] = useStateA(editing?.correctKey || 'A');

  const stop = e => e.stopPropagation();
  return (
    <div onClick={onClose} style={{position:'fixed', inset:0, background:'rgba(20,20,20,0.35)', display:'grid', placeItems:'center', zIndex:40, padding:24}}>
      <div
        onClick={stop}
        className="card"
        data-comment-modal={editing ? 'admin.question_bank.edit' : 'admin.question_bank.new'}
        data-comment-target={editing?.id || 'new'}
        style={{width:'min(720px, 100%)', maxHeight:'90vh', overflow:'auto', padding:0, boxShadow:'var(--shadow-lg)'}}
      >
        <div className="row between" style={{padding:'18px 22px', borderBottom:'1px solid var(--border)'}}>
          <div>
            <div className="small muted">Content</div>
            <h3 style={{marginTop: 2}}>{editing ? 'Edit question' : 'New question'}</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><IX/></button>
        </div>

        <div className="col" style={{padding:'20px 22px', gap: 18}}>
          <div className="row" style={{gap: 14}}>
            <label className="col" style={{flex:1, gap:6}}>
              <span className="small muted">Subject</span>
              <select value={subject} onChange={e=>setSubject(e.target.value)}>
                <option>Math</option><option>Reading</option>
              </select>
            </label>
            <label className="col" style={{flex:1, gap:6}}>
              <span className="small muted">Difficulty</span>
              <select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </label>
            <label className="col" style={{flex:1, gap:6}}>
              <span className="small muted">Sub-topic</span>
              <input type="text" value={topic} onChange={e=>setTopic(e.target.value)}/>
            </label>
          </div>

          <label className="col" style={{gap:6}}>
            <span className="small muted">Question text</span>
            <textarea rows="4" value={text} onChange={e=>setText(e.target.value)} placeholder="Type the question prompt…" style={{resize:'vertical', fontFamily:'var(--serif)', fontSize:15}}/>
          </label>

          <div className="col" style={{gap:8}}>
            <span className="small muted">Answer choices · pick the correct one</span>
            {choices.map((c, i) => (
              <div key={c.k} className="row" style={{gap:10}}>
                <button className={"choice " + (correct===c.k ? 'selected':'')} onClick={()=>setCorrect(c.k)}
                        style={{padding:'8px 12px', flex:'none'}}>
                  <div className="key">{c.k}</div>
                </button>
                <input type="text" value={c.t}
                       onChange={e => setChoices(choices.map((x,j) => j===i ? {...x, t: e.target.value} : x))}
                       placeholder={"Choice " + c.k} style={{flex:1}}/>
              </div>
            ))}
          </div>
        </div>

        <div className="row between" style={{padding:'14px 22px', borderTop:'1px solid var(--border)', background:'var(--surface-2)'}}>
          <span className="small muted">Saves as <strong style={{color:'var(--ink-2)', fontWeight:500}}>pending review</strong> until published.</span>
          <div className="row" style={{gap:10}}>
            <button className="btn btn-quiet" onClick={onClose}>Cancel</button>
            <button className="btn btn-ghost" onClick={onClose}>Save as draft</button>
            <button className="btn btn-primary" onClick={onClose}><ICheck/> {editing ? 'Save changes' : 'Create question'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSel({label, value, onChange, options}){
  return (
    <label className="row" style={{gap: 8, fontSize:13, color:'var(--ink-3)'}}>
      {label}:
      <select value={value} onChange={e=>onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o[0].toUpperCase()+o.slice(1)}</option>)}
      </select>
    </label>
  );
}

function DiffPill({level}){
  const map = { Easy: {bg:'#EDF2ED', fg:'#406348'},
                Medium:{bg:'#F1EEE6', fg:'#6B5B37'},
                Hard:  {bg:'#F1E7E4', fg:'#7A3D35'} };
  const s = map[level] || map.Medium;
  return <span className="tag" style={{background:s.bg, borderColor:s.bg, color:s.fg}}>{level}</span>;
}

function parseCommentContext(label = '') {
  const match = String(label).match(/^\[context:([^:\]]+):([^\]]*)\]/);
  if (!match) return null;
  return { modal: match[1], target: match[2] };
}

/* ---------------- AI Review Queue ---------------- */
function AdminReview({ go }) {
  const [items, setItems] = useStateA(REVIEW);
  const [editing, setEditing] = useStateA(null);
  const [filterOpen, setFilterOpen] = useStateA(false);
  const [filterSubject, setFilterSubject] = useStateA('All');
  const [filterDiff, setFilterDiff] = useStateA('All');

  const activeFilters = [filterSubject, filterDiff].filter(v => v !== 'All').length;
  const visible = items.filter(q =>
    (filterSubject === 'All' || q.subject === filterSubject) &&
    (filterDiff === 'All' || q.difficulty === filterDiff)
  );

  useEffectA(() => {
    const handler = (event) => {
      const comment = event.detail || {};
      if (comment.screenId !== 'admin.ai_review') return;
      const context = parseCommentContext(comment.elementLabel);
      const label = String(comment.elementLabel || '');
      const isEditModalComment =
        context?.modal === 'admin.ai_review.edit' ||
        (!context && label.includes('Question text') && label.includes('Answer choices'));

      if (!isEditModalComment) return;
      const target = items.find((item) => item.id === context?.target) || visible[0] || items[0];
      if (target) setEditing(target);
    };
    window.addEventListener('sat:open-comment-context', handler);
    return () => window.removeEventListener('sat:open-comment-context', handler);
  }, [items, visible]);

  const act = (id, kind) => {
    if(kind === 'edit'){
      const q = items.find(i => i.id === id);
      if(q) setEditing(q);
      return;
    }
    setItems(items.filter(i => i.id !== id));
  };

  const saveEdit = (updated) => {
    setItems(items.map(i => i.id === updated.id ? updated : i));
    setEditing(null);
  };

  return (
    <div className="view screen" data-screen-label="Admin · AI review queue">
      <div className="row between" style={{marginBottom: 22}}>
        <div>
          <div className="small muted">Content · AI-generated</div>
          <h1 style={{marginTop:6}}>Review queue</h1>
          <p className="muted" style={{marginTop: 6, fontSize: 14, maxWidth: 620}}>
            Questions drafted by the generator since your last review. Approve to push live, edit to refine before publishing, or reject to remove.
          </p>
        </div>
        <div className="row" style={{gap:10}}>
          <div style={{position:'relative'}}>
            <button className="btn btn-ghost" onClick={()=>setFilterOpen(f=>!f)}>
              <IFilter/> Filter{activeFilters > 0 && <span style={{marginLeft:4, background:'var(--accent)', color:'#fff', borderRadius:'50%', width:17, height:17, fontSize:11, display:'inline-grid', placeItems:'center'}}>{activeFilters}</span>}
            </button>
            {filterOpen && (
              <div className="card" style={{position:'absolute', right:0, top:'calc(100% + 6px)', zIndex:30, padding:18, minWidth:260, boxShadow:'var(--shadow-lg)'}}>
                <div className="row between" style={{marginBottom:14}}>
                  <span style={{fontSize:13, fontWeight:500}}>Filters</span>
                  {activeFilters > 0 && <button className="btn btn-quiet" style={{padding:'3px 8px', fontSize:12}} onClick={()=>{setFilterSubject('All');setFilterDiff('All');}}>Clear all</button>}
                </div>
                <div className="col" style={{gap:12}}>
                  <FilterSel label="Subject"    value={filterSubject} onChange={setFilterSubject} options={['All','Math','Reading']}/>
                  <FilterSel label="Difficulty" value={filterDiff}    onChange={setFilterDiff}    options={['All','Easy','Medium','Hard']}/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col" style={{gap: 16}}>
        {visible.map(q => <ReviewCard key={q.id} q={q} onAct={act}/>)}
        {visible.length === 0 && (
          <div className="card" style={{padding: 48, textAlign:'center'}}>
            <h3 style={{marginBottom: 6}}>All caught up.</h3>
            <p className="muted small">Nothing in the review queue right now.</p>
          </div>
        )}
      </div>

      {editing && <ReviewEditModal q={editing} onSave={saveEdit} onClose={() => setEditing(null)}/>}
    </div>
  );
}

function ReviewCard({ q, onAct }){
  const [open, setOpen] = useStateA(false);
  const conf = Math.round(q.confidence*100);
  const confTone = conf >= 85 ? 'tag-ok' : conf >= 75 ? 'tag-warn' : 'tag-bad';

  return (
    <div className="card qcard">
      <div className="meta">
        <div className="row" style={{gap: 8}}>
          <span className="mono" style={{color:'var(--ink-3)'}}>{q.id}</span>
          <span className="tag">{q.subject}</span>
          <span className="tag tag-strong">{q.topic}</span>
          <DiffPill level={q.difficulty}/>
        </div>
        <div className="row" style={{gap: 14, color:'var(--ink-3)'}}>
          <span className={"tag " + confTone}>AI confidence · {conf}%</span>
          <span>Generated {q.generated}</span>
        </div>
      </div>

      <p className="qtext">{q.text}</p>

      <div className="answers">
        {q.answers.map(a => (
          <div key={a.k} className={"ans " + (a.correct ? 'correct' : '')}>
            <div className="k">{a.k}</div>
            <div style={{flex:1}}>{a.t}</div>
            {a.correct && <ICheck size={14}/>}
          </div>
        ))}
      </div>

      {open && (
        <div style={{padding:'14px 16px', background:'var(--surface-2)', border:'1px solid var(--border-2)', borderRadius: 10, marginBottom: 16, color:'var(--ink-2)', fontSize:14}}>
          <div className="small muted" style={{textTransform:'uppercase', letterSpacing:'.08em', fontWeight:500, marginBottom: 6}}>Generator rationale</div>
          {q.rationale}
        </div>
      )}

      <div className="qcard-actions">
        <button className="btn btn-quiet" onClick={()=>setOpen(!open)}>
          {open ? 'Hide rationale' : 'Show rationale'} <IChevD style={{transform: open ? 'rotate(180deg)' : 'none', transition:'transform .2s ease'}}/>
        </button>
        <div style={{flex:1}}/>
        <button className="btn btn-ghost" onClick={()=>onAct(q.id,'reject')}><IX/> Reject</button>
        <button className="btn btn-ghost" onClick={()=>onAct(q.id,'edit')}><IEdit/> Edit</button>
        <button className="btn btn-primary" onClick={()=>onAct(q.id,'approve')}><ICheck/> Approve &amp; publish</button>
      </div>
    </div>
  );
}

Object.assign(window, { AdminBank, AdminReview });

/* ---------------- Review edit modal ---------------- */
function ReviewEditModal({ q, onSave, onClose }){
  const [topic, setTopic]           = useStateA(q.topic);
  const [difficulty, setDifficulty] = useStateA(q.difficulty);
  const [text, setText]             = useStateA(q.text);
  const [answers, setAnswers]       = useStateA(q.answers);
  const [rationale, setRationale]   = useStateA(q.rationale || '');

  function setAnswerText(i, t){
    setAnswers(answers.map((a, idx) => idx === i ? {...a, t} : a));
  }
  function markCorrect(k){
    setAnswers(answers.map(a => ({...a, correct: a.k === k})));
  }

  function save(){
    onSave({ ...q, topic, difficulty, text, answers, rationale });
  }

  const stop = e => e.stopPropagation();
  return (
    <div onClick={onClose} style={{position:'fixed', inset:0, background:'rgba(20,20,20,0.4)', display:'grid', placeItems:'center', zIndex:60, padding:24}}>
      <div
        onClick={stop}
        className="card"
        data-comment-modal="admin.ai_review.edit"
        data-comment-target={q.id}
        style={{width:'min(720px, 100%)', maxHeight:'90vh', overflow:'auto', padding:0, boxShadow:'var(--shadow-lg)'}}
      >
        <div className="row between" style={{padding:'18px 22px', borderBottom:'1px solid var(--border)'}}>
          <div>
            <div className="small muted">{q.id} · {q.subject}</div>
            <h3 style={{marginTop: 2}}>Edit question</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><IX/></button>
        </div>

        <div className="col" style={{padding:'20px 22px', gap: 18}}>
          <div className="row" style={{gap: 14}}>
            <label className="col" style={{flex:1, gap:6}}>
              <span className="small muted">Sub-topic</span>
              <input type="text" value={topic} onChange={e=>setTopic(e.target.value)}/>
            </label>
            <label className="col" style={{flex:1, gap:6}}>
              <span className="small muted">Difficulty</span>
              <select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </label>
          </div>

          <label className="col" style={{gap:6}}>
            <span className="small muted">Question text</span>
            <textarea rows="5" value={text} onChange={e=>setText(e.target.value)}
                      style={{resize:'vertical', fontFamily:'var(--serif)', fontSize:15, lineHeight:1.5}}/>
          </label>

          <div className="col" style={{gap:8}}>
            <span className="small muted">Answer choices · click a letter to mark correct</span>
            {answers.map((a, i) => (
              <div key={a.k} className="row" style={{gap:10, alignItems:'center'}}>
                <button onClick={() => markCorrect(a.k)}
                        title="Mark as correct"
                        style={{
                          width:34, height:34, borderRadius:'50%', flex:'none',
                          border: '1px solid ' + (a.correct ? 'var(--ok)' : 'var(--border)'),
                          background: a.correct ? 'var(--ok)' : 'var(--surface)',
                          color: a.correct ? '#fff' : 'var(--ink-2)',
                          fontSize:13, fontWeight:500, cursor:'pointer'
                        }}>
                  {a.k}
                </button>
                <input type="text" value={a.t} onChange={e => setAnswerText(i, e.target.value)} style={{flex:1}}/>
                {a.correct && <span className="tag tag-ok" style={{fontSize:11}}>Correct</span>}
              </div>
            ))}
          </div>

          <label className="col" style={{gap:6}}>
            <span className="small muted">Generator rationale</span>
            <textarea
              rows="4"
              value={rationale}
              onChange={e=>setRationale(e.target.value)}
              style={{resize:'vertical', fontSize:14, lineHeight:1.5}}
            />
          </label>
        </div>

        <div className="row between" style={{padding:'14px 22px', borderTop:'1px solid var(--border)', background:'var(--surface-2)'}}>
          <span className="small muted">Edits stay in the queue until you approve &amp; publish.</span>
          <div className="row" style={{gap:10}}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={save}><ICheck/> Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
