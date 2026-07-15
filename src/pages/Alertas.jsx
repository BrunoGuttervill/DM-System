import { alertas } from '../data/mockData'
import { IconAlertCircle, IconAlertTriangle, IconClock } from '../components/Icons'

const alertaIcons = {
  critico: IconAlertCircle,
  atencao: IconAlertTriangle,
  vencimento: IconClock,
}

export default function Alertas() {
  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Alertas do Sistema</h3>
      </div>
      {alertas.map((a) => {
        const Icon = alertaIcons[a.icon] || IconAlertTriangle
        return (
          <div key={a.id} className={`alerta-item ${a.tipo}`}>
            <div className="alerta-icon"><Icon width={18} height={18} /></div>
            <div className="alerta-text">
              <strong>{a.titulo}</strong>
              <span>{a.desc}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}