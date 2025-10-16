// src/components/AgendaTable.tsx

import React, { useMemo } from 'react';
import type { AgendaData } from '../services/api';
import useTheme from '../hooks/useTheme';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

interface Props {
  data: AgendaData[];
  isDeleteMode: boolean;
  selectedItems: (string | number)[];
  onSelectItem: (id: string | number) => void;
  onConfirmDelete: () => void;
}

const REALIZADO_ID_COLOR = '#d4edda';
const PLANEJADO_ID_COLOR = '#cce5ff';

export const AgendaTable: React.FC<Props> = ({ data, isDeleteMode, selectedItems, onSelectItem, onConfirmDelete }) => {
  const { theme } = useTheme();

  const sortedData = useMemo(() => {
    const statusPriority = { 'Realizado': 1, 'Planejado': 2 };
    return [...data].sort((a, b) => {
      const statusComparison = statusPriority[a.status] - statusPriority[b.status];
      if (statusComparison !== 0) return statusComparison;
      return b.qtd - a.qtd;
    });
  }, [data]);

  const totals = useMemo(() => {
    const initial = { seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, qtd: 0, km: 0 };
    return data.reduce((acc, item) => {
      acc.seg += item.seg; acc.ter += item.ter; acc.qua += item.qua;
      acc.qui += item.qui; acc.sex += item.sex; acc.qtd += item.qtd; acc.km += item.km;
      return acc;
    }, initial);
  }, [data]);

  const getRowClass = (item: AgendaData) => {
    if (item.status === 'Realizado') {
      if (item.qtd < 30) return 'has-background-danger-light';
      return 'has-background-warning-light';
    }
    return '';
  };

  return (
    <>
      {isDeleteMode && selectedItems.length > 0 && (
        <div className="p-3 has-text-right">
          <button onClick={onConfirmDelete} className="button is-danger">
            Excluir Selecionados ({selectedItems.length})
          </button>
        </div>
      )}
      <div className="table-container">
        <table className={`table is-hoverable is-fullwidth is-narrow ${theme === 'dark' ? 'is-dark' : ''}`}>
           <thead>
            <tr className={theme === 'dark' ? 'has-background-grey-darker' : 'has-background-white-ter'}>
              {isDeleteMode && <th style={{ width: '40px' }}></th>}
              <th>Cooperado</th>
              <th className="has-text-centered">Seg</th><th className="has-text-centered">Ter</th>
              <th className="has-text-centered">Qua</th><th className="has-text-centered">Qui</th>
              <th className="has-text-centered">Sex</th><th className="has-text-centered">Sáb</th>
              <th className="has-text-centered">Dom</th><th className="has-text-centered">Qtd.</th>
              <th className="has-text-centered">KM</th>
              <th>Transportadora</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map(item => (
              <tr key={item.id} className={getRowClass(item)}>
                {isDeleteMode && (
                  <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>
                    <label className="checkbox">
                      <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => onSelectItem(item.id)} />
                    </label>
                  </td>
                )}
                <th style={{ verticalAlign: 'middle' }}>{item.cooperado}</th>
                <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>{item.seg}</td>
                <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>{item.ter}</td>
                <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>{item.qua}</td>
                <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>{item.qui}</td>
                <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>{item.sex}</td>
                <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>0</td>
                <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>-</td>
                <td className="has-text-centered has-text-weight-bold" style={{ verticalAlign: 'middle' }}>{item.qtd}</td>
                <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>{item.km}</td>
                <td style={{ verticalAlign: 'middle' }}><b>{item.transportadora}</b></td>
                <td style={{ verticalAlign: 'middle', backgroundColor: item.status === 'Realizado' ? REALIZADO_ID_COLOR : PLANEJADO_ID_COLOR}}>
                  <div className={`icon-text has-text-weight-bold ${item.status === 'Realizado' ? 'has-text-success-dark' : 'has-text-info-dark'}`}>
                    <span className="icon">
                      {item.status === 'Realizado' ? <FaCheckCircle /> : <FaRegCircle />}
                    </span>
                    <span>{item.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={theme === 'dark' ? 'has-background-grey-darker' : 'has-background-white-ter'}>
              {isDeleteMode && <th></th>}
              <th>Total Geral</th>
              <th className="has-text-centered">{totals.seg}</th><th className="has-text-centered">{totals.ter}</th>
              <th className="has-text-centered">{totals.qua}</th><th className="has-text-centered">{totals.qui}</th>
              <th className="has-text-centered">{totals.sex}</th><th className="has-text-centered">0</th>
              <th className="has-text-centered">-</th><th className="has-text-centered">{totals.qtd}</th><th className="has-text-centered">{totals.km}</th>
              <th colSpan={2}></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};