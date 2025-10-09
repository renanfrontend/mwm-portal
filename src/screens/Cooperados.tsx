// src/screens/Cooperados.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdLocationOn, MdModeEdit, MdRemoveRedEye, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { fetchCooperadosData, fetchCalendarEvents, updateCalendarEvent, fetchAgendaData, createCalendarEvent, type CooperadoItem, type CalendarEvent, type AgendaItem } from '../services/api';

// Imports para o calendário e drag-and-drop
import { Calendar, momentLocalizer, type View, Navigate } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import moment from 'moment';
import 'moment/locale/pt-br';
import '../styles/calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

// Importa o novo componente de tabela
import AgendaTable from '../components/AgendaTable';

// Garante que o moment use o idioma português do Brasil globalmente
moment.locale('pt-br');
// Configura o moment para usar o idioma português do Brasil
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Cooperados = () => {
  const [activeTab, setActiveTab] = useState('cadastro');
  const [cooperadosData, setCooperadosData] = useState<CooperadoItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [agendaData, setAgendaData] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ isOpen: boolean; event?: CalendarEvent; slot?: { start: Date, end: Date } }>({ isOpen: false });
  const [date, setDate] = useState(new Date(2025, 9, 1));
  const [view, setView] = useState<View>('month');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [cooperados, events, agenda] = await Promise.all([
        fetchCooperadosData(),
        fetchCalendarEvents(),
        fetchAgendaData(),
      ]);
      setCooperadosData(cooperados);
      setCalendarEvents(events);
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

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date, end: Date }) => {
      setNewEventTitle('');
      setModalError(null);
      setModalState({ isOpen: true, slot: { start, end } });
    },
    []
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      setNewEventTitle(event.title);
      setModalError(null);
      setModalState({ isOpen: true, event });
    },
    []
  );

  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);
  const handleViewChange = useCallback((newView: View) => setView(newView), [setView]);

  const handleModalClose = () => {
    setModalState({ isOpen: false });
    setNewEventTitle('');
    setModalError(null);
  };

  const handleModalSave = async () => {
    if (!newEventTitle.trim()) {
      setModalError('O título do evento é obrigatório.');
      return;
    }

    try {
      if (modalState.slot) { // Criando novo evento
        const newEvent: Omit<CalendarEvent, 'id'> = {
          title: newEventTitle,
          start: modalState.slot.start,
          end: modalState.slot.end, // A view 'month' trata slots como o dia inteiro
          allDay: false,
          resource: 'coleta',
        };
        await createCalendarEvent(newEvent);
      } else if (modalState.event) { // Atualizando evento existente
        const updatedEvent = { ...modalState.event, title: newEventTitle };
        await updateCalendarEvent(updatedEvent);
      }
      handleModalClose();
      await loadData(); // Recarrega os dados
    } catch (err) {
      setModalError("Falha ao salvar o evento.");
      console.error(err);
    }
  };

  const onEventDrop = useCallback(
    async ({ event, start, end, allDay }: { event: CalendarEvent; start: Date; end: Date; allDay?: boolean }) => {
      const updatedEvent = { ...event, start, end, allDay };
  
      setCalendarEvents(prevEvents => {
        const originalEvents = [...prevEvents];
        const idx = originalEvents.findIndex(e => e.id === event.id);
        if (idx === -1) return originalEvents;
  
        const newEvents = [...originalEvents];
        newEvents.splice(idx, 1, updatedEvent);
        return newEvents;
      });
  
      try {
        await updateCalendarEvent(updatedEvent);
      } catch (err) {
        console.error("Falha ao mover o evento:", err);
        setError("Não foi possível salvar a alteração. Revertendo.");
        await loadData(); // Recarrega os dados originais
      }
    },
    [loadData],
  );

  const onEventResize = useCallback(
    async ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
      setCalendarEvents(prevEvents => prevEvents.map(existingEvent =>
        existingEvent.id === event.id ? { ...existingEvent, start, end } : existingEvent));
      try {
        await updateCalendarEvent({ ...event, start, end });
      } catch (err) {
        console.error("Falha ao redimensionar o evento:", err);
        setError("Não foi possível salvar a alteração. Revertendo.");
        await loadData(); // Recarrega os dados originais
      }
    },
    [loadData],
  );

  const getCertificadoClass = (status: CooperadoItem['certificado']) => {
    return status === 'Ativo' ? 'is-success' : 'is-danger';
  };

  const filteredData = cooperadosData.filter(item =>
    item.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.filial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { messages, eventPropGetter } = useMemo(() => ({
    messages: {
      next: 'Próximo',
      previous: 'Anterior',
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      agenda: 'Agenda',
      date: 'Data',
      time: 'Hora',
      event: 'Evento',
      allDay: 'Dia Inteiro',
      noEventsInRange: 'Nenhum evento neste período.',
      showMore: (total: number) => `+ Ver mais (${total})`,
    },
    eventPropGetter: (event: CalendarEvent) => {
      const style = {
        backgroundColor: '#00C49F',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
      };
      if (event.resource === 'manutencao') {
        style.backgroundColor = '#FFBB28';
      }
      return { style };
    }
  }), []);

  return (
    <>
      <EventModal
        modalState={modalState}
        onClose={handleModalClose}
        onSave={handleModalSave}
        title={newEventTitle}
        setTitle={setNewEventTitle}
        error={modalError}
      />

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
            <button className="button is-primary" onClick={() => setModalState({ isOpen: true, slot: { start: new Date(), end: new Date() } })}>
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
          <li className={activeTab === 'visaoGeral' ? 'is-active' : ''}>
            <a onClick={() => setActiveTab('visaoGeral')}>Visão Geral</a>
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
              <DndProvider backend={HTML5Backend}>
                <DragAndDropCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  resizable
                  selectable
                  onEventDrop={onEventDrop}
                  onEventResize={onEventResize}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  onNavigate={handleNavigate}
                  onView={handleViewChange}
                  date={date}
                  view={view}
                  messages={messages}
                  eventPropGetter={eventPropGetter}
                  defaultDate={new Date(2025, 9, 1)}
                  style={{ height: '70vh' }}
                />
              </DndProvider>
            )}
          </div>
        </div>
      )}

      {activeTab === 'visaoGeral' && (
        <div className="card">
          <div className="card-content" style={{ overflowX: 'auto' }}>
            {loading ? (
              <progress className="progress is-large is-info" max="100"></progress>
            ) : error ? (
              <div className="notification is-danger">{error}</div>
            ) : (
              <AgendaTable data={agendaData} loading={loading} error={error} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

const EventModal = ({
  modalState,
  onClose,
  onSave,
  title,
  setTitle,
  error
}: {
  modalState: { isOpen: boolean; event?: CalendarEvent; slot?: { start: Date, end: Date } };
  onClose: () => void;
  onSave: () => void;
  title: string;
  setTitle: (value: string) => void;
  error: string | null;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!modalState.isOpen) setIsEditing(false);
  }, [modalState.isOpen]);

  if (!modalState.isOpen) return null;

  const isNewEvent = !!modalState.slot;
  const canEdit = !isNewEvent && isEditing;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{isNewEvent ? 'Novo Agendamento' : 'Detalhes do Agendamento'}</p>
          <button className="delete" aria-label="close" onClick={() => {
            onClose();
            setIsEditing(false);
          }}></button>
        </header>
        <section className="modal-card-body">
          {isNewEvent || canEdit ? (
            <div className="field">
              <label className="label">Título do Evento</label>
              <div className="control">
                <input
                  className={`input ${error ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Ex: Coleta para Ademir"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {error && <p className="help is-danger">{error}</p>}
            </div>
          ) : (
            <div>
              <p><strong>Título:</strong> {modalState.event?.title}</p>
              <p><strong>Início:</strong> {moment(modalState.event?.start).format('DD/MM/YYYY HH:mm')}</p>
              <p><strong>Fim:</strong> {moment(modalState.event?.end).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          )}
        </section>
        <footer className="modal-card-foot">
          {isNewEvent || canEdit ? (
            <button className="button is-success" onClick={onSave}>
              Salvar
            </button>
          ) : (
            <button className="button is-info" onClick={() => setIsEditing(true)}>
              Editar
            </button>
          )}
          <button className="button" onClick={() => {
            onClose();
            setIsEditing(false);
          }}>
            {isNewEvent || canEdit ? 'Cancelar' : 'Fechar'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Cooperados;