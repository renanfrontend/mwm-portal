import React, { useState, useEffect } from 'react';
import {
  fetchAbastecimentoReportData,
  fetchAbastecimentoSummaryData,
  type AbastecimentoReportItem,
  type AbastecimentoSummaryItem
} from '../services/api';

const AbastecimentoReport = () => {
  const [reportData, setReportData] = useState<AbastecimentoReportItem[]>([]);
  const [summaryData, setSummaryData] = useState<AbastecimentoSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedReportData, fetchedSummaryData] = await Promise.all([
          fetchAbastecimentoReportData(),
          fetchAbastecimentoSummaryData(),
        ]);
        setReportData(fetchedReportData);
        setSummaryData(fetchedSummaryData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
            <tr key={index}>
              <td>{item.veiculo}</td>
              <td>{item.placa}</td>
              <td>{item.volumeTotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderReportTable = () => (
    <div className="table-container">
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
          {reportData.map((item, index) => (
            <tr key={index}>
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
    </div>
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title is-4">Relatório de Abastecimento</h1>
        <div className="card mb-4">
          <div className="card-content">
            <h2 className="subtitle is-5">Sumário por Veículo e Placa</h2>
            {loading ? (
              <progress className="progress is-large is-info" max="100"></progress>
            ) : (
              renderSummaryTable()
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <h2 className="subtitle is-5">Relatório Completo</h2>
            {loading ? (
              <progress className="progress is-large is-info" max="100"></progress>
            ) : (
              renderReportTable()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbastecimentoReport;