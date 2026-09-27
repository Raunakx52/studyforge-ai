import type { StudyResult } from '../types/result'

export type ValidationCode = 'empty' | 'malformed' | 'wrong-shape'

export class ResultValidationError extends Error {
  code: ValidationCode

  constructor(code: ValidationCode, message: string) {
    super(message)
    this.code = code
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const hasKeys = (value: Record<string, unknown>, keys: string[]) =>
  keys.every(key => key in value)

const hasUniqueStrings = (values: string[]) =>
  new Set(values).size === values.length

export function parseAndValidateResult(raw: string): StudyResult {
  if (!raw.trim()) {
    throw new ResultValidationError(
      'empty',
      'The AI returned an empty response.'
    )
  }

  let data: unknown

  try {
    data = JSON.parse(raw)
  } catch {
    throw new ResultValidationError(
      'malformed',
      'The AI returned malformed JSON.'
    )
  }

  if (
    !isRecord(data) ||
    !hasKeys(data, [
      'title',
      'summary',
      'flashcards',
      'quiz',
      'checklist',
      'chart'
    ])
  ) {
    throw new ResultValidationError(
      'wrong-shape',
      'The AI response did not match the expected structure.'
    )
  }

  if (
    !isNonEmptyString(data.title) ||
    !isNonEmptyString(data.summary)
  ) {
    throw new ResultValidationError(
      'wrong-shape',
      'The AI response had invalid title or summary fields.'
    )
  }

  const flashcards = data.flashcards
  const quiz = data.quiz
  const checklist = data.checklist
  const chart = data.chart

  if (
    !Array.isArray(flashcards) ||
    flashcards.length === 0 ||
    !flashcards.every(
      item =>
        isRecord(item) &&
        hasKeys(item, ['id', 'question', 'answer']) &&
        isNonEmptyString(item.id) &&
        isNonEmptyString(item.question) &&
        isNonEmptyString(item.answer)
    )
  ) {
    throw new ResultValidationError(
      'wrong-shape',
      'The flashcard structure was invalid.'
    )
  }

  if (
    !Array.isArray(quiz) ||
    quiz.length === 0 ||
    !quiz.every(item => {
      if (
        !isRecord(item) ||
        !hasKeys(item, [
          'id',
          'question',
          'options',
          'correctIndex',
          'explanation'
        ]) ||
        !isNonEmptyString(item.id) ||
        !isNonEmptyString(item.question) ||
        !Array.isArray(item.options) ||
        item.options.length < 2 ||
        !item.options.every(isNonEmptyString) ||
        !Number.isInteger(item.correctIndex) ||
        !isNonEmptyString(item.explanation)
      ) {
        return false
      }

      const correctIndex = Number(item.correctIndex)

      return (
        correctIndex >= 0 &&
        correctIndex < item.options.length
      )
    })
  ) {
    throw new ResultValidationError(
      'wrong-shape',
      'The quiz structure was invalid.'
    )
  }

  if (
    !Array.isArray(checklist) ||
    checklist.length === 0 ||
    !checklist.every(
      item =>
        isRecord(item) &&
        hasKeys(item, ['id', 'label']) &&
        isNonEmptyString(item.id) &&
        isNonEmptyString(item.label)
    )
  ) {
    throw new ResultValidationError(
      'wrong-shape',
      'The checklist structure was invalid.'
    )
  }

  if (
    !isRecord(chart) ||
    !hasKeys(chart, ['title', 'items']) ||
    !isNonEmptyString(chart.title) ||
    !Array.isArray(chart.items) ||
    chart.items.length === 0 ||
    !chart.items.every(
      item =>
        isRecord(item) &&
        hasKeys(item, ['label', 'value']) &&
        isNonEmptyString(item.label) &&
        typeof item.value === 'number' &&
        Number.isFinite(item.value)
    )
  ) {
    throw new ResultValidationError(
      'wrong-shape',
      'The chart structure was invalid.'
    )
  }

  const ids = [
    ...flashcards.map(item => item.id),
    ...quiz.map(item => item.id),
    ...checklist.map(item => item.id)
  ]

  if (!hasUniqueStrings(ids)) {
    throw new ResultValidationError(
      'wrong-shape',
      'The AI returned duplicate item IDs.'
    )
  }

  return data as StudyResult
}
