import StatCard from '../components/ui/StatCard'
import ProgBar from '../components/ui/ProgBar'
import Tag from '../components/ui/Tag'
import { alertas, insumosNivel } from '../data/mockData'
import {
  IconWheat, IconBox, IconFactory, IconClock, IconAlertTriangle,
  IconAlertCircle,
} from '../components/Icons'

const alertaIcons = {
  critico: IconAlertCircle,
  atencao: IconAlertTriangle,
  vencimento: IconClock,
}

const produtosEstoque = [
  { nome: '🍕 Pizza Marguerita 35cm',    qtd: '12 un', status: 'ok'      },
  { nome: '🍝 Lasanha Bolonhesa 500g',   qtd: '8 un',  status: 'ok'      },
  { nome: '🍝 Talharim Fresco 400g',     qtd: '3 un',  status: 'baixo'   },
  { nome: '🫙 Nhoque 400g',              qtd: '15 un', status: 'ok'      },
  { nome: '🍕 Pizza Frango c/ Catupiry', qtd: '1 un',  status: 'critico' },
]

const ultimasProducoes = [
  { produto: 'Pizza Marguerita (20 un)',     quando: 'Hoje 08:30'    },
  { produto: 'Lasanha Bolonhesa (15 un)',    quando: 'Hoje 10:00'    },
  { produto: 'Nhoque (30 un)',               quando: 'Ontem 14:00'   },
  { produto: 'Talharim Fresco (10 un)',      quando: 'Ontem 09:15'   },
  { produto: 'Pizza Frango Catupiry (8 un)', quando: '11/05 11:30'   },
]

export default function Dashboard() {
  return (
    <div className="page-fade">
      <div className="stats-grid">
        <StatCard label="Insumos Cadastrados" value="24" sub="3 abaixo do mínimo"  icon={<IconWheat width={20} height={20} />}   color="vinho"   />
        <StatCard label="Produtos no Estoque" value="18" sub="6 tipos de produto"  icon={<IconBox width={20} height={20} />}     color="terra"   />
        <StatCard label="Produção Hoje"        value="47" sub="unidades produzidas" icon={<IconFactory width={20} height={20} />} color="verde"   />
        <StatCard label="Vencimentos Próximos" value="5"  sub="nos próximos 3 dias" icon={<IconClock width={20} height={20} />}   color="amarelo" />
      </div>

      <div className="dash-grid">
        {/* Alertas críticos */}
        <div className="dash-panel">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconAlertTriangle width={16} height={16} /> Alertas Críticos
          </h4>
          {alertas.map((a) => {
            const Icon = alertaIcons[a.icon] || IconAlertTriangle
            return (
              <div key={a.id} className={`alerta-item ${a.tipo}`}>
                <div className="alerta-icon"><Icon width={16} height={16} /></div>
                <div className="alerta-text">
                  <strong>{a.titulo}</strong>
                  <span>{a.desc}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Produtos acabados */}
        <div className="dash-panel">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconBox width={16} height={16} /> Estoque de Produtos Acabados
          </h4>
          <ul className="mini-list">
            {produtosEstoque.map((p, i) => (
              <li key={i}>
                <span>{p.nome}</span>
                <Tag type={p.status}>{p.qtd}</Tag>
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
            {insumosNivel.map((ins, i) => (
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
            {ultimasProducoes.map((p, i) => (
              <li key={i}>
                <span>{p.produto}</span>
                <span className="qtd">{p.quando}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}