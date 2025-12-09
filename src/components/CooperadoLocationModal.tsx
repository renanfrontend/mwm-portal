// src/components/CooperadoLocationModal.tsx

import React from 'react';
import { MapPin, Circle, Car, Navigation } from 'lucide-react';
import type { CooperadoItem } from '../services/api';
import useTheme from '../hooks/useTheme';

interface Props {
  isActive: boolean;
  onClose: () => void;
  data: CooperadoItem | null;
}

// Ponto de partida fixo (Ex: Sede da Empresa)
const ORIGIN_ADDRESS = "Concórdia do Oeste, Toledo - PR";

const CooperadoLocationModal: React.FC<Props> = ({ isActive, onClose, data }) => {
  useTheme();
  const inputBg = '#f3f4f6'; 

  if (!data) return null;

  // Lógica para determinar o destino: Coordenadas (se houver) ou Endereço Mockado
  let destination = "Bioplanta MWM - Toledo, 642W+64, Ouro Verde do Oeste - PR"; // Fallback
  let displayDistance = data.distancia || "13,6 km"; // Fallback ou dado real

  if (data.latitude && data.longitude) {
    // Se tiver coordenadas, o destino será as coordenadas
    destination = `${data.latitude},${data.longitude}`;
    
    // Se quiser exibir as coordenadas no input visualmente:
    // destinationDisplay = `${data.latitude}, ${data.longitude}`; 
  }

  // Codifica para URL
  const originEncoded = encodeURIComponent(ORIGIN_ADDRESS);
  const destEncoded = encodeURIComponent(destination);
  
  // URL do Embed do Google Maps (Modo Directions)
  // saddr = Start Address, daddr = Destination Address
  const mapUrl = `https://maps.google.com/maps?saddr=${originEncoded}&daddr=${destEncoded}&output=embed`;

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      
      <div className="modal-card" style={{ maxWidth: '700px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        
        <header 
          className="modal-card-head" 
          style={{ 
              borderBottom: '1px solid #e5e7eb', 
              backgroundColor: 'white',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
          }}
        >
          <div>
            <p className="modal-card-title mb-1" style={{ color: '#1f2937', fontWeight: 700, fontSize: '1.25rem' }}>
              Localização
            </p>
            <p className="is-size-7 has-text-grey">
              Produtor: <strong style={{ color: '#374151' }}>{data.motorista}</strong>
            </p>
          </div>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section 
          className="modal-card-body" 
          style={{ padding: 0, backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}
        >
          
          {/* 1. Inputs de Origem/Destino */}
          <div style={{ padding: '16px 24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8px', width: '24px' }}>
                <Circle size={14} color="#9ca3af" fill="transparent" strokeWidth={3} />
                <div style={{ flex: 1, width: '0px', borderLeft: '2px dotted #d1d5db', margin: '4px 0', minHeight: '24px' }}></div>
                <MapPin size={20} color="#ef4444" fill="#ef4444" />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: inputBg, padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>Ponto de Partida</div>
                  <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: 500 }}>{ORIGIN_ADDRESS}</div>
                </div>

                <div style={{ background: inputBg, padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>Destino</div>
                  <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {destination}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Barra Verde (Info de Rota) */}
          <div style={{ 
            backgroundColor: '#f0fdf4',
            borderTop: '1px solid #dcfce7',
            borderBottom: '1px solid #dcfce7',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#16a34a', padding: '8px', borderRadius: '50%', color: 'white', display: 'flex' }}>
                <Car size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#166534' }}>~18 min</span>
                  <span style={{ fontSize: '14px', color: '#15803d' }}>({displayDistance})</span>
                </div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>
                   Trânsito normal
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#15803d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <Navigation size={14} />
              Ver detalhes
            </div>
          </div>

          {/* 3. Mapa */}
          <div style={{ height: '350px', width: '100%', position: 'relative' }}>
            <iframe
              title="Mapa de Rota"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              allowFullScreen
              src={mapUrl}
            ></iframe>
          </div>

        </section>

        <footer 
          className="modal-card-foot" 
          style={{ 
            borderTop: '1px solid #e5e7eb', 
            justifyContent: 'flex-end',
            backgroundColor: 'white',
            padding: '1rem 1.5rem'
          }}
        >
          <button className="button" onClick={onClose}>Fechar</button>
          <button 
            className="button is-info" 
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${originEncoded}&destination=${destEncoded}`, '_blank')}
          >
              <Navigation size={16} />
              <span>Abrir no Maps</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoLocationModal;