import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { IconTrash, IconClipboard } from '../components/Icons'

const unidadeFallback = ['kg', 'g', 'litros', 'ml', 'unidade']

let proximoLinhaId = 1
function novaLinha() {
  return { id: proximoLinhaId++, insumoId: '', qtdPorUnidade: '' }
}

function ModalDetalheFicha({ ficha, onClose, onEditar }) {
  const [ingredientes, setIngredientes] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:3000/api/receitas/${ficha.pizzaId}`)
      .then(r => r.json())
      .then(data => setIngredientes(data))
      .finally(() => setCarregando(false))
  }, [ficha.pizzaId])

  return (
    <Modal title={`Ficha Técnica — ${ficha.produtoNome}`} onClose={onClose}>
      <p style={{ fontSize: '0.85rem', color: 'var(--cinza)', marginBottom: 14 }}>
        Custo estimado: <strong style={{ color: 'var(--escuro)' }}>R$ {Number(ficha.custo).toFixed(2)}</strong>
        {' · '}{ficha.totalInsumos} insumo{ficha.totalInsumos === 1 ? '' : 's'}
      </p>

      {carregando ? (
        <p style={{ color: 'var(--cinza)', fontSize: '0.85rem' }}>Carregando ingredientes...</p>
      ) : ingredientes.length === 0 ? (
        <p style={{ color: 'var(--cinza)', fontSize: '0.85rem' }}>Nenhum insumo cadastrado nessa ficha.</p>
      ) : (
        <div className="table-wrap" style={{ marginBottom: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Quantidade por unidade</th>
              </tr>
            </thead>
            <tbody>
              {ingredientes.map(ing => (
                <tr key={ing.id}>
                  <td><strong>{ing.nome}</strong></td>
                  <td>{ing.qtdPorUnidade} {ing.unidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        <button className="btn btn-primary" onClick={() => onEditar(ficha, ingredientes)} disabled={carregando}>
          Editar ficha
        </button>
      </div>
    </Modal>
  )
}

function ModalFormFicha({ modo, fichaExistente, ingredientesExistentes, produtos, insumos, onClose, onSalvo }) {
  const { showToast, token } = useApp()
  const [pizzaId, setPizzaId] = useState(fichaExistente?.pizzaId || '')
  const [custo, setCusto] = useState(fichaExistente?.custo ?? '')
  const [linhas, setLinhas] = useState(
    ingredientesExistentes?.length
      ? ingredientesExistentes.map(i => ({ id: proximoLinhaId++, insumoId: String(i.insumoId), qtdPorUnidade: String(i.qtdPorUnidade) }))
      : [novaLinha(), novaLinha()]
  )
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const atualizarLinha = (id, campo, valor) => {
    setLinhas(linhas.map(l => l.id === id ? { ...l, [campo]: valor } : l))
  }

  const adicionarLinha = () => setLinhas([...linhas, novaLinha()])

  const removerLinha = (id) => {
    if (linhas.length === 1) return
    setLinhas(linhas.filter(l => l.id !== id))
  }

  const salvar = async () => {
    setErro('')

    if (modo === 'criar' && !pizzaId) { setErro('Selecione o produto da ficha'); return }
    if (!custo || parseFloat(custo) < 0) { setErro('Informe um custo válido'); return }

    const ingredientes = linhas
      .filter(l => l.insumoId && l.qtdPorUnidade && parseFloat(l.qtdPorUnidade) > 0)
      .map(l => ({ insumoId: parseInt(l.insumoId), qtdPorUnidade: parseFloat(l.qtdPorUnidade) }))

    if (ingredientes.length === 0) { setErro('Adicione ao menos um insumo com quantidade'); return }

    setSalvando(true)
    try {
      const url = modo === 'criar'
        ? 'http://localhost:3000/api/receitas'
        : `http://localhost:3000/api/receitas/${fichaExistente.id}`
      const method = modo === 'criar' ? 'POST' : 'PUT'
      const body = modo === 'criar'
        ? { pizzaId: parseInt(pizzaId), custo: parseFloat(custo), ingredientes }
        : { custo: parseFloat(custo), ingredientes }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const dados = await res.json()

      if (!res.ok) {
        setErro(dados.error || dados.message || 'Não foi possível salvar a ficha.')
        setSalvando(false)
        return
      }

      onClose()
      showToast(modo === 'criar' ? '✅ Ficha técnica criada com sucesso!' : '✅ Ficha técnica atualizada!')
      await onSalvo()
    } catch (err) {
      setErro('Não foi possível conectar ao servidor.')
      setSalvando(false)
    }
  }

  return (
    <Modal title={modo === 'criar' ? 'Nova Ficha Técnica' : `Editar Ficha — ${fichaExistente.produtoNome}`} onClose={onClose}>
      {modo === 'criar' && (
        <div className="form-group">
          <label>Produto *</label>
          <select value={pizzaId} onChange={e => setPizzaId(e.target.value)}>
            <option value="">Selecione o produto...</option>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} — {p.tipo}</option>)}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Custo Estimado da Ficha (R$) *</label>
        <input type="number" step="0.01" placeholder="0.00" value={custo} onChange={e => setCusto(e.target.value)} />
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
                {insumos.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
              </select>
              <input
                type="number"
                step="0.001"
                placeholder="Qtd."
                value={l.qtdPorUnidade}
                onChange={e => atualizarLinha(l.id, 'qtdPorUnidade', e.target.value)}
                style={s.inputQtd}
              />
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
        <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={adicionarLinha}>
          + Adicionar insumo
        </button>
      </div>

      {erro && <span className="form-error">{erro}</span>}

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className="btn btn-primary" onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : modo === 'criar' ? 'Salvar Ficha' : 'Salvar alterações'}
        </button>
      </div>
    </Modal>
  )
}

export default function Receitas() {
  const [fichas, setFichas] = useState([])
  const [produtos, setProdutos] = useState([])
  const [insumos, setInsumos] = useState([])
  const [fichaDetalhe, setFichaDetalhe] = useState(null)
  const [modalForm, setModalForm] = useState(null) // { modo: 'criar' | 'editar', fichaExistente?, ingredientesExistentes? }

  const carregarFichas = async () => {
    const res = await fetch('http://localhost:3000/api/receitas')
    const data = await res.json()
    setFichas(data)
  }

  useEffect(() => {
    carregarFichas()
    fetch('http://localhost:3000/api/produtos').then(r => r.json()).then(setProdutos)
    fetch('http://localhost:3000/api/insumos').then(r => r.json()).then(setInsumos)
  }, [])

  const abrirEdicao = (ficha, ingredientes) => {
    setFichaDetalhe(null)
    setModalForm({ modo: 'editar', fichaExistente: ficha, ingredientesExistentes: ingredientes })
  }

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Fichas Técnicas</h3>
        <button className="btn btn-primary" onClick={() => setModalForm({ modo: 'criar' })}>
          + Nova Ficha
        </button>
      </div>

      {fichas.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cinza)' }}>
          Nenhuma ficha técnica cadastrada ainda.
        </div>
      ) : (
        <div className="prod-cards">
          {fichas.map(f => (
            <div key={f.id} className="prod-card" onClick={() => setFichaDetalhe(f)}>
              <div className="prod-card-icon"><IconClipboard width={22} height={22} /></div>
              <h4>{f.produtoNome}</h4>
              <p>{f.totalInsumos} insumo{f.totalInsumos === 1 ? '' : 's'} · Custo: R$ {Number(f.custo).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {fichaDetalhe && (
        <ModalDetalheFicha
          ficha={fichaDetalhe}
          onClose={() => setFichaDetalhe(null)}
          onEditar={abrirEdicao}
        />
      )}

      {modalForm && (
        <ModalFormFicha
          modo={modalForm.modo}
          fichaExistente={modalForm.fichaExistente}
          ingredientesExistentes={modalForm.ingredientesExistentes}
          produtos={produtos}
          insumos={insumos}
          onClose={() => setModalForm(null)}
          onSalvo={carregarFichas}
        />
      )}
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
    gridTemplateColumns: '1fr 100px 32px',
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