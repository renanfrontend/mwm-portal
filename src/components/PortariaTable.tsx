// src/components/PortariaTable.tsx

import React from 'react';
import type { PortariaItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { MdEdit, MdVisibility } from 'react-icons/md';

interface Props {
  data: PortariaItem[];
}

export const PortariaTable: React.FC<Props> = ({ data }) => {
  const { theme } = useTheme();

  const getStatusTagClass = (status: 'Concluído' | 'Pendente') => {
    if (status === 'Concluído') return 'is-success';
    if (status === 'Pendente') return 'is-warning';
    return 'is-light';
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
                <div className="buttons are-small is-centered">
                  <button className="button is-light is-rounded"><span className="icon"><MdVisibility /></span></button>
                  <button className="button is-light is-rounded"><span className="icon"><MdEdit /></span></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};