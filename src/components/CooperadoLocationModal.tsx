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

// DADOS MOCKADOS (Cópia fiel do Print)
const routeInfo = {
  origin: "Concórdia do Oeste, Toledo - PR",
  destination: "Bioplanta MWM - Toledo, 642W+64, Ouro Verde do Oeste - PR",
  duration: "18 min",
  distance: "13,6 km",
  via: "via PR-317"
};

const CooperadoLocationModal: React.FC<Props> = ({ isActive, onClose, data }) => {
  useTheme();
  
  const inputBg = '#f3f4f6'; 

  // --- MUDANÇA AQUI: URL para Traçar a Rota ---
  // Usamos 'saddr' (Start Address) e 'daddr' (Destination Address)
  // encodeURIComponent garante que espaços e acentos não quebrem o link
  const originEncoded = encodeURIComponent(routeInfo.origin);
  const destEncoded = encodeURIComponent(routeInfo.destination);
  
  // URL "mágica" para embed de rotas sem API Key complexa
  const mapUrl = `https://maps.google.com/maps?saddr=${originEncoded}&daddr=${destEncoded}&output=embed`;

  if (!data) return null;

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      
      <div className="modal-card" style={{ maxWidth: '700px', width: '100%' }}>
        
        {/* --- HEADER --- */}
        <header 
          className="modal-card-head" 
          style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}
        >
          <p className="modal-card-title" style={{ color: '#1f2937', fontWeight: 600 }}>
            Localização
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        {/* --- BODY --- */}
        <section 
          className="modal-card-body" 
          style={{ padding: 0, backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}
        >
          
          {/* 1. Inputs de Origem/Destino */}
          <div style={{ padding: '16px 24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              
              {/* Ícones Conectados */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8px', width: '24px' }}>
                <Circle size={14} color="#9ca3af" fill="transparent" strokeWidth={3} />
                <div style={{ flex: 1, width: '0px', borderLeft: '2px dotted #d1d5db', margin: '4px 0', minHeight: '24px' }}></div>
                <MapPin size={20} color="#ef4444" fill="#ef4444" />
              </div>

              {/* Textos */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: inputBg, padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>Ponto de Partida</div>
                  <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: 500 }}>{routeInfo.origin}</div>
                </div>

                <div style={{ background: inputBg, padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>Destino</div>
                  <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {routeInfo.destination}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Barra Verde */}
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
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#166534' }}>{routeInfo.duration}</span>
                  <span style={{ fontSize: '14px', color: '#15803d' }}>({routeInfo.distance})</span>
                </div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>
                  {routeInfo.via} • Trânsito normal
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#15803d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <Navigation size={14} />
              Ver detalhes
            </div>
          </div>

          {/* 3. Mapa com Rota */}
          <div style={{ height: '350px', width: '100%', position: 'relative' }}>
            <iframe
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
            backgroundColor: 'white'
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