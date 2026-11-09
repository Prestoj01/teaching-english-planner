import type { FrameworkId, Interaction } from '../schema'

/**
 * Lesson frameworks commonly taught on CELTA / TEFL courses.
 * `weight` is the share of lesson time a stage normally takes; the generator
 * scales these to the real lesson length. `slot` tells the generator which
 * kind of activity to pull from the activity bank for that stage.
 */

export type StageSlot =
  | 'warmer'
  | 'lead-in'
  | 'context'
  | 'clarify'
  | 'controlled'
  | 'freer'
  | 'task'
  | 'report'
  | 'pre-skill'
  | 'gist'
  | 'detail'
  | 'post-skill'
  | 'feedback'
  | 'test'

export interface FrameworkStage {
  name: string
  slot: StageSlot
  weight: number
  interaction: Interaction
  aim: string // may contain {topic} and {tl}
}

export interface Framework {
  id: FrameworkId
  name: string
  summary: string
  bestFor: string
  stages: FrameworkStage[]
}

export const FRAMEWORK_INFO: Record<FrameworkId, Framework> = {
  PPP: {
    id: 'PPP',
    name: 'Presentation, Practice, Production',
    summary: 'Teacher presents new language in context, students practise it in controlled activities, then use it freely.',
    bestFor: 'Lower levels and new grammar or functional language.',
    stages: [
      { name: 'Lead-in', slot: 'lead-in', weight: 0.1, interaction: 'T-Ss', aim: 'To engage students with the topic of {topic} and activate background knowledge.' },
      { name: 'Presentation (context)', slot: 'context', weight: 0.15, interaction: 'T-Ss', aim: 'To present {tl} in a meaningful context.' },
      { name: 'Clarification (MFP)', slot: 'clarify', weight: 0.2, interaction: 'T-Ss', aim: 'To clarify the meaning, form and pronunciation of {tl}.' },
      { name: 'Controlled practice', slot: 'controlled', weight: 0.2, interaction: 'S', aim: 'To give accurate, focused practice of {tl}.' },
      { name: 'Freer practice', slot: 'freer', weight: 0.25, interaction: 'S-S', aim: 'To let students use {tl} fluently in a personalised speaking activity.' },
      { name: 'Feedback & error correction', slot: 'feedback', weight: 0.1, interaction: 'T-Ss', aim: 'To praise good language and correct common errors from the freer practice.' },
    ],
  },
  TTT: {
    id: 'TTT',
    name: 'Test, Teach, Test',
    summary: 'Students attempt a task first, the teacher teaches what was missing, then students try again.',
    bestFor: 'Mixed-ability classes and reviewing language students have partly met before.',
    stages: [
      { name: 'Lead-in', slot: 'lead-in', weight: 0.1, interaction: 'T-Ss', aim: 'To generate interest in {topic}.' },
      { name: 'Test 1', slot: 'test', weight: 0.2, interaction: 'S-S', aim: 'To diagnose what students already know about {tl}.' },
      { name: 'Teach', slot: 'clarify', weight: 0.25, interaction: 'T-Ss', aim: 'To clarify gaps in meaning, form and pronunciation of {tl} found in Test 1.' },
      { name: 'Test 2 (controlled)', slot: 'controlled', weight: 0.2, interaction: 'S', aim: 'To check improvement in accuracy with {tl}.' },
      { name: 'Freer practice', slot: 'freer', weight: 0.15, interaction: 'S-S', aim: 'To use {tl} in a personalised communicative activity.' },
      { name: 'Feedback', slot: 'feedback', weight: 0.1, interaction: 'T-Ss', aim: 'To give feedback on language use.' },
    ],
  },
  TBL: {
    id: 'TBL',
    name: 'Task-Based Learning',
    summary: 'Students complete a meaningful task first; language focus comes after, based on what they needed.',
    bestFor: 'Intermediate+ learners and building fluency and real-world communication.',
    stages: [
      { name: 'Pre-task', slot: 'lead-in', weight: 0.15, interaction: 'T-Ss', aim: 'To introduce the topic of {topic} and set up the task.' },
      { name: 'Task', slot: 'task', weight: 0.25, interaction: 'Groups', aim: 'To complete a meaningful, outcome-based task about {topic}.' },
      { name: 'Planning', slot: 'report', weight: 0.15, interaction: 'Groups', aim: 'To prepare to report the task outcome to the class accurately.' },
      { name: 'Report', slot: 'freer', weight: 0.15, interaction: 'S-S', aim: 'To share task outcomes with the class.' },
      { name: 'Language focus', slot: 'clarify', weight: 0.2, interaction: 'T-Ss', aim: 'To analyse useful language ({tl}) that emerged from the task.' },
      { name: 'Feedback', slot: 'feedback', weight: 0.1, interaction: 'T-Ss', aim: 'To reflect on the task and correct key errors.' },
    ],
  },
  ESA: {
    id: 'ESA',
    name: 'Engage, Study, Activate',
    summary: 'A flexible sequence: get students interested, study the language, then activate it in use.',
    bestFor: 'Young learners, short lessons and teachers who want a simple structure.',
    stages: [
      { name: 'Engage', slot: 'warmer', weight: 0.2, interaction: 'T-Ss', aim: 'To motivate students and get them thinking and talking about {topic}.' },
      { name: 'Study', slot: 'clarify', weight: 0.3, interaction: 'T-Ss', aim: 'To focus on {tl} and how it is built.' },
      { name: 'Study (practice)', slot: 'controlled', weight: 0.2, interaction: 'S', aim: 'To practise {tl} accurately.' },
      { name: 'Activate', slot: 'freer', weight: 0.3, interaction: 'S-S', aim: 'To use {tl} and any language they know freely and communicatively.' },
    ],
  },
  PDP: {
    id: 'PDP',
    name: 'Pre, During, Post (receptive skills)',
    summary: 'For reading and listening lessons: prepare students, work on the text in stages, then respond to it.',
    bestFor: 'Reading and listening lessons at any level.',
    stages: [
      { name: 'Lead-in', slot: 'lead-in', weight: 0.1, interaction: 'T-Ss', aim: 'To activate schema about {topic}.' },
      { name: 'Pre-teach vocabulary', slot: 'pre-skill', weight: 0.15, interaction: 'T-Ss', aim: 'To pre-teach key words that would block understanding of the text.' },
      { name: 'Gist task', slot: 'gist', weight: 0.15, interaction: 'S', aim: 'To develop the skill of understanding the main idea.' },
      { name: 'Detailed task', slot: 'detail', weight: 0.25, interaction: 'S', aim: 'To develop the skill of understanding specific information and detail.' },
      { name: 'Post-task', slot: 'post-skill', weight: 0.25, interaction: 'S-S', aim: 'To respond personally to the text and practise speaking about {topic}.' },
      { name: 'Feedback', slot: 'feedback', weight: 0.1, interaction: 'T-Ss', aim: 'To give feedback on content and language.' },
    ],
  },
}

/** Sensible framework for a lesson focus, used to pre-fill the form. */
export function suggestFramework(focus: string, level: string): FrameworkId {
  if (focus === 'reading' || focus === 'listening') return 'PDP'
  if (focus === 'speaking' || focus === 'writing') return level >= 'B1' ? 'TBL' : 'PPP'
  return 'PPP'
}
