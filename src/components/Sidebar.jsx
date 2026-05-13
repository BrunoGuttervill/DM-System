import { useApp } from '../context/AppContext'

const navItems = [
  {
    section: 'Principal',
    links: [
      { id: 'dashboard',    icon: '📊', label: 'Dashboard'         },
      { id: 'alertas',      icon: '🔔', label: 'Alertas', badge: 3 },
    ],
  },
  {
    section: 'Estoque',
    links: [
      { id: 'insumos',   icon: '🌾', label: 'Matérias-primas'  },
      { id: 'produtos',  icon: '📦', label: 'Produtos Acabados' },
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
      { id: 'fornecedores', icon: '🚚', label: 'Fornecedores' },
      { id: 'relatorios',   icon: '📈', label: 'Relatórios'   },
    ],
  },
]

export default function Sidebar() {
  const { currentPage, navigate } = useApp()

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <h1 style={styles.brandTitle}>🍝 Dany Massas</h1>
        <span style={styles.brandSub}>Controle de Estoque</span>
      </div>

      <nav style={{ flex: 1, padding: '16px 0' }}>
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

      <div style={styles.footer}>v1.0.0 · MassaStock</div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-w)',
    background: 'var(--escuro)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    zIndex: 100,
  },
  brand: {
    padding: '28px 24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  brandTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    color: 'var(--creme)',
    letterSpacing: '0.5px',
    lineHeight: 1.2,
  },
  brandSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 300,
    color: 'var(--terra2)',
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
    color: 'var(--creme)',
    background: 'rgba(196,98,45,0.15)',
    borderLeft: '3px solid var(--terra)',
  },
  navIcon: {
    fontSize: '1rem',
    width: 20,
    textAlign: 'center',
  },
  badge: {
    background: 'var(--vermelho)',
    color: '#fff',
    marginLeft: 'auto',
    fontSize: '0.65rem',
    padding: '2px 8px',
    borderRadius: 10,
    fontWeight: 700,
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.2)',
  },
}