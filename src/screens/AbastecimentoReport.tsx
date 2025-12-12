// src/screens/AbastecimentoReport.tsx

import { useEffect } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { loadAbastecimentoData } from '../features/abastecimento/abastecimentoSlice';
import DetailedSupplyChart from '../components/DetailedSupplyChart';

const AbastecimentoReport = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { reportData, loading } = useAppSelector((state) => state.abastecimento);

  useEffect(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    dispatch(loadAbastecimentoData({ startDate, endDate }));
  }, [dispatch]);

  return (
    <div className="p-5" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      
      <div className="is-flex is-align-items-center mb-5">
        <button className="button is-white border mr-3" onClick={() => navigate(-1)}><span className="icon"><MdArrowBack /></span></button>
        <h1 className="title is-4 mb-0">Relatório de Abastecimento</h1>
      </div>

      {loading ? <p>Carregando...</p> : (
          <div>
              <div className="box shadow-none border mb-4">
                  <h2 className="title is-6">Gráfico Detalhado</h2>
                  <DetailedSupplyChart data={reportData} />
              </div>
              <div className="box shadow-none border">
                  <h2 className="title is-6">Dados Recentes</h2>
                  <table className="table is-fullwidth is-striped is-hoverable is-bordered is-size-7">
                      <thead><tr><th>Data</th><th>Veículo</th><th>Volume</th></tr></thead>
                      <tbody>
                          {reportData.slice(0, 5).map((item, i) => (
                              <tr key={i}><td>{item.data}</td><td>{item.veiculo}</td><td>{item.volume.toFixed(2)}</td></tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}
    </div>
  );
};

export default AbastecimentoReport;