import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Doodle } from './Doodle'
import { Icon } from './Icon'
import { draftHandouts, lines, parseGaps, parseRoles, shuffled, type HandoutDraft } from '../handouts'
import type { LessonPlan } from '../schema'

type Kind = keyof HandoutDraft

const KINDS: { kind: Kind; name: string; help: string }[] = [
  { kind: 'gapFill', name: 'Gap-fill worksheet', help: 'One sentence per line. Put [square brackets] around the words to blank out.' },
  { kind: 'cards', name: 'Cut-up cards', help: 'One card per line: words for a vocabulary game, or sentences to order or match.' },
  { kind: 'roles', name: 'Role cards', help: 'One card per line, as "Who: what to do". The set repeats to fill the page.' },
  { kind: 'canDo', name: 'Exit tickets', help: 'One "I can…" statement per line. Prints four tickets per page to cut out.' },
]

/** A full-screen panel that turns the plan into editable, printable student handouts. */
export function Handouts({ plan, onClose }: { plan: LessonPlan; onClose: () => void }) {
  const [draft, setDraft] = useState<HandoutDraft>(() => draftHandouts(plan))
  const [chosen, setChosen] = useState<Record<Kind, boolean>>({ gapFill: true, cards: true, roles: true, canDo: true })
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus()
    }
  }, [onClose])

  function print() {
    const root = document.documentElement
    root.classList.add('print-handouts')
    const done = () => { root.classList.remove('print-handouts'); window.removeEventListener('afterprint', done) }
    window.addEventListener('afterprint', done)
    window.print()
  }

  const heading = <SheetHead title={plan.title} />

  return createPortal(
    <div className="handouts" role="dialog" aria-modal="true" aria-labelledby="handouts-title" ref={panel} tabIndex={-1}>
      <header className="handouts-bar no-print">
        <Doodle name="star" size={36} />
        <h2 id="handouts-title">Student handouts</h2>
        <span className="hint">Made from this plan. Edit anything on the left; it prints exactly as previewed.</span>
        <button onClick={print} disabled={!Object.values(chosen).some(Boolean)}><Icon name="printer" /> Print handouts</button>
        <button className="secondary" onClick={onClose}><Icon name="x" /> Close</button>
      </header>

      <div className="handouts-body">
        <div className="handouts-controls no-print">
          {KINDS.map(({ kind, name, help }) => (
            <fieldset key={kind} className={chosen[kind] ? '' : 'off'}>
              <legend>
                <label className="check">
                  <input type="checkbox" checked={chosen[kind]} onChange={(e) => setChosen({ ...chosen, [kind]: e.target.checked })} />
                  {name}
                </label>
              </legend>
              <p className="hint">{help}</p>
              <textarea
                rows={Math.max(3, lines(draft[kind]).length + 1)}
                value={draft[kind]}
                disabled={!chosen[kind]}
                aria-label={name}
                onChange={(e) => setDraft({ ...draft, [kind]: e.target.value })}
              />
            </fieldset>
          ))}
        </div>

        <div className="handouts-preview">
          {chosen.gapFill && <GapFillSheet text={draft.gapFill} heading={heading} />}
          {chosen.cards && <CardsSheet text={draft.cards} heading={heading} />}
          {chosen.roles && <RolesSheet text={draft.roles} heading={heading} />}
          {chosen.canDo && <ExitTickets text={draft.canDo} title={plan.title} />}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function SheetHead({ title }: { title: string }) {
  return (
    <div className="sheet-head">
      <span className="sheet-title">{title}</span>
      <span className="sheet-name">Name: <span className="write-line" /></span>
    </div>
  )
}

function GapFillSheet({ text, heading }: { text: string; heading: React.ReactNode }) {
  const rows = lines(text).map(parseGaps)
  const answers = rows.flatMap((r) => r.answers)
  return (
    <section className="sheet">
      {heading}
      <h3 className="sheet-h">Complete the sentences</h3>
      {answers.length > 1 && (
        <p className="word-box">{shuffled(answers).map((a, i) => <span key={i}>{a}</span>)}</p>
      )}
      <ol className="gap-list">
        {rows.map((r, i) => (
          <li key={i}>
            {r.parts.map((p, j) => (j % 2 ? <span key={j} className="gap" style={{ minWidth: `${Math.max(4, p.length * 0.75)}em` }} /> : p))}
          </li>
        ))}
      </ol>
      {answers.length > 0 && (
        <p className="answer-key">Answers: {rows.map((r, i) => `${i + 1}. ${r.answers.join(' / ')}`).join('   ')}</p>
      )}
    </section>
  )
}

function CardsSheet({ text, heading }: { text: string; heading: React.ReactNode }) {
  const cards = lines(text)
  return (
    <section className="sheet">
      {heading}
      <h3 className="sheet-h">Cut out the cards <span className="hint">✂</span></h3>
      <div className={`cut-grid ${cards.some((c) => c.length > 24) ? 'wide' : ''}`}>
        {cards.map((c, i) => <div key={i} className="cut-card">{c}</div>)}
      </div>
    </section>
  )
}

function RolesSheet({ text, heading }: { text: string; heading: React.ReactNode }) {
  return (
    <section className="sheet">
      {heading}
      <h3 className="sheet-h">Role cards <span className="hint">✂</span></h3>
      <div className="role-grid">
        {/* Repeat the set so one sheet serves several pairs or groups (up to 6 cards per page). */}
        {Array.from({ length: Math.max(1, Math.floor(6 / Math.max(1, parseRoles(text).length))) }, () => parseRoles(text)).flat().map((r, i) => (
          <div key={i} className="role-card">
            {r.who && <strong className="hand">{r.who}</strong>}
            <p>{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ExitTickets({ text, title }: { text: string; title: string }) {
  const items = lines(text)
  return (
    <section className="sheet">
      <div className="ticket-grid">
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className="ticket">
            <p className="ticket-title"><span className="hand">Exit ticket</span> · {title}</p>
            <ul>
              {items.map((it, i) => <li key={i}><span className="box" aria-hidden="true" />{it}</li>)}
            </ul>
            <p className="ticket-q">One thing I'm still not sure about: <span className="write-line" /></p>
          </div>
        ))}
      </div>
    </section>
  )
}
