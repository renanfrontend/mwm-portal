// src/components/CooperadoContactModal.tsx

import React from 'react';
import type { CooperadoItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { MdPerson, MdPhone, MdEmail } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  data: CooperadoItem | null;
}

const ContactSection: React.FC<{ title: string; name: string; phone: string; email: string; textColor: string }> = ({ title, name, phone, email, textColor }) => (
  <div className="mb-5">
    <p className="is-size-7 has-text-grey has-text-weight-bold is-uppercase mb-3">{title}</p>
    
    <div className="is-flex is-align-items-center mb-2">
      <span className="icon has-text-grey-light mr-2"><MdPerson /></span>
      <span className="subtitle is-6 has-text-weight-semibold" style={{ color: textColor }}>{name}</span>
    </div>

    <div className="is-flex is-align-items-center mb-2">
      <span className="icon has-text-grey-light mr-2"><MdPhone /></span>
      <span className="subtitle is-6" style={{ color: textColor }}>{phone}</span>
    </div>

    <div className="is-flex is-align-items-center">
      <span className="icon has-text-grey-light mr-2"><MdEmail /></span>
      <span className="subtitle is-6" style={{ color: textColor }}>{email}</span>
    </div>
  </div>
);

const CooperadoContactModal: React.FC<Props> = ({ isActive, onClose, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  if (!data) return null;

  // Dados mockados complementares
  const contactData = {
    responsavel: {
      nome: data.motorista,
      telefone: data.telefone || '(00) 9 1234-5678',
      email: 'email@cooperado.com.br'
    },
    tecnico: {
      nome: data.tecnico || 'Daniel',
      telefone: '(45) 3376-1170',
      email: 'email@tecnico.com.br'
    }
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '450px', width: '100%', borderRadius: '8px' }}>
        
        {/* Cabeçalho com o Título Solicitado */}
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.5rem', backgroundColor: '#fff' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>
            Informações de contato
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '2rem 1.5rem' }}>
          
          {/* Nome do Produtor em Destaque */}
          <div className="mb-5">
            <p className="is-size-7 has-text-grey has-text-weight-bold is-uppercase mb-1">PRODUTOR</p>
            <p className="title is-5 has-text-weight-bold" style={{ color: textColor }}>
              {data.motorista.toUpperCase()}
            </p>
          </div>

          <hr className="divider" style={{ margin: '1.5rem 0', backgroundColor: '#f0f0f0' }} />

          {/* Seção 1: Responsável */}
          <ContactSection 
            title="Responsável pela propriedade"
            name={contactData.responsavel.nome}
            phone={contactData.responsavel.telefone}
            email={contactData.responsavel.email}
            textColor={textColor}
          />

          <hr className="divider" style={{ margin: '1.5rem 0', backgroundColor: '#f0f0f0' }} />

          {/* Seção 2: Técnico */}
          <ContactSection 
            title="Técnico responsável"
            name={contactData.tecnico.nome}
            phone={contactData.tecnico.telefone}
            email={contactData.tecnico.email}
            textColor={textColor}
          />

        </section>

        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', padding: '1rem 1.5rem' }}>
          <button className="button" onClick={onClose}>Fechar</button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoContactModal;