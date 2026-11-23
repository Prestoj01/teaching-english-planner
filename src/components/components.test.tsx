import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { generateTemplatePlan } from '../generator/templateGenerator'
import type { LessonPlan, LessonRequest } from '../schema'
import { About } from './About'
import { formatClock } from './ClassroomMode'
import { Library } from './Library'
import { Settings } from './Settings'
import { MiniTimeline, studentShare, Timeline } from './Timeline'

const base: LessonRequest = {
  topic: 'Travel', targetLanguage: 'present perfect', level: 'A2', ageGroup: 'adults',
  focus: 'grammar', framework: 'PPP', durationMinutes: 60, classSize: 12, learnerL1: 'Spanish', notes: '',
}
const make = (over: Partial<LessonRequest>, tags: string[] = [], id = 'a'): LessonPlan => {
  const request = { ...base, ...over }
  return { ...generateTemplatePlan(request), id, createdAt: '2026-11-01', updatedAt: '2026-11-01', source: 'template', request, tags }
}
const noop = () => {}

describe('timeline maths', () => {
  const stages = make({}).stages
  it('reports the share of time students are working', () => {
    const studentMin = stages.filter((s) => s.interaction !== 'T-Ss' && s.interaction !== 'T-S').reduce((a, s) => a + s.minutes, 0)
    expect(studentShare(stages)).toBe(Math.round((studentMin / 60) * 100))
  })
  it('handles an empty lesson without dividing by zero', () => {
    expect(studentShare([])).toBe(0)
  })
  it('renders one block per stage with a screen-reader description', () => {
    const html = renderToString(<Timeline stages={stages} />).replaceAll('<!-- -->', '')
    expect(html.match(/class="seg /g)).toHaveLength(stages.length)
    expect(html).toContain(`${stages[0].minutes} minutes`)
    expect(renderToString(<MiniTimeline stages={stages} />).match(/<span/g)).toHaveLength(stages.length)
  })
})

describe('classroom clock', () => {
  it('formats remaining and overtime', () => {
    expect(formatClock(540)).toBe('9:00')
    expect(formatClock(65.4)).toBe('1:05')
    expect(formatClock(-30)).toBe('−0:30')
  })
})

describe('Library', () => {
  const plans = [make({}, ['Class 3B'], 'a'), make({ level: 'B1', focus: 'speaking', topic: 'Food' }, [], 'b')]
  const html = renderToString(<Library plans={plans} onOpen={noop} onDelete={noop} onDuplicate={noop} onImport={noop} />)
  it('shows each lesson as a card', () => {
    expect(html.match(/class="lesson-card/g)).toHaveLength(2)
  })
  it('offers filters only for values that exist', () => {
    expect(html).toContain('># <!-- -->Class 3B</button>')
    expect(html).toMatch(/aria-pressed="false"[^>]*>B1</)
    expect(html).not.toMatch(/>C2</)
  })
  it('shows the empty state with no lessons', () => {
    expect(renderToString(<Library plans={[]} onOpen={noop} onDelete={noop} onDuplicate={noop} onImport={noop} />)).toContain('Nothing saved yet')
  })
})

describe('Settings and About', () => {
  it('Settings shows whether AI is on', () => {
    expect(renderToString(<Settings settings={{ apiKey: '', model: 'claude-opus-5-5' }} onSave={noop} />)).toContain('AI is off')
    expect(renderToString(<Settings settings={{ apiKey: 'sk-ant-x', model: 'claude-opus-5-5' }} onSave={noop} />)).toContain('AI is on')
  })
  it('About lists all five frameworks', () => {
    const html = renderToString(<About />)
    for (const f of ['PPP', 'TTT', 'TBL', 'ESA', 'PDP']) expect(html).toContain(`>${f}<`)
  })
})
