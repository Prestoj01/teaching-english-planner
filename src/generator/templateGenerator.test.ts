import { describe, expect, it } from 'vitest'
import { buildUserPrompt } from '../ai/claudeGenerator'
import { findGrammarPoint } from '../data/grammar'
import { FRAMEWORKS, LessonContentSchema, type LessonRequest } from '../schema'
import { allocateMinutes, generateTemplatePlan } from './templateGenerator'

const base: LessonRequest = {
  topic: 'travel',
  targetLanguage: 'present perfect for experiences',
  level: 'A2',
  ageGroup: 'adults',
  focus: 'grammar',
  framework: 'PPP',
  durationMinutes: 60,
  classSize: 12,
  learnerL1: 'Japanese',
  notes: '',
}

describe('allocateMinutes', () => {
  it.each([15, 30, 45, 50, 60, 75, 90, 120, 180])('sums exactly to %i minutes', (total) => {
    const out = allocateMinutes([0.1, 0.15, 0.2, 0.2, 0.25, 0.1], total)
    expect(out.reduce((a, b) => a + b, 0)).toBe(total)
    expect(Math.min(...out)).toBeGreaterThanOrEqual(2)
  })
})

describe('generateTemplatePlan', () => {
  it.each(FRAMEWORKS)('produces a schema-valid plan for %s with correct timing', (framework) => {
    const plan = generateTemplatePlan({ ...base, framework })
    expect(() => LessonContentSchema.parse(plan)).not.toThrow()
    expect(plan.stages.reduce((a, s) => a + s.minutes, 0)).toBe(base.durationMinutes)
  })

  it('is deterministic for the same input and varies with the variant', () => {
    expect(generateTemplatePlan(base)).toEqual(generateTemplatePlan(base))
    const names = new Set(Array.from({ length: 6 }, (_, v) => generateTemplatePlan(base, v).stages.map((s) => s.name).join('|')))
    expect(names.size).toBeGreaterThan(1)
  })

  it('fills in no leftover {placeholders}', () => {
    const json = JSON.stringify(generateTemplatePlan({ ...base, framework: 'TBL', level: 'B2' }))
    expect(json).not.toMatch(/\{(topic|tl)\}/)
  })

  it('uses L1-specific problems when the L1 is known', () => {
    const plan = generateTemplatePlan(base)
    expect(plan.anticipatedProblems.some((p) => /\/l\/ and \/r\//.test(p.problem))).toBe(true)
  })

  it('still works with an unknown L1 and no target language', () => {
    const plan = generateTemplatePlan({ ...base, learnerL1: 'Klingon', targetLanguage: '' })
    expect(plan.anticipatedProblems.length).toBeGreaterThan(0)
    expect(plan.title).toBe('Travel (A2)')
  })

  it('respects level and age filters for activities', () => {
    const plan = generateTemplatePlan({ ...base, level: 'A1', ageGroup: 'young-learners' }, 3)
    expect(plan.stages.map((s) => s.name).join(' ')).not.toMatch(/Mini debate/)
  })
})

describe('findGrammarPoint', () => {
  it('matches the most specific grammar point', () => {
    expect(findGrammarPoint('Second conditional: if I were rich')?.name).toBe('Second conditional')
    expect(findGrammarPoint('comparatives of adjectives')?.name).toMatch(/Comparatives/)
    expect(findGrammarPoint('food vocabulary')).toBeUndefined()
  })
})

describe('buildUserPrompt', () => {
  it('includes the request details and L1 hints', () => {
    const prompt = buildUserPrompt(base)
    expect(prompt).toContain('CEFR level: A2')
    expect(prompt).toContain('Known difficulties for Japanese speakers')
  })
})
