import { useState } from 'react';
import { ProdutorService } from '../services/produtorService';
import type { CooperadoAPIInput, ProdutorFormInput } from '../types/cooperado';

export const useCooperadoMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ADAPTER ORIGINAL RESTAURADO
  const toApiPayload = (form: ProdutorFormInput): CooperadoAPIInput => {
    const payload = {
      matricula: Number.parseInt(form.matricula) || 0,
      
      // ⚠️ BACKEND EXIGE: Transportadora, Veículo e Placa são obrigatórios no JSON.
      // Preenchendo com valores padrão válidos para permitir o cadastro do produtor.
      transportadoraId: 8, // ID 8 = MWM (Existente)
      tipoVeiculoId: 1,    // ID 1 = Truck (Existente)
      placa: 'AAA-0000',   // Placa fictícia obrigatória

      nomeCooperado: form.nome,
      cpfCnpj: form.cpfCnpj,
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
      distanciaKm: form.distancia ? Number.parseFloat(form.distancia.replace(/[^\d.,]/g, '').replace(',', '.')) || 0 : 0,
      filiadaId: Number(form.filiada) || 1
    };
    
    console.log('📦 Payload gerado para envio (Produtor):', JSON.stringify(payload, null, 2));
    return payload;
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