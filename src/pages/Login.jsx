import { useState } from 'react'
import { createPortal } from 'react-dom'

const IconMail = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
)
const IconLock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
  </svg>
)
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const IconKey = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="M21 2l-9.6 9.6"/>
    <path d="M15.5 7.5l3 3L22 7l-3-3"/>
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
)
const IconMail2 = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const IconSparkle = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6L12 17.2l-6.2 4.5 2.4-7.6L2 9.6h7.6z"/>
  </svg>
)
const IconWarehouse = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 20V8L12 2 2 8v12h20z"/>
    <path d="M9 20v-8h6v8"/>
    <path d="M2 8h20"/>
  </svg>
)
const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>
  </svg>
)
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const features = [
  'Controle de insumos em tempo real',
  'Fichas técnicas e receitas',
  'Alertas automáticos de estoque',
  'Relatórios de produção',
]

export default function Login({ onLogin }) {
  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [modalCadastro, setModalCadastro] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setErro('')
    if (!email || !senha) { setErro('Preencha todos os campos.'); return }
    setCarregando(true)
    setTimeout(() => {
      setCarregando(false)
      if (email === 'dany@massas.com' && senha === '123456') {
        onLogin?.()
      } else {
        setErro('E-mail ou senha incorretos.')
      }
    }, 1200)
  }

  const handleRecuperar = (e) => {
    e.preventDefault()
    setErro('')
    if (!email) { setErro('Digite seu e-mail.'); return }
    setCarregando(true)
    setTimeout(() => { setCarregando(false); setModo('confirmacao') }, 1200)
  }

  const handleContaCriada = (emailCriado) => {
    setEmail(emailCriado)
    setSenha('')
    setModalCadastro(false)
  }

  return (
    <div style={s.shell}>
      {}
      <div style={s.esquerdo}>
        <div style={s.grain} />
        <div style={s.glow1} />
        <div style={s.glow2} />

        <div style={s.esquerdoInner}>
          {}
          <div style={s.logoWrap}>
            <div style={s.logoIcon}>
              <IconWarehouse />
            </div>
            <div>
              <h1 style={s.marca}>Dany Massas</h1>
              <p style={s.submarca}>Sistema de Gestão de Estoque</p>
            </div>
          </div>

          {}
          <div style={s.divider} />

          {}
          <div style={s.featuresWrap}>
            <p style={s.featuresTitle}>Recursos incluídos</p>
            {features.map((f, i) => (
              <div key={i} style={s.featureRow}>
                <div style={s.featureDot}><IconCheck /></div>
                <span style={s.featureTxt}>{f}</span>
              </div>
            ))}
          </div>

          {}
          <div style={s.rodapeEsq}>
            <span style={s.badge}>
              <IconSparkle />
              v1.0.0
            </span>
            <span style={s.rodapeTxt}>Canoinhas · SC · Brasil</span>
          </div>
        </div>
      </div>

      {}
      <div style={s.direito}>
        <div style={s.card}>

          {}
          {modo === 'login' && (
            <div style={s.cardInner}>
              <div style={s.cardHeader}>
                <h2 style={s.titulo}>Bem-vinda de volta</h2>
                <p style={s.subtitulo}>Acesse o sistema com suas credenciais</p>
              </div>

              <form onSubmit={handleLogin} style={s.form}>
                <Field label="E-mail" icon={<IconMail />}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    style={s.input}
                    autoComplete="username"
                  />
                </Field>

                <Field label="Senha" icon={<IconLock />}>
                  <input
                    type={verSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...s.input, paddingRight: 46 }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setVerSenha(v => !v)}
                    style={s.eyeBtn}
                    tabIndex={-1}
                    aria-label="Mostrar/ocultar senha"
                  >
                    {verSenha ? <IconEyeOff /> : <IconEye />}
                  </button>
                </Field>

                {erro && (
                  <div style={s.erroBox}>
                    <IconAlert />
                    <span>{erro}</span>
                  </div>
                )}

                <button type="submit" style={s.btnPrimario} disabled={carregando}>
                  {carregando
                    ? <><span style={s.spinner} /> Entrando...</>
                    : 'Entrar no sistema'}
                </button>
              </form>

              <button
                style={s.linkBtn}
                onClick={() => { setModo('recuperar'); setErro('') }}
              >
                Esqueci minha senha
              </button>

              <p style={s.criarContaTxt}>
                Não tem conta?{' '}
                <button type="button" style={s.criarContaLink} onClick={() => setModalCadastro(true)}>
                  Criar conta
                </button>
              </p>
            </div>
          )}

          {}
          {modo === 'recuperar' && (
            <div style={s.cardInner}>
              <button style={s.voltarBtn} onClick={() => { setModo('login'); setErro('') }}>
                <IconArrowLeft />
                Voltar ao login
              </button>

              <div style={s.iconCircle}>
                <IconKey />
              </div>

              <div style={s.cardHeader}>
                <h2 style={s.titulo}>Recuperar senha</h2>
                <p style={s.subtitulo}>
                  Informe seu e-mail e enviaremos um link para criar uma nova senha.
                </p>
              </div>

              <form onSubmit={handleRecuperar} style={s.form}>
                <Field label="E-mail cadastrado" icon={<IconMail />}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    style={s.input}
                  />
                </Field>

                {erro && (
                  <div style={s.erroBox}>
                    <IconAlert />
                    <span>{erro}</span>
                  </div>
                )}

                <button type="submit" style={s.btnPrimario} disabled={carregando}>
                  {carregando
                    ? <><span style={s.spinner} /> Enviando...</>
                    : 'Enviar link de recuperação'}
                </button>
              </form>
            </div>
          )}

          {}
          {modo === 'confirmacao' && (
            <div style={{ ...s.cardInner, textAlign: 'center' }}>
              <div style={s.successCircle}>
                <IconMail2 />
              </div>
              <h2 style={{ ...s.titulo, marginBottom: 10 }}>E-mail enviado!</h2>
              <p style={{ ...s.subtitulo, marginBottom: 16, lineHeight: 1.7 }}>
                Enviamos um link para <strong style={{ color: 'var(--escuro, #1C100A)' }}>{email}</strong>.
                Verifique sua caixa de entrada.
              </p>
              <div style={s.avisoBox}>
                O link expira em <strong>30 minutos</strong>.
              </div>
              <button
                style={{ ...s.btnPrimario, marginTop: 24 }}
                onClick={() => { setModo('login'); setEmail(''); setErro('') }}
              >
                Voltar ao login
              </button>
            </div>
          )}

        </div>

        <p style={s.rodapeDir}>MassaStock © {new Date().getFullYear()} · v1.0.0</p>
      </div>

      {modalCadastro && (
        <ModalCadastro
          onClose={() => setModalCadastro(false)}
          onCriado={handleContaCriada}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalCadastroIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}

function Field({ label, icon, children }) {
  return (
    <div style={s.grupo}>
      <label style={s.label}>{label}</label>
      <div style={s.fieldWrap}>
        <span style={s.fieldIcon}>{icon}</span>
        {children}
      </div>
    </div>
  )
}

function ModalCadastro({ onClose, onCriado }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [verConfirmar, setVerConfirmar] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const validarEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) { setErro('Digite seu nome completo.'); return }
    if (!validarEmail(email)) { setErro('Digite um e-mail válido.'); return }
    if (senha.length < 6) { setErro('A senha precisa ter pelo menos 6 caracteres.'); return }
    if (senha !== confirmarSenha) { setErro('As senhas não coincidem.'); return }

    setCarregando(true)
    // Sem rota de cadastro no backend ainda — simula o fluxo por enquanto.
    setTimeout(() => {
      setCarregando(false)
      setSucesso(true)
    }, 1100)
  }

  return createPortal(
    <div style={s.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modalBox}>
        <button style={s.modalCloseBtn} onClick={onClose} aria-label="Fechar">
          <IconX />
        </button>

        {!sucesso ? (
          <div style={s.modalInner}>
            <div style={s.cardHeader}>
              <h2 style={s.titulo}>Criar sua conta</h2>
              <p style={s.subtitulo}>Preencha os dados abaixo para começar a usar o sistema</p>
            </div>

            <form onSubmit={handleSubmit} style={s.form}>
              <Field label="Nome completo" icon={<IconUser />}>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Seu nome"
                  style={s.input}
                  autoComplete="name"
                />
              </Field>

              <Field label="E-mail" icon={<IconMail />}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={s.input}
                  autoComplete="email"
                />
              </Field>

              <div style={s.formRowModal}>
                <Field label="Senha" icon={<IconLock />}>
                  <input
                    type={verSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder="Mín. 6 caracteres"
                    style={{ ...s.input, paddingRight: 42 }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setVerSenha(v => !v)}
                    style={s.eyeBtn}
                    tabIndex={-1}
                    aria-label="Mostrar/ocultar senha"
                  >
                    {verSenha ? <IconEyeOff /> : <IconEye />}
                  </button>
                </Field>

                <Field label="Confirmar senha" icon={<IconLock />}>
                  <input
                    type={verConfirmar ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                    style={{ ...s.input, paddingRight: 42 }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setVerConfirmar(v => !v)}
                    style={s.eyeBtn}
                    tabIndex={-1}
                    aria-label="Mostrar/ocultar senha"
                  >
                    {verConfirmar ? <IconEyeOff /> : <IconEye />}
                  </button>
                </Field>
              </div>

              {erro && (
                <div style={s.erroBox}>
                  <IconAlert />
                  <span>{erro}</span>
                </div>
              )}

              <button type="submit" style={s.btnPrimario} disabled={carregando}>
                {carregando
                  ? <><span style={s.spinner} /> Criando conta...</>
                  : 'Criar conta'}
              </button>
            </form>

            <p style={s.criarContaTxt}>
              Já tem conta?{' '}
              <button type="button" style={s.criarContaLink} onClick={onClose}>
                Fazer login
              </button>
            </p>
          </div>
        ) : (
          <div style={{ ...s.modalInner, textAlign: 'center' }}>
            <div style={s.successCircle}>
              <IconCheck />
            </div>
            <h2 style={{ ...s.titulo, marginBottom: 10 }}>Conta criada!</h2>
            <p style={{ ...s.subtitulo, marginBottom: 20, lineHeight: 1.7 }}>
              Sua conta foi criada com <strong style={{ color: '#1C100A' }}>{email}</strong>.
              Já pode entrar no sistema.
            </p>
            <button style={s.btnPrimario} onClick={() => onCriado(email)}>
              Ir para o login
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

const INPUT = {
  width: '100%',
  padding: '11px 14px 11px 44px',
  border: '1.5px solid #E4D8C4',
  borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.9rem',
  color: '#2A1810',
  background: '#FEFBF7',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const s = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'DM Sans', sans-serif",
  },

  esquerdo: {
    width: '40%',
    background: '#140D08',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  grain: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
    opacity: 0.4,
    pointerEvents: 'none',
  },
  glow1: {
    position: 'absolute',
    top: '-20%', left: '-15%',
    width: '70%', height: '70%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(196,98,45,0.14) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glow2: {
    position: 'absolute',
    bottom: '-20%', right: '-15%',
    width: '60%', height: '60%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(107,26,42,0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  esquerdoInner: {
    position: 'relative',
    zIndex: 1,
    padding: '48px 44px',
    width: '100%',
    animation: 'fadeUp 0.7s ease both',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 36,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    background: 'rgba(196,98,45,0.12)',
    border: '1px solid rgba(196,98,45,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#D97B40',
    flexShrink: 0,
  },
  marca: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.55rem',
    color: '#F7EDD8',
    fontWeight: 700,
    letterSpacing: '0.3px',
    margin: '0 0 3px',
    lineHeight: 1.2,
  },
  submarca: {
    fontSize: '0.72rem',
    color: '#C4622D',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    fontWeight: 500,
    margin: 0,
  },
  divider: {
    height: 1,
    background: 'linear-gradient(90deg, rgba(196,98,45,0.3) 0%, transparent 100%)',
    marginBottom: 32,
  },
  featuresWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginBottom: 48,
  },
  featuresTitle: {
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'rgba(247,237,216,0.3)',
    margin: '0 0 4px',
  },
  featureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 22,
    height: 22,
    borderRadius: 6,
    background: 'rgba(61,122,79,0.15)',
    border: '1px solid rgba(61,122,79,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#5BAF70',
    flexShrink: 0,
  },
  featureTxt: {
    fontSize: '0.87rem',
    color: 'rgba(247,237,216,0.65)',
    fontWeight: 400,
  },
  rodapeEsq: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    background: 'rgba(196,98,45,0.12)',
    border: '1px solid rgba(196,98,45,0.2)',
    color: '#C4622D',
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 20,
    letterSpacing: '0.5px',
  },
  rodapeTxt: {
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.18)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },

  direito: {
    flex: 1,
    background: '#F5EAD5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    position: 'relative',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 2px 40px rgba(58,34,24,0.09), 0 0 0 1px rgba(58,34,24,0.06)',
    overflow: 'hidden',
  },
  cardInner: {
    padding: '40px 40px',
    animation: 'fadeUp 0.4s ease both',
  },
  cardHeader: {
    marginBottom: 28,
  },
  titulo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.55rem',
    color: '#1C100A',
    fontWeight: 700,
    margin: '0 0 8px',
    lineHeight: 1.2,
  },
  subtitulo: {
    fontSize: '0.86rem',
    color: '#8A7060',
    margin: 0,
    lineHeight: 1.6,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  formRowModal: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },
  grupo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  label: {
    fontSize: '0.73rem',
    fontWeight: 600,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: '#8A7060',
  },
  fieldWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  fieldIcon: {
    position: 'absolute',
    left: 13,
    color: '#B09070',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  input: INPUT,
  eyeBtn: {
    position: 'absolute',
    right: 12,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#B09070',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 4,
    transition: 'color 0.15s',
  },

  erroBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#FEF1F1',
    color: '#A03030',
    border: '1px solid #F5CCCC',
    borderRadius: 9,
    padding: '9px 14px',
    fontSize: '0.83rem',
    fontWeight: 500,
  },

  btnPrimario: {
    marginTop: 4,
    padding: '13px 18px',
    background: 'linear-gradient(135deg, #6B1A2A 0%, #8C2236 100%)',
    color: '#F7EDD8',
    border: 'none',
    borderRadius: 10,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.92rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    width: '100%',
    letterSpacing: '0.3px',
    boxShadow: '0 4px 14px rgba(107,26,42,0.3)',
    transition: 'opacity 0.15s, transform 0.1s',
  },

  spinner: {
    width: 16,
    height: 16,
    border: '2px solid rgba(247,237,216,0.3)',
    borderTopColor: '#F7EDD8',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
    flexShrink: 0,
  },

  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#C4622D',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '14px 0 0',
    display: 'block',
    width: '100%',
    textAlign: 'center',
    textDecoration: 'none',
    letterSpacing: '0.1px',
  },

  demoBox: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '12px 16px',
    background: '#FEFBF5',
    border: '1px dashed #D4AA78',
    borderRadius: 10,
    textAlign: 'center',
  },
  demoLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#B09070',
  },
  demoVal: {
    fontSize: '0.82rem',
    color: '#5A3A25',
    fontWeight: 500,
    fontFamily: "'DM Mono', 'Courier New', monospace",
  },

  criarContaTxt: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: '0.83rem',
    color: '#8A7060',
  },
  criarContaLink: {
    background: 'none',
    border: 'none',
    color: '#C4622D',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.83rem',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },

  rodapeDir: {
    position: 'absolute',
    bottom: 20,
    fontSize: '0.72rem',
    color: 'rgba(58,34,24,0.3)',
    letterSpacing: '1px',
  },

  voltarBtn: {
    background: 'none',
    border: 'none',
    color: '#8A7060',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.83rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0 0 22px',
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    transition: 'color 0.15s',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: 'rgba(196,98,45,0.08)',
    border: '1px solid rgba(196,98,45,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#C4622D',
    marginBottom: 20,
  },

  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 18,
    background: 'rgba(61,122,79,0.08)',
    border: '1px solid rgba(61,122,79,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3D7A4F',
    margin: '0 auto 22px',
  },
  avisoBox: {
    fontSize: '0.82rem',
    color: '#C4622D',
    background: '#FEF6EE',
    border: '1px solid #F0D4B8',
    borderRadius: 9,
    padding: '10px 16px',
    marginTop: 4,
  },

  // Modal de cadastro
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(20,13,8,0.55)',
    backdropFilter: 'blur(3px)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    animation: 'overlayIn 0.18s ease',
  },
  modalBox: {
    position: 'relative',
    background: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 480,
    maxHeight: '92vh',
    overflowY: 'auto',
    boxShadow: '0 12px 48px rgba(20,13,8,0.35)',
    animation: 'modalCadastroIn 0.22s cubic-bezier(.2,.8,.3,1)',
  },
  modalInner: {
    padding: '40px 36px 36px',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(28,16,10,0.05)',
    border: 'none',
    cursor: 'pointer',
    color: '#8A7060',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s, color 0.15s',
    zIndex: 1,
  },
}