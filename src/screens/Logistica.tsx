// src/screens/Logistica.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdDelete, MdAdd, MdContentCopy, MdDateRange } from 'react-icons/md';
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
import ReplicateWeekModal from '../components/ReplicateWeekModal';
import ReplicateMonthModal from '../components/ReplicateMonthModal';

const Logistica: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cadastro');
  const navigate = useNavigate();

  const [agendaData, setAgendaData] = useState<AgendaData[]>([]);
  const [cooperadosData, setCooperadosData] = useState<CooperadoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados de Seleção
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modais de Replicação
  const [isReplicateWeekOpen, setIsReplicateWeekOpen] = useState(false);
  const [isReplicateMonthOpen, setIsReplicateMonthOpen] = useState(false);

  // Modais Gerais
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
  
  // Filtros
  const filteredCooperadosData = useMemo(() => (cooperadosData || []).filter(item => (item.motorista && item.motorista.toLowerCase().includes(searchTerm.toLowerCase()))), [searchTerm, cooperadosData]);
  
  const agendaBase = useMemo(() => (agendaData || []).filter(item => item.cooperado.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, agendaData]);
  const plannedAgenda = agendaBase.filter(item => item.status === 'Planejado');
  const realizedAgenda = agendaBase.filter(item => item.status === 'Realizado');

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

  const handleUpdateAgendaItem = (id: number, field: string, value: number) => {
      setAgendaData(prev => prev.map(item => {
          if (item.id === id) {
              const updated = { ...item, [field]: value };
              updated.qtd = (updated.seg||0) + (updated.ter||0) + (updated.qua||0) + (updated.qui||0) + (updated.sex||0) + (updated.sab||0) + (updated.dom||0);
              return updated;
          }
          return item;
      }));
  };

  const confirmReplicateWeek = (date: string) => {
      toast.success(`Planejamento replicado para a semana: ${date}`);
      setIsReplicateWeekOpen(false);
  };

  const confirmReplicateMonth = (month: string) => {
      toast.success(`Planejamento replicado para o mês: ${month}`);
      setIsReplicateMonthOpen(false);
  };

  // --- HANDLER DO BOTÃO ADICIONAR (CORRIGIDO) ---
  const handleOpenAgendaAdd = () => {
      // Cria um objeto temporário para garantir que o modal abra
      const dummyCooperado: CooperadoItem = {
          id: 'new',
          matricula: 0,
          filial: '',
          motorista: 'Selecione um Cooperado', // Texto placeholder
          tipoVeiculo: '',
          placa: '',
          certificado: 'Ativo',
          doamDejetos: 'Sim',
          fase: ''
      };
      setSelectedCooperado(dummyCooperado);
      setIsCalendarModalActive(true);
  };

  const handleSaveCalendar = () => {
      setIsCalendarModalActive(false); 
      toast.success("Agendamento realizado!"); 
  };

  const closeAllModals = () => {
    setIsContactModalActive(false); setIsLocationModalActive(false); setIsInfoModalActive(false); 
    setIsEditModalActive(false); setIsCalendarModalActive(false); setIsCreateModalActive(false); 
    setIsReplicateWeekOpen(false); setIsReplicateMonthOpen(false);
    setTimeout(() => setSelectedCooperado(null), 200);
  };

  const handleOpenContactModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsContactModalActive(true); };
  const handleOpenLocationModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsLocationModalActive(true); };
  const handleOpenViewModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsInfoModalActive(true); };
  const handleOpenEditModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsEditModalActive(true); };
  const handleOpenCalendarModal = (item: CooperadoItem) => { setSelectedCooperado(item); setIsCalendarModalActive(true); };
  const handleOpenCreateModal = () => { setIsCreateModalActive(true); };
  const handleSaveNewCooperado = (newItem: CooperadoItem) => { setCooperadosData(prev => [newItem, ...prev]); toast.success("Adicionado!"); setIsCreateModalActive(false); };
  const handleSaveCooperado = (editedItem: CooperadoItem) => { setCooperadosData(prev => prev.map(item => item.id === editedItem.id ? editedItem : item)); toast.success("Atualizado!"); setIsEditModalActive(false); setSelectedCooperado(null); };
  const handleOpenMapFromInfo = (item: CooperadoItem) => { setIsInfoModalActive(false); setTimeout(() => { setSelectedCooperado(item); setIsLocationModalActive(true); }, 100); };

  return (
    <div className="screen-container" style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem', flexShrink: 0 }}>
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

      <div className="tabs is-toggle is-fullwidth mb-0" style={{ borderBottom: '1px solid #dbdbdb', backgroundColor: '#fff', flexShrink: 0 }}>
        <ul>
          <li className={activeTab === 'cadastro' ? 'is-active' : ''}><a onClick={() => setActiveTab('cadastro')}><span>Cooperados</span></a></li>
          <li className={activeTab === 'transportadora' ? 'is-active' : ''}><a onClick={() => setActiveTab('transportadora')}><span>Transportadoras</span></a></li>
          <li className={activeTab === 'agenda' ? 'is-active' : ''}><a onClick={() => setActiveTab('agenda')}><span>Agenda</span></a></li>
        </ul>
      </div>

      <div className="screen-content p-5" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        
        {activeTab === 'cadastro' && (
          <div className="container is-fluid px-0">
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
                <div className="control has-icons-right">
                    <input className="input" type="text" placeholder="Buscar cooperado..." style={{ width: '300px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <span className="icon is-right"><MdSearch /></span>
                </div>
                <div className="buttons">
                    <button className={`button is-white border ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => setIsDeleteMode(!isDeleteMode)}><span className="icon"><MdDelete /></span></button>
                    <button className="button is-white border"><span className="icon"><MdFilterList /></span><span>Filtrar</span></button>
                    <button className="button is-primary border-0" style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} onClick={handleOpenCreateModal}><span className="icon"><MdAdd /></span><span>Adicionar</span></button>
                </div>
            </div>
            
            {isDeleteMode && selectedItems.length > 0 && <div className="notification is-danger is-light mb-4"><button className="button is-small is-danger" onClick={() => setIsModalOpen(true)}>Excluir Selecionados</button></div>}
            
            {!loading && filteredCooperadosData.map(item => (
              <CooperadoListItem 
                key={item.id} item={item} isDeleteMode={isDeleteMode} isSelected={selectedItems.includes(item.id)} onSelectItem={handleSelectItem}
                onContactItem={handleOpenContactModal} onLocationItem={handleOpenLocationModal} onViewItem={handleOpenViewModal} onEditItem={handleOpenEditModal} onCalendarItem={handleOpenCalendarModal}
              />
            ))}
          </div>
        )}

        {activeTab === 'transportadora' && <div className="container is-fluid px-0"><TransportadoraList /></div>}

        {activeTab === 'agenda' && (
          <div className="container is-fluid px-0">
             
             <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
                <div className="control has-icons-right">
                    <input className="input" type="text" placeholder="Buscar na agenda..." style={{ width: '300px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <span className="icon is-right"><MdSearch /></span>
                </div>
                
                <div className="buttons">
                    <button className="button is-white border" onClick={() => setIsReplicateWeekOpen(true)} title="Replicar semana">
                        <span className="icon has-text-info"><MdContentCopy /></span><span>Semana</span>
                    </button>
                    <button className="button is-white border" onClick={() => setIsReplicateMonthOpen(true)} title="Replicar mês">
                        <span className="icon has-text-success"><MdDateRange /></span><span>Mês</span>
                    </button>

                    <button className={`button is-white border ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => setIsDeleteMode(!isDeleteMode)}>
                        <span className="icon"><MdDelete /></span>
                    </button>
                    
                    <button className="button is-primary border-0" style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} onClick={handleOpenAgendaAdd}>
                        <span className="icon"><MdAdd /></span><span>Adicionar</span>
                    </button>
                </div>
            </div>
            
            <div className="mb-6">
                <p className="is-size-6 mb-2 has-text-grey">Planejado no período: de <strong>13/10/2025</strong> à <strong>17/10/2025</strong></p>
                <div className="box p-0 shadow-none border" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                   {!loading && (
                       <AgendaTable 
                           data={plannedAgenda} 
                           isDeleteMode={isDeleteMode} 
                           selectedItems={selectedItems} 
                           onSelectItem={handleSelectItem} 
                           onConfirmDelete={handleConfirmDelete} 
                           onUpdateItem={handleUpdateAgendaItem} 
                           showActions={false}
                       />
                   )}
                </div>
            </div>

            <div className="mb-6">
                <p className="is-size-6 mb-2 has-text-grey">Realizado no período: de <strong>13/10/2025</strong> à <strong>17/10/2025</strong></p>
                <div className="box p-0 shadow-none border" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                   {!loading && (
                       <AgendaTable 
                           data={realizedAgenda} 
                           isDeleteMode={isDeleteMode} 
                           selectedItems={selectedItems} 
                           onSelectItem={handleSelectItem} 
                           onConfirmDelete={handleConfirmDelete}
                           readOnly={true}
                           showActions={false}
                       />
                   )}
                </div>
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

      {/* Modais Globais */}
      <CooperadoContactModal isActive={isContactModalActive} onClose={closeAllModals} data={selectedCooperado} />
      <CooperadoLocationModal isActive={isLocationModalActive} onClose={closeAllModals} data={selectedCooperado} />
      <CooperadoInfoModal isActive={isInfoModalActive} onClose={closeAllModals} data={selectedCooperado} onOpenMap={handleOpenMapFromInfo} />
      <CooperadoEditModal isActive={isEditModalActive} onClose={closeAllModals} data={selectedCooperado} onSave={handleSaveCooperado} />
      
      {/* Modal de Calendário (RENDERIZADO) */}
      <CooperadoCalendarModal 
        isActive={isCalendarModalActive} 
        onClose={closeAllModals} 
        onSave={handleSaveCalendar} 
        data={selectedCooperado} 
        title={selectedCooperado?.id === 'new' ? "Novo Agendamento Geral" : undefined}
      />
      
      <CooperadoCreateModal isActive={isCreateModalActive} onClose={closeAllModals} onSave={handleSaveNewCooperado} />

      {/* Novos Modais de Replicação */}
      <ReplicateWeekModal isActive={isReplicateWeekOpen} onClose={() => setIsReplicateWeekOpen(false)} onConfirm={confirmReplicateWeek} />
      <ReplicateMonthModal isActive={isReplicateMonthOpen} onClose={() => setIsReplicateMonthOpen(false)} onConfirm={confirmReplicateMonth} />
    </div>
  );
};

export default Logistica;