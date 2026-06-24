import { useState, useEffect } from 'react'
import Tag from '../components/ui/Tag'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { fornecedorOptions, categoriaOptions } from '../data/mockData'

function ModalNovoInsumo({ onClose, onRegistrado }) {
  const { showToast } = useApp()

  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState(categoriaOptions[0])
  const [qtdAtual, setQtdAtual] = useState('')
  const [qtdMin, setQtdMin] = useState('')
  const [unidade, setUnidade] = useState('kg')
  const [validade, setValidade] = useState('')
  const [status, setStatus] = useState('ok')


  const salvar = () => {
    fetch('http://localhost:3000/api/insumos', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        nome: nome,
        categoria: categoria,
        qtdAtual: qtdAtual,
        qtdMin: qtdMin,
        unidade: unidade,
        validade: validade,
        status: 'ok'
      })
    })
      .then(r => r.json())
      .then(() => {
        onRegistrado()
        onClose()
        showToast('Insumo cadastrado com sucesso!')
      })
  }
  return (
    <Modal title="🌾 Cadastrar Insumo" onClose={onClose}>
      <div className="form-row">
        <div className="form-group">
          <label>Nome do Insumo</label>
          <input type="text" placeholder="Ex: Farinha de Trigo"
            value={nome} onChange={e => setNome(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Categoria</label>
          <select
            value={categoria} onChange={e => setCategoria(e.target.value)}
          >
            {categoriaOptions.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Quantidade Atual</label>
          <input type="number" placeholder="0"
            value={qtdAtual} onChange={e => setQtdAtual(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Unidade</label>
          <select
            value={unidade} onChange={e => setUnidade(e.target.value)}
          >
            {['kg', 'g', 'litros', 'ml', 'unidade', 'pacote'].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Quantidade Mínima</label>
          <input type="number" placeholder="0"
            value={qtdMin} onChange={e => setQtdMin(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Data de Validade</label>
          <input type="date"
            value={validade} onChange={e => setValidade(e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Fornecedor</label>
        <select>
          {fornecedorOptions.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={salvar}>Salvar</button>
      </div>
    </Modal>
  )
}

function ModalMovimentacao({ insumo, onClose }) {
  const { showToast } = useApp()
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  const iso = local.toISOString().slice(0, 16)
  const salvar = () => { onClose(); showToast('✅ Movimentação registrada!') }
  return (
    <Modal title={`📦 Movimentar — ${insumo}`} onClose={onClose}>
      <div className="form-group">
        <label>Tipo de Movimentação</label>
        <select>
          {['Entrada (compra / reposição)', 'Saída (uso na produção)', 'Descarte / perda', 'Ajuste de inventário'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Quantidade</label>
          <input type="number" step="0.01" placeholder="0" />
        </div>
        <div className="form-group">
          <label>Data</label>
          <input type="datetime-local" defaultValue={iso} />
        </div>
      </div>
      <div className="form-group">
        <label>Motivo / Observação</label>
        <textarea rows="2" placeholder="Ex: Compra NF 1234, Uso na produção..." />
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={salvar}>Confirmar</button>
      </div>
    </Modal>
  )
}

export default function Insumos() {
  const [busca, setBusca] = useState('')
  const [modalNovo, setModalNovo] = useState(false)
  const [movInsumo, setMovInsumo] = useState(null)
  const [insumosData, setInsumosData] = useState([]);


  const carregarInsumos = () => {
    fetch('http://localhost:3000/api/insumos')
      .then(r => r.json())
      .then(data => {
        setInsumosData(data)
      })
  }

  useEffect(() => {
    carregarInsumos();
  }, [])

  const excluirInsumo = (id) => {
    const confirmou = confirm('Tem certeza que deseja excluir?')
    if (!confirmou) return

    fetch(`http://localhost:3000/api/insumos/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        showToast('Insumo excluído com sucesso!')
        carregarInsumos()
      })
  }

  const filtrados = insumosData.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase()) ||
    i.categoria.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="page-fade">
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍  Buscar insumo..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <select>
          <option>Todas as categorias</option>
          {categoriaOptions.map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => setModalNovo(true)}>
          + Novo Insumo
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Qtd. Atual</th>
              <th>Qtd. Mínima</th>
              <th>Validade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(ins => (
              <tr key={ins.id}>
                <td><strong>{ins.nome}</strong></td>
                <td>{ins.categoria}</td>
                <td>{ins.qtdAtual} {ins.unidade}</td>
                <td>{ins.qtdMin} {ins.unidade}</td>
                <td>{ins.validade}</td>
                <td>
                  <Tag type={ins.status}>
                    {ins.status === 'ok' ? 'OK' : ins.status === 'baixo' ? 'Baixo' : 'Crítico'}
                  </Tag>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setMovInsumo(ins.nome)}
                  >
                    Movimentar
                  </button>
                  <button
                    className='btn btn-secondary btn-sm'
                    onClick={() => excluirInsumo(ins.id)}
                    style={{ marginLeft: '8px' }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalNovo && <ModalNovoInsumo onClose={() => setModalNovo(false)} onRegistrado={carregarInsumos} />}
      {movInsumo && <ModalMovimentacao insumo={movInsumo} onClose={() => setMovInsumo(null)} />}
    </div>
  )
}