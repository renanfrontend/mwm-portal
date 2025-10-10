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
  const product = filial === 'Agrocampo' ? 'Bio Metano' : 'Diesel';
  const isCompleted = filial === 'Agrocampo';

  // Mapeia os dados da API para o formato de exibição com cores do protótipo
  const mappedData = data.map(item => {
    let backgroundColor = theme === 'dark' ? 'transparent' : 'white';
    if (item.cooperado.includes('Ademir Englesing')) {
      backgroundColor = '#ffb3b3';
    } else if (item.cooperado.includes('Ademir Machioro')) {
      backgroundColor = '#fffacd';
    }
    return {
      ...item,
      backgroundColor,
      textColor: theme === 'dark' && backgroundColor === 'transparent' ? '#e2e8f0' : '#363636',
    };
  });

  const renderHeaders = () => {
    const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return (
      <>
        <tr>
          <th rowSpan={2} style={{ verticalAlign: 'middle', minWidth: '150px' }}>Cooperado</th>
          <th colSpan={7} className="has-text-centered">Semana</th>
          <th rowSpan={2} style={{ verticalAlign: 'middle', minWidth: '80px' }}>Soma</th>
          <th rowSpan={2} style={{ verticalAlign: 'middle', minWidth: '80px' }}>KM</th>
        </tr>
        <tr>
          {weekdays.map((day, index) => (
            <th key={`header-${day}-${index}`}>{day}</th>
          ))}
        </tr>
      </>
    );
  };

  const totalColetas = data.reduce((acc, item) => acc + item.somaColetas, 0);
  const totalKm = data.reduce((acc, item) => acc + item.km, 0);
  const dailyTotals = data[0].coletas.map((_, i) =>
    data.reduce((acc, item) => acc + (item.coletas[i].value || 0), 0)
  );

  return (
    <div className="table-container mb-5">
      <div className={`level is-mobile px-4 py-2 is-size-6 ${isCompleted ? 'has-background-success-light' : 'has-background-info-light'}`}>
        <div className="level-left">
          <span className="icon mr-2"><FaCalendarAlt /></span>
          <span className="has-text-weight-bold">{filial}</span>
          <span className="icon mr-2 ml-4">
            {product === 'Diesel' ? <BsFillFuelPumpFill /> : <FaGasPump />}
          </span>
          <span className="has-text-weight-bold">{product}</span>
        </div>
        <div className="level-right">
          <span className={`tag ml-4 ${isCompleted ? 'is-success' : 'is-info'}`}>{isCompleted ? 'Realizado' : 'Planejado'}</span>
        </div>
      </div>
      <table className="table is-bordered is-hoverable is-fullwidth is-narrow" style={{ minWidth: '1000px', tableLayout: 'fixed' }}>
        <thead className={theme === 'dark' ? 'has-background-dark' : ''}>
          {renderHeaders()}
        </thead>
        <tbody>
          {mappedData.map(item => (
            <tr key={item.id} style={{ backgroundColor: item.backgroundColor, color: item.textColor }}>
              <td>
                <span className="is-size-6 has-text-weight-bold">{item.cooperado}</span>
              </td>
              {item.coletas.map((coleta, index) => (
                <td key={`coleta-${item.id}-${index}`} className="has-text-centered">
                  {coleta.value !== null ? coleta.value : ''}
                </td>
              ))}
              <td className="has-text-centered">{item.somaColetas}</td>
              <td className="has-text-centered">{item.km}</td>
            </tr>
          ))}
          {/* Linha de Totais */}
          <tr className={`has-text-weight-bold ${isCompleted ? 'has-background-success' : 'has-background-info'}`} style={{ color: 'white' }}>
            <td>Total</td>
            {dailyTotals.map((total, index) => (
              <td key={`total-dia-${index}`} className="has-text-centered">{total}</td>
            ))}
            <td className="has-text-centered">{totalColetas}</td>
            <td className="has-text-centered">{totalKm}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AgendaTable;