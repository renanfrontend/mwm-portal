// src/components/ReplicateWeekModal.tsx

import React, { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

const ReplicateWeekModal: React.FC<Props> = ({ isActive, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const handleConfirm = () => { if (selectedDate) onConfirm(selectedDate); };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '450px' }}>
        {/* 🛡️ HEADER EM CAMADAS */}
        <header className="modal-card-head" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', backgroundColor: 'white', border: 'none', padding: '16px 20px 0 20px' }}>
          <button className="delete" onClick={onClose}></button>
          <div style={{ width: '100%', marginTop: '10px' }}>
            <p className="modal-card-title has-text-weight-bold" style={{ fontSize: '20px', fontFamily: SCHIBSTED }}>REPLICAR SEMANA</p>
          </div>
        </header>

        <section className="modal-card-body has-text-centered" style={{ border: 'none', padding: '20px' }}>
          <span className="icon is-large has-text-info mb-2"><MdContentCopy size={48} /></span>
          <p style={{ fontFamily: SCHIBSTED, fontSize: '16px', marginTop: '16px' }}>Selecione a semana para replicar o planejamento:</p>

          <div className="field mt-4">
            <div className="control"><input className="input" type="week" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ fontFamily: SCHIBSTED }} /></div>
          </div>
        </section>

        <footer className="modal-card-foot" style={{ backgroundColor: 'white', border: 'none', justifyContent: 'center', gap: '12px', paddingBottom: '24px' }}>
          <button className="button" onClick={onClose} style={{ width: '120px', fontFamily: SCHIBSTED }}>Cancelar</button>
          <button className="button is-info" onClick={handleConfirm} disabled={!selectedDate} style={{ width: '120px', fontFamily: SCHIBSTED }}>Replicar</button>
        </footer>
      </div>
    </div>
  );
};

export default ReplicateWeekModal;