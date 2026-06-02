import { useState } from 'react'

export default function Login({ onLogin }) {
  const [modo, setModo] = useState('login') 
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

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
    setTimeout(() => {
      setCarregando(false)
      setModo('confirmacao')
    }, 1200)
  }

  return (
    <div style={styles.shell}>
      <div style={styles.esquerdo}>
        <div style={styles.overlay} />
        <div style={styles.esquerdoConteudo}>
          <div style={styles.logo}>🍝</div>
          <h1 style={styles.marca}>Dany Massas</h1>
          <p style={styles.submarca}>Sistema de Gestão de Estoque</p>
          <div style={styles.destaques}>
            {['Controle de insumos em tempo real', 'Fichas técnicas e receitas', 'Alertas automáticos de estoque', 'Relatórios de produção'].map((t, i) => (
              <div key={i} style={styles.destaque}>
                <span style={styles.destaqueIcon}>✓</span>
                <span style={styles.destaqueTxt}>{t}</span>
              </div>
            ))}
          </div>
          <p style={styles.rodapeEsq}>Canoinhas · SC · Brasil</p>
        </div>
      </div>

      <div style={styles.direito}>
        <div style={styles.card}>

          {modo === 'login' && (
            <>
              <div style={styles.cabecalho}>
                <h2 style={styles.titulo}>Bem-vinda, Dany 👋</h2>
                <p style={styles.subtitulo}>Entre com suas credenciais para acessar o sistema</p>
              </div>

              <form onSubmit={handleLogin} style={styles.form}>
                <div style={styles.grupo}>
                  <label style={styles.label}>E-mail</label>
                  <div style={styles.inputWrap}>
                    <span style={styles.inputIcon}>✉️</span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      style={styles.input}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div style={styles.grupo}>
                  <label style={styles.label}>Senha</label>
                  <div style={styles.inputWrap}>
                    <span style={styles.inputIcon}>🔒</span>
                    <input
                      type={verSenha ? 'text' : 'password'}
                      value={senha}
                      onChange={e => setSenha(e.target.value)}
                      placeholder="••••••••"
                      style={{ ...styles.input, paddingRight: 44 }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setVerSenha(v => !v)}
                      style={styles.olho}
                      tabIndex={-1}
                    >
                      {verSenha ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {erro && <div style={styles.erro}>⚠️ {erro}</div>}

                <button type="submit" style={styles.btnPrimario} disabled={carregando}>
                  {carregando ? <span style={styles.spinner} /> : null}
                  {carregando ? 'Entrando...' : 'Entrar no sistema'}
                </button>
              </form>

              <button
                style={styles.linkBtn}
                onClick={() => { setModo('recuperar'); setErro('') }}
              >
                Esqueci minha senha
              </button>

              <p style={styles.hint}>
                <strong>Demo:</strong> dany@massas.com · 123456
              </p>
            </>
          )}

          {modo === 'recuperar' && (
            <>
              <button style={styles.voltar} onClick={() => { setModo('login'); setErro('') }}>
                ← Voltar
              </button>
              <div style={styles.cabecalho}>
                <div style={styles.iconeRecuperar}>🔑</div>
                <h2 style={styles.titulo}>Recuperar senha</h2>
                <p style={styles.subtitulo}>
                  Informe seu e-mail cadastrado e enviaremos um link para criar uma nova senha.
                </p>
              </div>

              <form onSubmit={handleRecuperar} style={styles.form}>
                <div style={styles.grupo}>
                  <label style={styles.label}>E-mail cadastrado</label>
                  <div style={styles.inputWrap}>
                    <span style={styles.inputIcon}>✉️</span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      style={styles.input}
                    />
                  </div>
                </div>

                {erro && <div style={styles.erro}>⚠️ {erro}</div>}

                <button type="submit" style={styles.btnPrimario} disabled={carregando}>
                  {carregando ? <span style={styles.spinner} /> : null}
                  {carregando ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>
            </>
          )}

          {modo === 'confirmacao' && (
            <div style={styles.confirmacaoWrap}>
              <div style={styles.confirmacaoIcone}>📬</div>
              <h2 style={styles.titulo}>E-mail enviado!</h2>
              <p style={styles.confirmacaoTxt}>
                Enviamos um link de recuperação para <strong>{email}</strong>.
                Verifique sua caixa de entrada (e o spam, caso não encontre).
              </p>
              <p style={styles.confirmacaoAviso}>
                O link expira em <strong>30 minutos</strong>.
              </p>
              <button
                style={styles.btnPrimario}
                onClick={() => { setModo('login'); setEmail(''); setErro('') }}
              >
                Voltar para o login
              </button>
            </div>
          )}

        </div>

        <p style={styles.rodapeDir}>v1.0.0 · MassaStock · © {new Date().getFullYear()}</p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

const INPUT_BASE = {
  width: '100%',
  padding: '11px 14px 11px 42px',
  border: '1.5px solid #EFE0BF',
  borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.9rem',
  color: '#3A2218',
  background: '#FEFBF5',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
}

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'DM Sans', sans-serif",
  },

  esquerdo: {
    width: '42%',
    background: '#1C100A',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(ellipse at 20% 20%, rgba(196,98,45,0.18) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 80%, rgba(107,26,42,0.25) 0%, transparent 55%)
    `,
    pointerEvents: 'none',
  },
  esquerdoConteudo: {
    position: 'relative',
    zIndex: 1,
    padding: '48px 40px',
    animation: 'fadeSlide 0.6s ease both',
  },
  logo: {
    fontSize: '3.5rem',
    marginBottom: 12,
  },
  marca: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.1rem',
    color: '#F7EDD8',
    fontWeight: 700,
    letterSpacing: '0.5px',
    lineHeight: 1.1,
    margin: '0 0 6px',
  },
  submarca: {
    fontSize: '0.75rem',
    fontWeight: 300,
    color: '#D97B40',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    margin: '0 0 40px',
  },
  destaques: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 48,
  },
  destaque: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  destaqueIcon: {
    width: 22,
    height: 22,
    background: 'rgba(196,98,45,0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    color: '#D97B40',
    flexShrink: 0,
  },
  destaqueTxt: {
    fontSize: '0.87rem',
    color: 'rgba(247,237,216,0.7)',
    fontWeight: 400,
  },
  rodapeEsq: {
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.18)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },

  direito: {
    flex: 1,
    background: '#F7EDD8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    position: 'relative',
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '40px 40px',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 4px 40px rgba(58,34,24,0.08)',
    border: '1px solid #EFE0BF',
    animation: 'fadeSlide 0.5s ease both',
  },

  cabecalho: {
    marginBottom: 28,
  },
  iconeRecuperar: {
    fontSize: '2.2rem',
    marginBottom: 10,
  },
  titulo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    color: '#1C100A',
    fontWeight: 700,
    margin: '0 0 8px',
  },
  subtitulo: {
    fontSize: '0.86rem',
    color: '#7A6A5A',
    margin: 0,
    lineHeight: 1.5,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  grupo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: '0.74rem',
    fontWeight: 600,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: '#7A6A5A',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 13,
    fontSize: '0.9rem',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  input: INPUT_BASE,
  olho: {
    position: 'absolute',
    right: 12,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontSize: '0.9rem',
    lineHeight: 1,
  },

  erro: {
    background: '#fdecea',
    color: '#B03030',
    border: '1px solid #f5c0c0',
    borderRadius: 8,
    padding: '9px 14px',
    fontSize: '0.83rem',
    fontWeight: 500,
  },

  btnPrimario: {
    marginTop: 6,
    padding: '13px 18px',
    background: '#6B1A2A',
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
    gap: 10,
    transition: 'background 0.18s, transform 0.1s',
    width: '100%',
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
    textDecoration: 'underline',
    textDecorationStyle: 'dotted',
    textUnderlineOffset: 3,
  },

  hint: {
    marginTop: 16,
    padding: '10px 14px',
    background: '#FEF8F0',
    border: '1px dashed #D97B40',
    borderRadius: 8,
    fontSize: '0.78rem',
    color: '#7A6A5A',
    textAlign: 'center',
    lineHeight: 1.5,
  },

  voltar: {
    background: 'none',
    border: 'none',
    color: '#7A6A5A',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.83rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0 0 20px',
    display: 'block',
  },

  confirmacaoWrap: {
    textAlign: 'center',
    animation: 'fadeSlide 0.4s ease both',
  },
  confirmacaoIcone: {
    fontSize: '3rem',
    marginBottom: 16,
  },
  confirmacaoTxt: {
    fontSize: '0.88rem',
    color: '#7A6A5A',
    lineHeight: 1.6,
    margin: '12px 0',
  },
  confirmacaoAviso: {
    fontSize: '0.82rem',
    color: '#C4622D',
    background: '#FEF8F0',
    border: '1px solid #EFE0BF',
    borderRadius: 8,
    padding: '8px 14px',
    margin: '16px 0 24px',
  },

  rodapeDir: {
    position: 'absolute',
    bottom: 20,
    fontSize: '0.72rem',
    color: 'rgba(58,34,24,0.3)',
    letterSpacing: '1px',
  },
}