import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { IconTrash, IconSearch } from '../components/Icons'

function useFormFornecedor(inicial) {
  const [formData, setFormData] = useState(inicial)
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: null }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.nome.trim()) newErrors.nome = 'Nome obrigatório'
    if (!formData.cnpj.trim()) newErrors.cnpj = 'CNPJ obrigatório'
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone obrigatório'
    return newErrors
  }

  return { formData, setFormData, errors, setErrors, handleChange, validate }
}

function ModalFornecedor({ onClose, onSalvo }) {
  const { showToast } = useApp()
  const { formData, errors, setErrors, handleChange, validate } = useFormFornecedor({
    nome: '', cnpj: '', telefone: '', email: '', insumos: '',
  })
  const [salvando, setSalvando] = useState(false)

  const salvar = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast('⚠️ Preencha os campos obrigatórios corretamente')
      return
    }
    setSalvando(true)
    try {
      const res = await fetch('http://localhost:3000/api/fornecedor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      onClose()
      showToast('✅ Fornecedor cadastrado!')
      await onSalvo()
    } catch (err) {
      showToast('❌ Não foi possível cadastrar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal title="Cadastrar Fornecedor" onClose={onClose}>
      <div className="form-group">
        <label>Nome da Empresa *</label>
        <input
          type="text" placeholder="Ex: Moinho São João"
          value={formData.nome} onChange={e => handleChange('nome', e.target.value)}
          className={errors.nome ? 'input-error' : ''}
        />
        {errors.nome && <span className="form-error">{errors.nome}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>CNPJ *</label>
          <input
            type="text" placeholder="00.000.000/0000-00"
            value={formData.cnpj} onChange={e => handleChange('cnpj', e.target.value)}
            className={errors.cnpj ? 'input-error' : ''}
          />
          {errors.cnpj && <span className="form-error">{errors.cnpj}</span>}
        </div>
        <div className="form-group">
          <label>Telefone *</label>
          <input
            type="text" placeholder="(41) 99999-0000"
            value={formData.telefone} onChange={e => handleChange('telefone', e.target.value)}
            className={errors.telefone ? 'input-error' : ''}
          />
          {errors.telefone && <span className="form-error">{errors.telefone}</span>}
        </div>
      </div>
      <div className="form-group">
        <label>E-mail</label>
        <input
          type="email" placeholder="contato@fornecedor.com"
          value={formData.email} onChange={e => handleChange('email', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Insumos Fornecidos</label>
        <textarea
          rows="2" placeholder="Ex: Farinha de Trigo, Semolina..."
          value={formData.insumos} onChange={e => handleChange('insumos', e.target.value)}
        />
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className="btn btn-primary" onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </Modal>
  )
}

function ModalEditarFornecedor({ fornecedor, onClose, onSalvo }) {
  const { showToast } = useApp()
  const { formData, errors, setErrors, handleChange, validate } = useFormFornecedor({
    nome: fornecedor.nome || '',
    cnpj: fornecedor.cnpj || '',
    telefone: fornecedor.telefone || '',
    email: fornecedor.email || '',
    insumos: fornecedor.insumos || '',
  })
  const [salvando, setSalvando] = useState(false)

  const salvar = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast('⚠️ Preencha os campos obrigatórios corretamente')
      return
    }
    setSalvando(true)
    try {
      const res = await fetch(`http://localhost:3000/api/fornecedor/${fornecedor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      onClose()
      showToast(`✅ ${formData.nome} atualizado com sucesso!`)
      await onSalvo()
    } catch (err) {
      showToast('❌ Não foi possível salvar as alterações. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal title={`Editar — ${fornecedor.nome}`} onClose={onClose}>
      <div className="form-group">
        <label>Nome da Empresa *</label>
        <input
          type="text"
          value={formData.nome} onChange={e => handleChange('nome', e.target.value)}
          className={errors.nome ? 'input-error' : ''}
        />
        {errors.nome && <span className="form-error">{errors.nome}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>CNPJ *</label>
          <input
            type="text"
            value={formData.cnpj} onChange={e => handleChange('cnpj', e.target.value)}
            className={errors.cnpj ? 'input-error' : ''}
          />
          {errors.cnpj && <span className="form-error">{errors.cnpj}</span>}
        </div>
        <div className="form-group">
          <label>Telefone *</label>
          <input
            type="text"
            value={formData.telefone} onChange={e => handleChange('telefone', e.target.value)}
            className={errors.telefone ? 'input-error' : ''}
          />
          {errors.telefone && <span className="form-error">{errors.telefone}</span>}
        </div>
      </div>
      <div className="form-group">
        <label>E-mail</label>
        <input
          type="email"
          value={formData.email} onChange={e => handleChange('email', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Insumos Fornecidos</label>
        <textarea
          rows="2"
          value={formData.insumos} onChange={e => handleChange('insumos', e.target.value)}
        />
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className="btn btn-primary" onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </Modal>
  )
}

function ModalConfirmarExclusao({ fornecedor, onClose, onExcluido }) {
  const { showToast } = useApp()
  const [excluindo, setExcluindo] = useState(false)

  const confirmar = async () => {
    setExcluindo(true)
    try {
      const res = await fetch(`http://localhost:3000/api/fornecedor/${fornecedor.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao excluir')
      onClose()
      showToast('🗑️ Fornecedor excluído.')
      await onExcluido()
    } catch (err) {
      showToast('❌ Não foi possível excluir. Tente novamente.')
      setExcluindo(false)
    }
  }

  return (
    <Modal title="Excluir fornecedor?" onClose={onClose}>
      <p style={{ fontSize: '0.9rem', color: 'var(--texto)', lineHeight: 1.6, marginBottom: 8 }}>
        Tem certeza que deseja excluir <strong>{fornecedor.nome}</strong>? Essa ação não pode ser desfeita.
      </p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={excluindo}>Cancelar</button>
        <button className="btn btn-danger" onClick={confirmar} disabled={excluindo}>
          {excluindo ? 'Excluindo...' : 'Sim, excluir'}
        </button>
      </div>
    </Modal>
  )
}

export default function Fornecedores() {
  const [modalAberto, setModalAberto] = useState(false)
  const [fornecedorEditando, setFornecedorEditando] = useState(null)
  const [fornecedorExcluindo, setFornecedorExcluindo] = useState(null)
  const [fornData, setFornData] = useState([])
  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const ITENS_POR_PAGINA = 10

  const carregarFornecedores = async () => {
    const res = await fetch('http://localhost:3000/api/fornecedor')
    const data = await res.json()
    setFornData(data)
  }

  useEffect(() => {
    carregarFornecedores()
  }, [])

  const termo = busca.toLowerCase()
  const fornFiltrados = fornData.filter(f =>
    !termo ||
    f.nome.toLowerCase().includes(termo) ||
    (f.cnpj || '').toLowerCase().includes(termo) ||
    (f.insumos || '').toLowerCase().includes(termo)
  )

  const totalPaginas = Math.max(1, Math.ceil(fornFiltrados.length / ITENS_POR_PAGINA))

  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas)
  }, [totalPaginas, paginaAtual])

  useEffect(() => {
    setPaginaAtual(1)
  }, [busca])

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const fornPaginados = fornFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Fornecedores</h3>
        <div className="sec-actions">
          <div className="search-wrap">
            <IconSearch className="search-icon" width={15} height={15} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar fornecedor..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
            + Novo Fornecedor
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Telefone</th>
              <th>Insumos Fornecidos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--cinza)' }}>
                  {fornData.length === 0 ? 'Nenhum fornecedor cadastrado' : 'Nenhum fornecedor encontrado'}
                </td>
              </tr>
            ) : (
              fornPaginados.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.nome}</strong></td>
                  <td>{f.cnpj}</td>
                  <td>{f.telefone}</td>
                  <td>{f.insumos}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setFornecedorEditando(f)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--vermelho)' }}
                        onClick={() => setFornecedorExcluindo(f)}
                        title="Excluir"
                      >
                        <IconTrash width={14} height={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {fornFiltrados.length > 0 && (
        <div className="pagination">
          <span className="pagination-info">
            Mostrando {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, fornFiltrados.length)} de {fornFiltrados.length}
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

      {modalAberto && (
        <ModalFornecedor onClose={() => setModalAberto(false)} onSalvo={carregarFornecedores} />
      )}
      {fornecedorEditando && (
        <ModalEditarFornecedor
          fornecedor={fornecedorEditando}
          onClose={() => setFornecedorEditando(null)}
          onSalvo={carregarFornecedores}
        />
      )}
      {fornecedorExcluindo && (
        <ModalConfirmarExclusao
          fornecedor={fornecedorExcluindo}
          onClose={() => setFornecedorExcluindo(null)}
          onExcluido={carregarFornecedores}
        />
      )}
    </div>
  )
}