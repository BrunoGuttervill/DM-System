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
import Fornecedores from './pages/Fornecedores'
import Relatorios   from './pages/Relatorios'

const pages = {
  dashboard:    Dashboard,
  alertas:      Alertas,
  insumos:      Insumos,
  produtos:     Produtos,
  receitas:     Receitas,
  producao:     Producao,
  fornecedores: Fornecedores,
  relatorios:   Relatorios,
}

export default function App() {
  const { currentPage } = useApp()
  const PageComponent = pages[currentPage] || Dashboard

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <main className="page-content">
          <PageComponent key={currentPage} />
        </main>
      </div>
      <Toast />
    </div>
  )
}