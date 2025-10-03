import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAbastecimentoAggregatedVolumeData, type AbastecimentoVolumeItem } from '../services/api';

type Period = 'day' | 'week' | 'month';

const Abastecimentos = () => {
  const [data, setData] = useState<AbastecimentoVolumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('month');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const fetchedData = await fetchAbastecimentoAggregatedVolumeData(period);
      setData(fetchedData);
      setLoading(false);
    };
    loadData();
  }, [period]);

  const getTitle = () => {
    switch (period) {
      case 'day': return 'Abastecimentos Realizados (Diário)';
      case 'week': return 'Abastecimentos Realizados (Semanal)';
      case 'month': return 'Abastecimentos Realizados (Mensal)';
      default: return 'Abastecimentos Realizados';
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="level">
          <div className="level-left">
            <h1 className="title is-4">Abastecimentos</h1>
          </div>
          <div className="level-right">
            <div className="buttons has-addons">
              <button className={`button ${period === 'day' ? 'is-info' : ''}`} onClick={() => setPeriod('day')}>Dia</button>
              <button className={`button ${period === 'week' ? 'is-info' : ''}`} onClick={() => setPeriod('week')}>Semana</button>
              <button className={`button ${period === 'month' ? 'is-info' : ''}`} onClick={() => setPeriod('month')}>Mês</button>
            </div>
          </div>
        </div>
        {loading ? (
          <progress className="progress is-large is-info" max="100"></progress>
        ) : (
          <div className="card">
            <header className="card-header"><p className="card-header-title">{getTitle()}</p></header>
            <div className="card-content">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: '(M³)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} m³`} />
                  <Legend />
                  <Line type="monotone" dataKey="volume" stroke="#3298dc" name="Volume" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Abastecimentos;