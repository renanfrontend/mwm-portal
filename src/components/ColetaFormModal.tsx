import React, { useState, useEffect } from 'react';
import { type ColetaItem } from '../services/api';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSubmit: (data: ColetaItem) => Promise<void>;
  initialData?: ColetaItem | null;
}

const ColetaFormModal: React.FC<Props> = ({ isActive, onClose, onSubmit, initialData }) => {
  const initialState = {
    id: '', // será gerado pela API
    cooperado: '',
    motorista: '',
    tipoVeiculo: 'Caminhão de dejetos',
    placa: '',
    odometro: 0,
    dataPrevisao: new Date().toISOString().split('T')[0],
    horaPrevisao: new Date().toTimeString().split(' ')[0].substring(0, 5),
    status: 'Pendente',
  };

  const [formData, setFormData] = useState<ColetaItem>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isActive) {
      setFormData(initialData || initialState);
    }
  }, [isActive, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'odometro' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData(initialState); // Reseta o form
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{initialData ? 'Editar Coleta' : 'Novo Registro de Coleta'}</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit} id="coleta-form">
            <div className="field">
              <label className="label">Cooperado</label>
              <div className="control">
                <input className="input" type="text" name="cooperado" value={formData.cooperado} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label">Motorista</label>
              <div className="control">
                <input className="input" type="text" name="motorista" value={formData.motorista} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label">Tipo do veículo</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select name="tipoVeiculo" value={formData.tipoVeiculo} onChange={handleChange}>
                    <option>Caminhão de dejetos</option>
                    <option>Caminhão de ração</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Placa do veículo</label>
              <div className="control">
                <input className="input" type="text" name="placa" value={formData.placa} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label">Odômetro (km)</label>
              <div className="control">
                <input className="input" type="number" name="odometro" value={formData.odometro} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label">Data de Previsão</label>
              <div className="control">
                <input className="input" type="date" name="dataPrevisao" value={formData.dataPrevisao} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label">Hora de Previsão</label>
              <div className="control">
                <input className="input" type="time" name="horaPrevisao" value={formData.horaPrevisao} onChange={handleChange} required />
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot">
          <button
            type="submit"
            form="coleta-form"
            className={`button is-success ${isSubmitting ? 'is-loading' : ''}`}
            disabled={isSubmitting}
          >
            {initialData ? 'Salvar' : 'Adicionar'}
          </button>
          <button className="button" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
        </footer>
      </div>
    </div>
  );
};

export default ColetaFormModal;