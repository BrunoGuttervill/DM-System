import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'

function ModalFornecedor({ onClose }) {
  const { showToast } = useApp()
  const salvar = () => { onClose(); showToast('✅ Fornecedor cadastrado!') }
  return (
    <Modal title="🚚 Cadastrar Fornecedor" onClose={onClose}>
      <div className="form-group">
        <label>Nome da Empresa</label>
        <input type="text" placeholder="Ex: Moinho São João" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>CNPJ</label>
          <input type="text" placeholder="00.000.000/0000-00" />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input type="text" placeholder="(41) 99999-0000" />
        </div>
      </div>
      <div className="form-group">
        <label>E-mail</label>
        <input type="email" placeholder="contato@fornecedor.com" />
      </div>
      <div className="form-group">
        <label>Insumos Fornecidos</label>
        <textarea rows="2" placeholder="Ex: Farinha de Trigo, Semolina..." />
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
  const [fornData, setFornData] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/fornecedor')
      .then(r => r.json())
      .then(data => setFornData(data))
  }, [])

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
            {fornData.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--cinza)' }}>
                  Nenhum fornecedor cadastrado
                </td>
              </tr>
            ) : (
              fornData.map(f => (
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalAberto && <ModalFornecedor onClose={() => setModalAberto(false)} />}
    </div>
  )
}