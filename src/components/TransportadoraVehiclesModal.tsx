// src/components/TransportadoraVehiclesModal.tsx

import React, { useState, useEffect } from 'react';
import type { TransportadoraItem } from '../types/models';
import useTheme from '../hooks/useTheme';
import { MdLocalShipping, MdAdd, MdDelete, MdCheck, MdClose } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  data: TransportadoraItem | null;
  onOpenAddModal: () => void; // Abre o modal de adicionar
  onDeleteVehicles: (indices: number[]) => void; // Deleta os selecionados
}

const TransportadoraVehiclesModal: React.FC<Props> = ({ 
  isActive, 
  onClose, 
  data, 
  onOpenAddModal, 
  onDeleteVehicles
}) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  // Controle do Modo de Exclusão e Seleção
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Reseta estados ao fechar ou trocar dados
  useEffect(() => {
      setIsDeleteMode(false);
      setSelectedIndices([]);
  }, [isActive, data]);

  if (!data) return null;

  const toggleSelection = (index: number) => {
      setSelectedIndices(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
  };

  const handleConfirmDelete = () => {
      onDeleteVehicles(selectedIndices);
      setIsDeleteMode(false);
      setSelectedIndices([]);
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '600px', width: '100%', borderRadius: '8px' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.5rem', backgroundColor: '#fff' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>
            Veículos da transportadora
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '2rem 1.5rem' }}>
          
          <div className="mb-5 is-flex is-align-items-center">
             <span className="icon is-medium has-text-info mr-2"><MdLocalShipping size={24}/></span>
             <p className="title is-5 has-text-weight-bold mb-0" style={{ color: textColor }}>
              {data.nomeFantasia.toUpperCase()}
            </p>
          </div>

          <hr className="divider" style={{ margin: '1rem 0', backgroundColor: '#f0f0f0' }} />

          {/* LISTA DE VEÍCULOS */}
          {data.veiculos && data.veiculos.length > 0 ? (
              data.veiculos.map((v, index) => (
                  <div key={index} className={`box p-3 mb-3 ${selectedIndices.includes(index) ? 'has-background-danger-light' : ''}`} style={{ border: '1px solid #f5f5f5', boxShadow: 'none' }}>
                      <div className="columns is-mobile is-vcentered">
                          
                          {/* CHECKBOX (Só aparece se estiver em modo de exclusão) */}
                          {isDeleteMode && (
                              <div className="column is-narrow">
                                  <label className="checkbox">
                                      <input 
                                        type="checkbox" 
                                        checked={selectedIndices.includes(index)}
                                        onChange={() => toggleSelection(index)}
                                        style={{ transform: 'scale(1.2)' }}
                                      />
                                  </label>
                              </div>
                          )}

                          <div className="column">
                              <div className="columns is-mobile is-variable is-1">
                                  <div className="column is-7">
                                      <p className="is-size-7 has-text-grey is-uppercase mb-1">Tipo de veículo</p>
                                      <p className="subtitle is-6 has-text-weight-semibold" style={{ color: textColor }}>{v.tipo}</p>
                                  </div>
                                  <div className="column is-5">
                                      <p className="is-size-7 has-text-grey is-uppercase mb-1">Capacidade</p>
                                      <p className="subtitle is-6" style={{ color: textColor }}>{v.capacidade}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              ))
          ) : (
              <p className="has-text-grey has-text-centered py-4">Nenhum veículo cadastrado.</p>
          )}

        </section>

        {/* RODAPÉ DO MODAL */}
        <footer className="modal-card-foot" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', padding: '1.5rem', justifyContent: 'flex-end', gap: '10px' }}>
          
          {/* MODO NORMAL: MOSTRA REMOVER E ADICIONAR */}
          {!isDeleteMode ? (
            <>
                <button className="button is-danger is-light" onClick={() => setIsDeleteMode(true)} disabled={!data.veiculos || data.veiculos.length === 0}>
                    <span className="icon is-small"><MdDelete /></span>
                    <span>Remover</span>
                </button>

                <button className="button is-info" onClick={onOpenAddModal}>
                    <span className="icon is-small"><MdAdd /></span>
                    <span>Adicionar</span>
                </button>
            </>
          ) : (
            /* MODO DE EXCLUSÃO: MOSTRA CANCELAR E CONFIRMAR */
            <>
                <button className="button" onClick={() => { setIsDeleteMode(false); setSelectedIndices([]); }}>
                    <span className="icon is-small"><MdClose /></span>
                    <span>Cancelar</span>
                </button>

                <button className="button is-danger" onClick={handleConfirmDelete} disabled={selectedIndices.length === 0}>
                    <span className="icon is-small"><MdCheck /></span>
                    <span>Confirmar Exclusão ({selectedIndices.length})</span>
                </button>
            </>
          )}

        </footer>
      </div>
    </div>
  );
};

export default TransportadoraVehiclesModal;