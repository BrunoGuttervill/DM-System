import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { IconSearch, IconTrash } from '../components/Icons'

const FORMAS_PAGAMENTO = ['Dinheiro', 'Pix', 'Cartão de Débito', 'Cartão de Crédito']

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

let proximoItemId = 1
function novoItem() {
  return { id: proximoItemId++, produtoId: '', tipoPreco: 'varejo', precoUnitario: '', quantidade: '' }
}

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

function gerarPdfPeriodo(vendas, tituloPeriodo, nomeArquivo) {
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
  doc.text(`Vendas — ${tituloPeriodo}`, 14, 40)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(122, 106, 90)
  doc.text(`Gerado em ${hojeStr} · ${vendas.length} venda(s) no período`, 14, 47)

  const totalGeral = vendas.reduce((soma, v) => soma + Number(v.total || 0), 0)

  autoTable(doc, {
    startY: 56,
    head: [['Data / Hora', 'Responsável', 'Forma de Pagamento', 'Itens', 'Total']],
    body: vendas.map(v => [v.data, v.responsavel, v.formaPagamento, `${v.totalItens}`, `R$ ${Number(v.total).toFixed(2)}`]),
    foot: [['', '', '', 'Total do período', `R$ ${totalGeral.toFixed(2)}`]],
    headStyles: { fillColor: [107, 26, 42], textColor: [247, 237, 216], fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    footStyles: { fillColor: [239, 224, 191], textColor: [28, 16, 10], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 245, 236] },
  })

  doc.save(nomeArquivo)
}

function ModalDetalheVenda({ venda, onClose }) {
  const [itens, setItens] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3000/api/vendas/${venda.id}`)
      .then(r => r.json())
      .then(setItens)
  }, [venda.id])

  return (
    <Modal title={`Venda #${venda.id}`} onClose={onClose}>
      <p style={{ fontSize: '0.85rem', color: 'var(--cinza)', marginBottom: 14 }}>
        {venda.data} · {venda.responsavel} · {venda.formaPagamento}
      </p>

      {itens === null ? (
        <p style={{ color: 'var(--cinza)', fontSize: '0.85rem' }}>Carregando itens...</p>
      ) : (
        <div className="table-wrap" style={{ marginBottom: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Preço Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {itens.map(it => (
                <tr key={it.id}>
                  <td><strong>{it.produtoNome}</strong></td>
                  <td>{it.quantidade}</td>
                  <td>R$ {Number(it.precoUnitario).toFixed(2)}</td>
                  <td>R$ {Number(it.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {venda.observacoes && (
        <p style={{ fontSize: '0.82rem', color: 'var(--cinza)', marginTop: 14 }}>
          <strong>Observações:</strong> {venda.observacoes}
        </p>
      )}

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
      </div>
    </Modal>
  )
}

function ModalRegistrarVenda({ produtos, onClose, onSalvo }) {
  const { showToast, token, usuario } = useApp()
  const [responsavel, setResponsavel] = useState(usuario?.nome || '')
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro')
  const [observacoes, setObservacoes] = useState('')
  const [itens, setItens] = useState([novoItem()])
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const produtoPorId = (id) => produtos.find(p => String(p.id) === String(id))

  const atualizarItem = (id, campo, valor) => {
    setItens(itens.map(it => {
      if (it.id !== id) return it
      const atualizado = { ...it, [campo]: valor }

      if (campo === 'produtoId') {
        const produto = produtoPorId(valor)
        atualizado.tipoPreco = 'varejo'
        atualizado.precoUnitario = produto ? produto.precoVarejo : ''
      }
      return atualizado
    }))
  }

  const alternarPreco = (id) => {
    setItens(itens.map(it => {
      if (it.id !== id) return it
      const produto = produtoPorId(it.produtoId)
      if (!produto) return it
      const novoTipo = it.tipoPreco === 'varejo' ? 'atacado' : 'varejo'
      return {
        ...it,
        tipoPreco: novoTipo,
        precoUnitario: novoTipo === 'varejo' ? produto.precoVarejo : produto.precoAtacado,
      }
    }))
  }

  const adicionarItem = () => setItens([...itens, novoItem()])
  const removerItem = (id) => {
    if (itens.length === 1) return
    setItens(itens.filter(it => it.id !== id))
  }

  const total = itens.reduce((soma, it) => {
    const qtd = parseFloat(it.quantidade) || 0
    const preco = parseFloat(it.precoUnitario) || 0
    return soma + qtd * preco
  }, 0)

  const salvar = async () => {
    setErro('')
    if (!responsavel.trim()) { setErro('Informe o responsável pela venda.'); return }

    const itensValidos = itens.filter(it => it.produtoId && it.quantidade && parseFloat(it.quantidade) > 0)
    if (itensValidos.length === 0) { setErro('Adicione ao menos um produto com quantidade.'); return }

    for (const it of itensValidos) {
      const produto = produtoPorId(it.produtoId)
      if (produto && parseFloat(it.quantidade) > produto.qtd) {
        setErro(`Estoque insuficiente de "${produto.nome}". Disponível: ${produto.qtd}.`)
        return
      }
    }

    setSalvando(true)
    try {
      const res = await fetch('http://localhost:3000/api/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          responsavel,
          formaPagamento,
          observacoes,
          itens: itensValidos.map(it => ({
            produtoId: parseInt(it.produtoId),
            quantidade: parseFloat(it.quantidade),
            precoUnitario: parseFloat(it.precoUnitario),
          })),
        }),
      })
      const dados = await res.json()

      if (!res.ok) {
        setErro(dados.error || 'Não foi possível registrar a venda.')
        setSalvando(false)
        return
      }

      onClose()
      showToast(`✅ Venda registrada! Total: R$ ${Number(dados.total).toFixed(2)}`)
      await onSalvo()
    } catch (err) {
      setErro('Não foi possível conectar ao servidor.')
      setSalvando(false)
    }
  }

  return (
    <Modal title="Registrar Venda" onClose={onClose}>
      <div className="form-row">
        <div className="form-group">
          <label>Responsável *</label>
          <input type="text" placeholder="Nome de quem vendeu" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Forma de Pagamento</label>
          <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)}>
            {FORMAS_PAGAMENTO.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Produtos Vendidos *</label>
        <div style={s.carrinhoWrap}>
          {itens.map(it => {
            const produto = produtoPorId(it.produtoId)
            const subtotal = (parseFloat(it.quantidade) || 0) * (parseFloat(it.precoUnitario) || 0)
            return (
              <div key={it.id} style={s.linhaItem}>
                <select
                  value={it.produtoId}
                  onChange={e => atualizarItem(it.id, 'produtoId', e.target.value)}
                  style={s.selectProduto}
                >
                  <option value="">Selecione o produto...</option>
                  {produtos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.qtd} disp.)</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  placeholder="Qtd."
                  value={it.quantidade}
                  onChange={e => atualizarItem(it.id, 'quantidade', e.target.value)}
                  style={s.inputQtd}
                />
                <button
                  type="button"
                  onClick={() => alternarPreco(it.id)}
                  style={s.btnPreco}
                  disabled={!produto}
                  title="Alternar entre varejo/atacado"
                >
                  {it.tipoPreco === 'varejo' ? 'Varejo' : 'Atacado'}: R$ {Number(it.precoUnitario || 0).toFixed(2)}
                </button>
                <span style={s.subtotalTxt}>R$ {subtotal.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => removerItem(it.id)}
                  style={s.btnRemover}
                  disabled={itens.length === 1}
                  title="Remover item"
                >
                  <IconTrash width={14} height={14} />
                </button>
              </div>
            )
          })}
        </div>
        <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={adicionarItem}>
          + Adicionar produto
        </button>
      </div>

      <div className="form-group">
        <label>Observações</label>
        <textarea rows="2" placeholder="Opcional" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
      </div>

      <div style={s.totalBox}>
        <span>Total da venda</span>
        <strong>R$ {total.toFixed(2)}</strong>
      </div>

      {erro && <span className="form-error">{erro}</span>}

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className="btn btn-primary" onClick={salvar} disabled={salvando}>
          {salvando ? 'Registrando...' : 'Registrar Venda'}
        </button>
      </div>
    </Modal>
  )
}

export default function Vendas() {
  const [vendas, setVendas] = useState([])
  const [produtos, setProdutos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [vendaDetalhe, setVendaDetalhe] = useState(null)
  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
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
    setDiaSelecionado('')
    setMesSelecionado(mes)
    setAnoSelecionado(ano)
  }

  const irParaAno = () => {
    const ano = parseInt(anoDigitado, 10)
    if (!ano || ano < 1900 || ano > 2200) return
    mudarPeriodo(0, ano)
    setAnoDigitado('')
  }

  const carregarVendas = async () => {
    const res = await fetch('http://localhost:3000/api/vendas')
    const data = await res.json()
    setVendas(data)
  }

  const carregarProdutos = async () => {
    const res = await fetch('http://localhost:3000/api/produtos')
    const data = await res.json()
    setProdutos(data)
  }

  useEffect(() => {
    carregarVendas()
    carregarProdutos()
  }, [])

  const onVendaSalva = async () => {
    await Promise.all([carregarVendas(), carregarProdutos()])
  }

  const vendasDoPeriodo = diaAtivo
    ? vendas.filter(v => String(v.data).slice(0, 10) === diaSelecionado)
    : vendas.filter(v => {
        const d = new Date(v.data)
        return d.getMonth() === mesSelecionado && d.getFullYear() === anoSelecionado
      })

  const termo = busca.toLowerCase()
  const vendasFiltradas = vendasDoPeriodo.filter(v =>
    !termo ||
    v.responsavel.toLowerCase().includes(termo) ||
    v.formaPagamento.toLowerCase().includes(termo)
  )

  const totalPaginas = Math.max(1, Math.ceil(vendasFiltradas.length / ITENS_POR_PAGINA))

  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas)
  }, [totalPaginas, paginaAtual])

  useEffect(() => {
    setPaginaAtual(1)
  }, [busca, mesSelecionado, anoSelecionado, diaSelecionado])

  const vendasOrdenadas = [...vendasFiltradas].sort((a, b) => new Date(b.data) - new Date(a.data))

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const vendasPaginadas = vendasOrdenadas.slice(inicio, inicio + ITENS_POR_PAGINA)

  const exportarPeriodo = () => {
    if (vendasOrdenadas.length === 0) return
    setExportando(true)
    try {
      let tituloPeriodo, nomeArquivo
      if (diaAtivo) {
        tituloPeriodo = diaSelecionado.split('-').reverse().join('/')
        nomeArquivo = `vendas-${diaSelecionado}.pdf`
      } else {
        tituloPeriodo = `${NOMES_MESES[mesSelecionado]} ${anoSelecionado}`
        nomeArquivo = `vendas-${String(mesSelecionado + 1).padStart(2, '0')}-${anoSelecionado}.pdf`
      }
      gerarPdfPeriodo(vendasOrdenadas, tituloPeriodo, nomeArquivo)
    } finally {
      setExportando(false)
    }
  }

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Vendas</h3>
        <div className="sec-actions">
          <div className="search-wrap">
            <IconSearch className="search-icon" width={15} height={15} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar venda..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
            + Registrar Venda
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
          disabled={exportando || vendasOrdenadas.length === 0}
        >
          {exportando ? 'Exportando...' : `Exportar PDF (${vendasOrdenadas.length})`}
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
              <th>Responsável</th>
              <th>Forma de Pagamento</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--cinza)' }}>
                  {vendasDoPeriodo.length === 0
                    ? (diaAtivo
                        ? `Nenhuma venda registrada no dia ${diaSelecionado.split('-').reverse().join('/')}`
                        : `Nenhuma venda registrada em ${NOMES_MESES[mesSelecionado]} de ${anoSelecionado}`)
                    : 'Nenhuma venda encontrada com esse termo'}
                </td>
              </tr>
            ) : (
              vendasPaginadas.map(v => (
                <tr key={v.id}>
                  <td>{v.data}</td>
                  <td>{v.responsavel}</td>
                  <td>{v.formaPagamento}</td>
                  <td>{v.totalItens}</td>
                  <td><strong>R$ {Number(v.total).toFixed(2)}</strong></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setVendaDetalhe(v)}>
                      Ver itens
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {vendasFiltradas.length > 0 && (
        <div className="pagination">
          <span className="pagination-info">
            Mostrando {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, vendasFiltradas.length)} de {vendasFiltradas.length}
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
        <ModalRegistrarVenda produtos={produtos} onClose={() => setModalAberto(false)} onSalvo={onVendaSalva} />
      )}
      {vendaDetalhe && (
        <ModalDetalheVenda venda={vendaDetalhe} onClose={() => setVendaDetalhe(null)} />
      )}
    </div>
  )
}

const s = {
  carrinhoWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  linhaItem: {
    display: 'grid',
    gridTemplateColumns: '1fr 70px 130px 90px 32px',
    gap: 8,
    alignItems: 'center',
  },
  selectProduto: {
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
  btnPreco: {
    padding: '8px 10px',
    border: '1.5px solid var(--terra)',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(196,98,45,0.08)',
    color: 'var(--terra)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.76rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  subtotalTxt: {
    fontSize: '0.84rem',
    fontWeight: 600,
    color: 'var(--escuro)',
    textAlign: 'right',
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
  totalBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--bg-hover)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    marginBottom: 16,
    fontSize: '0.9rem',
    color: 'var(--texto)',
  },
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