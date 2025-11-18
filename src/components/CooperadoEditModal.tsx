// src/components/CooperadoEditModal.tsx

import React, { useState, useEffect } from 'react';
import type { CooperadoItem } from '../services/api';
import useTheme from '../hooks/useTheme';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: (item: CooperadoItem) => void;
  data: CooperadoItem | null;
}

const CooperadoEditModal: React.FC<Props> = ({ isActive, onClose, onSave, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  // Estados para cada campo
  const [matricula, setMatricula] = useState<number | string>('');
  const [filial, setFilial] = useState('');
  const [motorista, setMotorista] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('');
  const [placa, setPlaca] = useState('');
  const [certificado, setCertificado] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [doamDejetos, setDoamDejetos] = useState<'Sim' | 'Não'>('Sim');
  const [fase, setFase] = useState('');

  // Carregar dados quando o modal abre
  useEffect(() => {
    if (data) {
      setMatricula(data.matricula);
      setFilial(data.filial);
      setMotorista(data.motorista);
      setTipoVeiculo(data.tipoVeiculo);
      setPlaca(data.placa);
      setCertificado(data.certificado);
      setDoamDejetos(data.doamDejetos);
      setFase(data.fase);
    }
  }, [data, isActive]);

  if (!data) return null;

  const handleSubmit = () => {
    const updatedItem: CooperadoItem = {
      ...data,
      matricula: Number(matricula),
      filial,
      motorista,
      tipoVeiculo,
      placa,
      certificado,
      doamDejetos,
      fase,
    };
    onSave(updatedItem);
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '700px', width: '100%' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>
            Editar Cooperado
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body">
          <div className="columns is-multiline">
            
            {/* Linha 1 */}
            <div className="column is-half">
              <div className="field">
                <label className="label">Matrícula</label>
                <div className="control">
                  <input className="input" type="number" value={matricula} onChange={e => setMatricula(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label">Filial</label>
                <div className="control">
                  <input className="input" type="text" value={filial} onChange={e => setFilial(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Linha 2 */}
            <div className="column is-half">
              <div className="field">
                <label className="label">Motorista</label>
                <div className="control">
                  <input className="input" type="text" value={motorista} onChange={e => setMotorista(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label">Tipo de Veículo</label>
                <div className="control">
                  <input className="input" type="text" value={tipoVeiculo} onChange={e => setTipoVeiculo(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Linha 3 */}
            <div className="column is-half">
              <div className="field">
                <label className="label">Placa</label>
                <div className="control">
                  <input className="input" type="text" value={placa} onChange={e => setPlaca(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label">Fase</label>
                <div className="control">
                  <input className="input" type="text" value={fase} onChange={e => setFase(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Linha 4 - Selects */}
            <div className="column is-half">
              <div className="field">
                <label className="label">Certificado</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={certificado} onChange={e => setCertificado(e.target.value as any)}>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label">Doam Dejetos</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={doamDejetos} onChange={e => setDoamDejetos(e.target.value as any)}>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button className="button" onClick={onClose}>Cancelar</button>
          <button className="button is-success" onClick={handleSubmit}>Salvar Alterações</button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoEditModal;