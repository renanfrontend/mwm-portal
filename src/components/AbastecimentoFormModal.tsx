import React, { useState } from 'react';
import { type AbastecimentoReportItem } from '../services/api';

type FormState = Omit<AbastecimentoReportItem, 'status' | 'cliente' | 'horaTermino'>;

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSubmit: (data: FormState) => void;
}

const AbastecimentoFormModal: React.FC<Props> = ({ isActive, onClose, onSubmit }) => {
  const initialState: FormState = {
    veiculo: 'Caminhão (Ração)',
    placa: '',
    produto: 'Biometano',
    data: new Date().toISOString().split('T')[0],
    horaInicio: new Date().toTimeString().split(' ')[0],
    volume: 0,
    odometro: 0,
    usuario: '',
  };

  const [formData, setFormData] = useState<FormState>(initialState);
  // CORRIGIDO: Renomeado para _setIsSubmitting para remover o aviso de "não lido" (TS6133)
  const [isSubmitting, _setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'volume' || name === 'odometro' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Você pode adicionar _setIsSubmitting(true) aqui se onSubmit se tornar assíncrono
    onSubmit(formData);
    setFormData(initialState);
    // e _setIsSubmitting(false) aqui
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Novo Registro de Abastecimento</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit} id="abastecimento-form">
            <div className="field">
              <label className="label">Veículo</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select name="veiculo" value={formData.veiculo} onChange={handleChange}>
                    <option>Caminhão (Ração)</option>
                    <option>Caminhão (Dejeto)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Placa</label>
              <div className="control">
                <input className="input" type="text" name="placa" value={formData.placa} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label">Volume (m³)</label>
              <div className="control">
                <input className="input" type="number" name="volume" value={formData.volume} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label">Odômetro (km)</label>
              <div className="control">
                <input className="input" type="number" name="odometro" value={formData.odometro} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label">Usuário</label>
              <div className="control">
                <input className="input" type="text" name="usuario" value={formData.usuario} onChange={handleChange} required />
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot">
          <button
            type="submit"
            form="abastecimento-form"
            className={`button is-success ${isSubmitting ? 'is-loading' : ''}`}
            disabled={isSubmitting}
          >
            Salvar
          </button>
          <button className="button" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
        </footer>
      </div>
    </div>
  );
};

export default AbastecimentoFormModal;