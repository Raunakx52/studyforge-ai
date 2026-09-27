import { useEffect, useRef, useState } from 'react'
import AnimatedHero from './components/AnimatedHero'
import EmptyState from './components/EmptyState'
import ErrorState from './components/ErrorState'
import LoadingState from './components/LoadingState'
import PromptInput from './components/PromptInput'
import RefinementPanel from './components/RefinementPanel'
import ResultView from './components/ResultView'
import SessionPanel from './components/SessionPanel'
import { ApiError, generateStudyTool, refineStudyTool } from './lib/api'
import { deleteSession, loadSessions, saveSession } from './lib/sessions'
import type { SavedSession, StudyResult } from './types/result'

type Status = 'idle' | 'loading' | 'success' | 'error'
type LastAction =
  | { type: 'generate'; input: string }
  | { type: 'refine'; instruction: string }
  | null

type ErrorInfo = {
  title: string
  message: string
}

function errorInfo(error: unknown): ErrorInfo {
  if (!(error instanceof ApiError)) {
    return { title: 'Unexpected error', message: 'Something unexpected happened. Please retry.' }
  }

  if (error.kind === 'malformed') {
    return { title: 'Malformed AI output', message: 'The model did not return valid JSON. Nothing was rendered.' }
  }
  if (error.kind === 'wrong-shape') {
    return { title: 'Unexpected AI structure', message: 'The JSON was valid but did not match the required study-kit shape.' }
  }
  if (error.kind === 'empty') {
    return { title: 'Empty AI response', message: 'The model returned no usable content.' }
  }
  if (error.kind === 'timeout') {
    return { title: 'Request timed out', message: 'The model took too long to respond. Retry when ready.' }
  }
  if (error.kind === 'network') {
    return { title: 'Connection problem', message: 'The app could not reach the backend service.' }
  }
  return { title: 'Generation failed', message: error.message }
}

export default function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<StudyResult | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<ErrorInfo | null>(null)
  const [slow, setSlow] = useState(false)
  const [streamChars, setStreamChars] = useState(0)
  const [lastAction, setLastAction] = useState<LastAction>(null)
  const [sessions, setSessions] = useState<SavedSession[]>(() => loadSessions())
  const [dark, setDark] = useState(() => localStorage.getItem('studyforge-theme') === 'dark')
  const requestId = useRef(0)
  const controller = useRef<AbortController | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('studyforge-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => () => controller.current?.abort(), [])

  const run = async (action: Exclude<LastAction, null>) => {
    const id = ++requestId.current
    controller.current?.abort()
    const nextController = new AbortController()
    controller.current = nextController
    setStatus('loading')
    setError(null)
    setSlow(false)
    setStreamChars(0)
    setLastAction(action)

    const slowTimer = window.setTimeout(() => {
      if (id === requestId.current) setSlow(true)
    }, 8000)
    const timeout = window.setTimeout(() => nextController.abort(), 60000)

    try {
      const nextResult =
        action.type === 'generate'
          ? await generateStudyTool(
              action.input,
              update => {
                if (id === requestId.current) setStreamChars(update.chars)
              },
              nextController.signal
            )
          : await refineStudyTool(
              action.instruction,
              result!,
              update => {
                if (id === requestId.current) setStreamChars(update.chars)
              },
              nextController.signal
            )

      if (id !== requestId.current) return
      setResult(nextResult)
      setStatus('success')
    } catch (caught) {
      if (id !== requestId.current) return
      setError(errorInfo(caught))
      setStatus('error')
    } finally {
      window.clearTimeout(slowTimer)
      window.clearTimeout(timeout)
      if (id === requestId.current) controller.current = null
    }
  }

  const generate = () => {
    const value = input.trim()
    if (value.length < 3) return
    run({ type: 'generate', input: value })
  }

  const refine = (instruction: string) => {
    if (!result) return
    run({ type: 'refine', instruction })
  }

  const cancel = () => {
    requestId.current += 1
    controller.current?.abort()
    controller.current = null
    setStatus(result ? 'success' : 'idle')
    setSlow(false)
    setStreamChars(0)
  }

  const retry = () => {
    if (lastAction) run(lastAction)
  }

  const load = (session: SavedSession) => {
    requestId.current += 1
    controller.current?.abort()
    setInput(session.input)
    setResult(session.result)
    setStatus('success')
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = () => {
    if (!result) return
    setSessions(saveSession(input.trim(), result))
  }

  const busy = status === 'loading'

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="StudyForge home">
          <span className="brand-mark">S</span>
          <span>StudyForge AI</span>
        </a>
        <button className="theme-button" type="button" onClick={() => setDark(current => !current)}>
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
      </header>

      <AnimatedHero />

      <main id="top" className="main-layout">
        <div className="primary-column">
          <PromptInput value={input} onChange={setInput} onSubmit={generate} disabled={busy} />

          {status === 'loading' && <LoadingState slow={slow} chars={streamChars} onCancel={cancel} />}
          {status === 'error' && error && <ErrorState title={error.title} message={error.message} onRetry={retry} />}
          {(status === 'idle' || (status === 'success' && !result)) && <EmptyState />}

          {result && status !== 'loading' && (
            <>
              <ResultView result={result} onSave={save} />
              <RefinementPanel disabled={busy} onRefine={refine} />
            </>
          )}
        </div>

        <aside className="sidebar">
          <section className="side-card">
            <p className="eyebrow">Reliability</p>
            <h2>Structured by design</h2>
            <p>Model output is parsed and shape-checked before it can reach the interactive UI.</p>
            <div className="status-list">
              <span>JSON validation</span>
              <span>Stale-response guard</span>
              <span>60-second timeout</span>
              <span>Streaming transport</span>
            </div>
          </section>
          <SessionPanel
            sessions={sessions}
            onLoad={load}
            onDelete={id => setSessions(deleteSession(id))}
          />
        </aside>
      </main>

      <footer>
        <span>StudyForge AI</span>
        <span>Interactive structured-data study assistant</span>
      </footer>
    </div>
  )
}
