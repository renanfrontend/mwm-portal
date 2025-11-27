// src/screens/Cooperados.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdDelete, MdPersonAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AgendaTable } from '../components/AgendaTable';
import { CooperadoListItem } from '../components/CooperadoListItem';
import { fetchNewAgendaData, type AgendaData, fetchCooperadosData, type CooperadoItem } from '../services/api';

// Modais
import CooperadoContactModal from '../components/CooperadoContactModal';
import CooperadoLocationModal from '../components/CooperadoLocationModal';
import CooperadoInfoModal from '../components/CooperadoInfoModal';
import CooperadoEditModal from '../components/CooperadoEditModal';
import CooperadoCalendarModal from '../components/CooperadoCalendarModal';

const Cooperados: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cadastro');
  const navigate = useNavigate();

  const [agendaData, setAgendaData] = useState<AgendaData[]>([]);
  const [cooperadosData, setCooperadosData] = useState<CooperadoItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterTransportadora, setFilterTransportadora] = useState<string[]>([]);

  // States dos Modais
  const [selectedCooperado, setSelectedCooperado] = useState<CooperadoItem | null>(null);
  const [isContactModalActive, setIsContactModalActive] = useState(false);
  const [isLocationModalActive, setIsLocationModalActive] = useState(false);
  const [isInfoModalActive, setIsInfoModalActive] = useState(false);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [isCalendarModalActive, setIsCalendarModalActive] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (activeTab === 'agenda') {
        const data = await fetchNewAgendaData();
        setAgendaData(data || []);
      } else {
        const data = await fetchCooperadosData();
        setCooperadosData(data || []);
      }
    } catch (err) {
      setError("Erro ao buscar dados.");
      toast.error("Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
    setSearchTerm(''); setSelectedItems([]); setIsDeleteMode(false);
  }, [activeTab, loadData]);
  
  const filteredAgendaData = useMemo(() => (agendaData || []).filter(item => (item.cooperado.toLowerCase().includes(searchTerm.toLowerCase())) && (filterStatus.length === 0 || filterStatus.includes(item.status)) && (filterTransportadora.length === 0 || filterTransportadora.includes(item.transportadora))), [searchTerm, agendaData, filterStatus, filterTransportadora]);
  const filteredCooperadosData = useMemo(() => (cooperadosData || []).filter(item => (item.motorista && item.motorista.toLowerCase().includes(searchTerm.toLowerCase())) || (item.filial && item.filial.toLowerCase().includes(searchTerm.toLowerCase()))), [searchTerm, cooperadosData]);
  
  const handleSelectItem = (id: string | number) => { setSelectedItems(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]) };
  
  const handleConfirmDelete = () => {
    try {
      if (activeTab === 'agenda') {
        setAgendaData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      } else {
        setCooperadosData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      }
      toast.success("Itens excluídos.");
      setSelectedItems([]); setIsModalOpen(false); setIsDeleteMode(false);
    } catch {
      toast.error("Erro ao excluir.");
      setIsModalOpen(false);
    }
  };
  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => { setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]); };
  const clearFilters = () => { setFilterStatus([]); setFilterTransportadora([]); };

  // Handlers Modais
  const handleOpenContactModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsContactModalActive(true); };
  const handleOpenLocationModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsLocationModalActive(true); };
  const handleOpenViewModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsInfoModalActive(true); };
  const handleOpenEditModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsEditModalActive(true); };
  
  // Abre Calendário
  const handleOpenCalendarModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsCalendarModalActive(true); };

  const handleSaveCooperado = (editedItem: CooperadoItem) => {
    setCooperadosData(prev => prev.map(item => item.id === editedItem.id ? editedItem : item));
    toast.success("Atualizado!");
    setIsEditModalActive(false); setSelectedCooperado(null);
  };

  // Salva Calendário -> Vai p/ Agenda
  const handleSaveCalendar = () => {
    setIsCalendarModalActive(false); setSelectedCooperado(null);
    setActiveTab('agenda');
    toast.success("Agendamento realizado!");
  };

  const handleOpenMapFromInfo = (item: CooperadoItem) => {
    setIsInfoModalActive(false);
    setTimeout(() => { setSelectedCooperado(item); setIsLocationModalActive(true); }, 100);
  };

  const closeAllModals = () => {
    setIsContactModalActive(false); setIsLocationModalActive(false); setIsInfoModalActive(false);
    setIsEditModalActive(false); setIsCalendarModalActive(false);
    setTimeout(() => setSelectedCooperado(null), 200);
  };

  return (
    <>
      <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <div className="navbar-item pl-0">
            <div className="buttons">
              <button className="button is-medium is-white" onClick={() => navigate(-1)}><span className="icon"><MdArrowBack /></span></button>
              <span className="is-size-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Cooperados</span>
            </div>
          </div>
        </div>
        <div className="navbar-end"><div className="navbar-item"><button className="button is-link"><span className="icon"><MdPersonAdd /></span></button></div></div>
      </nav>

      <section className="section has-background-white-bis" style={{ paddingTop: '6rem' }}>
        <div className="tabs is-toggle is-medium is-centered is-fullwidth">
          <ul>
            <li className={activeTab === 'cadastro' ? 'is-active' : ''}><a onClick={() => setActiveTab('cadastro')}><span>Cadastro</span></a></li>
            <li className={activeTab === 'agenda' ? 'is-active' : ''}><a onClick={() => setActiveTab('agenda')}><span>Agenda</span></a></li>
          </ul>
        </div>
      </section>

      {activeTab === 'cadastro' && (
        <section className="section bioPartners pt-1 pb-6">
          <div className="has-background-white-ter my-4 p-2">
            <div className="field is-grouped">
              <div className="control is-expanded"><div className="field has-addons"><div className="control is-expanded"><input className="input" type="text" placeholder="Digite nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div className="control"><button className="button"><span className="icon"><MdSearch /></span></button></div></div></div>
              <div className="control"><button className={`button is-pill ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => { setIsDeleteMode(!isDeleteMode); setSelectedItems([]); }}><span className="icon"><MdDelete /></span></button></div>
              <div className="control"><button className="button is-pill"><span className="icon"><MdFilterList /></span></button></div>
            </div>
          </div>
          
          {isDeleteMode && selectedItems.length > 0 && <div className="level is-mobile mb-4"><div className="level-left"><p>{selectedItems.length} item(s) selecionado(s)</p></div><div className="level-right"><button className="button is-danger" onClick={() => setIsModalOpen(true)}>Excluir</button></div></div>}
          
          {!loading && !error && filteredCooperadosData.map(item => (
            <CooperadoListItem 
              key={item.id} 
              item={item} 
              isDeleteMode={isDeleteMode} 
              isSelected={selectedItems.includes(item.id)} 
              onSelectItem={handleSelectItem}
              onContactItem={handleOpenContactModal}
              onLocationItem={handleOpenLocationModal}
              onViewItem={handleOpenViewModal}
              onEditItem={handleOpenEditModal}
              onCalendarItem={handleOpenCalendarModal}
            />
          ))}
        </section>
      )}

      {activeTab === 'agenda' && (
        <section className="section bioCalendars pt-1 pb-6">
          <div className="has-background-white-ter my-4 p-2">
            <div className="field is-grouped">
                <div className="control is-expanded"><div className="field has-addons"><div className="control is-expanded"><input className="input" type="text" placeholder="Digite nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div className="control"><button className="button"><span className="icon"><MdSearch /></span></button></div></div></div>
                <div className="control"><button className={`button is-pill ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => { setIsDeleteMode(!isDeleteMode); setSelectedItems([]); }}><span className="icon"><MdDelete /></span></button></div>
                <div className="control">
                    <div className={`dropdown is-right ${showFilters ? 'is-active' : ''}`}>
                        <div className="dropdown-trigger"><button className="button is-pill" aria-haspopup="true" aria-controls="dropdown-menu" onClick={() => setShowFilters(!showFilters)}><span className="icon"><MdFilterList /></span></button></div>
                        <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{width: '280px'}}>
                            <div className="dropdown-content">
                                <div className="dropdown-item"><label className="label is-small">STATUS</label><label className="checkbox is-small"><input type="checkbox" checked={filterStatus.includes('Planejado')} onChange={() => handleCheckboxChange(setFilterStatus, 'Planejado')} /> Planejado</label><br /><label className="checkbox is-small"><input type="checkbox" checked={filterStatus.includes('Realizado')} onChange={() => handleCheckboxChange(setFilterStatus, 'Realizado')} /> Realizado</label></div><hr className="dropdown-divider" />
                                <div className="dropdown-item"><label className="label is-small">TRANSPORTADORA</label><label className="checkbox is-small"><input type="checkbox" checked={filterTransportadora.includes('Primato')} onChange={() => handleCheckboxChange(setFilterTransportadora, 'Primato')} /> Primato</label><br /><label className="checkbox is-small"><input type="checkbox" checked={filterTransportadora.includes('Agrocampo')} onChange={() => handleCheckboxChange(setFilterTransportadora, 'Agrocampo')} /> Agrocampo</label></div><hr className="dropdown-divider" />
                                <div className="dropdown-item field is-grouped is-justify-content-space-between"><p className="control"><button className="button is-small is-light" onClick={clearFilters}>Limpar</button></p><p className="control"><button className="button is-small is-info" onClick={() => setShowFilters(false)}>Aplicar</button></p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div className="box p-0">
             {!loading && <AgendaTable data={filteredAgendaData} isDeleteMode={isDeleteMode} selectedItems={selectedItems} onSelectItem={handleSelectItem} onConfirmDelete={() => setIsModalOpen(true)} />}
          </div>
        </section>
      )}

      <div className={`modal ${isModalOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head"><p className="modal-card-title">Confirmar Exclusão</p></header>
          <section className="modal-card-body"><p>Você tem certeza?</p></section>
          <footer className="modal-card-foot"><button className="button" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="button is-danger" onClick={handleConfirmDelete}>Excluir</button></footer>
        </div>
      </div>

      <CooperadoContactModal isActive={isContactModalActive} onClose={closeAllModals} data={selectedCooperado} />
      <CooperadoLocationModal isActive={isLocationModalActive} onClose={closeAllModals} data={selectedCooperado} />
      <CooperadoInfoModal isActive={isInfoModalActive} onClose={closeAllModals} data={selectedCooperado} onOpenMap={handleOpenMapFromInfo} />
      <CooperadoEditModal isActive={isEditModalActive} onClose={closeAllModals} data={selectedCooperado} onSave={handleSaveCooperado} />
      <CooperadoCalendarModal isActive={isCalendarModalActive} onClose={closeAllModals} onSave={handleSaveCalendar} data={selectedCooperado} />
    </>
  );
};

export default Cooperados;