import { useState } from 'react'
import { AI_MODELS, type AiModelId } from '../ai/models'
import type { Settings as SettingsType } from '../storage'

interface Props {
  settings: SettingsType
  onSave: (s: SettingsType) => void
}

export function Settings({ settings, onSave }: Props) {
  const [draft, setDraft] = useState(settings)
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <section className="card form">
      <h2>Settings</h2>
      <div className="span-2 callout">
        <p>
          <strong>The planner is completely free and works without AI.</strong> AI generation is optional.
          If you'd like it, paste your own{' '}
          <a href="https://platform.claude.com/" target="_blank" rel="noreferrer">Claude API key</a>. Your key is stored only in
          this browser and is sent only to Anthropic's API. Any usage is billed to your own account; this site never sees it.
        </p>
      </div>

      <label className="span-2">
        Claude API key
        <div className="inline">
          <input
            type={show ? 'text' : 'password'}
            autoComplete="off"
            value={draft.apiKey}
            onChange={(e) => { setDraft({ ...draft, apiKey: e.target.value.trim() }); setSaved(false) }}
            placeholder="sk-ant-…"
          />
          <button type="button" className="secondary small" onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</button>
        </div>
      </label>

      <label className="span-2">
        Model
        <select value={draft.model} onChange={(e) => { setDraft({ ...draft, model: e.target.value as AiModelId }); setSaved(false) }}>
          {AI_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
      </label>

      <div className="actions span-2">
        <button onClick={() => { onSave(draft); setSaved(true) }}>Save settings</button>
        <button
          className="secondary"
          onClick={() => { const cleared = { ...draft, apiKey: '' }; setDraft(cleared); onSave(cleared); setSaved(true) }}
        >
          Remove key
        </button>
        {saved && <span className="hint">Saved.</span>}
      </div>
    </section>
  )
}
