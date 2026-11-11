import { useState } from 'react'
import { Icon } from './Icon'
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
    <section className="card stack settings">
      <h2>Optional: write plans with your own Claude key</h2>
      <div className="callout">
        <p>
          <strong>The planner is completely free and works without AI.</strong> AI generation is optional.
          If you'd like it, paste your own{' '}
          <a href="https://platform.claude.com/" target="_blank" rel="noreferrer">Claude API key</a>. Your key is stored only in
          this browser and is sent only to Anthropic's API. Any usage is billed to your own account; this site never sees it.
        </p>
      </div>

      <label>
        Claude API key
        <div className="inline">
          <input
            className="mono"
            type={show ? 'text' : 'password'}
            autoComplete="off"
            value={draft.apiKey}
            onChange={(e) => { setDraft({ ...draft, apiKey: e.target.value.trim() }); setSaved(false) }}
            placeholder="sk-ant-…"
          />
          <button type="button" className="secondary small" onClick={() => setShow((s) => !s)}><Icon name={show ? 'eyeOff' : 'eye'} size={14} /> {show ? 'Hide' : 'Show'}</button>
        </div>
      </label>

      <label>
        Model
        <select value={draft.model} onChange={(e) => { setDraft({ ...draft, model: e.target.value as AiModelId }); setSaved(false) }}>
          {AI_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
      </label>

      <div className="actions">
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
