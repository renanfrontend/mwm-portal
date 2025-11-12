// src/components/PortariaEditModal.tsx
import React, { useState, useEffect } from 'react';
import { type PortariaItem } from '../services/api';
import useTheme from '../hooks/useTheme';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: (editedItem: PortariaItem) => void;
  data: PortariaItem | null;
}

const PortariaEditModal: React.FC<Props> = ({ isActive, onClose, onSave, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  const [motorista, setMotorista] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [placa, setPlaca] = useState('');

  // Preenche os campos do formulário quando o modal é aberto ou os dados mudam
  useEffect(() => {
    if (isActive && data) {
      setMotorista(data.motorista);
      setCpfCnpj(data.cpf_cnpj || '');
      setPlaca(data.placa);
    }
  }, [isActive, data]);

  if (!data) return null;

  const handleSave = () => {
    // Cria um novo objeto PortariaItem com os campos editados
    const editedItem: PortariaItem = {
      ...data,
      motorista: motorista,
      cpf_cnpj: cpfCnpj,
      placa: placa,
    };
    onSave(editedItem);
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '600px' }}>
        <header className="modal-card-head" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <p className="modal-card-title" style={{ color: textColor }}>
            Editar Agendamento
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body">
          <div className="columns is-multiline">
            {/* Campos FIXOS (apenas exibição) */}
            <div className="column is-half"><span className="help">Data</span><span className="subtitle is-6" style={{ color: textColor }}>{data.data}</span></div>
            <div className="column is-half"><span className="help">Horário</span><span className="subtitle is-6" style={{ color: textColor }}>{data.horario}</span></div>
            <div className="column is-half"><span className="help">Empresa</span><span className="subtitle is-6" style={{ color: textColor }}>{data.empresa}</span></div>
            <div className="column is-half"><span className="help">Tipo de veículo</span><span className="subtitle is-6" style={{ color: textColor }}>{data.tipoVeiculo}</span></div>
            <div className="column is-half"><span className="help">Atividade</span><span className="subtitle is-6" style={{ color: textColor }}>{data.atividade}</span></div>
            <div className="column is-half"><span className="help">Status</span><span className="subtitle is-6" style={{ color: textColor }}>{data.status}</span></div>

            <hr className="divider column is-full" style={{ margin: '1rem 0' }} />

            {/* Campos EDITÁVEIS */}
            <div className="column is-full">
              <div className="field">
                <label className="label">Motorista</label>
                <div className="control">
                  <input 
                    className="input" 
                    type="text"
                    value={motorista} 
                    onChange={(e) => setMotorista(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">CPF/CNPJ</label>
                <div className="control">
                  <input 
                    className="input" 
                    type="text"
                    value={cpfCnpj} 
                    onChange={(e) => setCpfCnpj(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Placa</label>
                <div className="control">
                  <input 
                    className="input" 
                    type="text"
                    value={placa} 
                    onChange={(e) => setPlaca(e.target.value)}
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        <footer className="modal-card-foot" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="buttons is-right" style={{ width: '100%' }}>
            <button className="button" onClick={onClose}>Cancelar</button>
            <button 
              className="button is-success"
              onClick={handleSave}
            >
              Salvar Alterações
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PortariaEditModal;