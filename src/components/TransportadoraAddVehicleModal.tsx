// src/components/TransportadoraAddVehicleModal.tsx

import React, { useState } from 'react';
import type { VeiculoInfo } from '../types/models';
import useTheme from '../hooks/useTheme';
import { MdSave } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: (vehicle: VeiculoInfo) => void;
}

const TransportadoraAddVehicleModal: React.FC<Props> = ({ isActive, onClose, onSave }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  const [tipo, setTipo] = useState('');
  const [capacidade, setCapacidade] = useState('');

  // Limpa os campos quando abre
  React.useEffect(() => {
    if (isActive) {
      setTipo('');
      setCapacidade('');
    }
  }, [isActive]);

  const handleSubmit = () => {
    if (!tipo || !capacidade) {
        alert("Preencha todos os campos");
        return;
    }
    onSave({ tipo, capacidade });
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`} style={{ zIndex: 1001 }}> {/* Z-index maior para ficar sobre o outro */}
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '500px', width: '100%' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.5rem', backgroundColor: '#fff' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>
            Adicionar Veículo
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '2rem' }}>
          <div className="field">
            <label className="label is-small">Tipo de Veículo</label>
            <div className="control">
                <input 
                    className="input" 
                    placeholder="Ex: Caminhão Truck, Carreta..." 
                    value={tipo} 
                    onChange={e => setTipo(e.target.value)} 
                />
            </div>
          </div>

          <div className="field">
            <label className="label is-small">Capacidade</label>
            <div className="control">
                <input 
                    className="input" 
                    placeholder="Ex: 15.000 kg, 30 m³..." 
                    value={capacidade} 
                    onChange={e => setCapacidade(e.target.value)} 
                />
            </div>
          </div>
        </section>

        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', padding: '1.5rem', gap: '10px' }}>
          <button className="button" onClick={onClose}>Cancelar</button>
          <button className="button is-success" onClick={handleSubmit}>
            <span className="icon is-small"><MdSave /></span>
            <span>Salvar</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TransportadoraAddVehicleModal;