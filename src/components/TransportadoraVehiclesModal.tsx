// src/components/TransportadoraVehiclesModal.tsx

import React from 'react';
import type { TransportadoraItem } from '../types/models';
import useTheme from '../hooks/useTheme';
import { MdLocalShipping, MdAdd, MdDelete } from 'react-icons/md';

// CORREÇÃO AQUI: Interface atualizada para aceitar as novas props
interface Props {
  isActive: boolean;
  onClose: () => void;
  data: TransportadoraItem | null;
  onAddVehicle: () => void;        
  onDeleteTransportadora: () => void; 
  onRemoveVehicle: (index: number) => void;
}

const TransportadoraVehiclesModal: React.FC<Props> = ({ 
  isActive, 
  onClose, 
  data, 
  onAddVehicle, 
  onDeleteTransportadora, 
  onRemoveVehicle 
}) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  if (!data) return null;

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

          {data.veiculos && data.veiculos.length > 0 ? (
              data.veiculos.map((v, index) => (
                  <div key={index} className="box p-3 mb-3" style={{ border: '1px solid #f5f5f5', boxShadow: 'none' }}>
                      <div className="columns is-mobile is-vcentered">
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
                          {/* Botão de excluir o veículo individualmente */}
                          <div className="column is-narrow">
                              <button 
                                className="button is-small is-white has-text-grey-light" 
                                onClick={() => onRemoveVehicle(index)}
                                title="Remover este veículo"
                              >
                                  <span className="icon"><MdDelete /></span>
                              </button>
                          </div>
                      </div>
                  </div>
              ))
          ) : (
              <p className="has-text-grey has-text-centered py-4">Nenhum veículo cadastrado.</p>
          )}

        </section>

        <footer className="modal-card-foot" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', padding: '1.5rem', justifyContent: 'space-between' }}>
          {/* Botão Remover Transportadora (Vermelho) */}
          <button className="button is-danger is-light" onClick={onDeleteTransportadora}>
            <span className="icon is-small"><MdDelete /></span>
            <span>Remover</span>
          </button>

          {/* Botão Adicionar Veículo (Azul) */}
          <button className="button is-info" onClick={onAddVehicle}>
            <span className="icon is-small"><MdAdd /></span>
            <span>Adicionar</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TransportadoraVehiclesModal;