// src/components/MetricCard.tsx

import React from 'react';
// import { MdTrendingUp, MdTrendingDown } from 'react-icons/md'; // Removido

interface Props {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  // A prop iconColor foi removida da interface
}

const MetricCard = ({ title, value, icon, trend }: Props) => {
  
  // Mapeia o 'trend' para a cor do TEXTO, conforme você pediu
  let valueColorClass = 'var(--text-color)'; // Cor padrão (para tema dark/light)
  if (trend === 'up') {
    valueColorClass = 'hsl(141, 71%, 48%)'; // Verde (Bulma 'is-success')
  } else if (trend === 'neutral') {
    valueColorClass = 'hsl(48, 100%, 67%)'; // Amarelo (Bulma 'is-warning')
  } else if (trend === 'down') {
    valueColorClass = 'hsl(348, 100%, 61%)'; // Vermelho (Bulma 'is-danger')
  }
  
  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="is-size-7 has-text-grey">{title}</p>
            <div className="is-flex is-align-items-center">
              {/* --- CORREÇÃO AQUI: Aplica a cor de status no valor --- */}
              <p className="title is-4 my-2" style={{ color: valueColorClass }}>
                {value}
              </p>
            </div>
          </div>
          <div className="media-right">
             {/* --- CORREÇÃO AQUI: Cor do ícone agora é fixa (azul da marca) --- */}
             <span className="icon is-size-2 has-text-info">
              {icon}
            </span>
          </div>
        </div>
        <div className="has-text-right mt-3">
          <a href="#" className="is-size-7">Detalhar</a>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;