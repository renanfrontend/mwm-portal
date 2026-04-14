/**
 * PORTARIA REGISTRO - Service de Validação
 * Responsável por validações de negócio
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import type {
  PortariaRegistroFormData,
  PortariaRegistroValidationError,
  PortariaRegistroValidationResult,
} from '../types';
import {
  PORTARIA_VALIDATION_ERRORS,
  PORTARIA_TIPOS,
} from '../constants';

// ============================================================================
// VALIDAÇÕES
// ============================================================================

export const portariaValidationService = {
  /**
   * Validar registro completo
   */
  validateRegistro(data: PortariaRegistroFormData): PortariaRegistroValidationResult {
    const errors: PortariaRegistroValidationError[] = [];

    // Campos obrigatórios comuns
    if (!data.tipoRegistro) {
      errors.push({
        field: 'tipoRegistro',
        message: PORTARIA_VALIDATION_ERRORS.TIPO_OBRIGATORIO,
        code: 'REQUIRED_FIELD',
      });
    }

    if (!data.data_entrada) {
      errors.push({
        field: 'data_entrada',
        message: PORTARIA_VALIDATION_ERRORS.DATA_OBRIGATORIA,
        code: 'REQUIRED_FIELD',
      });
    } else if (!this._isValidDate(data.data_entrada)) {
      errors.push({
        field: 'data_entrada',
        message: PORTARIA_VALIDATION_ERRORS.DATA_OBRIGATORIA,
        code: 'INVALID_DATE',
      });
    } else if (this._isFutureDate(data.data_entrada)) {
      errors.push({
        field: 'data_entrada',
        message: PORTARIA_VALIDATION_ERRORS.DATA_FUTURA,
        code: 'FUTURE_DATE',
      });
    }

    if (!data.hora_entrada) {
      errors.push({
        field: 'hora_entrada',
        message: PORTARIA_VALIDATION_ERRORS.HORA_OBRIGATORIA,
        code: 'REQUIRED_FIELD',
      });
    } else if (!this._isValidTime(data.hora_entrada)) {
      errors.push({
        field: 'hora_entrada',
        message: PORTARIA_VALIDATION_ERRORS.HORA_INVALIDA,
        code: 'INVALID_FORMAT',
      });
    }

    // Validações específicas por tipo
    if (data.tipoRegistro === PORTARIA_TIPOS.ABASTECIMENTO) {
      const abastErrors = this._validateAbastecimento(data);
      errors.push(...abastErrors);
    }

    if (data.tipoRegistro === PORTARIA_TIPOS.ENTREGA_DEJETOS) {
      const dejetosErrors = this._validateEntregaDejetos(data);
      errors.push(...dejetosErrors);
    }

    if (data.tipoRegistro === PORTARIA_TIPOS.ENTREGA_INSUMO) {
      const insumoErrors = this._validateEntregaInsumo(data);
      errors.push(...insumoErrors);
    }

    if (data.tipoRegistro === PORTARIA_TIPOS.VISITA) {
      const visitaErrors = this._validateVisita(data);
      errors.push(...visitaErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validar campo específico
   */
  validateField(fieldName: string, value: any): PortariaRegistroValidationError | null {
    switch (fieldName) {
      case 'data_entrada':
        if (!value) {
          return {
            field: fieldName,
            message: PORTARIA_VALIDATION_ERRORS.DATA_OBRIGATORIA,
            code: 'REQUIRED_FIELD',
          };
        }
        if (!this._isValidDate(value)) {
          return {
            field: fieldName,
            message: PORTARIA_VALIDATION_ERRORS.DATA_OBRIGATORIA,
            code: 'INVALID_DATE',
          };
        }
        if (this._isFutureDate(value)) {
          return {
            field: fieldName,
            message: PORTARIA_VALIDATION_ERRORS.DATA_FUTURA,
            code: 'FUTURE_DATE',
          };
        }
        return null;

      case 'hora_entrada':
        if (!value) {
          return {
            field: fieldName,
            message: PORTARIA_VALIDATION_ERRORS.HORA_OBRIGATORIA,
            code: 'REQUIRED_FIELD',
          };
        }
        if (!this._isValidTime(value)) {
          return {
            field: fieldName,
            message: PORTARIA_VALIDATION_ERRORS.HORA_INVALIDA,
            code: 'INVALID_FORMAT',
          };
        }
        return null;

      case 'cpf_motorista':
        if (value && !this._isValidCPF(value)) {
          return {
            field: fieldName,
            message: PORTARIA_VALIDATION_ERRORS.CPF_INVALIDO,
            code: 'INVALID_FORMAT',
          };
        }
        return null;

      case 'densidade':
        if (value && !this._isValidDensidade(value)) {
          return {
            field: fieldName,
            message: PORTARIA_VALIDATION_ERRORS.DENSIDADE_INVALIDA,
            code: 'INVALID_FORMAT',
          };
        }
        return null;

      default:
        return null;
    }
  },

  /**
   * Validar Abastecimento
   */
  _validateAbastecimento(data: PortariaRegistroFormData): PortariaRegistroValidationError[] {
    const errors: PortariaRegistroValidationError[] = [];
    const ab = data.abastecimento;

    if (!ab) return errors;

    if (!ab.motorista_nome) {
      errors.push({
        field: 'motorista_nome',
        message: PORTARIA_VALIDATION_ERRORS.MOTORISTA_OBRIGATORIO,
        code: 'REQUIRED_FIELD',
      });
    }

    if (!ab.cpf_motorista) {
      errors.push({
        field: 'cpf_motorista',
        message: PORTARIA_VALIDATION_ERRORS.CPF_OBRIGATORIO,
        code: 'REQUIRED_FIELD',
      });
    } else if (!this._isValidCPF(ab.cpf_motorista)) {
      errors.push({
        field: 'cpf_motorista',
        message: PORTARIA_VALIDATION_ERRORS.CPF_INVALIDO,
        code: 'INVALID_FORMAT',
      });
    }

    if (!ab.tipo_veiculo) {
      errors.push({
        field: 'tipo_veiculo',
        message: PORTARIA_VALIDATION_ERRORS.TIPO_VEICULO_OBRIGATORIO,
        code: 'REQUIRED_FIELD',
      });
    }

    return errors;
  },

  /**
   * Validar Entrega Dejetos
   */
  _validateEntregaDejetos(data: PortariaRegistroFormData): PortariaRegistroValidationError[] {
    const errors = this._validateAbastecimento(data);
    const ed = data.entrega_dejetos;

    if (!ed) return errors;

    if (!ed.produtor_id) {
      errors.push({
        field: 'produtor_id',
        message: PORTARIA_VALIDATION_ERRORS.PRODUTOR_OBRIGATORIO,
        code: 'REQUIRED_FIELD',
      });
    }

    if (ed.densidade && !this._isValidDensidade(ed.densidade)) {
      errors.push({
        field: 'densidade',
        message: PORTARIA_VALIDATION_ERRORS.DENSIDADE_INVALIDA,
        code: 'INVALID_FORMAT',
      });
    }

    return errors;
  },

  /**
   * Validar Entrega Insumo
   */
  _validateEntregaInsumo(data: PortariaRegistroFormData): PortariaRegistroValidationError[] {
    const errors = this._validateAbastecimento(data);
    const ei = data.entrega_insumo;

    if (!ei) return errors;

    if (!ei.empresa) {
      errors.push({
        field: 'empresa',
        message: PORTARIA_VALIDATION_ERRORS.EMPRESA_OBRIGATORIA,
        code: 'REQUIRED_FIELD',
      });
    }

    return errors;
  },

  /**
   * Validar Visita
   */
  _validateVisita(data: PortariaRegistroFormData): PortariaRegistroValidationError[] {
    const errors: PortariaRegistroValidationError[] = [];
    const v = data.visita;

    if (!v) return errors;

    if (!v.visitante_nome) {
      errors.push({
        field: 'visitante_nome',
        message: PORTARIA_VALIDATION_ERRORS.VISITANTE_OBRIGATORIO,
        code: 'REQUIRED_FIELD',
      });
    }

    if (!v.documento_visitante) {
      errors.push({
        field: 'documento_visitante',
        message: PORTARIA_VALIDATION_ERRORS.DOCUMENTO_OBRIGATORIO,
        code: 'REQUIRED_FIELD',
      });
    }

    if (!v.tipo_veiculo) {
      errors.push({
        field: 'tipo_veiculo',
        message: PORTARIA_VALIDATION_ERRORS.TIPO_VEICULO_OBRIGATORIO,
        code: 'REQUIRED_FIELD',
      });
    }

    return errors;
  },

  /**
   * Verificar se data é válida
   */
  _isValidDate(date: any): boolean {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  },

  /**
   * Verificar se data é futura
   */
  _isFutureDate(date: any): boolean {
    const d = new Date(date);
    return d > new Date();
  },

  /**
   * Verificar se hora é válida (HH:mm)
   */
  _isValidTime(time: string): boolean {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  },

  /**
   * Verificar se CPF é válido
   */
  _isValidCPF(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.length === 11;
  },

  /**
   * Verificar se densidade é válida (1000-1050)
   */
  _isValidDensidade(densidade: string): boolean {
    const num = parseInt(densidade, 10);
    return num >= 1000 && num <= 1050;
  },
};
