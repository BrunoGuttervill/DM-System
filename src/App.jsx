import { useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Toast from './components/Toast'

import Dashboard    from './pages/Dashboard'
import Alertas      from './pages/Alertas'
import Insumos      from './pages/Insumos'
import Produtos     from './pages/Produtos'
import Receitas     from './pages/Receitas'
import Producao     from './pages/Producao'
import Vendas       from './pages/Vendas'
import Fornecedores from './pages/Fornecedores'
import Relatorios   from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'

const pages = {
  dashboard:      Dashboard,
  alertas:        Alertas,
  insumos:        Insumos,
  produtos:       Produtos,
  receitas:       Receitas,
  producao:       Producao,
  vendas:         Vendas,
  fornecedores:   Fornecedores,
  relatorios:     Relatorios,
  configuracoes:  Configuracoes,
}

export default function App({ onLogout }) {
  const { currentPage } = useApp()
  const PageComponent = pages[currentPage] || Dashboard

  return (
    <div className="app-shell">
      <Sidebar onLogout={onLogout} />
      <div className="main-area">
        <Topbar />
        <main className="page-content">
          <PageComponent key={currentPage} onLogout={onLogout} />
        </main>
      </div>
      <Toast />
    </div>
  )
}