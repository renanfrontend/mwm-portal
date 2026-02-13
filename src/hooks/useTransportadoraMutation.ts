// src/hooks/useTransportadoraMutation.ts

import { useState } from 'react';
import type { AxiosError } from 'axios';
import { TransportadoraService } from '../services/transportadoraService';
import type { TransportadoraFormInput, TransportadoraResponse } from '../types/transportadora';

export const useTransportadoraMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransportadora = async (data: TransportadoraFormInput): Promise<TransportadoraResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🚀 Criando transportadora - Payload:', JSON.stringify(data, null, 2));
      const response = await TransportadoraService.create(data);
      console.log('✅ Status da resposta:', response.status);
      console.log('✅ Transportadora criada com sucesso:', JSON.stringify(response, null, 2));
      return response;
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      console.error('❌ Erro completo:', axiosError);
      console.error('❌ Status:', axiosError.response?.status);
      console.error('❌ Status Text:', axiosError.response?.statusText);
      console.error('❌ Response Data:', JSON.stringify(axiosError.response?.data, null, 2));
      console.error('❌ Headers:', axiosError.response?.headers);
      
      const errorMsg = axiosError.response?.data?.message || axiosError.response?.data || 'Erro ao criar transportadora';
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      return null;
    }
  };

  const updateTransportadora = async (id: string, data: TransportadoraFormInput): Promise<TransportadoraResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔄 Atualizando transportadora:', id, data);
      const response = await TransportadoraService.update(id, data);
      console.log('✅ Transportadora atualizada com sucesso:', response);
      return response;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMsg = axiosError.response?.data?.message || 'Erro ao atualizar transportadora';
      console.error('❌ Erro ao atualizar transportadora:', errorMsg);
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransportadora = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🗑️ Deletando transportadora:', id);
      await TransportadoraService.delete(id);
      console.log('✅ Transportadora deletada com sucesso');
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMsg = axiosError.response?.data?.message || 'Erro ao deletar transportadora';
      console.error('❌ Erro ao deletar transportadora:', errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    createTransportadora, 
    updateTransportadora, 
    deleteTransportadora,
    isLoading, 
    error 
  };
};
