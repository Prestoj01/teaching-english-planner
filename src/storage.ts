import { z } from 'zod'
import { LessonPlanSchema, type LessonPlan } from './schema'
import type { AiModelId } from './ai/models'

/** Everything lives in the browser's localStorage: no accounts, no server, no cost. */

const PLANS_KEY = 'esl-planner:plans:v1'
const SETTINGS_KEY = 'esl-planner:settings:v1'

export interface Settings {
  apiKey: string
  model: AiModelId
}

const DEFAULT_SETTINGS: Settings = { apiKey: '', model: 'claude-opus-5-5' }

export function loadPlans(): LessonPlan[] {
  try {
    const raw = localStorage.getItem(PLANS_KEY)
    if (!raw) return []
    const parsed = z.array(LessonPlanSchema).safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
}

export function savePlans(plans: LessonPlan[]): void {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans))
}

export function loadSettings(): Settings {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(s: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
}

/** Validate an imported backup file. Returns the plans or throws a readable error. */
export function parseImport(text: string): LessonPlan[] {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('That file is not valid JSON.')
  }
  const arr = Array.isArray(json) ? json : [json]
  const parsed = z.array(LessonPlanSchema).safeParse(arr)
  if (!parsed.success) throw new Error('That file does not contain lesson plans from this app.')
  return parsed.data
}

export function newId(): string {
  return crypto.randomUUID()
}
