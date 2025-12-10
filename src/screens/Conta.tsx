// src/screens/Conta.tsx

import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Conta = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="screen-container p-2">
      {/* HEADER / TOOLBAR */}
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem' }}>
        <div className="level is-mobile">
          <div className="level-left">
            <button className="button is-white mr-2" onClick={() => navigate(-1)}>
              <span className="icon"><MdArrowBack size={24} /></span>
            </button>
            <span className="title is-4 mb-0" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Minha Conta</span>
          </div>
        </div>
      </div>

      {/* CONTEÚDO SCROLLÁVEL */}
      <div className="screen-content">
        <div className="container is-fluid px-0">
          
          <div className="card mt-4" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <header className="card-header">
              <p className="card-header-title">Informações do Usuário</p>
            </header>
            <div className="card-content">
              <div className="content">
                <div className="field">
                  <label className="label">Nome de Usuário</label>
                  <div className="control">
                    <input className="input" type="text" value={user?.username || ''} readOnly disabled />
                  </div>
                </div>

                <div className="field">
                  <label className="label">E-mail</label>
                  <div className="control">
                    <input className="input" type="email" value={user?.email || ''} readOnly disabled />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Função (Role)</label>
                  <div className="control">
                    <span className="tag is-info is-medium">{user?.role || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Conta;