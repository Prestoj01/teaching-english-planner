import { Doodle, type DoodleName } from './Doodle'
import { FRAMEWORK_INFO } from '../data/frameworks'
import { FRAMEWORKS } from '../schema'

const PROMISES: { doodle: DoodleName; title: string; body: string; tone: string }[] = [
  { doodle: 'house', title: 'No account, no ads', body: 'No sign-up and no tracking. Your plans are saved in this browser and nowhere else.', tone: 'yellow' },
  { doodle: 'plane', title: 'Works offline', body: 'The planner runs from a built-in bank of activities, frameworks and grammar notes. No internet needed.', tone: 'mint' },
  { doodle: 'bulb', title: 'AI if you want it', body: 'Optional, with your own Claude key. That keeps the site free to run, forever.', tone: 'pink' },
]

export function About() {
  return (
    <section className="about">
      <header className="page-head">
        <Doodle name="globe" size={64} />
        <div>
          <h2>A lesson planner that costs nothing to run</h2>
          <p className="lede">
            Hello Class turns a topic and a target language into a full lesson plan in the CELTA-style format: aims, language
            analysis with concept-check questions, timed stages with interaction patterns, problems to expect from learners'
            first language, differentiation, a board plan and homework.
          </p>
        </div>
      </header>

      <ul className="promises">
        {PROMISES.map((p) => (
          <li key={p.title} className={`promise sticky-note tone-${p.tone} reveal`}>
            <Doodle name={p.doodle} size={44} />
            <h3 className="hand">{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ul>

      <h3 className="section-title reveal">Five frameworks, and when to use each</h3>
      <ul className="framework-grid">
        {FRAMEWORKS.map((f) => (
          <li key={f} className="framework-card reveal">
            <span className="acronym">{f}</span>
            <strong>{FRAMEWORK_INFO[f].name}</strong>
            <p>{FRAMEWORK_INFO[f].summary}</p>
            <p className="best-for">Best for: {FRAMEWORK_INFO[f].bestFor}</p>
          </li>
        ))}
      </ul>

      <aside className="margin-note reveal">
        <h3 className="hand">First-language tips are tendencies, not rules</h3>
        <p>
          The "anticipated problems" are well-known tendencies for speakers of each language. Every learner is different,
          so use them as a starting point and adjust once you've met your class.
        </p>
      </aside>
    </section>
  )
}
