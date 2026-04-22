import type {
  PortariaAbastecimento,
  PortariaDeleteTransportOrigin,
  PortariaDrawerFormState,
  PortariaEntregaDejetos,
  TipoVeiculo,
} from '../../../types';

type PortariaTransportDeleteSource = PortariaAbastecimento | PortariaEntregaDejetos | null | undefined;

const parsePeso = (value: string | null | undefined): number => {
  const digits = value?.toString().replace(/[^\d]/g, '') || '0';
  return parseInt(digits, 10);
};

const isManualTransportadora = (section?: PortariaTransportDeleteSource): boolean => {
  return !!section?.transportadora_manual?.trim();
};

export const buildTransportCreatePayload = (entry: PortariaDrawerFormState) => ({
  motorista_nome: entry.motorista || '',
  cpf_motorista: entry.cpf || '',
  motorista_id: null,
  transportadora_id: entry.transportadora && entry.transportadora !== 'outros' ? entry.transportadora : null,
  transportadora_manual: entry.transportadora === 'outros' ? entry.transportadoraManual : null,
  veiculo_id: entry.veiculoId || null,
  placa: entry.placa && entry.placa !== 'Outros' ? entry.placa : null,
  placa_manual: entry.transportadora === 'outros' || entry.placa === 'Outros' ? entry.placaManual : null,
  tipo_veiculo: (entry.tipoVeiculo || 'Caminhão') as TipoVeiculo,
  peso_inicial: parsePeso(entry.pesoInicial),
  peso_final: parsePeso(entry.pesoFinal),
});

export const buildTransportDeleteContext = (section?: PortariaTransportDeleteSource) => {
  const origemTransportadora: PortariaDeleteTransportOrigin = section
    ? (isManualTransportadora(section) ? 'OUTROS' : 'SELECIONADA')
    : 'NAO_APLICAVEL';

  return {
    transportadoraId: section?.transportadora_id ?? null,
    veiculoId: section?.veiculo_id ?? null,
    transportadoraManual: section?.transportadora_manual ?? null,
    placaManual: section?.placa_manual ?? null,
    origemTransportadora,
    excluirTransportadora: origemTransportadora === 'OUTROS' && !!section?.transportadora_id,
    excluirVeiculo: origemTransportadora === 'OUTROS' && !!section?.veiculo_id,
  };
};
