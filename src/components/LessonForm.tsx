import { useState } from 'react'
import { FRAMEWORK_INFO, suggestFramework } from '../data/frameworks'
import { L1_OPTIONS } from '../data/l1Notes'
import {
  AGE_GROUPS,
  CEFR_LEVELS,
  FOCUS_TYPES,
  FRAMEWORKS,
  LessonRequestSchema,
  type LessonRequest,
} from '../schema'

const AGE_LABELS: Record<string, string> = { 'young-learners': 'Young learners (6–11)', teens: 'Teens (12–17)', adults: 'Adults' }

export const DEFAULT_REQUEST: LessonRequest = {
  topic: 'Travel experiences',
  targetLanguage: 'present perfect for experiences',
  level: 'A2',
  ageGroup: 'adults',
  focus: 'grammar',
  framework: 'PPP',
  durationMinutes: 60,
  classSize: 12,
  learnerL1: 'Spanish',
  notes: '',
}

interface Props {
  initial: LessonRequest
  aiAvailable: boolean
  busy: boolean
  onGenerate: (req: LessonRequest, mode: 'template' | 'ai') => void
}

export function LessonForm({ initial, aiAvailable, busy, onGenerate }: Props) {
  const [req, setReq] = useState<LessonRequest>(initial)
  const [error, setError] = useState('')
  const [frameworkTouched, setFrameworkTouched] = useState(false)

  function update<K extends keyof LessonRequest>(key: K, value: LessonRequest[K]) {
    setReq((prev) => {
      const next = { ...prev, [key]: value }
      // Keep the framework suggestion in sync until the teacher picks one themselves.
      if (!frameworkTouched && (key === 'focus' || key === 'level')) {
        next.framework = suggestFramework(next.focus, next.level)
      }
      return next
    })
  }

  function submit(mode: 'template' | 'ai') {
    const parsed = LessonRequestSchema.safeParse(req)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check the form.')
      return
    }
    setError('')
    onGenerate(parsed.data, mode)
  }

  const fw = FRAMEWORK_INFO[req.framework]

  return (
    <form className="card form" onSubmit={(e) => { e.preventDefault(); submit('template') }}>
      <h2>Plan a lesson</h2>

      <label className="span-2">
        Topic / theme
        <input value={req.topic} onChange={(e) => update('topic', e.target.value)} placeholder="e.g. Food and restaurants" />
      </label>

      <label className="span-2">
        Target language <span className="hint">grammar point, vocabulary set or function</span>
        <input
          value={req.targetLanguage}
          onChange={(e) => update('targetLanguage', e.target.value)}
          placeholder='e.g. "comparatives", "ordering food", "phrasal verbs with get"'
        />
      </label>

      <label>
        CEFR level
        <select value={req.level} onChange={(e) => update('level', e.target.value as LessonRequest['level'])}>
          {CEFR_LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </label>

      <label>
        Learners
        <select value={req.ageGroup} onChange={(e) => update('ageGroup', e.target.value as LessonRequest['ageGroup'])}>
          {AGE_GROUPS.map((a) => <option key={a} value={a}>{AGE_LABELS[a]}</option>)}
        </select>
      </label>

      <label>
        Main focus
        <select value={req.focus} onChange={(e) => update('focus', e.target.value as LessonRequest['focus'])}>
          {FOCUS_TYPES.map((f) => <option key={f} value={f}>{f[0].toUpperCase() + f.slice(1)}</option>)}
        </select>
      </label>

      <label>
        Framework
        <select
          value={req.framework}
          onChange={(e) => { setFrameworkTouched(true); update('framework', e.target.value as LessonRequest['framework']) }}
        >
          {FRAMEWORKS.map((f) => <option key={f} value={f}>{f} — {FRAMEWORK_INFO[f].name}</option>)}
        </select>
      </label>

      <p className="framework-help span-2">
        <strong>{fw.name}:</strong> {fw.summary} <span className="best-for">Best for: {fw.bestFor}</span>
      </p>

      <label>
        Length (minutes)
        <input type="number" min={15} max={180} step={5} value={req.durationMinutes} onChange={(e) => update('durationMinutes', Number(e.target.value))} />
      </label>

      <label>
        Class size
        <input type="number" min={1} max={60} value={req.classSize} onChange={(e) => update('classSize', Number(e.target.value))} />
      </label>

      <label className="span-2">
        Learners' first language <span className="hint">used to predict common mistakes</span>
        <input list="l1-options" value={req.learnerL1} onChange={(e) => update('learnerL1', e.target.value)} placeholder="e.g. Japanese" />
        <datalist id="l1-options">
          {L1_OPTIONS.map((l) => <option key={l} value={l} />)}
        </datalist>
      </label>

      <label className="span-2">
        Notes <span className="hint">optional: constraints, materials, goals</span>
        <textarea rows={2} value={req.notes} onChange={(e) => update('notes', e.target.value)} placeholder="e.g. Online class on Zoom, no printing. Students are preparing for job interviews." />
      </label>

      {error && <p className="error span-2" role="alert">{error}</p>}

      <div className="actions span-2">
        <button type="submit" disabled={busy}>Generate plan</button>
        <button
          type="button"
          className="secondary"
          disabled={busy || !aiAvailable}
          title={aiAvailable ? 'Uses your own Claude API key' : 'Add your API key in Settings to enable'}
          onClick={() => submit('ai')}
        >
          {busy ? 'Generating…' : '✨ Generate with AI'}
        </button>
        {!aiAvailable && <span className="hint">Add an API key in Settings to use AI.</span>}
      </div>
    </form>
  )
}
