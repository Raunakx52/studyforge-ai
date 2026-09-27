import type { ChartData } from '../types/result'

type Props = {
  chart: ChartData
}

export default function ChartBlock({ chart }: Props) {
  const max = Math.max(...chart.items.map(item => item.value), 1)

  return (
    <section className="content-card" aria-labelledby="chart-title">
      <div className="content-card-heading">
        <div>
          <p className="eyebrow">Concept map</p>
          <h2 id="chart-title">{chart.title}</h2>
        </div>
      </div>
      <div className="bar-chart" role="img" aria-label={chart.title}>
        {chart.items.map(item => (
          <div className="bar-row" key={item.label}>
            <span className="bar-label">{item.label}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }} />
            </div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}
