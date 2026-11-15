import { L1_OPTIONS } from '../data/l1Notes'
import { Doodle } from './Doodle'

/** A strip of tape that scrolls the first languages the planner has tips for. */
export function Marquee() {
  const items = L1_OPTIONS.map((l) => (
    <li key={l}>
      {l}
      <Doodle name="star" size={18} />
    </li>
  ))
  return (
    <div className="marquee no-print">
      <p className="sr-only">First-language tips for: {L1_OPTIONS.join(', ')}.</p>
      <span className="marquee-label hand" aria-hidden="true">L1 tips for</span>
      <div className="marquee-track" aria-hidden="true">
        <ul>{items}</ul>
        <ul>{items}</ul>
      </div>
    </div>
  )
}
