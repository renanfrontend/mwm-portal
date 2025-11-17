// src/components/CooperadoListItem.tsx (Modificado)

import React from 'react';
import type { CooperadoItem } from '../services/api';
import { MdVerified, MdCheck, MdPhone, MdLocationOn, MdVisibility, MdEdit, MdCalendarMonth } from 'react-icons/md';

interface Props {
  item: CooperadoItem;
  isDeleteMode: boolean;
  isSelected: boolean;
  onSelectItem: (id: string | number) => void;

  // --- ADIÇÃO DAS PROPS DOS BOTÕES ---
  onContactItem: (item: CooperadoItem) => void;
  onLocationItem: (item: CooperadoItem) => void;
  onViewItem: (item: CooperadoItem) => void;
  onEditItem: (item: CooperadoItem) => void;
  onCalendarItem: (item: CooperadoItem) => void;
}

export const CooperadoListItem: React.FC<Props> = ({ 
  item, 
  isDeleteMode, 
  isSelected, 
  onSelectItem,
  // --- RECEBENDO AS NOVAS PROPS ---
  onContactItem,
  onLocationItem,
  onViewItem,
  onEditItem,
  onCalendarItem
}) => {
  const certificadoClass = item.certificado === 'Ativo' ? 'has-text-success' : 'has-text-grey';
  const doamDejetosClass = item.doamDejetos === 'Sim' ? 'has-text-success' : 'has-text-grey';

  // --- Handlers para parar a propagação ---
  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContactItem(item);
  };
  const handleLocationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLocationItem(item);
  };
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewItem(item);
  };
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditItem(item);
  };
  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCalendarItem(item);
  };


  return (
    // Seu layout original
    <div className={`bioPartner-item p-2 ${isSelected ? 'has-background-info-light' : ''}`}>
      <div className="columns is-vcentered is-mobile">
        {isDeleteMode && (
          <div className="column is-narrow">
            <label className="checkbox">
              <input type="checkbox" checked={isSelected} onChange={() => onSelectItem(item.id)} />
            </label>
          </div>
        )}
        {/* Colunas originais */}
        <div className="column">
          <span className="help">Matrícula</span>
          <span className="subtitle is-6">{item.matricula}</span>
        </div>
        <div className="column">
          <span className="help">Filiada</span>
          <span className="subtitle is-6">{item.filial}</span>
        </div>
        <div className="column is-2-desktop is-4-mobile">
          <span className="help">Motorista</span>
          <span className="subtitle is-6">{item.motorista}</span>
        </div>
        <div className="column is-2-desktop is-hidden-mobile">
          <span className="help">Tipo de veículo</span>
          <span className="subtitle is-6">{item.tipoVeiculo}</span>
        </div>
        <div className="column is-hidden-mobile">
          <span className="help">Placa</span>
          <span className="subtitle is-6">{item.placa}</span>
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
        <div className="column is-hidden-mobile">
          <span className="help">Fase do dejeto</span>
          <span className="subtitle is-6">{item.fase}</span>
        </div>
        
        {/* --- CORREÇÃO APLICADA NOS ONCLICKS --- */}
        <div className="column is-narrow">
            <div className="is-flex is-justify-content-flex-end">
                <button className="button is-small is-light is-rounded" onClick={handleContactClick}>
                    <span className="icon"><MdPhone /></span>
                </button>
                <button className="button is-small is-light is-rounded ml-1" onClick={handleLocationClick}>
                    <span className="icon"><MdLocationOn /></span>
                </button>
                <button className="button is-small is-light is-rounded ml-1" onClick={handleViewClick}>
                    <span className="icon"><MdVisibility /></span>
                </button>
                <button className="button is-small is-light is-rounded ml-1" onClick={handleEditClick}>
                    <span className="icon"><MdEdit /></span>
                </button>
                <button className="button is-small is-info is-light is-rounded ml-1" onClick={handleCalendarClick}>
                    <span className="icon"><MdCalendarMonth /></span>
                </button>
            </div>
        </div>
      </div>
      <div className="divider is-right mb-0"></div>
    </div>
  );
};