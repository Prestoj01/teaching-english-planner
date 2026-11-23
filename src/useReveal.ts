import { useEffect } from 'react'

/**
 * Adds `.in` to every `.reveal` element as it scrolls into view, so CSS can animate it in.
 * One IntersectionObserver for the app's lifetime; a MutationObserver hands it new `.reveal`
 * elements as tabs and plans render, so nothing is re-scanned on ordinary re-renders.
 */
export function useReveal() {
  useEffect(() => {
    const showAll = () => document.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in'))
    if (typeof IntersectionObserver === 'undefined') {
      showAll()
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    const watch = (root: ParentNode) => {
      if (root instanceof Element && root.matches('.reveal:not(.in)')) io.observe(root)
      root.querySelectorAll?.('.reveal:not(.in)').forEach((el) => io.observe(el))
    }
    watch(document)
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => { if (n instanceof Element) watch(n) })
    })
    mo.observe(document.body, { childList: true, subtree: true })
    // Printing should never leave content hidden.
    window.addEventListener('beforeprint', showAll)
    return () => { io.disconnect(); mo.disconnect(); window.removeEventListener('beforeprint', showAll) }
  }, [])
}
