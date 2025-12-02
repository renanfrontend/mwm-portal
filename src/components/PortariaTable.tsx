// src/components/PortariaTable.tsx

import React from 'react';
import { type PortariaItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { MdEdit, MdLogin, MdQrCodeScanner } from 'react-icons/md';

interface Props {
  data: PortariaItem[];
  onCheckIn: (item: PortariaItem) => void;
  onEdit: (item: PortariaItem) => void;
}

export const PortariaTable: React.FC<Props> = ({ data, onCheckIn, onEdit }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  // Função para definir a cor da tag de status
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Concluído': return 'is-success';
      case 'Pendente': return 'is-warning';
      case 'Em processo': return 'is-info';
      case 'Pesagem': return 'is-link';
      default: return 'is-light';
    }
  };

  return (
    <div className="table-container">
      <table className="table is-fullwidth is-hoverable is-striped">
        <thead>
          <tr>
            <th style={{ color: textColor, padding: '12px 15px' }}>Data/Hora</th>
            <th style={{ color: textColor, padding: '12px 15px' }}>Motorista</th>
            <th style={{ color: textColor, padding: '12px 15px' }}>Empresa</th>
            <th style={{ color: textColor, padding: '12px 15px' }}>Veículo</th>
            <th style={{ color: textColor, padding: '12px 15px' }}>Atividade</th>
            <th style={{ color: textColor, padding: '12px 15px' }}>Status</th>
            <th style={{ color: textColor, padding: '12px 15px', textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td style={{ verticalAlign: 'middle', padding: '12px 15px' }}>
                <div>
                    <p className="has-text-weight-semibold">{item.data}</p>
                    <p className="is-size-7 has-text-grey">{item.horario}</p>
                </div>
              </td>
              <td style={{ verticalAlign: 'middle', padding: '12px 15px' }}>
                <span className="has-text-weight-medium">{item.motorista}</span>
              </td>
              <td style={{ verticalAlign: 'middle', padding: '12px 15px' }}>
                {item.empresa}
              </td>
              <td style={{ verticalAlign: 'middle', padding: '12px 15px' }}>
                <p>{item.tipoVeiculo}</p>
                <span className="tag is-light is-rounded is-small mt-1">{item.placa}</span>
              </td>
              <td style={{ verticalAlign: 'middle', padding: '12px 15px' }}>
                {item.atividade}
              </td>
              <td style={{ verticalAlign: 'middle', padding: '12px 15px' }}>
                <span className={`tag ${getStatusTag(item.status)} is-light`}>
                  {item.status}
                </span>
              </td>
              <td style={{ verticalAlign: 'middle', padding: '12px 15px', textAlign: 'right' }}>
                <div className="buttons is-right are-small">
                  {item.status !== 'Concluído' && (
                    <button 
                        className="button is-link is-light" 
                        title="Check-in / Avançar"
                        onClick={() => onCheckIn(item)}
                    >
                        <span className="icon"><MdQrCodeScanner /></span>
                    </button>
                  )}
                  <button 
                    className="button is-white" 
                    title="Editar"
                    onClick={() => onEdit(item)}
                  >
                    <span className="icon"><MdEdit /></span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="has-text-centered py-6 has-text-grey">
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};