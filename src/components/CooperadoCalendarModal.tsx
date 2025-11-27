// src/components/CooperadoCalendarModal.tsx

import React, { useState, useEffect } from 'react';
import type { CooperadoItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { MdChevronLeft, MdChevronRight, MdCheck } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: () => void;
  data: CooperadoItem | null;
}

const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Código HTML exato do widget fornecido por você
const weatherWidgetHTML = `
<div id="ww_f6626c53b9996" v='1.3' loc='id' a='{"t":"responsive","lang":"pt","sl_lpl":1,"ids":["wl5048"],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"#FFFFFF00","cl_font":"#000000","cl_cloud":"#d4d4d4","cl_persp":"#2196F3","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722","cl_odd":"#00000000"}'>Mais previsões: <a href="https://tempolongo.com/rio_de_janeiro_tempo_25_dias/" id="ww_f6626c53b9996_u" target="_blank">Weather Rio de Janeiro 30 days</a></div>
`;

const CooperadoCalendarModal: React.FC<Props> = ({ isActive, onClose, onSave, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // --- INJEÇÃO DO SCRIPT DO WIDGET ---
  useEffect(() => {
    if (isActive) {
      const scriptId = 'ww_f6626c53b9996_script';
      
      // Remove script anterior se existir para forçar recarregamento
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://app3.weatherwidget.org/js/?id=ww_f6626c53b9996";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isActive]);

  if (!data) return null;

  // Lógica do Calendário
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Formatar data selecionada para exibição no input
  selectedDate 
    ? `${selectedDate} de ${monthNames[month]} de ${year}`
    : '';

  const renderDays = () => {
    const days = [];
    
    // Espaços vazios
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} style={{ height: '36px' }}></div>);
    }

    // Dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected = selectedDate === d;
      const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
      
      days.push(
        <div 
          key={d} 
          onClick={() => setSelectedDate(d)}
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '36px', 
            cursor: 'pointer' 
          }}
        >
          <div style={{ 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: isSelected ? '#3273dc' : (isToday ? '#f5f5f5' : 'transparent'),
            color: isSelected ? '#fff' : textColor,
            fontWeight: isSelected ? 'bold' : 'normal',
            border: isToday && !isSelected ? '1px solid #dbdbdb' : '1px solid transparent',
            fontSize: '0.9rem'
          }}>
            {d}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '480px', width: '100%', borderRadius: '8px' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.25rem', backgroundColor: '#fff' }}>
          <div style={{ flex: 1 }}>
            <p className="title is-6 has-text-weight-bold mb-1" style={{ color: textColor }}>Agendar Coleta</p>
            <p className="subtitle is-7 has-text-grey">Cooperado: <strong>{data.motorista}</strong></p>
          </div>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '1.5rem' }}>
          
          {/* --- 1. WIDGET DE CLIMA (RENDERIZADO VIA HTML PURO) --- */}
          <div className="mb-5">
            <p className="is-size-7 has-text-grey has-text-weight-bold is-uppercase mb-2">Previsão do Tempo</p>
            <div 
              style={{ minHeight: '155px', backgroundColor: '#fafafa', borderRadius: '4px', padding: '5px' }}
              dangerouslySetInnerHTML={{ __html: weatherWidgetHTML }}
            />
          </div>

          <hr style={{ margin: '1.5rem 0', backgroundColor: '#ededed', height: '1px' }} />

          {/* --- 2. INPUT DE DATA --- */}
          <div className="mb-4">
            <label className="label is-small has-text-grey is-uppercase mb-2">Selecionar Data</label>
          </div>

          {/* --- 3. CALENDÁRIO (LAYOUT GRID) --- */}
          <div className="box shadow-none p-0 mb-0" style={{ border: 'none', boxShadow: 'none' }}>
            
            {/* Navegação */}
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-3 px-1">
              <button className="button is-small is-ghost" onClick={handlePrevMonth}>
                <MdChevronLeft size={24} color="#555"/>
              </button>
              <span className="has-text-weight-bold is-size-6" style={{ color: textColor, textTransform: 'capitalize' }}>
                {monthNames[month]} {year}
              </span>
              <button className="button is-small is-ghost" onClick={handleNextMonth}>
                <MdChevronRight size={24} color="#555"/>
              </button>
            </div>

            {/* Dias da Semana */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              marginBottom: '0.5rem', 
              textAlign: 'center' 
            }}>
              {weekDays.map(day => (
                <span key={day} className="is-size-7 has-text-grey-light has-text-weight-bold">{day}</span>
              ))}
            </div>

            {/* Grid de Dias (CSS Grid para alinhamento perfeito) */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              rowGap: '2px' 
            }}>
              {renderDays()}
            </div>
          </div>

        </section>

        <footer 
          className="modal-card-foot" 
          style={{ 
            borderTop: '1px solid #ededed', 
            backgroundColor: 'white', 
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px' // Espaçamento adicionado aqui
          }}
        >
          <button className="button" onClick={onClose}>Cancelar</button>
          <button 
            className="button is-success" // Botão verde (is-success)
            onClick={onSave} 
            disabled={!selectedDate}
          >
            <span className="icon is-small">
              <MdCheck />
            </span>
            <span>Salvar</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoCalendarModal;