// src/components/QualidadeDejetosListItem.tsx

import React from 'react';
import type { QualidadeDejetosItem } from '../services/api';
import { MdScience, MdVisibility } from 'react-icons/md';

interface Props {
  item: QualidadeDejetosItem;
}

export const QualidadeDejetosListItem: React.FC<Props> = ({ item }) => {
  return (
    <div className="mb-4">
      <div className="columns is-vcentered is-mobile">
        <div className="column">
          <span className="help">Data da coleta</span>
          <span className="subtitle is-6">{item.dataColeta}</span>
        </div>
        <div className="column is-3-desktop">
          <span className="help">Cooperado</span>
          <span className="subtitle is-6">{item.cooperado}</span>
        </div>
        <div className="column">
          <span className="help">Placa</span>
          <span className="subtitle is-6">{item.placa}</span>
        </div>
        <div className="column">
          <span className="help">PH</span>
          <span className="subtitle is-6">{item.ph}</span>
        </div>
        <div className="column">
          <span className="help">Densidade</span>
          <span className="subtitle is-6">{item.densidade}</span>
        </div>
        <div className="column is-3-desktop">
          <div className="buttons are-small is-justify-content-flex-end">
            <button className="button is-info is-light is-rounded">
              <span className="icon"><MdScience /></span>
              <span>Analisar</span>
            </button>
            <button className="button is-light is-rounded">
              <span className="icon"><MdVisibility /></span>
            </button>
          </div>
        </div>
      </div>
      <hr className="divider mt-0 mb-2" />
    </div>
  );
};