// src/screens/Cooperados.tsx (Modificado)

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdDelete, MdPersonAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CooperadoListItem } from '../components/CooperadoListItem';
import { fetchNewAgendaData, fetchCooperadosData, type CooperadoItem } from '../services/api';

// --- IMPORT DO NOVO MODAL ---
import CooperadoContactModal from '../components/CooperadoContactModal';

const Cooperados: React.FC = () => {
  // --- Seus estados originais ---
  const [activeTab, setActiveTab] = useState('cadastro');
  const navigate = useNavigate();
  // const [agendaData, setAgendaData] = useState<AgendaData[]>([]); // Removido - Não utilizado
  const [cooperadosData, setCooperadosData] = useState<CooperadoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de Delete
  // const [showFilters, setShowFilters] = useState(false); // Removido - Não utilizado
  // const [filterStatus, setFilterStatus] = useState<string[]>([]); // Removido - Não utilizado
  // const [filterTransportadora, setFilterTransportadora] = useState<string[]>([]); // Removido - Não utilizado

  // --- ESTADO PARA O NOVO MODAL ---
  const [isContactModalActive, setIsContactModalActive] = useState(false);
  const [selectedCooperado, setSelectedCooperado] = useState<CooperadoItem | null>(null);


  // --- Suas funções originais (loadData, useEffect, etc...) ---
  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (activeTab === 'agenda') {
        await fetchNewAgendaData();
        // setAgendaData(data || []); // Removido - Não utilizado
      } else {
        const data = await fetchCooperadosData();
        setCooperadosData(data || []);
      }
    } catch (err) {
      setError("Ocorreu um erro ao buscar os dados.");
      toast.error("Falha ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
    setSearchTerm(''); setSelectedItems([]); setIsDeleteMode(false);
  }, [activeTab, loadData]);
  
  // const filteredAgendaData = useMemo(() => (agendaData || []).filter(item => (item.cooperado.toLowerCase().includes(searchTerm.toLowerCase())) && (filterStatus.length === 0 || filterStatus.includes(item.status)) && (filterTransportadora.length === 0 || filterTransportadora.includes(item.transportadora))), [searchTerm, agendaData, filterStatus, filterTransportadora]); // Removido - Não utilizado
  const filteredCooperadosData = useMemo(() => (cooperadosData || []).filter(item => (item.motorista && item.motorista.toLowerCase().includes(searchTerm.toLowerCase())) || (item.filial && item.filial.toLowerCase().includes(searchTerm.toLowerCase()))), [searchTerm, cooperadosData]);
  
  const handleSelectItem = (id: string | number) => { setSelectedItems(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]) };
  const handleConfirmDelete = () => {
    // ... (sua função de delete)
    try {
      if (activeTab === 'agenda') {
        // setAgendaData(prev => prev.filter(item => !selectedItems.includes(item.id))); // Removido - Não utilizado
      } else {
        setCooperadosData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      }
      toast.success(`${selectedItems.length} item(ns) excluído(s) com sucesso!`);
      setSelectedItems([]); setIsModalOpen(false); setIsDeleteMode(false);
    } catch {
      toast.error("Ocorreu um erro ao excluir os itens.");
      setIsModalOpen(false);
    }
  };
  // const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => { setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]); }; // Removido - Não utilizado
  // const clearFilters = () => { setFilterStatus([]); setFilterTransportadora([]); }; // Removido - Não utilizado

  
  // --- HANDLERS PARA TODOS OS BOTÕES ---
  
  // O que você pediu:
  const handleOpenContactModal = (item: CooperadoItem) => {
    setSelectedCooperado(item);
    setIsContactModalActive(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalActive(false);
    // Limpa para garantir
    setTimeout(() => setSelectedCooperado(null), 200);
  };

  // Os "em branco" que você pediu:
  const handleOpenLocationModal = (item: CooperadoItem) => {
    toast.info(`Abrir modal LOCALIZAÇÃO para: ${item.motorista} (Não implementado)`);
  };
  const handleOpenViewModal = (item: CooperadoItem) => {
    toast.info(`Abrir modal VISUALIZAR para: ${item.motorista} (Não implementado)`);
  };
  const handleOpenEditModal = (item: CooperadoItem) => {
    toast.info(`Abrir modal EDITAR para: ${item.motorista} (Não implementado)`);
  };
  const handleOpenCalendarModal = (item: CooperadoItem) => {
    toast.info(`Abrir modal AGENDA para: ${item.motorista} (Não implementado)`);
  };


  return (
    <>
      {/* Seu Navbar original */}
      <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <div className="navbar-item pl-0">
            <div className="buttons">
              <button className="button is-medium is-white" onClick={() => navigate(-1)}>
                <span className="icon"><MdArrowBack /></span>
              </button>
              <span className="is-size-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Cooperados</span>
            </div>
          </div>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button className="button is-link">
                <span className="icon"><MdPersonAdd /></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Suas Abas originais */}
      <section className="section has-background-white-bis" style={{ paddingTop: '6rem' }}>
        <div className="tabs is-toggle is-medium is-centered is-fullwidth">
          <ul>
            <li className={activeTab === 'cadastro' ? 'is-active' : ''}><a onClick={() => setActiveTab('cadastro')}><span>Cadastro</span></a></li>
            <li className={activeTab === 'agenda' ? 'is-active' : ''}><a onClick={() => setActiveTab('agenda')}><span>Agenda</span></a></li>
          </ul>
        </div>
      </section>

      {/* Sua Aba Cadastro original */}
      {activeTab === 'cadastro' && (
        <section className="section bioPartners pt-1 pb-6">
          <div className="has-background-white-ter my-4 p-2">
            <div className="field is-grouped">
              <div className="control is-expanded"><div className="field has-addons"><div className="control is-expanded"><input className="input" type="text" placeholder="Digite nome, empresa, veículo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div className="control"><button className="button"><span className="icon"><MdSearch /></span></button></div></div></div>
              <div className="control"><button className={`button is-pill ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => { setIsDeleteMode(!isDeleteMode); setSelectedItems([]); }} title="Ativar modo de seleção"><span className="icon"><MdDelete /></span></button></div>
              <div className="control"><button className="button is-pill"><span className="icon"><MdFilterList /></span></button></div>
            </div>
          </div>
          {isDeleteMode && selectedItems.length > 0 && <div className="level is-mobile mb-4"><div className="level-left"><p>{selectedItems.length} item(s) selecionado(s)</p></div><div className="level-right"><button className="button is-danger" onClick={() => setIsModalOpen(true)}>Excluir</button></div></div>}
          {loading && <progress className="progress is-small is-info" max="100"></progress>}
          {error && <div className="notification is-danger">{error}</div>}
          
          {/* --- CONECTANDO AS PROPS NO SEU MAP --- */}
          {!loading && !error && filteredCooperadosData.map(item => (
            <CooperadoListItem 
              key={item.id} 
              item={item} 
              isDeleteMode={isDeleteMode} 
              isSelected={selectedItems.includes(item.id)} 
              onSelectItem={handleSelectItem}
              
              // Conectando os handlers
              onContactItem={handleOpenContactModal}
              onLocationItem={handleOpenLocationModal}
              onViewItem={handleOpenViewModal}
              onEditItem={handleOpenEditModal}
              onCalendarItem={handleOpenCalendarModal}
            />
          ))}
        </section>
      )}

      {/* Sua Aba Agenda original */}
      {activeTab === 'agenda' && (
        <section className="section bioCalendars pt-1 pb-6">
          {/* ... (Conteúdo da Agenda) ... */}
        </section>
      )}

      {/* Seu Modal de Delete original */}
      <div className={`modal ${isModalOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head"><p className="modal-card-title">Confirmar Exclusão</p><button className="delete" aria-label="close" onClick={() => setIsModalOpen(false)}></button></header>
          <section className="modal-card-body"><p>Você tem certeza que deseja excluir {selectedItems.length} item(ns) selecionado(s)? Esta ação não pode ser desfeita.</p></section>
          <footer className="modal-card-foot is-justify-content-flex-end"><button className="button" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="button is-danger" onClick={handleConfirmDelete}>Excluir</button></footer>
        </div>
      </div>

      {/* --- RENDERIZAÇÃO DO NOVO MODAL --- */}
      <CooperadoContactModal
        isActive={isContactModalActive}
        onClose={handleCloseContactModal}
        data={selectedCooperado}
      />
    </>
  );
};

export default Cooperados;