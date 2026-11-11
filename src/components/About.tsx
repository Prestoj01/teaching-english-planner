import { FRAMEWORK_INFO } from '../data/frameworks'
import { FRAMEWORKS } from '../schema'

export function About() {
  return (
    <section className="card prose">
      <h2>A lesson planner that costs nothing to run</h2>
      <p>
        ESL Lesson Planner helps English teachers turn a topic and a target language into a full lesson plan in a
        familiar CELTA-style format: aims, language analysis with concept-check questions, timed stages with interaction
        patterns, problems to expect from learners' first language, differentiation, a board plan and homework.
      </p>
      <h3>No account, no ads, no server</h3>
      <ul>
        <li>No account, no ads, no tracking. Plans are saved in your browser only.</li>
        <li>The core planner runs entirely offline from a curated bank of activities, frameworks and grammar notes.</li>
        <li>AI generation is optional and uses your own API key, so the site costs nothing to run.</li>
      </ul>
      <h3>Five frameworks, and when to use each</h3>
      <dl>
        {FRAMEWORKS.map((f) => (
          <div key={f}>
            <dt>{FRAMEWORK_INFO[f].name} ({f})</dt>
            <dd>{FRAMEWORK_INFO[f].summary} <span className="best-for">Best for: {FRAMEWORK_INFO[f].bestFor}</span></dd>
          </div>
        ))}
      </dl>
      <h3>First-language tips are tendencies, not rules</h3>
      <p>
        The "anticipated problems" are well-known tendencies for speakers of each language, not rules. Every learner is
        different. Use them as a starting point and adjust after you meet your class.
      </p>
    </section>
  )
}
