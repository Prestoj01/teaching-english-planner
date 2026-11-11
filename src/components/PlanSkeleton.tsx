/** Placeholder with the plan's shape while Claude writes it (AI plans take 20–60 seconds). */
export function PlanSkeleton() {
  return (
    <article className="card skeleton" aria-busy="true" aria-live="polite">
      <p className="status"><span className="spinner" aria-hidden="true" /> Claude is writing your plan. This usually takes under a minute.</p>
      <div className="bone title" />
      <div className="bone" style={{ width: '45%' }} />
      <div className="bone bar" />
      {[92, 80, 86, 64, 88, 72].map((w, i) => <div key={i} className="bone" style={{ width: `${w}%` }} />)}
    </article>
  )
}
