type Props = {
  slow: boolean
  chars: number
  onCancel: () => void
}

export default function LoadingState({ slow, chars, onCancel }: Props) {
  return (
    <section className="state-card" aria-live="polite" aria-busy="true">
      <div className="spinner" />
      <div>
        <h2>{slow ? 'Still building your study kit' : 'Building your study kit'}</h2>
        <p>
          {slow
            ? 'The model is taking longer than usual. You can keep waiting or cancel safely.'
            : chars > 0
              ? `Receiving structured output · ${chars.toLocaleString()} characters`
              : 'Waiting for structured output from the model.'}
        </p>
      </div>
      <button className="secondary-button" type="button" onClick={onCancel}>
        Cancel
      </button>
    </section>
  )
}
