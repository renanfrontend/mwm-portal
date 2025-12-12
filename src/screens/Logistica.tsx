// src/screens/Logistica.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdDelete, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AgendaTable } from '../components/AgendaTable';
import { CooperadoListItem } from '../components/CooperadoListItem';
import { fetchNewAgendaData, type AgendaData, fetchCooperadosData, type CooperadoItem } from '../services/api';
import { TransportadoraList } from '../components/TransportadoraList';

// Modais
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modais State
  const [selectedCooperado, setSelectedCooperado] = useState<CooperadoItem | null>(null);
  const [isContactModalActive, setIsContactModalActive] = useState(false);
  const [isLocationModalActive, setIsLocationModalActive] = useState(false);
  const [isInfoModalActive, setIsInfoModalActive] = useState(false);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [isCalendarModalActive, setIsCalendarModalActive] = useState(false);
  const [isCreateModalActive, setIsCreateModalActive] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'agenda') {
        const data = await fetchNewAgendaData();
        setAgendaData(data || []);
      } else if (activeTab === 'cadastro') {
        const data = await fetchCooperadosData();
        setCooperadosData(data || []);
      }
    } catch (err) {
      toast.error("Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
    setSearchTerm(''); setSelectedItems([]); setIsDeleteMode(false);
  }, [activeTab, loadData]);
  
  const filteredAgendaData = useMemo(() => (agendaData || []).filter(item => (item.cooperado.toLowerCase().includes(searchTerm.toLowerCase()))), [searchTerm, agendaData]);
  const filteredCooperadosData = useMemo(() => (cooperadosData || []).filter(item => (item.motorista && item.motorista.toLowerCase().includes(searchTerm.toLowerCase())) || (item.filial && item.filial.toLowerCase().includes(searchTerm.toLowerCase()))), [searchTerm, cooperadosData]);
  
  const handleSelectItem = (id: string | number) => { setSelectedItems(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]) };
  
  const handleConfirmDelete = () => {
    try {
      if (activeTab === 'agenda') setAgendaData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      else setCooperadosData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      toast.success("Itens excluídos.");
      setSelectedItems([]); setIsModalOpen(false); setIsDeleteMode(false);
    } catch {
      toast.error("Erro ao excluir.");
      setIsModalOpen(false);
    }
  };

  const closeAllModals = () => {
    setIsContactModalActive(false); setIsLocationModalActive(false); setIsInfoModalActive(false); setIsEditModalActive(false); setIsCalendarModalActive(false); setIsCreateModalActive(false); 
    setTimeout(() => setSelectedCooperado(null), 200);
  };

  // Handlers
  const handleOpenContactModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsContactModalActive(true); };
  const handleOpenLocationModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsLocationModalActive(true); };
  const handleOpenViewModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsInfoModalActive(true); };
  const handleOpenEditModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsEditModalActive(true); };
  const handleOpenCalendarModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsCalendarModalActive(true); };
  const handleOpenCreateModal = () => { setIsCreateModalActive(true); };
  const handleSaveNewCooperado = (newItem: CooperadoItem) => { setCooperadosData(prev => [newItem, ...prev]); toast.success("Adicionado!"); setIsCreateModalActive(false); };
  const handleSaveCooperado = (editedItem: CooperadoItem) => { setCooperadosData(prev => prev.map(item => item.id === editedItem.id ? editedItem : item)); toast.success("Atualizado!"); setIsEditModalActive(false); setSelectedCooperado(null); };
  const handleSaveCalendar = () => { setIsCalendarModalActive(false); toast.success("Agendamento realizado!"); };
  const handleOpenMapFromInfo = (item: CooperadoItem) => { setIsInfoModalActive(false); setTimeout(() => { setSelectedCooperado(item); setIsLocationModalActive(true); }, 100); };

  return (
    // ESTRUTURA FIXA COM FUNDO BRANCO
    <div className="screen-container" style={{ backgroundColor: '#fff' }}>
      
      {/* HEADER FIXO */}
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem' }}>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="buttons">
              <button className="button is-white border mr-2" onClick={() => navigate(-1)}>
                <span className="icon"><MdArrowBack size={24} /></span>
              </button>
              <span className="title is-4 mb-0" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Logística</span>
            </div>
          </div>
        </div>
      </div>

      {/* ABAS FIXAS */}
      <div className="tabs is-toggle is-fullwidth mb-0" style={{ borderBottom: '1px solid #dbdbdb', backgroundColor: '#fff' }}>
        <ul>
          <li className={activeTab === 'cadastro' ? 'is-active' : ''}><a onClick={() => setActiveTab('cadastro')}><span>Cooperados</span></a></li>
          <li className={activeTab === 'transportadora' ? 'is-active' : ''}><a onClick={() => setActiveTab('transportadora')}><span>Transportadoras</span></a></li>
          <li className={activeTab === 'agenda' ? 'is-active' : ''}><a onClick={() => setActiveTab('agenda')}><span>Agenda</span></a></li>
        </ul>
      </div>

      {/* CONTEÚDO COM SCROLL */}
      <div className="screen-content p-5">
        
        {/* ABA CADASTRO */}
        {activeTab === 'cadastro' && (
          <div className="container is-fluid px-0">
            {/* Barra de Busca Padronizada */}
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
                <div className="control has-icons-right">
                    <input 
                      className="input" 
                      type="text" 
                      placeholder="Buscar cooperado..." 
                      style={{ width: '300px' }} 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                    />
                    <span className="icon is-right"><MdSearch /></span>
                </div>
                
                <div className="buttons">
                    <button className={`button is-white border ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => setIsDeleteMode(!isDeleteMode)}>
                        <span className="icon"><MdDelete /></span>
                    </button>
                    <button className="button is-white border">
                        <span className="icon"><MdFilterList /></span>
                        <span>Filtrar</span>
                    </button>
                    <button className="button is-primary border-0" style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} onClick={handleOpenCreateModal}>
                        <span className="icon"><MdAdd /></span>
                        <span>Adicionar</span>
                    </button>
                </div>
            </div>
            
            {isDeleteMode && selectedItems.length > 0 && (
                <div className="notification is-danger is-light mb-4 py-2 px-4 is-flex is-justify-content-space-between is-align-items-center">
                    <span>{selectedItems.length} selecionado(s)</span>
                    <button className="button is-small is-danger" onClick={() => setIsModalOpen(true)}>Confirmar Exclusão</button>
                </div>
            )}
            
            {!loading && filteredCooperadosData.map(item => (
              <CooperadoListItem 
                key={item.id} item={item} isDeleteMode={isDeleteMode} isSelected={selectedItems.includes(item.id)} onSelectItem={handleSelectItem}
                onContactItem={handleOpenContactModal} onLocationItem={handleOpenLocationModal} onViewItem={handleOpenViewModal} onEditItem={handleOpenEditModal} onCalendarItem={handleOpenCalendarModal}
              />
            ))}
          </div>
        )}

        {/* ABA TRANSPORTADORA */}
        {activeTab === 'transportadora' && (
          <div className="container is-fluid px-0">
            <TransportadoraList />
          </div>
        )}

        {/* ABA AGENDA */}
        {activeTab === 'agenda' && (
          <div className="container is-fluid px-0">
             <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
                <div className="control has-icons-right">
                    <input className="input" type="text" placeholder="Buscar na agenda..." style={{ width: '300px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <span className="icon is-right"><MdSearch /></span>
                </div>
                <div className="buttons">
                    <button className={`button is-white border ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => setIsDeleteMode(!isDeleteMode)}>
                        <span className="icon"><MdDelete /></span>
                    </button>
                    <button className="button is-white border">
                        <span className="icon"><MdFilterList /></span>
                        <span>Filtrar</span>
                    </button>
                </div>
            </div>
            
            <div className="box p-0 shadow-none border">
               {!loading && <AgendaTable data={filteredAgendaData} isDeleteMode={isDeleteMode} selectedItems={selectedItems} onSelectItem={handleSelectItem} onConfirmDelete={handleConfirmDelete} />}
            </div>
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