// src/screens/Faturamentos.tsx

import React, { useState, useEffect } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import MonthlyBarChart from '../components/MonthlyBarChart';
import { fetchFaturamentoData, fetchAbastecimentoVolumeData } from '../services/api';
import { type FaturamentoItem, type AbastecimentoVolumeItem } from '../types/models';

const Faturamentos = () => {
  const navigate = useNavigate();
  const [faturamentoData, setFaturamentoData] = useState<FaturamentoItem[]>([]);
  const [abastecimentoData, setAbastecimentoData] = useState<AbastecimentoVolumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [faturamentos, abastecimentos] = await Promise.all([
          fetchFaturamentoData(),
          fetchAbastecimentoVolumeData()
        ]);
        setFaturamentoData(faturamentos);
        setAbastecimentoData(abastecimentos);
      } catch (err) {
        setError("Ocorreu um erro ao buscar os dados de faturamento.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="screen-container p-2">
      {/* HEADER / TOOLBAR */}
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem' }}>
        <div className="level is-mobile">
          <div className="level-left">
            <button className="button is-white mr-2" onClick={() => navigate(-1)}>
              <span className="icon"><MdArrowBack size={24} /></span>
            </button>
            <span className="title is-4 mb-0" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Faturamentos</span>
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
          ) : error ? (
            <div className="notification is-danger mt-4">{error}</div>
          ) : (
            <div className="columns mt-4">
              <div className="column is-half">
                <div className="card h-100">
                  <div className="card-content">
                    <MonthlyBarChart
                      chartData={faturamentoData.map(item => ({ name: item.name, value: item.faturamento }))}
                      title="Faturamentos Realizados (mês)"
                      dataKey="value"
                      barColor="#007bff"
                      yAxisLabel="(R$)"
                    />
                  </div>
                </div>
              </div>
              <div className="column is-half">
                <div className="card h-100">
                   <div className="card-content">
                    <MonthlyBarChart
                      chartData={abastecimentoData.map(item => ({ name: item.name, value: item.volume }))}
                      title="Abastecimentos Realizados (m³)"
                      dataKey="value"
                      barColor="#3298dc"
                      yAxisLabel="(M³)"
                    />
                   </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Faturamentos;