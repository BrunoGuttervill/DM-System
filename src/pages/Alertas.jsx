import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { IconAlertCircle, IconAlertTriangle, IconClock } from '../components/Icons'

const alertaIcons = {
  critico: IconAlertCircle,
  atencao: IconAlertTriangle,
  vencimento: IconClock,
}

export default function Alertas() {
  const { notifEstoque, notifVencimento } = useApp()
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/alertas')
      .then(r => r.json())
      .then(data => setAlertas(data))
  }, [])

  const alertasVisiveis = alertas.filter(a => {
    if (a.tipo === 'vencimento') return notifVencimento
    return notifEstoque // critico / atencao (estoque baixo ou crítico)
  })

  const algumTipoDesligado = !notifEstoque || !notifVencimento

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Alertas do Sistema</h3>
      </div>

      {algumTipoDesligado && (
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--cinza)',
          background: 'var(--bg-hover)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          marginBottom: 16,
        }}>
          {!notifEstoque && !notifVencimento
            ? 'Alertas de estoque e de vencimento estão desligados nas Configurações.'
            : !notifEstoque
              ? 'Alertas de estoque baixo estão desligados nas Configurações.'
              : 'Avisos de vencimento estão desligados nas Configurações.'}
        </div>
      )}

      {alertasVisiveis.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cinza)' }}>
          Nenhum alerta no momento. Estoque sob controle. ✓
        </div>
      ) : (
        alertasVisiveis.map((a) => {
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