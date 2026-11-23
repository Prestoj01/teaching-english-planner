import { describe, expect, it } from 'vitest'
import { generateTemplatePlan } from './generator/templateGenerator'
import { decodeShare, encodeShare, isShareHash } from './share'
import { LessonPlanSchema, type LessonRequest } from './schema'

const request: LessonRequest = {
  topic: 'Food', targetLanguage: 'comparatives', level: 'B1', ageGroup: 'teens',
  focus: 'grammar', framework: 'TTT', durationMinutes: 45, classSize: 20, learnerL1: 'Japanese', notes: 'Zoom class',
}
const shared = { ...generateTemplatePlan(request), request, source: 'template' as const, tags: ['Class 3B'] }

describe('share links', () => {
  it('round-trips a plan through the URL fragment', async () => {
    const hash = await encodeShare(shared)
    expect(isShareHash(hash)).toBe(true)
    expect(hash).toMatch(/^share=[A-Za-z0-9_-]+$/) // URL-safe, no padding
    expect(await decodeShare(`#${hash}`)).toEqual(shared)
  })
  it('keeps links reasonably short', async () => {
    expect((await encodeShare(shared)).length).toBeLessThan(4000)
  })
  it('returns null for damaged or unrelated hashes', async () => {
    const hash = await encodeShare(shared)
    expect(await decodeShare(`#${hash.slice(0, 60)}`)).toBeNull()
    expect(await decodeShare('#share=not-real')).toBeNull()
    expect(await decodeShare('#library')).toBeNull()
  })
})

describe('saved plans from before tags existed', () => {
  it('still load, with no tags', () => {
    const old = { ...generateTemplatePlan(request), id: 'x', createdAt: '', updatedAt: '', source: 'template', request }
    expect(LessonPlanSchema.parse(old).tags).toEqual([])
  })
})
