import { useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useApp } from '../context/AppContext'
import { IconTrendingUp, IconDollarSign, IconFactory, IconAlertTriangle, IconTruck, IconBox } from '../components/Icons'

const relatorioIcons = {
  movimentacoes: IconTrendingUp,
  custo: IconDollarSign,
  producao: IconFactory,
  perdas: IconAlertTriangle,
  compras: IconTruck,
  estoque: IconBox,
}

const relatoriosDisponiveis = [
  { id: 1, icon: 'movimentacoes', titulo: 'Movimentações do Período', desc: 'Entradas e saídas de estoque' },
  { id: 2, icon: 'custo', titulo: 'Custo de Produção', desc: 'Custo por produto fabricado' },
  { id: 3, icon: 'producao', titulo: 'Produção por Período', desc: 'Volume produzido por data' },
  { id: 4, icon: 'perdas', titulo: 'Perdas e Desperdícios', desc: 'Insumos vencidos ou descartados' },
  { id: 5, icon: 'compras', titulo: 'Compras por Fornecedor', desc: 'Histórico de entradas por fornecedor' },
  { id: 6, icon: 'estoque', titulo: 'Estoque Atual', desc: 'Fotografia atual do estoque' },
]

const COR_VINHO = [107, 26, 42]
const COR_CREME = [247, 237, 216]
const COR_CINZA = [122, 106, 90]

function semEmoji(texto) {
  if (!texto) return texto
  return String(texto)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '')
    .trim()
}

function iniciarPdf(titulo, subtitulo) {
  const doc = new jsPDF()
  const hoje = new Date().toLocaleDateString('pt-BR')
  const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  doc.setFillColor(...COR_VINHO)
  doc.rect(0, 0, 210, 28, 'F')
  doc.setTextColor(...COR_CREME)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Dany Massas', 14, 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Controle de Estoque · MassaStock', 14, 19)

  doc.setTextColor(30, 20, 15)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(titulo, 14, 40)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...COR_CINZA)
  doc.text(subtitulo, 14, 47)
  doc.text(`Gerado em ${hoje} às ${hora}`, 14, 53)

  return doc
}

function finalizarESalvar(doc, nomeArquivo) {
  const totalPaginas = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...COR_CINZA)
    doc.text(
      `Página ${i} de ${totalPaginas}`,
      doc.internal.pageSize.getWidth() - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    )
  }
  doc.save(nomeArquivo)
}

async function buscar(caminho) {
  const res = await fetch(`http://localhost:3000/api${caminho}`)
  if (!res.ok) throw new Error(`Falha ao buscar ${caminho}`)
  return res.json()
}

async function gerarEstoqueAtual() {
  const insumos = await buscar('/insumos')
  const doc = iniciarPdf('Estoque Atual', 'Fotografia atual de todas as matérias-primas cadastradas')
  autoTable(doc, {
    startY: 60,
    head: [['Nome', 'Categoria', 'Qtd. Atual', 'Qtd. Mínima', 'Validade', 'Status']],
    body: insumos.map(i => [
      semEmoji(i.nome),
      i.categoria,
      `${i.qtdAtual} ${i.unidade}`,
      `${i.qtdMin} ${i.unidade}`,
      i.validade,
      i.status === 'ok' ? 'OK' : i.status === 'baixo' ? 'Baixo' : 'Crítico',
    ]),
    headStyles: { fillColor: COR_VINHO, textColor: COR_CREME, fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [250, 245, 236] },
  })
  finalizarESalvar(doc, 'estoque-atual.pdf')
}

async function gerarComprasPorFornecedor() {
  const fornecedores = await buscar('/fornecedor')
  const doc = iniciarPdf('Compras por Fornecedor', 'Fornecedores cadastrados e insumos fornecidos por cada um')
  autoTable(doc, {
    startY: 60,
    head: [['Fornecedor', 'CNPJ', 'Telefone', 'Insumos Fornecidos']],
    body: fornecedores.map(f => [semEmoji(f.nome), f.cnpj, f.telefone, f.insumos]),
    headStyles: { fillColor: COR_VINHO, textColor: COR_CREME, fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [250, 245, 236] },
    columnStyles: { 3: { cellWidth: 70 } },
  })
  finalizarESalvar(doc, 'compras-por-fornecedor.pdf')
}

async function gerarProducaoPorPeriodo() {
  const ordens = await buscar('/producao')
  const doc = iniciarPdf('Produção por Período', 'Ordens de produção registradas, mais recentes primeiro')
  const ordenadas = [...ordens].sort((a, b) => new Date(b.data) - new Date(a.data))
  autoTable(doc, {
    startY: 60,
    head: [['Data / Hora', 'Produto', 'Qtd.', 'Responsável', 'Insumos Utilizados']],
    body: ordenadas.map(o => [o.data, semEmoji(o.produto), `${o.qtd} un`, o.responsavel, o.insumos]),
    headStyles: { fillColor: COR_VINHO, textColor: COR_CREME, fontSize: 8.5 },
    bodyStyles: { fontSize: 7.8 },
    alternateRowStyles: { fillColor: [250, 245, 236] },
    columnStyles: { 4: { cellWidth: 60 } },
  })
  finalizarESalvar(doc, 'producao-por-periodo.pdf')
}

async function gerarMovimentacoes() {
  const ordens = await buscar('/producao')
  const doc = iniciarPdf('Movimentações do Período', 'Saídas de estoque por produção')
  const ordenadas = [...ordens].sort((a, b) => new Date(b.data) - new Date(a.data))
  autoTable(doc, {
    startY: 60,
    head: [['Data / Hora', 'Tipo', 'Produto', 'Qtd.', 'Responsável']],
    body: ordenadas.map(o => [o.data, 'Saída (produção)', semEmoji(o.produto), `${o.qtd} un`, o.responsavel]),
    headStyles: { fillColor: COR_VINHO, textColor: COR_CREME, fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [250, 245, 236] },
  })
  finalizarESalvar(doc, 'movimentacoes-do-periodo.pdf')
}

async function gerarPerdasEDesperdicios() {
  const alertas = await buscar('/alertas')
  const doc = iniciarPdf('Perdas e Desperdícios', 'Insumos com estoque crítico, baixo ou vencimento próximo')
  autoTable(doc, {
    startY: 60,
    head: [['Alerta', 'Tipo', 'Descrição']],
    body: alertas.map(a => [
      a.titulo,
      a.tipo === 'critico' ? 'Crítico' : a.tipo === 'vencimento' ? 'Vencimento' : 'Atenção',
      a.desc,
    ]),
    headStyles: { fillColor: COR_VINHO, textColor: COR_CREME, fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [250, 245, 236] },
    columnStyles: { 2: { cellWidth: 100 } },
  })
  finalizarESalvar(doc, 'perdas-e-desperdicios.pdf')
}

async function gerarCustoDeProducao() {
  const fichas = await buscar('/receitas')
  const doc = iniciarPdf('Custo de Produção', 'Custo estimado por produto, conforme fichas técnicas cadastradas')
  const custoTotal = fichas.reduce((soma, f) => soma + Number(f.custo || 0), 0)
  autoTable(doc, {
    startY: 60,
    head: [['Produto', 'Qtd. de Insumos', 'Custo Estimado']],
    body: fichas.map(f => [semEmoji(f.produtoNome), `${f.totalInsumos} insumos`, `R$ ${Number(f.custo).toFixed(2)}`]),
    foot: [['', 'Total', `R$ ${custoTotal.toFixed(2)}`]],
    headStyles: { fillColor: COR_VINHO, textColor: COR_CREME, fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    footStyles: { fillColor: [239, 224, 191], textColor: [28, 16, 10], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 245, 236] },
  })
  finalizarESalvar(doc, 'custo-de-producao.pdf')
}

const geradores = {
  estoque: gerarEstoqueAtual,
  compras: gerarComprasPorFornecedor,
  producao: gerarProducaoPorPeriodo,
  movimentacoes: gerarMovimentacoes,
  perdas: gerarPerdasEDesperdicios,
  custo: gerarCustoDeProducao,
}

export default function Relatorios() {
  const { showToast } = useApp()
  const [gerando, setGerando] = useState(null)

  const handleClick = async (r) => {
    setGerando(r.id)
    try {
      const gerar = geradores[r.icon]
      if (!gerar) throw new Error('Relatório não implementado')
      await gerar()
      showToast(`✅ PDF de "${r.titulo}" gerado com sucesso!`)
    } catch (err) {
      showToast('❌ Não foi possível gerar o PDF. Verifique se o backend está rodando.')
    } finally {
      setGerando(null)
    }
  }

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Relatórios</h3>
      </div>
      <div className="prod-cards">
        {relatoriosDisponiveis.map(r => {
          const Icon = relatorioIcons[r.icon] || IconBox
          const carregando = gerando === r.id
          return (
            <div
              key={r.id}
              className="prod-card"
              onClick={() => !carregando && handleClick(r)}
              style={carregando ? { opacity: 0.6, pointerEvents: 'none' } : undefined}
            >
              <div className="prod-card-icon"><Icon width={22} height={22} /></div>
              <h4>{r.titulo}</h4>
              <p>{carregando ? 'Gerando PDF...' : r.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}