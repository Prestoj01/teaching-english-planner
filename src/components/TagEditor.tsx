import { useState } from 'react'

/** The teacher's own labels for a plan. Enter or comma adds a tag; × removes one. */
export function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState('')

  function add() {
    const t = draft.trim().replace(/,$/, '')
    if (t && !tags.some((x) => x.toLowerCase() === t.toLowerCase())) onChange([...tags, t])
    setDraft('')
  }

  return (
    <div className="tags no-print">
      {tags.map((t) => (
        <span key={t} className="tag">
          {t}
          <button type="button" aria-label={`Remove tag ${t}`} onClick={() => onChange(tags.filter((x) => x !== t))}>×</button>
        </span>
      ))}
      <input
        className="tag-input"
        value={draft}
        aria-label="Add a tag"
        placeholder={tags.length ? '+ tag' : '+ add a tag, e.g. Class 3B'}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() }
          if (e.key === 'Backspace' && !draft && tags.length) onChange(tags.slice(0, -1))
        }}
        onBlur={add}
      />
    </div>
  )
}
