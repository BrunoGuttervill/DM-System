import { useState } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { ordens, produtoOptions } from '../data/mockData'

function ModalProducao({ onClose }) {
  const { showToast } = useApp()
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  const iso = local.toISOString().slice(0, 16)
  const salvar = () => { onClose(); showToast('✅ Produção registrada! Insumos descontados automaticamente.') }

  return (
    <Modal title="🏭 Registrar Produção" onClose={onClose}>
      <div className="form-group">
        <label>Produto Fabricado</label>
        <select>
          {produtoOptions.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Quantidade Produzida</label>
          <input type="number" placeholder="0" min="1" />
        </div>
        <div className="form-group">
          <label>Responsável</label>
          <input type="text" placeholder="Nome do operador" />
        </div>
      </div>
      <div className="form-group">
        <label>Data e Hora</label>
        <input type="datetime-local" defaultValue={iso} />
      </div>
      <div className="form-group">
        <label>Observações</label>
        <textarea rows="2" placeholder="Alguma observação sobre esse lote..." />
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn btn-terra" onClick={salvar}>Registrar</button>
      </div>
    </Modal>
  )
}

export default function Producao() {
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Ordens de Produção</h3>
        <button className="btn btn-terra" onClick={() => setModalAberto(true)}>
          🏭 Registrar Produção
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Data / Hora</th>
              <th>Produto</th>
              <th>Qtd. Produzida</th>
              <th>Responsável</th>
              <th>Insumos Consumidos</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map(o => (
              <tr key={o.id}>
                <td>{o.data}</td>
                <td>{o.produto}</td>
                <td><strong>{o.qtd} un</strong></td>
                <td>{o.responsavel}</td>
                <td style={{ color: 'var(--cinza)', fontSize: '0.82rem' }}>{o.insumos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && <ModalProducao onClose={() => setModalAberto(false)} />}
    </div>
  )
}