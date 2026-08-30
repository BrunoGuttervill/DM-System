import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
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

function ModalProduzirInsumo({ onClose, onSalvo }) {
  const { showToast, token } = useApp()

  const [insumos, setInsumos] = useState([])
  const [insumoId, setInsumoId] = useState('')
  const [lotes, setLotes] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/api/insumos/produziveis')
      .then(r => r.json())
      .then(data => setInsumos(data))
  }, [])

  const insumoSelecionado = insumos.find(i => String(i.id) === String(insumoId))

  const enviar = async () => {
    setSalvando(true)
    try {
      const res = await fetch('http://localhost:3000/api/producao/insumo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          insumoId,
          quantidadeLotes: parseInt(lotes),
          responsavel,
          observacoes
        }),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      onClose()
      showToast('✅ Produção registrada! Massa adicionada ao estoque.')
      await onSalvo()
    } catch (err) {
      showToast('❌ Não foi possível registrar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const handleRegistrarClick = () => {
    if (!insumoId) { setErro('Selecione o que produzir'); return }
    if (!lotes || parseInt(lotes) < 1) { setErro('Informe a quantidade de lotes'); return }
    if (!responsavel.trim()) { setErro('Informe o responsável'); return }
    setErro('')
    enviar()
  }

  return (
    <Modal title="Produzir Insumo" onClose={onClose}>
      <div className="form-group">
        <label>O que produzir</label>
        <select value={insumoId} onChange={e => setInsumoId(e.target.value)}>
          <option value="">Selecione um insumo</option>
          {insumos.map(i => (
            <option key={i.id} value={i.id}>{i.nome}</option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Quantidade de Lotes</label>
          <input type="number" placeholder="0" min="1" value={lotes} onChange={e => setLotes(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Responsável</label>
          <input type="text" placeholder="Nome do operador" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
        </div>
      </div>

      {insumoSelecionado && lotes > 0 && (
        <div style={{
          background: 'var(--bg-hover)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          fontSize: '0.86rem',
          color: 'var(--texto)',
          marginBottom: 8,
        }}>
          Isso vai produzir <strong>{lotes * insumoSelecionado.rendimento} {insumoSelecionado.unidade}</strong> de {insumoSelecionado.nome}
          <br />
          <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>
            ({lotes} {lotes == 1 ? 'lote' : 'lotes'} × {insumoSelecionado.rendimento} por lote)
          </span>
        </div>
      )}

      <div className="form-group">
        <label>Observações</label>
        <textarea rows="2" placeholder="Alguma observação sobre esse lote..." value={observacoes} onChange={e => setObservacoes(e.target.value)} />
      </div>
      {erro && <span className="form-error">{erro}</span>}
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className="btn btn-terra" onClick={handleRegistrarClick} disabled={salvando}>
          {salvando ? 'Produzindo...' : 'Produzir'}
        </button>
      </div>
    </Modal>
  )
}

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function SeletorPeriodo({ mes, ano, onMudar }) {
  const hoje = new Date()
  const ehMesAtual = mes === hoje.getMonth() && ano === hoje.getFullYear()

  const irParaMesAnterior = () => {
    if (mes === 0) onMudar(11, ano - 1)
    else onMudar(mes - 1, ano)
  }

  const irParaProximoMes = () => {
    if (ehMesAtual) return
    if (mes === 11) onMudar(0, ano + 1)
    else onMudar(mes + 1, ano)
  }

  return (
    <div style={pS.wrap}>
      <button type="button" onClick={irParaMesAnterior} style={pS.setaBtn} title="Mês anterior">‹</button>
      <span style={pS.label}>{NOMES_MESES[mes]} {ano}</span>
      <button
        type="button"
        onClick={irParaProximoMes}
        style={{ ...pS.setaBtn, ...(ehMesAtual ? pS.setaBtnDisabled : {}) }}
        disabled={ehMesAtual}
        title="Próximo mês"
      >
        ›
      </button>
      {!ehMesAtual && (
        <button type="button" onClick={() => onMudar(hoje.getMonth(), hoje.getFullYear())} style={pS.hojeBtn}>
          Mês atual
        </button>
      )}
    </div>
  )
}

function gerarPdfPeriodo(ordens, tituloPeriodo, nomeArquivo) {
  const doc = new jsPDF()
  const hojeStr = new Date().toLocaleDateString('pt-BR')

  doc.setFillColor(107, 26, 42)
  doc.rect(0, 0, 210, 28, 'F')
  doc.setTextColor(247, 237, 216)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Dany Massas', 14, 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Controle de Estoque · MassaStock', 14, 19)

  doc.setTextColor(30, 20, 15)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(`Ordens de Produção — ${tituloPeriodo}`, 14, 40)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(122, 106, 90)
  doc.text(`Gerado em ${hojeStr} · ${ordens.length} registro(s) no período`, 14, 47)

  const totalUnidades = ordens.reduce((soma, o) => soma + Number(o.qtd || 0), 0)

  autoTable(doc, {
    startY: 56,
    head: [['Data / Hora', 'Produto', 'Qtd.', 'Responsável', 'Insumos Consumidos']],
    body: ordens.map(o => [o.data, o.produto, `${o.qtd} un`, o.responsavel, o.insumos]),
    foot: [['', '', `${totalUnidades} un`, 'Total produzido', '']],
    headStyles: { fillColor: [107, 26, 42], textColor: [247, 237, 216], fontSize: 8.5 },
    bodyStyles: { fontSize: 7.8 },
    footStyles: { fillColor: [239, 224, 191], textColor: [28, 16, 10], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 245, 236] },
    columnStyles: { 4: { cellWidth: 60 } },
  })

  doc.save(nomeArquivo)
}

export default function Producao() {
  const [modalAberto, setModalAberto] = useState(false)
  const [modalInsumoAberto, setModalInsumoAberto] = useState(false)
  const [ordemEditando, setOrdemEditando] = useState(null)
  const [ordensData, setOrdensData] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [busca, setBusca] = useState('')
  const [exportando, setExportando] = useState(false)
  const agora = new Date()
  const [mesSelecionado, setMesSelecionado] = useState(agora.getMonth())
  const [anoSelecionado, setAnoSelecionado] = useState(agora.getFullYear())
  const [diaSelecionado, setDiaSelecionado] = useState('') // formato YYYY-MM-DD
  const [anoDigitado, setAnoDigitado] = useState('')
  const ITENS_POR_PAGINA = 10

  const diaAtivo = Boolean(diaSelecionado)

  const escolherDia = (valor) => {
    setDiaSelecionado(valor)
    if (valor) {
      const [ano, mes] = valor.split('-').map(Number)
      setMesSelecionado(mes - 1)
      setAnoSelecionado(ano)
    }
  }

  const limparDia = () => setDiaSelecionado('')

  const mudarPeriodo = (mes, ano) => {
    setDiaSelecionado('') // navegar de mês limpa o filtro de dia, pra não ficar confuso
    setMesSelecionado(mes)
    setAnoSelecionado(ano)
  }

  const irParaAno = () => {
    const ano = parseInt(anoDigitado, 10)
    if (!ano || ano < 1900 || ano > 2200) return
    mudarPeriodo(0, ano) // Janeiro do ano digitado
    setAnoDigitado('')
  }

  const carregarOrdens = async () => {
    const res = await fetch('http://localhost:3000/api/producao')
    const data = await res.json()
    setOrdensData(data)
  }

  useEffect(() => {
    carregarOrdens()
  }, [])

  const ordensDoPeriodo = diaAtivo
    ? ordensData.filter(o => String(o.data).slice(0, 10) === diaSelecionado)
    : ordensData.filter(o => {
        const d = new Date(o.data)
        return d.getMonth() === mesSelecionado && d.getFullYear() === anoSelecionado
      })

  const termo = busca.toLowerCase()
  const ordensFiltradas = ordensDoPeriodo.filter(o =>
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
  }, [busca, mesSelecionado, anoSelecionado, diaSelecionado])

  const ordensOrdenadas = [...ordensFiltradas].sort((a, b) => new Date(b.data) - new Date(a.data))

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const ordensPaginadas = ordensOrdenadas.slice(inicio, inicio + ITENS_POR_PAGINA)

  const exportarPeriodo = () => {
    if (ordensOrdenadas.length === 0) return
    setExportando(true)
    try {
      let tituloPeriodo, nomeArquivo
      if (diaAtivo) {
        const fmt = diaSelecionado.split('-').reverse().join('/')
        tituloPeriodo = fmt
        nomeArquivo = `producao-${diaSelecionado}.pdf`
      } else {
        tituloPeriodo = `${NOMES_MESES[mesSelecionado]} ${anoSelecionado}`
        nomeArquivo = `producao-${String(mesSelecionado + 1).padStart(2, '0')}-${anoSelecionado}.pdf`
      }
      gerarPdfPeriodo(ordensOrdenadas, tituloPeriodo, nomeArquivo)
    } finally {
      setExportando(false)
    }
  }

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
          <button className="btn btn-secondary" onClick={() => setModalInsumoAberto(true)}>
            Produzir Insumo
          </button>
          <button className="btn btn-terra" onClick={() => setModalAberto(true)}>
            Registrar Produção
          </button>
        </div>
      </div>

      <div style={pS.barraPeriodo}>
        <div style={pS.wrap}>
          <SeletorPeriodo mes={mesSelecionado} ano={anoSelecionado} onMudar={mudarPeriodo} />
          <span style={pS.separador}>|</span>
          <span style={pS.dataLabel}>Ir para o ano:</span>
          <input
            type="number"
            placeholder="2026"
            className="filter-select"
            style={pS.anoInput}
            value={anoDigitado}
            onChange={e => setAnoDigitado(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && irParaAno()}
          />
          <button type="button" onClick={irParaAno} style={pS.limparBtn} disabled={!anoDigitado}>
            Ir
          </button>
          <span style={pS.separador}>|</span>
          <span style={pS.dataLabel}>Buscar dia específico:</span>
          <input
            type="date"
            className="filter-select"
            style={{ ...pS.dataInput, ...(diaAtivo ? pS.dataInputAtivo : {}) }}
            value={diaSelecionado}
            onChange={e => escolherDia(e.target.value)}
          />
          {diaAtivo && (
            <button type="button" onClick={limparDia} style={pS.limparBtn}>
              ✕ Limpar
            </button>
          )}
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={exportarPeriodo}
          disabled={exportando || ordensOrdenadas.length === 0}
        >
          {exportando ? 'Exportando...' : `Exportar PDF (${ordensOrdenadas.length})`}
        </button>
      </div>

      {diaAtivo && (
        <div style={pS.avisoDia}>
          📅 Mostrando só o dia <strong>{diaSelecionado.split('-').reverse().join('/')}</strong> — os outros dias do mês estão ocultos.
        </div>
      )}


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
                  {ordensDoPeriodo.length === 0
                    ? (diaAtivo
                        ? `Nenhuma produção registrada no dia ${diaSelecionado.split('-').reverse().join('/')}`
                        : `Nenhuma produção registrada em ${NOMES_MESES[mesSelecionado]} de ${anoSelecionado}`)
                    : 'Nenhuma produção encontrada com esse termo'}
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
      {modalInsumoAberto && (
        <ModalProduzirInsumo onClose={() => setModalInsumoAberto(false)} onSalvo={carregarOrdens} />
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

const pS = {
  barraPeriodo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  dataInputAtivo: {
    borderColor: 'var(--terra)',
    boxShadow: '0 0 0 3px rgba(196,98,45,0.1)',
  },
  avisoDia: {
    fontSize: '0.8rem',
    color: 'var(--terra)',
    background: 'rgba(196,98,45,0.08)',
    border: '1px solid rgba(196,98,45,0.2)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 14px',
    marginBottom: 16,
  },
  separador: {
    fontSize: '0.78rem',
    color: 'var(--cinza)',
    margin: '0 4px',
  },
  dataLabel: {
    fontSize: '0.78rem',
    color: 'var(--cinza)',
  },
  anoInput: {
    padding: '6px 10px',
    fontSize: '0.82rem',
    width: 76,
  },
  dataInput: {
    padding: '6px 10px',
    fontSize: '0.82rem',
  },
  limparBtn: {
    marginLeft: 4,
    padding: '5px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--cinza)',
    fontSize: '0.76rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  setaBtn: {
    width: 30,
    height: 30,
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--texto)',
    fontSize: '1.1rem',
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setaBtnDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },
  label: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1rem',
    color: 'var(--escuro)',
    fontWeight: 600,
    minWidth: 140,
    textAlign: 'center',
  },
  hojeBtn: {
    marginLeft: 6,
    padding: '5px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--terra)',
    background: 'transparent',
    color: 'var(--terra)',
    fontSize: '0.76rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
}