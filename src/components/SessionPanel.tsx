import type { SavedSession } from '../types/result'

type Props = {
  sessions: SavedSession[]
  onLoad: (session: SavedSession) => void
  onDelete: (id: string) => void
}

export default function SessionPanel({ sessions, onLoad, onDelete }: Props) {
  if (sessions.length === 0) return null

  return (
    <section className="session-card" aria-labelledby="sessions-title">
      <div className="content-card-heading">
        <div>
          <p className="eyebrow">Saved locally</p>
          <h2 id="sessions-title">Previous sessions</h2>
        </div>
        <span className="pill">{sessions.length}</span>
      </div>
      <div className="session-list">
        {sessions.map(session => (
          <article className="session-item" key={session.id}>
            <button className="session-main" type="button" onClick={() => onLoad(session)}>
              <strong>{session.result.title}</strong>
              <span>{new Date(session.createdAt).toLocaleString()}</span>
            </button>
            <button className="icon-button" type="button" onClick={() => onDelete(session.id)} aria-label={`Delete ${session.result.title}`}>
              ×
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
