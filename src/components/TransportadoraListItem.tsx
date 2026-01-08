import React from 'react';
import { MdEdit, MdPhone, MdDirectionsCar } from 'react-icons/md';
import type { TransportadoraItem } from '../types/models';

interface Props {
  item: TransportadoraItem;
  isDeleteMode: boolean;
  isSelected: boolean;
  onSelectItem: (id: string) => void;
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
  // Cálculo da quantidade de veículos
  const qtdVeiculos = item.veiculos ? item.veiculos.length : 0;

  // Formatação do Endereço
  const enderecoCompleto = `${item.endereco}, ${item.numero} - ${item.bairro} - ${item.cidade}/${item.estado}`;

  return (
    <tr className="is-clickable" onClick={() => !isDeleteMode && onEdit(item)}>
      {isDeleteMode && (
        <td onClick={(e) => e.stopPropagation()}>
          <label className="checkbox">
            <input 
              type="checkbox" 
              checked={isSelected} 
              onChange={() => onSelectItem(item.id)} 
            />
          </label>
        </td>
      )}
      
      {/* Nome Fantasia */}
      <td className="is-vcentered has-text-weight-medium">
        {item.nomeFantasia}
      </td>
      
      {/* CNPJ */}
      <td className="is-vcentered">{item.cnpj}</td>
      
      {/* Endereço (Substituindo Cidade/UF) */}
      <td className="is-vcentered">{enderecoCompleto}</td>
      
      {/* Qtd. Veículos */}
      <td className="is-vcentered has-text-centered">
        <span className="tag is-info is-light has-text-weight-bold is-rounded">
            {qtdVeiculos}
        </span>
      </td>

      {/* Ações */}
      <td className="is-vcentered has-text-right" onClick={(e) => e.stopPropagation()}>
        <div className="buttons is-right are-small">
          <button className="button is-white" onClick={() => onContact(item)} title="Contato">
            <span className="icon has-text-grey"><MdPhone /></span>
          </button>
          <button className="button is-white" onClick={() => onVehicles(item)} title="Veículos">
            <span className="icon has-text-grey"><MdDirectionsCar /></span>
          </button>
          <button className="button is-white" onClick={() => onEdit(item)} title="Editar">
            <span className="icon has-text-grey"><MdEdit /></span>
          </button>
        </div>
      </td>
    </tr>
  );
};