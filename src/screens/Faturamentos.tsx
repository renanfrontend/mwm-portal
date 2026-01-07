// src/screens/Faturamentos.tsx

import React from 'react';
import { MdArrowBack, MdConstruction } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Faturamentos: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="screen-container" style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* CABEÇALHO PADRÃO */}
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem', flexShrink: 0 }}>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="buttons">
              <button className="button is-white border mr-2" onClick={() => navigate(-1)}>
                <span className="icon"><MdArrowBack size={24} /></span>
              </button>
              <span className="title is-4 mb-0" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Faturamentos</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTEÚDO: PÁGINA EM CONSTRUÇÃO */}
      <div className="screen-content p-5" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
        <div className="has-text-centered">
          <div className="icon is-large has-text-grey-light mb-4" style={{ width: '80px', height: '80px' }}>
             <MdConstruction size={64} />
          </div>
          <h2 className="title is-4 has-text-grey mb-2">Página em construção</h2>
          <p className="subtitle is-6 has-text-grey-light">
            Estamos preparando novidades para o módulo de faturamentos.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Faturamentos;