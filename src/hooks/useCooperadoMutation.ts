import { useState } from 'react';
import { ProdutorService } from '../services/produtorService';
import type { CooperadoAPIInput, ProdutorFormInput } from '../types/cooperado';

export const useCooperadoMutation = () => {

    // Utilitário para conversão de CPF/CNPJ
    const sanitizeCpfCnpj = (valor: string) => valor.replaceAll(/\D/g, '');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

  const getReadableErrorMessage = (err: unknown, fallback: string): string => {
    const responseData = isObject(err) && isObject(err.response) ? err.response.data : undefined;

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData;
    }

    if (isObject(responseData) && typeof responseData.message === 'string') {
      return responseData.message;
    }

    if (isObject(responseData) && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
      const firstError = responseData.errors[0];
      if (typeof firstError === 'string') return firstError;
      if (isObject(firstError) && firstError.message) return String(firstError.message);
    }

    if (isObject(responseData) && typeof responseData.title === 'string') {
      return responseData.title;
    }

    if (isObject(err) && typeof err.message === 'string' && err.message.trim()) {
      return err.message;
    }

    return fallback;
  };

  const logMutationError = (action: 'create' | 'update' | 'delete', err: unknown, payload?: CooperadoAPIInput, id?: number) => {
    const response = isObject(err) && isObject(err.response) ? err.response : undefined;
    const config = isObject(err) && isObject(err.config) ? err.config : undefined;

    const status = response?.status;
    const method = typeof config?.method === 'string' ? config.method.toUpperCase() : undefined;
    const url = typeof config?.url === 'string' ? config.url : undefined;
    const responseData = response?.data;

    console.group(`🔴 Falha ao ${action} produtor`);
    console.error('Resumo:', {
      action,
      status,
      method,
      url,
      id,
      message: getReadableErrorMessage(err, `Erro ao ${action} produtor`)
    });
    if (payload) {
      console.log('Payload enviado:', payload);
    }
    if (responseData !== undefined) {
      console.log('Resposta da API (error.response.data):', responseData);
    }
    if (isObject(response?.headers)) {
      console.log('Headers da resposta:', response.headers);
    }
    console.error('Erro original:', err);
    console.groupEnd();
  };

  // ADAPTER ORIGINAL RESTAURADO
  const toApiPayload = (form: ProdutorFormInput): CooperadoAPIInput => {
    const payload: CooperadoAPIInput = {
      matricula: Number.parseInt(form.matricula) || 0,
      nomeCooperado: form.nome,
      cpfCnpj: sanitizeCpfCnpj(form.cpfCnpj),
      certificado: form.certificado,
      doamDejetos: form.doamDejetos,
      fase: form.faseDejeto,
      cabecas: Number.parseInt(form.cabecas) || 0,
      tecnico: form.tecnico,
      // telefone removed: no longer part of CooperadoAPIInput
      numPropriedade: form.nPropriedade,
      numEstabelecimento: form.numEstabelecimento,
      municipio: form.municipio,
      latitude: Number.parseFloat(form.lat?.toString().replace(',', '.') || '0') || 0,
      longitude: Number.parseFloat(form.long?.toString().replace(',', '.') || '0') || 0,
      qtdLagoas: Number.parseInt(form.qtdLagoas) || 0,
      volLagoas: form.volLagoas,
      restricoes: form.restricoes,
      responsavel: form.responsavel,
      localizacao: form.localizacao,
      distanciaKm: form.distancia ? Number.parseFloat(form.distancia.replaceAll(/[^\d.,]/g, '').replaceAll(',', '.')) || 0 : 0,
      filiadaId: Number(form.filiada) || 1
    };
    console.log('📦 Payload gerado para envio (Produtor):', JSON.stringify(payload, null, 2));
    return payload;
  };

  // Função para criar produtor
  const createCooperado = async (form: ProdutorFormInput) => {
    setIsLoading(true); setError(null);
    let payload: CooperadoAPIInput | undefined;
    try {
      payload = toApiPayload(form);
      return await ProdutorService.create(payload);
    } catch (err: unknown) {
      logMutationError('create', err, payload);
      setError(getReadableErrorMessage(err, 'Erro ao criar produtor'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar produtor
  const updateCooperado = async (id: number, form: ProdutorFormInput) => {
    setIsLoading(true); setError(null);
    let payload: CooperadoAPIInput | undefined;
    try {
      payload = toApiPayload(form);
      return await ProdutorService.update(id, payload);
    } catch (err: unknown) {
      logMutationError('update', err, payload, id);
      setError(getReadableErrorMessage(err, 'Erro ao atualizar produtor'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para deletar produtor
  const deleteCooperado = async (id: number) => {
    setIsLoading(true); setError(null);
    try {
      await ProdutorService.delete(id);
    } catch (err: unknown) {
      logMutationError('delete', err, undefined, id);
      setError(getReadableErrorMessage(err, 'Erro ao deletar produtor'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Retorno do hook
  return {
    isLoading,
    error,
    toApiPayload,
    createCooperado,
    updateCooperado,
    deleteCooperado,
  };
}