// src/components/PortariaCheckInModal.tsx
import React, { useState, useEffect } from 'react';
import { type PortariaItem } from '../types/models';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onConfirm: (peso: string) => void;
  data: PortariaItem | null;
}

const PortariaCheckInModal: React.FC<Props> = ({ isActive, onClose, onConfirm, data }) => {
  const [pesoEntrada, setPesoEntrada] = useState('');

  useEffect(() => {
    if (isActive) setPesoEntrada('');
  }, [isActive]);

  if (!data) return null;

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-white" style={{ borderBottom: 'none' }}>
          <p className="modal-card-title has-text-weight-bold">Check-in</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body">
          <article className="message is-warning mb-5" style={{ backgroundColor: '#fff8e1', border: 'none' }}>
            <div className="message-body is-flex is-align-items-center py-3" style={{ border: 'none', backgroundColor: 'transparent', color: '#b7791f' }}>
               <div style={{ width: '4px', height: '40px', backgroundColor: '#b7791f', marginRight: '1rem', borderRadius: '2px' }}></div>
               <p className="is-size-7">
                 Peça ao motorista para se dirigir até a balança de pesagem e insira o peso do veículo antes de receber os dejetos.
               </p>
            </div>
          </article>

          <div className="mb-4">
            <p className="heading has-text-grey mb-0" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Empresa/Cooperado</p>
            <p className="is-size-5 has-text-weight-normal">{data.empresa}</p>
          </div>
          <div className="mb-4">
            <p className="heading has-text-grey mb-0" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Motorista</p>
            <p className="is-size-5 has-text-weight-normal">{data.motorista}</p>
          </div>
          <div className="mb-4">
            <p className="heading has-text-grey mb-0" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Tipo de caminhão</p>
            <p className="is-size-5 has-text-weight-normal">{data.tipoVeiculo}</p>
          </div>
          <div className="mb-4">
            <p className="heading has-text-grey mb-0" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Placa</p>
            <p className="is-size-5 has-text-weight-normal">{data.placa}</p>
          </div>

          <hr />

          <div className="field">
            <label className="label has-text-weight-bold">Insira o peso de entrada do veículo</label>
            <div className="control has-icons-right">
              <input 
                className="input is-medium" 
                type="number" 
                placeholder="00000"
                value={pesoEntrada}
                onChange={e => setPesoEntrada(e.target.value)}
              />
              <span className="icon is-right is-medium has-text-grey">
                Kg
              </span>
            </div>
            <p className="help is-danger">Obrigatório</p>
          </div>
        </section>

        <footer className="modal-card-foot has-background-white is-justify-content-flex-end" style={{ borderTop: 'none' }}>
          <button className="button" onClick={onClose}>Cancelar</button>
          <button 
            className="button has-text-white border-0" 
            style={{ backgroundColor: '#10b981' }}
            onClick={() => onConfirm(pesoEntrada)}
            disabled={!pesoEntrada}
          >
            Salvar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PortariaCheckInModal;