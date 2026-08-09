import { useState, useEffect } from "react"
import { useApp } from '../context/AppContext'
import {
  IconDashboard, IconBell, IconWheat, IconBox, IconClipboard,
  IconFactory, IconTruck, IconTrendingUp, IconSettings, IconLogo, IconLogout,
} from './Icons'


export default function Sidebar({ onLogout }) {
  const { currentPage, navigate, fotoPerfil } = useApp()
  const [totalAlertas, setTotalAlertas] = useState(0)

  useEffect(() => {
    fetch('http://localhost:3000/api/alertas')
      .then(r => r.json())
      .then(data => setTotalAlertas(data.length))
  }, [currentPage])


  const navItems = [
    {
      section: 'Principal',
      links: [
        { id: 'dashboard', icon: IconDashboard, label: 'Dashboard' },
        { id: 'alertas', icon: IconBell, label: 'Alertas', badge: totalAlertas },
      ],
    },
    {
      section: 'Estoque',
      links: [
        { id: 'insumos', icon: IconWheat, label: 'Matérias-primas' },
        { id: 'produtos', icon: IconBox, label: 'Produtos Acabados' },
      ],
    },
    {
      section: 'Produção',
      links: [
        { id: 'receitas', icon: IconClipboard, label: 'Fichas Técnicas' },
        { id: 'producao', icon: IconFactory, label: 'Ordens de Produção' },
      ],
    },
    {
      section: 'Gestão',
      links: [
        { id: 'fornecedores', icon: IconTruck, label: 'Fornecedores' },
        { id: 'relatorios', icon: IconTrendingUp, label: 'Relatórios' },
      ],
    },
    {
      section: 'Sistema',
      links: [
        { id: 'configuracoes', icon: IconSettings, label: 'Configurações' },
      ],
    },
  ]

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <h1 style={styles.brandTitle}>
          <span style={{ display: 'inline-flex', verticalAlign: '-6px', marginRight: 8 }}>
            <IconLogo width={22} height={22} />
          </span>
          Dany Massas
        </h1>
        <span style={styles.brandSub}>Controle de Estoque</span>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
        {navItems.map((group) => (
          <div key={group.section}>
            <div style={styles.navSection}>{group.section}</div>
            {group.links.map((link) => (
              <a
                key={link.id}
                style={{
                  ...styles.navLink,
                  ...(currentPage === link.id ? styles.navLinkActive : {}),
                }}
                onClick={() => navigate(link.id)}
              >
                <span style={styles.navIcon}>
                  <link.icon width={18} height={18} />
                </span>
                {link.label}
                {link.badge > 0 && (
                  <span style={styles.badge}>{link.badge}</span>
                )}
              </a>
            ))}
          </div>
        ))}
      </nav>

      {/* Rodapé da sidebar */}
      <div style={styles.bottomArea}>
        {/* Info do usuário + logout */}
        <div style={styles.userRow}>
          <div style={styles.userAvatar}>
            {fotoPerfil
              ? <img src={fotoPerfil} alt="Foto de perfil" style={styles.userAvatarFoto} />
              : 'D'}
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>Dany Massas</span>
            <span style={styles.userEmail}>dany@massas.com</span>
          </div>
          <button onClick={onLogout} style={styles.logoutBtn} title="Sair">
            <IconLogout width={16} height={16} />
          </button>
        </div>

        <div style={styles.versao}>v1.0.0 · MassaStock</div>
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-w)',
    background: 'var(--sidebar-bg)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    zIndex: 100,
    transition: 'background 0.3s',
  },
  brand: {
    padding: '28px 24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    flexShrink: 0,
  },
  brandTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    color: '#F7EDD8',
    letterSpacing: '0.5px',
    lineHeight: 1.2,
    display: 'flex',
    alignItems: 'center',
  },
  brandSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 300,
    color: '#D97B40',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    display: 'block',
    marginTop: 4,
  },
  navSection: {
    padding: '14px 24px 4px',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.2)',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 24px',
    color: 'rgba(247,237,216,0.55)',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: 500,
    cursor: 'pointer',
    borderLeft: '3px solid transparent',
    letterSpacing: '0.3px',
    transition: 'all 0.2s',
    userSelect: 'none',
  },
  navLinkActive: {
    color: '#F7EDD8',
    background: 'rgba(196,98,45,0.15)',
    borderLeft: '3px solid #C4622D',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    width: 20,
    justifyContent: 'center',
  },
  badge: {
    background: '#B03030',
    color: '#fff',
    marginLeft: 'auto',
    fontSize: '0.65rem',
    padding: '2px 8px',
    borderRadius: 10,
    fontWeight: 700,
  },

  // Bottom
  bottomArea: {
    borderTop: '1px solid rgba(255,255,255,0.07)',
    flexShrink: 0,
  },
  divisorSidebar: {
    height: 1,
    background: 'rgba(255,255,255,0.07)',
    margin: '0 20px',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--vinho)',
    color: '#F7EDD8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.9rem',
    fontFamily: "'Playfair Display', serif",
    flexShrink: 0,
    overflow: 'hidden',
  },
  userAvatarFoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'rgba(247,237,216,0.85)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    display: 'block',
    fontSize: '0.68rem',
    color: 'rgba(247,237,216,0.35)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(247,237,216,0.55)',
    opacity: 0.7,
    padding: 4,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
    flexShrink: 0,
  },
  versao: {
    padding: '8px 20px 14px',
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.15)',
    textAlign: 'center',
  },
}