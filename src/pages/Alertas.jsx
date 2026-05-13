import { alertas } from '../data/mockData'

export default function Alertas() {
  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Alertas do Sistema</h3>
      </div>
      {alertas.map((a) => (
        <div key={a.id} className={`alerta-item ${a.tipo}`}>
          <div className="alerta-icon">{a.icon}</div>
          <div className="alerta-text">
            <strong>{a.titulo}</strong>
            <span>{a.desc}</span>
          </div>
        </div>
      ))}
    </div>
  )
}