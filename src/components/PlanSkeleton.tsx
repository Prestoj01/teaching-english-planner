import { useEffect, useState } from 'react'
import { Doodle } from './Doodle'

/** What Claude is (roughly) doing, so a 20–60 second wait feels like progress rather than a freeze. */
const STEPS = [
  'Reading your notes…',
  'Picking a lead-in…',
  'Analysing the target language…',
  'Writing concept-check questions…',
  'Timing the stages…',
  'Thinking about first-language pitfalls…',
  'Sketching the board plan…',
  'Nearly there…',
]

/** Placeholder with the plan's shape while Claude writes it. A paper plane loops across the page. */
export function PlanSkeleton() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <article className="card skeleton taped" aria-busy="true">
      <div className="flight" aria-hidden="true">
        <svg className="flight-path" viewBox="0 0 600 80" preserveAspectRatio="none">
          <path d="M0 60 C 120 0, 200 90, 300 40 S 480 0, 600 30" />
        </svg>
        <Doodle name="plane" size={44} className="flying-plane" />
      </div>
      <p className="status hand" role="status" aria-live="polite">
        <span key={step} className="status-step">{STEPS[step]}</span>
      </p>
      <p className="hint">Claude is writing your plan. This usually takes under a minute.</p>
      <div className="bone title" />
      <div className="bone" style={{ width: '45%' }} />
      <div className="bone bar" />
      {[92, 80, 86, 64, 88, 72].map((w, i) => <div key={i} className="bone" style={{ width: `${w}%` }} />)}
    </article>
  )
}
