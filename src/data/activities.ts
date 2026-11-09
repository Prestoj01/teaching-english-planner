import type { AgeGroup, CefrLevel, FocusType, Interaction } from '../schema'
import type { StageSlot } from './frameworks'

/**
 * A small, curated bank of classroom activities. Text may use {topic} and {tl}.
 * Filters are optional: an activity with no `levels` suits every level, and so on.
 */
export interface Activity {
  id: string
  slot: StageSlot
  name: string
  procedure: string[]
  studentActivity: string
  materials: string[]
  interaction?: Interaction
  levels?: CefrLevel[]
  ages?: AgeGroup[]
  focus?: FocusType[]
}

const LOW: CefrLevel[] = ['A1', 'A2']
const MID: CefrLevel[] = ['A2', 'B1', 'B2']
const HIGH: CefrLevel[] = ['B1', 'B2', 'C1', 'C2']

export const ACTIVITIES: Activity[] = [
  // ---------- Warmers / lead-ins ----------
  {
    id: 'picture-prompt', slot: 'lead-in', name: 'Picture prompt',
    procedure: ['Show 2–3 pictures related to {topic}.', 'Ask: "What can you see? Where is this? Have you ever…?"', 'Elicit key words and write them on the board.'],
    studentActivity: 'Students describe pictures and share ideas with the class.',
    materials: ['Pictures related to {topic} (projected or printed)'],
  },
  {
    id: 'discussion-questions', slot: 'lead-in', name: 'Personalised discussion questions', levels: HIGH,
    procedure: ['Write 3 open questions about {topic} on the board.', 'Students discuss in pairs for 3 minutes.', 'Nominate 2–3 pairs to share an interesting answer.'],
    studentActivity: 'Students discuss questions about {topic} in pairs.',
    materials: ['Board'], interaction: 'S-S',
  },
  {
    id: 'mystery-bag', slot: 'lead-in', name: 'Mystery bag', ages: ['young-learners'],
    procedure: ['Hide realia or flashcards connected to {topic} in a bag.', 'Students feel or guess what is inside using simple English.', 'Reveal items one by one and model the words.'],
    studentActivity: 'Students guess objects and repeat new words.',
    materials: ['Bag', 'Realia or flashcards for {topic}'],
  },
  {
    id: 'word-race', slot: 'warmer', name: 'Board race',
    procedure: ['Split the class into two teams.', 'Call a category related to {topic}; one student from each team runs to write a word.', 'Check spelling together and award points.'],
    studentActivity: 'Teams compete to write words related to {topic}.',
    materials: ['Board', 'Two markers'], interaction: 'Groups',
  },
  {
    id: 'find-someone-who-warmer', slot: 'warmer', name: 'Quick poll', levels: MID,
    procedure: ['Ask 3 yes/no questions about {topic} (e.g. "Who has…?").', 'Students stand up for "yes".', 'Ask follow-up "why?" questions to volunteers.'],
    studentActivity: 'Students respond physically and answer follow-up questions.',
    materials: [],
  },
  {
    id: 'song-or-video', slot: 'warmer', name: 'Short video or song',
    procedure: ['Play a 1–2 minute clip about {topic}.', 'Ask one simple gist question before playing.', 'Check the answer and ask how students feel about the topic.'],
    studentActivity: 'Students watch and answer a simple question.',
    materials: ['Short video or song clip'],
  },

  // ---------- Presenting language in context ----------
  {
    id: 'teacher-story', slot: 'context', name: 'Teacher anecdote',
    procedure: ['Tell a short, true-sounding story about {topic} that naturally includes {tl} 3–4 times.', 'Ask 2 gist questions to check students followed the story.', 'Write one or two target sentences from the story on the board.'],
    studentActivity: 'Students listen to the story and answer comprehension questions.',
    materials: ['Board'],
  },
  {
    id: 'dialogue-context', slot: 'context', name: 'Model dialogue',
    procedure: ['Show or play a short dialogue about {topic} containing {tl}.', 'Students listen/read and answer a gist question.', 'Highlight the target sentences in the dialogue.'],
    studentActivity: 'Students read/listen to the dialogue and identify the target language.',
    materials: ['Dialogue handout or audio'],
  },
  {
    id: 'situational-pictures', slot: 'context', name: 'Situational picture story', levels: LOW,
    procedure: ['Show a sequence of 3–4 pictures about {topic}.', 'Elicit what is happening in each picture.', 'Model a target sentence with {tl} for each picture.'],
    studentActivity: 'Students describe what is happening and listen to model sentences.',
    materials: ['Picture sequence'],
  },

  // ---------- Clarification ----------
  {
    id: 'mfp-clarify', slot: 'clarify', name: 'Meaning → Form → Pronunciation',
    procedure: [
      'Meaning: elicit what the target sentence means using concept-check questions (see analysis).',
      'Form: write the structure on the board (e.g. subject + verb…) and elicit how it is built.',
      'Pronunciation: model the sentence naturally; drill chorally then individually, marking stress and linking.',
    ],
    studentActivity: 'Students answer CCQs, help build the form on the board and repeat the model.',
    materials: ['Board', 'Coloured markers'],
  },
  {
    id: 'guided-discovery', slot: 'clarify', name: 'Guided discovery worksheet', levels: HIGH,
    procedure: ['Give students example sentences containing {tl}.', 'Students answer questions that lead them to the rule in pairs.', 'Check answers as a class and board the rule; drill pronunciation.'],
    studentActivity: 'Students work out the rule for {tl} from examples.',
    materials: ['Guided discovery handout'], interaction: 'S-S',
  },
  {
    id: 'flashcard-drill', slot: 'clarify', name: 'Flashcard elicit & drill', ages: ['young-learners', 'teens'],
    procedure: ['Show flashcards one at a time; elicit or model each item.', 'Drill chorally with gestures, then individually.', 'Play "what\'s missing?" by removing a card.'],
    studentActivity: 'Students name the items and repeat them.',
    materials: ['Flashcards for {topic}'],
  },

  // ---------- Controlled practice ----------
  {
    id: 'gap-fill', slot: 'controlled', name: 'Gap fill',
    procedure: ['Give a gap-fill exercise with 8 sentences using {tl}.', 'Students complete it alone, then compare answers in pairs.', 'Check answers as a class; ask for reasons when answers differ.'],
    studentActivity: 'Students complete sentences using {tl}, then check in pairs.',
    materials: ['Gap-fill worksheet'],
  },
  {
    id: 'sentence-transformation', slot: 'controlled', name: 'Sentence transformation', levels: HIGH,
    procedure: ['Give 6 sentences for students to rewrite using {tl}.', 'Students work alone, then compare.', 'Elicit answers and board any alternatives.'],
    studentActivity: 'Students rewrite sentences using the target language.',
    materials: ['Transformation worksheet'],
  },
  {
    id: 'matching', slot: 'controlled', name: 'Matching exercise', levels: LOW,
    procedure: ['Students match sentence halves or words to pictures related to {topic}.', 'Pairs check together.', 'Feedback: students read the full sentences aloud.'],
    studentActivity: 'Students match items and read them aloud.',
    materials: ['Matching worksheet or cut-up cards'],
  },
  {
    id: 'substitution-drill', slot: 'controlled', name: 'Substitution drill',
    procedure: ['Give a model sentence with {tl}.', 'Call out a prompt word; students change the sentence to include it.', 'Speed up as students gain confidence; switch to student-led prompts.'],
    studentActivity: 'Students produce new sentences by substituting prompts.',
    materials: ['List of prompt words'], interaction: 'T-Ss',
  },

  // ---------- Freer practice ----------
  {
    id: 'find-someone-who', slot: 'freer', name: 'Find someone who…', levels: MID,
    procedure: ['Give each student a "Find someone who…" grid using {tl} about {topic}.', 'Students mingle and ask questions, writing names and one extra detail.', 'Monitor and note good language and errors for feedback.'],
    studentActivity: 'Students mingle, ask and answer questions using {tl}.',
    materials: ['"Find someone who" handouts'],
  },
  {
    id: 'role-play', slot: 'freer', name: 'Role-play',
    procedure: ['Give pairs role cards for a real-life situation about {topic}.', 'Give 2 minutes to plan, then they perform the role-play.', 'Swap roles or partners and repeat; monitor for feedback.'],
    studentActivity: 'Students perform a role-play using {tl}.',
    materials: ['Role cards'],
  },
  {
    id: 'information-gap', slot: 'freer', name: 'Information gap',
    procedure: ['Give Student A and Student B different information about {topic}.', 'They ask each other questions to complete their sheets without showing them.', 'Students compare sheets to check.'],
    studentActivity: 'Students exchange information by asking questions.',
    materials: ['A/B information gap sheets'],
  },
  {
    id: 'debate', slot: 'freer', name: 'Mini debate', levels: ['B2', 'C1', 'C2'],
    procedure: ['Give a statement about {topic}; assign "for" and "against" groups.', 'Groups prepare 3 arguments for 4 minutes.', 'Hold the debate; each speaker should use the target language at least once.'],
    studentActivity: 'Students argue a position on {topic}.',
    materials: ['Debate statement on the board'], interaction: 'Groups',
  },
  {
    id: 'game-yl', slot: 'freer', name: 'Board game', ages: ['young-learners', 'teens'],
    procedure: ['Groups of 3–4 play a board game; each square has a prompt about {topic}.', 'Students must make a sentence with {tl} to stay on the square.', 'Monitor and help with language.'],
    studentActivity: 'Students play a game and produce sentences with {tl}.',
    materials: ['Board game sheets', 'Dice and counters'], interaction: 'Groups',
  },

  // ---------- TBL ----------
  {
    id: 'planning-task', slot: 'task', name: 'Group planning task',
    procedure: ['Set a real-world task (e.g. plan a class event / choose the best option) related to {topic}.', 'Groups discuss and agree on an outcome within the time limit.', 'Monitor without correcting; note language needs.'],
    studentActivity: 'Students collaborate to reach a shared outcome.',
    materials: ['Task card with clear outcome'],
  },
  {
    id: 'ranking-task', slot: 'task', name: 'Ranking task',
    procedure: ['Give groups a list of 6–8 items connected to {topic}.', 'Groups must agree on a ranking and justify it.', 'Monitor and note useful and problematic language.'],
    studentActivity: 'Students negotiate and rank items.',
    materials: ['Ranking list'],
  },
  {
    id: 'report-prep', slot: 'report', name: 'Report preparation',
    procedure: ['Each group prepares a 1-minute summary of their outcome.', 'Teacher circulates and helps with accuracy.', 'Groups rehearse once quietly.'],
    studentActivity: 'Students plan and rehearse their report.',
    materials: ['Paper for notes'],
  },

  // ---------- Receptive skills ----------
  {
    id: 'pre-teach-vocab', slot: 'pre-skill', name: 'Pre-teach blocking vocabulary',
    procedure: ['Choose 4–6 words students need for the text.', 'Elicit each word using pictures, mime or definitions; check with CCQs.', 'Drill pronunciation and board the words.'],
    studentActivity: 'Students guess, repeat and note new words.',
    materials: ['Pictures for key words'],
  },
  {
    id: 'predict-from-title', slot: 'pre-skill', name: 'Prediction from title and pictures',
    procedure: ['Show the title and images of the text.', 'Students predict 3 things the text will say.', 'Board predictions to check later.'],
    studentActivity: 'Students make predictions in pairs.',
    materials: ['Text title and images'], interaction: 'S-S',
  },
  {
    id: 'gist-question', slot: 'gist', name: 'Gist question',
    procedure: ['Set one simple question about the main idea BEFORE students read/listen.', 'Give a strict time limit (reading) or play once (listening).', 'Students compare in pairs; check as a class.'],
    studentActivity: 'Students read/listen quickly for the main idea.',
    materials: ['Text or audio about {topic}'],
  },
  {
    id: 'match-headings', slot: 'gist', name: 'Match headings to paragraphs', levels: HIGH,
    procedure: ['Students match headings to paragraphs quickly.', 'Pairs compare.', 'Check and ask which words helped them.'],
    studentActivity: 'Students skim and match headings.',
    materials: ['Text with paragraph headings'],
  },
  {
    id: 'detail-questions', slot: 'detail', name: 'True/False/Not given + comprehension questions',
    procedure: ['Students read the detail questions first.', 'Students read/listen again for specific information.', 'Pairs compare, then check as a class with evidence from the text.'],
    studentActivity: 'Students find specific information in the text.',
    materials: ['Detail question worksheet'],
  },
  {
    id: 'post-discussion', slot: 'post-skill', name: 'Personal response discussion',
    procedure: ['Give 3 discussion questions connecting the text to students\' lives.', 'Students discuss in pairs or small groups.', 'Monitor for feedback; share best ideas with the class.'],
    studentActivity: 'Students give opinions about the text and {topic}.',
    materials: ['Discussion questions'],
  },
  {
    id: 'post-writing', slot: 'post-skill', name: 'Short written response', focus: ['reading', 'writing'],
    procedure: ['Students write a short response (e.g. a reply email or review) related to the text.', 'They swap with a partner and check one thing.', 'Share 2–3 examples with the class.'],
    studentActivity: 'Students write a short, personal response.',
    materials: ['Paper'], interaction: 'S',
  },

  // ---------- Test (TTT) ----------
  {
    id: 'diagnostic-task', slot: 'test', name: 'Diagnostic speaking/writing task',
    procedure: ['Set a short task that naturally requires {tl} (without teaching it first).', 'Students attempt it in pairs.', 'Monitor closely and note what students can and cannot do.'],
    studentActivity: 'Students try the task with the language they have.',
    materials: ['Task instructions'],
  },

  // ---------- Feedback ----------
  {
    id: 'delayed-error-correction', slot: 'feedback', name: 'Delayed error correction',
    procedure: ['Write 4–5 sentences you heard while monitoring (mix of correct and incorrect, anonymous).', 'Pairs decide which are correct and fix the mistakes.', 'Check together and praise good language you heard.'],
    studentActivity: 'Students correct anonymous errors from the lesson.',
    materials: ['Board'],
  },
]
