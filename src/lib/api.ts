import type { StudyResult } from '../types/result'
import { parseAndValidateResult, ResultValidationError } from './validateResult'

export type StreamUpdate = {
  raw: string
  chars: number
}

export class ApiError extends Error {
  kind: 'network' | 'timeout' | 'failed' | 'empty' | 'malformed' | 'wrong-shape'

  constructor(kind: ApiError['kind'], message: string) {
    super(message)
    this.kind = kind
  }
}

type StreamEvent =
  | { type: 'delta'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string }

async function runStream(
  path: string,
  body: unknown,
  onUpdate: (update: StreamUpdate) => void,
  signal: AbortSignal
): Promise<StudyResult> {
  let response: Response

  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal
    })
  } catch (error) {
    if (signal.aborted) {
      throw new ApiError('timeout', 'The request took too long and was stopped.')
    }
    throw new ApiError('network', 'Could not reach the generation service.')
  }

  if (!response.ok) {
    let message = 'The AI request failed.'
    try {
      const data = await response.json()
      if (typeof data?.error === 'string') message = data.error
    } catch {
      message = 'The AI request failed.'
    }
    throw new ApiError('failed', message)
  }

  if (!response.body) {
    throw new ApiError('failed', 'The server returned no response stream.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let raw = ''

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.trim()) continue
        const event = JSON.parse(line) as StreamEvent
        if (event.type === 'delta') {
          raw += event.text
          onUpdate({ raw, chars: raw.length })
        }
        if (event.type === 'error') {
          throw new ApiError('failed', event.message)
        }
      }
    }

    if (buffer.trim()) {
      const event = JSON.parse(buffer) as StreamEvent
      if (event.type === 'delta') {
        raw += event.text
        onUpdate({ raw, chars: raw.length })
      }
      if (event.type === 'error') {
        throw new ApiError('failed', event.message)
      }
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (signal.aborted) {
      throw new ApiError('timeout', 'The request took too long and was stopped.')
    }
    throw new ApiError('failed', 'The streamed response could not be read.')
  }

  try {
    return parseAndValidateResult(raw)
  } catch (error) {
    if (error instanceof ResultValidationError) {
      throw new ApiError(error.code, error.message)
    }
    throw error
  }
}

export function generateStudyTool(
  input: string,
  onUpdate: (update: StreamUpdate) => void,
  signal: AbortSignal
) {
  return runStream('/api/generate', { input }, onUpdate, signal)
}

export function refineStudyTool(
  instruction: string,
  current: StudyResult,
  onUpdate: (update: StreamUpdate) => void,
  signal: AbortSignal
) {
  return runStream('/api/refine', { instruction, current }, onUpdate, signal)
}
