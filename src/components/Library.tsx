import { useRef, useState } from 'react'
import { downloadFile } from '../export'
import { Doodle } from './Doodle'
import { Icon } from './Icon'
import { MiniTimeline } from './Timeline'
import { parseImport } from '../storage'
import { CEFR_LEVELS, FOCUS_TYPES, type LessonPlan } from '../schema'

interface Props {
  plans: LessonPlan[]
  onOpen: (plan: LessonPlan) => void
  onDelete: (id: string) => void
  onDuplicate: (plan: LessonPlan) => void
  onImport: (plans: LessonPlan[]) => void
}

export function Library({ plans, onOpen, onDelete, onDuplicate, onImport }: Props) {
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  // Filters: OR within a group, AND across groups. Only values that exist in the library are offered.
  const [levels, setLevels] = useState<string[]>([])
  const [focuses, setFocuses] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const toggle = (set: (f: (xs: string[]) => string[]) => void, v: string) => set((xs) => (xs.includes(v) ? xs.filter((x) => x !== v) : [...xs, v]))
  const presentLevels = CEFR_LEVELS.filter((l) => plans.some((p) => p.request.level === l))
  const presentFocuses = FOCUS_TYPES.filter((f) => plans.some((p) => p.request.focus === f))
  const presentTags = [...new Set(plans.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b))
  const filtering = levels.length + focuses.length + tags.length > 0

  const q = query.toLowerCase()
  const shown = plans
    .filter((p) => !q || `${p.title} ${p.request.topic} ${p.request.level} ${p.request.targetLanguage} ${p.tags.join(' ')}`.toLowerCase().includes(q))
    .filter((p) => !levels.length || levels.includes(p.request.level))
    .filter((p) => !focuses.length || focuses.includes(p.request.focus))
    .filter((p) => !tags.length || tags.some((t) => p.tags.includes(t)))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  async function handleImport(file: File) {
    try {
      const imported = parseImport(await file.text())
      onImport(imported)
      setMessage(`Imported ${imported.length} lesson${imported.length === 1 ? '' : 's'}.`)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Import failed.')
    }
  }

  return (
    <section className="library stack">
      <div className="library-head">
        <h2>Your saved lesson plans</h2>
        <input type="search" placeholder="Search by title, topic, level or tag…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <p className="hint">
        Lessons are saved only in this browser. Export a backup to move them to another device.
      </p>
      <div className="actions">
        <button
          className="secondary"
          disabled={plans.length === 0}
          onClick={() => downloadFile(`esl-lessons-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(plans, null, 2), 'application/json')}
        >
          <Icon name="download" /> Export
        </button>
        <button className="secondary" onClick={() => fileInput.current?.click()}><Icon name="upload" /> Import</button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = '' }}
        />
        {message && <span key={message} className="hint confirm" role="status">{message}</span>}
      </div>

      {plans.length > 1 && (
        <div className="filters" role="group" aria-label="Filter lessons">
          {presentLevels.map((l) => (
            <button key={l} className={`filter${levels.includes(l) ? ' on' : ''}`} aria-pressed={levels.includes(l)} onClick={() => toggle(setLevels, l)}>{l}</button>
          ))}
          {presentFocuses.length > 0 && <span className="filter-sep" aria-hidden="true" />}
          {presentFocuses.map((f) => (
            <button key={f} className={`filter focus${focuses.includes(f) ? ' on' : ''}`} aria-pressed={focuses.includes(f)} onClick={() => toggle(setFocuses, f)}>{f}</button>
          ))}
          {presentTags.length > 0 && <span className="filter-sep" aria-hidden="true" />}
          {presentTags.map((t) => (
            <button key={t} className={`filter tag-filter${tags.includes(t) ? ' on' : ''}`} aria-pressed={tags.includes(t)} onClick={() => toggle(setTags, t)}># {t}</button>
          ))}
          {filtering && <button className="filter clear" onClick={() => { setLevels([]); setFocuses([]); setTags([]) }}>Clear</button>}
        </div>
      )}

      {shown.length === 0 ? (
        <div className="empty">
          <Doodle name="plane" size={88} className="float" />
          <p className="hand">{plans.length === 0 ? 'Nothing saved yet. Plan a lesson and press Save.' : 'No lessons match those filters.'}</p>
        </div>
      ) : (
        <ul className="lesson-grid">
          {shown.map((p) => (
            <li key={p.id} className="lesson-card reveal">
              <button className="lesson-open" onClick={() => onOpen(p)} aria-label={`Open ${p.title}`}>
                <span className="lesson-date hand">{new Date(p.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                <strong className="lesson-title">{p.title}</strong>
                <span className="chips">
                  <span className="chip level">{p.request.level}</span>
                  <span className="chip focus">{p.request.focus}</span>
                  <span className="chip num">{p.request.durationMinutes} min</span>
                  {p.source === 'ai' && <span className="chip">by Claude</span>}
                  {p.tags.map((t) => <span key={t} className="chip tag-chip"># {t}</span>)}
                </span>
                <MiniTimeline stages={p.stages} />
              </button>
              <div className="card-actions">
                <button className="secondary small" onClick={() => onDuplicate(p)}><Icon name="copy" size={14} /> Duplicate</button>
                <button
                  className="danger small"
                  onClick={() => { if (confirm(`Delete "${p.title}"?`)) onDelete(p.id) }}
                >
                  <Icon name="trash" size={14} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
