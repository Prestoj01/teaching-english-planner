import { Doodle } from './Doodle'
import { Icon } from './Icon'

/** A failed AI request, written as a red-pen note with ways forward rather than a bare message. */
export function ErrorNote({ title = "Claude couldn't write that plan", message, onRetry, onSettings, onDismiss }: {
  title?: string
  message: string
  onRetry?: () => void
  onSettings?: () => void
  onDismiss: () => void
}) {
  const keyProblem = !!onSettings && /key|access/i.test(message)
  return (
    <div className="error-note card" role="alert">
      <Doodle name="bulb" size={48} />
      <div>
        <h3 className="hand">{title}</h3>
        <p>{message}</p>
        <div className="actions">
          {keyProblem && <button onClick={onSettings}>Check your key in Settings</button>}
          {!keyProblem && onRetry && <button onClick={onRetry}><Icon name="shuffle" /> Try again</button>}
          <button className="secondary" onClick={onDismiss}>Dismiss</button>
        </div>
        <p className="hint">The free planner still works: press Generate plan to make one without AI.</p>
      </div>
    </div>
  )
}
