import { useSyncExternalStore } from 'react'

/**
 * A site-wide "pause motion" switch for content that moves on its own (the marquee and the greeting).
 * WCAG 2.2.2 asks for a way to pause anything that moves for more than five seconds.
 * The choice is remembered and reflected as <html data-motion="paused"> for CSS.
 */
const KEY = 'hello-class:motion'
const listeners = new Set<() => void>()

function read(): boolean {
  try { return localStorage.getItem(KEY) === 'paused' } catch { return false }
}

let paused = typeof localStorage !== 'undefined' ? read() : false
if (typeof document !== 'undefined' && paused) document.documentElement.dataset.motion = 'paused'

export function setMotionPaused(next: boolean) {
  paused = next
  try { localStorage.setItem(KEY, next ? 'paused' : 'on') } catch { /* ignore */ }
  if (next) document.documentElement.dataset.motion = 'paused'
  else delete document.documentElement.dataset.motion
  listeners.forEach((l) => l())
}

export function useMotionPaused(): boolean {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l) },
    () => paused,
    () => false,
  )
}
