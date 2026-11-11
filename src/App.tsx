import { useEffect, useRef, useState } from 'react'
import { About } from './components/About'
import { DEFAULT_REQUEST, LessonForm } from './components/LessonForm'
import { Library } from './components/Library'
import { PlanView } from './components/PlanView'
import { PlanSkeleton } from './components/PlanSkeleton'
import { Settings } from './components/Settings'
import { generateTemplatePlan } from './generator/templateGenerator'
import type { LessonContent, LessonPlan, LessonRequest } from './schema'
import { loadPlans, loadSettings, newId, savePlans, saveSettings, type Settings as SettingsType } from './storage'

type Tab = 'plan' | 'library' | 'settings' | 'about'

function toPlan(content: LessonContent, request: LessonRequest, source: LessonPlan['source']): LessonPlan {
  const now = new Date().toISOString()
  return { ...content, id: newId(), createdAt: now, updatedAt: now, source, request }
}

export default function App() {
  const [tab, setTab] = useState<Tab>('plan')
  const [plans, setPlans] = useState<LessonPlan[]>(loadPlans)
  const [settings, setSettings] = useState<SettingsType>(loadSettings)
  // First-time visitors see a real plan built from the default inputs, so the product explains itself.
  const [current, setCurrent] = useState<LessonPlan | null>(() =>
    loadPlans().length === 0 ? toPlan(generateTemplatePlan(DEFAULT_REQUEST, 0), DEFAULT_REQUEST, 'template') : null,
  )
  const [isExample, setIsExample] = useState(() => current !== null)
  const [dirty, setDirty] = useState(true)
  const [variant, setVariant] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const planRef = useRef<HTMLDivElement>(null)
  // Bumped on every fresh generation so the plan replays its entrance animation.
  const [generation, setGeneration] = useState(0)

  /** After generating, bring the new plan into view so the teacher sees that something happened. */
  function revealPlan() {
    setGeneration((g) => g + 1)
    requestAnimationFrame(() => planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  useEffect(() => savePlans(plans), [plans])

  const isSaved = !!current && !dirty && plans.some((p) => p.id === current.id)

  async function generate(req: LessonRequest, mode: 'template' | 'ai') {
    setError('')
    setIsExample(false)
    if (mode === 'template') {
      setVariant(0)
      setCurrent(toPlan(generateTemplatePlan(req, 0), req, 'template'))
      setDirty(true)
      revealPlan()
      return
    }
    setBusy(true)
    // Loaded on demand so people who never use AI never download the SDK.
    const ai = await import('./ai/claudeGenerator')
    try {
      const content = await ai.generateAiPlan(req, settings.apiKey, settings.model)
      setCurrent(toPlan(content, req, 'ai'))
      setDirty(true)
      revealPlan()
    } catch (e) {
      setError(ai.describeAiError(e))
    } finally {
      setBusy(false)
    }
  }

  function regenerate() {
    if (!current) return
    setIsExample(false)
    const v = variant + 1
    setVariant(v)
    setCurrent({ ...toPlan(generateTemplatePlan(current.request, v), current.request, 'template'), id: current.id })
    setDirty(true)
    setGeneration((g) => g + 1)
  }

  function saveCurrent() {
    if (!current) return
    const updated = { ...current, updatedAt: new Date().toISOString() }
    setCurrent(updated)
    setPlans((ps) => (ps.some((p) => p.id === updated.id) ? ps.map((p) => (p.id === updated.id ? updated : p)) : [...ps, updated]))
    setDirty(false)
  }

  function open(plan: LessonPlan) {
    setIsExample(false)
    setCurrent(plan)
    setDirty(false)
    setTab('plan')
  }

  return (
    <div className="app">
      <header className="no-print">
        <div className="brand">
          <span className="logo">Aa</span>
          <div>
            <h1>ESL Lesson Planner</h1>
            <p>Free lesson plans for English teachers, with CEFR levels, proven frameworks and first-language tips.</p>
          </div>
        </div>
        <nav>
          {(['plan', 'library', 'settings', 'about'] as Tab[]).map((t) => (
            <button key={t} className={tab === t ? 'tab active' : 'tab'} onClick={() => setTab(t)}>
              {{ plan: 'Plan', library: `My lessons (${plans.length})`, settings: 'Settings', about: 'About' }[t]}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === 'plan' && (
          <>
            <div className="no-print">
              <LessonForm
                key={current?.id ?? 'new'}
                initial={current?.request ?? DEFAULT_REQUEST}
                aiAvailable={!!settings.apiKey}
                busy={busy}
                onGenerate={generate}
              />
              {error && <p className="error card" role="alert">{error}</p>}
            </div>
            {current && isExample && !busy && (
              <p className="example-note no-print">
                <strong>Example:</strong> this is the plan the inputs above produce. Change them and press Generate plan to make your own.
              </p>
            )}
            <div ref={planRef} className="plan-anchor" />
            {busy && <PlanSkeleton />}
            {current && !busy && (
              <PlanView
                key={generation}
                plan={current}
                saved={isSaved}
                onChange={(p) => { setCurrent(p); setDirty(true); setIsExample(false) }}
                onSave={saveCurrent}
                onRegenerate={current.source === 'template' ? regenerate : undefined}
              />
            )}
          </>
        )}
        {tab === 'library' && (
          <Library
            plans={plans}
            onOpen={open}
            onDelete={(id) => {
              setPlans((ps) => ps.filter((p) => p.id !== id))
              if (current?.id === id) setCurrent(null)
            }}
            onDuplicate={(p) => {
              const now = new Date().toISOString()
              setPlans((ps) => [...ps, { ...p, id: newId(), title: `${p.title} (copy)`, createdAt: now, updatedAt: now }])
            }}
            onImport={(imported) =>
              setPlans((ps) => {
                const byId = new Map(ps.map((p) => [p.id, p]))
                for (const p of imported) byId.set(p.id, p)
                return [...byId.values()]
              })
            }
          />
        )}
        {tab === 'settings' && <Settings settings={settings} onSave={(s) => { setSettings(s); saveSettings(s) }} />}
        {tab === 'about' && <About />}
      </main>

      <footer className="no-print">
        Free and open source ·{' '}
        <a href="https://github.com/Prestoj01/teaching-english-planner" target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </div>
  )
}
