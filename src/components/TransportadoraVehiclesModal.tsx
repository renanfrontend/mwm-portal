import React, { useState, useEffect } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import type { TransportadoraItem } from '../types/models';

interface Props {
  isActive: boolean;
  onClose: () => void;
  data: TransportadoraItem | null;
  onAddVehicle: () => void;
  onRemoveVehicle: (idx: number) => void;
}

const TransportadoraVehiclesModal: React.FC<Props> = ({
  isActive,
  onClose,
  data,
  onAddVehicle,
  onRemoveVehicle,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIdx(null);
  }, [isActive, data]);

  if (!isActive) return null;

  const handleRemoveClick = () => {
    if (selectedIdx !== null) {
      onRemoveVehicle(selectedIdx);
    }
  };

  // --- ESTILOS REFINADOS (Flat & Espaçamento) ---
  const modalCardStyle = { 
    maxWidth: '600px', 
    width: '100%', 
    borderRadius: '8px', 
    boxShadow: 'none', // Remove sombra externa do modal
    border: 'none'     // Remove borda padrão
  };

  const headerStyle = { 
    borderBottom: 'none', // Remove a linha/sombra entre header e body
    boxShadow: 'none',    // Garante sem sombra
    padding: '20px 24px 5px 24px', // Padding inferior reduzido para aproximar do nome da empresa
    backgroundColor: '#fff',
    borderRadius: '8px 8px 0 0'
  };
  
  const titleStyle = { 
    color: '#363636', 
    fontWeight: 'normal' as const, 
    fontSize: '1.25rem',
    marginBottom: 0
  };

  const bodyStyle = { 
    backgroundColor: '#fff', 
    padding: '0 24px 20px 24px' // Padding superior zerado
  };

  const companyNameContainerStyle = {
    paddingTop: '5px',
    paddingBottom: '15px',
    marginBottom: '15px',
    borderBottom: '1px solid #ededed' // A linha divisória fica AQUI
  };

  const companyNameStyle = {
    color: '#7a7a7a',
    fontWeight: 'normal' as const,
    fontSize: '0.875rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  };

  const footerStyle = { 
    borderTop: 'none', 
    padding: '0 24px 24px 24px',
    backgroundColor: '#fff', 
    justifyContent: 'flex-end' as const,
    borderRadius: '0 0 8px 8px'
  };

  const buttonStyle = (bgColor: string) => ({
    backgroundColor: bgColor,
    borderColor: 'transparent',
    color: '#fff',
    boxShadow: 'none',
    fontWeight: '500' as const,
    paddingLeft: '1.5em',
    paddingRight: '1.5em'
  });

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`} style={{ zIndex: 1000 }}>
      <div className="modal-background" onClick={onClose} style={{ backgroundColor: 'rgba(10, 10, 10, 0.5)' }}></div>
      <div className="modal-card" style={modalCardStyle}>
        
        {/* Cabeçalho */}
        <header className="modal-card-head" style={headerStyle}>
          <p className="modal-card-title" style={titleStyle}>
            Veículos da transportadora
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={bodyStyle}>
          {/* Nome da Transportadora (Colado visualmente ao header) */}
          <div style={companyNameContainerStyle}>
             <h6 style={companyNameStyle}>
               {data?.nomeFantasia || 'NOME DA TRANSPORTADORA'}
             </h6>
          </div>

          {/* Lista de Cards */}
          {data?.veiculos && data.veiculos.length > 0 ? (
            <div className="content" style={{ maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
              {data.veiculos.map((vehicle, idx) => {
                const isSelected = selectedIdx === idx;
                
                const cardStyle = {
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #4f46e5' : '1px solid #ededed',
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  boxShadow: 'none', 
                  padding: '16px',
                  marginBottom: '12px',
                  transition: 'border-color 0.2s ease'
                };

                const labelStyle = { color: '#b5b5b5', fontSize: '0.75rem', marginBottom: '4px' };
                const valueStyle = { 
                  color: isSelected ? '#4f46e5' : '#363636', 
                  fontWeight: '700' as const, 
                  fontSize: '1rem',
                  marginBottom: '0'
                };

                return (
                  <div 
                    key={idx} 
                    className="is-flex is-justify-content-space-between is-align-items-center"
                    onClick={() => setSelectedIdx(idx)}
                    style={cardStyle}
                  >
                    <div>
                      <p style={labelStyle}>Tipo de veículo</p>
                      <p style={valueStyle}>{vehicle.tipo}</p>
                    </div>

                    <div className="has-text-right">
                      <p style={labelStyle}>Capacidade</p>
                      <p style={valueStyle}>{vehicle.capacidade}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="has-text-centered p-5 has-text-grey-light">
              <p>Nenhum veículo cadastrado.</p>
            </div>
          )}
        </section>
        
        {/* Rodapé */}
        <footer className="modal-card-foot" style={footerStyle}>
          <button 
            className="button" 
            style={{ 
              ...buttonStyle('#ff5773'), 
              opacity: selectedIdx === null ? 0.5 : 1, 
              cursor: selectedIdx === null ? 'not-allowed' : 'pointer' 
            }}
            onClick={handleRemoveClick}
            disabled={selectedIdx === null}
          >
            <span className="icon is-small mr-1"><MdDelete /></span>
            <span>Remover</span>
          </button>

          <button 
            className="button ml-3" 
            style={buttonStyle('#4dcbf7')}
            onClick={onAddVehicle}
          >
            <span className="icon is-small mr-1"><MdAdd /></span>
            <span>Adicionar</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TransportadoraVehiclesModal;