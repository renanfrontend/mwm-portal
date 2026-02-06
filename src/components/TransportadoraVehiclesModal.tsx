import React, { useState, useEffect } from 'react';
import { MdAdd, MdDelete, MdDirectionsCar, MdLocalGasStation, MdConfirmationNumber } from 'react-icons/md';
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

  const modalCardStyle = { 
    maxWidth: '700px', 
    width: '100%', 
    borderRadius: '8px', 
    boxShadow: 'none', 
    border: 'none' 
  };

  const headerStyle = { 
    borderBottom: 'none', 
    boxShadow: 'none', 
    padding: '20px 24px 5px 24px', 
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
    padding: '0 24px 20px 24px' 
  };

  const companyNameContainerStyle = {
    paddingTop: '5px',
    paddingBottom: '15px',
    marginBottom: '15px',
    borderBottom: '1px solid #ededed'
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

  const labelStyle = { color: '#b5b5b5', fontSize: '0.7rem', marginBottom: '3px', textTransform: 'uppercase' as const, display: 'flex', alignItems: 'center' };
  const valueStyleMain = (isSelected: boolean) => ({ 
    color: isSelected ? '#4f46e5' : '#363636', 
    fontWeight: '700' as const, 
    fontSize: '1.1rem',
    marginBottom: '0'
  });
  const valueStyleSecondary = (isSelected: boolean) => ({
    color: isSelected ? '#4f46e5' : '#363636', 
    fontWeight: '600' as const,
    fontSize: '0.9rem',
    marginBottom: '0'
  });

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`} style={{ zIndex: 1000 }}>
      <div className="modal-background" onClick={onClose} style={{ backgroundColor: 'rgba(10, 10, 10, 0.5)' }}></div>
      <div className="modal-card" style={modalCardStyle}>
        
        <header className="modal-card-head" style={headerStyle}>
          <p className="modal-card-title" style={titleStyle}>
            Veículos da transportadora
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={bodyStyle}>
          <div style={companyNameContainerStyle}>
             <h6 style={companyNameStyle}>
               {data?.nomeFantasia || 'NOME DA TRANSPORTADORA'}
             </h6>
          </div>

          <div className="content" style={{ maxHeight: '450px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {data?.veiculos && data.veiculos.length > 0 ? (
              data.veiculos.map((vehicle, idx) => {
                const isSelected = selectedIdx === idx;
                const cardStyle = {
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #4f46e5' : '1px solid #ededed',
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  boxShadow: 'none', 
                  padding: '16px',
                  marginBottom: '12px',
                  transition: 'all 0.2s ease'
                };

                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedIdx(idx)}
                    style={cardStyle}
                  >
                    <div className="columns is-mobile is-variable is-1 mb-2">
                      <div className="column is-8 pb-0">
                        <p style={labelStyle}>Tipo de veículo</p>
                        <p style={valueStyleMain(isSelected)}>{vehicle.tipo}</p>
                      </div>
                      <div className="column is-4 has-text-right pb-0">
                        <p style={{...labelStyle, justifyContent: 'flex-end'}}>Capacidade</p>
                        <p style={valueStyleMain(isSelected)}>{vehicle.capacidade}</p>
                      </div>
                    </div>

                    <div className="columns is-mobile is-variable is-1 mb-0 mt-2 pt-2" style={{ borderTop: '1px dashed #f0f0f0' }}>
                      <div className="column is-4 pt-0">
                        <p style={labelStyle}><MdDirectionsCar className="mr-1" size={14}/> Placa</p>
                        <p style={valueStyleSecondary(isSelected)}>{vehicle.placa || '-'}</p>
                      </div>
                      <div className="column is-4 has-text-centered pt-0">
                        <p style={{...labelStyle, justifyContent: 'center'}}><MdLocalGasStation className="mr-1" size={14}/> Combustível</p>
                        <p style={valueStyleSecondary(isSelected)}>{vehicle.tipoAbastecimento || 'Diesel'}</p>
                      </div>
                      <div className="column is-4 has-text-right pt-0">
                        {vehicle.tipoAbastecimento === 'Biometano' ? (
                          <>
                            <p style={{...labelStyle, justifyContent: 'flex-end'}}><MdConfirmationNumber className="mr-1" size={14}/> TAG</p>
                            <p style={valueStyleSecondary(isSelected)}>{vehicle.tag || 'N/A'}</p>
                          </>
                        ) : (
                          <div style={{ height: '100%' }}></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="has-text-centered p-5 has-text-grey-light">
                <p>Nenhum veículo cadastrado.</p>
              </div>
            )}
          </div>
        </section>
        
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