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

  // --- Estados do Formulário ---
  const [tipo, setTipo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [placa, setPlaca] = useState('');
  const [tipoAbastecimento, setTipoAbastecimento] = useState('');
  const [tag, setTag] = useState('');

  // Limpa os campos quando o modal abre
  useEffect(() => {
    if (isActive) {
      setTipo('');
      setCapacidade('');
      setPlaca('');
      setTipoAbastecimento('');
      setTag('');
    }
  }, [isActive]);

  const handleSubmit = () => {
    // 1. Validação de Campos Obrigatórios Gerais
    if (!tipo || !capacidade || !placa || !tipoAbastecimento) {
        toast.warn("Preencha todos os campos obrigatórios.");
        return;
    }

    // 2. Validação Específica da TAG (Biometano)
    if (tipoAbastecimento === 'Biometano') {
        if (!tag) {
            toast.warn("A TAG é obrigatória para veículos a Biometano.");
            return;
        }
        if (tag.length !== 16) {
            toast.error(`A TAG deve ter exatamente 16 caracteres. (Atual: ${tag.length})`);
            return;
        }
    }

    // Envia o objeto (usando 'as any' para compatibilidade com o tipo atual)
    onSave({ 
        tipo, 
        capacidade,
        placa,
        tipoAbastecimento,
        tag: tipoAbastecimento === 'Biometano' ? tag : undefined 
    } as any);
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`} style={{ zIndex: 1001 }}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '500px', width: '100%' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.5rem', backgroundColor: '#fff' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>
            Adicionar Veículo
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '2rem' }}>
          
          {/* Tipo de Veículo */}
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
                    </select>
                </div>
            </div>
          </div>

          {/* Capacidade */}
          <div className="field">
            <label className="label is-small">Capacidade</label>
            <div className="control">
                <input 
                    className="input is-small" 
                    placeholder="Ex: 15.000" 
                    value={capacidade} 
                    onChange={e => setCapacidade(e.target.value)} 
                    type="number"
                />
            </div>
            <p className="help has-text-grey-light" style={{ fontSize: '0.7rem' }}>Capacidade em kg ou m³</p>
          </div>

          {/* Placa */}
          <div className="field">
            <label className="label is-small">Placa</label>
            <div className="control">
                <input 
                    className="input is-small" 
                    placeholder="ABC-1234" 
                    value={placa} 
                    onChange={e => setPlaca(e.target.value.toUpperCase())} 
                    maxLength={8}
                />
            </div>
          </div>

          {/* Tipo de Abastecimento */}
          <div className="field">
            <label className="label is-small">Tipo de Abastecimento</label>
            <div className="control">
                <div className="select is-fullwidth is-small">
                    <select value={tipoAbastecimento} onChange={e => setTipoAbastecimento(e.target.value)}>
                        <option value="">Selecionar</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Biometano">Biometano</option>
                    </select>
                </div>
            </div>
          </div>

          {/* TAG (Condicional e com Validação de 16 chars) */}
          {tipoAbastecimento === 'Biometano' && (
            <div className="field animate-fade-in" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '4px', border: '1px solid #bae6fd' }}>
                <label className="label is-size-7 has-text-info">TAG (16 caracteres)</label>
                <div className="control has-icons-right">
                    <input 
                        className={`input is-small ${tag.length === 16 ? 'is-success' : 'is-info'}`} 
                        placeholder="Ex: E2000019060C0139" 
                        value={tag} 
                        onChange={e => setTag(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} // Apenas letras e números
                        maxLength={16}
                    />
                    {tag.length === 16 && (
                        <span className="icon is-small is-right has-text-success">
                            <i className="fas fa-check"></i>
                        </span>
                    )}
                </div>
                <div className="is-flex is-justify-content-space-between mt-1">
                    <p className="help has-text-info" style={{ fontSize: '0.7rem' }}>
                        Obrigatório para automação.
                    </p>
                    <p className={`help ${tag.length === 16 ? 'has-text-success' : 'has-text-grey'}`} style={{ fontSize: '0.7rem' }}>
                        {tag.length}/16
                    </p>
                </div>
            </div>
          )}

        </section>

        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', padding: '1.5rem', gap: '10px' }}>
          <button className="button" onClick={onClose}>Cancelar</button>
          <button className="button is-success" onClick={handleSubmit}>
            <span className="icon is-small"><MdSave /></span>
            <span>Salvar</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TransportadoraAddVehicleModal;