// src/components/TransportadoraList.tsx

import React, { useState, useEffect } from 'react';
import { MdSearch, MdAdd, MdFilterList, MdDelete } from 'react-icons/md';
import type { TransportadoraItem, VeiculoInfo } from '../types/models';
import { toast } from 'react-toastify';
import { fetchTransportadorasData } from '../services/api';
import { TransportadoraListItem } from './TransportadoraListItem';

// Modais
import TransportadoraContactModal from './TransportadoraContactModal';
import TransportadoraVehiclesModal from './TransportadoraVehiclesModal';
import TransportadoraEditModal from './TransportadoraEditModal';
import TransportadoraCreateModal from './TransportadoraCreateModal';
import TransportadoraAddVehicleModal from './TransportadoraAddVehicleModal';

export const TransportadoraList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<TransportadoraItem[]>([]);
  const [loading, setLoading] = useState(false);

  // States de Seleção/Exclusão
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // States Modais
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

  // --- LÓGICA DE EXCLUSÃO MÚLTIPLA ---
  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedItems([]);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleOpenDeleteModal = () => {
      if (selectedItems.length === 0) return;
      setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
      setData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      toast.success(`${selectedItems.length} transportadora(s) removida(s) com sucesso.`);
      setIsConfirmDeleteOpen(false);
      setSelectedItems([]);
      setIsDeleteMode(false);
  };

  // --- Handlers Modais ---
  const closeModals = () => {
      if (isAddVehicleOpen) { setIsAddVehicleOpen(false); return; }
      setSelectedItem(null);
      setIsContactOpen(false); setIsVehiclesOpen(false); setIsEditOpen(false); setIsCreateOpen(false);
  };

  const handleContact = (item: TransportadoraItem) => { setSelectedItem(item); setIsContactOpen(true); };
  const handleVehicles = (item: TransportadoraItem) => { setSelectedItem(item); setIsVehiclesOpen(true); };
  const handleEdit = (item: TransportadoraItem) => { setSelectedItem(item); setIsEditOpen(true); };
  const handleAdd = () => setIsCreateOpen(true);

  // --- Ações de Dados ---
  const handleSaveEdit = (updated: TransportadoraItem) => {
      setData(prev => prev.map(i => i.id === updated.id ? updated : i));
      toast.success("Transportadora atualizada!");
      closeModals();
  };

  const handleSaveNew = (newItem: TransportadoraItem) => {
      setData(prev => [newItem, ...prev]);
      toast.success("Transportadora cadastrada!");
      closeModals();
  };

  // Veículos (Lógica do Modal)
  const handleDeleteTransportadoraFromModal = () => {
      if (selectedItem && window.confirm("Excluir esta transportadora?")) {
          setData(prev => prev.filter(t => t.id !== selectedItem.id));
          toast.success("Transportadora removida.");
          closeModals();
      }
  };
  const handleOpenAddVehicle = () => setIsAddVehicleOpen(true);
  const handleSaveNewVehicle = (vehicle: VeiculoInfo) => {
      if (selectedItem) {
          const updated = { ...selectedItem, veiculos: [...(selectedItem.veiculos || []), vehicle] };
          setSelectedItem(updated);
          setData(prev => prev.map(i => i.id === updated.id ? updated : i));
          toast.success("Veículo adicionado!");
          setIsAddVehicleOpen(false);
      }
  };
  const handleRemoveVehicle = (index: number) => {
      if (selectedItem && window.confirm("Remover veículo?")) {
          const updatedVs = [...(selectedItem.veiculos || [])];
          updatedVs.splice(index, 1);
          const updated = { ...selectedItem, veiculos: updatedVs };
          setSelectedItem(updated);
          setData(prev => prev.map(i => i.id === updated.id ? updated : i));
          toast.success("Veículo removido.");
      }
  };

  return (
    <div>
      {/* TOOLBAR */}
      <div className="box mb-4" style={{ border: '1px solid #f0f0f0', boxShadow: 'none' }}>
        <div className="field is-grouped">
            <div className="control is-expanded has-icons-left">
                <input className="input" type="text" placeholder="Buscar transportadora..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <span className="icon is-small is-left"><MdSearch /></span>
            </div>
            
            {/* Botão Lixeira (Substitui Buscar) */}
            <div className="control">
                <button 
                    className={`button ${isDeleteMode ? 'is-danger' : 'is-white'}`} 
                    onClick={toggleDeleteMode} 
                    title={isDeleteMode ? "Cancelar exclusão" : "Excluir itens"}
                >
                    <span className="icon"><MdDelete /></span>
                </button>
            </div>

            <div className="control"><button className="button is-pill"><span className="icon"><MdFilterList /></span></button></div>
            <div className="control"><button className="button is-link" onClick={handleAdd}><span className="icon"><MdAdd /></span><span>Adicionar</span></button></div>
        </div>
      </div>

      {/* BARRA DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {isDeleteMode && selectedItems.length > 0 && (
          <div className="notification is-danger is-light mb-4 py-2 px-4 is-flex is-justify-content-space-between is-align-items-center">
              <span className="has-text-weight-bold">{selectedItems.length} transportadora(s) selecionada(s)</span>
              <button className="button is-small is-danger" onClick={handleOpenDeleteModal}>
                  Excluir Selecionados
              </button>
          </div>
      )}

      {/* LISTA */}
      <div className="box p-0" style={{ border: '1px solid #dbdbdb', boxShadow: 'none' }}>
          {loading ? <div className="p-4 has-text-centered">Carregando...</div> : 
            filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <TransportadoraListItem 
                        key={item.id} item={item}
                        isDeleteMode={isDeleteMode}
                        isSelected={selectedItems.includes(item.id)}
                        onSelectItem={handleSelectItem}
                        onContact={handleContact} 
                        onVehicles={handleVehicles}
                        onEdit={handleEdit}
                    />
                ))
            ) : (
                <div className="p-4 has-text-centered has-text-grey">Nenhuma transportadora encontrada.</div>
            )
          }
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <div className={`modal ${isConfirmDeleteOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsConfirmDeleteOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head"><p className="modal-card-title">Confirmar Exclusão</p></header>
          <section className="modal-card-body">
              <p>Tem certeza que deseja excluir as <strong>{selectedItems.length}</strong> transportadoras selecionadas?</p>
              <p className="help is-danger">Esta ação não pode ser desfeita.</p>
          </section>
          <footer className="modal-card-foot is-justify-content-flex-end">
              <button className="button" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</button>
              <button className="button is-danger" onClick={confirmDelete}>Excluir</button>
          </footer>
        </div>
      </div>

      {/* Modais Funcionais */}
      <TransportadoraContactModal isActive={isContactOpen} onClose={closeModals} data={selectedItem} />
      
      <TransportadoraVehiclesModal 
          isActive={isVehiclesOpen} 
          onClose={closeModals} 
          data={selectedItem} 
          onAddVehicle={handleOpenAddVehicle}
          onDeleteTransportadora={handleDeleteTransportadoraFromModal}
          onRemoveVehicle={handleRemoveVehicle}
      />
      
      <TransportadoraEditModal isActive={isEditOpen} onClose={closeModals} data={selectedItem} onSave={handleSaveEdit} />
      <TransportadoraCreateModal isActive={isCreateOpen} onClose={closeModals} onCreate={handleSaveNew} />
      <TransportadoraAddVehicleModal isActive={isAddVehicleOpen} onClose={closeModals} onSave={handleSaveNewVehicle} />
    </div>
  );
};