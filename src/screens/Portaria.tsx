// src/screens/Portaria.tsx

import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdDelete, MdAdd, MdCalendarToday, MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { type PortariaItem } from '../types/models';
import { PortariaTable } from '../components/PortariaTable';
import PortariaRegisterModal from '../components/PortariaRegisterModal';
import PortariaCheckInModal from '../components/PortariaCheckInModal';

const Portaria: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação
  const [data, setData] = useState<PortariaItem[]>([]);
  
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortariaItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenRegister = () => setIsRegisterOpen(true);

  const handleSaveRegister = (newItem: PortariaItem) => {
    setData(prev => [...prev, newItem]);
    toast.success("Registro de entrada criado com sucesso!");
  };

  const handleOpenCheckIn = (item: PortariaItem) => {
    setSelectedItem(item);
    setIsCheckInOpen(true);
  };

  const handleConfirmCheckIn = (entrada: string, saida: string) => {
    if (!selectedItem) return;

    const novoStatus = (entrada && saida) ? 'Concluído' : 'Pesagem';

    setData(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { 
            ...item, 
            balancaEntrada: entrada, 
            balancaSaida: saida, 
            status: novoStatus 
          } 
        : item
    ));

    toast.success(`Pesagem registrada para ${selectedItem.placa}`);
    setIsCheckInOpen(false);
    setSelectedItem(null);
  };

  return (
    // Container Principal ajustado para Flex Column (Padrão das outras telas)
    <div className="screen-container" style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* CABEÇALHO PADRÃO */}
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem', flexShrink: 0 }}>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="buttons">
              <button className="button is-white border mr-2" onClick={() => navigate(-1)}>
                <span className="icon"><MdArrowBack size={24} /></span>
              </button>
              <span className="title is-4 mb-0" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Portaria</span>
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO COM SCROLL */}
      <div className="screen-content p-5" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        
        {/* Barra de Ferramentas (Search, Filter, Add) */}
        <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
          <div className="field has-addons mb-0">
            <div className="control has-icons-right">
              <input 
                className="input" 
                type="text" 
                placeholder="Digite nome, empresa, veiculo..." 
                style={{ width: '300px' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <span className="icon is-right"><MdSearch /></span>
            </div>
          </div>

          <div className="buttons">
            <button className="button is-white border"><MdDelete /></button>
            <button className="button is-white border">
              <span className="icon"><MdFilterList /></span>
              <span>Filtrar</span>
            </button>
            <button 
              className="button is-primary border-0" 
              style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} 
              onClick={handleOpenRegister}
            >
              <span className="icon"><MdAdd /></span>
              <span>Adicionar</span>
            </button>
          </div>
        </div>

        {/* Data ou Filtros */}
        <div className="mb-5">
          <p className="has-text-grey">Data: de 01/01/2026</p>
        </div>

        {/* Lista ou Estado Vazio */}
        {data.length === 0 ? (
          <div className="has-text-centered py-6">
            <div className="icon is-large has-text-grey-light mb-3">
               <MdCalendarToday size={48} />
            </div>
            <h3 className="title is-5 has-text-grey">Não há registros lançados</h3>
            <p className="subtitle is-6 has-text-grey-light mb-4">
              Você pode incluir manualmente o registro de entrada.
            </p>
          </div>
        ) : (
          <PortariaTable 
            data={data}
            onCheckInClick={handleOpenCheckIn}
          />
        )}
      </div>

      {/* Modais */}
      <PortariaRegisterModal 
        isActive={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSave={handleSaveRegister}
      />

      <PortariaCheckInModal 
        isActive={isCheckInOpen}
        data={selectedItem}
        onClose={() => setIsCheckInOpen(false)}
        onConfirm={handleConfirmCheckIn}
      />
    </div>
  );
};

export default Portaria;