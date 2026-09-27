type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled: boolean
}

export default function PromptInput({ value, onChange, onSubmit, disabled }: Props) {
  const canSubmit = value.trim().length >= 3 && !disabled

  return (
    <section id="study-builder" className="prompt-card" aria-labelledby="prompt-heading">
      <div className="prompt-heading-row">
        <div>
          <p className="eyebrow">AI study workspace</p>
          <h2 id="prompt-heading">Build your study kit</h2>
          <p className="prompt-subtitle">Paste notes or describe a topic. StudyForge turns the response into interactive components instead of a chat.</p>
        </div>
        <span className="prompt-badge">Structured output</span>
      </div>
      <label className="field-label" htmlFor="study-input">
        Paste notes or describe a topic
      </label>
      <textarea
        id="study-input"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="Example: Explain operating-system deadlocks, prevention, avoidance, and Banker's algorithm for an interview."
        rows={7}
        maxLength={12000}
        disabled={disabled}
      />
      <div className="prompt-actions">
        <span className="character-count">{value.length.toLocaleString()} / 12,000</span>
        <button className="primary-button generate-button" type="button" onClick={onSubmit} disabled={!canSubmit}>
          <span>Generate study kit</span>
          <span className="button-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
