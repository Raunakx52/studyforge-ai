import type { StudyResult } from '../types/result'
import ChartBlock from './ChartBlock'
import ChecklistBlock from './ChecklistBlock'
import FlashcardDeck from './FlashcardDeck'
import QuizPanel from './QuizPanel'

type Props = {
  result: StudyResult
  onSave: () => void
}

export default function ResultView({ result, onSave }: Props) {
  return (
    <div className="result-stack">
      <section className="result-hero">
        <div>
          <p className="eyebrow">Generated study kit</p>
          <h2>{result.title}</h2>
          <p>{result.summary}</p>
        </div>
        <button className="secondary-button" type="button" onClick={onSave}>
          Save session
        </button>
      </section>
      <div className="two-column-grid">
        <FlashcardDeck cards={result.flashcards} />
        <ChartBlock chart={result.chart} />
      </div>
      <ChecklistBlock items={result.checklist} />
      <QuizPanel key={result.quiz.map(question => question.id).join('|')} questions={result.quiz} />
    </div>
  )
}
