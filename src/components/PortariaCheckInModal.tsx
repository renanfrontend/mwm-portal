// src/components/PortariaCheckInModal.tsx
import React, { useState, useEffect } from 'react';
import { type PortariaItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { format } from 'date-fns'; 

// Interface para os dados FINAIS (Passo 3)
interface ConfirmCheckInData {
  horarioCheckIn: string;
  balancaEntrada: string;
  balancaSaida: string;
}

// Props que o modal precisa
interface Props {
  isActive: boolean;
  onClose: () => void;
  // Chamado no Passo 3 (Final)
  onConfirm: (checkInData: ConfirmCheckInData) => void;
  // Chamado nos Passos 1 e 2
  onStepChange: (newStatus: 'Em processo' | 'Pesagem', data: { horarioCheckIn?: string, balancaEntrada?: string }) => void;
  data: PortariaItem | null;
}

const PortariaCheckInModal: React.FC<Props> = ({ isActive, onClose, onConfirm, onStepChange, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  const [step, setStep] = useState(1); 
  const [horarioCheckIn, setHorarioCheckIn] = useState(''); 
  const [balancaEntrada, setBalancaEntrada] = useState(''); 
  const [balancaSaida, setBalancaSaida] = useState(''); 

  // "Lembrar" o passo baseado no status do item
  useEffect(() => {
    if (isActive && data) {
      if (data.status === 'Pesagem') {
        setStep(3); // Se já pesou, vai pro Passo 3 (Saída)
      } else if (data.status === 'Em processo') {
        setStep(2); // Se iniciou, vai pro Passo 2 (Entrada)
      } else {
        setStep(1); // Se pendente, começa do 1
      }
      
      // Limpa os campos do formulário, mas pré-popula o peso de entrada se já existir
      setHorarioCheckIn(data.horario || ''); // Puxa o horário se já foi salvo
      setBalancaEntrada(data.balancaEntrada || ''); // Puxa o peso de entrada se já foi salvo
      setBalancaSaida('');
      
    }
  }, [isActive, data]); 
  
  if (!data) return null;

  // Funções de Navegação
  
  // Passo 1 -> Passo 2
  const handleGoToStep2 = () => {
    const horario = format(new Date(), 'HH:mmH');
    setHorarioCheckIn(horario); 
    onStepChange('Em processo', { horarioCheckIn: horario }); 
    setStep(2);
  };

  // Passo 2 -> Passo 3
  const handleGoToStep3 = () => {
    if (balancaEntrada.trim() === '') return; 
    onStepChange('Pesagem', { balancaEntrada: balancaEntrada });
    setStep(3);
  };

  // Passo 3 -> Finalizar
  const handleConfirmFinal = () => {
    if (balancaSaida.trim() === '') return; 
    onConfirm({
      horarioCheckIn: horarioCheckIn || data.horario, 
      balancaEntrada: balancaEntrada || data.balancaEntrada || '', 
      balancaSaida: balancaSaida,
    });
  };

  // --- Renderização dos Passos ---
  
  // PASSO 1: Confirmação Inicial
  const renderStep1 = () => (
    <div className="columns is-multiline">
      <div className="column is-half"><span className="help">Data</span><span className="subtitle is-6" style={{ color: textColor }}>{data.data}</span></div>
      <div className="column is-half"><span className="help">Hora</span><span className="subtitle is-6" style={{ color: textColor }}>{data.horario}</span></div>
      <div className="column is-half"><span className="help">Atividade a relizar</span><span className="subtitle is-6" style={{ color: textColor }}>{data.atividade}</span></div>
      <div className="column is-half"><span className="help">Empresa</span><span className="subtitle is-6" style={{ color: textColor }}>{data.empresa}</span></div>
      <div className="column is-half"><span className="help">Tipo de veículo</span><span className="subtitle is-6" style={{ color: textColor }}>{data.tipoVeiculo}</span></div>
      <div className="column is-half"><span className="help">Motorista</span><span className="subtitle is-6" style={{ color: textColor }}>{data.motorista}</span></div>
      <div className="column is-half"><span className="help">CPF/CNPJ</span><span className="subtitle is-6" style={{ color: textColor }}>{data.cpf_cnpj || '069.037.349-02'}</span></div>
      <div className="column is-half"><span className="help">Placa</span><span className="subtitle is-6" style={{ color: textColor }}>{data.placa}</span></div>
    </div>
  );

  // PASSO 2: Pesagem de Entrada
  const renderStep2 = () => (
    <>
      <article className="message is-warning">
        <div className="message-body">
          Para que possamos avançar, é <strong>Obrigátorio</strong> pesar o veículo, peça ao motorista para se dirigir até a balança de pesagem e insira o peso do veículo antes de receber os dejetos.
        </div>
      </article>
      <div className="field">
        <label className="label">Insira o peso de entrada do veículo</label>
        <div className="control">
          <input 
            className="input" 
            type="number"
            placeholder="Ex: 45000"
            value={balancaEntrada} 
            onChange={(e) => setBalancaEntrada(e.target.value)}
          />
        </div>
      </div>
    </>
  );

  // PASSO 3: Pesagem de Saída
  const renderStep3 = () => (
    <>
      <article className="message is-info">
        <div className="message-body">
          Após o veículo entregar os dejetos, será necessário fazer uma nova pesagem para registrar a saída do veículo.
        </div>
      </article>
      <div className="field">
        <label className="label">Insira o peso de saída do veículo</label>
        <div className="control">
          <input 
            className="input" 
            type="number"
            placeholder="Ex: 25000"
            value={balancaSaida} 
            onChange={(e) => setBalancaSaida(e.target.value)}
          />
        </div>
      </div>
    </>
  );

  // --- Renderização Principal ---
  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '600px' }}> 
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <p className="modal-card-title" style={{ color: textColor }}>
            {step === 1 && 'Confirmar Check-in'}
            {step === 2 && 'Confirmar Pesagem (Entrada)'}
            {step === 3 && 'Confirmar Pesagem (Saída)'}
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header> 

        <section className="modal-card-body">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </section>

        {/* Rodapé Dinâmico */}
        <footer className="modal-card-foot" style={{ borderTop: '1px solid var(--border-color)' }}>
          {step === 1 && (
            // Botões do Passo 1
            <div className="buttons is-right" style={{ width: '100%' }}>
              <button className="button" onClick={onClose}>Cancelar</button>
              <button 
                className="button is-success"
                onClick={handleGoToStep2}
              >
                Iniciar Check-in 
              </button>
            </div>
          )}
          {step === 2 && (
            // Botões do Passo 2 (separados)
            <div className="is-flex is-justify-content-space-between" style={{ width: '100%' }}>
              <button className="button" onClick={onClose}>Cancelar</button>
              <button 
                className="button is-info"
                onClick={handleGoToStep3}
                disabled={balancaEntrada.trim() === ''}
              >
                Adicionar Pesagem
              </button>
            </div>
          )}
          {step === 3 && (
            // Botões do Passo 3
            <div className="is-flex is-justify-content-space-between" style={{ width: '100%' }}>
              {/* Mudei de "Voltar" para "Cancelar" e chamei o "onClose" */}
              <button className="button" onClick={onClose}>Cancelar</button>
              <button 
                className="button is-success" 
                onClick={handleConfirmFinal}
                disabled={balancaSaida.trim() === ''}
              >
                Finalizar Check-in
              </button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default PortariaCheckInModal;