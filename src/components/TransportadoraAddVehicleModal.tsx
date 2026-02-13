import React, { useState, useEffect } from 'react';
import { MdSave, MdDirectionsCar, MdLocalGasStation, MdConfirmationNumber } from 'react-icons/md';
import { toast } from 'react-toastify';
import type { VeiculoInfo } from '../types/models';
import { fetchVeiculoTipos, fetchVeiculoCombustiveis, type VeiculoTipoOption, type VeiculoCombustivelOption } from '../services/api';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: (veiculo: VeiculoInfo) => void;
}

const TransportadoraAddVehicleModal: React.FC<Props> = ({ isActive, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    capacidade: '',
    placa: '',
    tipoAbastecimento: '',
    tag: ''
  });

  const [vehicleTypes, setVehicleTypes] = useState<VeiculoTipoOption[]>([]);
  const [fuelTypes, setFuelTypes] = useState<VeiculoCombustivelOption[]>([]);

  // Carregar tipos de veículo e combustível ao montar
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [veiculos, combustiveis] = await Promise.all([
          fetchVeiculoTipos(),
          fetchVeiculoCombustiveis()
        ]);
        setVehicleTypes(veiculos);
        setFuelTypes(combustiveis);
      } catch (err) {
        console.error('Erro ao carregar opções de veículo/combustível:', err);
        toast.error('Erro ao carregar opções de veículo/combustível');
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (isActive) {
      setFormData({
        tipo: '',
        capacidade: '',
        placa: '',
        tipoAbastecimento: '',
        tag: ''
      });
    }
  }, [isActive]);

  if (!isActive) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.capacidade || !formData.placa) {
      toast.warn("Preencha a capacidade e a placa.");
      return;
    }

    if (formData.tipoAbastecimento === 'Biometano') {
      if (!formData.tag) {
        toast.warn("Para Biometano, a TAG é obrigatória.");
        return;
      }
      if (formData.tag.length !== 16) {
        toast.warn(`A TAG deve ter exatamente 16 caracteres.`);
        return;
      }
    }

    const newVehicle: any = {
      tipo: formData.tipo,
      capacidade: formData.capacidade,
      placa: formData.placa,
      tipoAbastecimento: formData.tipoAbastecimento,
      tag: formData.tipoAbastecimento === 'Biometano' ? formData.tag : undefined
    };

    onSave(newVehicle);
  };

  return (
    // Z-INDEX 1200 para garantir que fique ACIMA do modal de lista (que tem 1000)
    <div className={`modal ${isActive ? 'is-active' : ''}`} style={{ zIndex: 1200 }}>
      {/* Background um pouco mais escuro para destacar que é um segundo nível */}
      <div className="modal-background" onClick={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}></div>
      <div className="modal-card" style={{ maxWidth: '500px', width: '100%', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
        
        <header className="modal-card-head has-background-white" style={{ borderBottom: '1px solid #ededed', borderRadius: '8px 8px 0 0' }}>
          <p className="modal-card-title is-size-5 has-text-weight-medium">Adicionar Veículo</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        
        <section className="modal-card-body has-background-white">
          
          <div className="field">
            <label className="label is-small has-text-grey">Tipo do Veículo</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="tipo" value={formData.tipo} onChange={handleChange}>
                  <option value="">Selecione</option>
                  {vehicleTypes.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="columns is-mobile">
            <div className="column is-6">
              <div className="field">
                <label className="label is-small has-text-grey">Capacidade</label>
                <div className="control">
                  <input 
                    className="input" 
                    type="text" 
                    name="capacidade" 
                    placeholder="Ex: 16.000L" 
                    value={formData.capacidade} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label is-small has-text-grey">Placa</label>
                <div className="control has-icons-left">
                  <input 
                    className="input" 
                    type="text" 
                    name="placa" 
                    placeholder="ABC-1234" 
                    value={formData.placa} 
                    onChange={handleChange} 
                  />
                  <span className="icon is-small is-left"><MdDirectionsCar /></span>
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label is-small has-text-grey">Tipo de Abastecimento</label>
            <div className="control has-icons-left">
              <div className="select is-fullwidth">
                <select name="tipoAbastecimento" value={formData.tipoAbastecimento} onChange={handleChange}>
                  <option value="">Selecione</option>
                  {fuelTypes.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <span className="icon is-small is-left"><MdLocalGasStation /></span>
            </div>
          </div>

          {formData.tipoAbastecimento === 'Biometano' && (
            <div className="field">
              <label className="label is-small has-text-grey">TAG (16 Caracteres)</label>
              <div className="control has-icons-left">
                <input 
                  className="input" 
                  type="text" 
                  name="tag" 
                  placeholder="Ex: 1234567890123456" 
                  maxLength={16}
                  value={formData.tag} 
                  onChange={handleChange} 
                />
                <span className="icon is-small is-left"><MdConfirmationNumber /></span>
              </div>
              <p className="help is-info">
                {formData.tag.length}/16 caracteres
              </p>
            </div>
          )}

        </section>
        
        <footer className="modal-card-foot has-background-white is-justify-content-flex-end" style={{ borderTop: '1px solid #ededed', borderRadius: '0 0 8px 8px' }}>
          <button className="button" onClick={onClose}>Cancelar</button>
          <button className="button is-info" onClick={handleSave}>
            <span className="icon is-small mr-1"><MdSave /></span>
            <span>Salvar</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TransportadoraAddVehicleModal;