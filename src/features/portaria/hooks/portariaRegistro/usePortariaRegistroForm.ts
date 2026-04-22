/**
 * PORTARIA REGISTRO - Hook usePortariaRegistroForm
 * Gerencia criação e edição de registros
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import { useState, useCallback } from 'react';
import type {
  PortariaRegistro,
  PortariaRegistroFormData,
  PortariaRegistroValidationError,
} from '../../types';
import { portariaRegistroService, portariaValidationService } from '../../services';

// ============================================================================
// TYPES
// ============================================================================

export interface UsePortariaRegistroFormReturn {
  formData: PortariaRegistroFormData | null;
  validationErrors: Record<string, string>;
  isSubmitting: boolean;
  error: string | null;

  // Ações
  setFormData: (data: PortariaRegistroFormData) => void;
  updateField: (field: string, value: any) => void;
  validate: () => boolean;
  submit: (onSuccess?: (data: PortariaRegistro) => void) => Promise<void>;
  reset: () => void;
}

// ============================================================================
// HOOK
// ============================================================================

export const usePortariaRegistroForm = (
  initialData?: PortariaRegistro
): UsePortariaRegistroFormReturn => {
  const [formData, setFormDataState] = useState<PortariaRegistroFormData | null>(
    initialData ? mapRegistroToForm(initialData) : null
  );
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Atualizar formData
   */
  const setFormData = useCallback((data: PortariaRegistroFormData) => {
    setFormDataState(data);
    setValidationErrors({});
    setError(null);
  }, []);

  /**
   * Atualizar campo específico
   */
  const updateField = useCallback((field: string, value: any) => {
    setFormDataState((prev) => {
      if (!prev) return null;

      const [parent, child] = field.split('.');

      if (child) {
        // Campo aninhado (ex: abastecimento.motorista_nome)
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as any),
            [child]: value,
          },
        };
      }

      // Campo principal
      return {
        ...prev,
        [field]: value,
      };
    });

    // Validar campo em tempo real
    const fieldError = portariaValidationService.validateField(field, value);
    setValidationErrors((prev) => {
      if (fieldError) {
        return { ...prev, [field]: fieldError.message };
      } else {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
    });
  }, []);

  /**
   * Validar formulário
   */
  const validate = useCallback((): boolean => {
    if (!formData) return false;

    const result = portariaValidationService.validateRegistro(formData);

    if (!result.isValid) {
      const errors: Record<string, string> = {};
      result.errors.forEach((error: PortariaRegistroValidationError) => {
        errors[error.field] = error.message;
      });
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  }, [formData]);

  /**
   * Enviar formulário
   */
  const submit = useCallback(
    async (onSuccess?: (data: PortariaRegistro) => void) => {
      if (!formData) return;

      // Validar
      if (!validate()) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);

        let result: PortariaRegistro;

        if (initialData && initialData.id) {
          // Atualizar
          result = await portariaRegistroService.updateRegistro(initialData.id, formData);
        } else {
          // Criar novo
          result = await portariaRegistroService.createRegistro(formData);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        reset();
      } catch (err: any) {
        setError(err.message || 'Erro ao salvar registro');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate, initialData]
  );

  /**
   * Resetar formulário
   */
  const reset = useCallback(() => {
    setFormDataState(initialData ? mapRegistroToForm(initialData) : null);
    setValidationErrors({});
    setError(null);
  }, [initialData]);

  return {
    formData,
    validationErrors,
    isSubmitting,
    error,
    setFormData,
    updateField,
    validate,
    submit,
    reset,
  };
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Converter PortariaRegistro para form data
 */
function mapRegistroToForm(registro: PortariaRegistro): PortariaRegistroFormData {
  return {
    tipoRegistro: registro.tipo_registro,
    data_entrada: registro.data_entrada,
    hora_entrada: registro.hora_entrada,
    data_saida: registro.data_saida,
    hora_saida: registro.hora_saida,
    observacoes: registro.observacoes || undefined,
    status: registro.status,
    origem_entrada: registro.origem_entrada,

    abastecimento: registro.abastecimento
      ? {
          motorista_nome: registro.abastecimento.motorista_nome,
          cpf_motorista: registro.abastecimento.cpf_motorista,
          motorista_id: registro.abastecimento.motorista_id,
          transportadora_id: registro.abastecimento.transportadora_id,
          transportadora_manual: registro.abastecimento.transportadora_manual,
          veiculo_id: registro.abastecimento.veiculo_id,
          placa_manual: registro.abastecimento.placa_manual,
          tipo_veiculo: registro.abastecimento.tipo_veiculo,
          peso_inicial: registro.abastecimento.peso_inicial,
          peso_final: registro.abastecimento.peso_final,
        }
      : undefined,

    entrega_dejetos: registro.entrega_dejetos
      ? {
          motorista_nome: registro.entrega_dejetos.motorista_nome || '',
          cpf_motorista: registro.entrega_dejetos.cpf_motorista || '',
          motorista_id: registro.entrega_dejetos.motorista_id,
          transportadora_id: registro.entrega_dejetos.transportadora_id,
          transportadora_manual: registro.entrega_dejetos.transportadora_manual,
          veiculo_id: registro.entrega_dejetos.veiculo_id,
          placa_manual: registro.entrega_dejetos.placa_manual,
          placa: registro.entrega_dejetos.placa,
          tipo_veiculo: registro.entrega_dejetos.tipo_veiculo || 'Caminhão',
          peso_inicial: registro.entrega_dejetos.peso_inicial,
          peso_final: registro.entrega_dejetos.peso_final,
          produtor_id: registro.entrega_dejetos.produtor_id,
          densidade: registro.entrega_dejetos.densidade,
        }
      : undefined,

    entrega_insumo: registro.entrega_insumo
      ? {
          motorista_nome: registro.entrega_insumo.motorista_nome || '',
          cpf_motorista: registro.entrega_insumo.cpf_motorista || '',
          motorista_id: registro.entrega_insumo.motorista_id,
          transportadora_id: registro.entrega_insumo.transportadora_id,
          transportadora_manual: registro.entrega_insumo.transportadora_manual,
          veiculo_id: registro.entrega_insumo.veiculo_id,
          placa_manual: registro.entrega_insumo.placa_manual,
          placa: registro.entrega_insumo.placa,
          tipo_veiculo: registro.entrega_insumo.tipo_veiculo || 'Caminhão',
          peso_inicial: registro.entrega_insumo.peso_inicial,
          peso_final: registro.entrega_insumo.peso_final,
          empresa: registro.entrega_insumo.empresa,
          nota_fiscal: registro.entrega_insumo.nota_fiscal,
        }
      : undefined,

    expedicao: registro.expedicao
      ? {
          motorista_nome: registro.expedicao.motorista_nome || '',
          cpf_motorista: registro.expedicao.cpf_motorista || '',
          motorista_id: registro.expedicao.motorista_id,
          transportadora_id: registro.expedicao.transportadora_id,
          transportadora_manual: registro.expedicao.transportadora_manual,
          veiculo_id: registro.expedicao.veiculo_id,
          placa_manual: registro.expedicao.placa_manual,
          placa: registro.expedicao.placa,
          tipo_veiculo: registro.expedicao.tipo_veiculo || 'Caminhão',
          peso_inicial: registro.expedicao.peso_inicial,
          peso_final: registro.expedicao.peso_final,
          nota_fiscal: registro.expedicao.nota_fiscal,
        }
      : undefined,

    visita: registro.visita
      ? {
          visitante_nome: registro.visita.visitante_nome,
          documento_visitante: registro.visita.documento_visitante,
          tipo_documento: registro.visita.tipo_documento,
          visitante_id: registro.visita.visitante_id,
          motivo_visita_id: registro.visita.motivo_visita_id,
          motivo_manual: registro.visita.motivo_manual,
          veiculo_id: registro.visita.veiculo_id,
          placa_manual: registro.visita.placa_manual,
          tipo_veiculo: registro.visita.tipo_veiculo,
        }
      : undefined,
  };
}
