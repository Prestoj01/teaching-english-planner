import type { Interaction, Stage } from '../schema'

/** Who is doing the talking in each interaction pattern. Students-talking stages get the accent. */
const TALK: Record<Interaction, { label: string; kind: 'teacher' | 'solo' | 'students' }> = {
  'T-Ss': { label: 'Teacher-led', kind: 'teacher' },
  'T-S': { label: 'Teacher-led', kind: 'teacher' },
  S: { label: 'Individual', kind: 'solo' },
  'S-S': { label: 'Pairs', kind: 'students' },
  Groups: { label: 'Groups', kind: 'students' },
}

/** The lesson at a glance: each stage as a block whose width is its share of the time. */
export function Timeline({ stages }: { stages: Stage[] }) {
  const total = stages.reduce((a, s) => a + s.minutes, 0) || 1
  const studentMinutes = stages.filter((s) => TALK[s.interaction].kind !== 'teacher').reduce((a, s) => a + s.minutes, 0)
  return (
    <figure className="timeline">
      <ol aria-label="Lesson timeline">
        {stages.map((s, i) => (
          <li
            key={i}
            className={`seg talk-${TALK[s.interaction].kind}`}
            style={{ flexGrow: Math.max(s.minutes, 0.5) }}
            title={`${s.name} · ${s.minutes} min · ${TALK[s.interaction].label}`}
          >
            <span className="seg-name">{s.name.split(':')[0]}</span>
            <span className="seg-min">{s.minutes}′</span>
          </li>
        ))}
      </ol>
      <figcaption>
        <span><i className="key talk-teacher" />Teacher-led</span>
        <span><i className="key talk-solo" />Individual</span>
        <span><i className="key talk-students" />Pairs &amp; groups</span>
        <span className="talk-share num">Students working: {Math.round((studentMinutes / total) * 100)}% of the lesson</span>
      </figcaption>
    </figure>
  )
}
