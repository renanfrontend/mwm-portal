// src/screens/Abastecimentos.tsx

import React, { useState, useEffect } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAbastecimentoAggregatedVolumeData, type AbastecimentoVolumeItem } from '../services/api';

type Period = 'day' | 'week' | 'month';

const Abastecimentos = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AbastecimentoVolumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('month');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchAbastecimentoAggregatedVolumeData(period);
        setData(fetchedData);
      } catch (error) {
        console.error("Erro ao carregar abastecimentos", error);
      } finally {
        setLoading(false);
      }
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
    <div className="screen-container p-2">
      {/* HEADER / TOOLBAR */}
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem' }}>
        <div className="level is-mobile">
          <div className="level-left">
            <button className="button is-white mr-2" onClick={() => navigate(-1)}>
              <span className="icon"><MdArrowBack size={24} /></span>
            </button>
            <span className="title is-4 mb-0" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Abastecimentos</span>
          </div>
          <div className="level-right">
            <div className="buttons has-addons">
              <button 
                className={`button ${period === 'day' ? 'is-info' : ''}`} 
                onClick={() => setPeriod('day')}
              >
                Dia
              </button>
              <button 
                className={`button ${period === 'week' ? 'is-info' : ''}`} 
                onClick={() => setPeriod('week')}
              >
                Semana
              </button>
              <button 
                className={`button ${period === 'month' ? 'is-info' : ''}`} 
                onClick={() => setPeriod('month')}
              >
                Mês
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTEÚDO SCROLLÁVEL */}
      <div className="screen-content">
        <div className="container is-fluid px-0">
          
          {loading ? (
            <div className="p-6">
              <progress className="progress is-large is-info" max="100"></progress>
            </div>
          ) : (
            <div className="card mt-4">
              <header className="card-header">
                <p className="card-header-title">{getTitle()}</p>
              </header>
              <div className="card-content">
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: '(M³)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)} m³`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="volume" 
                        stroke="#3298dc" 
                        name="Volume" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Abastecimentos;