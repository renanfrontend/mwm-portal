// src/screens/Abastecimentos.tsx

import { useState, useEffect } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAbastecimentoAggregatedVolumeData, type AbastecimentoVolumeItem } from '../services/api';

const Abastecimentos = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AbastecimentoVolumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');

  useEffect(() => {
    const load = async () => { setLoading(true); try { const d = await fetchAbastecimentoAggregatedVolumeData(period); setData(d); } finally { setLoading(false); } };
    load();
  }, [period]);

  return (
    <div className="p-5" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
        <div className="is-flex is-align-items-center">
            <button className="button is-white border mr-3" onClick={() => navigate(-1)}><span className="icon"><MdArrowBack /></span></button>
            <h1 className="title is-4 mb-0">Abastecimentos</h1>
        </div>
        <div className="buttons has-addons">
            <button className={`button ${period === 'day' ? 'is-info' : ''}`} onClick={() => setPeriod('day')}>Dia</button>
            <button className={`button ${period === 'week' ? 'is-info' : ''}`} onClick={() => setPeriod('week')}>Semana</button>
            <button className={`button ${period === 'month' ? 'is-info' : ''}`} onClick={() => setPeriod('month')}>Mês</button>
        </div>
      </div>

      {loading ? <p>Carregando...</p> : (
          <div className="box shadow-none border" style={{ height: '400px' }}>
              <ResponsiveContainer>
                  <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="volume" stroke="#3298dc" strokeWidth={2} />
                  </LineChart>
              </ResponsiveContainer>
          </div>
      )}
    </div>
  );
};

export default Abastecimentos;