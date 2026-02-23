// src/components/CooperadoEditModal.tsx

import React, { useState, useEffect } from 'react';
import type { CooperadoItem } from '../types/models';
import useTheme from '../hooks/useTheme';
import { MdSave } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: (item: CooperadoItem) => void;
  data: CooperadoItem | null;
}

const CooperadoEditModal: React.FC<Props> = ({ isActive, onClose, onSave, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  // Estados
  const [matricula, setMatricula] = useState<number | string>('');
  const [produtor, setProdutor] = useState('');
  const [filiada, setFiliada] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [fase, setFase] = useState('');
  const [cabecas, setCabecas] = useState<string | number>('');
  const [certificado, setCertificado] = useState('');
  const [doamDejetos, setDoamDejetos] = useState('');
  
  const [responsavel, setResponsavel] = useState('');
  const [telResponsavel, setTelResponsavel] = useState('');
  const [emailResponsavel, setEmailResponsavel] = useState('');
  
  const [tecnico, setTecnico] = useState('');
  const [telTecnico, setTelTecnico] = useState('');
  const [emailTecnico, setEmailTecnico] = useState('');

  const [numPropriedade, setNumPropriedade] = useState('');
  const [numEstabelecimento, setNumEstabelecimento] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [distancia, setDistancia] = useState('');

  // --- CARREGAR DADOS ---
  useEffect(() => {
    if (data) {
      // Dados principais
      setMatricula(data.matricula);
      setProdutor(data.motorista);
      setFiliada(data.filial);
      setCpfCnpj(data.cpfCnpj || '');
      setFase(data.fase);
      setCabecas(data.cabecasAlojadas || '');
      setCertificado(data.certificado);
      setDoamDejetos(data.doamDejetos);
      
      // Dados de Contato (com fallbacks inteligentes)
      setResponsavel(data.responsavel || data.motorista); 
      setTelResponsavel(data.telefone || '');
      setEmailResponsavel(data.emailResponsavel || '');
      
      setTecnico(data.tecnico || '');
      setTelTecnico(data.telefoneTecnico || '');
      setEmailTecnico(data.emailTecnico || '');
      
      // Dados de Propriedade
      setNumPropriedade(data.numPropriedade || '');
      setNumEstabelecimento(data.numEstabelecimento || '');
      setMunicipio(data.municipio || '');
      setLatitude(data.latitude || '');
      setLongitude(data.longitude || '');
      setDistancia(data.distancia || '');
    }
  }, [data, isActive]);

  if (!data) return null;

  const handleSubmit = () => {
    // Converter distancia para decimal (caso exista)
    let distanciaKm: number | undefined = undefined;
    if (distancia && !isNaN(Number(distancia))) {
      distanciaKm = parseFloat(String(distancia).replace(',', '.'));
    }

    // Montar payload para API (CooperadoAPIInput)
    const payload: any = {
      ...data,
      matricula: Number(matricula),
      nomeCooperado: produtor,
      cpfCnpj,
      fase,
      cabecas: Number(cabecas) || 0,
      certificado,
      doamDejetos,
      responsavel,
      tecnico,
      numPropriedade,
      numEstabelecimento,
      municipio,
      latitude: latitude ? parseFloat(String(latitude).replace(',', '.')) : undefined,
      longitude: longitude ? parseFloat(String(longitude).replace(',', '.')) : undefined,
      distanciaKm,
      // Adicione outros campos obrigatórios conforme necessário
    };
    onSave(payload);
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '800px', width: '100%' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', backgroundColor: '#fff', padding: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <p className="modal-card-title has-text-weight-bold mb-1" style={{ color: textColor }}>Editar informações</p>
            <p className="is-size-7 has-text-grey">PRODUTOR: <strong>{data.motorista.toUpperCase()}</strong></p>
          </div>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '2rem' }}>
          {/* 1. CADASTRAIS */}
          <div className="columns is-multiline">
            <div className="column is-half"><div className="field"><label className="label is-small">Matrícula</label><div className="control"><input className="input" type="number" value={matricula} onChange={e => setMatricula(e.target.value)} /></div></div></div>
            <div className="column is-half"><div className="field"><label className="label is-small">Nome do produtor</label><div className="control"><input className="input" type="text" value={produtor} onChange={e => setProdutor(e.target.value)} /></div></div></div>
            <div className="column is-half"><div className="field"><label className="label is-small">Filiada</label><div className="control"><div className="select is-fullwidth"><select value={filiada} onChange={e => setFiliada(e.target.value)}><option value="Primato">Primato</option><option value="Agrocampo">Agrocampo</option></select></div></div></div></div>
            <div className="column is-half"><div className="field"><label className="label is-small">CPF/CNPJ</label><div className="control"><input className="input" type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} /></div></div></div>
            <div className="column is-half"><div className="field"><label className="label is-small">Fase do dejetos</label><div className="control"><div className="select is-fullwidth"><select value={fase} onChange={e => setFase(e.target.value)}><option value="Term. Frimesa">Term. Frimesa</option><option value="GRSC">GRSC</option><option value="Crechário">Crechário</option><option value="UPD">UPD</option></select></div></div></div></div>
            <div className="column is-half"><div className="field"><label className="label is-small">Cabeças alojadas</label><div className="control"><input className="input" type="text" value={cabecas} onChange={e => setCabecas(e.target.value)} /></div></div></div>
            <div className="column is-half"><div className="field"><label className="label is-small">Certificado</label><div className="control"><div className="select is-fullwidth"><select value={certificado} onChange={e => setCertificado(e.target.value)}><option value="Ativo">Ativo</option><option value="Inativo">Inativo</option></select></div></div></div></div>
            <div className="column is-half"><div className="field"><label className="label is-small">Doam dejetos</label><div className="control"><div className="select is-fullwidth"><select value={doamDejetos} onChange={e => setDoamDejetos(e.target.value)}><option value="Sim">Sim</option><option value="Não">Não</option></select></div></div></div></div>
          </div>

          <hr className="divider my-5" />

          {/* 2. CONTATO */}
          <h5 className="title is-6 has-text-weight-bold mb-4" style={{ color: textColor }}>Informações de contato</h5>
          <div className="columns is-multiline">
            <div className="column is-half">
                <div className="field mb-3"><label className="label is-small">Responsável pela propriedade</label><div className="control"><input className="input mb-2" type="text" value={responsavel} onChange={e => setResponsavel(e.target.value)} /></div><div className="control"><input className="input mb-2" type="text" value={telResponsavel} onChange={e => setTelResponsavel(e.target.value)} /></div><div className="control"><input className="input" type="email" value={emailResponsavel} onChange={e => setEmailResponsavel(e.target.value)} /></div></div>
            </div>
            <div className="column is-half">
                <div className="field mb-3"><label className="label is-small">Técnico responsável</label><div className="control"><input className="input mb-2" type="text" value={tecnico} onChange={e => setTecnico(e.target.value)} /></div><div className="control"><input className="input mb-2" type="text" value={telTecnico} onChange={e => setTelTecnico(e.target.value)} /></div><div className="control"><input className="input" type="email" value={emailTecnico} onChange={e => setEmailTecnico(e.target.value)} /></div></div>
            </div>
          </div>

          <hr className="divider my-5" />

          {/* 3. PROPRIEDADE */}
          <h5 className="title is-6 has-text-weight-bold mb-4" style={{ color: textColor }}>Informações da propriedade</h5>
          <div className="columns is-multiline">
             <div className="column is-half"><div className="field"><label className="label is-small">Nº da propriedade</label><div className="control"><input className="input" type="text" value={numPropriedade} onChange={e => setNumPropriedade(e.target.value)} /></div></div></div>
             <div className="column is-half"><div className="field"><label className="label is-small">Nº de estabelecimento</label><div className="control"><input className="input" type="text" value={numEstabelecimento} onChange={e => setNumEstabelecimento(e.target.value)} /></div></div></div>
             <div className="column is-half"><div className="field"><label className="label is-small">Município</label><div className="control"><input className="input" type="text" value={municipio} onChange={e => setMunicipio(e.target.value)} /></div></div></div>
             <div className="column is-half"><div className="field"><label className="label is-small">Distância (Km)</label><div className="control"><input className="input" type="text" value={distancia} onChange={e => setDistancia(e.target.value)} /></div></div></div>
             <div className="column is-half"><div className="field"><label className="label is-small">Latitude</label><div className="control"><input className="input" type="text" value={latitude} onChange={e => setLatitude(e.target.value)} /></div></div></div>
             <div className="column is-half"><div className="field"><label className="label is-small">Longitude</label><div className="control"><input className="input" type="text" value={longitude} onChange={e => setLongitude(e.target.value)} /></div></div></div>
          </div>
        </section>

        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', gap: '10px', padding: '1.5rem' }}>
          <button className="button" onClick={onClose}>Cancelar</button>
          <button className="button is-success" onClick={handleSubmit}><span className="icon is-small"><MdSave /></span><span>Salvar</span></button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoEditModal;