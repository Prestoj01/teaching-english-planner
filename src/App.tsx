import { useEffect, useRef, useState } from 'react'
import { About } from './components/About'
import { DEFAULT_REQUEST, LessonForm } from './components/LessonForm'
import { Library } from './components/Library'
import { PlanView } from './components/PlanView'
import { ErrorNote } from './components/ErrorNote'
import { Hero } from './components/Hero'
import { Icon } from './components/Icon'
import { Marquee } from './components/Marquee'
import { PlanSkeleton } from './components/PlanSkeleton'
import { Settings } from './components/Settings'
import { ThemeToggle } from './components/ThemeToggle'
import { generateTemplatePlan } from './generator/templateGenerator'
import type { LessonContent, LessonPlan, LessonRequest } from './schema'
import { decodeShare, isShareHash } from './share'
import { useReveal } from './useReveal'
import { loadPlans, loadSettings, newId, savePlans, saveSettings, type Settings as SettingsType } from './storage'

const TABS = ['plan', 'library', 'settings', 'about'] as const
type Tab = (typeof TABS)[number]

/** The current tab lives in the URL hash (#library, #settings…), so links and the back button work. */
function tabFromHash(): Tab {
  const h = location.hash.slice(1)
  return (TABS as readonly string[]).includes(h) ? (h as Tab) : 'plan'
}

function toPlan(content: LessonContent, request: LessonRequest, source: LessonPlan['source']): LessonPlan {
  const now = new Date().toISOString()
  return { ...content, id: newId(), createdAt: now, updatedAt: now, source, request, tags: [] }
}

export default function App() {
  const [tab, setTabState] = useState<Tab>(tabFromHash)
  useEffect(() => {
    const onHash = () => setTabState(tabFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  function setTab(t: Tab) {
    if (t === tabFromHash()) return
    if (t === 'plan') history.pushState(null, '', location.pathname + location.search)
    else location.hash = t
    setTabState(t)
  }
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
  const [shareError, setShareError] = useState(false)
  const lastAiRequest = useRef<LessonRequest | null>(null)
  const planRef = useRef<HTMLDivElement>(null)
  // Bumped on every fresh generation so the plan replays its entrance animation.
  const [generation, setGeneration] = useState(0)

  /** After generating, bring the new plan into view so the teacher sees that something happened. */
  function revealPlan() {
    setGeneration((g) => g + 1)
    requestAnimationFrame(() => planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  // Undo history for the plan on screen. Typing is coalesced into one step per pause;
  // structural edits (move/add/delete stage) always get their own step.
  const undoStack = useRef<LessonPlan[]>([])
  const lastEdit = useRef(0)
  const [undoDepth, setUndoDepth] = useState(0)
  const [notice, setNoticeState] = useState<{ text: string; undoable: boolean } | null>(null)
  const setNotice = (text: string, undoable = true) => setNoticeState(text ? { text, undoable } : null)
  function resetUndo() { undoStack.current = []; setUndoDepth(0); setNoticeState(null) }

  function changePlan(next: LessonPlan, checkpoint = false) {
    const now = Date.now()
    if (current && (checkpoint || now - lastEdit.current > 1000)) {
      undoStack.current = [...undoStack.current.slice(-49), current]
      setUndoDepth(undoStack.current.length)
    }
    lastEdit.current = checkpoint ? 0 : now
    setCurrent(next)
    setDirty(true)
    setIsExample(false)
  }

  function undo() {
    const prev = undoStack.current.pop()
    if (!prev) return
    setUndoDepth(undoStack.current.length)
    lastEdit.current = 0
    setCurrent(prev)
    setDirty(true)
    setNoticeState(null)
  }

  // ⌘Z / Ctrl+Z undoes plan edits, except inside a text field where the browser's own undo is better.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey) || e.shiftKey || e.key.toLowerCase() !== 'z') return
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return
      if (tab !== 'plan' || undoStack.current.length === 0) return
      e.preventDefault()
      undo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    if (!notice) return
    const id = setTimeout(() => setNoticeState(null), 6000)
    return () => clearTimeout(id)
  }, [notice])

  // Opening a share link (#share=…) loads that plan as an unsaved copy, then tidies the URL.
  const [fromShare, setFromShare] = useState(false)
  useEffect(() => {
    async function receive() {
      if (!isShareHash(location.hash)) return
      const shared = await decodeShare(location.hash)
      history.replaceState(null, '', location.pathname + location.search)
      if (!shared) { setShareError(true); return }
      setShareError(false)
      resetUndo()
      setCurrent({ ...toPlan(shared, shared.request, shared.source), tags: shared.tags })
      setDirty(true)
      setIsExample(false)
      setFromShare(true)
      setTabState('plan')
      requestAnimationFrame(() => planRef.current?.scrollIntoView({ block: 'start' }))
    }
    receive()
    window.addEventListener('hashchange', receive)
    return () => window.removeEventListener('hashchange', receive)
  }, [])

  useEffect(() => savePlans(plans), [plans])
  useReveal()

  const isSaved = !!current && !dirty && plans.some((p) => p.id === current.id)

  async function generate(req: LessonRequest, mode: 'template' | 'ai') {
    setError('')
    setIsExample(false)
    setFromShare(false)
    if (mode === 'template') {
      resetUndo()
      setVariant(0)
      setCurrent(toPlan(generateTemplatePlan(req, 0), req, 'template'))
      setDirty(true)
      revealPlan()
      return
    }
    setBusy(true)
    lastAiRequest.current = req
    requestAnimationFrame(() => planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    // Loaded on demand so people who never use AI never download the SDK.
    const ai = await import('./ai/claudeGenerator')
    try {
      const content = await ai.generateAiPlan(req, settings.apiKey, settings.model)
      resetUndo()
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
    changePlan({ ...toPlan(generateTemplatePlan(current.request, v), current.request, 'template'), id: current.id, tags: current.tags }, true)
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
    resetUndo()
    setFromShare(false)
    setIsExample(false)
    setCurrent(plan)
    setDirty(false)
    setTab('plan')
  }

  return (
    <div className="app">
      <header className="no-print">
        <div className="brand">
          <span className="logo" aria-hidden="true">Hi</span>
          <div>
            <h1>Hello Class</h1>
            <p className="hand tagline">free lesson plans for English teachers</p>
          </div>
        </div>
        <div className="header-right">
        <nav>
          {TABS.map((t) => (
            <button key={t} className={tab === t ? 'tab active' : 'tab'} aria-current={tab === t ? 'page' : undefined} onClick={() => setTab(t)}>
              {{ plan: 'Plan', library: `My lessons (${plans.length})`, settings: 'Settings', about: 'About' }[t]}
            </button>
          ))}
        </nav>
        <ThemeToggle />
        </div>
      </header>

      <main>
        {tab === 'plan' && (
          <>
            <Hero />
            <Marquee />
            <div className="no-print">
              <LessonForm
                key={current?.id ?? 'new'}
                initial={current?.request ?? DEFAULT_REQUEST}
                aiAvailable={!!settings.apiKey}
                busy={busy}
                onGenerate={generate}
              />
              {shareError && (
                <ErrorNote
                  title="That share link didn't work"
                  message="It looks incomplete or damaged, so the plan couldn't be opened. Ask for the link again: some apps cut long links short."
                  onDismiss={() => setShareError(false)}
                />
              )}
              {error && (
                <ErrorNote
                  message={error}
                  onRetry={() => lastAiRequest.current && generate(lastAiRequest.current, 'ai')}
                  onSettings={() => setTab('settings')}
                  onDismiss={() => setError('')}
                />
              )}
            </div>
            {current && fromShare && !busy && !isSaved && (
              <p className="example-note hand no-print">
                Someone shared this plan with you. Press Save to keep your own copy.
              </p>
            )}
            {current && isExample && !busy && (
              <p className="example-note hand no-print">
                Here's an example: the plan the form above makes. Change it and press Generate to make your own.
              </p>
            )}
            <div ref={planRef} className="plan-anchor" />
            {busy && <PlanSkeleton />}
            {current && !busy && (
              <PlanView
                key={generation}
                plan={current}
                saved={isSaved}
                onChange={changePlan}
                onUndo={undo}
                canUndo={undoDepth > 0}
                onNotice={setNotice}
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

      {notice && tab === 'plan' && (
        <div className="toast no-print" role="status">
          {notice.text}
          {notice.undoable && <button onClick={undo}><Icon name="undo" size={14} /> Undo</button>}
        </div>
      )}

      <footer className="no-print">
        Made by <a href="https://github.com/Prestoj01" target="_blank" rel="noreferrer">Preston</a> · Free and open source ·{' '}
        <a href="https://github.com/Prestoj01/teaching-english-planner" target="_blank" rel="noreferrer">Source code</a>
      </footer>
    </div>
  )
}
