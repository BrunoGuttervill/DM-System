import { useState } from 'react'

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
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const IconCheck = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconKey = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="M21 2l-9.6 9.6"/>
    <path d="M15.5 7.5l3 3L22 7l-3-3"/>
  </svg>
)

export default function ResetSenha({ token }) {
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [verConfirmar, setVerConfirmar] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (novaSenha.length < 6) { setErro('A senha precisa ter pelo menos 6 caracteres.'); return }
    if (novaSenha !== confirmarSenha) { setErro('As senhas não coincidem.'); return }

    setCarregando(true)
    try {
      const res = await fetch('http://localhost:3000/api/usuario/resetar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha }),
      })
      const dados = await res.json()
      setCarregando(false)

      if (!res.ok) {
        setErro(dados.error || 'Não foi possível redefinir a senha.')
        return
      }
      setSucesso(true)
    } catch (err) {
      setCarregando(false)
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  const irParaLogin = () => {
    window.location.href = window.location.pathname
  }

  return (
    <div style={s.shell}>
      <div style={s.card}>
        <div style={s.cardInner}>
          {!sucesso ? (
            <>
              <div style={s.iconCircle}><IconKey /></div>
              <div style={s.cardHeader}>
                <h2 style={s.titulo}>Criar nova senha</h2>
                <p style={s.subtitulo}>Escolha uma nova senha para acessar sua conta.</p>
              </div>

              <form onSubmit={handleSubmit} style={s.form}>
                <div style={s.grupo}>
                  <label style={s.label}>Nova senha</label>
                  <div style={s.fieldWrap}>
                    <span style={s.fieldIcon}><IconLock /></span>
                    <input
                      type={verSenha ? 'text' : 'password'}
                      value={novaSenha}
                      onChange={e => setNovaSenha(e.target.value)}
                      placeholder="Mín. 6 caracteres"
                      style={{ ...s.input, paddingRight: 46 }}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setVerSenha(v => !v)} style={s.eyeBtn} tabIndex={-1}>
                      {verSenha ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>
                </div>

                <div style={s.grupo}>
                  <label style={s.label}>Confirmar nova senha</label>
                  <div style={s.fieldWrap}>
                    <span style={s.fieldIcon}><IconLock /></span>
                    <input
                      type={verConfirmar ? 'text' : 'password'}
                      value={confirmarSenha}
                      onChange={e => setConfirmarSenha(e.target.value)}
                      placeholder="Repita a senha"
                      style={{ ...s.input, paddingRight: 46 }}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setVerConfirmar(v => !v)} style={s.eyeBtn} tabIndex={-1}>
                      {verConfirmar ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>
                </div>

                {erro && (
                  <div style={s.erroBox}>
                    <IconAlert />
                    <span>{erro}</span>
                  </div>
                )}

                <button type="submit" style={s.btnPrimario} disabled={carregando}>
                  {carregando ? 'Salvando...' : 'Redefinir senha'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={s.successCircle}><IconCheck /></div>
              <h2 style={{ ...s.titulo, marginBottom: 10 }}>Senha redefinida!</h2>
              <p style={{ ...s.subtitulo, marginBottom: 24, lineHeight: 1.7 }}>
                Sua senha foi alterada com sucesso. Já pode entrar no sistema com a nova senha.
              </p>
              <button style={s.btnPrimario} onClick={irParaLogin}>
                Ir para o login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
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
}

const s = {
  shell: {
    minHeight: '100vh',
    background: '#F5EAD5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 2px 40px rgba(58,34,24,0.09), 0 0 0 1px rgba(58,34,24,0.06)',
  },
  cardInner: { padding: '44px 40px' },
  iconCircle: {
    width: 52, height: 52, borderRadius: 14,
    background: 'rgba(196,98,45,0.08)',
    border: '1px solid rgba(196,98,45,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#C4622D', marginBottom: 20,
  },
  cardHeader: { marginBottom: 26 },
  titulo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem', color: '#1C100A', fontWeight: 700,
    margin: '0 0 8px', lineHeight: 1.2,
  },
  subtitulo: { fontSize: '0.86rem', color: '#8A7060', margin: 0, lineHeight: 1.6 },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  grupo: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: {
    fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.8px',
    textTransform: 'uppercase', color: '#8A7060',
  },
  fieldWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  fieldIcon: { position: 'absolute', left: 13, color: '#B09070', display: 'flex', pointerEvents: 'none' },
  input: INPUT,
  eyeBtn: {
    position: 'absolute', right: 12, background: 'none', border: 'none',
    cursor: 'pointer', color: '#B09070', padding: 4, display: 'flex',
  },
  erroBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#FEF1F1', color: '#A03030', border: '1px solid #F5CCCC',
    borderRadius: 9, padding: '9px 14px', fontSize: '0.83rem', fontWeight: 500,
  },
  btnPrimario: {
    marginTop: 4, padding: '13px 18px',
    background: 'linear-gradient(135deg, #6B1A2A 0%, #8C2236 100%)',
    color: '#F7EDD8', border: 'none', borderRadius: 10,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.92rem', fontWeight: 600,
    cursor: 'pointer', width: '100%', boxShadow: '0 4px 14px rgba(107,26,42,0.3)',
  },
  successCircle: {
    width: 64, height: 64, borderRadius: 18,
    background: 'rgba(61,122,79,0.08)', border: '1px solid rgba(61,122,79,0.18)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#3D7A4F', margin: '0 auto 22px',
  },
}