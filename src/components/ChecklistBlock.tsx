import { useEffect, useState } from 'react'
import type { ChecklistItem } from '../types/result'

type Props = {
  items: ChecklistItem[]
}

export default function ChecklistBlock({ items }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => setChecked({}), [items])

  const completed = items.filter(item => checked[item.id]).length

  return (
    <section className="content-card" aria-labelledby="checklist-title">
      <div className="content-card-heading">
        <div>
          <p className="eyebrow">Checklist</p>
          <h2 id="checklist-title">Mastery checklist</h2>
        </div>
        <span className="pill">{completed} / {items.length}</span>
      </div>
      <div className="checklist">
        {items.map(item => (
          <label className={`check-item ${checked[item.id] ? 'done' : ''}`} key={item.id}>
            <input
              type="checkbox"
              checked={Boolean(checked[item.id])}
              onChange={event => setChecked(current => ({ ...current, [item.id]: event.target.checked }))}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </section>
  )
}
