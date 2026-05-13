import { useApp } from '../context/AppContext'
import { receitas, fichaDetalhe } from '../data/mockData'

export default function Receitas() {
  const { showToast } = useApp()

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Fichas Técnicas</h3>
        <button className="btn btn-primary" onClick={() => showToast('📋 Em breve!')}>
          + Nova Ficha
        </button>
      </div>

      <div className="prod-cards">
        {receitas.map(r => (
          <div
            key={r.id}
            className="prod-card"
            onClick={() => showToast(`📋 Ficha de ${r.produto} aberta!`)}
          >
            <div className="prod-card-icon">{r.icon}</div>
            <h4>{r.produto}</h4>
            <p>{r.insumos} insumos · Custo: R$ {r.custo.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Insumo</th>
              <th>Quantidade / Unidade</th>
              <th>Unidade</th>
            </tr>
          </thead>
          <tbody>
            {fichaDetalhe.map((row, i) => (
              <tr key={i}>
                <td><strong>{row.produto}</strong></td>
                <td>{row.insumo}</td>
                <td>{row.qtd}</td>
                <td>{row.unidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}