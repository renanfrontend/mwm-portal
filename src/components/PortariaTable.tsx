// src/components/PortariaTable.tsx

import React from 'react';
import type { PortariaItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { MdEdit, MdWhereToVote } from 'react-icons/md';

interface Props {
  data: PortariaItem[];
  onCheckInClick: (item: PortariaItem) => void;
  onEditClick: (item: PortariaItem) => void;
}

export const PortariaTable: React.FC<Props> = ({ data, onCheckInClick, onEditClick }) => {
  const { theme } = useTheme();

  const getStatusTagClass = (status: PortariaItem['status']) => {
    switch (status) {
      case 'Concluído':
        return 'is-success';
      case 'Pesagem':
        return 'is-info';
      case 'Em processo':
        return 'is-warning';
      case 'Pendente':
      default:
        return 'is-light';
    }
  };

  return (
    <div className="table-container">
      <table className={`table is-hoverable is-fullwidth is-narrow ${theme === 'dark' ? 'is-dark' : ''}`}>
        <thead>
          <tr className={theme === 'dark' ? 'has-background-grey-darker' : 'has-background-white-ter'}>
            <th>Data</th>
            <th>Horário</th>
            <th>Empresa</th>
            <th>Motorista</th>
            <th>Tipo de veículo</th>
            <th>Placa</th>
            <th>Atividade</th>
            <th className="has-text-centered">Status</th>
            <th className="has-text-centered">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.data}</td>
              <td>{item.horario}</td>
              <td>{item.empresa}</td>
              <td>{item.motorista}</td>
              <td>{item.tipoVeiculo}</td>
              <td>{item.placa}</td>
              <td>{item.atividade}</td>
              <td className="has-text-centered is-vcentered">
                <span className={`tag ${getStatusTagClass(item.status)}`}>{item.status}</span>
              </td>
              <td className="has-text-centered is-vcentered">
                <div className="buttons are-small is-centered" style={{flexWrap: 'nowrap'}}>
                  <button className="button is-light is-rounded" onClick={() => onCheckInClick(item)} disabled={item.status === 'Concluído'}>
                    <span className="icon"><MdWhereToVote /></span>
                  </button>
                  <button className="button is-light is-rounded" onClick={() => onEditClick(item)} disabled={item.status !== 'Pendente'}>
                    <span className="icon"><MdEdit /></span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};