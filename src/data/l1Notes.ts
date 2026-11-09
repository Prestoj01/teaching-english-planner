/**
 * Common difficulties English learners have because of their first language (L1).
 * These are well-known tendencies, not rules: every learner is different.
 * Used to fill in the "anticipated problems" section of a lesson plan.
 */

export interface L1Note {
  area: 'grammar' | 'pronunciation' | 'vocabulary' | 'writing'
  problem: string
  solution: string
}

export const L1_NOTES: Record<string, L1Note[]> = {
  Spanish: [
    { area: 'pronunciation', problem: 'Adding /e/ before words starting with s + consonant ("espeak", "estudent").', solution: 'Drill "sss-peak" by stretching the /s/; use minimal back-chaining.' },
    { area: 'pronunciation', problem: 'Confusing /b/ and /v/, and short vs long vowels (ship/sheep).', solution: 'Use minimal-pair drills and show mouth position.' },
    { area: 'grammar', problem: 'Dropping subject pronouns ("Is raining").', solution: 'Highlight that English sentences always need a subject; use quick correction gestures.' },
    { area: 'vocabulary', problem: 'False friends (e.g. "embarrassed" vs "embarazada", "actually" vs "actualmente").', solution: 'Pre-empt common false friends and test them with CCQs.' },
  ],
  Portuguese: [
    { area: 'pronunciation', problem: 'Adding an extra vowel at the end of words ("bookie" for "book").', solution: 'Drill final consonants and model clipped endings.' },
    { area: 'pronunciation', problem: 'Pronouncing "th" as /t/, /d/ or /f/.', solution: 'Show tongue placement between teeth with a mirror or exaggerated model.' },
    { area: 'vocabulary', problem: 'False friends such as "pretend" (pretender = intend) and "push" (puxar = pull).', solution: 'Contrast meanings with clear examples and CCQs.' },
  ],
  French: [
    { area: 'pronunciation', problem: 'Dropping the /h/ sound or adding it in the wrong places.', solution: 'Hand-in-front-of-mouth breath drill for /h/.' },
    { area: 'grammar', problem: 'Using present simple for ongoing actions ("I wait here since an hour").', solution: 'Use timelines to contrast present perfect and present simple.' },
    { area: 'pronunciation', problem: 'Stressing the final syllable of words.', solution: 'Mark word stress on the board and drill with clapping.' },
  ],
  'Mandarin Chinese': [
    { area: 'grammar', problem: 'Omitting verb tense and plural -s because Mandarin does not inflect verbs or nouns.', solution: 'Use timelines and highlight endings in a different colour on the board.' },
    { area: 'grammar', problem: 'Omitting articles (a/an/the).', solution: 'Give regular, short article-focused tasks; correct gently and consistently.' },
    { area: 'pronunciation', problem: 'Dropping or adding final consonants; confusing /l/ and /r/, /v/ and /w/.', solution: 'Minimal-pair drills and back-chaining of final sounds.' },
    { area: 'pronunciation', problem: 'Flat or "syllable-timed" rhythm.', solution: 'Practise sentence stress and weak forms with clapping or tapping.' },
  ],
  Japanese: [
    { area: 'pronunciation', problem: 'Confusing /l/ and /r/; adding vowels after consonants ("bukku").', solution: 'Minimal pairs (light/right) and show tongue position; drill consonant clusters.' },
    { area: 'grammar', problem: 'Omitting articles and plurals.', solution: 'Highlight these in examples and give focused controlled practice.' },
    { area: 'grammar', problem: 'Word order (verb at the end of the sentence in Japanese).', solution: 'Use colour-coded sentence building (subject–verb–object).' },
    { area: 'writing', problem: 'Reluctance to speak up or give opinions in front of the class.', solution: 'Give pair-check time before whole-class feedback; nominate gently.' },
  ],
  Korean: [
    { area: 'pronunciation', problem: 'Confusing /p/ and /f/, /b/ and /v/, /l/ and /r/.', solution: 'Minimal pairs with visual mouth cues (teeth on lip for /f/ /v/).' },
    { area: 'grammar', problem: 'Omitting articles and plural -s; verb-final word order.', solution: 'Colour-coded word order and article spotting tasks.' },
    { area: 'grammar', problem: 'Answering negative questions ("Don\'t you like it?" "Yes" = I don\'t).', solution: 'Teach "No, I don\'t / Yes, I do" explicitly with practice.' },
  ],
  Vietnamese: [
    { area: 'pronunciation', problem: 'Dropping final consonants and consonant clusters ("fi" for "five").', solution: 'Back-chain drills focusing on final sounds.' },
    { area: 'grammar', problem: 'No verb inflection — tense and third person -s are often missed.', solution: 'Use timelines and clear highlighting; quick self-correction prompts.' },
    { area: 'pronunciation', problem: 'Using tones on English words, making intonation sound unnatural.', solution: 'Model and drill natural intonation patterns for questions and statements.' },
  ],
  Thai: [
    { area: 'pronunciation', problem: 'Dropping final consonants and simplifying clusters ("sool" for "school").', solution: 'Back-chaining and minimal pairs.' },
    { area: 'grammar', problem: 'Missing tense markers, plurals and articles.', solution: 'Use timelines and clear visual highlighting in examples.' },
    { area: 'pronunciation', problem: 'Confusing /r/ and /l/; /v/ pronounced as /w/.', solution: 'Show mouth position and drill minimal pairs.' },
  ],
  Arabic: [
    { area: 'pronunciation', problem: 'Confusing /p/ and /b/, and /f/ and /v/.', solution: 'Minimal-pair drills; hand in front of mouth to feel the puff of air for /p/.' },
    { area: 'grammar', problem: 'Omitting "be" in the present ("She teacher").', solution: 'Highlight the verb "be" in examples; use quick finger-correction.' },
    { area: 'writing', problem: 'Spelling vowels (Arabic script mostly omits short vowels) and writing direction habits.', solution: 'Give spelling practice with vowel focus; model handwriting for lower levels.' },
    { area: 'grammar', problem: 'Overusing "and" to join many clauses.', solution: 'Teach a range of linkers and sentence boundaries.' },
  ],
  Russian: [
    { area: 'grammar', problem: 'Omitting articles; no present perfect equivalent.', solution: 'Use timelines and article-focused practice.' },
    { area: 'pronunciation', problem: 'Confusing /w/ and /v/; "th" as /z/ or /s/.', solution: 'Show lip/tongue positions; minimal pairs.' },
    { area: 'pronunciation', problem: 'Falling intonation on questions, sounding abrupt.', solution: 'Model and drill polite intonation; teach softeners ("Could you…?").' },
  ],
  Turkish: [
    { area: 'grammar', problem: 'No grammatical gender: mixing up he/she.', solution: 'Quick correction and practice with pictures of people.' },
    { area: 'grammar', problem: 'Verb-final word order; omitting articles.', solution: 'Sentence building with colour-coded parts of speech.' },
    { area: 'pronunciation', problem: 'Confusing /w/ and /v/; "th" sounds.', solution: 'Minimal-pair drills with visual cues.' },
  ],
  Hindi: [
    { area: 'pronunciation', problem: 'Confusing /v/ and /w/; retroflex /t/ and /d/.', solution: 'Minimal pairs and mouth-position models.' },
    { area: 'grammar', problem: 'Overusing progressive forms ("I am knowing").', solution: 'Teach state verbs explicitly with practice.' },
    { area: 'grammar', problem: 'Article omission and word order differences (SOV).', solution: 'Colour-coded sentence building.' },
  ],
  German: [
    { area: 'pronunciation', problem: 'Confusing /w/ and /v/; final consonant devoicing ("bat" for "bad").', solution: 'Minimal pairs focusing on final voiced consonants.' },
    { area: 'grammar', problem: 'Using present simple for future or present perfect contexts ("I live here since 2010").', solution: 'Timelines contrasting tenses.' },
    { area: 'vocabulary', problem: 'False friends (become/bekommen, also/also, gift/Gift).', solution: 'Pre-empt with direct contrast and CCQs.' },
  ],
  Indonesian: [
    { area: 'grammar', problem: 'No verb tense inflection; plurals formed by repetition.', solution: 'Timelines and highlighting endings.' },
    { area: 'pronunciation', problem: 'Simplifying final consonants and clusters.', solution: 'Back-chaining drills.' },
  ],
  Italian: [
    { area: 'pronunciation', problem: 'Adding a vowel at the end of words ending in consonants ("I am-a").', solution: 'Model clipped endings and drill.' },
    { area: 'pronunciation', problem: 'Dropping /h/ at the start of words.', solution: 'Breath drill with hand in front of mouth.' },
    { area: 'grammar', problem: 'Dropping subject pronouns.', solution: 'Highlight that English needs a subject.' },
  ],
}

export const L1_OPTIONS = Object.keys(L1_NOTES).sort()

/** Problems that apply to almost any class, regardless of L1. */
export const GENERAL_NOTES: L1Note[] = [
  { area: 'grammar', problem: 'Students may understand {tl} but avoid using it in freer speaking.', solution: 'Make the freer task require {tl}; praise attempts and use delayed correction.' },
  { area: 'vocabulary', problem: 'Students may not know enough vocabulary about {topic} to complete tasks.', solution: 'Board useful words during the lead-in and leave them up for the whole lesson.' },
  { area: 'writing', problem: 'Instructions may be misunderstood, wasting task time.', solution: 'Demonstrate the first item, then ask instruction-check questions (ICQs) like "Do you write or speak?".' },
]
