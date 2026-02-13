// src/components/PortariaTable.tsx
import React from 'react';
import { type PortariaItem } from '../types/models';
import useTheme from '../hooks/useTheme';
import { FaWeightHanging } from 'react-icons/fa';

interface Props {
  data: PortariaItem[];
  onCheckInClick: (item: PortariaItem) => void;
}

export const PortariaTable: React.FC<Props> = ({ data, onCheckInClick }) => {
  const { theme } = useTheme();

  // Função para formatar a data (yyyy-mm-dd -> dd/mm/aaaa)
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    if (dateString.includes('-')) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  return (
    <div className="table-container">
      <table className={`table is-hoverable is-fullwidth ${theme === 'dark' ? 'is-dark' : ''}`}>
        <thead>
          <tr className="has-text-grey-light is-size-7">
            <th className="has-text-weight-normal">Data</th>
            <th className="has-text-weight-normal">Empresa/Cooperado</th>
            <th className="has-text-weight-normal">Atividade realizada</th>
            <th className="has-text-weight-normal">Transportadora</th>
            <th className="has-text-weight-normal">Tipo de veículo</th>
            <th className="has-text-weight-normal">Placa</th>
            <th className="has-text-weight-normal">Motorista</th>
            <th className="has-text-weight-normal">Status</th>
            <th className="has-text-weight-normal">Ação pendente</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} className="is-vcentered">
              <td className="is-size-7">
                <div className="has-text-grey-light mb-1">Data</div>
                <div className="has-text-weight-semibold is-size-6">
                    {formatDate(item.data)} {item.horario}H
                </div>
              </td>
              <td className="is-size-7">
                <div className="has-text-grey-light mb-1">Empresa/Cooperado</div>
                <div className="is-size-6">{item.empresa}</div>
              </td>
              <td className="is-size-7">
                <div className="has-text-grey-light mb-1">Atividade realizada</div>
                <div>{item.atividade}</div>
              </td>
              <td className="is-size-7">
                <div className="has-text-grey-light mb-1">Transportadora</div>
                <div>{item.transportadora || '-'}</div>
              </td>
              <td className="is-size-7">
                <div className="has-text-grey-light mb-1">Tipo de veículo</div>
                <div>{item.tipoVeiculo}</div>
              </td>
              <td className="is-size-7">
                <div className="has-text-grey-light mb-1">Placa</div>
                <div>{item.placa}</div>
              </td>
              <td className="is-size-7">
                <div className="has-text-grey-light mb-1">Motorista</div>
                <div>{item.motorista}</div>
              </td>
              <td className="is-size-7 is-vcentered">
                <div className="has-text-grey-light mb-1">Status</div>
                <span className="tag is-light is-rounded has-text-weight-semibold">{item.status}</span>
              </td>
              <td className="is-vcentered">
                <div className="has-text-grey-light mb-1 is-size-7">Ação pendente</div>
                <button 
                  className="button is-small has-text-weight-bold border-0"
                  style={{ backgroundColor: '#ecfdf5', color: '#047857' }}
                  onClick={() => onCheckInClick(item)}
                >
                  <span className="icon is-small mr-1">
                    <FaWeightHanging />
                  </span>
                  <span>Pesar Veículo</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};