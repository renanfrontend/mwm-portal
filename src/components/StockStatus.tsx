import React from 'react';
// Função para determinar a cor da barra com base na porcentagem
const getStockColorClass = (value: number, capacity: number): string => {
  const percentage = (value / capacity) * 100;

  if (percentage < 25) {
    return 'is-danger'; // Vermelho (muito baixo)
  }
  if (percentage < 30) {
    return 'is-warning'; // Amarelo (baixando)
  }
  // No seu print, o "Digestato Bruto" está acima de 50% e azul
  return 'is-info'; // Azul (normal, como no print)
};

// A prop 'color' foi removida da interface do sub-componente
const StockItem: React.FC<Omit<StockItemType, 'id' | 'color'>> = ({ label, value, capacity, unit }) => {
  // Chama a função para obter a cor dinâmica
  const colorClass = getStockColorClass(value, capacity);
  const percentage = (value / capacity) * 100;

  return (
    <div className="mb-4">
      <h3 className="is-size-6 has-text-weight-bold">{label}</h3>
      <div className="is-flex is-justify-content-space-between is-size-7 has-text-grey">
        <span>{value.toLocaleString('pt-BR')} / {capacity.toLocaleString('pt-BR')} {unit}</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <progress
        // --- CORREÇÃO AQUI: Usa a classe de cor dinâmica ---
        className={`progress is-small ${colorClass}`}
        value={value}
        max={capacity}
      >
        {percentage.toFixed(1)}%
      </progress>
    </div>
  );
};

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
          />
        ))}
      </div>
    </div>
  );
};

export default StockStatus;