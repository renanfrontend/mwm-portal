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

  // Confirm Remoção Veículo
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  const [isConfirmVehicleDeleteOpen, setIsConfirmVehicleDeleteOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchTransportadorasData();
        
        // Mock para garantir que apareça algo na contagem se a API vier vazia
        if (result.length > 0 && (!result[0].veiculos || result[0].veiculos.length === 0)) {
             result[0].veiculos = [
                 { tipo: 'Truck', capacidade: '1000', placa: 'ABC-1234', tipoAbastecimento: 'Diesel' } as any
             ];
        }

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
      if (isConfirmVehicleDeleteOpen) { setIsConfirmVehicleDeleteOpen(false); setVehicleToDelete(null); return; }

      setSelectedItem(null); 
      setIsContactOpen(false); 
      setIsVehiclesOpen(false); 
      setIsEditOpen(false); 
      setIsCreateOpen(false);
  };

  const handleContact = (item: TransportadoraItem) => { setSelectedItem(item); setIsContactOpen(true); };
  const handleVehicles = (item: TransportadoraItem) => { setSelectedItem(item); setIsVehiclesOpen(true); setIsAddVehicleOpen(false); };
  const handleEdit = (item: TransportadoraItem) => { setSelectedItem(item); setIsEditOpen(true); };
  const handleAdd = () => setIsCreateOpen(true);

  // Handlers de Salvar
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
      {/* TOOLBAR */}
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

      {/* BARRA DE EXCLUSÃO (NOVO FORMATO) */}
      {isDeleteMode && selectedItems.length > 0 && (
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4 py-2 px-1">
              <span className="has-text-weight-medium has-text-danger">{selectedItems.length} item(s) selecionado(s)</span>
              <button className="button is-small is-danger" onClick={() => setIsConfirmDeleteOpen(true)}>Excluir</button>
          </div>
      )}

      {/* TABELA */}
      <div className="box p-0 shadow-none border" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
          {loading ? (
            <div className="p-5 has-text-centered">Carregando...</div>
          ) : filteredData.length === 0 ? (
            <div className="p-5 has-text-centered has-text-grey">Nenhuma transportadora encontrada.</div>
          ) : (
            <div className="table-container">
              <table className="table is-fullwidth is-hoverable is-striped is-size-7">
                <thead>
                  <tr className="has-background-light">
                    {isDeleteMode && <th style={{ width: '40px' }}></th>}
                    <th>Nome Fantasia</th>
                    <th>CNPJ</th>
                    <th>Endereço</th>
                    <th className="has-text-centered">Qtd. Veículos</th>
                    <th className="has-text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <TransportadoraListItem 
                        key={item.id} 
                        item={item}
                        isDeleteMode={isDeleteMode} 
                        isSelected={selectedItems.includes(item.id)} 
                        onSelectItem={handleSelectItem}
                        onContact={handleContact} 
                        onVehicles={handleVehicles} 
                        onEdit={handleEdit}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Modal Confirmação Exclusão */}
      <div className={`modal ${isConfirmDeleteOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsConfirmDeleteOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head"><p className="modal-card-title">Confirmar</p></header>
          <section className="modal-card-body"><p>Excluir {selectedItems.length} itens?</p></section>
          <footer className="modal-card-foot"><button className="button" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</button><button className="button is-danger" onClick={confirmDelete}>Excluir</button></footer>
        </div>
      </div>

      {/* Modal Remoção Veículo */}
      <div className={`modal ${isConfirmVehicleDeleteOpen ? 'is-active' : ''}`} style={{ zIndex: 1300 }}>
        <div className="modal-background" onClick={() => setIsConfirmVehicleDeleteOpen(false)} style={{ backgroundColor: 'rgba(10,10,10,0.5)' }}></div>
        <div className="modal-card" style={{ maxWidth: '400px', boxShadow: 'none', border: '1px solid #ededed', borderRadius: '8px' }}>
          <header className="modal-card-head py-3 has-background-white" style={{ borderBottom: '1px solid #ededed', boxShadow: 'none' }}>
            <p className="modal-card-title is-size-6 has-text-weight-bold has-text-centered w-full" style={{ color: '#363636' }}>Confirmar remoção</p>
          </header>
          <section className="modal-card-body py-5 has-text-centered has-background-white">
            <p className="subtitle is-6" style={{ color: '#4a4a4a' }}>Deseja remover este veículo?</p>
          </section>
          <footer className="modal-card-foot is-justify-content-center pt-3 pb-3 has-background-white" style={{ borderTop: '1px solid #ededed' }}>
            <button className="button is-small shadow-none" onClick={() => setIsConfirmVehicleDeleteOpen(false)}>Cancelar</button>
            <button className="button is-small is-danger shadow-none" style={{ backgroundColor: '#ff5773', borderColor: 'transparent' }} onClick={handleConfirmRemoveVehicle}>Remover</button>
          </footer>
        </div>
      </div>

      <TransportadoraContactModal isActive={isContactOpen} onClose={closeModals} data={selectedItem} />
      <TransportadoraVehiclesModal isActive={isVehiclesOpen} onClose={closeModals} data={selectedItem} onAddVehicle={() => setIsAddVehicleOpen(true)} onRemoveVehicle={handleRequestRemoveVehicle} />
      <TransportadoraAddVehicleModal isActive={isAddVehicleOpen} onClose={() => setIsAddVehicleOpen(false)} onSave={handleSaveNewVehicle} />
      <TransportadoraEditModal isActive={isEditOpen} onClose={closeModals} data={selectedItem} onSave={handleSaveEdit} />
      <TransportadoraCreateModal isActive={isCreateOpen} onClose={closeModals} onCreate={handleSaveNew} />
    </div>
  );
};