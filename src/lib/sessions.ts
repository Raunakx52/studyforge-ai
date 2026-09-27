import type { SavedSession, StudyResult } from '../types/result'

const STORAGE_KEY = 'studyforge-sessions-v1'

export function loadSessions(): SavedSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveSession(input: string, result: StudyResult): SavedSession[] {
  const sessions = loadSessions()
  const next: SavedSession = {
    id: crypto.randomUUID(),
    input,
    result,
    createdAt: new Date().toISOString()
  }
  const updated = [next, ...sessions].slice(0, 12)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function deleteSession(id: string): SavedSession[] {
  const updated = loadSessions().filter(session => session.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}
