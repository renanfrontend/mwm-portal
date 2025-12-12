// src/screens/Faturamentos.tsx

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const load = async () => {
        setLoading(true);
        try {
            const [fat, abs] = await Promise.all([fetchFaturamentoData(), fetchAbastecimentoVolumeData()]);
            setFaturamentoData(fat); setAbastecimentoData(abs);
        } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="p-5" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      
      <div className="is-flex is-align-items-center mb-5">
        <button className="button is-white border mr-3" onClick={() => navigate(-1)}><span className="icon"><MdArrowBack /></span></button>
        <h1 className="title is-4 mb-0">Faturamentos</h1>
      </div>

      {loading ? <p>Carregando...</p> : (
          <div className="columns">
              <div className="column is-half">
                  <div className="box shadow-none border">
                      <MonthlyBarChart chartData={faturamentoData.map(i => ({name: i.name, value: i.faturamento}))} title="Faturamento (R$)" dataKey="value" barColor="#007bff" yAxisLabel="R$" />
                  </div>
              </div>
              <div className="column is-half">
                  <div className="box shadow-none border">
                      <MonthlyBarChart chartData={abastecimentoData.map(i => ({name: i.name, value: i.volume}))} title="Volume (m³)" dataKey="value" barColor="#3298dc" yAxisLabel="m³" />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Faturamentos;