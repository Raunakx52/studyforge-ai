export type Flashcard = {
  id: string
  question: string
  answer: string
}

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type ChecklistItem = {
  id: string
  label: string
}

export type ChartItem = {
  label: string
  value: number
}

export type ChartData = {
  title: string
  items: ChartItem[]
}

export type StudyResult = {
  title: string
  summary: string
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
  checklist: ChecklistItem[]
  chart: ChartData
}

export type SavedSession = {
  id: string
  input: string
  result: StudyResult
  createdAt: string
}
