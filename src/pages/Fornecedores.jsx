import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'

function ModalFornecedor({ onClose, onRegistrado }) {
  const { showToast } = useApp()
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [insumos, setInsumos] = useState('')

  const salvar = () => {
    fetch('http://localhost:3000/api/fornecedor', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        nome: nome,
        cnpj: cnpj,
        telefone: telefone,
        email: email,
        insumos: insumos
      })
    })
      .then(r => r.json())
      .then(data => {
        onRegistrado()
        onClose()
        showToast('Fornecedor cadastrado com sucesso!')
      })
  }


  return (
    <Modal title="🚚 Cadastrar Fornecedor" onClose={onClose}>
      <div className="form-group">
        <label>Nome da Empresa</label>
        <input type="text" placeholder="Ex: Moinho São João"
          value={nome} onChange={e => setNome(e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>CNPJ</label>
          <input type="text" placeholder="00.000.000/0000-00"
            value={cnpj} onChange={e => setCnpj(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input type="text" placeholder="(41) 99999-0000"
            value={telefone} onChange={e => setTelefone(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label>E-mail</label>
        <input type="email" placeholder="contato@fornecedor.com"
          value={email} onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Insumos Fornecidos</label>
        <textarea rows="2" placeholder="Ex: Farinha de Trigo, Semolina..."
          value={insumos} onChange={e => setInsumos(e.target.value)}
        />
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={salvar}>Salvar</button>
      </div>
    </Modal>
  )
}

export default function Fornecedores() {
  const { showToast } = useApp()
  const [modalAberto, setModalAberto] = useState(false)
  const [fornecedorData, setFornecedorData] = useState([])

  const carregarForncedor = () => {
    fetch('http://localhost:3000/api/fornecedor')
      .then(r => r.json())
      .then(data => {
        setFornecedorData(data)
      })
  }

  useEffect(() => {
    carregarForncedor();
  }, [])


  const excluirFornecedor = (id) => {
    const confirmou = confirm('Tem certeza que deseja excluir?')
    if (!confirmou) return

    fetch(`http://localhost:3000/api/fornecedor/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        showToast('Fornecedor excluído com sucesso!')
        carregarForncedor()
      })
  }

  return (
    <div className="page-fade">
      <div className="sec-header">
        <h3 className="sec-title">Fornecedores</h3>
        <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
          + Novo Fornecedor
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Telefone</th>
              <th>Insumos Fornecidos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedorData.map(f => (
              <tr key={f.id}>
                <td><strong>{f.nome}</strong></td>
                <td>{f.cnpj}</td>
                <td>{f.telefone}</td>
                <td>{f.insumos}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => showToast('📝 Abrindo edição...')}
                  >
                    Editar
                  </button>
                  <button
                    className='btn btn-secondary btn-sm'
                    onClick={() => excluirFornecedor(f.id)}
                    style={{ marginLeft: '8px' }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && <ModalFornecedor onClose={() => setModalAberto(false)} onRegistrado={carregarForncedor} />}
    </div>
  )
}