import type { PortariaRegistroFormData, PortariaRegistroValidationError } from '../../../types';
import { PORTARIA_VALIDATION_ERRORS } from '../../../constants';

/**
 * Validação específica de Abastecimento
 */
export function validateAbastecimento(data: PortariaRegistroFormData): PortariaRegistroValidationError[] {
  const ab = data.abastecimento;
  const errors: PortariaRegistroValidationError[] = [];

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
  }

  if (!ab.tipo_veiculo) {
    errors.push({
      field: 'tipo_veiculo',
      message: PORTARIA_VALIDATION_ERRORS.TIPO_VEICULO_OBRIGATORIO,
      code: 'REQUIRED_FIELD',
    });
  }

  return errors;
}
