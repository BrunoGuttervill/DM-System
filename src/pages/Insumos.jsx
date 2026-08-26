import { useState, useEffect, useMemo } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { fornecedorOptions, categoriaOptions } from '../data/mockData'
import { IconSearch } from '../components/Icons'

function ModalMovimentacao({ insumo, onClose }) {
  const { showToast } = useApp()
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  const iso = local.toISOString().slice(0, 16)

  return (
    <Modal title={`Movimentar — ${insumo.nome}`} onClose={onClose}>
      <div className="form-group">
        <label>Tipo de Movimentação</label>
        <select>
          <option>Entrada (compra / reposição)</option>
          <option>Saída (uso na produção)</option>
          <option>Descarte / perda</option>
          <option>Ajuste de inventário</option>
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
        <textarea rows="3" placeholder="Ex: Compra NF 1234, Uso na produção..." />
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={() => { onClose(); showToast('✅ Movimentação registrada!') }}>Confirmar</button>
      </div>
    </Modal>
  )
}

function ModalNovoInsumo({ onClose, onCriado }) {
  const { showToast } = useApp()
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    qtdAtual: '',
    unidade: 'kg',
    qtdMin: '',
    validade: '',
    fornecedor: ''
  })
  const [errors, setErrors] = useState({})
  const [salvando, setSalvando] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.nome.trim()) newErrors.nome = 'Nome obrigatório'
    if (!formData.categoria) newErrors.categoria = 'Selecione uma categoria'
    if (!formData.qtdAtual || parseFloat(formData.qtdAtual) < 0) newErrors.qtdAtual = 'Quantidade inválida'
    if (!formData.qtdMin || parseFloat(formData.qtdMin) < 0) newErrors.qtdMin = 'Mínimo inválido'
    if (!formData.validade) newErrors.validade = 'Validade obrigatória'
    return newErrors
  }

  const handleSalvar = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast('⚠️ Preencha os campos obrigatórios corretamente')
      return
    }

    setSalvando(true)
    try {
      const res = await fetch('http://localhost:3000/api/insumos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          categoria: formData.categoria,
          qtdAtual: parseFloat(formData.qtdAtual),
          qtdMin: parseFloat(formData.qtdMin),
          unidade: formData.unidade,
          validade: formData.validade,
          fornecedor: formData.fornecedor,
        }),
      })

      if (!res.ok) throw new Error('Falha ao salvar')

      onClose()
      showToast(`✅ ${formData.nome} cadastrado com sucesso!`)
      await onCriado() // recarrega a lista da tela
    } catch (err) {
      showToast('❌ Não foi possível salvar o insumo. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) setErrors({ ...errors, [field]: null })
  }

  return (
    <Modal title="Novo Insumo" onClose={onClose}>
      <div className="form-group">
        <label>Nome do Insumo *</label>
        <input type="text" placeholder="Ex: Farinha 00" value={formData.nome} onChange={e => handleChange('nome', e.target.value)} className={errors.nome ? 'input-error' : ''} />
        {errors.nome && <span className="form-error">{errors.nome}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Categoria *</label>
          <select value={formData.categoria} onChange={e => handleChange('categoria', e.target.value)} className={errors.categoria ? 'input-error' : ''}>
            <option value="">Selecione...</option>
            {categoriaOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.categoria && <span className="form-error">{errors.categoria}</span>}
        </div>
        <div className="form-group">
          <label>Fornecedor Principal</label>
          <select value={formData.fornecedor} onChange={e => handleChange('fornecedor', e.target.value)}>
            <option value="">Selecione...</option>
            {fornecedorOptions.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Quantidade Inicial *</label>
          <input type="number" step="0.01" placeholder="0" value={formData.qtdAtual} onChange={e => handleChange('qtdAtual', e.target.value)} className={errors.qtdAtual ? 'input-error' : ''} />
          {errors.qtdAtual && <span className="form-error">{errors.qtdAtual}</span>}
        </div>
        <div className="form-group">
          <label>Unidade</label>
          <select value={formData.unidade} onChange={e => handleChange('unidade', e.target.value)}>
            <option value="kg">kg</option>
            <option value="litros">litros</option>
            <option value="unidade">unidade</option>
            <option value="rolo">rolo</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Quantidade Mínima *</label>
        <input type="number" step="0.01" placeholder="0" value={formData.qtdMin} onChange={e => handleChange('qtdMin', e.target.value)} className={errors.qtdMin ? 'input-error' : ''} />
        {errors.qtdMin && <span className="form-error">{errors.qtdMin}</span>}
      </div>
      <div className="form-group">
        <label>Validade *</label>
        <input type="date" value={formData.validade} onChange={e => handleChange('validade', e.target.value)} className={errors.validade ? 'input-error' : ''} />
        {errors.validade && <span className="form-error">{errors.validade}</span>}
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className="btn btn-primary" onClick={handleSalvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar Insumo'}
        </button>
      </div>
    </Modal>
  )
}

export default function Insumos() {
  const [busca, setBusca] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [modalNovo, setModalNovo] = useState(false)
  const [movInsumo, setMovInsumo] = useState(null)
  const [insumosData, setInsumosData] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const ITENS_POR_PAGINA = 10

  const carregarInsumos = async () => {
    const res = await fetch('http://localhost:3000/api/insumos')
    const data = await res.json()
    setInsumosData(data)
  }

  useEffect(() => {
    carregarInsumos()
  }, [])

  const categoriasUnicas = useMemo(() => {
    return [...new Set(insumosData.map(i => i.categoria))].sort()
  }, [insumosData])

  const filtrados = insumosData.filter(i => {
    const matchBusca = i.nome.toLowerCase().includes(busca.toLowerCase()) ||
      i.categoria.toLowerCase().includes(busca.toLowerCase())
    const matchCategoria = filtroCategoria === 'todas' || i.categoria === filtroCategoria
    return matchBusca && matchCategoria
  })

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITENS_POR_PAGINA))

  useEffect(() => {
    setPaginaAtual(1)
  }, [busca, filtroCategoria])

  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas)
  }, [totalPaginas, paginaAtual])

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const paginados = filtrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  const formatarValidade = (v) => {
    if (!v) return ''
    const partes = v.split('-')
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Matérias-primas</h3>
        <div className="sec-actions">
          <div className="search-wrap">
            <IconSearch className="search-icon" width={15} height={15} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar insumo..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="todas">Todas as categorias</option>
            {categoriasUnicas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setModalNovo(true)}>
            + Novo Insumo
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Qtd. Atual</th>
              <th>Qtd. Mínima</th>
              <th>Validade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--cinza)' }}>
                  Nenhum insumo encontrado
                </td>
              </tr>
            ) : (
              paginados.map(ins => (
                <tr key={ins.id}>
                  <td><strong>{ins.nome}</strong></td>
                  <td>{ins.categoria}</td>
                  <td>R$ {Number(ins.preco).toFixed(2)} / {ins.unidade}</td>
                  <td>{ins.qtdAtual} {ins.unidade}</td>
                  <td>{ins.qtdMin} {ins.unidade}</td>
                  <td>{formatarValidade(ins.validade)}</td>
                  <td><span className={`tag tag-${ins.status}`}>{ins.status === 'ok' ? 'OK' : ins.status === 'baixo' ? 'Baixo' : 'Crítico'}</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setMovInsumo(ins)}>
                      Movimentar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtrados.length > 0 && (
        <div className="pagination">
          <span className="pagination-info">
            Mostrando {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, filtrados.length)} de {filtrados.length}
          </span>
          <div className="pagination-btns">
            <button
              className="pagination-btn"
              onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
            >
              Anterior
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`pagination-btn ${n === paginaAtual ? 'active' : ''}`}
                onClick={() => setPaginaAtual(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {modalNovo && <ModalNovoInsumo onClose={() => setModalNovo(false)} onCriado={carregarInsumos} />}
      {movInsumo && <ModalMovimentacao insumo={movInsumo} onClose={() => setMovInsumo(null)} />}
    </div>
  )
}