/**
 * Hand-drawn doodles. All share one style: a 48px grid, slightly wobbly 2.25 ink strokes,
 * and a flat colour fill that sits a little off the line, like a quick marker sketch.
 * Decorative only, so they're hidden from screen readers.
 */
type Fill = 'yellow' | 'tomato' | 'cobalt' | 'mint' | 'pink'

const DOODLES = {
  // Target with an arrow: aims
  target: {
    fill: 'M24 9c9 0 15 6.5 15 15s-6.5 15-15 15S9 32.5 9 24 15 9 24 9z',
    fillColor: 'yellow',
    ink: 'M23 7.5c9.5-.4 16.8 7 16.6 16.2-.2 9.6-7.6 16-16.4 15.8C14 39.3 7.4 32.6 7.6 23.6 7.8 14.8 14.6 7.9 23 7.5zM23.6 15.5c4.6-.2 8.4 3.6 8.3 8.3-.1 4.7-3.9 8.2-8.4 8.1-4.6-.1-7.9-3.7-7.8-8.2.1-4.4 3.5-8 7.9-8.2zM24 24l17-15M36 6.5l5 2.5-1 5.5',
  },
  // Speech bubble: language analysis
  bubble: {
    fill: 'M10 12h29c2 0 3 1 3 3v15c0 2-1 3-3 3H22l-8 7v-7h-4c-2 0-3-1-3-3V15c0-2 1-3 3-3z',
    fillColor: 'mint',
    ink: 'M9.5 10.2c10-.6 19.8-.4 29.6.2 2 .2 3.4 1.6 3.4 3.6.2 5.4.2 10.8-.1 16.1-.1 2-1.6 3.3-3.6 3.3-6 .2-11.6.1-17.4.2l-8.6 7.6.3-7.7c-1.3 0-2.7 0-4-.1-2-.1-3.3-1.5-3.4-3.5-.3-5.4-.3-10.6 0-15.9.1-2 1.6-3.6 3.8-3.8zM15 19.5c5.5-.3 11.4-.2 17.6.2M15 25.5c3.8-.2 7.6-.2 11.4 0',
  },
  // Clock: procedure
  clock: {
    fill: 'M25 9c8.5 0 15 6.8 15 15.2S33.3 39 24.8 39 10 32.2 10 24 16.5 9 25 9z',
    fillColor: 'pink',
    ink: 'M24 7.6c9.2-.3 16.6 7.1 16.4 16.4-.2 9.3-7.5 16.4-16.6 16.2-9-.1-16-7.4-15.8-16.4.2-8.9 7.2-15.9 16-16.2zM24.2 14.5l-.3 10.2 6.8 4.2M24 9.8v2.4M38 24h-2.4M24 38.2v-2.4M10 24h2.4',
  },
  // Light bulb: anticipated problems
  bulb: {
    fill: 'M24 7c7 0 12 5 12 11.5 0 4.6-2.6 7.4-4.6 9.6-1.4 1.6-1.9 3-1.9 4.9H18.6c0-2-.6-3.4-2-5-2-2.1-4.6-4.9-4.6-9.5C12 12 17 7 24 7z',
    fillColor: 'yellow',
    ink: 'M23.4 6c6.8-.3 12.4 5 12.6 11.6.1 4.8-2.4 7.9-4.6 10.2-1.5 1.6-2 3.2-2 5.2l-10.6.2c0-2.2-.6-3.7-2.1-5.3-2.2-2.3-4.7-5.2-4.6-10 .1-6.6 4.9-11.6 11.3-11.9zM19 37.6c3.4.3 6.8.2 10.2-.1M20.5 41.6c2.4.2 4.8.2 7-.1M21 22.5l3 3.5 3-3.5M24 26v7',
  },
  // Two arrows apart: support and stretch
  arrows: {
    fill: 'M8 26l9-9v5.5h14V17l9 9-9 9v-5.5H17V35z',
    fillColor: 'mint',
    ink: 'M7.5 24.2c8.6-.4 24.4-.5 33.4-.1M16.4 15.6c-3.2 2.8-6 5.5-8.8 8.6 2.9 3 5.6 5.8 8.6 8.6M31.8 15.4c3.2 2.9 6 5.7 8.8 8.8-2.8 3-5.6 5.8-8.6 8.8',
  },
  // House: homework
  house: {
    fill: 'M10 22l14-12 14 12v17H10z',
    fillColor: 'tomato',
    ink: 'M6.5 23.6c5.8-5 11.6-10.2 17.6-15.4 5.8 5.1 11.8 10.2 17.6 15.6M10.4 20.5c-.2 6.2-.1 12.4.2 18.7 9 .2 18 .2 27-.1.3-6.2.3-12.4.1-18.6M20.5 39c-.1-3.6 0-7.1.2-10.6 2.3-.2 4.5-.2 6.8 0 .2 3.5.3 7 .2 10.6',
  },
  // Paper plane: empty library
  plane: {
    fill: 'M6 22l36-14-9 32-9-11z',
    fillColor: 'cobalt',
    ink: 'M5.6 21.8c12-4.8 24-9.6 36.4-14.2-2.8 10.8-6 21.4-9.2 32.2-3.1-3.6-6.2-7.2-9.4-10.8-6-2.4-12-4.8-17.8-7.2zM41.6 8L22.8 29.4M22.6 29.2l-.4 9.6 5-5.4',
  },
  // Globe: about
  globe: {
    fill: 'M24 8c8.8 0 16 7.2 16 16s-7.2 16-16 16S8 32.8 8 24 15.2 8 24 8z',
    fillColor: 'cobalt',
    ink: 'M23.6 7.4c9-.3 16.6 7 16.8 16.2.2 9.2-7 16.6-16.2 16.8-9 .2-16.6-7-16.8-16.2-.2-9.2 7.2-16.6 16.2-16.8zM8 23.6c10.6-.6 21.4-.6 32.2 0M24.2 7.6c-5.6 5-8.2 10.6-8.2 16.6.1 6 2.8 11.6 8.2 16M24 7.6c5.4 5 8 10.6 8 16.4 0 6.2-2.6 11.4-7.8 16.2M10.6 15.6c8.8-.4 17.8-.4 26.8 0M10.6 32.2c8.8.4 17.8.4 26.8 0',
  },
  // Apple: for the teacher
  apple: {
    fill: 'M24 15c4-3 13-3 14 6 1 8-5 18-10 17-2 0-3-1-4-1s-2 1-4 1c-5 1-11-9-10-17 1-9 10-9 14-6z',
    fillColor: 'tomato',
    ink: 'M23.8 14.6c-4.4-3.6-14.2-3.2-14.8 6.6-.6 8 5.4 17.6 10.2 17.4 2-.1 3.2-1.2 4.6-1.2 1.4 0 2.6 1.1 4.6 1.2 4.8.2 10.8-9.4 10.2-17.4-.6-9.8-10.4-10.2-14.8-6.6zM24 14.4c-.2-3.4.8-6.4 3.2-8.8M25.6 10.2c3.4-3.2 7.6-3.6 10-2.2-2.2 3.8-6.4 4.6-10 2.2z',
  },
  // Star: stretch / highlights
  star: {
    fill: 'M24 7l5 11 12 1.5-9 8 2.5 12L24 34l-10.5 5.5L16 27.5l-9-8L19 18z',
    fillColor: 'yellow',
    ink: 'M24.2 6.4c1.6 3.8 3.4 7.4 5.2 11.2 4 .4 8 .9 12 1.6-2.9 2.8-6 5.5-9 8.2.8 4 1.6 8 2.4 12.2-3.6-1.8-7.2-3.8-10.8-5.6-3.6 1.8-7.2 3.8-10.8 5.6.8-4 1.6-8 2.4-12.2-3-2.6-6-5.4-9-8.2 4-.7 8-1.2 12-1.6 1.8-3.8 3.6-7.4 5.6-11.2z',
  },
} satisfies Record<string, { fill?: string; fillColor?: Fill; ink: string }>

export type DoodleName = keyof typeof DOODLES

const FILLS: Record<Fill, string> = {
  yellow: 'var(--accent)',
  tomato: 'var(--tomato-bright)',
  cobalt: 'var(--brand-soft)',
  mint: 'var(--mint)',
  pink: 'var(--pink)',
}

export function Doodle({ name, size = 40, className = '' }: { name: DoodleName; size?: number; className?: string }) {
  const d: { fill?: string; fillColor?: Fill; ink: string } = DOODLES[name]
  return (
    <svg className={`doodle ${className}`} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {d.fill && <path d={d.fill} fill={FILLS[d.fillColor ?? 'yellow']} transform="translate(2 2)" />}
      <path d={d.ink} fill="none" stroke="var(--ink)" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
