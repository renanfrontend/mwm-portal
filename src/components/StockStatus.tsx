import React from 'react';
import type { StockItem as StockItemType } from '../services/api';

// Mover o sub-componente para fora do componente principal evita que ele seja recriado em cada renderização.
const StockItem: React.FC<Omit<StockItemType, 'id'>> = ({ label, value, capacity, unit, color }) => (
  <div className="mb-4">
    <h3 className="is-size-6 has-text-weight-bold">{label}</h3>
    <div className="is-flex is-justify-content-space-between is-size-7 has-text-grey">
      <span>{value.toLocaleString('pt-BR')} / {capacity.toLocaleString('pt-BR')} {unit}</span>
      <span>{((value / capacity) * 100).toFixed(1)}%</span>
    </div>
    <progress
      className={`progress is-small ${color}`}
      value={value}
      max={capacity}
    >
      {((value / capacity) * 100).toFixed(1)}%
    </progress>
  </div>
);

// Props que o componente principal recebe
interface Props {
  stockItems: StockItemType[];
}

const StockStatus = ({ stockItems }: Props) => {
  return (
    <div className="card" style={{ height: '100%' }}>
      <header className="card-header">
        <p className="card-header-title">Estoque</p>
      </header>
      <div className="card-content">
        {stockItems.map(item => (
          <StockItem
            key={item.id}
            label={item.label}
            value={item.value}
            capacity={item.capacity}
            unit={item.unit}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};

export default StockStatus;