import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  {
    section: 'Principal',
    links: [
      { id: 'dashboard',    icon: '📊', label: 'Dashboard'          },
      { id: 'alertas',      icon: '🔔', label: 'Alertas', badge: 3  },
    ],
  },
  {
    section: 'Estoque',
    links: [
      { id: 'insumos',   icon: '🌾', label: 'Matérias-primas'   },
      { id: 'produtos',  icon: '📦', label: 'Produtos Acabados'  },
    ],
  },
  {
    section: 'Produção',
    links: [
      { id: 'receitas',  icon: '📋', label: 'Fichas Técnicas'    },
      { id: 'producao',  icon: '🏭', label: 'Ordens de Produção' },
    ],
  },
  {
    section: 'Gestão',
    links: [
      { id: 'fornecedores',  icon: '🚚', label: 'Fornecedores' },
      { id: 'relatorios',    icon: '📈', label: 'Relatórios'   },
    ],
  },
  {
    section: 'Sistema',
    links: [
      { id: 'configuracoes', icon: '⚙️', label: 'Configurações' },
    ],
  },
]

export default function Sidebar({ onLogout }) {
  const { currentPage, navigate } = useApp()
  const { tema, toggleTema } = useTheme()

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <h1 style={styles.brandTitle}>🍝 Dany Massas</h1>
        <span style={styles.brandSub}>Controle de Estoque</span>
      </div>

      <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
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
                <span style={styles.navIcon}>{link.icon}</span>
                {link.label}
                {link.badge && (
                  <span style={styles.badge}>{link.badge}</span>
                )}
              </a>
            ))}
          </div>
        ))}
      </nav>

      {/* Rodapé da sidebar */}
      <div style={styles.bottomArea}>
        {/* Toggle de tema */}
        <button onClick={toggleTema} style={styles.temaToggle}>
          <span style={styles.temaIcones}>
            <span style={{ opacity: tema === 'claro' ? 1 : 0.4 }}>☀️</span>
            <span style={styles.temaTrack}>
              <span style={{
                ...styles.temaKnob,
                transform: tema === 'escuro' ? 'translateX(18px)' : 'translateX(1px)',
              }} />
            </span>
            <span style={{ opacity: tema === 'escuro' ? 1 : 0.4 }}>🌙</span>
          </span>
          <span style={styles.temaLabel}>{tema === 'claro' ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>

        <div style={styles.divisorSidebar} />

        {/* Info do usuário + logout */}
        <div style={styles.userRow}>
          <div style={styles.userAvatar}>D</div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>Dany Massas</span>
            <span style={styles.userEmail}>dany@massas.com</span>
          </div>
          <button onClick={onLogout} style={styles.logoutBtn} title="Sair">
            🚪
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
    fontSize: '1rem',
    width: 20,
    textAlign: 'center',
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
  temaToggle: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: 'none',
    padding: '12px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    transition: 'background 0.18s',
  },
  temaIcones: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: '0.9rem',
  },
  temaTrack: {
    width: 28,
    height: 16,
    borderRadius: 8,
    background: 'rgba(196,98,45,0.5)',
    position: 'relative',
    display: 'inline-block',
    flexShrink: 0,
  },
  temaKnob: {
    position: 'absolute',
    top: 1,
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: '#F7EDD8',
    transition: 'transform 0.22s cubic-bezier(.4,0,.2,1)',
    display: 'block',
  },
  temaLabel: {
    fontSize: '0.78rem',
    color: 'rgba(247,237,216,0.6)',
    fontFamily: "'DM Sans', sans-serif",
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
    fontSize: '1rem',
    opacity: 0.5,
    padding: 4,
    borderRadius: 6,
    transition: 'opacity 0.2s',
    flexShrink: 0,
    title: 'Sair',
  },
  versao: {
    padding: '8px 20px 14px',
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.15)',
    textAlign: 'center',
  },
}