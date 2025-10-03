import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  fetchAbastecimentoReportData,
  fetchAbastecimentoSummaryData,
  fetchAbastecimentoVolumePorDiaData,
  addAbastecimentoReportItem,
  type AbastecimentoReportItem,
  type AbastecimentoSummaryItem,
  type AbastecimentoVolumePorDiaItem
} from '../services/api';
import useTheme from '../hooks/useTheme';
import MonthlyBarChart from '../components/MonthlyBarChart';
import DetailedSupplyChart from '../components/DetailedSupplyChart';
import AbastecimentoFormModal from '../components/AbastecimentoFormModal';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const getDefaultEndDate = () => new Date().toISOString().split('T')[0];
const getDefaultStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
};

const AbastecimentoReport = () => {
  const [reportData, setReportData] = useState<AbastecimentoReportItem[]>([]);
  const [summaryData, setSummaryData] = useState<AbastecimentoSummaryItem[]>([]);
  const [volumePorDiaData, setVolumePorDiaData] = useState<AbastecimentoVolumePorDiaItem[]>([]);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>(getDefaultStartDate());
  const [endDate, setEndDate] = useState<string>(getDefaultEndDate());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedReportData, fetchedSummaryData, fetchedVolumePorDiaData] = await Promise.all([
          fetchAbastecimentoReportData(startDate, endDate),
          fetchAbastecimentoSummaryData(startDate, endDate),
          fetchAbastecimentoVolumePorDiaData(startDate, endDate),
        ]);
        setReportData(fetchedReportData);
        setSummaryData(fetchedSummaryData);
        setVolumePorDiaData(fetchedVolumePorDiaData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [startDate, endDate]); // A paginação não precisa recarregar os dados

  const handleFormSubmit = async (formData: Omit<AbastecimentoReportItem, 'status' | 'cliente' | 'horaTermino'>) => {
    await addAbastecimentoReportItem(formData);
    setIsModalOpen(false);
    // Recarrega todos os dados para refletir a nova entrada
    setLoading(true);
    try {
      const [fetchedReportData, fetchedSummaryData, fetchedVolumePorDiaData] = await Promise.all([
        fetchAbastecimentoReportData(startDate, endDate),
        fetchAbastecimentoSummaryData(startDate, endDate),
        fetchAbastecimentoVolumePorDiaData(startDate, endDate),
      ]);
      setReportData(fetchedReportData);
      setSummaryData(fetchedSummaryData);
      setVolumePorDiaData(fetchedVolumePorDiaData);
    } catch (error) {
      console.error("Failed to refetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportData.length) {
      console.log("Nenhum dado para exportar.");
      return;
    }

    const headers = [
      "Status", "Cliente", "Veículo", "Placa", "Produto", "Data",
      "Hora Início", "Hora Término", "Volume (m³)", "Odômetro", "Usuário"
    ];

    // Envolve os campos que podem conter vírgulas com aspas duplas
    const csvRows = reportData.map(item => [
      item.status,
      `"${item.cliente}"`,
      item.veiculo,
      item.placa,
      item.produto,
      item.data,
      item.horaInicio,
      item.horaTermino,
      item.volume.toFixed(2),
      item.odometro,
      item.usuario
    ].join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio_abastecimento.csv';
    link.click();
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Volta para a primeira página ao mudar a quantidade de itens
  };

  const renderSummaryTable = () => (
    <div className="table-container">
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Tipo de Veículo</th>
            <th>Placa</th>
            <th>Volume Total (m³)</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((item, index) => (
            <tr key={`${item.veiculo}-${item.placa}`}>
              <td>{item.veiculo}</td>
              <td>{item.placa}</td>
              <td>{item.volumeTotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSummaryChart = () => (
    <div className="chart-container">
      <MonthlyBarChart
        chartData={summaryData.map(item => ({
          name: item.placa,
          value: item.volumeTotal,
        }))}
        title="Volume por Veículo"
        dataKey="value"
        barColor="#3298dc"
        yAxisLabel="(M³)"
      />
    </div>
  );

  const renderVolumePorDiaChart = () => (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title" style={{ color: theme === 'dark' ? '#a0aec0' : '#363636' }}>Volume de Abastecimento por Dia</p>
      </header>
      <div className="card-content">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={volumePorDiaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis yAxisId="left" label={{ value: 'Volume (m³)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)} m³`} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="volumeTotal" stroke="#8884d8" name="Volume Total" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderVolumePorProdutoChart = () => {
    const dataByProduct = reportData.reduce((acc, item) => {
      const { produto, volume } = item;
      if (!acc[produto]) {
        acc[produto] = { name: produto, value: 0 };
      }
      acc[produto].value += volume;
      return acc;
    }, {} as Record<string, { name: string, value: number }>);

    const chartData = Object.values(dataByProduct);

    return (
      <div className="card" style={{ height: '100%' }}>
        <header className="card-header"><p className="card-header-title">Volume por Produto</p></header>
        <div className="card-content">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} m³`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderAbastecimentosPorUsuarioChart = () => {
    const dataByUser = reportData.reduce((acc, item) => {
      const { usuario } = item;
      if (!acc[usuario]) {
        acc[usuario] = { name: usuario, value: 0 };
      }
      acc[usuario].value += 1;
      return acc;
    }, {} as Record<string, { name: string, value: number }>);

    const chartData = Object.values(dataByUser);

    return (
      <MonthlyBarChart
        chartData={chartData}
        title="Nº de Abastecimentos por Usuário"
        dataKey="value"
        barColor="#00C49F"
        yAxisLabel="Nº de Abastecimentos"
      />
    );
  };

  const renderReportTable = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);

    return (<div className="table-container">
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Status</th>
            <th>Cliente</th>
            <th>Veículo</th>
            <th>Placa</th>
            <th>Produto</th>
            <th>Data</th>
            <th>Hora Início</th>
            <th>Hora Término</th>
            <th>Volume (m³)</th>
            <th>Odômetro</th>
            <th>Usuário</th>
            <th>Recibo</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={`${item.placa}-${item.data}-${item.horaInicio}`}>
              <td>{item.status}</td>
              <td>{item.cliente}</td>
              <td>{item.veiculo}</td>
              <td>{item.placa}</td>
              <td>{item.produto}</td>
              <td>{item.data}</td>
              <td>{item.horaInicio}</td>
              <td>{item.horaTermino}</td>
              <td>{item.volume.toFixed(2)}</td>
              <td>{item.odometro}</td>
              <td>{item.usuario}</td>
              <td><a href="#">PDF</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(reportData.length / itemsPerPage);
    if (totalPages <= 1) return null;

    const handlePageChange = (pageNumber: number) => {
      if (pageNumber < 1 || pageNumber > totalPages) return;
      setCurrentPage(pageNumber);
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="level mt-4">
        <div className="level-left">
          <div className="level-item">
            <div className="field has-addons">
              <p className="control">
                <span className="select">
                  <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </span>
              </p>
              <p className="control">
                <button type="button" className="button is-static">itens por página</button>
              </p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <nav className="pagination is-centered" role="navigation" aria-label="pagination">
            <a
              className="pagination-previous"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </a>
            <a
              className="pagination-next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </a>
            <ul className="pagination-list">
              {/* A renderização dos números de página pode ser complexa para muitas páginas,
                  então a manteremos simples por enquanto, mas pode ser aprimorada. */}
            </ul>
          </nav>
        </div>
      </div>
    );
  };

  return (
    <div className="section">
      <div className="container">
        <AbastecimentoFormModal
          isActive={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
        <h1 className="title is-4">Relatório de Abastecimento</h1>

        <div className="card mb-4">
          <header className="card-header">
            <p className="card-header-title" style={{ color: theme === 'dark' ? '#a0aec0' : '#363636' }}>Filtro por Período</p>
          </header>
          <div className="card-content">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">Período</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <input className="input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-content">
            <h2 className="subtitle is-5" style={{ color: theme === 'dark' ? '#a0aec0' : '#363636' }}>Sumário por Veículo e Placa</h2>
            {loading
              ? (<progress className="progress is-large is-info" max="100"></progress>)
              : (
                <div className="columns is-vcentered">
                  <div className="column is-half">
                    {renderSummaryTable()}
                  </div>
                  <div className="column is-half">
                    {renderSummaryChart()}
                  </div>
                </div>
              )}
          </div>
        </div>
        <div className="mb-4">
          {loading ? null : renderVolumePorDiaChart()}
        </div>
        <div className="mb-4">
          {loading ? null : <DetailedSupplyChart data={reportData} />}
        </div>
        <div className="columns">
          <div className="column is-half">
            {loading ? null : renderVolumePorProdutoChart()}
          </div>
          <div className="column is-half">
            {loading ? null : renderAbastecimentosPorUsuarioChart()}
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="level">
              <div className="level-left" style={{ color: theme === 'dark' ? '#a0aec0' : '#363636' }}>
                <h2 className="subtitle is-5">Relatório Completo</h2>
              </div>
              <div className="level-right">
                <div className="buttons">
                  <button className="button is-link" onClick={handleExportCSV}>Exportar CSV</button>
                  <button className="button is-primary" onClick={() => setIsModalOpen(true)}>Adicionar Registro</button>
                </div>
              </div>
            </div>
            {loading ? (
              <progress className="progress is-large is-info" max="100"></progress>
            ) : (
              <>
                {renderReportTable()}
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbastecimentoReport;