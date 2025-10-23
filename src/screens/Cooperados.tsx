// src/screens/Cooperados.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdDelete, MdAdd, MdPersonAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AgendaTable } from '../components/AgendaTable';
import { CooperadoListItem } from '../components/CooperadoListItem';
import { fetchNewAgendaData, type AgendaData, fetchCooperadosData, type CooperadoItem } from '../services/api';

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
      toast.success(`${selectedItems.length} item(ns) excluído(s) com sucesso!`);
      setSelectedItems([]); setIsModalOpen(false); setIsDeleteMode(false);
    } catch {
      toast.error("Ocorreu um erro ao excluir os itens.");
      setIsModalOpen(false);
    }
  };
  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => { setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]); };
  const clearFilters = () => { setFilterStatus([]); setFilterTransportadora([]); };

  return (
    <>
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

      {/* --- SEÇÃO DAS ABAS COM FUNDO CORRETO --- */}
      <section className="section has-background-white-bis" style={{ paddingTop: '6rem' }}>
        <div className="tabs is-toggle is-medium is-centered is-fullwidth">
          <ul>
            <li className={activeTab === 'cadastro' ? 'is-active' : ''}><a onClick={() => setActiveTab('cadastro')}><span>Cadastro</span></a></li>
            <li className={activeTab === 'agenda' ? 'is-active' : ''}><a onClick={() => setActiveTab('agenda')}><span>Agenda</span></a></li>
          </ul>
        </div>
      </section>

      {/* --- SEÇÃO PRINCIPAL (FUNDO BRANCO PADRÃO) --- */}
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
          {!loading && !error && filteredCooperadosData.map(item => <CooperadoListItem key={item.id} item={item} isDeleteMode={isDeleteMode} isSelected={selectedItems.includes(item.id)} onSelectItem={handleSelectItem} />)}
        </section>
      )}

      {activeTab === 'agenda' && (
        <section className="section bioCalendars pt-1 pb-6">
          <div className="has-background-white-ter my-4 p-2">
            <div className="field is-grouped">
                <div className="control is-expanded"><div className="field has-addons"><div className="control is-expanded"><input className="input" type="text" placeholder="Digite nome do cooperado..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div className="control"><button className="button"><span className="icon"><MdSearch /></span></button></div></div></div>
                <div className="control"><button className={`button is-pill ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => { setIsDeleteMode(!isDeleteMode); setSelectedItems([]); }} title="Ativar modo de seleção"><span className="icon"><MdDelete /></span></button></div>
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
          <label className="label">Período: de 13/10/2025 à 17/10/2025</label>
          <div className="box p-0">
            {loading && <progress className="progress is-small is-info" max="100"></progress>}
            {error && <div className="notification is-danger">{error}</div>}
            {!loading && !error && <AgendaTable data={filteredAgendaData} isDeleteMode={isDeleteMode} selectedItems={selectedItems} onSelectItem={handleSelectItem} onConfirmDelete={() => setIsModalOpen(true)} />}
          </div>
        </section>
      )}

      <div className={`modal ${isModalOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head"><p className="modal-card-title">Confirmar Exclusão</p><button className="delete" aria-label="close" onClick={() => setIsModalOpen(false)}></button></header>
          <section className="modal-card-body"><p>Você tem certeza que deseja excluir {selectedItems.length} item(ns) selecionado(s)? Esta ação não pode ser desfeita.</p></section>
          <footer className="modal-card-foot is-justify-content-flex-end"><button className="button" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="button is-danger" onClick={handleConfirmDelete}>Excluir</button></footer>
        </div>
      </div>
    </>
  );
};

export default Cooperados;