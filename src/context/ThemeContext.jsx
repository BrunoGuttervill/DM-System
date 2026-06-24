import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(null)

const temaClaro = {
  '--vinho':        '#6B1A2A',
  '--vinho2':       '#8C2236',
  '--terra':        '#C4622D',
  '--terra2':       '#D97B40',
  '--creme':        '#F7EDD8',
  '--creme2':       '#EFE0BF',
  '--ouro':         '#C89B3C',
  '--escuro':       '#1C100A',
  '--texto':        '#3A2218',
  '--cinza':        '#7A6A5A',
  '--verde':        '#3D7A4F',
  '--vermelho':     '#B03030',
  '--amarelo':      '#C49A1A',
  '--bg-page':      '#F7EDD8',
  '--bg-card':      '#FFFFFF',
  '--bg-input':     '#FEFBF5',
  '--border':       '#EFE0BF',
  '--sidebar-bg':   '#1C100A',
  '--topbar-bg':    '#F7EDD8',
  '--topbar-border':'#EFE0BF',
  '--table-head':   '#F7EDD8',
  '--table-row':    '#FFFFFF',
  '--table-hover':  '#FDF8F0',
  '--table-border': '#F5EDD8',
}

const temaEscuro = {
  '--vinho':        '#9B3A52',
  '--vinho2':       '#B54A64',
  '--terra':        '#D97B40',
  '--terra2':       '#E89558',
  '--creme':        '#2A1A10',
  '--creme2':       '#3A2218',
  '--ouro':         '#D4A84C',
  '--escuro':       '#F7EDD8',
  '--texto':        '#E8D8C0',
  '--cinza':        '#A89078',
  '--verde':        '#5BAF70',
  '--vermelho':     '#E05050',
  '--amarelo':      '#D4AE2A',
  '--bg-page':      '#120B06',
  '--bg-card':      '#1E1008',
  '--bg-input':     '#2A1810',
  '--border':       '#3A2A1A',
  '--sidebar-bg':   '#0E0804',
  '--topbar-bg':    '#1E1008',
  '--topbar-border':'#3A2A1A',
  '--table-head':   '#2A1810',
  '--table-row':    '#1E1008',
  '--table-hover':  '#2A1A0E',
  '--table-border': '#2E1E10',
}

function aplicarTema(tema) {
  const root = document.documentElement
  const vars = tema === 'escuro' ? temaEscuro : temaClaro
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
  root.setAttribute('data-tema', tema)
}

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    const salvo = localStorage.getItem('dm-tema')
    return salvo || 'claro'
  })

  useEffect(() => {
    aplicarTema(tema)
    localStorage.setItem('dm-tema', tema)
  }, [tema])

  const toggleTema = useCallback(() => {
    setTema(t => t === 'claro' ? 'escuro' : 'claro')
  }, [])

  const definirTema = useCallback((t) => setTema(t), [])

  return (
    <ThemeContext.Provider value={{ tema, toggleTema, definirTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}