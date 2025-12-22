import React from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import type { TransportadoraItem } from '../types/models';

interface Props {
  isActive: boolean;
  onClose: () => void;
  data: TransportadoraItem | null;
  onAddVehicle: () => void;
  onDeleteTransportadora: () => void;
  onRemoveVehicle: (idx: number) => void;
}

const TransportadoraVehiclesModal: React.FC<Props> = ({
  isActive,
  onClose,
  data,
  onAddVehicle,
  onDeleteTransportadora,
  onRemoveVehicle,
}) => {
  if (!isActive) return null;

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`} style={{ zIndex: 1000 }}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '800px', width: '100%' }}>
        <header className="modal-card-head">
          <p className="modal-card-title">Veículos - {data?.nomeFantasia || 'Transportadora'}</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          {data?.veiculos && data.veiculos.length > 0 ? (
            <div className="table-container">
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Placa</th>
                    <th>Capacidade</th>
                    <th>Abastecimento</th>
                    <th className="has-text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.veiculos.map((vehicle, idx) => (
                    <tr key={idx}>
                      <td>{vehicle.tipo}</td>
                      <td>{(vehicle as any).placa}</td>
                      <td>{vehicle.capacidade}</td>
                      <td>{(vehicle as any).tipoAbastecimento}</td>
                      <td className="has-text-right">
                        <button
                          className="button is-small is-danger is-light"
                          onClick={() => onRemoveVehicle(idx)}
                          title="Remover veículo"
                        >
                          <span className="icon"><MdDelete /></span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="notification is-info is-light">
              Nenhum veículo cadastrado para esta transportadora.
            </div>
          )}
        </section>
        <footer className="modal-card-foot is-justify-content-space-between">
          <button className="button is-danger is-outlined" onClick={onDeleteTransportadora}>
            <span className="icon"><MdDelete /></span>
            <span>Excluir Transportadora</span>
          </button>
          <div className="buttons">
            <button className="button" onClick={onClose}>Fechar</button>
            <button className="button is-primary" onClick={onAddVehicle}>
              <span className="icon"><MdAdd /></span>
              <span>Adicionar Veículo</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TransportadoraVehiclesModal;