import { useState } from 'react'
import { Doodle } from './Doodle'
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
    <section className="settings-page">
      <header className="page-head">
        <Doodle name="bulb" size={64} />
        <div>
          <h2>Optional: write plans with your own Claude key</h2>
          <p className="lede">Claude writes a fully custom plan from your notes, in under a minute. Everything else on this site works without it.</p>
        </div>
      </header>

      <div className="settings-layout">
      <div className="card taped stack key-card">
      <p className={`key-status ${settings.apiKey ? 'on' : ''}`}>
        <span className="dot" aria-hidden="true" /> {settings.apiKey ? 'AI is on: a key is saved in this browser' : 'AI is off: no key saved'}
      </p>
      <label>
        Claude API key
        <div className="input-group">
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
        {saved && <span className="hint confirm" role="status"><Icon name="check" size={14} /> Saved</span>}
      </div>
      </div>

      <aside className="sticky-note key-facts">
        <h3 className="hand">Good to know</h3>
        <ul>
          <li>The planner is <strong>completely free</strong> without AI.</li>
          <li>Your key is stored <strong>only in this browser</strong> and sent only to Anthropic.</li>
          <li>Usage is billed to <strong>your own</strong> Anthropic account. This site never sees it.</li>
          <li>Get a key at <a href="https://platform.claude.com/" target="_blank" rel="noreferrer">platform.claude.com</a>.</li>
        </ul>
      </aside>
      </div>
    </section>
  )
}
