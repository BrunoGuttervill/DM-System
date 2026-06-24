import { useState, useEffect } from 'react'

export default function Alertas() {

  const [alertasData, setAlertasData] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/alertas')
      .then(r => r.json())
      .then(data => {
        setAlertasData(data)
      })
  }, [])

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Alertas do Sistema</h3>
      </div>
      {alertasData.map((a) => (
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