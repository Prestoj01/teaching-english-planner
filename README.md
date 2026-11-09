# ESL Lesson Planner

A free, open-source lesson planner for teachers of English as a second or foreign language (ESL/EFL).

Enter a topic, target language, CEFR level and your learners' first language, and get a complete,
editable lesson plan in the format used on CELTA and TEFL courses:

- **Aims and learning outcomes**
- **Target language analysis**: form, meaning, pronunciation, examples and concept-check questions (CCQs)
- **Timed stages** with interaction patterns, teacher procedure, student activity and materials, using
  PPP, Test-Teach-Test, Task-Based Learning, ESA, or Pre/During/Post for reading and listening lessons
- **Anticipated problems and solutions** based on the learners' first language (15+ languages)
- **Differentiation** (support and stretch), **board plan** and **homework**

Plans can be edited in place, saved, searched, duplicated, printed to PDF, downloaded as Markdown, and
backed up and restored as JSON.

## Free forever, by design

| Concern | How it's handled |
|---|---|
| Hosting | Static site on GitHub Pages: no server, no database, $0 to run |
| Accounts and data | None. Plans are stored in the browser's `localStorage`; export and import for backups |
| Core features | The offline generator runs fully in the browser from a curated knowledge base |
| AI features | Optional, **bring your own key**. The teacher's Claude API key stays in their browser and calls go straight to Anthropic, so the project owner never pays for usage |

## How it works

```
LessonRequest ──► Template generator (offline, deterministic) ──┐
      │                                                        ├──► LessonContent (Zod schema) ──► Editor / Library / Export
      └─────────► Claude generator (optional, BYOK) ───────────┘
```

- **One schema, two generators.** [`src/schema.ts`](src/schema.ts) defines the plan with Zod. The template
  generator produces it directly. The AI generator asks Claude for the same schema through
  [structured outputs](https://platform.claude.com/docs/), so the response is validated before it reaches
  the UI. The rest of the app never needs to know where a plan came from.
- **Template generator** ([`src/generator/templateGenerator.ts`](src/generator/templateGenerator.ts)):
  - assigns stage timings by framework weights, so they always add up exactly to the lesson length
  - chooses activities from a bank that's filtered by level, age group and focus, using a seeded PRNG so
    results are reproducible ("Try different activities" changes the seed)
  - adds a full language analysis for common grammar points, and problems specific to the learners' L1
- **AI generator** ([`src/ai/claudeGenerator.ts`](src/ai/claudeGenerator.ts)): uses the Anthropic TypeScript SDK
  with structured output, adaptive thinking and server-side refusal fallbacks. The template plan's stage
  skeleton and the L1 notes are passed in as grounding. The SDK is lazy-loaded, so people who don't use AI
  never download it.
- **Knowledge base** ([`src/data/`](src/data/)): frameworks, activities, grammar points and L1 interference notes,
  stored as plain typed data that's easy to extend.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest unit tests
npm run lint
npm run build    # static site in dist/
```

## Deploying

Pushing to `main` runs lint, tests and build, then deploys to GitHub Pages through
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). One-time setup: in the repo, go to
**Settings → Pages → Source** and choose **GitHub Actions**.

## Roadmap ideas

- Printable student worksheets (gap-fills, matching cards) generated from the plan
- More grammar points, activities and L1 profiles
- Unit/term planning: sequence several lessons with recycled vocabulary
- An eval set to compare AI plan quality across models and prompts
- Offline install as a PWA

## License

MIT
