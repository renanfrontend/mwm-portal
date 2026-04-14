/**
 * PORTARIA REGISTRO - Service de Formatter
 * Responsável por formatação de dados para UI
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import type { PortariaStatus } from '../types';
import { PORTARIA_STATUS_COLORS } from '../constants';

// ============================================================================
// FORMATTER SERVICE
// ============================================================================

export const portariaFormatterService = {
  /**
   * Formatar data para grid (dd/mm/yyyy)
   */
  formatDataBr(date: Date | string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  },

  /**
   * Formatar data para input (yyyy-MM-dd)
   */
  formatDataInput(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Formatar hora (HH:mm)
   */
  formatHora(hora: string): string {
    if (!hora) return '';
    const [h, m] = hora.split(':');
    return `${h}:${m}`;
  },

  /**
   * Formatar status com cor
   */
  formatStatus(status: PortariaStatus): { text: string; color: string } {
    return {
      text: status,
      color: PORTARIA_STATUS_COLORS[status] || '#000000',
    };
  },

  /**
   * Formatar CPF (000.000.000-00)
   */
  formatCPF(cpf: string): string {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  /**
   * Remover formatação de CPF
   */
  unformatCPF(cpf: string): string {
    return cpf.replace(/\D/g, '');
  },

  /**
   * Formatar moeda (BRL)
   */
  formatMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  },

  /**
   * Formatar peso (kg)
   */
  formatPeso(peso: number | null): string {
    if (peso === null || peso === undefined) return '-';
    return `${peso.toFixed(2)} kg`;
  },

  /**
   * Formatar placa
   */
  formatPlaca(placa: string): string {
    if (!placa) return '';
    // Remove caracteres especiais e converte para maiúsculas
    return placa.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  },

  /**
   * Formatar densidade
   */
  formatDensidade(densidade: string | null): string {
    if (!densidade) return '-';
    return `${densidade} g/cm³`;
  },

  /**
   * Formatar documento (CPF ou Passaporte)
   */
  formatDocumento(documento: string, tipo: string): string {
    if (tipo === 'CPF') {
      return this.formatCPF(documento);
    }
    return documento; // Passaporte não tem formatação padrão
  },

  /**
   * Truncar texto
   */
  truncate(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  },

  /**
   * Capitalizar primeira letra
   */
  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  /**
   * Converter string para título (Title Case)
   */
  titleCase(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => this.capitalize(word))
      .join(' ');
  },
};
