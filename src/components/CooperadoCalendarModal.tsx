// src/components/CooperadoCalendarModal.tsx

import React from 'react';
import { MdClose, MdSave } from 'react-icons/md';
import type { CooperadoItem } from '../services/api';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: () => void;
  data: CooperadoItem | null;
  title?: string; // <--- ADICIONADO PARA CORRIGIR O ERRO
}

const CooperadoCalendarModal: React.FC<Props> = ({ isActive, onClose, onSave, data, title }) => {
  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          {/* Usa o título passado por prop OU um padrão baseado nos dados */}
          <p className="modal-card-title">{title || (data ? `Agendar: ${data.motorista}` : 'Agendamento')}</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          {/* Conteúdo simples do calendário (mock) */}
          <div className="content has-text-centered p-5">
            <p className="is-size-5 mb-4">Selecione a data para o agendamento</p>
            <input type="date" className="input" style={{ maxWidth: '300px' }} />
            {data && <p className="mt-4 has-text-grey">Cooperado: <strong>{data.motorista}</strong></p>}
          </div>
        </section>
        <footer className="modal-card-foot is-justify-content-flex-end">
          <button className="button" onClick={onClose}>
            <span className="icon is-small mr-1"><MdClose /></span>
            <span>Cancelar</span>
          </button>
          <button className="button is-success" onClick={onSave}>
            <span className="icon is-small mr-1"><MdSave /></span>
            <span>Confirmar</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoCalendarModal;