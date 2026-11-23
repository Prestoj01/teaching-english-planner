import { useState } from 'react'
import { Icon } from './Icon'

export type Theme = 'paper' | 'chalk'
const KEY = 'hello-class:theme'

/** Matches the inline script in index.html, which applies the theme before first paint. */
export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'chalk' ? 'chalk' : 'paper'
}

/** Paper (light) ↔ chalkboard (dark). Remembers the choice; otherwise follows the system setting. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme)
  function toggle() {
    const next: Theme = theme === 'chalk' ? 'paper' : 'chalk'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem(KEY, next) } catch { /* private mode: still switches for this visit */ }
    setTheme(next)
  }
  const label = theme === 'chalk' ? 'Switch to paper (light) mode' : 'Switch to chalkboard (dark) mode'
  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      <Icon name={theme === 'chalk' ? 'sun' : 'moon'} size={18} />
    </button>
  )
}
