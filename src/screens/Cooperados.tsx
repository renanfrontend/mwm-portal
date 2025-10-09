// src/screens/Cooperados.tsx
import React, { useState, useEffect } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdLocationOn, MdModeEdit, MdRemoveRedEye, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { fetchCooperadosData, fetchCalendarEvents, type CooperadoItem, type CalendarEvent } from '../services/api';

// Imports para o calendário
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import '../styles/calendar.css'; // Estilos personalizados para o calendário

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const Cooperados = () => {
  const [activeTab, setActiveTab] = useState('cadastro');
  const [cooperadosData, setCooperadosData] = useState<CooperadoItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [cooperados, events] = await Promise.all([
          fetchCooperadosData(),
          fetchCalendarEvents(),
        ]);
        setCooperadosData(cooperados);
        setCalendarEvents(events);
      } catch (err) {
        setError("Ocorreu um erro ao buscar os dados.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getCertificadoClass = (status: CooperadoItem['certificado']) => {
    return status === 'Ativo' ? 'is-success' : 'is-danger';
  };

  const filteredData = cooperadosData.filter(item =>
    item.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.filial.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <span>Cadastrar</span>
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
            <div className="table-container">
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
                        <div className="buttons are-small">
                          <button className="button is-light"><span className="icon"><MdLocationOn /></span></button>
                          <button className="button is-light"><span className="icon"><MdRemoveRedEye /></span></button>
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
          <div className="card-content">
            {loading ? (
              <progress className="progress is-large is-info" max="100"></progress>
            ) : error ? (
              <div className="notification is-danger">{error}</div>
            ) : (
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '70vh' }}
                messages={{
                  next: 'Próximo',
                  previous: 'Anterior',
                  today: 'Hoje',
                  month: 'Mês',
                  week: 'Semana',
                  day: 'Dia',
                  agenda: 'Agenda',
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cooperados;