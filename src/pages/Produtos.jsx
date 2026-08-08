import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'

const tipoProdutoOptions = ['Pizza', 'Lasanha', 'Massa', 'Salgado', 'Molho', 'Bolacha']

function ModalNovoProduto({ onClose }) {
  const { showToast } = useApp()
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    sabores: '',
    qtd: '',
    precoVarejo: '',
    precoAtacado: ''
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.nome.trim()) newErrors.nome = 'Nome obrigatório'
    if (!formData.tipo) newErrors.tipo = 'Selecione um Tipo'
    if (!formData.sabores.trim()) newErrors.sabores = 'Informe ao menos 1 sabor'
    if (!formData.qtd || parseInt(formData.qtd) < 0) newErrors.qtd = 'Quantidade inválida'
    if (!formData.precoVarejo || parseFloat(formData.precoVarejo) <= 0) newErrors.precoVarejo = 'Preço inválido'
    if (!formData.precoAtacado || parseFloat(formData.precoAtacado) <= 0) newErrors.precoAtacado = 'Preço inválido'
    return newErrors
  }

  const handleSalvar = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast('⚠️ Preencha os campos obrigatórios corretamente')
      return
    }
    const saboresArray = formData.sabores.split(',').map(s => s.trim()).filter(s => s)
    if (saboresArray.length === 0) {
      setErrors({ ...errors, sabores: 'Informe ao menos 1 sabor válido' })
      return
    }
    onClose()
    showToast(`✅ ${formData.nome} cadastrada com sucesso!`)
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) setErrors({ ...errors, [field]: null })
  }

  return (
    <Modal title=" Nova Pizza" onClose={onClose}>
      <div className="form-group">
        <label>Nome da Pizza *</label>
        <input type="text" placeholder="Ex: Calabresa" value={formData.nome} onChange={e => handleChange('nome', e.target.value)} className={errors.nome ? 'input-error' : ''} />
        {errors.nome && <span className="form-error">{errors.nome}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>tipo *</label>
          <select value={formData.tipo} onChange={e => handleChange('tipo', e.target.value)} className={errors.tipo ? 'input-error' : ''}>
            <option value="">Selecione...</option>
            {tipoProdutoOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.tipo && <span className="form-error">{errors.tipo}</span>}
        </div>
        <div className="form-group">
          <label>Quantidade em Estoque *</label>
          <input type="number" placeholder="0" value={formData.qtd} onChange={e => handleChange('qtd', e.target.value)} className={errors.qtd ? 'input-error' : ''} />
          {errors.qtd && <span className="form-error">{errors.qtd}</span>}
        </div>
      </div>
      <div className="form-group">
        <label>Sabores * <span style={{ color: 'var(--cinza)', fontWeight: 400 }}>(separe por vírgula)</span></label>
        <input type="text" placeholder="Ex: Calabresa, Cebola, Azeitona" value={formData.sabores} onChange={e => handleChange('sabores', e.target.value)} className={errors.sabores ? 'input-error' : ''} />
        {errors.sabores && <span className="form-error">{errors.sabores}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Preço Varejo (R$) *</label>
          <input type="number" step="0.01" placeholder="0.00" value={formData.precoVarejo} onChange={e => handleChange('precoVarejo', e.target.value)} className={errors.precoVarejo ? 'input-error' : ''} />
          {errors.precoVarejo && <span className="form-error">{errors.precoVarejo}</span>}
        </div>
        <div className="form-group">
          <label>Preço Atacado (R$) *</label>
          <input type="number" step="0.01" placeholder="0.00" value={formData.precoAtacado} onChange={e => handleChange('precoAtacado', e.target.value)} className={errors.precoAtacado ? 'input-error' : ''} />
          {errors.precoAtacado && <span className="form-error">{errors.precoAtacado}</span>}
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={handleSalvar}>Cadastrar Pizza</button>
      </div>
    </Modal>
  )
}

export default function Produtos() {
  const { showToast } = useApp()
  const [modalNovo, setModalNovo] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [produtosData, setProdutosData] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/produtos')
      .then(r => r.json())
      .then(data => setProdutosData(data))
  }, [])

  const filtrados = produtosData.filter(p => filtroStatus === 'todos' || p.status === filtroStatus)

  const stats = {
    total: produtosData.length,
    ok: produtosData.filter(p => p.status === 'ok').length,
    baixo: produtosData.filter(p => p.status === 'baixo').length,
    critico: produtosData.filter(p => p.status === 'critico').length,
  }

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Produtos Acabados</h3>
        <button className="btn btn-primary" onClick={() => setModalNovo(true)}>
          + Nova Pizza
        </button>
      </div>

      <div className="stat-cards" style={{ marginBottom: '1rem' }}>
        <button className={`stat-filter ${filtroStatus === 'todos' ? 'active' : ''}`} onClick={() => setFiltroStatus('todos')}>
          <span>Todos</span><strong>{stats.total}</strong>
        </button>
        <button className={`stat-filter ${filtroStatus === 'ok' ? 'active' : ''}`} onClick={() => setFiltroStatus('ok')}>
          <span>✓ Ok</span><strong>{stats.ok}</strong>
        </button>
        <button className={`stat-filter ${filtroStatus === 'baixo' ? 'active' : ''}`} onClick={() => setFiltroStatus('baixo')}>
          <span>⚠ Baixo</span><strong>{stats.baixo}</strong>
        </button>
        <button className={`stat-filter ${filtroStatus === 'critico' ? 'active' : ''}`} onClick={() => setFiltroStatus('critico')}>
          <span>🔴 Crítico</span><strong>{stats.critico}</strong>
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Sabores</th>
              <th>Qtd. Estoque</th>
              <th>Preço Varejo</th>
              <th>Preço Atacado</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--cinza)' }}>
                  Nenhum produto encontrado
                </td>
              </tr>
            ) : (
              filtrados.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nome}</strong></td>
                  <td>{p.tipo}</td>
                  <td style={{ color: 'var(--cinza)', fontSize: '0.85rem' }}>{Array.isArray(p.sabores) ? p.sabores.join(', ') : p.sabores}</td>
                  <td><strong>{p.qtd} un</strong></td>
                  <td>R$ {Number(p.precoVarejo).toFixed(2)}</td>
                  <td>R$ {Number(p.precoAtacado).toFixed(2)}</td>
                  <td><span className={`tag tag-${p.status}`}>{p.status === 'ok' ? 'OK' : p.status === 'baixo' ? 'Baixo' : 'Crítico'}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalNovo && <ModalNovoProduto onClose={() => setModalNovo(false)} />}
    </div>
  )
}