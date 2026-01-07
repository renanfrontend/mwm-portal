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

  // Modais Principais
  const [selectedItem, setSelectedItem] = useState<TransportadoraItem | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  // Controle do Modal de Lista de Veículos (Nível 1)
  const [isVehiclesOpen, setIsVehiclesOpen] = useState(false);
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Controle do Modal de ADICIONAR Veículo (Nível 2 - Sobreposto)
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  // --- Confirm Remoção Veículo ---
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  const [isConfirmVehicleDeleteOpen, setIsConfirmVehicleDeleteOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchTransportadorasData();
        
        // --- INJEÇÃO DE DADOS MOCKADOS PARA TESTE ---
        if (result.length > 0) {
            result[0].veiculos = [
                { tipo: 'Caminhão de dejetos: Vácuo', capacidade: '16.000L', placa: 'ABC-1234', tipoAbastecimento: 'Diesel' } as any,
                { tipo: 'Caminhão de dejetos: Hidrojato', capacidade: '20.000L', placa: 'XYZ-9876', tipoAbastecimento: 'Biometano', tag: 'A1B2C3D4E5F67890' } as any
            ];
        }
        // --------------------------------------------

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
      // Prioridade de fechamento (pilha de modais)
      if (isAddVehicleOpen) { setIsAddVehicleOpen(false); return; } // Fecha só o form, mantém a lista
      if (isConfirmVehicleDeleteOpen) { setIsConfirmVehicleDeleteOpen(false); setVehicleToDelete(null); return; } // Fecha confirmação

      // Fecha modais principais
      setSelectedItem(null); 
      setIsContactOpen(false); 
      setIsVehiclesOpen(false); 
      setIsEditOpen(false); 
      setIsCreateOpen(false);
  };

  const handleContact = (item: TransportadoraItem) => { setSelectedItem(item); setIsContactOpen(true); };
  
  // Abre apenas a lista inicialmente
  const handleVehicles = (item: TransportadoraItem) => { 
      setSelectedItem(item); 
      setIsVehiclesOpen(true); 
      // Garante que o de adicionar esteja fechado ao abrir a lista
      setIsAddVehicleOpen(false); 
  };
  
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
          
          // Fecha APENAS o modal de formulário, mantendo a lista aberta e atualizada
          setIsAddVehicleOpen(false); 
      } 
  };
  
  const handleRequestRemoveVehicle = (idx: number) => { 
      setVehicleToDelete(idx);
      setIsConfirmVehicleDeleteOpen(true);
  };

  const handleConfirmRemoveVehicle = () => {
      if (selectedItem && vehicleToDelete !== null && selectedItem.veiculos) { 
          const vs = [...selectedItem.veiculos]; 
          vs.splice(vehicleToDelete, 1); 
          const up = { ...selectedItem, veiculos: vs }; 
          setSelectedItem(up); 
          setData(prev => prev.map(i => i.id === up.id ? up : i)); 
          toast.success("Veículo removido."); 
      } 
      setIsConfirmVehicleDeleteOpen(false);
      setVehicleToDelete(null);
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

      {/* Modal Confirmação Exclusão Transportadora (Massa) */}
      <div className={`modal ${isConfirmDeleteOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsConfirmDeleteOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head"><p className="modal-card-title">Confirmar</p></header>
          <section className="modal-card-body"><p>Excluir {selectedItems.length} itens?</p></section>
          <footer className="modal-card-foot"><button className="button" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</button><button className="button is-danger" onClick={confirmDelete}>Excluir</button></footer>
        </div>
      </div>

      {/* --- Modal Confirmação Remoção Veículo (z-index alto para ficar sobre a lista) --- */}
      <div className={`modal ${isConfirmVehicleDeleteOpen ? 'is-active' : ''}`} style={{ zIndex: 1300 }}>
        <div className="modal-background" onClick={() => setIsConfirmVehicleDeleteOpen(false)} style={{ backgroundColor: 'rgba(10,10,10,0.5)' }}></div>
        <div className="modal-card" style={{ maxWidth: '400px', boxShadow: 'none', border: '1px solid #ededed', borderRadius: '8px' }}>
          <header className="modal-card-head py-3 has-background-white" style={{ borderBottom: '1px solid #ededed', boxShadow: 'none' }}>
            <p className="modal-card-title is-size-6 has-text-weight-bold has-text-centered w-full" style={{ color: '#363636' }}>Confirmar remoção</p>
          </header>
          <section className="modal-card-body py-5 has-text-centered has-background-white">
            <p className="subtitle is-6" style={{ color: '#4a4a4a' }}>Deseja remover este veículo da lista?</p>
          </section>
          <footer className="modal-card-foot is-justify-content-center pt-3 pb-3 has-background-white" style={{ borderTop: '1px solid #ededed' }}>
            <button className="button is-small shadow-none" onClick={() => setIsConfirmVehicleDeleteOpen(false)}>Cancelar</button>
            <button className="button is-small is-danger shadow-none" style={{ backgroundColor: '#ff5773', borderColor: 'transparent' }} onClick={handleConfirmRemoveVehicle}>Remover</button>
          </footer>
        </div>
      </div>

      <TransportadoraContactModal isActive={isContactOpen} onClose={closeModals} data={selectedItem} />
      
      {/* 1. Modal de LISTA de Veículos 
          - isActive={isVehiclesOpen}
          - onAddVehicle={() => setIsAddVehicleOpen(true)} <- Isso ABRE o segundo modal
      */}
      <TransportadoraVehiclesModal 
          isActive={isVehiclesOpen} 
          onClose={closeModals} 
          data={selectedItem} 
          onAddVehicle={() => setIsAddVehicleOpen(true)} 
          onRemoveVehicle={handleRequestRemoveVehicle} 
      />
      
      {/* 2. Modal de ADICIONAR Veículo (Formulário)
          - isActive={isAddVehicleOpen} 
          - zIndex superior no componente para sobrepor a lista
          - onClose fecha apenas ele mesmo
      */}
      <TransportadoraAddVehicleModal 
          isActive={isAddVehicleOpen} 
          onClose={() => setIsAddVehicleOpen(false)} 
          onSave={handleSaveNewVehicle} 
      />
      
      <TransportadoraEditModal isActive={isEditOpen} onClose={closeModals} data={selectedItem} onSave={handleSaveEdit} />
      <TransportadoraCreateModal isActive={isCreateOpen} onClose={closeModals} onCreate={handleSaveNew} />
    </div>
  );
};