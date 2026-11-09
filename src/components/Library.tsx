import { useRef, useState } from 'react'
import { downloadFile } from '../export'
import { parseImport } from '../storage'
import type { LessonPlan } from '../schema'

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

  const q = query.toLowerCase()
  const shown = plans
    .filter((p) => !q || `${p.title} ${p.request.topic} ${p.request.level} ${p.request.targetLanguage}`.toLowerCase().includes(q))
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
    <section className="card">
      <div className="library-head">
        <h2>My lessons ({plans.length})</h2>
        <input type="search" placeholder="Search by title, topic or level…" value={query} onChange={(e) => setQuery(e.target.value)} />
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
          Export backup
        </button>
        <button className="secondary" onClick={() => fileInput.current?.click()}>Import backup</button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = '' }}
        />
        {message && <span className="hint">{message}</span>}
      </div>

      {shown.length === 0 ? (
        <p className="empty">{plans.length === 0 ? 'No saved lessons yet. Plan one and press "Save".' : 'No lessons match your search.'}</p>
      ) : (
        <ul className="lesson-list">
          {shown.map((p) => (
            <li key={p.id}>
              <button className="link" onClick={() => onOpen(p)}>
                <strong>{p.title}</strong>
                <span className="hint">
                  {p.request.level} · {p.request.focus} · {p.request.durationMinutes} min · {new Date(p.updatedAt).toLocaleDateString()}
                </span>
              </button>
              <div className="row-actions">
                <button className="secondary small" onClick={() => onDuplicate(p)}>Duplicate</button>
                <button
                  className="danger small"
                  onClick={() => { if (confirm(`Delete "${p.title}"?`)) onDelete(p.id) }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
