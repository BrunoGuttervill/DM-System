import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import { AppProvider } from './context/AppContext.jsx'

function Root() {
  const [logado, setLogado] = useState(false)
  if (!logado) return <Login onLogin={() => setLogado(true)} />
  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)