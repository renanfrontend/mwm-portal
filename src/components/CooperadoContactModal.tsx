// src/components/CooperadoContactModal.tsx (VERSÃO CORRETA - BASEADA NO ÚLTIMO PRINT)

import React from 'react';
import type { CooperadoItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { MdPhone } from 'react-icons/md'; // Ícone de telefone

interface Props {
  isActive: boolean;
  onClose: () => void;
  data: CooperadoItem | null;
}

// Dados mockados estáticos que você pediu
const mockContact = {
  tecnicoNome: "Daniel",
  telefone: "(DDD)9 1234-5678"
};

// Helper para criar cada entrada (Motorista, Técnico, Filial)
// Exatamente como no print
const ContactEntry: React.FC<{ label: string; name: string; phone: string; textColor: string }> = ({ label, name, phone, textColor }) => (
  <div className="field">
    <label className="label" style={{ color: textColor, marginBottom: '0.25rem' }}>{label}</label>
    <p className="subtitle is-6" style={{ color: textColor, fontWeight: 'bold' }}>{name}</p>
    <div className="icon-text">
      <span className="icon"><MdPhone /></span>
      <span>{phone}</span>
    </div>
  </div>
);

const CooperadoContactModal: React.FC<Props> = ({ isActive, onClose, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  if (!data) return null;

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      {/* Modal menor, como no print */}
      <div className="modal-card" style={{ maxWidth: '440px' }}> 
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <p className="modal-card-title" style={{ color: textColor }}>
            {/* Título CORRETO que você pediu */}
            Contato
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body">
          {/* Layout IDÊNTICO AO NOVO PRINT E AO SEU TEXTO */}
          
          <ContactEntry 
            label="Motorista"
            name={data.motorista} // "Renato Ivan" (Vem do item)
            phone={mockContact.telefone} // "(DDD)9 1234-5678"
            textColor={textColor}
          />
          
          <hr className="divider" style={{ margin: '1rem 0' }} />

          <ContactEntry 
            label="Técnico"
            name={mockContact.tecnicoNome} // "Daniel" (Dado mockado)
            phone={mockContact.telefone} // "(DDD)9 1234-5678"
            textColor={textColor}
          />

          <hr className="divider" style={{ margin: '1rem 0' }} />

          <ContactEntry 
            label="Filial"
            name={data.filial} // "Primato" (Vem do item)
            phone={mockContact.telefone} // "(DDD)9 1234-5678"
            textColor={textColor}
          />

        </section>

        <footer 
          className="modal-card-foot" 
          style={{ 
            borderTop: '1px solid var(--border-color)', 
            justifyContent: 'flex-end'
          }}
        >
          <button className="button" onClick={onClose}>Fechar</button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoContactModal;