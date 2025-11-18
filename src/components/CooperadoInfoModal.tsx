// src/components/CooperadoInfoModal.tsx
import React from 'react';
import type { CooperadoItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { MdVerified, MdCheck, MdMap } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  data: CooperadoItem | null;
  onOpenMap: (item: CooperadoItem) => void;
}

const mockInfo = {
  cpfCnpj: "069.037.349-02",
  cabecas: "123456",
  tecnico: "Daniel",
  telefone: "(45) 3376-1170",
  propriedade: "41277001602",
  estabelecimento: "4100592839",
  municipio: "Toledo",
  lat: "-24,7229319",
  lng: "-53,8641137"
};

const InfoField: React.FC<{ label: string; value: React.ReactNode; textColor: string }> = ({ label, value, textColor }) => (
  <div className="column is-half pb-1">
    <p className="help is-uppercase has-text-grey-light mb-0" style={{ fontSize: '0.75rem' }}>{label}</p>
    <p className="subtitle is-6 has-text-weight-bold mt-0" style={{ color: textColor }}>{value}</p>
  </div>
);

const CooperadoInfoModal: React.FC<Props> = ({ isActive, onClose, data, onOpenMap }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  if (!data) return null;

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '700px', width: '100%' }}>
        <header className="modal-card-head" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>Informações</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="columns is-multiline is-variable is-4">
            <InfoField label="Matrícula" value={data.matricula} textColor={textColor} />
            <InfoField label="Filiada" value={data.filial} textColor={textColor} />
            <InfoField label="Tipo de veículo" value={data.tipoVeiculo} textColor={textColor} />
            <InfoField label="Motorista" value={data.motorista} textColor={textColor} />
            <InfoField label="CPF/CNPJ" value={mockInfo.cpfCnpj} textColor={textColor} />
            <InfoField label="Placa" value={data.placa} textColor={textColor} />
            <InfoField label="Certificado" textColor={textColor} value={<span className="icon-text has-text-success"><span className="icon"><MdVerified /></span><span>{data.certificado}</span></span>} />
            <InfoField label="Doam dejetos" textColor={textColor} value={<span className="icon-text has-text-success"><span className="icon"><MdCheck /></span><span>{data.doamDejetos}</span></span>} />
            <InfoField label="Fase do dejetos" value={data.fase} textColor={textColor} />
            <InfoField label="Cabeças alojadas" value={mockInfo.cabecas} textColor={textColor} />
            <InfoField label="Técnico" value={mockInfo.tecnico} textColor={textColor} />
            <InfoField label="Telefone" value={mockInfo.telefone} textColor={textColor} />
            <InfoField label="Nº da propriedade" value={mockInfo.propriedade} textColor={textColor} />
            <InfoField label="Nº de estabelecimento" value={mockInfo.estabelecimento} textColor={textColor} />
            <InfoField label="Município" value={mockInfo.municipio} textColor={textColor} />
            <div className="column is-half"></div>
            <InfoField label="Latitude" value={mockInfo.lat} textColor={textColor} />
            <InfoField label="Longitude" value={mockInfo.lng} textColor={textColor} />
            <div className="column is-full pt-2">
              <p className="help is-uppercase has-text-grey-light mb-1" style={{ fontSize: '0.75rem' }}>Localização</p>
              <a className="button is-small is-link is-light" onClick={() => onOpenMap(data)}><span className="icon"><MdMap /></span><span>Ver mapa</span></a>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button className="button" onClick={onClose}>Fechar</button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoInfoModal;