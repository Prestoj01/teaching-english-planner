import type { PointerEvent } from 'react'

/**
 * Pointer handlers that tilt an element a few degrees toward the cursor.
 * Writes --rx/--ry CSS variables; the stylesheet decides how to use them.
 * Mouse and pen only (touch would fight scrolling).
 */
export function tiltHandlers(max = 6) {
  return {
    onPointerMove(e: PointerEvent<HTMLElement>) {
      if (e.pointerType === 'touch') return
      const r = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      e.currentTarget.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`)
      e.currentTarget.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`)
    },
    onPointerLeave(e: PointerEvent<HTMLElement>) {
      e.currentTarget.style.setProperty('--rx', '0deg')
      e.currentTarget.style.setProperty('--ry', '0deg')
    },
  }
}
