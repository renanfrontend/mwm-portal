import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AbastecimentoPieChart from './AbastecimentoPieChart';
import { type AbastecimentoSummaryItem } from '../services/api';

// Mock do hook useTheme para não depender do Contexto
vi.mock('../hooks/useTheme', () => ({
  default: () => ({ theme: 'light' }),
}));

// Mock do componente ResponsiveContainer da Recharts
vi.mock('recharts', async () => {
  const originalModule = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

const mockChartData: AbastecimentoSummaryItem[] = [
  { veiculo: 'Caminhão', placa: 'ABC-1234', volumeTotal: 150.5 },
  { veiculo: 'Carro', placa: 'XYZ-5678', volumeTotal: 50.2 },
];

describe('AbastecimentoPieChart', () => {
  it('deve renderizar o título fornecido', () => {
    render(<AbastecimentoPieChart chartData={[]} title="Teste de Título" />);
    expect(screen.getByText('Teste de Título')).toBeInTheDocument();
  });

  it('deve usar o título padrão se nenhum for fornecido', () => {
    render(<AbastecimentoPieChart chartData={[]} />);
    expect(screen.getByText('Abastecimento')).toBeInTheDocument();
  });

  it('deve renderizar a label central "Volume por Veículo" mesmo com dados vazios', () => {
    render(<AbastecimentoPieChart chartData={[]} />);
    // A RTL não vê o texto dentro do SVG facilmente, mas podemos verificar o container do gráfico.
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    // Para um teste mais a fundo, seria necessário inspecionar o SVG, mas isso já dá uma boa garantia.
    expect(screen.getByText('Volume por Veículo')).toBeInTheDocument();
  });

  it('deve renderizar a legenda quando houver dados', async () => {
    render(<AbastecimentoPieChart chartData={mockChartData} />);

    // A legenda é renderizada pela Recharts. Vamos procurar pelo texto de um dos itens.
    // Usamos findBy para aguardar a renderização assíncrona de partes do gráfico.
    const legendItem1 = await screen.findByText('ABC-1234');
    const legendItem2 = await screen.findByText('XYZ-5678');

    expect(legendItem1).toBeInTheDocument();
    expect(legendItem2).toBeInTheDocument();
  });
});