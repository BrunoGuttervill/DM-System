import { createContext, useContext, useState, useCallback, useRef } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children, usuarioInicial = null, tokenInicial = null }) {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [toast, setToast] = useState(null)
  const [fotoPerfil, setFotoPerfil] = useState(null)
  const [usuario, setUsuario] = useState(usuarioInicial)
  const timerRef = useRef(null)
  const [token, setToken] = useState(tokenInicial)

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
      token, setToken
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}