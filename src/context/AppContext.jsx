import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const AppContext = createContext(null)

const CHAVE_PREFERENCIAS = 'dm-notif-preferencias'

function carregarPreferencias() {
  try {
    const salvo = localStorage.getItem(CHAVE_PREFERENCIAS)
    if (salvo) return JSON.parse(salvo)
  } catch (err) {
    // ignora e usa padrão
  }
  return { notifEstoque: true, notifVencimento: true, notifProducao: false }
}

export function AppProvider({ children, usuarioInicial = null, tokenInicial = null }) {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [toast, setToast] = useState(null)
  const [fotoPerfil, setFotoPerfil] = useState(null)
  const [usuario, setUsuario] = useState(usuarioInicial)
  const timerRef = useRef(null)
  const [token, setToken] = useState(tokenInicial)

  const preferenciasIniciais = carregarPreferencias()
  const [notifEstoque, setNotifEstoque] = useState(preferenciasIniciais.notifEstoque)
  const [notifVencimento, setNotifVencimento] = useState(preferenciasIniciais.notifVencimento)
  const [notifProducao, setNotifProducao] = useState(preferenciasIniciais.notifProducao)

  useEffect(() => {
    localStorage.setItem(
      CHAVE_PREFERENCIAS,
      JSON.stringify({ notifEstoque, notifVencimento, notifProducao })
    )
  }, [notifEstoque, notifVencimento, notifProducao])

  const navigate = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  return (
    <AppContext.Provider value={{
      currentPage, navigate, toast, showToast,
      fotoPerfil, setFotoPerfil,
      usuario, setUsuario,
      token, setToken,
      notifEstoque, setNotifEstoque,
      notifVencimento, setNotifVencimento,
      notifProducao, setNotifProducao,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}