export default function ProgBar({ nome, atual, max, pct, unidade = '' }) {
  const cls = pct >= 60 ? 'prog-ok' : pct >= 35 ? 'prog-med' : 'prog-low'
  return (
    <div className="prog-item">
      <div className="prog-label">
        <span>{nome}</span>
        <span>{atual} / {max} {unidade}</span>
      </div>
      <div className="prog-wrap">
        <div className={`prog-bar ${cls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}