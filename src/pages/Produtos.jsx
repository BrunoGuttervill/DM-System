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
        <input type="text" placeholder="Ex: Pizza Tradicional" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Tipo</label>
          <select>
            {['Pizza','Lasanha','Massa','Salgado','Molho','Bolacha','Outro'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Unidade</label>
          <select>
            {['unidade','kg','g','pct 500g'].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Preço Varejo (R$)</label>
          <input type="number" step="0.01" placeholder="0,00" />
        </div>
        <div className="form-group">
          <label>Preço Atacado (R$)</label>
          <input type="number" step="0.01" placeholder="0,00" />
        </div>
      </div>
      <div className="form-group">
        <label>Sabores disponíveis</label>
        <textarea rows="3" placeholder="Ex: Calabresa, Frango, Quatro Queijos..." />
      </div>
      <div className="form-group">
        <label>Qtd. Estoque Inicial</label>
        <input type="number" placeholder="0" />
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={salvar}>Salvar</button>
      </div>
    </Modal>
  )
}

function ModalSabores({ produto, onClose }) {
  return (
    <Modal title={`${produto.nome} — Sabores`} onClose={onClose}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          <div style={{ background: '#f7edd8', borderRadius: 10, padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--cinza)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Varejo</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--vinho)', fontFamily: 'Playfair Display, serif' }}>
              {produto.precoVarejo > 0 ? `R$ ${produto.precoVarejo.toFixed(2)}` : '—'}
            </div>
          </div>
          <div style={{ background: '#f7edd8', borderRadius: 10, padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--cinza)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Atacado</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--terra)', fontFamily: 'Playfair Display, serif' }}>
              {produto.precoAtacado > 0 ? `R$ ${produto.precoAtacado.toFixed(2)}` : '—'}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--cinza)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
          Sabores disponíveis ({produto.sabores.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {produto.sabores.map((s, i) => (
            <span key={i} style={{
              background: 'var(--creme2)', color: 'var(--texto)',
              padding: '5px 12px', borderRadius: 20, fontSize: '0.83rem', fontWeight: 500,
            }}>{s}</span>
          ))}
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-primary" onClick={onClose}>Fechar</button>
      </div>
    </Modal>
  )
}

const tipoTag = { Pizza: 'pizza', Lasanha: 'lasanha', Massa: 'massa', Salgado: 'pizza', Molho: 'lasanha', Bolacha: 'massa' }

export default function Produtos() {
  const [busca, setBusca] = useState('')
  const [modalNovo, setModalNovo] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)

  const filtrados = produtosData.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.tipo.toLowerCase().includes(busca.toLowerCase()) ||
    p.sabores.some(s => s.toLowerCase().includes(busca.toLowerCase()))
  )

  return (
    <div className="page-fade">
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍  Buscar produto ou sabor..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <select>
          <option>Todos os tipos</option>
          {['Pizza','Lasanha','Massa','Salgado','Molho','Bolacha'].map(t => <option key={t}>{t}</option>)}
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
              <th>Sabores</th>
              <th>Estoque</th>
              <th>Preço Varejo</th>
              <th>Preço Atacado</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id}>
                <td><strong>{p.nome}</strong></td>
                <td><Tag type={tipoTag[p.tipo] || 'ok'}>{p.tipo}</Tag></td>
                <td>
                  <span
                    onClick={() => setProdutoSelecionado(p)}
                    style={{ cursor: 'pointer', color: 'var(--terra)', fontWeight: 600, fontSize: '0.83rem' }}
                  >
                    {p.sabores.length} {p.sabores.length === 1 ? 'sabor' : 'sabores'} 👁
                  </span>
                </td>
                <td>{p.qtd} un</td>
                <td style={{ fontWeight: 600 }}>
                  {p.precoVarejo > 0 ? `R$ ${p.precoVarejo.toFixed(2)}` : '—'}
                </td>
                <td style={{ color: 'var(--cinza)' }}>
                  {p.precoAtacado > 0 ? `R$ ${p.precoAtacado.toFixed(2)}` : '—'}
                </td>
                <td>
                  <Tag type={p.status}>
                    {p.status === 'ok' ? 'OK' : p.status === 'baixo' ? 'Baixo' : 'Crítico'}
                  </Tag>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setProdutoSelecionado(p)}
                  >
                    Ver sabores
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalNovo && <ModalNovoProduto onClose={() => setModalNovo(false)} />}
      {produtoSelecionado && (
        <ModalSabores produto={produtoSelecionado} onClose={() => setProdutoSelecionado(null)} />
      )}
    </div>
  )
}