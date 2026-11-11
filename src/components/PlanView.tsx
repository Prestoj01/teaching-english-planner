import { useState } from 'react'
import { Icon } from './Icon'
import { FRAMEWORK_INFO } from '../data/frameworks'
import { downloadFile, planToMarkdown, slugify } from '../export'
import { INTERACTIONS, type Interaction, type LessonPlan, type Stage } from '../schema'

interface Props {
  plan: LessonPlan
  saved: boolean
  onChange: (plan: LessonPlan) => void
  onSave: () => void
  onRegenerate?: () => void
}

/** Shows a plan, and lets the teacher edit any part of it in place. */
export function PlanView({ plan, saved, onChange, onSave, onRegenerate }: Props) {
  const [editing, setEditing] = useState(false)
  const r = plan.request
  const total = plan.stages.reduce((a, s) => a + s.minutes, 0)
  const set = <K extends keyof LessonPlan>(key: K, value: LessonPlan[K]) => onChange({ ...plan, [key]: value })
  const setStage = (i: number, patch: Partial<Stage>) =>
    set('stages', plan.stages.map((s, j) => (j === i ? { ...s, ...patch } : s)))
  const tla = plan.targetLanguageAnalysis
  const setTla = (patch: Partial<typeof tla>) => set('targetLanguageAnalysis', { ...tla, ...patch })

  return (
    <article className="card plan">
      <div className="toolbar no-print">
        <button onClick={() => setEditing((e) => !e)}><Icon name={editing ? 'check' : 'pencil'} /> {editing ? 'Done editing' : 'Edit'}</button>
        <button onClick={onSave} disabled={saved}><Icon name={saved ? 'check' : 'bookmark'} /> {saved ? 'Saved' : 'Save'}</button>
        {onRegenerate && <button className="secondary" onClick={onRegenerate}><Icon name="shuffle" /> Try different activities</button>}
        <button className="secondary" onClick={() => window.print()}><Icon name="printer" /> Print</button>
        <button className="secondary" onClick={() => downloadFile(`${slugify(plan.title)}.md`, planToMarkdown(plan), 'text/markdown')}>
          <Icon name="download" /> Download .md
        </button>
      </div>

      <Text editing={editing} value={plan.title} onChange={(v) => set('title', v)} as="h2" />
      <dl className="meta">
        <div><dt>Level</dt><dd>{r.level}</dd></div>
        <div><dt>Learners</dt><dd>{r.ageGroup}, {r.classSize} students</dd></div>
        {r.learnerL1 && <div><dt>L1</dt><dd>{r.learnerL1}</dd></div>}
        <div><dt>Length</dt><dd>{r.durationMinutes} min</dd></div>
        <div><dt>Framework</dt><dd>{FRAMEWORK_INFO[r.framework].name}</dd></div>
        {plan.source === 'ai' && <div><dt>Written by</dt><dd>Claude</dd></div>}
      </dl>

      <section>
        <h3>Aims</h3>
        <p><strong>Main aim: </strong><Text editing={editing} value={plan.mainAim} onChange={(v) => set('mainAim', v)} /></p>
        <h4>Subsidiary aims</h4>
        <List editing={editing} items={plan.subsidiaryAims} onChange={(v) => set('subsidiaryAims', v)} />
        <h4>Learning outcomes</h4>
        <List editing={editing} items={plan.learningOutcomes} onChange={(v) => set('learningOutcomes', v)} />
      </section>

      <section>
        <h3>Target language analysis</h3>
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

      <section>
        <h3>
          Procedure{' '}
          <span className={`timing ${total === r.durationMinutes ? 'ok' : 'warn'}`}>
            {total} / {r.durationMinutes} min
          </span>
        </h3>
        <table className="stages">
          <thead>
            <tr><th>Stage &amp; aim</th><th>Time</th><th>Int.</th><th>Procedure</th></tr>
          </thead>
          <tbody>
            {plan.stages.map((s, i) => (
              <tr key={i}>
                <td>
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
        <p className="hint">Interaction: T-Ss = teacher to class, S = individual, S-S = pairs, Groups = small groups.</p>
      </section>

      <section>
        <h3>Anticipated problems &amp; solutions</h3>
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

      <section className="two-col">
        <div>
          <h3>Support for weaker learners</h3>
          <List editing={editing} items={plan.differentiation.support} onChange={(v) => set('differentiation', { ...plan.differentiation, support: v })} />
        </div>
        <div>
          <h3>Stretch for stronger learners</h3>
          <List editing={editing} items={plan.differentiation.stretch} onChange={(v) => set('differentiation', { ...plan.differentiation, stretch: v })} />
        </div>
      </section>

      <section className="two-col">
        <div>
          <h3>Board plan</h3>
          {editing ? (
            <textarea rows={4} value={plan.boardPlan} onChange={(e) => set('boardPlan', e.target.value)} />
          ) : (
            <pre className="board">{plan.boardPlan}</pre>
          )}
        </div>
        <div>
          <h3>Homework</h3>
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
