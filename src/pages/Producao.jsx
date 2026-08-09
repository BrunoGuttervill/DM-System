import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { produtoOptions } from '../data/mockData'

function ModalProducao({ onClose, onSucesso }) {

  const [pizzas, setPizzas] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/produtos')
      .then(r => r.json())
      .then(data => setPizzas(data))
  }, [])

  const [pizzaId, setPizzaId] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [observacoes, setObservacoes] = useState('')


  const { showToast } = useApp()
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  const iso = local.toISOString().slice(0, 16)
  const salvar = () => {
    fetch('http://localhost:3000/api/producao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pizzaId, quantidade, responsavel, observacoes })
    })
      .then(async r => {
        const data = await r.json()
        if (r.ok) {
          showToast('✅ Produção registrada! Insumos descontados automaticamente.')
          onClose()
          onSucesso()
        } else {
          showToast('Erro ao registrar produção' + data.error)
        }
      })
  }

  return (
    <Modal title="🏭 Registrar Produção" onClose={onClose}>
      <div className="form-group">
        <label>Produto Fabricado</label>
        <select value={pizzaId} onChange={e => setPizzaId(e.target.value)}>
          <option value="">Selecione um produto...</option>
          {pizzas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Quantidade Produzida</label>
          <input type="number"
            placeholder="0"
            min="1"
            value={quantidade}
            onChange={e => setQuantidade(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Responsável</label>
          <input type="text"
            placeholder="Nome do operador"
            value={responsavel}
            onChange={e => setResponsavel(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Observações</label>
        <textarea rows="2"
          placeholder="Alguma observação sobre esse lote..."
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
        />
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
  const [ordensData, setOrdensData] = useState([])

  const carregarOrdens = () => {
    fetch('http://localhost:3000/api/producao')
      .then(r => r.json())
      .then(data => setOrdensData(data))
  }
  useEffect(() => {
    carregarOrdens()
  }, [])

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
            {ordensData.map(o => (
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

      {modalAberto && <ModalProducao onClose={() => setModalAberto(false)} onSucesso={carregarOrdens} />}
    </div>
  )
}