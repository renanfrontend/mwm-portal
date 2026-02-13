import { useState } from 'react';
import { ProdutorService } from '../services/produtorService';
import type { CooperadoAPIInput, ProdutorFormInput } from '../types/cooperado';

export const useCooperadoMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ADAPTER: Converte Input do Form (Strings soltas) -> Input da API (Tipado)
  const toApiPayload = (form: ProdutorFormInput): CooperadoAPIInput => {
    return {
      matricula: Number.parseInt(form.matricula) || 0,
      transportadoraId: 1, // Default Hardcoded (Falta no form)
      tipoVeiculoId: 1,    // Default Hardcoded (Falta no form)
      nomeCooperado: form.nome,
      cpfCnpj: form.cpfCnpj,
      placa: 'AAA-0000',   // Default Hardcoded (Falta no form)
      certificado: form.certificado === 'Sim' ? 'Ativo' : 'Inativo',
      doamDejetos: form.doamDejetos,
      fase: form.faseDejeto,
      cabecas: Number.parseInt(form.cabecas) || 0,
      tecnico: form.tecnico,
      telefone: '45999999999', // Default Hardcoded (Falta no form)
      numPropriedade: form.nPropriedade,
      numEstabelecimento: form.numEstabelecimento,
      municipio: form.municipio,
      latitude: Number.parseFloat(form.lat.replace(',', '.')) || 0,
      longitude: Number.parseFloat(form.long.replace(',', '.')) || 0,
      
      // Campos extras suportados agora:
      qtdLagoas: Number.parseInt(form.qtdLagoas) || 0,
      volLagoas: form.volLagoas,
      restricoes: form.restricoes,
      responsavel: form.responsavel,
      localizacao: form.localizacao,
      distancia: form.distancia,
      filiadaId: Number(form.filiada) || 1
    };
  };

  const createCooperado = async (form: ProdutorFormInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = toApiPayload(form);
      console.log('📤 Payload enviado para API (Create):', payload);
      const result = await ProdutorService.create(payload);
      console.log('✅ Cooperado criado com sucesso:', result);
      return result;
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCooperado = async (id: number, form: ProdutorFormInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = toApiPayload(form);
      console.log('📤 Payload enviado para API (Update):', payload);
      const result = await ProdutorService.update(id, payload);
      console.log('✅ Cooperado atualizado com sucesso:', result);
      return result;
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err: any) => {
      // Log detalhado do erro
      console.error('❌ Erro na operação:', {
        mensagem: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        dados: err.response?.data,
        url: err.config?.url,
        metodo: err.config?.method,
        payload: err.config?.data
      });
      
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || `Erro ${err.response?.status || 'desconhecido'}: ${err.message}`;
      
      setError(errorMessage);
      throw err;
  };

  return {
    createCooperado,
    updateCooperado,
    isLoading,
    error
  };
};
