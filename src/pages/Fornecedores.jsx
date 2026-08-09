import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'

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

export default function Fornecedores() {
  const [modalAberto, setModalAberto] = useState(false)
  const [fornecedorEditando, setFornecedorEditando] = useState(null)
  const [fornData, setFornData] = useState([])

  const carregarFornecedores = async () => {
    const res = await fetch('http://localhost:3000/api/fornecedor')
    const data = await res.json()
    setFornData(data)
  }

  useEffect(() => {
    carregarFornecedores()
  }, [])

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Fornecedores</h3>
        <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
          + Novo Fornecedor
        </button>
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
            {fornData.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--cinza)' }}>
                  Nenhum fornecedor cadastrado
                </td>
              </tr>
            ) : (
              fornData.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.nome}</strong></td>
                  <td>{f.cnpj}</td>
                  <td>{f.telefone}</td>
                  <td>{f.insumos}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setFornecedorEditando(f)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
    </div>
  )
}