// src/components/PortariaListItem.tsx

import React from 'react';
import type { PortariaItem } from '../services/api';
import { MdEdit, MdWhereToVote } from 'react-icons/md';

interface Props {
  item: PortariaItem;
}

export const PortariaListItem: React.FC<Props> = ({ item }) => {
  const isConcluida = item.status === 'Concluído';

  return (
    <div className="mb-4">
      <div className="columns is-vcentered is-mobile">
        <div className="column">
          <span className="help">Data</span>
          <span className="subtitle is-6">{item.data}</span>
        </div>
        <div className="column">
          <span className="help">Horário</span>
          <span className="subtitle is-6">{item.horario}</span>
        </div>
        <div className="column">
          <span className="help">Empresa</span>
          <span className="subtitle is-6">{item.empresa}</span>
        </div>
        <div className="column is-2-desktop">
          <span className="help">Motorista</span>
          <span className="subtitle is-6">{item.motorista}</span>
        </div>
        <div className="column is-2-desktop is-hidden-mobile">
          <span className="help">Tipo de veículo</span>
          <span className="subtitle is-6">{item.tipoVeiculo}</span>
        </div>
        <div className="column is-hidden-mobile">
          <span className="help">Placa</span>
          <span className="subtitle is-6">{item.placa}</span>
        </div>
        <div className="column is-2-desktop">
          <span className="help">Atividade</span>
          <span className="subtitle is-6">{item.atividade}</span>
        </div>
        <div className="column">
          <span className="help">Status</span>
          <div className={`tag ${isConcluida ? 'is-success' : 'is-light'}`}>
            <span className="has-text-weight-bold">{item.status}</span>
          </div>
        </div>
        <div className="column">
          <div className="field is-grouped is-grouped-centered">
            <div className="control">
              <button className="button is-small is-success is-light" disabled={isConcluida}>
                <span className="icon"><MdWhereToVote /></span>
              </button>
            </div>
            <div className="control">
              <button className="button is-small is-info is-light" disabled={isConcluida}>
                <span className="icon"><MdEdit /></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr className="divider mt-0 mb-2" />
    </div>
  );
};