import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { produtoOptions } from '../data/mockData'
import { IconTrash } from '../components/Icons'

function ModalProducao({ onClose, onSalvo }) {
  const { showToast } = useApp()
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  const iso = local.toISOString().slice(0, 16)

  const [produto, setProduto] = useState(produtoOptions[0])
  const [qtd, setQtd] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [data, setData] = useState(iso)
  const [observacoes, setObservacoes] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const salvar = async () => {
    if (!qtd || parseInt(qtd) < 1) { setErro('Informe uma quantidade válida'); return }
    if (!responsavel.trim()) { setErro('Informe o responsável'); return }
    setErro('')
    setSalvando(true)
    try {
      const res = await fetch('http://localhost:3000/api/producao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto, qtd: parseInt(qtd), responsavel, data, observacoes }),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      onClose()
      showToast('✅ Produção registrada! Insumos descontados automaticamente.')
      await onSalvo()
    } catch (err) {
      showToast('❌ Não foi possível registrar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal title="Registrar Produção" onClose={onClose}>
      <div className="form-group">
        <label>Produto Fabricado</label>
        <select value={produto} onChange={e => setProduto(e.target.value)}>
          {produtoOptions.map(p => <option key={p}>{p}</option>)}
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
        <label>Data e Hora</label>
        <input type="datetime-local" value={data} onChange={e => setData(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Observações</label>
        <textarea rows="2" placeholder="Alguma observação sobre esse lote..." value={observacoes} onChange={e => setObservacoes(e.target.value)} />
      </div>
      {erro && <span className="form-error">{erro}</span>}
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className="btn btn-terra" onClick={salvar} disabled={salvando}>
          {salvando ? 'Registrando...' : 'Registrar'}
        </button>
      </div>
    </Modal>
  )
}

function ModalEditarProducao({ ordem, onClose, onSalvo }) {
  const { showToast } = useApp()
  const [produto, setProduto] = useState(ordem.produto || '')
  const [qtd, setQtd] = useState(ordem.qtd ?? '')
  const [responsavel, setResponsavel] = useState(ordem.responsavel || '')
  const [insumos, setInsumos] = useState(ordem.insumos || '')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const salvar = async () => {
    if (!produto.trim()) { setErro('Informe o produto'); return }
    if (!qtd || parseInt(qtd) < 1) { setErro('Informe uma quantidade válida'); return }
    if (!responsavel.trim()) { setErro('Informe o responsável'); return }
    setErro('')
    setSalvando(true)
    try {
      const res = await fetch(`http://localhost:3000/api/producao/${ordem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto, qtd: parseInt(qtd), responsavel, insumos }),
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
      <div className="form-group">
        <label>Produto</label>
        <input type="text" value={produto} onChange={e => setProduto(e.target.value)} />
      </div>
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
        <label>Insumos Consumidos</label>
        <textarea rows="3" value={insumos} onChange={e => setInsumos(e.target.value)} />
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

function ModalConfirmarExclusao({ ordem, onClose, onExcluido }) {
  const { showToast } = useApp()
  const [excluindo, setExcluindo] = useState(false)

  const confirmar = async () => {
    setExcluindo(true)
    try {
      const res = await fetch(`http://localhost:3000/api/producao/${ordem.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao excluir')
      onClose()
      showToast('🗑️ Produção excluída.')
      await onExcluido()
    } catch (err) {
      showToast('❌ Não foi possível excluir. Tente novamente.')
      setExcluindo(false)
    }
  }

  return (
    <Modal title="Excluir produção?" onClose={onClose}>
      <p style={{ fontSize: '0.9rem', color: 'var(--texto)', lineHeight: 1.6, marginBottom: 8 }}>
        Tem certeza que deseja excluir o registro de produção de <strong>{ordem.produto}</strong> ({ordem.qtd} un,{' '}
        {ordem.responsavel})? Essa ação não pode ser desfeita.
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

export default function Producao() {
  const [modalAberto, setModalAberto] = useState(false)
  const [ordemEditando, setOrdemEditando] = useState(null)
  const [ordemExcluindo, setOrdemExcluindo] = useState(null)
  const [ordensData, setOrdensData] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const ITENS_POR_PAGINA = 10

  const carregarOrdens = async () => {
    const res = await fetch('http://localhost:3000/api/producao')
    const data = await res.json()
    setOrdensData(data)
  }

  useEffect(() => {
    carregarOrdens()
  }, [])

  const totalPaginas = Math.max(1, Math.ceil(ordensData.length / ITENS_POR_PAGINA))

  // Se a página atual ficar fora do intervalo (ex: excluiu o último item da última página), volta pra última válida
  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas)
  }, [totalPaginas, paginaAtual])

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const ordensPaginadas = ordensData.slice(inicio, inicio + ITENS_POR_PAGINA)

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Ordens de Produção</h3>
        <button className="btn btn-terra" onClick={() => setModalAberto(true)}>
          Registrar Produção
        </button>
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
            {ordensData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--cinza)' }}>
                  Nenhuma produção registrada
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
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setOrdemEditando(o)}>
                        Editar
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--vermelho)' }}
                        onClick={() => setOrdemExcluindo(o)}
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

      {ordensData.length > 0 && (
        <div className="pagination">
          <span className="pagination-info">
            Mostrando {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, ordensData.length)} de {ordensData.length}
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
      {ordemExcluindo && (
        <ModalConfirmarExclusao
          ordem={ordemExcluindo}
          onClose={() => setOrdemExcluindo(null)}
          onExcluido={carregarOrdens}
        />
      )}
    </div>
  )
}