import { useState } from 'react'
import Tag from '../components/ui/Tag'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { produtos as produtosData } from '../data/mockData'

function ModalNovoProduto({ onClose }) {
  const { showToast } = useApp()
  const salvar = () => { onClose(); showToast('✅ Produto cadastrado com sucesso!') }
  return (
    <Modal title="📦 Cadastrar Produto" onClose={onClose}>
      <div className="form-group">
        <label>Nome do Produto</label>
        <input type="text" placeholder="Ex: Pizza Marguerita 35cm" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Tipo</label>
          <select>
            {['Pizza','Lasanha','Massa','Outro'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Unidade</label>
          <select>
            {['unidade','kg','g'].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Preço de Venda (R$)</label>
          <input type="number" step="0.01" placeholder="0,00" />
        </div>
        <div className="form-group">
          <label>Qtd. Estoque Inicial</label>
          <input type="number" placeholder="0" />
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={salvar}>Salvar</button>
      </div>
    </Modal>
  )
}

const tipoTag = { Pizza: 'pizza', Lasanha: 'lasanha', Massa: 'massa' }

export default function Produtos() {
  const { showToast } = useApp()
  const [busca, setBusca] = useState('')
  const [modalNovo, setModalNovo] = useState(false)

  const filtrados = produtosData.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.tipo.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="page-fade">
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍  Buscar produto..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <select>
          <option>Todos os tipos</option>
          {['Pizza','Lasanha','Massa'].map(t => <option key={t}>{t}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => setModalNovo(true)}>
          + Novo Produto
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Qtd. Estoque</th>
              <th>Preço Venda</th>
              <th>Custo Estimado</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id}>
                <td><strong>{p.nome}</strong></td>
                <td><Tag type={tipoTag[p.tipo] || 'ok'}>{p.tipo}</Tag></td>
                <td>{p.qtd} un</td>
                <td>R$ {p.preco.toFixed(2)}</td>
                <td>R$ {p.custo.toFixed(2)}</td>
                <td>
                  <Tag type={p.status}>
                    {p.status === 'ok' ? 'OK' : p.status === 'baixo' ? 'Baixo' : 'Crítico'}
                  </Tag>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => showToast('✅ Saída registrada!')}
                  >
                    Saída
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalNovo && <ModalNovoProduto onClose={() => setModalNovo(false)} />}
    </div>
  )
}