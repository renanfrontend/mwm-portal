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

  // Estados para o filtro
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
      const errorMessage = "Ocorreu um erro ao buscar os dados.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
    setSearchTerm(''); setSelectedItems([]); setIsDeleteMode(false);
  }, [activeTab, loadData]);

  const filteredAgendaData = useMemo(() => (agendaData || []).filter(item => (item.cooperado.toLowerCase().includes(searchTerm.toLowerCase())) && (filterStatus.length === 0 || filterStatus.includes(item.status)) && (filterTransportadora.length === 0 || filterTransportadora.includes(item.transportadora))), [searchTerm, agendaData, filterStatus, filterTransportadora]);
  const filteredCooperadosData = useMemo(() => (cooperadosData || []).filter(item => item.motorista.toLowerCase().includes(searchTerm.toLowerCase()) || item.filial.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, cooperadosData]);

  const handleSelectItem = (id: string | number) => setSelectedItems(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);

  const handleConfirmDelete = () => {
    console.log("Deletando itens:", selectedItems);
    toast.success(`${selectedItems.length} item(s) deletado(s) com sucesso!`);
    setIsModalOpen(false);
    loadData();
  };

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => { setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]); };
  const clearFilters = () => { setFilterStatus([]); setFilterTransportadora([]); setShowFilters(false); };

  const transportadorasUnicas = useMemo(() => [...new Set(agendaData.map(item => item.transportadora))], [agendaData]);
  const areFiltersActive = filterStatus.length > 0 || filterTransportadora.length > 0;

  // Componente reutilizável para a barra de ferramentas
  const Toolbar = () => (
    <div className="my-4 p-2 has-background-white-ter">
        <div className="is-flex is-align-items-center">
            <div className="field has-addons" style={{ flexGrow: 1, minWidth: '150px' }}>
                <div className="control is-expanded">
                    <input
                        className="input" type="text" placeholder="Digite para buscar..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="control">
                    <button className="button is-info"><span className="icon"><MdSearch /></span></button>
                </div>
            </div>
            <div className="is-flex ml-2">
                <button
                    className={`button is-pill mr-1 ${isDeleteMode ? 'is-danger' : ''}`}
                    onClick={() => { setIsDeleteMode(!isDeleteMode); setSelectedItems([]); }}
                    title="Ativar modo de seleção">
                    <span className="icon"><MdDelete /></span>
                </button>
                <div className={`dropdown is-right ${showFilters ? 'is-active' : ''}`}>
                    <div className="dropdown-trigger">
                        <button 
                            className={`button is-pill ${areFiltersActive ? 'is-info' : ''}`} 
                            onClick={() => setShowFilters(!showFilters)} 
                            aria-haspopup="true" 
                            aria-controls="dropdown-menu-filter">
                            <span className="icon"><MdFilterList /></span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu-filter" role="menu">
                        <div className="dropdown-content">
                            {activeTab === 'agenda' ? (
                                <div className="p-4" style={{ minWidth: '300px' }}>
                                    <p className="subtitle is-6">Status</p>
                                    <div className="field">
                                        <label className="checkbox mr-4">
                                            <input type="checkbox" checked={filterStatus.includes('Realizado')} onChange={() => handleCheckboxChange(setFilterStatus, 'Realizado')} /> Realizado
                                        </label>
                                        <label className="checkbox">
                                            <input type="checkbox" checked={filterStatus.includes('Planejado')} onChange={() => handleCheckboxChange(setFilterStatus, 'Planejado')} /> Planejado
                                        </label>
                                    </div>
                                    <hr className="dropdown-divider" />
                                    <p className="subtitle is-6">Transportadora</p>
                                    {transportadorasUnicas.map(t => (
                                      <div key={t} className="field">
                                        <label className="checkbox">
                                          <input type="checkbox" checked={filterTransportadora.includes(t)} onChange={() => handleCheckboxChange(setFilterTransportadora, t)}/> {t}
                                        </label>
                                      </div>
                                    ))}
                                    {areFiltersActive && (
                                        <>
                                            <hr className="dropdown-divider" />
                                            <button className="button is-small is-danger is-light is-fullwidth" onClick={clearFilters}>Limpar Filtros</button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="dropdown-item">
                                    <p>Filtros não disponíveis nesta aba.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <>
      <nav className="level is-mobile mb-4">
        <div className="level-left">
          <div className="level-item"><div className="buttons"><button className="button is-white" onClick={() => navigate(-1)}><span className="icon"><MdArrowBack /></span></button><h1 className="title is-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Cooperados</h1></div></div>
        </div>
        <div className="level-right"><div className="level-item"><button className="button is-link"><span className="icon"><MdAdd /></span></button></div></div>
      </nav>

      <section className="section has-background-white-bis py-4">
        <div className="tabs is-toggle is-medium is-centered is-fullwidth">
          <ul>
            <li className={activeTab === 'cadastro' ? 'is-active' : ''}><a onClick={() => setActiveTab('cadastro')}><span>Cadastro</span></a></li>
            <li className={activeTab === 'agenda' ? 'is-active' : ''}><a onClick={() => setActiveTab('agenda')}><span>Agenda</span></a></li>
          </ul>
        </div>
      </section>

      <section className="section pt-1 pb-6">
        <Toolbar />
        {isDeleteMode && selectedItems.length > 0 && <div className="level is-mobile mb-4"><div className="level-left"><p>{selectedItems.length} item(s) selecionado(s)</p></div><div className="level-right"><button className="button is-danger" onClick={() => setIsModalOpen(true)}>Excluir Selecionados</button></div></div>}

        {loading && <progress className="progress is-small is-info" max="100"></progress>}
        {error && <div className="notification is-danger">{error}</div>}

        {activeTab === 'cadastro' && !loading && !error && filteredCooperadosData.map(item => <CooperadoListItem key={item.id} item={item} isDeleteMode={isDeleteMode} isSelected={selectedItems.includes(item.id)} onSelectItem={handleSelectItem} />)}
        
        {activeTab === 'agenda' && !loading && !error && (
            <>
                <label className="label">Período: de 13/10/2025 à 17/10/2025</label>
                <div className="box p-0">
                    <AgendaTable data={filteredAgendaData} isDeleteMode={isDeleteMode} selectedItems={selectedItems} onSelectItem={handleSelectItem} />
                </div>
            </>
        )}
      </section>

      <div className={`modal ${isModalOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head"><p className="modal-card-title">Confirmar Exclusão</p><button className="delete" aria-label="close" onClick={() => setIsModalOpen(false)}></button></header>
          <section className="modal-card-body"><p>Você tem certeza que deseja excluir <strong>{selectedItems.length} item(s)</strong>? Esta ação não pode ser desfeita.</p></section>
          <footer className="modal-card-foot"><button className="button is-danger" onClick={handleConfirmDelete}>Excluir</button><button className="button" onClick={() => setIsModalOpen(false)}>Cancelar</button></footer>
        </div>
      </div>
    </>
  );
};

export default Cooperados;