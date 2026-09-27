import { useEffect, useMemo, useState } from 'react'
import type { QuizQuestion } from '../types/result'

type Props = {
  questions: QuizQuestion[]
}

export default function QuizPanel({ questions }: Props) {
  const [activeIds, setActiveIds] = useState<string[]>(questions.map(question => question.id))
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setActiveIds(questions.map(question => question.id))
    setAnswers({})
    setSubmitted(false)
  }, [questions])

  const activeQuestions = useMemo(
    () => questions.filter(question => activeIds.includes(question.id)),
    [activeIds, questions]
  )

  const wrongQuestions = activeQuestions.filter(question => answers[question.id] !== question.correctIndex)
  const correctCount = activeQuestions.length - wrongQuestions.length
  const complete = activeQuestions.every(question => answers[question.id] !== undefined)

  const resetFullQuiz = () => {
    setActiveIds(questions.map(question => question.id))
    setAnswers({})
    setSubmitted(false)
  }

  const retestWrong = () => {
    setActiveIds(wrongQuestions.map(question => question.id))
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <section className="content-card" aria-labelledby="quiz-title">
      <div className="content-card-heading">
        <div>
          <p className="eyebrow">Quiz</p>
          <h2 id="quiz-title">Test your understanding</h2>
        </div>
        <span className="pill">{activeQuestions.length} questions</span>
      </div>

      <div className="quiz-list">
        {activeQuestions.map((question, questionIndex) => (
          <fieldset className="quiz-question" key={question.id} disabled={submitted}>
            <legend>{questionIndex + 1}. {question.question}</legend>
            <div className="option-list">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex
                const correct = submitted && question.correctIndex === optionIndex
                const incorrect = submitted && selected && question.correctIndex !== optionIndex
                return (
                  <label
                    className={`quiz-option ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${incorrect ? 'incorrect' : ''}`}
                    key={`${question.id}-${optionIndex}`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={selected}
                      onChange={() => setAnswers(current => ({ ...current, [question.id]: optionIndex }))}
                    />
                    <span>{option}</span>
                  </label>
                )
              })}
            </div>
            {submitted && <p className="explanation">{question.explanation}</p>}
          </fieldset>
        ))}
      </div>

      {!submitted ? (
        <button
          className="primary-button"
          type="button"
          disabled={!complete}
          onClick={() => setSubmitted(true)}
        >
          Submit quiz
        </button>
      ) : (
        <div className="quiz-summary">
          <div>
            <strong>{correctCount} / {activeQuestions.length}</strong>
            <span>correct</span>
          </div>
          <div className="deck-actions">
            {wrongQuestions.length > 0 && (
              <button className="primary-button" type="button" onClick={retestWrong}>
                Re-test wrong answers
              </button>
            )}
            <button className="secondary-button" type="button" onClick={resetFullQuiz}>
              Restart full quiz
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
