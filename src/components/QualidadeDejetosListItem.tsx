// src/components/QualidadeDejetosListItem.tsx

import React from 'react';
import { MdScience, MdMoreVert } from 'react-icons/md';
import { type QualidadeDejetosItem } from '../types/models';

interface Props {
  item: QualidadeDejetosItem;
  isDeleteMode: boolean;
  isSelected: boolean;
  onSelectItem: (id: string | number) => void;
}

export const QualidadeDejetosListItem: React.FC<Props> = ({ item, isDeleteMode, isSelected, onSelectItem }) => {
  
  return (
    <div className={`box p-3 mb-3 ${isSelected ? 'has-background-white-ter' : ''}`} style={{ border: isSelected ? '1px solid #3273dc' : '1px solid #dbdbdb' }}>
      <div className="level is-mobile">
        
        {/* Esquerda: Ícone e Checkbox */}
        <div className="level-left">
          <div className="level-item">
            {isDeleteMode ? (
              <label className="checkbox mr-3">
                <input 
                  type="checkbox" 
                  checked={isSelected} 
                  onChange={() => onSelectItem(item.id)}
                  style={{ transform: 'scale(1.2)' }}
                />
              </label>
            ) : (
              <span className="icon is-medium has-text-info has-background-info-light" style={{ borderRadius: '50%', marginRight: '1rem' }}>
                <MdScience size={24} />
              </span>
            )}
            
            <div>
              <p className="has-text-weight-bold is-size-6">{item.cooperado}</p>
              <p className="is-size-7 has-text-grey">
                <span className="mr-2">Ref: {item.entregaReferencia || 'N/A'}</span>
                {item.placa && <span className="tag is-light is-small">{item.placa}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Direita: Dados da Análise */}
        <div className="level-right has-text-right">
          <div className="mr-4 is-hidden-mobile">
             {/* Rótulo atualizado conforme solicitado */}
             <p className="heading mb-0">Ponto de Medição</p> 
             {/* Mantendo o valor original do item ou um placeholder se não existir */}
             <p className="has-text-weight-medium">{(item as any).pontoColeta || 'Tanque A'}</p> 
          </div>
          
          <div className="mr-4">
             <p className="heading mb-0">pH</p>
             <p className={`has-text-weight-bold ${Number(item.ph) < 6 || Number(item.ph) > 8 ? 'has-text-danger' : 'has-text-success'}`}>
                 {item.ph}
             </p>
          </div>

          <div>
             <p className="heading mb-0">Densidade</p>
             <p className="has-text-weight-bold">{item.densidade} g/cm³</p>
          </div>
          
          <div className="level-item ml-3">
             <button className="button is-white is-small">
                 <MdMoreVert size={20} />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};