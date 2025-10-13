import React from 'react';
import type { AgendaItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { FaCalendarAlt, FaGasPump } from 'react-icons/fa';
import { BsFillFuelPumpFill } from 'react-icons/bs';

interface Props {
  data: AgendaItem[];
  loading: boolean;
  error: string | null;
}

const AgendaTable: React.FC<Props> = ({ data, loading, error }) => {
  const { theme } = useTheme();

  if (loading) {
    return <progress className="progress is-large is-info" max="100"></progress>;
  }

  if (error) {
    return <div className="notification is-danger">{error}</div>;
  }
  
  if (!data || data.length === 0) {
    return <div className="notification is-info">Nenhum dado de agenda disponível.</div>;
  }

  const filial = data[0].filial;
  const product = filial === 'Primato' ? 'Bio Metano' : 'Diesel';
  const isCompleted = filial === 'Agrocampo';

  // Cores de destaque para thead e tfoot
  const headerFooterHighlightClass = isCompleted ? 'has-background-success' : 'has-background-info';
  const headerFooterTextColor = 'has-text-white';

  // Cores de fundo do wrapper, adaptadas para o tema dark
  const wrapperBgColor = isCompleted
    ? (theme === 'dark' ? 'has-background-success-dark' : 'has-background-success-light')
    : (theme === 'dark' ? 'has-background-info-dark' : 'has-background-light');

  const statusTagClass = isCompleted ? 'is-success' : 'is-info';

  const getRowBackgroundColor = (cooperadoName: string) => {
    const isEnglesing = cooperadoName.includes('Ademir Englesing');
    const isMachioro = cooperadoName.includes('Ademir Machioro');

    if (isEnglesing) return '#ffb3b3';
    if (isMachioro) return '#fffacd';
    return theme === 'dark' ? '#2d3748' : 'white';
  };
  
  const totalColetas = data.reduce((acc, item) => acc + item.somaColetas, 0);
  const totalKm = isCompleted ? data.reduce((acc, item) => acc + item.km, 0) : 0;
  
  const dailyTotals = [
    data.reduce((acc, item) => acc + (item.coletas[0]?.value || 0), 0),
    data.reduce((acc, item) => acc + (item.coletas[1]?.value || 0), 0),
    data.reduce((acc, item) => acc + (item.coletas[2]?.value || 0), 0),
    data.reduce((acc, item) => acc + (item.coletas[3]?.value || 0), 0),
    data.reduce((acc, item) => acc + (item.coletas[4]?.value || 0), 0),
    data.reduce((acc, item) => acc + (item.coletas[5]?.value || 0), 0),
    data.reduce((acc, item) => acc + (item.coletas[6]?.value || 0), 0),
  ];

  return (
    <div className={`table-container mb-5 p-0 ${wrapperBgColor}`}>
      <div className={`level is-mobile px-4 py-2 is-size-6`}>
        <div className="level-left">
          <span className="icon mr-2"><FaCalendarAlt /></span>
          <span className="has-text-weight-bold">{filial}</span>
          <span className="icon mr-2 ml-4">
            {product === 'Diesel' ? <BsFillFuelPumpFill /> : <FaGasPump />}
          </span>
          <span className="has-text-weight-bold">{product}</span>
        </div>
        <div className="level-right">
          <span className={`tag ml-4 ${statusTagClass}`}>{isCompleted ? 'Realizado' : 'Planejado'}</span>
        </div>
      </div>
      <table className="table is-bordered is-hoverable is-fullwidth is-narrow" style={{ minWidth: '1000px', tableLayout: 'fixed' }}>
        <thead className={`${headerFooterHighlightClass} ${headerFooterTextColor}`}>
          <tr>
            <th style={{ verticalAlign: 'middle', minWidth: '150px', whiteSpace: 'nowrap' }} className={headerFooterTextColor}>Cooperado</th>
            <th className={`has-text-centered ${headerFooterTextColor} is-hidden-touch`}>Seg</th>
            <th className={`has-text-centered ${headerFooterTextColor} is-hidden-touch`}>Ter</th>
            <th className={`has-text-centered ${headerFooterTextColor} is-hidden-touch`}>Qua</th>
            <th className={`has-text-centered ${headerFooterTextColor} is-hidden-touch`}>Qui</th>
            <th className={`has-text-centered ${headerFooterTextColor} is-hidden-touch`}>Sex</th>
            <th className={`has-text-centered ${headerFooterTextColor} is-hidden-touch`}>Sáb</th>
            <th className={`has-text-centered ${headerFooterTextColor} is-hidden-touch`}>Dom</th>
            <th style={{ verticalAlign: 'middle', minWidth: '80px' }} className={headerFooterTextColor}>Soma</th>
            <th style={{ verticalAlign: 'middle', minWidth: '80px' }} className={headerFooterTextColor}>KM</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} style={{ backgroundColor: getRowBackgroundColor(item.cooperado), color: theme === 'dark' && getRowBackgroundColor(item.cooperado) === 'transparent' ? '#e2e8f0' : 'inherit' }}>
              <td>
                <span className="is-size-6 has-text-weight-bold">{item.cooperado}</span>
              </td>
              {item.coletas.map((coleta, index) => (
                <td key={`coleta-${item.id}-${index}`} className="has-text-centered is-hidden-touch">
                  {coleta.value !== null ? coleta.value : ''}
                </td>
              ))}
              <td className="has-text-centered">{item.somaColetas}</td>
              <td className="has-text-centered">{isCompleted ? item.km : '-'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className={`${headerFooterHighlightClass} ${headerFooterTextColor}`}>
          <tr>
            <th className={headerFooterTextColor}>Total</th>
            {dailyTotals.map((total, index) => (
              <th key={`total-dia-${index}`} className={`has-text-centered ${headerFooterTextColor} is-hidden-touch`}>{total}</th>
            ))}
            <th className={`has-text-centered ${headerFooterTextColor}`}>{totalColetas}</th>
            <th className={`has-text-centered ${headerFooterTextColor}`}>{isCompleted ? totalKm : '-'}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default AgendaTable;