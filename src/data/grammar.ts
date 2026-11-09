/**
 * Language analysis for frequently taught grammar points. When the teacher's
 * "target language" matches one of these keywords, the offline generator can
 * fill in form / meaning / pronunciation / CCQs instead of leaving placeholders.
 */
export interface GrammarPoint {
  keywords: string[]
  name: string
  form: string
  meaning: string
  pronunciation: string
  examples: string[]
  ccqs: string[]
}

export const GRAMMAR_POINTS: GrammarPoint[] = [
  {
    keywords: ['present perfect', 'have been', 'ever', 'never'],
    name: 'Present perfect for experiences',
    form: 'Subject + have/has + past participle (+ ever/never). Question: Have/Has + subject + ever + past participle?',
    meaning: 'An experience at some time in the speaker\'s life up to now; the exact time is not important or not stated.',
    pronunciation: 'Contractions and weak forms: "I\'ve /aɪv/ been", "Have you /həv jə/ ever…?". Stress the main verb.',
    examples: ['I\'ve been to Japan.', 'Have you ever eaten sushi?', 'She\'s never seen snow.'],
    ccqs: ['"I\'ve been to Japan." Did I go to Japan? (Yes)', 'Do we know when? (No)', 'Is it important when? (No)', 'Could I go again? (Yes)'],
  },
  {
    keywords: ['past simple', 'simple past', '-ed', 'irregular verbs', 'yesterday', 'last weekend'],
    name: 'Past simple',
    form: 'Positive: subject + verb-ed / irregular past. Negative: didn\'t + base verb. Question: Did + subject + base verb?',
    meaning: 'A finished action at a finished time in the past.',
    pronunciation: '-ed endings: /t/ (walked), /d/ (played), /ɪd/ (wanted). "Did you" often /dɪdʒə/.',
    examples: ['I watched a film last night.', 'She didn\'t go to work yesterday.', 'Did you enjoy the party?'],
    ccqs: ['"I watched a film last night." Is it now or past? (Past)', 'Is the action finished? (Yes)', 'Do we know when? (Yes — last night)'],
  },
  {
    keywords: ['present continuous', 'present progressive', '-ing', 'right now'],
    name: 'Present continuous for now',
    form: 'Subject + am/is/are + verb-ing.',
    meaning: 'An action happening now, at or around the moment of speaking; temporary.',
    pronunciation: 'Contractions: "I\'m", "she\'s", "they\'re". Weak "are" /ə/ in questions.',
    examples: ['I\'m reading a great book.', 'They\'re playing football.', 'What are you doing?'],
    ccqs: ['"She\'s cooking." Is she cooking now? (Yes)', 'Is it finished? (No)', 'Is it always or temporary? (Temporary)'],
  },
  {
    keywords: ['going to', 'future plans', 'plans and intentions'],
    name: '"Going to" for plans',
    form: 'Subject + am/is/are + going to + base verb.',
    meaning: 'A plan or intention decided before the moment of speaking.',
    pronunciation: '"Going to" often reduced to /ˈɡʌnə/ (gonna) in fast speech; stress the main verb.',
    examples: ['I\'m going to visit my grandma this weekend.', 'Are you going to study tonight?', 'We\'re not going to buy a car.'],
    ccqs: ['"I\'m going to visit my grandma." Is it past, present or future? (Future)', 'Did I decide now or before? (Before)'],
  },
  {
    keywords: ['will', 'predictions', 'spontaneous decisions'],
    name: '"Will" for predictions and instant decisions',
    form: 'Subject + will (\'ll) + base verb. Negative: won\'t.',
    meaning: 'A prediction based on opinion, or a decision made at the moment of speaking.',
    pronunciation: 'Contraction "I\'ll" /aɪl/; "won\'t" /wəʊnt/ vs "want" /wɒnt/.',
    examples: ['I think it\'ll rain tomorrow.', 'I\'m cold. I\'ll close the window.', 'She won\'t be late.'],
    ccqs: ['"I\'ll close the window." Did I plan this before? (No)', 'Did I decide now? (Yes)'],
  },
  {
    keywords: ['comparative', 'comparatives', 'superlative', 'superlatives', 'than', 'the most'],
    name: 'Comparatives and superlatives',
    form: 'Short adj + -er than / the + -est; long adj: more … than / the most …; irregular: good–better–best, bad–worse–worst.',
    meaning: 'Comparing two things (comparative) or one thing against a whole group (superlative).',
    pronunciation: 'Weak "than" /ðən/; schwa in -er /ə/. Stress the adjective.',
    examples: ['Tokyo is bigger than Osaka.', 'This is the most expensive restaurant in town.', 'My English is better than last year.'],
    ccqs: ['"Tokyo is bigger than Osaka." How many cities are we talking about? (Two)', 'Which one is big? (Both)', 'Which one is more big? (Tokyo)'],
  },
  {
    keywords: ['first conditional', 'if + present', 'real conditional'],
    name: 'First conditional',
    form: 'If + present simple, will + base verb. (Clauses can swap; no comma when "if" is second.)',
    meaning: 'A real or likely future situation and its result.',
    pronunciation: 'Contractions "I\'ll", "it\'ll"; rising intonation on the if-clause, falling on the result.',
    examples: ['If it rains, we\'ll stay at home.', 'If you study, you\'ll pass the exam.', 'I\'ll call you if I\'m late.'],
    ccqs: ['"If it rains, we\'ll stay at home." Is it raining now? (No / We don\'t know)', 'Is it possible it will rain? (Yes)', 'What happens if it rains? (We stay at home)'],
  },
  {
    keywords: ['second conditional', 'if i were', 'unreal conditional', 'hypothetical'],
    name: 'Second conditional',
    form: 'If + past simple, would + base verb. "If I were…" is common for all persons.',
    meaning: 'An imaginary or unlikely situation in the present or future, and its result.',
    pronunciation: '"I\'d" /aɪd/, weak "would" /wəd/.',
    examples: ['If I won the lottery, I\'d travel the world.', 'If I were you, I\'d take the job.', 'What would you do if you could fly?'],
    ccqs: ['"If I won the lottery, I\'d travel." Have I won the lottery? (No)', 'Is it likely? (No)', 'Is it past? (No — imaginary present/future)'],
  },
  {
    keywords: ['can', 'ability', 'can\'t'],
    name: '"Can" for ability',
    form: 'Subject + can/can\'t + base verb. Question: Can + subject + base verb?',
    meaning: 'Saying what someone is or isn\'t able to do.',
    pronunciation: 'Weak "can" /kən/ in positive sentences; strong /kæn/ in short answers; "can\'t" /kɑːnt/ (UK) or /kænt/ (US) is always stressed.',
    examples: ['I can swim.', 'She can\'t drive.', 'Can you speak French? Yes, I can.'],
    ccqs: ['"I can swim." Am I able to swim? (Yes)', 'Am I swimming now? (Not necessarily)'],
  },
  {
    keywords: ['there is', 'there are', 'there\'s'],
    name: 'There is / there are',
    form: 'There is + singular / uncountable noun; there are + plural noun. Question: Is there…? / Are there…?',
    meaning: 'Saying that something exists or is in a place.',
    pronunciation: '"There\'s" /ðeəz/; weak "there are" /ðərə/.',
    examples: ['There\'s a park near my house.', 'There are three bedrooms.', 'Is there a bank around here?'],
    ccqs: ['"There are three bedrooms." How many bedrooms? (Three)', 'One or more than one? (More)'],
  },
  {
    keywords: ['countable', 'uncountable', 'some', 'any', 'much', 'many'],
    name: 'Countable/uncountable nouns with some/any/much/many',
    form: 'some (positive), any (negatives/questions); many + countable plural, much + uncountable (mostly negatives/questions); a lot of + both.',
    meaning: 'Talking about quantity.',
    pronunciation: 'Weak "some" /səm/ before nouns.',
    examples: ['There\'s some milk in the fridge.', 'Are there any eggs?', 'I don\'t have much time.'],
    ccqs: ['Can I count "milk"? (No)', 'Can I count "eggs"? (Yes)', '"Much eggs" or "many eggs"? (Many)'],
  },
  {
    keywords: ['used to'],
    name: '"Used to" for past habits',
    form: 'Subject + used to + base verb. Negative: didn\'t use to. Question: Did you use to…?',
    meaning: 'A past habit or state that is no longer true.',
    pronunciation: '"Used to" /ˈjuːstə/ — the /d/ is not pronounced.',
    examples: ['I used to play the piano.', 'She didn\'t use to like coffee.', 'Did you use to live here?'],
    ccqs: ['"I used to play the piano." Did I play in the past? (Yes)', 'Many times or once? (Many times)', 'Do I play now? (No)'],
  },
  {
    keywords: ['passive', 'passive voice'],
    name: 'Passive voice',
    form: 'Object + be (in the right tense) + past participle (+ by + agent).',
    meaning: 'Focus is on the action or the thing affected, not who does it (often unknown or unimportant).',
    pronunciation: 'Weak forms of "was" /wəz/, "were" /wə/, "been" /bɪn/.',
    examples: ['The bridge was built in 1890.', 'English is spoken here.', 'My phone has been stolen!'],
    ccqs: ['"The bridge was built in 1890." Is the bridge the subject of the action? (No — it received the action)', 'Do we know who built it? (No)', 'Is that important? (No)'],
  },
  {
    keywords: ['modals of advice', 'should', 'shouldn\'t', 'advice'],
    name: '"Should" for advice',
    form: 'Subject + should/shouldn\'t + base verb.',
    meaning: 'Giving advice or saying what is a good/bad idea.',
    pronunciation: 'Silent "l" in should /ʃʊd/; weak /ʃəd/ in fast speech.',
    examples: ['You should see a doctor.', 'You shouldn\'t eat so much sugar.', 'Should I call her?'],
    ccqs: ['"You should see a doctor." Is it a rule? (No)', 'Is it a good idea? (Yes)', 'Do you have to? (No)'],
  },
]

export function findGrammarPoint(targetLanguage: string): GrammarPoint | undefined {
  const t = targetLanguage.toLowerCase()
  if (!t.trim()) return undefined
  // Prefer the longest keyword match so "second conditional" beats "if".
  let best: { gp: GrammarPoint; len: number } | undefined
  for (const gp of GRAMMAR_POINTS) {
    for (const k of gp.keywords) {
      const re = new RegExp(`(^|[^a-z])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`)
      if (re.test(t) && (!best || k.length > best.len)) best = { gp, len: k.length }
    }
  }
  return best?.gp
}
