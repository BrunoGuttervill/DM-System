import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

function Root() {
  const [logado, setLogado] = useState(false)

  const handleLogout = () => setLogado(false)

  if (!logado) {
    return (
      <ThemeProvider>
        <Login onLogin={() => setLogado(true)} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <AppProvider>
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