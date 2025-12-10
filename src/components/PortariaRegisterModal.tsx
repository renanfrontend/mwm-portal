// src/components/PortariaRegisterModal.tsx
import React, { useState } from 'react';
import { type PortariaItem } from '../types/models';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: (newItem: PortariaItem) => void;
}

const PortariaRegisterModal: React.FC<Props> = ({ isActive, onClose, onSave }) => {
  const [data, setData] = useState('2025-01-01');
  const [hora, setHora] = useState('09:00');
  const [atividade, setAtividade] = useState('');
  const [cooperado, setCooperado] = useState('');
  const [transportadora, setTransportadora] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('');
  const [placa, setPlaca] = useState('');
  const [motorista, setMotorista] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');

  const handleSave = () => {
    if (!cooperado || !motorista || !placa) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    const newItem: PortariaItem = {
      id: Math.random().toString(36).substring(2, 9),
      categoria: 'Entregas',
      data,
      horario: hora,
      atividade,
      empresa: cooperado,
      transportadora,
      tipoVeiculo,
      placa,
      motorista,
      cpf_cnpj: cpfCnpj,
      status: 'Em andamento'
    };

    onSave(newItem);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={handleClose}></div>
      <div className="modal-card" style={{ maxWidth: '800px', width: '100%' }}>
        <header className="modal-card-head has-background-white" style={{ borderBottom: 'none' }}>
          <p className="modal-card-title has-text-weight-bold">Registrar entrada</p>
          <button className="delete" aria-label="close" onClick={handleClose}></button>
        </header>
        
        <section className="modal-card-body">
          <div className="columns is-multiline">
            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Data</label></div>
            <div className="column is-12 pt-1"><input className="input" type="date" value={data} onChange={e => setData(e.target.value)} /></div>
            
            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Hora</label></div>
            <div className="column is-12 pt-1"><input className="input" type="time" value={hora} onChange={e => setHora(e.target.value)} /></div>

            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Atividade a realizar</label></div>
            <div className="column is-12 pt-1">
              <div className="select is-fullwidth">
                <select value={atividade} onChange={e => setAtividade(e.target.value)}>
                  <option value="" disabled>Selecionar</option>
                  <option value="Abastecimento">Abastecimento</option>
                  <option value="Coleta de materiais">Coleta de materiais</option>
                  <option value="Entrega de dejetos">Entrega de dejetos</option>
                  <option value="Entrega de materiais">Entrega de materiais</option>
                </select>
              </div>
            </div>

            <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Logística</h5></div>

            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Cooperado</label></div>
            <div className="column is-12 pt-1">
              <div className="select is-fullwidth">
                <select value={cooperado} onChange={e => setCooperado(e.target.value)}>
                  <option value="" disabled>Selecionar</option>
                  <option value="Primato">Primato</option>
                  <option value="Agrocampo">Agrocampo</option>
                  <option value="MWM">MWM</option>
                  <option value="Tupy">Tupy</option>
                  <option value="Renato Ivan Kunzler">Renato Ivan Kunzler</option>
                </select>
              </div>
            </div>

            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Transportadora</label></div>
            <div className="column is-12 pt-1"><input className="input" type="text" placeholder="Nome da transportadora" value={transportadora} onChange={e => setTransportadora(e.target.value)} /></div>

            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Tipo de veículo</label></div>
            <div className="column is-12 pt-1">
              <div className="select is-fullwidth">
                <select value={tipoVeiculo} onChange={e => setTipoVeiculo(e.target.value)}>
                  <option value="" disabled>Selecionar</option>
                  <option value="Caminhão de dejeto">Caminhão de dejeto</option>
                  <option value="Caminhão de insumos">Caminhão de insumos</option>
                  <option value="Caminhão de expedição">Caminhão de expedição</option>
                  <option value="Caminhão de Industrialização">Caminhão de Industrialização</option>
                </select>
              </div>
            </div>

            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Placa</label></div>
            <div className="column is-12 pt-1"><input className="input" type="text" placeholder="ABC-1D23" value={placa} onChange={e => setPlaca(e.target.value)} /></div>

            <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Informações</h5></div>

            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Motorista</label></div>
            <div className="column is-12 pt-1"><input className="input" type="text" placeholder="Nome do motorista" value={motorista} onChange={e => setMotorista(e.target.value)} /></div>

            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">CPF/CNPJ</label></div>
            <div className="column is-12 pt-1"><input className="input" type="text" placeholder="000.000.000-00" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} /></div>
          </div>
        </section>

        <footer className="modal-card-foot has-background-white is-justify-content-flex-end" style={{ borderTop: 'none' }}>
          <button className="button" onClick={handleClose}>Cancelar</button>
          <button 
            className="button has-text-white border-0" 
            style={{ backgroundColor: '#10b981' }}
            onClick={handleSave}
          >
            Salvar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PortariaRegisterModal;