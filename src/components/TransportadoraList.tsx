// src/components/TransportadoraList.tsx

import React, { useState, useEffect } from 'react';
import { MdSearch, MdAdd, MdFilterList, MdDelete } from 'react-icons/md';
import type { TransportadoraItem, VeiculoInfo } from '../types/models';
import { toast } from 'react-toastify';
import { fetchTransportadorasData } from '../services/api';
import { TransportadoraListItem } from './TransportadoraListItem';

import TransportadoraContactModal from './TransportadoraContactModal';
import TransportadoraVehiclesModal from './TransportadoraVehiclesModal';
import TransportadoraEditModal from './TransportadoraEditModal';
import TransportadoraCreateModal from './TransportadoraCreateModal';
import TransportadoraAddVehicleModal from './TransportadoraAddVehicleModal';

export const TransportadoraList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<TransportadoraItem[]>([]);
  const [loading, setLoading] = useState(false);

  // States
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Modais
  const [selectedItem, setSelectedItem] = useState<TransportadoraItem | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isVehiclesOpen, setIsVehiclesOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchTransportadorasData();
        setData(result);
      } catch (e) {
        toast.error("Erro ao carregar transportadoras");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredData = data.filter(item => 
    item.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cnpj.includes(searchTerm)
  );

  const toggleDeleteMode = () => { setIsDeleteMode(!isDeleteMode); setSelectedItems([]); };
  const handleSelectItem = (id: string) => { setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };
  const confirmDelete = () => { setData(prev => prev.filter(i => !selectedItems.includes(i.id))); toast.success("Removidos."); setIsConfirmDeleteOpen(false); setSelectedItems([]); setIsDeleteMode(false); };

  const closeModals = () => {
      if (isAddVehicleOpen) { setIsAddVehicleOpen(false); return; }
      setSelectedItem(null); setIsContactOpen(false); setIsVehiclesOpen(false); setIsEditOpen(false); setIsCreateOpen(false);
  };

  const handleContact = (item: TransportadoraItem) => { setSelectedItem(item); setIsContactOpen(true); };
  const handleVehicles = (item: TransportadoraItem) => { setSelectedItem(item); setIsVehiclesOpen(true); };
  const handleEdit = (item: TransportadoraItem) => { setSelectedItem(item); setIsEditOpen(true); };
  const handleAdd = () => setIsCreateOpen(true);

  // Logic
  const handleSaveEdit = (updated: TransportadoraItem) => { setData(prev => prev.map(i => i.id === updated.id ? updated : i)); toast.success("Atualizado!"); closeModals(); };
  const handleSaveNew = (newItem: TransportadoraItem) => { setData(prev => [newItem, ...prev]); toast.success("Cadastrado!"); closeModals(); };
  
  const handleSaveNewVehicle = (v: VeiculoInfo) => { 
      if (selectedItem) { 
          const up = { ...selectedItem, veiculos: [...(selectedItem.veiculos || []), v] }; 
          setSelectedItem(up); 
          setData(prev => prev.map(i => i.id === up.id ? up : i)); 
          toast.success("Veículo adicionado!"); 
          setIsAddVehicleOpen(false); 
      } 
  };
  
  const handleDeleteTransportadora = () => { 
      if (selectedItem) { 
          if(window.confirm("Deseja realmente remover esta transportadora?")) {
            setData(prev => prev.filter(t => t.id !== selectedItem.id)); 
            toast.success("Transportadora removida."); 
            closeModals(); 
          }
      } 
  };
  
  const handleRemoveVehicle = (idx: number) => { 
      if (selectedItem) { 
          if(window.confirm("Remover este veículo?")) {
            const vs = [...(selectedItem.veiculos || [])]; 
            vs.splice(idx, 1); 
            const up = { ...selectedItem, veiculos: vs }; 
            setSelectedItem(up); 
            setData(prev => prev.map(i => i.id === up.id ? up : i)); 
            toast.success("Veículo removido."); 
          }
      } 
  };

  return (
    <div>
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
        <div className="control has-icons-right">
            <input 
              className="input" 
              type="text" 
              placeholder="Buscar transportadora..." 
              style={{ width: '300px' }} 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
            <span className="icon is-right"><MdSearch /></span>
        </div>
        
        <div className="buttons">
            <button className={`button is-white border ${isDeleteMode ? 'is-danger' : ''}`} onClick={toggleDeleteMode}>
                <span className="icon"><MdDelete /></span>
            </button>
            <button className="button is-white border">
                <span className="icon"><MdFilterList /></span>
                <span>Filtrar</span>
            </button>
            <button className="button is-primary border-0" style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} onClick={handleAdd}>
                <span className="icon"><MdAdd /></span>
                <span>Adicionar</span>
            </button>
        </div>
      </div>

      {isDeleteMode && selectedItems.length > 0 && (
          <div className="notification is-danger is-light mb-4 py-2 px-4 is-flex is-justify-content-space-between is-align-items-center">
              <span>{selectedItems.length} selecionado(s)</span>
              <button className="button is-small is-danger" onClick={() => setIsConfirmDeleteOpen(true)}>Confirmar Exclusão</button>
          </div>
      )}

      <div className="box p-0 shadow-none border" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
          {loading ? <div className="p-4 has-text-centered">Carregando...</div> : 
            filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <TransportadoraListItem 
                        key={item.id} item={item}
                        isDeleteMode={isDeleteMode} isSelected={selectedItems.includes(item.id)} onSelectItem={handleSelectItem}
                        onContact={handleContact} onVehicles={handleVehicles} onEdit={handleEdit}
                    />
                ))
            ) : (
                <div className="p-4 has-text-centered has-text-grey">Nenhuma transportadora encontrada.</div>
            )
          }
      </div>

      <div className={`modal ${isConfirmDeleteOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsConfirmDeleteOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head"><p className="modal-card-title">Confirmar</p></header>
          <section className="modal-card-body"><p>Excluir {selectedItems.length} itens?</p></section>
          <footer className="modal-card-foot"><button className="button" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</button><button className="button is-danger" onClick={confirmDelete}>Excluir</button></footer>
        </div>
      </div>

      <TransportadoraContactModal isActive={isContactOpen} onClose={closeModals} data={selectedItem} />
      
      {/* CORREÇÃO: Passando todas as props exigidas */}
      <TransportadoraVehiclesModal 
          isActive={isVehiclesOpen} 
          onClose={closeModals} 
          data={selectedItem} 
          onAddVehicle={() => setIsAddVehicleOpen(true)} 
          onDeleteTransportadora={handleDeleteTransportadora} 
          onRemoveVehicle={handleRemoveVehicle} 
      />
      
      <TransportadoraEditModal isActive={isEditOpen} onClose={closeModals} data={selectedItem} onSave={handleSaveEdit} />
      <TransportadoraCreateModal isActive={isCreateOpen} onClose={closeModals} onCreate={handleSaveNew} />
      <TransportadoraAddVehicleModal isActive={isAddVehicleOpen} onClose={() => setIsAddVehicleOpen(false)} onSave={handleSaveNewVehicle} />
    </div>
  );
};