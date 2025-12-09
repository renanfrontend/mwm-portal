// src/components/TransportadoraContactModal.tsx

import React from 'react';
import type { TransportadoraItem, ContactInfo } from '../types/models';
import useTheme from '../hooks/useTheme';
import { MdPerson, MdPhone, MdEmail } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  data: TransportadoraItem | null;
}

const ContactSection: React.FC<{ title: string; contact?: ContactInfo; textColor: string }> = ({ title, contact, textColor }) => {
  // Se não houver contato, renderiza placeholders ou nada
  const displayContact = contact || { nome: 'Não informado', telefone: '', email: '' };
  
  return (
    <div className="mb-5">
      <p className="is-size-7 has-text-grey has-text-weight-bold is-uppercase mb-3">{title}</p>
      
      <div className="is-flex is-align-items-center mb-2">
        <span className="icon has-text-grey-light mr-2"><MdPerson /></span>
        <span className="subtitle is-6 has-text-weight-semibold" style={{ color: textColor }}>{displayContact.nome}</span>
      </div>

      <div className="is-flex is-align-items-center mb-2">
        <span className="icon has-text-grey-light mr-2"><MdPhone /></span>
        <span className="subtitle is-6" style={{ color: textColor }}>{displayContact.telefone}</span>
      </div>

      <div className="is-flex is-align-items-center">
        <span className="icon has-text-grey-light mr-2"><MdEmail /></span>
        <span className="subtitle is-6" style={{ color: textColor }}>{displayContact.email}</span>
      </div>
    </div>
  );
};

const TransportadoraContactModal: React.FC<Props> = ({ isActive, onClose, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  if (!data) return null;

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '450px', width: '100%', borderRadius: '8px' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.5rem', backgroundColor: '#fff' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>
            Contato transportadora
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '2rem 1.5rem' }}>
          
          <div className="mb-5">
            <p className="title is-5 has-text-weight-bold" style={{ color: textColor }}>
              {data.nomeFantasia.toUpperCase()}
            </p>
          </div>

          <hr className="divider" style={{ margin: '1.5rem 0', backgroundColor: '#f0f0f0' }} />

          <ContactSection title="Contato principal" contact={data.contatoPrincipal} textColor={textColor} />
          <hr className="divider" style={{ margin: '1.5rem 0', backgroundColor: '#f0f0f0' }} />
          <ContactSection title="Comercial" contact={data.contatoComercial} textColor={textColor} />
          <hr className="divider" style={{ margin: '1.5rem 0', backgroundColor: '#f0f0f0' }} />
          <ContactSection title="Financeiro" contact={data.contatoFinanceiro} textColor={textColor} />

        </section>

        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', padding: '1rem 1.5rem' }}>
          <button className="button" onClick={onClose}>Fechar</button>
        </footer>
      </div>
    </div>
  );
};

export default TransportadoraContactModal;