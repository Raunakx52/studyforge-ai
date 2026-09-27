type Props = {
  title: string
  message: string
  onRetry: () => void
}

export default function ErrorState({ title, message, onRetry }: Props) {
  return (
    <section className="state-card error-card" role="alert">
      <div className="error-mark">!</div>
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      <button className="primary-button" type="button" onClick={onRetry}>
        Retry
      </button>
    </section>
  )
}
