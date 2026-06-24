import { useApp } from '../context/AppContext'
import { relatorios } from '../data/mockData'

export default function Relatorios() {
  const { showToast } = useApp()
  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Relatórios</h3>
      </div>
      <div className="prod-cards">
        {relatorios.map(r => (
          <div
            key={r.id}
            className="prod-card"
            onClick={() => showToast(`📊 Gerando "${r.titulo}"...`)}
          >
            <div className="prod-card-icon">{r.icon}</div>
            <h4>{r.titulo}</h4>
            <p>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}