// src/components/PortariaCheckInModal.tsx

import React, { useState, useEffect } from 'react';
import { type PortariaItem } from '../types/models';
import { MdSave } from 'react-icons/md';
import useTheme from '../hooks/useTheme';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onConfirm: (entrada: string, saida: string) => void;
  data: PortariaItem | null;
}

const InfoRow: React.FC<{ label: string; value: string; textColor: string }> = ({ label, value, textColor }) => (
  <div className="mb-4">
    <p className="is-size-7 has-text-grey is-uppercase mb-1">{label}</p>
    <p className="subtitle is-6 has-text-weight-bold" style={{ color: textColor }}>{value}</p>
  </div>
);

const PortariaCheckInModal: React.FC<Props> = ({ isActive, onClose, onConfirm, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  const [pesoEntrada, setPesoEntrada] = useState('');
  const [pesoSaida, setPesoSaida] = useState('');

  useEffect(() => {
    if (isActive && data) {
      setPesoEntrada(data.balancaEntrada || '');
      setPesoSaida(data.balancaSaida || '');
    }
  }, [isActive, data]);

  const handleSubmit = () => {
    // Validação simples para garantir que os campos obrigatórios estão preenchidos
    if (!pesoEntrada || !pesoSaida) {
        // Idealmente, você usaria um estado para mostrar erro no input específico,
        // mas para este exemplo, o foco é o layout.
        // toast.error("Preencha os pesos obrigatórios."); 
        // return; 
    }
    onConfirm(pesoEntrada, pesoSaida);
  };

  if (!data) return null;

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '500px', width: '100%' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.5rem', backgroundColor: '#fff' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>Registrar Pesagem</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '2rem' }}>
          
          {/* Texto Informativo (Fundo Amarelo Claro) */}
          <div className="notification mb-5 p-4" style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' }}>
             <p className="is-size-7">
               Peça ao motorista para se dirigir até a balança de pesagem e insira o peso do veículo antes de receber os dejetos.
             </p>
          </div>

          {/* Dados Informativos (Vertical) */}
          <InfoRow label="Empresa/Cooperado" value={data.empresa} textColor={textColor} />
          <InfoRow label="Motorista" value={data.motorista} textColor={textColor} />
          <InfoRow label="Tipo de caminhão" value={data.tipoVeiculo} textColor={textColor} />
          <InfoRow label="Placa" value={data.placa} textColor={textColor} />

          <hr className="divider my-5" style={{ backgroundColor: '#f0f0f0' }} />

          {/* Inputs de Peso (Verticais com validação embaixo) */}
          
          <div className="field mb-4">
              <label className="label is-small">Insira o peso de entrada do veículo</label>
              <div className="control">
                  <input 
                    className="input" 
                    type="number" 
                    placeholder="0.00" 
                    value={pesoEntrada} 
                    onChange={e => setPesoEntrada(e.target.value)} 
                  />
              </div>
              <p className="help has-text-danger mt-1">Obrigatório</p>
          </div>

          <div className="field">
              <label className="label is-small">Insira o peso de saída do veículo</label>
              <div className="control">
                  <input 
                    className="input" 
                    type="number" 
                    placeholder="0.00" 
                    value={pesoSaida} 
                    onChange={e => setPesoSaida(e.target.value)} 
                  />
              </div>
              <p className="help has-text-danger mt-1">Obrigatório</p>
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

export default PortariaCheckInModal;