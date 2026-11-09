import { ACTIVITIES, type Activity } from '../data/activities'
import { FRAMEWORK_INFO, type FrameworkStage } from '../data/frameworks'
import { findGrammarPoint } from '../data/grammar'
import { GENERAL_NOTES, L1_NOTES, type L1Note } from '../data/l1Notes'
import type { LessonContent, LessonRequest, Stage } from '../schema'

/**
 * Offline, deterministic lesson-plan generator. No network, no API key, no cost.
 * The same request + variant always yields the same plan; bump `variant` to
 * get a different selection of activities.
 */
export function generateTemplatePlan(req: LessonRequest, variant = 0): LessonContent {
  const rand = seededRandom(`${req.topic}|${req.targetLanguage}|${req.level}|${req.framework}|${variant}`)
  const fw = FRAMEWORK_INFO[req.framework]
  const tl = req.targetLanguage.trim() || req.topic
  const fill = (s: string) => s.replaceAll('{topic}', req.topic).replaceAll('{tl}', tl)

  const minutes = allocateMinutes(fw.stages.map((s) => s.weight), req.durationMinutes)
  const stages: Stage[] = fw.stages.map((stage, i) => buildStage(stage, minutes[i], req, rand, fill))

  const gp = findGrammarPoint(req.targetLanguage)

  return {
    title: `${capitalize(req.topic)}${req.targetLanguage ? ` — ${req.targetLanguage}` : ''} (${req.level})`,
    mainAim: mainAim(req, tl),
    subsidiaryAims: subsidiaryAims(req, tl),
    learningOutcomes: [
      `By the end of the lesson, students will be able to use ${tl} to talk about ${req.topic}.`,
      `Students will be able to recognise ${tl} in context and understand its meaning.`,
    ],
    targetLanguageAnalysis: gp
      ? { form: gp.form, meaning: gp.meaning, pronunciation: gp.pronunciation, examples: gp.examples, conceptCheckQuestions: gp.ccqs }
      : {
          form: `Write the form of "${tl}" here (structure, word class, spelling).`,
          meaning: `Explain what "${tl}" means and when it is used.`,
          pronunciation: 'Note word stress, sentence stress, weak forms and linking.',
          examples: [`Write 2–3 example sentences about ${req.topic}.`],
          conceptCheckQuestions: ['Write simple yes/no or either/or questions that check understanding of meaning.'],
        },
    keyVocabulary: [],
    stages,
    anticipatedProblems: anticipatedProblems(req, rand).map((n) => ({ problem: fill(n.problem), solution: fill(n.solution) })),
    differentiation: {
      support: [
        'Pair weaker students with stronger ones for controlled practice.',
        'Provide sentence starters and a word bank on the board.',
        req.ageGroup === 'young-learners' ? 'Use gestures and pictures for every instruction.' : 'Allow extra thinking time before speaking.',
      ],
      stretch: [
        'Fast finishers write two extra personalised sentences.',
        `Ask stronger students follow-up questions that require more complex answers about ${req.topic}.`,
      ],
    },
    homework: homework(req, tl),
    boardPlan: `Left: key vocabulary about ${req.topic}\nCentre: target sentence + form (${tl})\nRight: errors for feedback`,
  }
}

/** Split `total` minutes by weight, keeping every stage at least 2 minutes and summing exactly to total. */
export function allocateMinutes(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  const raw = weights.map((w) => (w / sum) * total)
  const out = raw.map((r) => Math.max(2, Math.floor(r)))
  let diff = total - out.reduce((a, b) => a + b, 0)
  // Hand out leftover minutes to the stages with the largest fractional part.
  const order = raw.map((r, i) => ({ i, frac: r - Math.floor(r) })).sort((a, b) => b.frac - a.frac)
  let k = 0
  while (diff > 0) {
    out[order[k % order.length].i] += 1
    diff -= 1
    k += 1
  }
  // If the 2-minute floor pushed us over, take time back from the longest stages.
  while (diff < 0) {
    const longest = out.indexOf(Math.max(...out))
    out[longest] -= 1
    diff += 1
  }
  return out
}

function buildStage(
  stage: FrameworkStage,
  minutes: number,
  req: LessonRequest,
  rand: () => number,
  fill: (s: string) => string,
): Stage {
  const act = pickActivity(stage.slot, req, rand)
  return {
    name: act ? `${stage.name}: ${act.name}` : stage.name,
    minutes,
    interaction: act?.interaction ?? stage.interaction,
    aim: fill(stage.aim),
    teacherProcedure: (act?.procedure ?? ['Plan this stage.']).map(fill),
    studentActivity: fill(act?.studentActivity ?? ''),
    materials: (act?.materials ?? []).map(fill),
  }
}

export function pickActivity(slot: string, req: LessonRequest, rand: () => number): Activity | undefined {
  const matches = (a: Activity) =>
    (!a.levels || a.levels.includes(req.level)) &&
    (!a.ages || a.ages.includes(req.ageGroup)) &&
    (!a.focus || a.focus.includes(req.focus))
  // Warmers and lead-ins are interchangeable.
  const slots = slot === 'warmer' || slot === 'lead-in' ? ['warmer', 'lead-in'] : [slot]
  let pool = ACTIVITIES.filter((a) => slots.includes(a.slot) && matches(a))
  if (pool.length === 0) pool = ACTIVITIES.filter((a) => slots.includes(a.slot))
  if (pool.length === 0) return undefined
  return pool[Math.floor(rand() * pool.length)]
}

function anticipatedProblems(req: LessonRequest, rand: () => number): L1Note[] {
  const l1 = L1_NOTES[req.learnerL1] ?? []
  // Put the notes most relevant to the lesson focus first.
  const relevantArea = req.focus === 'pronunciation' || req.focus === 'speaking' ? 'pronunciation' : req.focus === 'vocabulary' ? 'vocabulary' : 'grammar'
  const sorted = [...l1].sort((a, b) => Number(b.area === relevantArea) - Number(a.area === relevantArea))
  const general = GENERAL_NOTES[Math.floor(rand() * GENERAL_NOTES.length)]
  return [...sorted.slice(0, 3), general]
}

function mainAim(req: LessonRequest, tl: string): string {
  switch (req.focus) {
    case 'grammar':
      return `To introduce and practise ${tl} in the context of ${req.topic}.`
    case 'vocabulary':
      return `To introduce and practise vocabulary for ${req.topic}${req.targetLanguage ? ` (${tl})` : ''}.`
    case 'speaking':
      return `To develop students' speaking fluency when talking about ${req.topic}.`
    case 'listening':
      return `To develop students' listening skills for gist and detail using a text about ${req.topic}.`
    case 'reading':
      return `To develop students' reading skills for gist and detail using a text about ${req.topic}.`
    case 'writing':
      return `To develop students' ability to write a short text about ${req.topic}.`
    case 'pronunciation':
      return `To improve students' pronunciation of ${tl} in the context of ${req.topic}.`
  }
}

function subsidiaryAims(req: LessonRequest, tl: string): string[] {
  const aims: string[] = []
  if (req.focus !== 'speaking') aims.push(`To give students speaking practice about ${req.topic}.`)
  if (req.focus !== 'vocabulary') aims.push(`To review and extend vocabulary related to ${req.topic}.`)
  if (req.focus === 'reading' || req.focus === 'listening') aims.push(`To expose students to ${tl} in context.`)
  return aims
}

function homework(req: LessonRequest, tl: string): string {
  if (req.ageGroup === 'young-learners') return `Draw a picture about ${req.topic} and write 3 sentences using ${tl}.`
  if (req.level === 'A1' || req.level === 'A2') return `Write 5 sentences about yourself using ${tl}.`
  return `Write a short paragraph (80–120 words) about ${req.topic} using ${tl} at least three times.`
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Small deterministic PRNG (mulberry32) seeded from a string. */
export function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
