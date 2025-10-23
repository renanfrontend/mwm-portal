// src/screens/Portaria.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdAdd, MdCalendarViewMonth, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PortariaListItem } from '../components/PortariaListItem';
import { fetchPortariaData, type PortariaItem } from '../services/api';

type Tab = 'Entregas' | 'Abastecimentos' | 'Coletas' | 'Visitas';

const Portaria: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Entregas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  const [data, setData] = useState<PortariaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchPortariaData();
        setData(result || []);
      } catch (error) {
        toast.error("Falha ao carregar os dados da portaria.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return (data || []).filter(item => 
      item.categoria === activeTab &&
      (item.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.empresa.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, activeTab, searchTerm]);

  const emptyStateMessages = {
    Entregas: { title: "Não há entregas agendadas", subtitle: "Verifique com a supervisão antes de adicionar uma nova entrega.", buttonClass: 'is-info' },
    Abastecimentos: { title: "Não há abastecimentos agendados", subtitle: "Caso o veículo esteja dentro da Bio Planta, você pode incluir manualmente a solicitação.", buttonClass: 'is-link' },
    Coletas: { title: "Não há coletas agendadas", subtitle: "Caso uma empresa esteja tentando coletar materiais, entre em contato com a supervisão.", buttonClass: 'is-warning' },
    Visitas: { title: "Não há visitas agendadas", subtitle: "Caso algum visitante esteja tentando entrar, informe a supervisão antes de inserir.", buttonClass: 'is-warning' },
  };

  return (
    <>
      <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <div className="navbar-item pl-0">
            <div className="buttons">
              <button className="button is-medium is-white" onClick={() => navigate(-1)}>
                <span className="icon"><MdArrowBack /></span>
              </button>
              <span className="is-size-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Portaria</span>
            </div>
          </div>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button className="button is-link">
                <span className="icon"><MdAdd /></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="section has-background-white-bis" style={{ paddingTop: '6rem' }}>
        <div className="tabs is-toggle is-medium is-centered is-fullwidth">
          <ul>
            <li className={activeTab === 'Entregas' ? 'is-active' : ''}><a onClick={() => setActiveTab('Entregas')}><span>Entregas</span></a></li>
            <li className={activeTab === 'Abastecimentos' ? 'is-active' : ''}><a onClick={() => setActiveTab('Abastecimentos')}><span>Abastecimentos</span></a></li>
            <li className={activeTab === 'Coletas' ? 'is-active' : ''}><a onClick={() => setActiveTab('Coletas')}><span>Coletas</span></a></li>
            <li className={activeTab === 'Visitas' ? 'is-active' : ''}><a onClick={() => setActiveTab('Visitas')}><span>Visitas</span></a></li>
          </ul>
        </div>
      </section>

      <section className="section pt-1 pb-6">
        <div className="has-background-white-ter my-4 p-2">
          <div className="field is-grouped">
            <div className="control is-expanded"><div className="field has-addons"><div className="control is-expanded"><input className="input" type="text" placeholder="Digite nome, empresa..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div className="control"><button className="button"><span className="icon"><MdSearch /></span></button></div></div></div>
            <div className="control"><button className="button is-pill"><span className="icon"><MdDelete /></span></button></div>
            <div className="control">
              <div className={`dropdown is-right ${showFilters ? 'is-active' : ''}`}>
                <div className="dropdown-trigger"><button className="button is-pill" onClick={() => setShowFilters(!showFilters)}><span className="icon"><MdFilterList /></span></button></div>
                <div className="dropdown-menu" role="menu" style={{width: '280px'}}><div className="dropdown-content"></div></div>
              </div>
            </div>
          </div>
        </div>

        <label className="label">Período: de 15/10/2025 à 17/10/2025</label>
        
        {loading ? (
          <div className="box p-4"><progress className="progress is-small is-info" max="100"></progress></div>
        ) : filteredData.length > 0 ? (
          // Renderiza a lista de itens
          filteredData.map(item => <PortariaListItem key={item.id} item={item} />)
        ) : (
          // Renderiza o estado de "vazio"
          <div className="columns is-centered">
            <div className="column is-half has-text-centered mt-6">
              <span className="icon is-large has-text-grey-light">
                <MdCalendarViewMonth size="3em"/>
              </span>
              <p className="subtitle has-text-weight-medium">{emptyStateMessages[activeTab].title}</p>
              <p>{emptyStateMessages[activeTab].subtitle}</p>
              <br/>
              <button className={`button is-medium is-light ${emptyStateMessages[activeTab].buttonClass}`}>
                <span className="icon"><MdAdd /></span>
                <span>{activeTab.slice(0, -1)}</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Portaria;