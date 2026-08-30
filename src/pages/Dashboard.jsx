import { useState, useEffect } from 'react'
import StatCard from '../components/ui/StatCard'
import ProgBar from '../components/ui/ProgBar'
import Tag from '../components/ui/Tag'
import { useApp } from '../context/AppContext'
import {
  IconWheat, IconBox, IconFactory, IconClock, IconAlertTriangle,
  IconAlertCircle,
} from '../components/Icons'

const alertaIcons = {
  critico: IconAlertCircle,
  atencao: IconAlertTriangle,
  vencimento: IconClock,
}

function ehHoje(dataStr) {
  if (!dataStr) return false
  const hoje = new Date().toISOString().slice(0, 10)
  return String(dataStr).slice(0, 10) === hoje
}

export default function Dashboard() {
  const { notifEstoque, notifVencimento } = useApp()
  const [insumos, setInsumos] = useState([])
  const [produtos, setProdutos] = useState([])
  const [alertas, setAlertas] = useState([])
  const [producao, setProducao] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/api/insumos').then(r => r.json()),
      fetch('http://localhost:3000/api/produtos').then(r => r.json()),
      fetch('http://localhost:3000/api/alertas').then(r => r.json()),
      fetch('http://localhost:3000/api/producao').then(r => r.json()),
    ])
      .then(([insumosData, produtosData, alertasData, producaoData]) => {
        setInsumos(insumosData)
        setProdutos(produtosData)
        setAlertas(alertasData)
        setProducao(producaoData)
      })
      .finally(() => setCarregando(false))
  }, [])

  const alertasVisiveis = alertas.filter(a => a.tipo === 'vencimento' ? notifVencimento : notifEstoque)

  const producaoHoje = producao
    .filter(o => ehHoje(o.data))
    .reduce((soma, o) => soma + Number(o.qtd || 0), 0)

  const vencimentosProximos = alertas.filter(a => a.tipo === 'vencimento').length

  const insumosPrincipais = [...insumos]
    .filter(i => Number(i.qtdMin) > 0)
    .map(i => ({
      nome: i.nome,
      atual: i.qtdAtual,
      max: i.qtdMin,
      pct: Math.min(100, Math.round((Number(i.qtdAtual) / Number(i.qtdMin)) * 100)),
    }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 4)

  const ultimasProducoes = [...producao]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5)

  if (carregando) {
    return <div className="page-fade" style={{ padding: '2rem', textAlign: 'center', color: 'var(--cinza)' }}>Carregando dashboard...</div>
  }

  return (
    <div className="page-fade">
      <div className="stats-grid">
        <StatCard
          label="Insumos Cadastrados"
          value={insumos.length}
          sub={`${insumos.filter(i => i.status !== 'ok').length} abaixo do mínimo`}
          icon={<IconWheat width={20} height={20} />}
          color="vinho"
        />
        <StatCard
          label="Produtos no Estoque"
          value={produtos.length}
          sub={`${new Set(produtos.map(p => p.tipo)).size} tipos de produto`}
          icon={<IconBox width={20} height={20} />}
          color="terra"
        />
        <StatCard
          label="Produção Hoje"
          value={producaoHoje}
          sub="unidades produzidas"
          icon={<IconFactory width={20} height={20} />}
          color="verde"
        />
        <StatCard
          label="Vencimentos Próximos"
          value={vencimentosProximos}
          sub="alertas de validade"
          icon={<IconClock width={20} height={20} />}
          color="amarelo"
        />
      </div>

      <div className="dash-grid">
        {/* Alertas críticos */}
        <div className="dash-panel">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconAlertTriangle width={16} height={16} /> Alertas Críticos
          </h4>
          {alertasVisiveis.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--cinza)', padding: '8px 0' }}>Nenhum alerta no momento.</p>
          ) : (
            alertasVisiveis.map((a) => {
              const Icon = alertaIcons[a.tipo] || IconAlertTriangle
              return (
                <div key={a.id} className={`alerta-item ${a.tipo}`}>
                  <div className="alerta-icon"><Icon width={16} height={16} /></div>
                  <div className="alerta-text">
                    <strong>{a.titulo}</strong>
                    <span>{a.desc}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Produtos acabados */}
        <div className="dash-panel">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconBox width={16} height={16} /> Estoque de Produtos Acabados
          </h4>
          <ul className="mini-list">
            {produtos.slice(0, 5).map((p) => (
              <li key={p.id}>
                <span>{p.nome}</span>
                <Tag type={p.status}>{p.qtd} un</Tag>
              </li>
            ))}
          </ul>
        </div>

        {/* Nível dos insumos */}
        <div className="dash-panel">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconWheat width={16} height={16} /> Nível dos Insumos Principais
          </h4>
          <div className="prog-row">
            {insumosPrincipais.map((ins, i) => (
              <ProgBar
                key={i}
                nome={ins.nome}
                atual={ins.atual}
                max={ins.max}
                pct={ins.pct}
              />
            ))}
          </div>
        </div>

        {/* Últimas produções */}
        <div className="dash-panel">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconFactory width={16} height={16} /> Últimas Produções
          </h4>
          <ul className="mini-list">
            {ultimasProducoes.map((p) => (
              <li key={p.id}>
                <span>{p.produto} ({p.qtd} un)</span>
                <span className="qtd">{p.data}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}