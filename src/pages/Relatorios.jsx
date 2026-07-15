import { useApp } from '../context/AppContext'
import { relatorios } from '../data/mockData'
import { IconTrendingUp, IconDollarSign, IconFactory, IconAlertTriangle, IconTruck, IconBox } from '../components/Icons'

const relatorioIcons = {
  movimentacoes: IconTrendingUp,
  custo: IconDollarSign,
  producao: IconFactory,
  perdas: IconAlertTriangle,
  compras: IconTruck,
  estoque: IconBox,
}

export default function Relatorios() {
  const { showToast } = useApp()
  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Relatórios</h3>
      </div>
      <div className="prod-cards">
        {relatorios.map(r => {
          const Icon = relatorioIcons[r.icon] || IconBox
          return (
            <div
              key={r.id}
              className="prod-card"
              onClick={() => showToast(`Gerando "${r.titulo}"...`)}
            >
              <div className="prod-card-icon"><Icon width={22} height={22} /></div>
              <h4>{r.titulo}</h4>
              <p>{r.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}