// src/components/CooperadoListItem.tsx

import React from 'react';
import type { CooperadoItem } from '../types/models';
import { MdVerified, MdCheck, MdPhone, MdLocationOn, MdVisibility, MdEdit, MdCalendarMonth } from 'react-icons/md';

interface Props {
  item: CooperadoItem;
  isDeleteMode: boolean;
  isSelected: boolean;
  onSelectItem: (id: string | number) => void;
  onContactItem: (item: CooperadoItem) => void;
  onLocationItem: (item: CooperadoItem) => void;
  onViewItem: (item: CooperadoItem) => void;
  onEditItem: (item: CooperadoItem) => void;
  onCalendarItem: (item: CooperadoItem) => void;
}

// Função auxiliar de cálculo (Haversine)
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
  item, isDeleteMode, isSelected, onSelectItem,
  onContactItem, onLocationItem, onViewItem, onEditItem, onCalendarItem 
}) => {
  const certificadoClass = item.certificado === 'Ativo' ? 'has-text-success' : 'has-text-grey';
  const doamDejetosClass = item.doamDejetos === 'Sim' ? 'has-text-success' : 'has-text-grey';

  // LÓGICA DE EXIBIÇÃO DA DISTÂNCIA
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

  return (
    <div className={`bioPartner-item p-2 ${isSelected ? 'has-background-info-light' : ''}`}>
      <div className="columns is-vcentered is-mobile">
        {isDeleteMode && (
          <div className="column is-narrow">
            <label className="checkbox">
              <input type="checkbox" checked={isSelected} onChange={() => onSelectItem(item.id)} />
            </label>
          </div>
        )}
        
        <div className="column is-2-desktop is-4-mobile">
            <span className="help">Nome do produtor</span>
            <span className="subtitle is-6 has-text-weight-semibold">{item.motorista}</span>
        </div>

        <div className="column">
            <span className="help">Filiada</span>
            <span className="subtitle is-6">{item.filial}</span>
        </div>

        <div className="column">
            <span className="help">Modalidade</span>
            <span className="subtitle is-6">{item.modalidade || item.tipoVeiculo || '-'}</span>
        </div>

        {/* --- NOVA COLUNA ADICIONADA --- */}
        <div className="column">
            <span className="help">Qtda Cabeças</span>
            <span className="subtitle is-6">{item.cabecasAlojadas || '-'}</span>
        </div>
        {/* ------------------------------ */}

        <div className="column">
            <span className="help">Distância</span>
            <span className="subtitle is-6 has-text-weight-medium">{displayDistance}</span>
        </div>

        <div className="column">
            <span className="help">Certificado</span>
            <div className={`icon-text has-text-weight-bold ${certificadoClass}`}>
                <span className="icon"><MdVerified /></span>
                <span>{item.certificado}</span>
            </div>
        </div>

        <div className="column">
            <span className="help">Doam Dejetos</span>
            <div className={`icon-text has-text-weight-bold ${doamDejetosClass}`}>
                <span className="icon"><MdCheck /></span>
                <span>{item.doamDejetos}</span>
            </div>
        </div>
        
        <div className="column is-narrow">
            <div className="is-flex is-justify-content-flex-end">
                <button className="button is-small is-light is-rounded" onClick={(e) => {e.stopPropagation(); onContactItem(item)}} title="Contato"><span className="icon"><MdPhone /></span></button>
                <button className="button is-small is-light is-rounded ml-1" onClick={(e) => {e.stopPropagation(); onLocationItem(item)}} title="Localização"><span className="icon"><MdLocationOn /></span></button>
                <button className="button is-small is-light is-rounded ml-1" onClick={(e) => {e.stopPropagation(); onViewItem(item)}} title="Visualizar"><span className="icon"><MdVisibility /></span></button>
                <button className="button is-small is-light is-rounded ml-1" onClick={(e) => {e.stopPropagation(); onEditItem(item)}} title="Editar"><span className="icon"><MdEdit /></span></button>
            </div>
        </div>
      </div>
      <div className="divider is-right mb-0"></div>
    </div>
  );
};