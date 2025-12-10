// src/components/TransportadoraListItem.tsx

import React from 'react';
import type { TransportadoraItem } from '../types/models';
import { MdEdit, MdPhone, MdLocalShipping } from 'react-icons/md';

interface Props {
  item: TransportadoraItem;
  // Props de Seleção/Exclusão
  isDeleteMode: boolean;
  isSelected: boolean;
  onSelectItem: (id: string) => void;
  // Ações
  onContact: (item: TransportadoraItem) => void;
  onVehicles: (item: TransportadoraItem) => void;
  onEdit: (item: TransportadoraItem) => void;
}

export const TransportadoraListItem: React.FC<Props> = ({ 
  item, 
  isDeleteMode, 
  isSelected, 
  onSelectItem, 
  onContact, 
  onVehicles, 
  onEdit 
}) => {
  const enderecoCompleto = item.endereco || `${item.cidade} - ${item.uf}`;
  const categoria = item.categoria || 'Logística';

  return (
    <div className={`bioPartner-item p-2 mb-2 has-background-white ${isSelected ? 'has-background-danger-light' : ''}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
      <div className="columns is-vcentered is-mobile">
        
        {/* CHECKBOX DE SELEÇÃO (Aparece com a Lixeira) */}
        {isDeleteMode && (
          <div className="column is-narrow">
            <label className="checkbox">
              <input 
                type="checkbox" 
                checked={isSelected} 
                onChange={() => onSelectItem(item.id)} 
                style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
              />
            </label>
          </div>
        )}

        {/* Coluna 1: Empresa */}
        <div className="column is-3-desktop is-4-mobile">
            <span className="help is-uppercase has-text-grey-light" style={{ fontSize: '0.7rem' }}>Empresa</span>
            <span className="subtitle is-6 has-text-weight-semibold">{item.nomeFantasia}</span>
        </div>

        {/* Coluna 2: CNPJ */}
        <div className="column is-2-desktop is-hidden-mobile">
            <span className="help is-uppercase has-text-grey-light" style={{ fontSize: '0.7rem' }}>CNPJ</span>
            <span className="subtitle is-6">{item.cnpj}</span>
        </div>

        {/* Coluna 3: Endereço */}
        <div className="column is-3-desktop is-hidden-touch">
            <span className="help is-uppercase has-text-grey-light" style={{ fontSize: '0.7rem' }}>Endereço</span>
            <span className="subtitle is-6" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }} title={enderecoCompleto}>
                {enderecoCompleto}
            </span>
        </div>

        {/* Coluna 4: Categoria */}
        <div className="column">
            <span className="help is-uppercase has-text-grey-light" style={{ fontSize: '0.7rem' }}>Categoria</span>
            <span className="tag is-light is-info has-text-weight-medium">{categoria}</span>
        </div>
        
        {/* Coluna 5: Ações */}
        <div className="column is-narrow">
            <div className="is-flex is-justify-content-flex-end">
                <button className="button is-small is-light is-rounded" onClick={(e) => {e.stopPropagation(); onContact(item)}} title="Contato">
                    <span className="icon"><MdPhone /></span>
                </button>
                <button className="button is-small is-light is-rounded ml-1" onClick={(e) => {e.stopPropagation(); onVehicles(item)}} title="Veículos">
                    <span className="icon"><MdLocalShipping /></span>
                </button>
                <button className="button is-small is-light is-rounded ml-1" onClick={(e) => {e.stopPropagation(); onEdit(item)}} title="Editar">
                    <span className="icon"><MdEdit /></span>
                </button>
            </div>
        </div>

      </div>
      <div className="divider is-right mb-0"></div>
    </div>
  );
};