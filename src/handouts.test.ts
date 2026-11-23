import { describe, expect, it } from 'vitest'
import { generateTemplatePlan } from './generator/templateGenerator'
import { draftHandouts, parseGaps, parseRoles, shuffled, suggestGap, toCanDo } from './handouts'
import type { LessonPlan, LessonRequest } from './schema'

const request: LessonRequest = {
  topic: 'Travel experiences', targetLanguage: 'present perfect for experiences', level: 'A2', ageGroup: 'adults',
  focus: 'grammar', framework: 'PPP', durationMinutes: 60, classSize: 12, learnerL1: 'Spanish', notes: '',
}
const plan: LessonPlan = { ...generateTemplatePlan(request), id: 'p', createdAt: '', updatedAt: '', source: 'template', request, tags: [] }

describe('suggestGap', () => {
  it('blanks an auxiliary + verb chunk, including contractions', () => {
    expect(suggestGap("I've been to Japan.")).toBe("I['ve been] to Japan.")
    expect(suggestGap("She's never seen snow.")).toBe("She['s never seen] snow.")
    expect(suggestGap('I watched a film and I will go again.')).toBe('I watched a film and I [will go] again.')
  })
  it('prefers key vocabulary, longest first', () => {
    expect(suggestGap('We booked a window seat on the plane.', ['seat', 'window seat'])).toBe('We booked a [window seat] on the plane.')
  })
  it('falls back to the longest word', () => {
    expect(suggestGap('Tokyo bigger Osaka.')).toBe('Tokyo [bigger] Osaka.')
  })
  it('leaves sentences that already have a gap alone', () => {
    expect(suggestGap('I [can] swim.')).toBe('I [can] swim.')
  })
})

describe('parseGaps', () => {
  it('splits text and gaps', () => {
    expect(parseGaps('I [have] been to [Japan].')).toEqual({ parts: ['I ', 'have', ' been to ', 'Japan', '.'], answers: ['have', 'Japan'] })
  })
  it('handles lines without gaps', () => {
    expect(parseGaps('No gaps here.').answers).toEqual([])
  })
})

describe('toCanDo', () => {
  it('rewrites learning outcomes as I can statements', () => {
    expect(toCanDo('By the end of the lesson, students will be able to use the past simple to talk about holidays.'))
      .toBe('I can use the past simple to talk about holidays')
    expect(toCanDo('Students will be able to recognise comparatives.')).toBe('I can recognise comparatives')
  })
})

describe('parseRoles', () => {
  it('reads "Who: text" lines and tolerates lines without a label', () => {
    expect(parseRoles('Student A: Ask questions.\nJust do it')).toEqual([
      { who: 'Student A', text: 'Ask questions.' },
      { who: '', text: 'Just do it' },
    ])
  })
})

describe('shuffled', () => {
  it('is deterministic and keeps every item', () => {
    const a = shuffled([1, 2, 3, 4, 5])
    expect(shuffled([1, 2, 3, 4, 5])).toEqual(a)
    expect([...a].sort()).toEqual([1, 2, 3, 4, 5])
  })
})

describe('draftHandouts', () => {
  it('builds every handout from a real plan', () => {
    const d = draftHandouts(plan)
    expect(d.gapFill.split('\n')).toHaveLength(plan.targetLanguageAnalysis.examples.length)
    expect(d.gapFill).toMatch(/\[.+\]/)
    expect(d.roles).toContain('Student A:')
    expect(d.canDo.split('\n').every((l) => l.startsWith('I can '))).toBe(true)
  })
  it('skips placeholder examples like "Write 2–3 example sentences…"', () => {
    const p = { ...plan, targetLanguageAnalysis: { ...plan.targetLanguageAnalysis, examples: ['Write 2–3 example sentences about food.'] } }
    expect(draftHandouts(p).gapFill).toBe('')
  })
})
