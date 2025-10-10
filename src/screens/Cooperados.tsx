import React, { useState, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdLocationOn, MdModeEdit, MdRemoveRedEye, MdAdd, MdCalendarMonth } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { fetchCooperadosData, fetchAgendaData, type CooperadoItem, type AgendaItem } from '../services/api';
import AgendaTable from '../components/AgendaTable';
import moment from 'moment';
import 'moment/locale/pt-br';
import '../styles/calendar.css';

moment.locale('pt-br');

const Cooperados = () => {
  const [activeTab, setActiveTab] = useState('cadastro');
  const [cooperadosData, setCooperadosData] = useState<CooperadoItem[]>([]);
  const [agendaData, setAgendaData] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [cooperados, agenda] = await Promise.all([
        fetchCooperadosData(),
        fetchAgendaData(),
      ]);
      setCooperadosData(cooperados);
      setAgendaData(agenda);
    } catch (err) {
      setError("Ocorreu um erro ao buscar os dados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getCertificadoClass = (status: CooperadoItem['certificado']) => {
    return status === 'Ativo' ? 'is-success' : 'is-danger';
  };

  const filteredData = cooperadosData.filter(item =>
    item.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.filial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedAgendaData = Object.values(agendaData.reduce((acc, item) => {
    if (!acc[item.filial]) {
      acc[item.filial] = [];
    }
    acc[item.filial].push(item);
    return acc;
  }, {} as Record<string, AgendaItem[]>));

  return (
    <>
      <div className="level is-mobile mb-4">
        <div className="level-left">
          <div className="level-item">
            <button className="button is-light" onClick={() => navigate(-1)}>
              <span className="icon"><MdArrowBack /></span>
            </button>
          </div>
          <div className="level-item">
            <h1 className="title is-4">Cooperados</h1>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <button className="button is-primary">
              <span className="icon"><MdAdd /></span>
              <span>Adicionar Evento</span>
            </button>
          </div>
        </div>
      </div>

      <div className="tabs is-boxed">
        <ul>
          <li className={activeTab === 'cadastro' ? 'is-active' : ''}>
            <a onClick={() => setActiveTab('cadastro')}>Cadastro</a>
          </li>
          <li className={activeTab === 'agenda' ? 'is-active' : ''}>
            <a onClick={() => setActiveTab('agenda')}>Agenda</a>
          </li>
        </ul>
      </div>

      {activeTab === 'cadastro' && (
        <div className="content">
          <div className="level is-mobile mt-5 mb-4">
            <div className="level-left">
              <div className="level-item">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input
                      className="input"
                      type="text"
                      placeholder="Digite nome, empresa, veículo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="control">
                    <button className="button is-info">
                      <span className="icon"><MdSearch /></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button className="button is-light">
                  <span className="icon"><MdFilterList /></span>
                  <span>Filtrar</span>
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <progress className="progress is-large is-info" max="100"></progress>
          ) : error ? (
            <div className="notification is-danger">{error}</div>
          ) : (
            <div className="table-container is-hidden-touch">
              <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>Matrícula</th>
                    <th>Filial</th>
                    <th>Motorista</th>
                    <th>Tipo de Veículo</th>
                    <th>Placa</th>
                    <th>Certificado</th>
                    <th>Doam Dejetos</th>
                    <th>Fase</th>
                    <th style={{ width: '150px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(item => (
                    <tr key={item.id}>
                      <td>{item.matricula}</td>
                      <td>{item.filial}</td>
                      <td>{item.motorista}</td>
                      <td>{item.tipoVeiculo}</td>
                      <td>{item.placa}</td>
                      <td>
                        <span className={`tag ${getCertificadoClass(item.certificado)}`}>
                          {item.certificado}
                        </span>
                      </td>
                      <td>{item.doamDejetos}</td>
                      <td>{item.fase}</td>
                      <td>
                        <div className="buttons are-small is-flex is-justify-content-space-between is-align-items-center">
                          <button className="button is-light"><span className="icon"><MdLocationOn /></span></button>
                          <button className="button is-light"><span className="icon"><MdRemoveRedEye /></span></button>
                          <button className="button is-info is-light"><span className="icon"><MdCalendarMonth /></span></button>
                          <button className="button is-light"><span className="icon"><MdModeEdit /></span></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'agenda' && (
        <div className="card">
          <div className="card-content" style={{ overflowX: 'auto' }}>
            {loading ? (
              <progress className="progress is-large is-info" max="100"></progress>
            ) : error ? (
              <div className="notification is-danger">{error}</div>
            ) : (
              // Agrupa os dados por filial para o novo componente
              groupedAgendaData.map((filialData, index) => (
                <div key={index} className="mb-5">
                  <AgendaTable data={filialData} loading={loading} error={error} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cooperados;