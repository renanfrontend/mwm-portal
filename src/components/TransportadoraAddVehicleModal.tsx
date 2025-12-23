import React, { useState, useEffect } from 'react';
import type { VeiculoInfo } from '../types/models';
import useTheme from '../hooks/useTheme';
import { MdSave } from 'react-icons/md';
import { toast } from 'react-toastify';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: (vehicle: VeiculoInfo) => void;
}

const TransportadoraAddVehicleModal: React.FC<Props> = ({ isActive, onClose, onSave }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  const [tipo, setTipo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [placa, setPlaca] = useState('');
  const [tipoAbastecimento, setTipoAbastecimento] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    if (isActive) {
      setTipo(''); setCapacidade(''); setPlaca(''); setTipoAbastecimento(''); setTag('');
    }
  }, [isActive]);

  // Verifica se é Empilhadeira para ajustar o formulário
  const isForklift = tipo === 'Empilhadeira';

  const handleSubmit = () => {
    if (!tipo || !capacidade || !placa || !tipoAbastecimento) {
        toast.warn("Preencha todos os campos obrigatórios.");
        return;
    }

    if (tipoAbastecimento === 'Biometano') {
        if (!tag) return toast.warn("A TAG é obrigatória para Biometano.");
        if (tag.length !== 16) return toast.error(`A TAG deve ter exatamente 16 caracteres.`);
    }

    onSave({ 
        tipo, capacidade, placa, tipoAbastecimento,
        tag: tipoAbastecimento === 'Biometano' ? tag : undefined 
    } as any);
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`} style={{ zIndex: 1001 }}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '500px', width: '100%' }}>
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.5rem', backgroundColor: '#fff' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>Adicionar Veículo</p>
          <button className="delete" onClick={onClose}></button>
        </header>
        <section className="modal-card-body" style={{ padding: '2rem' }}>
          
          <div className="field">
            <label className="label is-small">Tipo de Veículo</label>
            <div className="control">
                <div className="select is-fullwidth is-small">
                    <select value={tipo} onChange={e => setTipo(e.target.value)}>
                        <option value="">Selecionar</option>
                        <option value="Caminhão Truck">Caminhão Truck</option>
                        <option value="Carreta">Carreta</option>
                        <option value="Bitrem">Bitrem</option>
                        <option value="Vuc">Vuc</option>
                        <option value="Utilitário">Utilitário</option>
                        <option value="Empilhadeira">Empilhadeira</option> {/* NOVA OPÇÃO */}
                    </select>
                </div>
            </div>
          </div>

          <div className="field">
            <label className="label is-small">Capacidade</label>
            <div className="control"><input className="input is-small" placeholder="Ex: 15.000" value={capacidade} onChange={e => setCapacidade(e.target.value)} type="number"/></div>
          </div>

          {/* Lógica Dinâmica para Placa / TAG */}
          <div className="field">
            <label className="label is-small">
                {isForklift ? 'Identificação / TAG (Sem Placa)' : 'Placa'}
            </label>
            <div className="control">
                <input 
                    className="input is-small" 
                    placeholder={isForklift ? "Informe ID ou TAG interna" : "ABC-1234"} 
                    value={placa} 
                    onChange={e => setPlaca(e.target.value.toUpperCase())} 
                    maxLength={isForklift ? 20 : 8} // Relaxa validação se for empilhadeira
                />
            </div>
            {isForklift && <p className="help is-info" style={{fontSize: '0.7rem'}}>* Veículo interno: informe a identificação.</p>}
          </div>

          <div className="field">
            <label className="label is-small">Tipo de Abastecimento</label>
            <div className="control"><div className="select is-fullwidth is-small"><select value={tipoAbastecimento} onChange={e => setTipoAbastecimento(e.target.value)}><option value="">Selecionar</option><option value="Diesel">Diesel</option><option value="Biometano">Biometano</option></select></div></div>
          </div>

          {tipoAbastecimento === 'Biometano' && (
            <div className="field animate-fade-in" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '4px', border: '1px solid #bae6fd' }}>
                <label className="label is-size-7 has-text-info">TAG Automação (16 chars)</label>
                <div className="control has-icons-right">
                    <input className={`input is-small ${tag.length === 16 ? 'is-success' : 'is-info'}`} placeholder="Ex: E2000019060C0139" value={tag} onChange={e => setTag(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} maxLength={16} />
                    {tag.length === 16 && <span className="icon is-small is-right has-text-success"><i className="fas fa-check"></i></span>}
                </div>
            </div>
          )}
        </section>
        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', padding: '1.5rem', gap: '10px' }}>
          <button className="button" onClick={onClose}>Cancelar</button>
          <button className="button is-success" onClick={handleSubmit}><span className="icon is-small"><MdSave /></span><span>Salvar</span></button>
        </footer>
      </div>
    </div>
  );
};

export default TransportadoraAddVehicleModal;