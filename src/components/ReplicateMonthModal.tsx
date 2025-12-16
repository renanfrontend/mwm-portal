// src/components/ReplicateMonthModal.tsx

import React, { useState } from 'react';
import { MdDateRange } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onConfirm: (month: string) => void;
}

const ReplicateMonthModal: React.FC<Props> = ({ isActive, onClose, onConfirm }) => {
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleConfirm = () => {
      if (selectedMonth) onConfirm(selectedMonth);
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '450px' }}>
        <header className="modal-card-head">
          <p className="modal-card-title is-size-6 has-text-weight-bold">Replicar Mês</p>
          <button className="delete" onClick={onClose}></button>
        </header>
        <section className="modal-card-body has-text-centered">
          <span className="icon is-large has-text-success mb-2">
            <MdDateRange size={48} />
          </span>
          <p className="subtitle is-6 mt-2">
            Selecione o mês para replicar o planejamento:
          </p>

          <div className="field mt-4">
              <div className="control">
                  <input 
                    className="input" 
                    type="month" 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)} 
                  />
              </div>
          </div>
        </section>
        <footer className="modal-card-foot is-justify-content-center">
          <button className="button" onClick={onClose}>Cancelar</button>
          <button 
            className="button is-success" 
            onClick={handleConfirm}
            disabled={!selectedMonth}
          >
            Replicar
          </button>
        </footer>
      </div>
    </div>
  );
};  

export default ReplicateMonthModal;