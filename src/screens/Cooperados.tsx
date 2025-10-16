// src/screens/Cooperados.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdDelete, MdAdd } from 'react-icons/md';
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
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'agenda') {
        const data = await fetchNewAgendaData();
        setAgendaData(data);
      } else {
        const data = await fetchCooperadosData();
        setCooperadosData(data);
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
    setSearchTerm('');
    setSelectedItems([]);
    setIsDeleteMode(false);
  }, [activeTab, loadData]);
  
  const filteredAgendaData = useMemo(() => {
    return agendaData.filter(item => {
      const searchMatch = item.cooperado.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus.length === 0 || filterStatus.includes(item.status);
      const transportadoraMatch = filterTransportadora.length === 0 || filterTransportadora.includes(item.transportadora);
      return searchMatch && statusMatch && transportadoraMatch;
    });
  }, [searchTerm, agendaData, filterStatus, filterTransportadora]);

  const filteredCooperadosData = useMemo(() => {
    return cooperadosData.filter(item =>
        item.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.filial.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, cooperadosData]);
  
  const handleSelectItem = (id: string | number) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
  };

  const handleConfirmDelete = () => {
    try {
      if (activeTab === 'agenda') {
        setAgendaData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      } else {
        setCooperadosData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      }
      toast.success(`${selectedItems.length} item(ns) excluído(s) com sucesso!`);
      
      setSelectedItems([]);
      setIsModalOpen(false);
      setIsDeleteMode(false);
    } catch {
      toast.error("Ocorreu um erro ao excluir os itens.");
      setIsModalOpen(false);
    }
  };
  
  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => { setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]); };
  const clearFilters = () => { setFilterStatus([]); setFilterTransportadora([]); };

  return (
    <>
      <nav className="level is-mobile mb-4">
        <div className="level-left">
            <div className="level-item">
                <button className="button is-white" onClick={() => navigate(-1)}>
                    <span className="icon"><MdArrowBack /></span>
                </button>
            </div>
            <div className="level-item">
                <h1 className="title is-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Cooperados</h1>
            </div>
        </div>
        <div className="level-right">
            <div className="level-item">
                <button className="button is-link">
                    <span className="icon"><MdAdd /></span>
                </button>
            </div>
        </div>
      </nav>

      <section className="section py-0">
        <div className="tabs is-toggle is-medium is-centered is-fullwidth">
          <ul>
            <li className={activeTab === 'cadastro' ? 'is-active' : ''}><a onClick={() => setActiveTab('cadastro')}><span>Cadastro</span></a></li>
            <li className={activeTab === 'agenda' ? 'is-active' : ''}><a onClick={() => setActiveTab('agenda')}><span>Agenda</span></a></li>
          </ul>
        </div>
      </section>

      {/* --- ABA DE CADASTRO --- */}
      {activeTab === 'cadastro' && (
        <section className="section pt-4 pb-6">
          <div className="has-background-white-ter p-2 mb-5">
            <div className="field is-grouped">
              <div className="control is-expanded"><div className="field has-addons"><div className="control is-expanded"><input className="input" type="text" placeholder="Digite nome, empresa, veículo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div className="control"><button className="button"><span className="icon"><MdSearch /></span></button></div></div></div>
              <div className="control"><button className={`button is-pill ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => { setIsDeleteMode(!isDeleteMode); setSelectedItems([]); }} title="Ativar modo de seleção"><span className="icon"><MdDelete /></span></button></div>
              <div className="control"><button className="button is-pill"><span className="icon"><MdFilterList /></span></button></div>
            </div>
          </div>
          {isDeleteMode && selectedItems.length > 0 && <div className="level is-mobile mb-4"><div className="level-left"><p>{selectedItems.length} item(s) selecionado(s)</p></div><div className="level-right"><button className="button is-danger" onClick={() => setIsModalOpen(true)}>Excluir Selecionados</button></div></div>}
          {loading && <progress className="progress is-small is-info" max="100"></progress>}
          {error && <div className="notification is-danger">{error}</div>}
          {!loading && !error && filteredCooperadosData.map(item => <CooperadoListItem key={item.id} item={item} isDeleteMode={isDeleteMode} isSelected={selectedItems.includes(item.id)} onSelectItem={handleSelectItem} />)}
        </section>
      )}

      {/* --- ABA DE AGENDA --- */}
      {activeTab === 'agenda' && (
        <section className="section pt-4 pb-6">
          <div className="has-background-white-ter p-2 mb-5">
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

      {/* --- MODAL DE CONFIRMAÇÃO --- */}
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