import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'
import {
  IconPalette, IconWheat, IconClock, IconFactory,
  IconKey, IconSmartphone, IconBox, IconTrash,
  IconInfo, IconLogout, IconSun, IconMoon, IconEdit,
} from '../components/Icons'

function Secao({ titulo, children }) {
  return (
    <div style={s.secao}>
      <h3 style={s.secaoTitulo}>{titulo}</h3>
      <div style={s.secaoCard}>{children}</div>
    </div>
  )
}

function Linha({ icone, label, descricao, children, danger }) {
  return (
    <div style={{ ...s.linha, ...(danger ? s.linhaDanger : {}) }}>
      <div style={s.linhaLeft}>
        <span style={{ ...s.linhaIcone, ...(danger ? s.iconeRed : {}) }}>{icone}</span>
        <div>
          <div style={{ ...s.linhaLabel, ...(danger ? s.labelRed : {}) }}>{label}</div>
          {descricao && <div style={s.linhaDesc}>{descricao}</div>}
        </div>
      </div>
      <div style={s.linhaRight}>{children}</div>
    </div>
  )
}

function Toggle({ ativo, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={ativo}
      onClick={onChange}
      style={{
        ...s.toggle,
        background: ativo ? 'var(--vinho)' : 'var(--creme2)',
      }}
    >
      <span style={{
        ...s.toggleKnob,
        transform: ativo ? 'translateX(22px)' : 'translateX(2px)',
      }} />
    </button>
  )
}

function BotaoTema({ icone, label, ativo, onClick }) {
  return (
    <button onClick={onClick} style={{
      ...s.temaBtn,
      borderColor: ativo ? 'var(--terra)' : 'var(--border)',
      background: ativo ? 'rgba(196,98,45,0.08)' : 'var(--bg-input)',
    }}>
      <span style={s.temaBtnIcone}>{icone}</span>
      <span style={{ ...s.temaBtnLabel, color: ativo ? 'var(--terra)' : 'var(--cinza)', fontWeight: ativo ? 700 : 500 }}>
        {label}
      </span>
      {ativo && <span style={s.temaBtnAtivo}>✓</span>}
    </button>
  )
}

function ModalTrocarSenha({ usuarioId, onClose }) {
  const { showToast } = useApp()
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const salvar = async () => {
    setErro('')
    if (!senhaAtual) { setErro('Digite sua senha atual.'); return }
    if (novaSenha.length < 6) { setErro('A nova senha precisa ter pelo menos 6 caracteres.'); return }
    if (novaSenha !== confirmarSenha) { setErro('As senhas não coincidem.'); return }

    setSalvando(true)
    try {
      const res = await fetch(`http://localhost:3000/api/usuario/${usuarioId}/senha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      })
      const dados = await res.json()

      if (!res.ok) {
        setErro(dados.error || dados.erro || 'Não foi possível trocar a senha.')
        setSalvando(false)
        return
      }

      onClose()
      showToast('✅ Senha alterada com sucesso!')
    } catch (err) {
      setErro('Não foi possível conectar ao servidor.')
      setSalvando(false)
    }
  }

  return (
    <Modal title="Alterar senha" onClose={onClose}>
      <div className="form-group">
        <label>Senha atual</label>
        <input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} placeholder="••••••••" />
      </div>
      <div className="form-group">
        <label>Nova senha</label>
        <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Mín. 6 caracteres" />
      </div>
      <div className="form-group">
        <label>Confirmar nova senha</label>
        <input type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} placeholder="Repita a nova senha" />
      </div>
      {erro && <span className="form-error">{erro}</span>}
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className="btn btn-primary" onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </div>
    </Modal>
  )
}

function ModalLimparCache({ onClose }) {
  const [limpando, setLimpando] = useState(false)

  const confirmar = async () => {
    setLimpando(true)
    try {
      localStorage.clear()
      sessionStorage.clear()
      if ('caches' in window) {
        const chaves = await caches.keys()
        await Promise.all(chaves.map(k => caches.delete(k)))
      }
    } finally {
      window.location.reload()
    }
  }

  return (
    <Modal title="Limpar cache do sistema?" onClose={onClose}>
      <p style={{ fontSize: '0.9rem', color: 'var(--texto)', lineHeight: 1.6, marginBottom: 8 }}>
        Isso remove dados temporários salvos no navegador (incluindo a preferência de tema claro/escuro)
        e recarrega a página. Não afeta os dados salvos no banco (insumos, produtos, fornecedores etc.).
      </p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={limpando}>Cancelar</button>
        <button className="btn btn-primary" onClick={confirmar} disabled={limpando}>
          {limpando ? 'Limpando...' : 'Sim, limpar'}
        </button>
      </div>
    </Modal>
  )
}

export default function Configuracoes({ onLogout }) {
  const { tema, definirTema } = useTheme()
  const { showToast, fotoPerfil, setFotoPerfil, usuario, setUsuario } = useApp()

  const [notifEstoque, setNotifEstoque] = useState(true)
  const [notifVencimento, setNotifVencimento] = useState(true)
  const [notifProducao, setNotifProducao] = useState(false)
  const [modalLogout, setModalLogout] = useState(false)
  const [modalSenha, setModalSenha] = useState(false)
  const [modalCache, setModalCache] = useState(false)
  const inputFotoRef = useRef(null)

  const nomeCompletoInicial = usuario?.nome || 'Dany Massas'
  const [primeiroNomeInicial, ...restoInicial] = nomeCompletoInicial.trim().split(' ')

  const [primeiroNome, setPrimeiroNome] = useState(primeiroNomeInicial)
  const [sobrenome, setSobrenome] = useState(restoInicial.join(' '))
  const [emailCampo, setEmailCampo] = useState(usuario?.email || 'dany@massas.com')
  const [salvandoPerfil, setSalvandoPerfil] = useState(false)

  const inicialAvatar = (usuario?.nome || 'D').trim().charAt(0).toUpperCase()

  const escolherFoto = () => inputFotoRef.current?.click()

  const handleFotoSelecionada = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('❌ Selecione um arquivo de imagem válido.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('❌ A imagem deve ter até 5MB.')
      return
    }

    const url = URL.createObjectURL(file)
    setFotoPerfil(url)
    showToast('✅ Foto de perfil atualizada!')
    e.target.value = '' // permite selecionar o mesmo arquivo de novo depois
  }

  const salvar = async () => {
    if (!primeiroNome.trim()) { showToast('⚠️ Digite seu nome.'); return }
    if (!emailCampo.trim()) { showToast('⚠️ Digite um e-mail.'); return }

    if (!usuario?.id) {
      showToast('❌ Não foi possível identificar o usuário logado.')
      return
    }

    const nomeCompleto = `${primeiroNome.trim()} ${sobrenome.trim()}`.trim()

    setSalvandoPerfil(true)
    try {
      const res = await fetch(`http://localhost:3000/api/usuario/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeCompleto, email: emailCampo.trim() }),
      })
      const dados = await res.json()

      if (!res.ok) {
        showToast(dados.error || dados.erro || '❌ Não foi possível salvar as alterações.')
        return
      }

      // Atualiza o contexto global — Sidebar, Topbar e aqui mesmo refletem na hora
      setUsuario(u => ({ ...u, ...dados }))
      showToast('✅ Configurações salvas!')
    } catch (err) {
      showToast('❌ Não foi possível conectar ao servidor.')
    } finally {
      setSalvandoPerfil(false)
    }
  }

  return (
    <div className="page-fade" style={s.page}>

      {}
      <div style={s.header}>
        <div>
          <h2 style={s.headerTitulo}>Configurações</h2>
          <p style={s.headerSub}>Preferências do sistema e da conta</p>
        </div>
      </div>

      {}
      <Secao titulo="Perfil">
        <div style={s.perfilWrap}>
          <div style={s.avatar}>
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="Foto de perfil" style={s.avatarFoto} />
            ) : (
              <span style={s.avatarLetra}>{inicialAvatar}</span>
            )}
            <button style={s.avatarEdit} title="Trocar foto" onClick={escolherFoto}>
              <IconEdit width={12} height={12} />
            </button>
            <input
              ref={inputFotoRef}
              type="file"
              accept="image/*"
              onChange={handleFotoSelecionada}
              style={{ display: 'none' }}
            />
          </div>
          <div style={s.perfilInfo}>
            <div style={s.formRow}>
              <div style={s.grupo}>
                <label style={s.label}>Nome</label>
                <input style={s.input} value={primeiroNome} onChange={e => setPrimeiroNome(e.target.value)} />
              </div>
              <div style={s.grupo}>
                <label style={s.label}>Sobrenome</label>
                <input style={s.input} value={sobrenome} onChange={e => setSobrenome(e.target.value)} />
              </div>
            </div>
            <div style={s.grupo}>
              <label style={s.label}>E-mail</label>
              <input style={s.input} value={emailCampo} onChange={e => setEmailCampo(e.target.value)} type="email" />
            </div>
            <div style={s.grupo}>
              <label style={s.label}>Empresa</label>
              <input style={s.input} defaultValue="Dany Massas — Canoinhas SC" />
            </div>
          </div>
        </div>
      </Secao>

      {}
      <Secao titulo="Aparência">
        <Linha icone={<IconPalette width={18} height={18} />} label="Tema do sistema" descricao="Escolha entre o modo claro e escuro">
          <div style={s.temaBtns}>
            <BotaoTema icone={<IconSun width={15} height={15} />}  label="Claro"  ativo={tema === 'claro'}  onClick={() => definirTema('claro')} />
            <BotaoTema icone={<IconMoon width={15} height={15} />} label="Escuro" ativo={tema === 'escuro'} onClick={() => definirTema('escuro')} />
          </div>
        </Linha>
      </Secao>

      {}
      <Secao titulo="Notificações">
        <Linha icone={<IconWheat width={18} height={18} />} label="Alertas de estoque baixo" descricao="Avisa quando um insumo atinge o nível mínimo">
          <Toggle ativo={notifEstoque} onChange={() => setNotifEstoque(v => !v)} />
        </Linha>
        <div style={s.divisor} />
        <Linha icone={<IconClock width={18} height={18} />} label="Avisos de vencimento" descricao="Notifica sobre insumos próximos da validade">
          <Toggle ativo={notifVencimento} onChange={() => setNotifVencimento(v => !v)} />
        </Linha>
        <div style={s.divisor} />
        <Linha icone={<IconFactory width={18} height={18} />} label="Confirmação de produção" descricao="Solicita confirmação ao registrar uma ordem">
          <Toggle ativo={notifProducao} onChange={() => setNotifProducao(v => !v)} />
        </Linha>
      </Secao>

      {}
      <Secao titulo="Segurança">
        <Linha icone={<IconKey width={18} height={18} />} label="Alterar senha" descricao="Redefina sua senha de acesso">
          <button className="btn btn-secondary btn-sm" onClick={() => setModalSenha(true)}>
            Redefinir
          </button>
        </Linha>
        <div style={s.divisor} />
        <Linha icone={<IconSmartphone width={18} height={18} />} label="Autenticação em dois fatores" descricao="Adicione uma camada extra de segurança">
          <button className="btn btn-secondary btn-sm" onClick={() => showToast('🚧 Em breve!')}>
            Configurar
          </button>
        </Linha>
      </Secao>

      {}
      <Secao titulo="Sistema">
        <Linha icone={<IconBox width={18} height={18} />} label="Exportar dados" descricao="Baixe todo o estoque em CSV/Excel">
          <button className="btn btn-secondary btn-sm" onClick={() => showToast('📥 Exportando...')}>
            Exportar
          </button>
        </Linha>
        <div style={s.divisor} />
        <Linha icone={<IconTrash width={18} height={18} />} label="Limpar cache do sistema" descricao="Remove dados temporários armazenados localmente">
          <button className="btn btn-secondary btn-sm" onClick={() => setModalCache(true)}>
            Limpar
          </button>
        </Linha>
        <div style={s.divisor} />
        <Linha icone={<IconInfo width={18} height={18} />} label="Versão do sistema" descricao="MassaStock v1.0.0 · Build 2026">
          <span style={s.versao}>v1.0.0</span>
        </Linha>
      </Secao>

      {}
      <Secao titulo="Zona de Perigo">
        <Linha icone={<IconLogout width={18} height={18} />} label="Sair da conta" descricao="Encerra a sessão atual" danger>
          <button
            style={s.btnLogout}
            onClick={() => setModalLogout(true)}
          >
            Sair
          </button>
        </Linha>
      </Secao>

      {}
      <div style={s.rodape}>
        <button className="btn btn-primary" style={s.btnSalvarRodape} onClick={salvar} disabled={salvandoPerfil}>
          {salvandoPerfil ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>

      {}
      {modalCache && (
        <ModalLimparCache onClose={() => setModalCache(false)} />
      )}

      {}
      {modalSenha && usuario?.id && (
        <ModalTrocarSenha usuarioId={usuario.id} onClose={() => setModalSenha(false)} />
      )}

      {}
      {modalLogout && createPortal(
        <div style={s.modalOverlay} onClick={e => e.target === e.currentTarget && setModalLogout(false)}>
          <div style={s.modalBox}>
            <div style={s.modalIcone}><IconLogout width={40} height={40} /></div>
            <h3 style={s.modalTitulo}>Sair da conta?</h3>
            <p style={s.modalTexto}>
              Você será desconectada do sistema. Todas as alterações não salvas serão perdidas.
            </p>
            <div style={s.modalAcoes}>
              <button className="btn btn-secondary" onClick={() => setModalLogout(false)}>
                Cancelar
              </button>
              <button style={s.btnLogoutModal} onClick={onLogout}>
                Sim, sair
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

const s = {
  page: {
    maxWidth: 720,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  headerTitulo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.6rem',
    color: 'var(--escuro)',
    margin: '0 0 4px',
  },
  headerSub: {
    fontSize: '0.85rem',
    color: 'var(--cinza)',
    margin: 0,
  },

  secao: {
    marginBottom: 28,
  },
  secaoTitulo: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--cinza)',
    marginBottom: 10,
  },
  secaoCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    overflow: 'hidden',
  },

  linha: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    gap: 16,
  },
  linhaDanger: {
    background: 'rgba(176,48,48,0.04)',
  },
  linhaLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  linhaIcone: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--terra)',
    flexShrink: 0,
  },
  iconeRed: { color: 'var(--vermelho)' },
  linhaLabel: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--escuro)',
    marginBottom: 2,
  },
  labelRed: { color: 'var(--vermelho)' },
  linhaDesc: {
    fontSize: '0.78rem',
    color: 'var(--cinza)',
    lineHeight: 1.4,
  },
  linhaRight: {
    flexShrink: 0,
  },

  divisor: {
    height: 1,
    background: 'var(--border)',
    margin: '0 20px',
    opacity: 0.6,
  },

  perfilWrap: {
    display: 'flex',
    gap: 28,
    padding: '24px 20px',
    alignItems: 'flex-start',
  },
  avatar: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarLetra: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'var(--vinho)',
    color: 'var(--creme)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    userSelect: 'none',
  },
  avatarFoto: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    objectFit: 'cover',
    display: 'block',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'var(--terra)',
    border: '2px solid var(--bg-card)',
    cursor: 'pointer',
    fontSize: '0.65rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfilInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  grupo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  label: {
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: 'var(--cinza)',
  },
  input: {
    padding: '9px 13px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.88rem',
    color: 'var(--escuro)',
    background: 'var(--bg-input)',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },

  temaBtns: {
    display: 'flex',
    gap: 8,
  },
  temaBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '8px 16px',
    borderRadius: 10,
    border: '1.5px solid',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.84rem',
    transition: 'all 0.2s',
  },
  temaBtnIcone: { display: 'flex', alignItems: 'center' },
  temaBtnLabel: {},
  temaBtnAtivo: {
    fontSize: '0.7rem',
    color: 'var(--terra)',
    fontWeight: 700,
  },

  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.25s',
    flexShrink: 0,
    padding: 0,
  },
  toggleKnob: {
    position: 'absolute',
    top: 3,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    transition: 'transform 0.22s cubic-bezier(.4,0,.2,1)',
    display: 'block',
  },

  versao: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--cinza)',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '4px 12px',
  },

  btnLogout: {
    padding: '7px 18px',
    background: 'transparent',
    color: 'var(--vermelho)',
    border: '1.5px solid var(--vermelho)',
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.84rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.18s',
  },

  rodape: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 40,
  },
  btnSalvarRodape: {
    padding: '11px 28px',
    fontSize: '0.88rem',
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(28,16,10,0.6)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(3px)',
  },
  modalBox: {
    background: 'var(--bg-card)',
    borderRadius: 18,
    padding: '36px 32px',
    width: 380,
    maxWidth: '92vw',
    textAlign: 'center',
    border: '1px solid var(--border)',
    animation: 'modalIn 0.2s ease',
  },
  modalIcone: {
    display: 'flex',
    justifyContent: 'center',
    color: 'var(--vermelho)',
    marginBottom: 12,
  },
  modalTitulo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.25rem',
    color: 'var(--escuro)',
    margin: '0 0 10px',
  },
  modalTexto: {
    fontSize: '0.87rem',
    color: 'var(--cinza)',
    lineHeight: 1.6,
    margin: '0 0 24px',
  },
  modalAcoes: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
  },
  btnLogoutModal: {
    padding: '9px 22px',
    background: 'var(--vermelho)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
}