// src/components/ReplicateMonthModal.tsx

import React, { useState } from 'react';
import { MdDateRange } from 'react-icons/md';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onConfirm: (month: string) => void;
}

const ReplicateMonthModal: React.FC<Props> = ({ isActive, onClose, onConfirm }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const handleConfirm = () => { if (selectedMonth) onConfirm(selectedMonth); };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '450px' }}>
        {/* 🛡️ HEADER EM CAMADAS */}
        <header className="modal-card-head" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', backgroundColor: 'white', border: 'none', padding: '16px 20px 0 20px' }}>
          <button className="delete" onClick={onClose}></button>
          <div style={{ width: '100%', marginTop: '10px' }}>
            <p className="modal-card-title has-text-weight-bold" style={{ fontSize: '20px', fontFamily: SCHIBSTED }}>REPLICAR MÊS</p>
          </div>
        </header>

        <section className="modal-card-body has-text-centered" style={{ border: 'none', padding: '20px' }}>
          <span className="icon is-large has-text-success mb-2"><MdDateRange size={48} /></span>
          <p style={{ fontFamily: SCHIBSTED, fontSize: '16px', marginTop: '16px' }}>Selecione o mês para replicar o planejamento:</p>

          <div className="field mt-4">
            <div className="control"><input className="input" type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ fontFamily: SCHIBSTED }} /></div>
          </div>
        </section>

        <footer className="modal-card-foot" style={{ backgroundColor: 'white', border: 'none', justifyContent: 'center', gap: '12px', paddingBottom: '24px' }}>
          <button className="button" onClick={onClose} style={{ width: '120px', fontFamily: SCHIBSTED }}>Cancelar</button>
          <button className="button is-success" onClick={handleConfirm} disabled={!selectedMonth} style={{ width: '120px', fontFamily: SCHIBSTED }}>Replicar</button>
        </footer>
      </div>
    </div>
  );
};  

export default ReplicateMonthModal;