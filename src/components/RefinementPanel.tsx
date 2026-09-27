import { useState } from 'react'

type Props = {
  disabled: boolean
  onRefine: (instruction: string) => void
}

export default function RefinementPanel({ disabled, onRefine }: Props) {
  const [instruction, setInstruction] = useState('')

  const submit = () => {
    const value = instruction.trim()
    if (!value || disabled) return
    onRefine(value)
    setInstruction('')
  }

  return (
    <section className="refine-card" aria-labelledby="refine-title">
      <div>
        <p className="eyebrow">Refine</p>
        <h2 id="refine-title">Edit this study kit with AI</h2>
        <p>Ask for a focused change without regenerating from scratch.</p>
      </div>
      <div className="refine-row">
        <input
          value={instruction}
          onChange={event => setInstruction(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') submit()
          }}
          placeholder="Make the quiz harder and add more deadlock examples"
          maxLength={1000}
          disabled={disabled}
          aria-label="Refinement instruction"
        />
        <button
          className="primary-button"
          type="button"
          onClick={submit}
          disabled={disabled || instruction.trim().length === 0}
        >
          Refine
        </button>
      </div>
    </section>
  )
}
