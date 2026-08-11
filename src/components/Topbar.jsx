import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { IconAlertTriangle } from './Icons'


const pageTitles = {
  dashboard: 'Dashboard',
  alertas: 'Alertas',
  insumos: 'Matérias-primas',
  produtos: 'Produtos Acabados',
  receitas: 'Fichas Técnicas',
  producao: 'Ordens de Produção',
  fornecedores: 'Fornecedores',
  relatorios: 'Relatórios',
}

export default function Topbar() {
  const { currentPage, navigate, fotoPerfil, usuario } = useApp()
  const [totalAlertas, setTotalAlertas] = useState(0)

  useEffect(() => {
    fetch('http://localhost:3000/api/alertas')
      .then(r => r.json())
      .then(data => setTotalAlertas(data.length))
  }, [currentPage])

  const inicial = (usuario?.nome || 'D').trim().charAt(0).toUpperCase()
  const fotoExibida = fotoPerfil || (usuario?.fotoUrl ? `http://localhost:3000${usuario.fotoUrl}` : null)

  return (
    <header style={styles.topbar}>
      <h2 style={styles.title}>{pageTitles[currentPage]}</h2>
      <div style={styles.right}>
        <button style={styles.alertaBtn} onClick={() => navigate('alertas')}>
          <IconAlertTriangle width={14} height={14} />
          Alertas
          <span style={styles.badge}>{totalAlertas}</span>
        </button>
        <div style={styles.avatar} title={usuario?.nome}>
          {fotoExibida
            ? <img src={fotoExibida} alt="Foto de perfil" style={styles.avatarFoto} />
            : inicial}
        </div>
      </div>
    </header>
  )
}

const styles = {
  topbar: {
    background: 'var(--topbar-bg)',
    borderBottom: '1px solid var(--topbar-border)',
    padding: '0 32px',
    height: 62,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.25rem',
    color: 'var(--escuro)',
    fontWeight: 500,
  },
  right: { display: 'flex', gap: 12, alignItems: 'center' },
  alertaBtn: {
    background: 'var(--vermelho)',
    color: '#fff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: "'DM Sans', sans-serif",
  },
  badge: {
    background: '#fff',
    color: 'var(--vermelho)',
    borderRadius: '50%',
    width: 18,
    height: 18,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: 700,
  },
  avatar: {
    width: 36, height: 36,
    borderRadius: '50%',
    background: 'var(--vinho)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--creme)',
    fontWeight: 600,
    fontSize: '0.85rem',
    overflow: 'hidden',
  },
  avatarFoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
}