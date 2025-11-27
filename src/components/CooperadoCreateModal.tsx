// src/components/CooperadoCreateModal.tsx

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { CooperadoItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { MdMap } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: (item: CooperadoItem) => void;
}

const CooperadoCreateModal: React.FC<Props> = ({ isActive, onClose, onSave }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  // --- ESTADOS DO FORMULÁRIO ---
  const [matricula, setMatricula] = useState('');
  const [transportadora, setTransportadora] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('');
  const [motorista, setMotorista] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [placa, setPlaca] = useState('');
  const [certificado, setCertificado] = useState('Ativo');
  const [doamDejetos, setDoamDejetos] = useState('Sim');
  const [fase, setFase] = useState('');
  const [cabecas, setCabecas] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [telefone, setTelefone] = useState('');
  const [numPropriedade, setNumPropriedade] = useState('');
  const [numEstabelecimento, setNumEstabelecimento] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSave = () => {
    // Criação do objeto
    const newItem: CooperadoItem = {
      id: uuidv4(),
      matricula: Number(matricula),
      filial: transportadora, // Mapeando Transportadora para o campo filial
      motorista,
      tipoVeiculo,
      placa,
      certificado: certificado as "Ativo" | "Inativo",
      doamDejetos: doamDejetos as "Sim" | "Não",
      fase,
      // Campos opcionais novos
      cpfCnpj,
      cabecasAlojadas: cabecas,
      tecnico,
      telefone,
      numPropriedade,
      numEstabelecimento,
      municipio,
      latitude,
      longitude
    };
    
    onSave(newItem);
    handleClose(); // Limpa e fecha
  };

  const handleClose = () => {
    // Limpar campos se desejar
    setMatricula(''); setTransportadora(''); setMotorista('');
    onClose();
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={handleClose}></div>
      <div className="modal-card" style={{ maxWidth: '800px', width: '100%' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>
            Adicionar Cooperado
          </p>
          <button className="delete" aria-label="close" onClick={handleClose}></button>
        </header>

        <section className="modal-card-body">
          <div className="columns is-multiline">
            
            {/* Linha 1: Matrícula e Transportadora */}
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Matrícula</label>
                <div className="control">
                  <input className="input" type="number" value={matricula} onChange={e => setMatricula(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Transportadora</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={transportadora} onChange={e => setTransportadora(e.target.value)}>
                      <option value="">Selecione</option>
                      <option value="Primato">Primato</option>
                      <option value="Agrocampo">Agrocampo</option>
                      <option value="MWM">MWM</option>
                      <option value="Tupy">Tupy</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Linha 2: Tipo de Veículo e Motorista */}
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Tipo de veículo</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={tipoVeiculo} onChange={e => setTipoVeiculo(e.target.value)}>
                      <option value="">Selecione</option>
                      <option value="Caminhão de dejetos">Caminhão de dejetos</option>
                      <option value="Caminhão de ração">Caminhão de ração</option>
                      <option value="Empilhadeira">Empilhadeira</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Motorista</label>
                <div className="control">
                  <input className="input" type="text" value={motorista} onChange={e => setMotorista(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Linha 3: CPF e Placa */}
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">CPF/CNPJ</label>
                <div className="control">
                  <input className="input" type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Placa</label>
                <div className="control">
                  <input className="input" type="text" value={placa} onChange={e => setPlaca(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Linha 4: Certificado e Doam Dejetos */}
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Certificado</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={certificado} onChange={e => setCertificado(e.target.value)}>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Doam dejetos</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={doamDejetos} onChange={e => setDoamDejetos(e.target.value)}>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Linha 5: Fase e Cabeças */}
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Fase do dejetos</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={fase} onChange={e => setFase(e.target.value)}>
                      <option value="">Selecione</option>
                      <option value="Term. Frimesa">Term. Frimesa</option>
                      <option value="GRSC">GRSC</option>
                      <option value="Crechário">Crechário</option>
                      <option value="UPD">UPD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Cabeças alojadas</label>
                <div className="control">
                  <input className="input" type="text" value={cabecas} onChange={e => setCabecas(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Linha 6: Técnico e Telefone */}
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Técnico</label>
                <div className="control">
                  <input className="input" type="text" value={tecnico} onChange={e => setTecnico(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Telefone</label>
                <div className="control">
                  <input className="input" type="text" value={telefone} onChange={e => setTelefone(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Linha 7: Nº Propriedade e Estabelecimento */}
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Nº da propriedade</label>
                <div className="control">
                  <input className="input" type="text" value={numPropriedade} onChange={e => setNumPropriedade(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Nº de estabelecimento</label>
                <div className="control">
                  <input className="input" type="text" value={numEstabelecimento} onChange={e => setNumEstabelecimento(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Linha 8: Município */}
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Município</label>
                <div className="control">
                  <input className="input" type="text" value={municipio} onChange={e => setMunicipio(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-half"></div>

            {/* Linha 9: Latitude e Longitude */}
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Latitude</label>
                <div className="control">
                  <input className="input" type="text" value={latitude} onChange={e => setLatitude(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label is-small">Longitude</label>
                <div className="control">
                  <input className="input" type="text" value={longitude} onChange={e => setLongitude(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Linha 10: Botão Ver Mapa */}
            <div className="column is-full">
              <label className="label is-small">Localização</label>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="button is-small is-link is-light"
              >
                <span className="icon"><MdMap /></span>
                <span>Ver mapa</span>
              </a>
            </div>

          </div>
        </section>

        {/* Rodapé com espaçamento (gap) */}
        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid var(--border-color)', gap: '10px' }}>
          <button className="button" onClick={handleClose}>Cancelar</button>
          <button className="button is-success" onClick={handleSave}>Salvar</button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoCreateModal;