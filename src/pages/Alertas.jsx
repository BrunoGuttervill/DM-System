import { useState, useEffect } from 'react'
import { IconAlertCircle, IconAlertTriangle, IconClock } from '../components/Icons'

const alertaIcons = {
  critico: IconAlertCircle,
  atencao: IconAlertTriangle,
  vencimento: IconClock,
}

export default function Alertas() {
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/alertas')
      .then(r => r.json())
      .then(data => setAlertas(data))
  }, [])

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Alertas do Sistema</h3>
      </div>
      {alertas.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cinza)' }}>
          Nenhum alerta no momento. Estoque sob controle. ✓
        </div>
      ) : (
        alertas.map((a) => {
          const Icon = alertaIcons[a.tipo] || IconAlertTriangle
          return (
            <div key={a.id} className={`alerta-item ${a.tipo}`}>
              <div className="alerta-icon"><Icon width={18} height={18} /></div>
              <div className="alerta-text">
                <strong>{a.titulo}</strong>
                <span>{a.desc}</span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}