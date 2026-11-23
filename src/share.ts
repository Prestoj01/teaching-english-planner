import { z } from 'zod'
import { LessonContentSchema, LessonRequestSchema } from './schema'

/**
 * Share a plan without a server: the plan is compressed into the link itself (#share=…).
 * Nothing is uploaded anywhere; whoever opens the link decodes it in their own browser.
 */

export const SharedPlanSchema = LessonContentSchema.extend({
  request: LessonRequestSchema,
  source: z.enum(['template', 'ai']),
  tags: z.array(z.string()).default([]),
})
export type SharedPlan = z.infer<typeof SharedPlanSchema>

const PREFIX = 'share='

function toBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function pipe(bytes: Uint8Array<ArrayBuffer>, stream: CompressionStream | DecompressionStream): Promise<Uint8Array<ArrayBuffer>> {
  const out = new Blob([bytes]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(out).arrayBuffer())
}

/** The hash fragment for a plan, e.g. "share=eJy…". */
export async function encodeShare(plan: SharedPlan): Promise<string> {
  const { title, mainAim, subsidiaryAims, learningOutcomes, targetLanguageAnalysis, keyVocabulary, stages,
    anticipatedProblems, differentiation, homework, boardPlan, request, source, tags } = plan
  const json = JSON.stringify({ title, mainAim, subsidiaryAims, learningOutcomes, targetLanguageAnalysis, keyVocabulary,
    stages, anticipatedProblems, differentiation, homework, boardPlan, request, source, tags })
  const packed = await pipe(new TextEncoder().encode(json), new CompressionStream('deflate-raw'))
  return PREFIX + toBase64Url(packed)
}

/** Reads a shared plan from a hash fragment, or returns null if there isn't a valid one. */
export async function decodeShare(hash: string): Promise<SharedPlan | null> {
  const h = hash.replace(/^#/, '')
  if (!h.startsWith(PREFIX)) return null
  try {
    const json = new TextDecoder().decode(await pipe(fromBase64Url(h.slice(PREFIX.length)), new DecompressionStream('deflate-raw')))
    const parsed = SharedPlanSchema.safeParse(JSON.parse(json))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function isShareHash(hash: string): boolean {
  return hash.replace(/^#/, '').startsWith(PREFIX)
}
