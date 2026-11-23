/**
 * Feedback without a server or analytics: links that open a pre-filled GitHub issue.
 * Nothing is sent until the person reviews the issue and presses Submit on GitHub.
 */
const REPO = 'https://github.com/Prestoj01/teaching-english-planner'

function issueUrl(title: string, body: string): string {
  return `${REPO}/issues/new?${new URLSearchParams({ title, body })}`
}

export const suggestActivityUrl = issueUrl(
  'Activity idea: ',
  `**Activity name:**

**Which stage is it for?** (lead-in, presentation, controlled practice, freer practice, feedback…)

**Levels it works for:** (A1–C2)

**How it works, step by step:**
1.
2.
3.

**Materials needed:**

**Why it works / tips:**
`,
)

export const reportProblemUrl = issueUrl(
  'Problem: ',
  `**What happened?**

**What did you expect?**

**Steps to reproduce:**
1.
2.

**Browser and device:**
`,
)
