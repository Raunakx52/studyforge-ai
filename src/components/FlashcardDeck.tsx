import { useEffect, useState } from 'react'
import type { Flashcard } from '../types/result'

type Props = {
  cards: Flashcard[]
}

export default function FlashcardDeck({ cards }: Props) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
  }, [cards])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      if (event.key === 'ArrowRight') {
        setIndex(current => Math.min(current + 1, cards.length - 1))
        setFlipped(false)
      }
      if (event.key === 'ArrowLeft') {
        setIndex(current => Math.max(current - 1, 0))
        setFlipped(false)
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        setFlipped(current => !current)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [cards.length])

  const card = cards[index]

  return (
    <section className="content-card" aria-labelledby="flashcards-title">
      <div className="content-card-heading">
        <div>
          <p className="eyebrow">Flashcards</p>
          <h2 id="flashcards-title">Recall the key ideas</h2>
        </div>
        <span className="pill">{index + 1} / {cards.length}</span>
      </div>
      <button
        type="button"
        className={`flashcard ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped(current => !current)}
        aria-label={flipped ? 'Show question' : 'Show answer'}
      >
        <span className="flashcard-label">{flipped ? 'Answer' : 'Question'}</span>
        <strong>{flipped ? card.answer : card.question}</strong>
        <span className="flashcard-hint">Click or press Space to flip</span>
      </button>
      <div className="deck-actions">
        <button
          className="secondary-button"
          type="button"
          disabled={index === 0}
          onClick={() => {
            setIndex(current => current - 1)
            setFlipped(false)
          }}
        >
          Previous
        </button>
        <button
          className="secondary-button"
          type="button"
          disabled={index === cards.length - 1}
          onClick={() => {
            setIndex(current => current + 1)
            setFlipped(false)
          }}
        >
          Next
        </button>
      </div>
    </section>
  )
}
