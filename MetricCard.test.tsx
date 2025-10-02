import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricCard from './MetricCard';
import { describe, it, expect } from 'vitest';
import { MdHelp } from 'react-icons/md';

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Densidade',
    value: '1014',
    icon: <MdHelp data-testid="metric-icon" />,
    iconColor: 'green',
  };

  it('deve renderizar o título corretamente', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText('Densidade')).toBeInTheDocument();
  });

  it('deve renderizar o valor corretamente', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText('1014')).toBeInTheDocument();
  });

  it('deve renderizar o ícone', () => {
    render(<MetricCard {...defaultProps} />);
    const iconElement = screen.getByTestId('metric-icon');
    expect(iconElement).toBeInTheDocument();
  });

  it('deve aplicar a cor correta ao ícone', () => {
    render(<MetricCard {...defaultProps} iconColor="red" />);
    // O ícone está dentro de um span que recebe a cor
    const iconContainer = screen.getByTestId('metric-icon').parentElement;
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle('color: red');
  });

  it('deve renderizar o link "Detalhar"', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText('Detalhar')).toBeInTheDocument();
  });
});