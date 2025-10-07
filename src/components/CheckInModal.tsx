// src/components/CheckInModal.tsx
import React from 'react';
import { type ColetaItem } from '../services/api';
import useTheme from '../hooks/useTheme';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onEdit: (data: ColetaItem) => void;
  onCheckIn: () => void;
  data: ColetaItem | null;
}

const CheckInModal: React.FC<Props> = ({ isActive, onClose, onEdit, onCheckIn, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  if (!data) return null;

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        <header className="modal-card-head has-text-centered" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <p className="modal-card-title" style={{ color: textColor }}>Check-in</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="content">
            <p><strong>Cooperado:</strong></p>
            <p>{data.cooperado}</p>
            <p><strong>Motorista:</strong></p>
            <p>{data.motorista}</p>
            <p><strong>Tipo do veículo:</strong></p>
            <p>{data.tipoVeiculo}</p>
            <p><strong>Placa do veículo:</strong></p>
            <p>{data.placa}</p>
            <p><strong>Odômetro:</strong></p>
            <p>{data.odometro}</p>
            <hr />
            <p><strong>Data prevista:</strong></p>
            <p>{data.dataPrevisao}</p>
            <p><strong>Horário:</strong></p>
            <p>{data.horaPrevisao}H</p>
          </div>
        </section>
        <footer className="modal-card-foot">
          <div className="buttons is-centered is-fullwidth">
            <button className="button is-light" onClick={() => onEdit(data)}>Editar</button>
            <button className="button is-success" onClick={onCheckIn}>Check-in</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CheckInModal;