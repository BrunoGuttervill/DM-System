import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import ResetSenha from './pages/ResetSenha.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

function Root() {
  const [logado, setLogado] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)

  const params = new URLSearchParams(window.location.search)
  const tokenReset = params.get('token')

  const handleLogin = (dados) => {
    setToken(dados.token)
    setUsuario(dados.usuario)
    setLogado(true)
  }

  const handleLogout = () => {
    setLogado(false)
    setUsuario(null)
    setToken(null)
  }

  // Link de "esqueci minha senha" cai aqui, mesmo sem estar logado
  if (tokenReset) {
    return (
      <ThemeProvider>
        <ResetSenha token={tokenReset} />
      </ThemeProvider>
    )
  }

  if (!logado) {
    return (
      <ThemeProvider>
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <AppProvider usuarioInicial={usuario} tokenInicial={token}>
        <App onLogout={handleLogout} />
      </AppProvider>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)