import React from 'react';
import { MdEdit, MdPhone, MdLocationOn, MdVisibility, MdVerified } from 'react-icons/md';
import type { CooperadoItem } from '../types/models';

interface Props {
  item: CooperadoItem;
  isDeleteMode: boolean;
  isSelected: boolean;
  onSelectItem: (id: string | number) => void;
  onContactItem: (item: CooperadoItem) => void;
  onLocationItem: (item: CooperadoItem) => void;
  onViewItem: (item: CooperadoItem) => void;
  onEditItem: (item: CooperadoItem) => void;
  onCalendarItem: (item: CooperadoItem) => void; // Mantido por compatibilidade
}

// Função auxiliar de cálculo (Haversine) - Restaurada
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c;
  return d.toFixed(1) + ' km';
}

// Base (Toledo-PR)
const BASE_LAT = -24.725036; 
const BASE_LNG = -53.742277;

export const CooperadoListItem: React.FC<Props> = ({
  item,
  isDeleteMode,
  isSelected,
  onSelectItem,
  onContactItem,
  onLocationItem,
  onViewItem,
  onEditItem,
}) => {
  
  // Lógica de Certificado (Cores)
  const certificadoClass = item.certificado === 'Ativo' ? 'has-text-success' : 'has-text-grey';

  // Lógica de Distância
  let displayDistance = '-';
  if (item.distancia && item.distancia.trim() !== '') {
      displayDistance = item.distancia;
  } else if (item.latitude && item.longitude) {
      const lat = parseFloat(String(item.latitude).replace(',', '.'));
      const lng = parseFloat(String(item.longitude).replace(',', '.'));
      if (!isNaN(lat) && !isNaN(lng)) {
          displayDistance = calculateDistance(BASE_LAT, BASE_LNG, lat, lng);
      }
  }

  // Dados antigos mapeados
  const modalidade = (item as any).modalidade || item.tipoVeiculo || '-';
  const cabecas = (item as any).cabecasAlojadas || '-';

  return (
    <tr className="is-clickable" onClick={() => !isDeleteMode && onEditItem(item)}>
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
      
      <td className="is-vcentered has-text-weight-medium">
        {item.motorista}
      </td>
      
      <td className="is-vcentered">{item.filial}</td>
      
      <td className="is-vcentered">{modalidade}</td>
      
      <td className="is-vcentered">{cabecas}</td>
      
      <td className="is-vcentered has-text-weight-medium">{displayDistance}</td>
      
      <td className="is-vcentered has-text-centered">
        <div className={`icon-text is-justify-content-center has-text-weight-bold ${certificadoClass}`}>
            <span className="icon"><MdVerified /></span>
            <span>{item.certificado}</span>
        </div>
      </td>
      
      <td className="is-vcentered has-text-right" onClick={(e) => e.stopPropagation()}>
        <div className="buttons is-right are-small">
          <button className="button is-white" onClick={() => onContactItem(item)} title="Contato">
            <span className="icon has-text-grey"><MdPhone /></span>
          </button>
          <button className="button is-white" onClick={() => onLocationItem(item)} title="Localização">
            <span className="icon has-text-grey"><MdLocationOn /></span>
          </button>
          <button className="button is-white" onClick={() => onViewItem(item)} title="Ver Detalhes">
            <span className="icon has-text-grey"><MdVisibility /></span>
          </button>
          <button className="button is-white" onClick={() => onEditItem(item)} title="Editar">
            <span className="icon has-text-grey"><MdEdit /></span>
          </button>
        </div>
      </td>
    </tr>
  );
};