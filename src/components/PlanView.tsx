import { useState } from 'react'
import { Doodle } from './Doodle'
import { Icon } from './Icon'
import { TagEditor } from './TagEditor'
import { Timeline } from './Timeline'
import { FRAMEWORK_INFO } from '../data/frameworks'
import { downloadFile, planToMarkdown, slugify } from '../export'
import { INTERACTIONS, type Interaction, type LessonPlan, type Stage } from '../schema'

interface Props {
  plan: LessonPlan
  saved: boolean
  /** checkpoint: always record an undo step (structural edits), rather than coalescing with recent typing. */
  onChange: (plan: LessonPlan, checkpoint?: boolean) => void
  onSave: () => void
  onRegenerate?: () => void
  onUndo?: () => void
  canUndo?: boolean
  /** Lets the parent offer "Stage deleted · Undo". */
  onNotice?: (message: string) => void
}

const BLANK_STAGE: Stage = {
  name: 'New stage', minutes: 5, interaction: 'S-S', aim: '', teacherProcedure: [], studentActivity: '', materials: [],
}

/** Shows a plan, and lets the teacher edit any part of it in place. */
export function PlanView({ plan, saved, onChange, onSave, onRegenerate, onUndo, canUndo, onNotice }: Props) {
  const [editing, setEditing] = useState(false)
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)
  const r = plan.request
  const total = plan.stages.reduce((a, s) => a + s.minutes, 0)
  const set = <K extends keyof LessonPlan>(key: K, value: LessonPlan[K]) => onChange({ ...plan, [key]: value })
  const setStage = (i: number, patch: Partial<Stage>) =>
    set('stages', plan.stages.map((s, j) => (j === i ? { ...s, ...patch } : s)))
  const setStages = (stages: Stage[]) => onChange({ ...plan, stages }, true)
  const moveStage = (from: number, to: number) => {
    if (to < 0 || to >= plan.stages.length || from === to) return
    const next = [...plan.stages]
    const [s] = next.splice(from, 1)
    next.splice(to, 0, s)
    setStages(next)
  }
  const deleteStage = (i: number) => {
    setStages(plan.stages.filter((_, j) => j !== i))
    onNotice?.(`Deleted "${plan.stages[i].name}"`)
  }
  const addStage = (at: number) => {
    const next = [...plan.stages]
    next.splice(at, 0, { ...BLANK_STAGE })
    setStages(next)
  }
  const tla = plan.targetLanguageAnalysis
  const setTla = (patch: Partial<typeof tla>) => set('targetLanguageAnalysis', { ...tla, ...patch })

  return (
    <article className="card plan taped taped-right">
      <div className="toolbar no-print">
        <button onClick={() => setEditing((e) => !e)}><Icon name={editing ? 'check' : 'pencil'} /> {editing ? 'Done editing' : 'Edit'}</button>
        {onUndo && <button className="secondary" onClick={onUndo} disabled={!canUndo} title="Undo (⌘Z / Ctrl+Z)"><Icon name="undo" /> Undo</button>}
        <button onClick={onSave} disabled={saved}><span key={String(saved)} className={saved ? 'icon-slot pop' : 'icon-slot'}><Icon name={saved ? 'check' : 'bookmark'} /></span> {saved ? 'Saved' : 'Save'}</button>
        {onRegenerate && <button className="secondary" onClick={onRegenerate}><Icon name="shuffle" /> Try different activities</button>}
        <button className="secondary" onClick={() => window.print()}><Icon name="printer" /> Print</button>
        <button className="secondary" onClick={() => downloadFile(`${slugify(plan.title)}.md`, planToMarkdown(plan), 'text/markdown')}>
          <Icon name="download" /> Download .md
        </button>
      </div>

      <p className="print-only print-brand">
        <span className="logo" aria-hidden="true">Hi</span> Hello Class <span className="hand">lesson plan</span>
        {plan.tags.length > 0 && <span className="print-tags">{plan.tags.map((t) => `#${t}`).join('  ')}</span>}
      </p>
      <div className="plan-title"><Text editing={editing} value={plan.title} onChange={(v) => set('title', v)} as="h2" /></div>
      <dl className="meta">
        <div><dt>Level</dt><dd>{r.level}</dd></div>
        <div><dt>Learners</dt><dd>{r.ageGroup}, {r.classSize} students</dd></div>
        {r.learnerL1 && <div><dt>L1</dt><dd>{r.learnerL1}</dd></div>}
        <div><dt>Length</dt><dd>{r.durationMinutes} min</dd></div>
        <div><dt>Framework</dt><dd>{FRAMEWORK_INFO[r.framework].name}</dd></div>
        {plan.source === 'ai' && <div><dt>Written by</dt><dd>Claude</dd></div>}
      </dl>
      <TagEditor tags={plan.tags} onChange={(tags) => set('tags', tags)} />
      <Timeline stages={plan.stages} />

      <section className="reveal">
        <h3 className="doodle-head"><Doodle name="target" size={36} />Aims</h3>
        <p><strong>Main aim: </strong><Text editing={editing} value={plan.mainAim} onChange={(v) => set('mainAim', v)} /></p>
        <h4>Subsidiary aims</h4>
        <List editing={editing} items={plan.subsidiaryAims} onChange={(v) => set('subsidiaryAims', v)} />
        <h4>Learning outcomes</h4>
        <List editing={editing} items={plan.learningOutcomes} onChange={(v) => set('learningOutcomes', v)} />
      </section>

      <section className="reveal">
        <h3 className="doodle-head"><Doodle name="bubble" size={36} />Target language analysis</h3>
        <div className="tla">
          <p><strong>Form: </strong><Text editing={editing} value={tla.form} onChange={(v) => setTla({ form: v })} multiline /></p>
          <p><strong>Meaning: </strong><Text editing={editing} value={tla.meaning} onChange={(v) => setTla({ meaning: v })} multiline /></p>
          <p><strong>Pronunciation: </strong><Text editing={editing} value={tla.pronunciation} onChange={(v) => setTla({ pronunciation: v })} multiline /></p>
        </div>
        <h4>Examples</h4>
        <List editing={editing} items={tla.examples} onChange={(v) => setTla({ examples: v })} />
        <h4>Concept-check questions (CCQs)</h4>
        <List editing={editing} items={tla.conceptCheckQuestions} onChange={(v) => setTla({ conceptCheckQuestions: v })} />
        {(editing || plan.keyVocabulary.length > 0) && (
          <>
            <h4>Key vocabulary</h4>
            <List editing={editing} items={plan.keyVocabulary} onChange={(v) => set('keyVocabulary', v)} inline />
          </>
        )}
      </section>

      <section className="reveal">
        <h3 className="doodle-head">
          <Doodle name="clock" size={36} />
          Procedure{' '}
          <span key={total} className={`timing ${total === r.durationMinutes ? 'ok' : 'warn'} flash`} aria-live="polite">
            {total} / {r.durationMinutes} min
          </span>
        </h3>
        <table className="stages">
          <thead>
            <tr><th>Stage &amp; aim</th><th>Time</th><th>Int.</th><th>Procedure</th></tr>
          </thead>
          <tbody>
            {plan.stages.map((s, i) => (
              <tr
                key={i}
                className={[editing ? 'editable-stage' : '', dragFrom === i ? 'dragging' : '', dragOver === i && dragFrom !== i ? 'drop-target' : ''].join(' ')}
                draggable={editing}
                onDragStart={(e) => { setDragFrom(i); e.dataTransfer.effectAllowed = 'move' }}
                onDragOver={(e) => { if (dragFrom !== null) { e.preventDefault(); setDragOver(i) } }}
                onDrop={(e) => { e.preventDefault(); if (dragFrom !== null) moveStage(dragFrom, i); setDragFrom(null); setDragOver(null) }}
                onDragEnd={() => { setDragFrom(null); setDragOver(null) }}
              >
                <td>
                  {editing && (
                    <div className="stage-tools no-print">
                      <span className="grip" title="Drag to reorder" aria-hidden="true"><Icon name="grip" /></span>
                      <button type="button" className="icon-btn" aria-label={`Move ${s.name} up`} disabled={i === 0} onClick={() => moveStage(i, i - 1)}><Icon name="arrowUp" size={14} /></button>
                      <button type="button" className="icon-btn" aria-label={`Move ${s.name} down`} disabled={i === plan.stages.length - 1} onClick={() => moveStage(i, i + 1)}><Icon name="arrowDown" size={14} /></button>
                      <button type="button" className="icon-btn" aria-label={`Add a stage after ${s.name}`} onClick={() => addStage(i + 1)}><Icon name="plus" size={14} /></button>
                      <button type="button" className="icon-btn danger" aria-label={`Delete ${s.name}`} onClick={() => deleteStage(i)}><Icon name="x" size={14} /></button>
                    </div>
                  )}
                  <strong><Text editing={editing} value={s.name} onChange={(v) => setStage(i, { name: v })} /></strong>
                  <div className="stage-aim"><Text editing={editing} value={s.aim} onChange={(v) => setStage(i, { aim: v })} multiline /></div>
                </td>
                <td>
                  {editing ? (
                    <input className="minutes" type="number" min={1} value={s.minutes} onChange={(e) => setStage(i, { minutes: Number(e.target.value) })} />
                  ) : (
                    `${s.minutes}′`
                  )}
                </td>
                <td>
                  {editing ? (
                    <select value={s.interaction} onChange={(e) => setStage(i, { interaction: e.target.value as Interaction })}>
                      {INTERACTIONS.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  ) : (
                    s.interaction
                  )}
                </td>
                <td>
                  <List editing={editing} items={s.teacherProcedure} onChange={(v) => setStage(i, { teacherProcedure: v })} ordered />
                  <p className="students"><strong>Students: </strong><Text editing={editing} value={s.studentActivity} onChange={(v) => setStage(i, { studentActivity: v })} multiline /></p>
                  {(editing || s.materials.length > 0) && (
                    <div className="materials"><strong>Materials: </strong><List editing={editing} items={s.materials} onChange={(v) => setStage(i, { materials: v })} inline /></div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editing && (
          <button type="button" className="secondary add-stage no-print" onClick={() => addStage(plan.stages.length)}>
            <Icon name="plus" /> Add a stage
          </button>
        )}
        <p className="hint">Interaction: T-Ss = teacher to class, S = individual, S-S = pairs, Groups = small groups.</p>
      </section>

      <section className="reveal">
        <h3 className="doodle-head"><Doodle name="bulb" size={36} />Anticipated problems &amp; solutions</h3>
        <table className="problems">
          <thead><tr><th>Problem</th><th>Solution</th></tr></thead>
          <tbody>
            {plan.anticipatedProblems.map((p, i) => {
              const setP = (patch: Partial<typeof p>) =>
                set('anticipatedProblems', plan.anticipatedProblems.map((x, j) => (j === i ? { ...x, ...patch } : x)))
              return (
                <tr key={i}>
                  <td><Text editing={editing} value={p.problem} onChange={(v) => setP({ problem: v })} multiline /></td>
                  <td><Text editing={editing} value={p.solution} onChange={(v) => setP({ solution: v })} multiline /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section className="two-col reveal">
        <div>
          <h3 className="doodle-head"><Doodle name="arrows" size={36} />Support for weaker learners</h3>
          <List editing={editing} items={plan.differentiation.support} onChange={(v) => set('differentiation', { ...plan.differentiation, support: v })} />
        </div>
        <div>
          <h3 className="doodle-head"><Doodle name="star" size={36} />Stretch for stronger learners</h3>
          <List editing={editing} items={plan.differentiation.stretch} onChange={(v) => set('differentiation', { ...plan.differentiation, stretch: v })} />
        </div>
      </section>

      <section className="two-col reveal">
        <div>
          <h3>Board plan</h3>
          {editing ? (
            <textarea rows={4} value={plan.boardPlan} onChange={(e) => set('boardPlan', e.target.value)} />
          ) : (
            <pre className="board">{plan.boardPlan}</pre>
          )}
        </div>
        <div>
          <h3 className="doodle-head"><Doodle name="house" size={36} />Homework</h3>
          <Text editing={editing} value={plan.homework} onChange={(v) => set('homework', v)} multiline />
        </div>
      </section>
    </article>
  )
}

function Text({ editing, value, onChange, multiline, as }: {
  editing: boolean
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  as?: 'h2'
}) {
  if (editing) {
    return multiline
      ? <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} />
      : <input className={as === 'h2' ? 'title-input' : undefined} value={value} onChange={(e) => onChange(e.target.value)} />
  }
  return as === 'h2' ? <h2>{value}</h2> : <span>{value}</span>
}

/** A list of strings. When editing, it's a textarea with one item per line. */
function List({ editing, items, onChange, ordered, inline }: {
  editing: boolean
  items: string[]
  onChange: (v: string[]) => void
  ordered?: boolean
  inline?: boolean
}) {
  if (editing) {
    return (
      <textarea
        rows={Math.max(2, items.length + 1)}
        value={items.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
        onBlur={(e) => onChange(e.target.value.split('\n').map((l) => l.trim()).filter(Boolean))}
        placeholder="One item per line"
      />
    )
  }
  if (inline) return <span>{items.join(', ')}</span>
  const Tag = ordered ? 'ol' : 'ul'
  return <Tag>{items.map((it, i) => <li key={i}>{it}</li>)}</Tag>
}
