import type { LessonPlan } from './schema'

/**
 * Pure helpers that turn a lesson plan into printable student handouts.
 * Kept separate from the UI so they're easy to test.
 */

/** Words that usually form the "grammar" part of a sentence, so they make good gaps. */
const AUX = String.raw`(?:have|has|had|'ve|'s|'d|will|'ll|won't|would|was|were|is|are|am|'m|'re|do|does|did|didn't|can|can't|could|should|must|might|going to)`
const GAP_PATTERN = new RegExp(String.raw`(?:\b|(?<=\w))${AUX}(?:\s+(?:n't|not|never|ever|just|already|be))?\s+[\w'-]+`, 'i')

/**
 * Suggests a gap by wrapping part of the sentence in [square brackets].
 * Preference: a key-vocabulary item, then an auxiliary + verb chunk, then the longest word.
 * Sentences that already contain brackets are left alone.
 */
export function suggestGap(sentence: string, vocabulary: string[] = []): string {
  if (/\[.+\]/.test(sentence)) return sentence
  for (const v of [...vocabulary].sort((a, b) => b.length - a.length)) {
    const i = sentence.toLowerCase().indexOf(v.toLowerCase())
    if (v.trim() && i >= 0) return `${sentence.slice(0, i)}[${sentence.slice(i, i + v.length)}]${sentence.slice(i + v.length)}`
  }
  const m = sentence.match(GAP_PATTERN)
  if (m && m.index !== undefined) {
    const chunk = m[0].trim()
    const at = sentence.indexOf(chunk, m.index)
    return `${sentence.slice(0, at)}[${chunk}]${sentence.slice(at + chunk.length)}`
  }
  const words = sentence.match(/[A-Za-z][\w'-]{3,}/g)
  if (!words) return sentence
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a))
  return sentence.replace(longest, `[${longest}]`)
}

export interface GapLine {
  /** Pieces of the sentence; odd indexes are gaps. */
  parts: string[]
  answers: string[]
}

/** Parses "I [’ve been] to Japan." into text and gap pieces. */
export function parseGaps(line: string): GapLine {
  const parts = line.split(/\[([^\]]*)\]/)
  return { parts, answers: parts.filter((_, i) => i % 2 === 1) }
}

/** Turns a learning outcome into a student-facing "I can…" statement. */
export function toCanDo(outcome: string): string {
  const s = outcome
    .replace(/^by the end of (the|this) lesson,?\s*/i, '')
    .replace(/^(students|learners|ss)\s+(will be able to|can|should be able to)\s+/i, '')
    .replace(/\.$/, '')
  return `I can ${s.charAt(0).toLowerCase()}${s.slice(1)}`
}

/** Deterministic shuffle (so the printed word box doesn't change on every render). */
export function shuffled<T>(items: T[], seed = 7): T[] {
  const out = [...items]
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export interface RoleCard { who: string; text: string }

/** Starter role cards for the speaking stage, built from the topic and target language. */
export function defaultRoleCards(plan: LessonPlan): RoleCard[] {
  const { topic, targetLanguage } = plan.request
  const tl = targetLanguage.trim() || 'today’s language'
  return [
    { who: 'Student A', text: `Ask your partner 4 questions about ${topic.toLowerCase()}. Try to use ${tl}. Ask one follow-up question each time ("Why?", "When?", "What was it like?").` },
    { who: 'Student B', text: `Answer your partner's questions about ${topic.toLowerCase()} with real information about you. Then ask them 2 questions back, using ${tl}.` },
  ]
}

/** Everything the handouts panel needs, in editable text form. */
export interface HandoutDraft {
  gapFill: string
  cards: string
  roles: string
  canDo: string
}

export function draftHandouts(plan: LessonPlan): HandoutDraft {
  const tla = plan.targetLanguageAnalysis
  const sentences = tla.examples.filter((e) => !/^write\b/i.test(e))
  return {
    gapFill: sentences.map((s) => suggestGap(s, plan.keyVocabulary)).join('\n'),
    cards: (plan.keyVocabulary.length ? plan.keyVocabulary : sentences).join('\n'),
    roles: defaultRoleCards(plan).map((r) => `${r.who}: ${r.text}`).join('\n'),
    canDo: plan.learningOutcomes.map(toCanDo).join('\n'),
  }
}

export const lines = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean)

export function parseRoles(text: string): RoleCard[] {
  return lines(text).map((l) => {
    const m = l.match(/^([^:]{1,30}):\s*(.+)$/)
    return m ? { who: m[1], text: m[2] } : { who: '', text: l }
  })
}
