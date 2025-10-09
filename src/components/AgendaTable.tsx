// src/components/AgendaTable.tsx
import React from 'react';
import type { AgendaItem } from '../services/api';
import useTheme from '../hooks/useTheme';

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

  const getFilialColor = (filial: 'Primato' | 'Agrocampo') => {
    return filial === 'Primato' ? 'has-text-danger-dark' : 'has-text-info-dark';
  };

  const renderHeaders = () => {
    // Supondo que todos os itens tenham a mesma estrutura de 'coletas'
    const dates = data.length > 0 ? data[0].coletas.map(c => c.date) : [];
    const monthName = data.length > 0 ? 
      new Date(data[0].coletas[0].fullDate).toLocaleString('pt-BR', { month: 'long' }) : 
      'Mês';

    return (
      <>
        <tr>
          <th rowSpan={2} style={{ verticalAlign: 'middle', width: '25%', minWidth: '200px' }}>Cooperado</th>
          <th colSpan={dates.length} className="has-text-centered">{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</th>
          <th rowSpan={2} style={{ verticalAlign: 'middle', minWidth: '100px' }}>Soma Coletas</th>
          <th rowSpan={2} style={{ verticalAlign: 'middle', minWidth: '80px' }}>KM</th>
        </tr>
        <tr>
          {dates.map((date, index) => (
            // Usar uma chave mais estável que o índice
            <th key={`header-${date}-${index}`}>{date}</th>
          ))}
        </tr>
      </>
    );
  };

  return (
    <div className="table-container">
      <table className="table is-bordered is-hoverable is-fullwidth is-narrow" style={{ minWidth: '1000px', tableLayout: 'fixed' }}>
        <thead className={theme === 'dark' ? 'has-background-dark' : ''}>
          {renderHeaders()}
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>
                <span className={`is-size-6 has-text-weight-bold ${getFilialColor(item.filial)}`}>{item.cooperado}</span>
              </td>
              {item.coletas.map((coleta, index) => (
                // Usar uma chave mais estável que o índice
                <td key={`coleta-${item.id}-${index}`} className="has-text-centered">
                  {coleta.value !== null ? coleta.value : ''}
                </td>
              ))}
              <td className="has-text-centered">{item.somaColetas}</td>
              <td className="has-text-centered">{item.km}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgendaTable;