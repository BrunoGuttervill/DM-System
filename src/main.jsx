import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

function Root() {
  const [logado, setLogado] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)

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