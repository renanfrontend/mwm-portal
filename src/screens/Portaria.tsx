// src/screens/Portaria.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdAdd, MdCalendarViewMonth, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PortariaListItem } from '../components/PortariaListItem'; // Mantido o item original
import { fetchPortariaData, type PortariaItem } from '../services/api'; 
import PortariaCheckInModal from '../components/PortariaCheckInModal';
import PortariaEditModal from '../components/PortariaEditModal';

type Tab = 'Entregas' | 'Abastecimentos' | 'Coletas' | 'Visitas';

const Portaria: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Entregas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState<PortariaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortariaItem | null>(null);
  const [modalCheckInOpen, setModalCheckInOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchPortariaData();
        setData(result || []);
      } catch (error) { toast.error("Falha ao carregar os dados."); } finally { setLoading(false); }
    };
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return (data || []).filter(item => item.categoria === activeTab && (item.motorista.toLowerCase().includes(searchTerm.toLowerCase()) || item.empresa.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [data, activeTab, searchTerm]);

  // Handlers Originais
  const handleOpenCheckIn = (item: PortariaItem) => { setSelectedItem(item); setModalCheckInOpen(true); };
  const handleCloseCheckIn = () => { setSelectedItem(null); setModalCheckInOpen(false); };
  const handleModalStepChange = (newStatus: any, stepData: any) => {
    if (!selectedItem) return;
    toast.info(`Status atualizado: ${newStatus}`);
    setData(current => current.map(i => i.id === selectedItem.id ? { ...i, status: newStatus, ...stepData } : i));
  };
  const handleConfirmCheckIn = (checkInData: any) => {
    if (!selectedItem) return;
    toast.success(`Check-in finalizado!`);
    setData(current => current.map(i => i.id === selectedItem.id ? { ...i, status: 'Concluído', ...checkInData } : i));
    handleCloseCheckIn();
  };
  const handleOpenEdit = (item: PortariaItem) => { setSelectedItem(item); setModalEditOpen(true); };
  const handleCloseEdit = () => { setSelectedItem(null); setModalEditOpen(false); };
  const handleSaveEdit = (editedItem: PortariaItem) => {
    toast.success(`Atualizado!`);
    setData(current => current.map(i => i.id === selectedItem?.id ? editedItem : i));
    handleCloseEdit();
  };
  
  const emptyStateMessages = {
    Entregas: { title: "Não há entregas", subtitle: "Adicione uma nova entrega.", buttonClass: 'is-info' },
    Abastecimentos: { title: "Não há abastecimentos", subtitle: "Adicione um abastecimento.", buttonClass: 'is-link' },
    Coletas: { title: "Não há coletas", subtitle: "Contate a supervisão.", buttonClass: 'is-warning' },
    Visitas: { title: "Não há visitas", subtitle: "Registre na portaria.", buttonClass: 'is-warning' },
  };

  return (
    <div className="screen-container p-2">
      
      {/* Toolbar (Sem is-fixed-top) */}
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem' }}>
        <div className="level is-mobile">
          <div className="level-left">
            <button className="button is-white mr-2" onClick={() => navigate(-1)}><span className="icon"><MdArrowBack size={24} /></span></button>
            <span className="title is-4 mb-0">Portaria</span>
          </div>
          <div className="level-right">
            <button className="button is-link"><span className="icon"><MdAdd /></span></button>
          </div>
        </div>
      </div>

      <div className="tabs is-toggle is-fullwidth mb-0" style={{ borderBottom: '1px solid #dbdbdb', backgroundColor: '#fff' }}>
        <ul>
          <li className={activeTab === 'Entregas' ? 'is-active' : ''}><a onClick={() => setActiveTab('Entregas')}><span>Entregas</span></a></li>
          <li className={activeTab === 'Abastecimentos' ? 'is-active' : ''}><a onClick={() => setActiveTab('Abastecimentos')}><span>Abastecimentos</span></a></li>
          <li className={activeTab === 'Coletas' ? 'is-active' : ''}><a onClick={() => setActiveTab('Coletas')}><span>Coletas</span></a></li>
          <li className={activeTab === 'Visitas' ? 'is-active' : ''}><a onClick={() => setActiveTab('Visitas')}><span>Visitas</span></a></li>
        </ul>
      </div>

      <div className="screen-content">
        <div className="container is-fluid px-0">
          <div className="box mb-4">
            <div className="field is-grouped">
              <div className="control is-expanded"><div className="field has-addons"><div className="control is-expanded has-icons-left"><input className="input" type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /><span className="icon is-small is-left"><MdSearch /></span></div><div className="control"><button className="button is-light">Buscar</button></div></div></div>
              <div className="control"><button className="button is-pill"><span className="icon"><MdDelete /></span></button></div>
              <div className="control"><button className="button is-pill" onClick={() => setShowFilters(!showFilters)}><span className="icon"><MdFilterList /></span></button></div>
            </div>
          </div>

          <label className="label">Período: de 15/10/2025 à 17/10/2025</label>
          
          {loading ? <div className="box p-4"><progress className="progress is-small is-info" max="100"></progress></div> : 
           filteredData.length > 0 ? filteredData.map(item => <PortariaListItem key={item.id} item={item} onCheckInClick={() => handleOpenCheckIn(item)} onEditClick={() => handleOpenEdit(item)} />) : 
           <div className="columns is-centered"><div className="column is-half has-text-centered mt-6"><span className="icon is-large has-text-grey-light"><MdCalendarViewMonth size="3em"/></span><p className="subtitle">{emptyStateMessages[activeTab].title}</p><p>{emptyStateMessages[activeTab].subtitle}</p><br/><button className={`button is-medium is-light ${emptyStateMessages[activeTab].buttonClass}`}><span className="icon"><MdAdd /></span><span>{activeTab.slice(0, -1)}</span></button></div></div>
          }
        </div>
      </div>

      <PortariaCheckInModal isActive={modalCheckInOpen} onClose={handleCloseCheckIn} onConfirm={handleConfirmCheckIn} onStepChange={handleModalStepChange} data={selectedItem} />
      <PortariaEditModal isActive={modalEditOpen} onClose={handleCloseEdit} onSave={handleSaveEdit} data={selectedItem} />
    </div>
  );
};

export default Portaria;