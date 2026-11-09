import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { generateTemplatePlan } from '../generator/templateGenerator'
import type { LessonPlan, LessonRequest } from '../schema'
import { planToMarkdown } from '../export'
import { PlanView } from './PlanView'

const request: LessonRequest = {
  topic: 'food', targetLanguage: 'countable and uncountable nouns', level: 'A2', ageGroup: 'teens',
  focus: 'grammar', framework: 'TTT', durationMinutes: 45, classSize: 20, learnerL1: 'Arabic', notes: '',
}
const plan: LessonPlan = {
  ...generateTemplatePlan(request), id: 'x', createdAt: '2026-01-01', updatedAt: '2026-01-01', source: 'template', request,
}

describe('PlanView', () => {
  it('renders every stage and the timing total', () => {
    const html = renderToString(<PlanView plan={plan} saved={false} onChange={() => {}} onSave={() => {}} />)
    for (const s of plan.stages) expect(html).toContain(s.aim)
    expect(html).toContain('45<!-- --> / <!-- -->45<!-- --> min')
  })
})

describe('planToMarkdown', () => {
  it('includes the key sections', () => {
    const md = planToMarkdown(plan)
    expect(md).toMatch(/^# /)
    expect(md).toContain('## Procedure')
    expect(md).toContain('## Anticipated problems & solutions')
  })
})
