import { useState } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { receitas, fichaDetalhe, insumos, produtoOptions } from '../data/mockData'
import { IconTrash } from '../components/Icons'

const unidadeOptions = ['kg', 'g', 'litros', 'ml', 'unidade']
const insumoOptions = insumos.map(i => i.nome)

let proximoLinhaId = 1
function novaLinha() {
  return { id: proximoLinhaId++, insumo: '', qtd: '', unidade: 'kg' }
}

function ModalNovaFicha({ onClose }) {
  const { showToast } = useApp()
  const [produto, setProduto] = useState('')
  const [custo, setCusto] = useState('')
  const [linhas, setLinhas] = useState([novaLinha(), novaLinha()])
  const [errors, setErrors] = useState({})

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
    if (!produto.trim()) newErrors.produto = 'Informe o produto da ficha'
    if (!custo || parseFloat(custo) <= 0) newErrors.custo = 'Custo inválido'

    const linhasValidas = linhas.filter(l => l.insumo && l.qtd && parseFloat(l.qtd) > 0)
    if (linhasValidas.length === 0) newErrors.linhas = 'Adicione ao menos um insumo com quantidade'

    return newErrors
  }

  const handleSalvar = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast('⚠️ Preencha os campos obrigatórios corretamente')
      return
    }
    onClose()
    showToast(`✅ Ficha técnica de ${produto} criada com sucesso!`)
  }

  const linhasComErro = errors.linhas

  return (
    <Modal title="Nova Ficha Técnica" onClose={onClose}>
      <div className="form-group">
        <label>Produto *</label>
        <input
          type="text"
          list="produto-options"
          placeholder="Ex: Pizza Tradicional"
          value={produto}
          onChange={e => { setProduto(e.target.value); if (errors.produto) setErrors({ ...errors, produto: null }) }}
          className={errors.produto ? 'input-error' : ''}
        />
        <datalist id="produto-options">
          {produtoOptions.map(p => <option key={p} value={p.replace(/^\S+\s/, '')} />)}
        </datalist>
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
                value={l.insumo}
                onChange={e => atualizarLinha(l.id, 'insumo', e.target.value)}
                style={s.selectInsumo}
              >
                <option value="">Selecione o insumo...</option>
                {insumoOptions.map(nome => <option key={nome} value={nome}>{nome}</option>)}
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

export default function Receitas() {
  const { showToast } = useApp()
  const [modalNovo, setModalNovo] = useState(false)

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Fichas Técnicas</h3>
        <button className="btn btn-primary" onClick={() => setModalNovo(true)}>
          + Nova Ficha
        </button>
      </div>

      <div className="prod-cards">
        {receitas.map(r => (
          <div
            key={r.id}
            className="prod-card"
            onClick={() => showToast(`Ficha de ${r.produto} aberta!`)}
          >
            <div className="prod-card-icon">{r.icon}</div>
            <h4>{r.produto}</h4>
            <p>{r.insumos} insumos · Custo: R$ {r.custo.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Insumo</th>
              <th>Quantidade</th>
              <th>Unidade</th>
            </tr>
          </thead>
          <tbody>
            {fichaDetalhe.map((row, i) => (
              <tr key={i}>
                <td><strong>{row.produto}</strong></td>
                <td>{row.insumo}</td>
                <td>{row.qtd}</td>
                <td>{row.unidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalNovo && <ModalNovaFicha onClose={() => setModalNovo(false)} />}
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