import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { IconSearch } from '../components/Icons'

function ModalProducao({ onClose, onSalvo }) {
  const { showToast, token, notifProducao } = useApp()

  const [qtd, setQtd] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [pizzas, setPizzas] = useState([])
  const [pizzaId, setPizzaId] = useState('')
  const [confirmando, setConfirmando] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/api/produtos')
      .then(r => r.json())
      .then(data => setPizzas(data))
  }, [])

  const produtoSelecionado = pizzas.find(p => String(p.id) === String(pizzaId))

  const enviar = async () => {
    setSalvando(true)
    try {
      const res = await fetch('http://localhost:3000/api/producao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pizzaId, quantidade: parseInt(qtd), responsavel, observacoes }),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      onClose()
      showToast('✅ Produção registrada! Insumos descontados automaticamente.')
      await onSalvo()
    } catch (err) {
      showToast('❌ Não foi possível registrar. Tente novamente.')
      setConfirmando(false)
    } finally {
      setSalvando(false)
    }
  }

  const handleRegistrarClick = () => {
    if (!pizzaId) { setErro('Selecione um produto'); return }
    if (!qtd || parseInt(qtd) < 1) { setErro('Informe uma quantidade válida'); return }
    if (!responsavel.trim()) { setErro('Informe o responsável'); return }
    setErro('')

    if (notifProducao) {
      setConfirmando(true)
      return
    }
    enviar()
  }

  if (confirmando) {
    return (
      <Modal title="Confirmar produção" onClose={onClose}>
        <p style={{ fontSize: '0.9rem', color: 'var(--texto)', lineHeight: 1.6, marginBottom: 8 }}>
          Confirma o registro desta produção?
        </p>
        <div style={{
          background: 'var(--bg-hover)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          fontSize: '0.86rem',
          color: 'var(--texto)',
          marginBottom: 8,
          lineHeight: 1.7,
        }}>
          <strong>{produtoSelecionado ? `${produtoSelecionado.nome} - ${produtoSelecionado.tipo}` : 'Produto selecionado'}</strong><br />
          Quantidade: <strong>{qtd} un</strong><br />
          Responsável: <strong>{responsavel}</strong>
          {observacoes && <><br />Observações: {observacoes}</>}
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setConfirmando(false)} disabled={salvando}>Voltar</button>
          <button className="btn btn-terra" onClick={enviar} disabled={salvando}>
            {salvando ? 'Registrando...' : 'Sim, registrar'}
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title="Registrar Produção" onClose={onClose}>
      <div className="form-group">
        <label>Produto Fabricado</label>
        <select value={pizzaId} onChange={e => setPizzaId(e.target.value)}>
          <option value="">Selecione um produto</option>
          {pizzas
            .filter(p => p.status === 'ok')
            .map(p => <option key={p.id} value={p.id}>{p.nome} - {p.tipo}</option>)}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Quantidade Produzida</label>
          <input type="number" placeholder="0" min="1" value={qtd} onChange={e => setQtd(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Responsável</label>
          <input type="text" placeholder="Nome do operador" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Observações</label>
        <textarea rows="2" placeholder="Alguma observação sobre esse lote..." value={observacoes} onChange={e => setObservacoes(e.target.value)} />
      </div>
      {erro && <span className="form-error">{erro}</span>}
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className="btn btn-terra" onClick={handleRegistrarClick} disabled={salvando}>
          {salvando ? 'Registrando...' : 'Registrar'}
        </button>
      </div>
    </Modal>
  )
}


function ModalEditarProducao({ ordem, onClose, onSalvo }) {
  const { showToast, token } = useApp()
  const [qtd, setQtd] = useState(ordem.qtd ?? '')
  const [responsavel, setResponsavel] = useState(ordem.responsavel || '')
  const [observacoes, setObservacoes] = useState(ordem.observacoes || '')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const salvar = async () => {
    if (!qtd || parseInt(qtd) < 1) { setErro('Informe uma quantidade válida'); return }
    if (!responsavel.trim()) { setErro('Informe o responsável'); return }
    setErro('')
    setSalvando(true)
    try {
      const res = await fetch(`http://localhost:3000/api/producao/${ordem.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantidade: parseInt(qtd), responsavel, observacoes }),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      onClose()
      showToast('✅ Produção atualizada com sucesso!')
      await onSalvo()
    } catch (err) {
      showToast('❌ Não foi possível salvar as alterações. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal title="Editar Produção" onClose={onClose}>
      <div className="form-row">
        <div className="form-group">
          <label>Quantidade Produzida</label>
          <input type="number" min="1" value={qtd} onChange={e => setQtd(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Responsável</label>
          <input type="text" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Observações</label>
        <textarea rows="2" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
      </div>
      {erro && <span className="form-error">{erro}</span>}
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className="btn btn-terra" onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </Modal>
  )
}

export default function Producao() {
  const [modalAberto, setModalAberto] = useState(false)
  const [ordemEditando, setOrdemEditando] = useState(null)
  const [ordensData, setOrdensData] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [busca, setBusca] = useState('')
  const ITENS_POR_PAGINA = 10

  const carregarOrdens = async () => {
    const res = await fetch('http://localhost:3000/api/producao')
    const data = await res.json()
    setOrdensData(data)
  }

  useEffect(() => {
    carregarOrdens()
  }, [])

  const termo = busca.toLowerCase()
  const ordensFiltradas = ordensData.filter(o =>
    !termo ||
    o.produto.toLowerCase().includes(termo) ||
    o.responsavel.toLowerCase().includes(termo) ||
    (o.insumos || '').toLowerCase().includes(termo)
  )

  const totalPaginas = Math.max(1, Math.ceil(ordensFiltradas.length / ITENS_POR_PAGINA))

  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas)
  }, [totalPaginas, paginaAtual])

  useEffect(() => {
    setPaginaAtual(1)
  }, [busca])

  const ordensOrdenadas = [...ordensFiltradas].sort((a, b) => new Date(b.data) - new Date(a.data))

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const ordensPaginadas = ordensOrdenadas.slice(inicio, inicio + ITENS_POR_PAGINA)

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Ordens de Produção</h3>
        <div className="sec-actions">
          <div className="search-wrap">
            <IconSearch className="search-icon" width={15} height={15} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar produção..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <button className="btn btn-terra" onClick={() => setModalAberto(true)}>
            Registrar Produção
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Data / Hora</th>
              <th>Produto</th>
              <th>Qtd. Produzida</th>
              <th>Responsável</th>
              <th>Insumos Consumidos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ordensFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--cinza)' }}>
                  {ordensData.length === 0 ? 'Nenhuma produção registrada' : 'Nenhuma produção encontrada'}
                </td>
              </tr>
            ) : (
              ordensPaginadas.map(o => (
                <tr key={o.id}>
                  <td>{o.data}</td>
                  <td>{o.produto}</td>
                  <td><strong>{o.qtd} un</strong></td>
                  <td>{o.responsavel}</td>
                  <td style={{ color: 'var(--cinza)', fontSize: '0.82rem' }}>{o.insumos}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setOrdemEditando(o)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {ordensFiltradas.length > 0 && (
        <div className="pagination">
          <span className="pagination-info">
            Mostrando {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, ordensFiltradas.length)} de {ordensFiltradas.length}
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
        <ModalProducao onClose={() => setModalAberto(false)} onSalvo={carregarOrdens} />
      )}
      {ordemEditando && (
        <ModalEditarProducao
          ordem={ordemEditando}
          onClose={() => setOrdemEditando(null)}
          onSalvo={carregarOrdens}
        />
      )}   
    </div>
  )
}