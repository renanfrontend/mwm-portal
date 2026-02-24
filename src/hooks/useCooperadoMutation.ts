import { useState } from 'react';
import { ProdutorService } from '../services/produtorService';
import type { CooperadoAPIInput, ProdutorFormInput } from '../types/cooperado';

export const useCooperadoMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ADAPTER ORIGINAL RESTAURADO
  const toApiPayload = (form: ProdutorFormInput): CooperadoAPIInput => {
    return {
      matricula: Number.parseInt(form.matricula) || 0,
      transportadoraId: 1, 
      tipoVeiculoId: 1,    
      nomeCooperado: form.nome,
      cpfCnpj: form.cpfCnpj,
      placa: 'AAA-0000',   
      certificado: form.certificado === 'Sim' ? 'Ativo' : 'Inativo',
      doamDejetos: form.doamDejetos,
      fase: form.faseDejeto,
      cabecas: Number.parseInt(form.cabecas) || 0,
      tecnico: form.tecnico,
      telefone: '45999999999', 
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
      // 🛡️ CORREÇÃO: Envia a distância limpa (sem "km", "KM", etc) e convertida para número
      // Remove qualquer caractere que não seja número ou ponto/vírgula
      distanciaKm: form.distancia ? Number.parseFloat(form.distancia.replace(/[^\d.,]/g, '').replace(',', '.')) || 0 : 0,
      filiadaId: Number(form.filiada) || 1
    };
  };

  const createCooperado = async (form: ProdutorFormInput) => {
    setIsLoading(true); setError(null);
    try {
      const payload = toApiPayload(form);
      return await ProdutorService.create(payload);
    } catch (err: any) { handleError(err); } finally { setIsLoading(false); }
  };

  const updateCooperado = async (id: number, form: ProdutorFormInput) => {
    setIsLoading(true); setError(null);
    try {
      const payload = toApiPayload(form);
      return await ProdutorService.update(id, payload);
    } catch (err: any) { handleError(err); } finally { setIsLoading(false); }
  };

  // 🛡️ FUNÇÃO DE EXCLUSÃO
  const deleteCooperado = async (id: number) => {
    setIsLoading(true); setError(null);
    try {
      await ProdutorService.delete(id);
    } catch (err: any) { handleError(err); } finally { setIsLoading(false); }
  };

  const handleError = (err: any) => {
      console.error('❌ Erro na operação:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || `Erro ${err.response?.status}`;
      setError(errorMessage);
      throw err;
  };

  return { 
    createCooperado, 
    updateCooperado, 
    deleteCooperado, // 🛡️ AGORA SIM: Propriedade disponível para o componente
    isLoading, 
    error 
  };
};