import { Doodle } from './Doodle'
import { Greeting } from './Greeting'

/** The Plan tab's opening: a headline on the left, a little desk collage on the right. */
export function Hero() {
  return (
    <section className="hero no-print">
      <div className="hero-copy">
        <Greeting />
        <h2 className="hero-title">
          Turn a topic into a <Scribble>timed, CELTA-style</Scribble> lesson in seconds.
        </h2>
        <p className="hero-sub">
          Aims, concept-check questions, staged procedure, first-language pitfalls and a board plan.
          Free, works offline, no account.
        </p>
      </div>

      <div className="hero-collage" aria-hidden="true">
        <div className="index-card">
          <span className="tape" />
          <p className="hand index-title">Lesson 4 · A2 adults</p>
          <ol>
            <li><span>Lead-in</span><span>6′</span></li>
            <li><span>Presentation</span><span>9′</span></li>
            <li><span>Clarification</span><span>12′</span></li>
            <li><span>Controlled practice</span><span>12′</span></li>
            <li><span>Freer practice</span><span>15′</span></li>
          </ol>
        </div>
        <div className="sticky hand">don't forget the CCQs!</div>
        <Doodle name="apple" size={64} className="hero-apple" />
        <Doodle name="plane" size={56} className="hero-plane" />
      </div>
    </section>
  )
}

/** A hand-drawn red-pen underline. */
export function Scribble({ children }: { children: React.ReactNode }) {
  return (
    <span className="scribble">
      {children}
      <svg viewBox="0 0 240 14" preserveAspectRatio="none" aria-hidden="true">
        <path d="M3 9C42 3 78 12 121 7s83-5 116 1" />
        <path d="M18 12c50-5 120-6 200-3" />
      </svg>
    </span>
  )
}
