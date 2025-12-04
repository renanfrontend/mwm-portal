// src/screens/Logistica.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdDelete, MdPersonAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AgendaTable } from '../components/AgendaTable';
import { CooperadoListItem } from '../components/CooperadoListItem';
import { fetchNewAgendaData, type AgendaData, fetchCooperadosData, type CooperadoItem } from '../services/api';
import { TransportadoraList } from '../components/TransportadoraList';

// IMPORTS DOS MODAIS
import CooperadoContactModal from '../components/CooperadoContactModal';
import CooperadoLocationModal from '../components/CooperadoLocationModal';
import CooperadoInfoModal from '../components/CooperadoInfoModal';
import CooperadoEditModal from '../components/CooperadoEditModal';
import CooperadoCalendarModal from '../components/CooperadoCalendarModal';
import CooperadoCreateModal from '../components/CooperadoCreateModal';

const Logistica: React.FC = () => {
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

  // --- ESTADOS DOS MODAIS ---
  const [selectedCooperado, setSelectedCooperado] = useState<CooperadoItem | null>(null);
  const [isContactModalActive, setIsContactModalActive] = useState(false);
  const [isLocationModalActive, setIsLocationModalActive] = useState(false);
  const [isInfoModalActive, setIsInfoModalActive] = useState(false);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [isCalendarModalActive, setIsCalendarModalActive] = useState(false);
  const [isCreateModalActive, setIsCreateModalActive] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (activeTab === 'agenda') {
        const data = await fetchNewAgendaData();
        setAgendaData(data || []);
      } else if (activeTab === 'cadastro') {
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
      } else if (activeTab === 'cadastro') {
        setCooperadosData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      }
      toast.success("Itens excluídos com sucesso.");
      setSelectedItems([]); setIsModalOpen(false); setIsDeleteMode(false);
    } catch {
      toast.error("Erro ao excluir.");
      setIsModalOpen(false);
    }
  };
  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => { setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]); };
  const clearFilters = () => { setFilterStatus([]); setFilterTransportadora([]); };

  // --- HANDLERS ---
  const handleOpenContactModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsContactModalActive(true); };
  const handleOpenLocationModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsLocationModalActive(true); };
  const handleOpenViewModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsInfoModalActive(true); };
  const handleOpenEditModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsEditModalActive(true); };
  const handleOpenCalendarModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsCalendarModalActive(true); };
  
  const handleOpenCreateModal = () => { setIsCreateModalActive(true); };

  const handleSaveNewCooperado = (newItem: CooperadoItem) => {
    setCooperadosData(prev => [newItem, ...prev]);
    toast.success("Novo cooperado adicionado com sucesso!");
    setIsCreateModalActive(false);
  };

  const handleSaveCooperado = (editedItem: CooperadoItem) => { setCooperadosData(prev => prev.map(item => item.id === editedItem.id ? editedItem : item)); toast.success("Atualizado!"); setIsEditModalActive(false); setSelectedCooperado(null); };
  const handleSaveCalendar = () => { setIsCalendarModalActive(false); setSelectedCooperado(null); setActiveTab('agenda'); toast.success("Agendamento realizado!"); };
  const handleOpenMapFromInfo = (item: CooperadoItem) => { setIsInfoModalActive(false); setTimeout(() => { setSelectedCooperado(item); setIsLocationModalActive(true); }, 100); };

  const closeAllModals = () => {
    setIsContactModalActive(false); setIsLocationModalActive(false); setIsInfoModalActive(false); setIsEditModalActive(false); setIsCalendarModalActive(false); setIsCreateModalActive(false); 
    setTimeout(() => setSelectedCooperado(null), 200);
  };

  return (
    <div className="screen-container">
      
      {/* CABEÇALHO (TOOLBAR) */}
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem' }}>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="buttons">
              <button className="button is-white mr-2" onClick={() => navigate(-1)}>
                <span className="icon"><MdArrowBack size={24} /></span>
              </button>
              <span className="title is-4 mb-0" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Logística</span>
            </div>
          </div>
          <div className="level-right"></div>
        </div>
      </div>

      {/* ABAS */}
      <div className="tabs is-toggle is-fullwidth mb-0" style={{ borderBottom: '1px solid #dbdbdb', backgroundColor: '#fff' }}>
        <ul>
          <li className={activeTab === 'cadastro' ? 'is-active' : ''}><a onClick={() => setActiveTab('cadastro')}><span>Cooperados</span></a></li>
          <li className={activeTab === 'transportadora' ? 'is-active' : ''}><a onClick={() => setActiveTab('transportadora')}><span>Transportadoras</span></a></li>
          <li className={activeTab === 'agenda' ? 'is-active' : ''}><a onClick={() => setActiveTab('agenda')}><span>Agenda</span></a></li>
        </ul>
      </div>

      {/* CONTEÚDO SCROLLÁVEL */}
      <div className="screen-content">
        
        {/* ABA CADASTRO */}
        {activeTab === 'cadastro' && (
          <div className="container is-fluid px-0">
            <div className="box mb-4">
              <div className="field is-grouped">
                <div className="control is-expanded"><div className="field has-addons"><div className="control is-expanded"><input className="input" type="text" placeholder="Digite nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div className="control"><button className="button"><span className="icon"><MdSearch /></span></button></div></div></div>
                <div className="control"><button className={`button is-pill ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => { setIsDeleteMode(!isDeleteMode); setSelectedItems([]); }}><span className="icon"><MdDelete /></span></button></div>
                <div className="control"><button className="button is-pill"><span className="icon"><MdFilterList /></span></button></div>
                
                {/* BOTÃO ADICIONAR (APENAS AQUI) */}
                <div className="control">
                  <button className="button is-link" onClick={handleOpenCreateModal}>
                    <span className="icon"><MdPersonAdd /></span>
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            </div>
            
            {isDeleteMode && selectedItems.length > 0 && <div className="level is-mobile mb-4"><div className="level-left"><p>{selectedItems.length} item(s) selecionado(s)</p></div><div className="level-right"><button className="button is-danger" onClick={() => setIsModalOpen(true)}>Excluir</button></div></div>}
            {!loading && !error && filteredCooperadosData.map(item => (
              <CooperadoListItem 
                key={item.id} item={item} isDeleteMode={isDeleteMode} isSelected={selectedItems.includes(item.id)} onSelectItem={handleSelectItem}
                onContactItem={handleOpenContactModal} onLocationItem={handleOpenLocationModal} onViewItem={handleOpenViewModal} onEditItem={handleOpenEditModal} onCalendarItem={handleOpenCalendarModal}
              />
            ))}
          </div>
        )}

        {/* ABA AGENDA */}
        {activeTab === 'agenda' && (
          <div className="container is-fluid px-0">
            <div className="box mb-4">
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
          </div>
        )}

        {/* ABA TRANSPORTADORA */}
        {activeTab === 'transportadora' && (
          <div className="container is-fluid px-0">
            <TransportadoraList />
          </div>
        )}

      </div>

      <div className={`modal ${isModalOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head"><p className="modal-card-title">Confirmar Exclusão</p></header>
          <section className="modal-card-body"><p>Você tem certeza?</p></section>
          <footer className="modal-card-foot"><button className="button" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="button is-danger" onClick={handleConfirmDelete}>Excluir</button></footer>
        </div>
      </div>

      {/* MODAIS */}
      <CooperadoContactModal isActive={isContactModalActive} onClose={closeAllModals} data={selectedCooperado} />
      <CooperadoLocationModal isActive={isLocationModalActive} onClose={closeAllModals} data={selectedCooperado} />
      <CooperadoInfoModal isActive={isInfoModalActive} onClose={closeAllModals} data={selectedCooperado} onOpenMap={handleOpenMapFromInfo} />
      <CooperadoEditModal isActive={isEditModalActive} onClose={closeAllModals} data={selectedCooperado} onSave={handleSaveCooperado} />
      <CooperadoCalendarModal isActive={isCalendarModalActive} onClose={closeAllModals} onSave={handleSaveCalendar} data={selectedCooperado} />
      <CooperadoCreateModal isActive={isCreateModalActive} onClose={closeAllModals} onSave={handleSaveNewCooperado} />

    </div>
  );
};

export default Logistica;