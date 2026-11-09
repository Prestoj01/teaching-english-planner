import { z } from 'zod'

/**
 * Single source of truth for the lesson-plan shape. The offline template
 * generator and the optional AI generator both produce this exact structure,
 * so the UI, storage and export code never care where a plan came from.
 */

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export const AGE_GROUPS = ['young-learners', 'teens', 'adults'] as const
export const FOCUS_TYPES = [
  'grammar',
  'vocabulary',
  'speaking',
  'listening',
  'reading',
  'writing',
  'pronunciation',
] as const
export const FRAMEWORKS = ['PPP', 'TTT', 'TBL', 'ESA', 'PDP'] as const
export const INTERACTIONS = ['T-S', 'S-S', 'S', 'Groups', 'T-Ss'] as const

export type CefrLevel = (typeof CEFR_LEVELS)[number]
export type AgeGroup = (typeof AGE_GROUPS)[number]
export type FocusType = (typeof FOCUS_TYPES)[number]
export type FrameworkId = (typeof FRAMEWORKS)[number]
export type Interaction = (typeof INTERACTIONS)[number]

export const LessonRequestSchema = z.object({
  topic: z.string().min(1, 'Give the lesson a topic'),
  targetLanguage: z.string(), // e.g. "present perfect for experiences" or "food vocabulary"
  level: z.enum(CEFR_LEVELS),
  ageGroup: z.enum(AGE_GROUPS),
  focus: z.enum(FOCUS_TYPES),
  framework: z.enum(FRAMEWORKS),
  durationMinutes: z.number().int().min(15).max(180),
  classSize: z.number().int().min(1).max(60),
  learnerL1: z.string(), // learners' first language, used for anticipated problems
  notes: z.string(), // anything else: "online class", "no projector", "exam prep"...
})
export type LessonRequest = z.infer<typeof LessonRequestSchema>

export const StageSchema = z.object({
  name: z.string(),
  minutes: z.number().int(),
  interaction: z.enum(INTERACTIONS),
  aim: z.string(),
  teacherProcedure: z.array(z.string()),
  studentActivity: z.string(),
  materials: z.array(z.string()),
})
export type Stage = z.infer<typeof StageSchema>

export const ProblemSchema = z.object({
  problem: z.string(),
  solution: z.string(),
})

/** What a generator returns. Kept free of ids/timestamps so it can double as the AI output schema. */
export const LessonContentSchema = z.object({
  title: z.string(),
  mainAim: z.string(),
  subsidiaryAims: z.array(z.string()),
  learningOutcomes: z.array(z.string()), // "By the end of the lesson, students will be able to..."
  targetLanguageAnalysis: z.object({
    form: z.string(),
    meaning: z.string(),
    pronunciation: z.string(),
    examples: z.array(z.string()),
    conceptCheckQuestions: z.array(z.string()),
  }),
  keyVocabulary: z.array(z.string()),
  stages: z.array(StageSchema),
  anticipatedProblems: z.array(ProblemSchema),
  differentiation: z.object({
    support: z.array(z.string()),
    stretch: z.array(z.string()),
  }),
  homework: z.string(),
  boardPlan: z.string(),
})
export type LessonContent = z.infer<typeof LessonContentSchema>

export const LessonPlanSchema = LessonContentSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  source: z.enum(['template', 'ai']),
  request: LessonRequestSchema,
})
export type LessonPlan = z.infer<typeof LessonPlanSchema>
