// src/screens/Portaria.tsx
import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdDelete, MdAdd, MdCalendarToday } from 'react-icons/md';
import { toast } from 'react-toastify';

import { type PortariaItem } from '../types/models';
import { PortariaTable } from '../components/PortariaTable';
import PortariaRegisterModal from '../components/PortariaRegisterModal';
import PortariaCheckInModal from '../components/PortariaCheckInModal';

const Portaria: React.FC = () => {
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

  const handleConfirmCheckIn = (peso: string) => {
    if (!selectedItem) return;
    setData(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { ...item, balancaEntrada: peso, status: 'Pesagem' } 
        : item
    ));
    toast.success(`Peso de ${peso}kg registrado para ${selectedItem.placa}`);
    setIsCheckInOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-5" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
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

      <div className="mb-5">
        <p className="has-text-grey">Data: de 01/01/2026</p>
      </div>

      {data.length === 0 ? (
        <div className="has-text-centered py-6">
          <div className="icon is-large has-text-grey-light mb-3">
             <MdCalendarToday size={48} />
          </div>
          <h3 className="title is-5 has-text-grey">Não há registros lançados</h3>
          <p className="subtitle is-6 has-text-grey-light mb-4">
            Você pode incluir manualmente o registro de entrada.
          </p>
          
          <button 
            className="button has-text-weight-bold mb-6 border-0" 
            style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}
            onClick={handleOpenRegister}
          >
            <span className="icon"><MdAdd /></span>
            <span>Registrar Entrada</span>
          </button>
        </div>
      ) : (
        <PortariaTable 
          data={data}
          onCheckInClick={handleOpenCheckIn}
        />
      )}

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