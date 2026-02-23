// src/components/CooperadoInfoModal.tsx

import React from 'react';
import type { CooperadoItem } from '../services/api'; // ou '../types/models' dependendo da sua estrutura
import useTheme from '../hooks/useTheme';
import { MdVerified, MdCheck, MdPerson, MdPhone, MdEmail } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  data: CooperadoItem | null;
  onOpenMap?: (item: CooperadoItem) => void;
}

// Função de cálculo de distância (Haversine) - MESMA DA LISTA
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

// Ponto base (Toledo-PR) - MESMO DA LISTA
const BASE_LAT = -24.725036; 
const BASE_LNG = -53.742277;

const InfoField: React.FC<{ label: string; value: React.ReactNode; textColor: string }> = ({ label, value, textColor }) => (
  <div className="column is-half pb-1">
    <p className="help is-uppercase has-text-grey-light mb-0" style={{ fontSize: '0.75rem' }}>{label}</p>
    <p className="subtitle is-6 has-text-weight-bold mt-0" style={{ color: textColor }}>{value}</p>
  </div>
);

const ContactBlock: React.FC<{ title: string; name: string; phone: string; email: string; textColor: string }> = ({ title, name, phone, email, textColor }) => (
  <div className="mb-4">
    <p className="is-size-7 has-text-grey has-text-weight-bold is-uppercase mb-2">{title}</p>
    <div className="pl-2" style={{ borderLeft: '3px solid #f5f5f5' }}>
        <div className="is-flex is-align-items-center mb-1">
            <span className="icon is-small has-text-grey-light mr-2"><MdPerson /></span>
            <span className="has-text-weight-medium" style={{ color: textColor }}>{name}</span>
        </div>
        <div className="is-flex is-align-items-center mb-1">
            <span className="icon is-small has-text-grey-light mr-2"><MdPhone /></span>
            <span className="is-size-7" style={{ color: textColor }}>{phone}</span>
        </div>
        <div className="is-flex is-align-items-center">
            <span className="icon is-small has-text-grey-light mr-2"><MdEmail /></span>
            <span className="is-size-7" style={{ color: textColor }}>{email}</span>
        </div>
    </div>
  </div>
);

const CooperadoInfoModal: React.FC<Props> = ({ isActive, onClose, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  if (!data) return null;

  // Dados mockados complementares
  const mockInfo = {
    cpfCnpj: data.cpfCnpj || "000.000.000-00",
    tecnico: data.tecnico || "Daniel",
    telefone: data.telefone || "(45) 3376-1170",
    propriedade: data.numPropriedade || "41277001602",
    estabelecimento: data.numEstabelecimento || "4100592839",
    municipio: data.municipio || "Toledo",
  };

  // --- LÓGICA DE CÁLCULO IDÊNTICA À DA LISTA ---
  let displayDistance = '-';
  // Preferir distanciaKm se presente
  if (typeof (data as any).distanciaKm === 'number') {
    displayDistance = `${(data as any).distanciaKm.toFixed(2)} km`;
  } else if (data.distancia && data.distancia.trim() !== '') {
    displayDistance = data.distancia;
  } else if (data.latitude && data.longitude) {
    const lat = parseFloat(String(data.latitude).replace(',', '.'));
    const lng = parseFloat(String(data.longitude).replace(',', '.'));
    if (!isNaN(lat) && !isNaN(lng)) {
      displayDistance = calculateDistance(BASE_LAT, BASE_LNG, lat, lng);
    }
  }

  // ----------------------------------------------

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '700px', width: '100%', borderRadius: '8px' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ flex: 1 }}>
            <p className="modal-card-title has-text-weight-bold mb-1" style={{ color: textColor }}>
                Informações cadastrais
            </p>
            <p className="is-size-7 has-text-grey">
                PRODUTOR: <strong style={{ color: '#374151' }}>{data.motorista.toUpperCase()}</strong>
            </p>
          </div>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '1.5rem' }}>
          
          <div className="columns is-multiline is-variable is-4 mb-2">
            <InfoField label="Matrícula" value={data.matricula} textColor={textColor} />
            <InfoField label="Nome do produtor" value={data.motorista} textColor={textColor} />
            
            <InfoField label="Filiada" value={data.filial} textColor={textColor} />
            <InfoField label="CPF/CNPJ" value={mockInfo.cpfCnpj} textColor={textColor} />
            
            <InfoField label="Fase do dejeto" value={data.fase} textColor={textColor} />
            <InfoField label="Cabeças alojadas" value={data.cabecasAlojadas || '-'} textColor={textColor} />
            
            <InfoField label="Certificado" textColor={textColor} value={
              <span className="icon-text has-text-success">
                <span className="icon"><MdVerified /></span>
                <span>{data.certificado}</span>
              </span>
            } />
            <InfoField label="Doam dejetos" textColor={textColor} value={
              <span className="icon-text has-text-success">
                <span className="icon"><MdCheck /></span>
                <span>{data.doamDejetos}</span>
              </span>
            } />
          </div>

          <hr style={{ margin: '1rem 0', backgroundColor: '#ededed', height: '1px' }} />

          <h6 className="title is-6 mb-4" style={{ color: textColor }}>Informações de contato</h6>
          
          <div className="columns">
              <div className="column is-half">
                <ContactBlock 
                    title="Responsável pela propriedade"
                    name={data.motorista}
                    phone={mockInfo.telefone}
                    email="email@cooperado.com.br"
                    textColor={textColor}
                />
              </div>
              <div className="column is-half">
                <ContactBlock 
                    title="Técnico responsável"
                    name={mockInfo.tecnico}
                    phone="(45) 3376-1170"
                    email="tecnico@exemplo.com.br"
                    textColor={textColor}
                />
              </div>
          </div>

          <hr style={{ margin: '1rem 0', backgroundColor: '#ededed', height: '1px' }} />

          <div className="columns is-multiline is-variable is-4">
             <InfoField label="Nº da propriedade" value={mockInfo.propriedade} textColor={textColor} />
             <InfoField label="Nº de estabelecimento" value={mockInfo.estabelecimento} textColor={textColor} />
             
             <InfoField label="Município" value={mockInfo.municipio} textColor={textColor} />
             <div className="column is-half"></div>

             <InfoField label="Latitude" value={data.latitude || '-'} textColor={textColor} />
             <InfoField label="Longitude" value={data.longitude || '-'} textColor={textColor} />

             {/* EXIBINDO A QUILOMETRAGEM CALCULADA */}
             <div className="column is-full mt-2">
                <p className="help is-uppercase has-text-grey-light mb-0" style={{ fontSize: '0.75rem' }}>Quilometragem</p>
                <p className="subtitle is-5 has-text-weight-bold mt-1 has-text-link">
                    {displayDistance}
                </p>
             </div>
          </div>

        </section>

        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', padding: '1rem 1.5rem' }}>
          <button className="button" onClick={onClose}>Fechar</button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoInfoModal;