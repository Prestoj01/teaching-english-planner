import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'
import { TALK } from './Timeline'
import type { LessonPlan } from '../schema'
import { useFocusTrap } from '../useFocusTrap'

/** mm:ss, with a minus sign once a stage runs over. */
export function formatClock(seconds: number): string {
  const s = Math.abs(Math.round(seconds))
  return `${seconds < 0 ? '−' : ''}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** A soft two-note chime made with Web Audio, so there's no sound file to download. */
function chime() {
  try {
    const ctx = new AudioContext()
    ;[659.25, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.28
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.25, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 1.3)
    })
    setTimeout(() => ctx.close(), 2000)
  } catch { /* no audio available: the visual cue is enough */ }
}

/**
 * Full-screen view for teaching from the plan: one stage at a time in big type, with a countdown.
 * Keys: Space start/pause · ← → previous/next stage · + add a minute · Esc exit.
 */
export function ClassroomMode({ plan, onClose }: { plan: LessonPlan; onClose: () => void }) {
  const stages = plan.stages
  const [index, setIndex] = useState(0)
  const [remaining, setRemaining] = useState(() => (stages[0]?.minutes ?? 0) * 60)
  const [running, setRunning] = useState(false)
  const [sound, setSound] = useState(true)
  const endAt = useRef<number | null>(null)
  const chimed = useRef(false)
  const root = useRef<HTMLDivElement>(null)
  useFocusTrap(root)

  const stage = stages[index]
  const total = stage ? stage.minutes * 60 : 1

  const goTo = useCallback((i: number) => {
    if (i < 0 || i >= stages.length) return
    setIndex(i)
    setRemaining(stages[i].minutes * 60)
    setRunning(false)
    endAt.current = null
    chimed.current = false
  }, [stages])

  const toggle = useCallback(() => {
    setRunning((r) => {
      if (r) { endAt.current = null; return false }
      endAt.current = Date.now() + remaining * 1000
      return true
    })
  }, [remaining])

  const addMinute = useCallback(() => {
    setRemaining((s) => s + 60)
    if (endAt.current) endAt.current += 60_000
    chimed.current = false
  }, [])

  // Tick from a fixed end time so the clock doesn't drift if the tab is throttled.
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      if (!endAt.current) return
      const left = (endAt.current - Date.now()) / 1000
      setRemaining(left)
      if (left <= 0 && !chimed.current) {
        chimed.current = true
        if (sound) chime()
      }
    }, 250)
    return () => clearInterval(id)
  }, [running, sound])

  // Keyboard controls, focus, and keeping the screen awake while teaching.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    root.current?.focus()
    return () => previous?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === ' ' && !(document.activeElement instanceof HTMLButtonElement || document.activeElement instanceof HTMLInputElement)) { e.preventDefault(); toggle() }
      else if (e.key === 'ArrowRight') goTo(index + 1)
      else if (e.key === 'ArrowLeft') goTo(index - 1)
      else if (e.key === '+' || e.key === '=') addMinute()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, toggle, goTo, addMinute, index])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    let lock: { release: () => Promise<void> } | undefined
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }
    nav.wakeLock?.request('screen').then((l) => { lock = l }).catch(() => {})
    return () => {
      document.body.style.overflow = ''
      lock?.release().catch(() => {})
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
  }, [])

  if (!stage) return null
  const progress = Math.min(1, Math.max(0, 1 - remaining / total))
  const over = remaining <= 0
  const R = 88
  const C = 2 * Math.PI * R

  return createPortal(
    <div className={`classroom${over ? ' over' : ''}`} role="dialog" aria-modal="true" aria-label="Classroom mode" ref={root} tabIndex={-1}>
      <ol className="class-progress" aria-label="Stages">
        {stages.map((s, i) => (
          <li key={i} style={{ flexGrow: Math.max(s.minutes, 0.5) }} className={`talk-${TALK[s.interaction].kind}${i < index ? ' done' : ''}${i === index ? ' now' : ''}`}>
            <button onClick={() => goTo(i)} aria-label={`Go to stage ${i + 1}: ${s.name}`} aria-current={i === index ? 'step' : undefined}>
              {i === index && <span className="fill" style={{ width: `${progress * 100}%` }} />}
            </button>
          </li>
        ))}
      </ol>

      <p className="sr-only" aria-live="polite">
        {over ? `Time's up for ${stage.name}.` : `Stage ${index + 1} of ${stages.length}: ${stage.name}, ${stage.minutes} minutes.`}
      </p>
      <div className="class-main">
        <div className="class-text">
          <p className="class-step hand">Stage {index + 1} of {stages.length} · {TALK[stage.interaction].label}</p>
          <h2 className="class-stage">{stage.name}</h2>
          {stage.aim && <p className="class-aim">{stage.aim}</p>}
          {stage.teacherProcedure.length > 0 && (
            <ol className="class-steps">{stage.teacherProcedure.map((p, i) => <li key={i}>{p}</li>)}</ol>
          )}
          {stage.studentActivity && <p className="class-students"><strong>Students:</strong> {stage.studentActivity}</p>}
          {stage.materials.length > 0 && <p className="class-materials"><strong>Materials:</strong> {stage.materials.join(', ')}</p>}
        </div>

        <div className="class-timer">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <circle className="track" cx="100" cy="100" r={R} />
            <circle className="ring" cx="100" cy="100" r={R} strokeDasharray={C} strokeDashoffset={C * progress} />
          </svg>
          <div className="clock" role="timer" aria-live="off">
            <span className="num">{formatClock(remaining)}</span>
            <span className="clock-label">{over ? "time's up" : running ? 'remaining' : 'paused'}</span>
          </div>
        </div>
      </div>

      <footer className="class-controls">
        <button className="secondary" onClick={() => goTo(index - 1)} disabled={index === 0}><Icon name="arrowLeft" /> Previous</button>
        <button className="cta" onClick={toggle}>{running ? 'Pause' : remaining < total && !over ? 'Resume' : 'Start'} <kbd>space</kbd></button>
        <button className="secondary" onClick={addMinute}><Icon name="plus" /> 1 min</button>
        <button className="secondary" onClick={() => goTo(index + 1)} disabled={index === stages.length - 1}>Next <Icon name="arrowRight" /></button>
        <span className="spacer" />
        <label className="check"><input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Chime</label>
        {document.fullscreenEnabled && (
          <button className="secondary" onClick={() => (document.fullscreenElement ? document.exitFullscreen() : root.current?.requestFullscreen())}>Full screen</button>
        )}
        <button className="secondary" onClick={onClose}><Icon name="x" /> Exit <kbd>esc</kbd></button>
      </footer>
    </div>,
    document.body,
  )
}
