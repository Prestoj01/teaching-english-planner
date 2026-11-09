import { FRAMEWORK_INFO } from './data/frameworks'
import type { LessonPlan } from './schema'

const list = (items: string[]) => items.filter(Boolean).map((i) => `- ${i}`).join('\n')

export function planToMarkdown(p: LessonPlan): string {
  const r = p.request
  const tla = p.targetLanguageAnalysis
  const stages = p.stages
    .map(
      (s, i) => `### ${i + 1}. ${s.name} — ${s.minutes} min (${s.interaction})
**Aim:** ${s.aim}

${s.teacherProcedure.map((step, j) => `${j + 1}. ${step}`).join('\n')}

**Students:** ${s.studentActivity}${s.materials.length ? `\n\n**Materials:** ${s.materials.join(', ')}` : ''}`,
    )
    .join('\n\n')

  return `# ${p.title}

| | |
|---|---|
| Level | ${r.level} |
| Learners | ${r.ageGroup}, ${r.classSize} students${r.learnerL1 ? `, L1 ${r.learnerL1}` : ''} |
| Length | ${r.durationMinutes} minutes |
| Framework | ${FRAMEWORK_INFO[r.framework].name} |

## Aims
**Main aim:** ${p.mainAim}

${p.subsidiaryAims.length ? `**Subsidiary aims:**\n${list(p.subsidiaryAims)}\n\n` : ''}**Learning outcomes:**
${list(p.learningOutcomes)}

## Target language analysis
- **Form:** ${tla.form}
- **Meaning:** ${tla.meaning}
- **Pronunciation:** ${tla.pronunciation}

**Examples:**
${list(tla.examples)}

**Concept-check questions:**
${list(tla.conceptCheckQuestions)}
${p.keyVocabulary.length ? `\n**Key vocabulary:** ${p.keyVocabulary.join(', ')}\n` : ''}
## Procedure
${stages}

## Anticipated problems & solutions
${p.anticipatedProblems.map((a) => `- **Problem:** ${a.problem}\n  **Solution:** ${a.solution}`).join('\n')}

## Differentiation
**Support:**
${list(p.differentiation.support)}

**Stretch:**
${list(p.differentiation.stretch)}

## Board plan
\`\`\`
${p.boardPlan}
\`\`\`

## Homework
${p.homework}
`
}

export function downloadFile(filename: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'lesson'
}
