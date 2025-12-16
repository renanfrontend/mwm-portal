// src/components/ReplicateWeekModal.tsx

import React, { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

const ReplicateWeekModal: React.FC<Props> = ({ isActive, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleConfirm = () => {
      if (selectedDate) onConfirm(selectedDate);
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '450px' }}>
        <header className="modal-card-head">
          <p className="modal-card-title is-size-6 has-text-weight-bold">Replicar Semana</p>
          <button className="delete" onClick={onClose}></button>
        </header>
        <section className="modal-card-body has-text-centered">
          <span className="icon is-large has-text-info mb-2">
            <MdContentCopy size={48} />
          </span>
          <p className="subtitle is-6 mt-2">
            Selecione a semana para replicar o planejamento:
          </p>
          
          <div className="field mt-4">
              <div className="control">
                  <input 
                    className="input" 
                    type="week" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                  />
              </div>
          </div>
        </section>
        <footer className="modal-card-foot is-justify-content-center">
          <button className="button" onClick={onClose}>Cancelar</button>
          <button 
            className="button is-info" 
            onClick={handleConfirm}
            disabled={!selectedDate}
          >
            Replicar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ReplicateWeekModal;