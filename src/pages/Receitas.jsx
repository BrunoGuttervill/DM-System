import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { IconTrash } from '../components/Icons'

const unidadeOptions = ['kg', 'g', 'litros', 'ml', 'unidade']

let proximoLinhaId = 1
function novaLinha() {
  return { id: proximoLinhaId++, insumoId: '', qtd: '', unidade: 'kg' }
}

function ModalNovaFicha({ onClose }) {
  const { showToast } = useApp()
  const [custo, setCusto] = useState('')
  const [linhas, setLinhas] = useState([novaLinha(), novaLinha()])
  const [errors, setErrors] = useState({})
  const [pizzas, setPizzas] = useState([])
  const [insumosData, setInsumosData] = useState([])
  const [pizzaId, setPizzaId] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/produtos')
      .then(r => r.json())
      .then(data => setPizzas(data))

    fetch('http://localhost:3000/api/insumos')
      .then(r => r.json())
      .then(data => setInsumosData(data))
  }, []);

  const atualizarLinha = (id, campo, valor) => {
    setLinhas(linhas.map(l => l.id === id ? { ...l, [campo]: valor } : l))
  }

  const adicionarLinha = () => setLinhas([...linhas, novaLinha()])

  const removerLinha = (id) => {
    if (linhas.length === 1) return
    setLinhas(linhas.filter(l => l.id !== id))
  }

  const validate = () => {
    const newErrors = {}
    if (!pizzaId) newErrors.produto = 'Selecione um produto'
    if (!custo || parseFloat(custo) <= 0) newErrors.custo = 'Custo inválido'

    const linhasValidas = linhas.filter(l => l.insumoId && l.qtd && parseFloat(l.qtd) > 0)
    if (linhasValidas.length === 0) newErrors.linhas = 'Adicione ao menos um insumo com quantidade'

    return newErrors
  }

  const getUnidadesBase = (insumoId) => {
    const insumo = insumosData.find(i => i.id === parseInt(insumoId))
    return insumo ? insumo.unidadeBase : ''
  }

  const handleSalvar = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast('⚠️ Preencha os campos obrigatórios corretamente')
      return
    }

    const ingredientes = linhas
      .filter(l => l.insumoId && l.qtd && parseFloat(l.qtd) > 0)
      .map(l => {
        const unidadeBase = getUnidadesBase(l.insumoId)
        let qtd = parseFloat(l.qtd)
        if (l.unidade === 'g' || l.unidade === 'ml') {
          qtd = qtd / 1000
        }

        return {
          insumoId: parseInt(l.insumoId),
          qtdPorUnidade: qtd,
          unidade: unidadeBase
        }
      })




    try {
      const res = await fetch('http://localhost:3000/api/receitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pizzaId: parseInt(pizzaId),
          custo: parseFloat(custo),
          ingredientes,
        })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'falha ao salvar')
      }
      onClose()
      showToast(` Ficha técnica de ${pizzaId} criada com sucesso!`)
    } catch (err) {
      console.error(err)
      showToast(` Erro ao salvar ficha técnica: ${err.message}`)
    }
  }



  const linhasComErro = errors.linhas

  return (
    <Modal title="Nova Ficha Técnica" onClose={onClose}>
      <div className="form-group">
        <label>Produto *</label>
        <select
          value={pizzaId}
          onChange={e => { setPizzaId(e.target.value); if (errors.produto) setErrors({ ...errors, produto: null }) }}
          className={errors.produto ? 'input-error' : ''}
        >
          <option value="">Selecione o produto...</option>
          {pizzas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        {errors.produto && <span className="form-error">{errors.produto}</span>}
      </div>

      <div className="form-group">
        <label>Custo Estimado da Ficha (R$) *</label>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={custo}
          onChange={e => { setCusto(e.target.value); if (errors.custo) setErrors({ ...errors, custo: null }) }}
          className={errors.custo ? 'input-error' : ''}
        />
        {errors.custo && <span className="form-error">{errors.custo}</span>}
      </div>

      <div className="form-group">
        <label>Insumos da Ficha *</label>
        <div style={s.linhasWrap}>
          {linhas.map((l) => (
            <div key={l.id} style={s.linhaInsumo}>
              <select
                value={l.insumoId}
                onChange={e => atualizarLinha(l.id, 'insumoId', e.target.value)}
                style={s.selectInsumo}
              >
                <option value="">Selecione o insumo...</option>
                {insumosData.map(ins => <option key={ins.id} value={ins.id}>{ins.nome}</option>)}
              </select>
              <input
                type="number"
                step="0.001"
                placeholder="Qtd."
                value={l.qtd}
                onChange={e => atualizarLinha(l.id, 'qtd', e.target.value)}
                style={s.inputQtd}
              />
              <select
                value={l.unidade}
                onChange={e => atualizarLinha(l.id, 'unidade', e.target.value)}
                style={s.selectUnidade}
              >
                {unidadeOptions.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <button
                type="button"
                onClick={() => removerLinha(l.id)}
                style={s.btnRemover}
                title="Remover insumo"
                disabled={linhas.length === 1}
              >
                <IconTrash width={14} height={14} />
              </button>
            </div>
          ))}
        </div>
        {linhasComErro && <span className="form-error">{linhasComErro}</span>}
        <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={adicionarLinha}>
          + Adicionar insumo
        </button>
      </div>

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={handleSalvar}>Salvar Ficha</button>
      </div>
    </Modal>
  )
}

function ModalEditarFicha({ ficha, onClose, onSucesso }) {
  const { showToast } = useApp()
  const [custo, setCusto] = useState(String(ficha.custo))
  const [linhas, setLinhas] = useState([])
  const [insumosData, setInsumosData] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // busca a lista de insumos (pro select)
    fetch('http://localhost:3000/api/insumos')
      .then(r => r.json())
      .then(data => setInsumosData(data))

    // busca os itens ATUAIS desta ficha (pré-preenchimento)
    fetch(`http://localhost:3000/api/receitas/${ficha.pizzaId}`)
      .then(r => r.json())
      .then(data => {
        const linhasCarregadas = data.map(item => ({
          id: proximoLinhaId++,
          insumoId: String(item.insumoId),
          qtd: String(item.qtdPorUnidade),
          unidade: item.unidade || 'kg'
        }))
        setLinhas(linhasCarregadas.length > 0 ? linhasCarregadas : [novaLinha()])
        setCarregando(false)
      })
  }, [])

  const atualizarLinha = (id, campo, valor) => {
    setLinhas(linhas.map(l => l.id === id ? { ...l, [campo]: valor } : l))
  }

  const adicionarLinha = () => setLinhas([...linhas, novaLinha()])

  const removerLinha = (id) => {
    if (linhas.length === 1) return
    setLinhas(linhas.filter(l => l.id !== id))
  }

  const handleSalvar = async () => {
    const newErrors = {}
    if (!custo || parseFloat(custo) <= 0) newErrors.custo = 'Custo inválido'
    const linhasValidas = linhas.filter(l => l.insumoId && l.qtd && parseFloat(l.qtd) > 0)
    if (linhasValidas.length === 0) newErrors.linhas = 'Adicione ao menos um insumo com quantidade'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast('⚠️ Preencha os campos obrigatórios corretamente')
      return
    }

    const ingredientes = linhasValidas.map(l => {
      let qtd = parseFloat(l.qtd)
      if (l.unidade === 'g' || l.unidade === 'ml') {
        qtd = qtd / 1000
      }
      return {
        insumoId: parseInt(l.insumoId),
        qtdPorUnidade: qtd
      }
    })

    try {
      const res = await fetch(`http://localhost:3000/api/receitas/${ficha.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custo: parseFloat(custo), ingredientes })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'falha ao salvar')
      }
      onClose()
      showToast('✅ Ficha técnica atualizada com sucesso!')
      onSucesso()
    } catch (err) {
      console.error(err)
      showToast(`❌ Erro ao atualizar: ${err.message}`)
    }
  }

  return (
    <Modal title={`Editar Ficha — ${ficha.produtoNome}`} onClose={onClose}>
      {carregando ? (
        <p style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)' }}>Carregando...</p>
      ) : (
        <>
          <div className="form-group">
            <label>Custo Estimado da Ficha (R$) *</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={custo}
              onChange={e => { setCusto(e.target.value); if (errors.custo) setErrors({ ...errors, custo: null }) }}
              className={errors.custo ? 'input-error' : ''}
            />
            {errors.custo && <span className="form-error">{errors.custo}</span>}
          </div>

          <div className="form-group">
            <label>Insumos da Ficha *</label>
            <div style={s.linhasWrap}>
              {linhas.map((l) => (
                <div key={l.id} style={s.linhaInsumo}>
                  <select
                    value={l.insumoId}
                    onChange={e => atualizarLinha(l.id, 'insumoId', e.target.value)}
                    style={s.selectInsumo}
                  >
                    <option value="">Selecione o insumo...</option>
                    {insumosData.map(ins => <option key={ins.id} value={ins.id}>{ins.nome}</option>)}
                  </select>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Qtd."
                    value={l.qtd}
                    onChange={e => atualizarLinha(l.id, 'qtd', e.target.value)}
                    style={s.inputQtd}
                  />
                  <select
                    value={l.unidade}
                    onChange={e => atualizarLinha(l.id, 'unidade', e.target.value)}
                    style={s.selectUnidade}
                  >
                    {unidadeOptions.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => removerLinha(l.id)}
                    style={s.btnRemover}
                    title="Remover insumo"
                    disabled={linhas.length === 1}
                  >
                    <IconTrash width={14} height={14} />
                  </button>
                </div>
              ))}
            </div>
            {errors.linhas && <span className="form-error">{errors.linhas}</span>}
            <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={adicionarLinha}>
              + Adicionar insumo
            </button>
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSalvar}>Salvar Alterações</button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default function Receitas() {
  const [modalNovaFicha, setModalNovaFicha] = useState(false)
  const [fichas, setFichas] = useState([])
  const [fichaEditando, setFichaEditando] = useState(null)

  const carregarFichas = () => {
    fetch('http://localhost:3000/api/receitas')
      .then(r => r.json())
      .then(data => setFichas(data))
  }

  useEffect(() => {
    carregarFichas()
  }, [])

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Fichas Técnicas</h3>
        <button className="btn btn-terra" onClick={() => setModalNovaFicha(true)}>
          + Nova Ficha
        </button>
      </div>

      <div className="fichas-grid">
        {fichas.map(f => (
          <div key={f.id} className="ficha-card">
            <div className="ficha-card-head">
              <span className="ficha-card-nome">{f.produtoNome}</span>
              <span className="ficha-card-badge">{f.totalInsumos} itens</span>
            </div>
            <p className="ficha-card-custo">
              Custo estimado: <strong>R$ {Number(f.custo).toFixed(2)}</strong>
            </p>
            <button 
              className="btn btn-secondary btn-sm"
              style ={{ marginTop: 10 }}
              onClick={() => setFichaEditando(f)}
            >
              Editar
            </button>
          
          </div>
        ))}
      </div>

      {modalNovaFicha && <ModalNovaFicha onClose={() => setModalNovaFicha(false)} onSucesso={carregarFichas} />}
        {fichaEditando && (<ModalEditarFicha ficha={fichaEditando} onClose={() => setFichaEditando(null)} onSucesso={carregarFichas} />)}
    </div>
  )
}

const s = {
  linhasWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  linhaInsumo: {
    display: 'grid',
    gridTemplateColumns: '1fr 90px 100px 32px',
    gap: 8,
    alignItems: 'center',
  },
  selectInsumo: {
    padding: '8px 10px',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.84rem',
    color: 'var(--texto)',
    background: 'var(--bg-input)',
    outline: 'none',
    minWidth: 0,
  },
  inputQtd: {
    padding: '8px 10px',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.84rem',
    color: 'var(--texto)',
    background: 'var(--bg-input)',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  selectUnidade: {
    padding: '8px 10px',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.84rem',
    color: 'var(--texto)',
    background: 'var(--bg-input)',
    outline: 'none',
  },
  btnRemover: {
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--vermelho)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
}