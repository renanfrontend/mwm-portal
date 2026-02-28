import axios from 'axios';
import type { CooperadoAPIInput, CooperadoResponse, ProdutorListResponse } from '../types/cooperado';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) { config.headers.Authorization = `Bearer ${token}`; }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('🔴 Erro de resposta da API:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        data: error.response.data
      });
    }
    return Promise.reject(error);
  }
);

const toValidNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const resolveProdutorId = (item: any): number => {
  const candidates = [
    item?.id,
    item?.cooperadoId,
    item?.produtorId,
    item?.bioProdutorId,
    item?.bioProdutor?.id,
    item?.cooperado?.id
  ];

  for (const candidate of candidates) {
    const validId = toValidNumber(candidate);
    if (validId !== null) return validId;
  }

  throw new Error('Resposta inválida da API: produtor sem ID para operações de edição/exclusão.');
};

export const ProdutorService = {
    findByCpfCnpj: async (cpfCnpj: string) => {
      try {
        const response = await api.get(`/logistica/produtores/busca`, { params: { cpfCnpj } });
        // Espera-se que o backend retorne o produtor encontrado ou null
        return response.data;
      } catch (err: any) {
        if (err.response?.status === 404 || err.response?.status === 400) return null;
        throw err;
      }
    },
    findByNumEstabelecimento: async (numEstabelecimento: string) => {
      try {
        const response = await api.get(`/logistica/produtores/busca`, { params: { numEstabelecimento } });
        return response.data;
      } catch (err: any) {
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
  list: async (plantaId: number, filiadaId: number, page: number = 1, pageSize: number = 9999): Promise<ProdutorListResponse> => {
    const response = await api.get<ProdutorListResponse>('/logistica/produtores', {
      params: { plantaId, filiadaId, page, pageSize }
    });

    const payload: any = response.data;
    let rawItems: any[] = [];

    if (Array.isArray(payload?.items)) {
      rawItems = payload.items;
    } else if (Array.isArray(payload?.data?.items)) {
      rawItems = payload.data.items;
    }

    const items = rawItems.map((item: any) => ({
      ...item,
      id: resolveProdutorId(item),
      produtorId: toValidNumber(item?.produtorId) ?? resolveProdutorId(item),
      estabelecimentoId: toValidNumber(item?.estabelecimentoId)
    }));

    return {
      page: payload?.page ?? payload?.data?.page ?? page,
      pageSize: payload?.pageSize ?? payload?.data?.pageSize ?? pageSize,
      total: payload?.total ?? payload?.data?.total ?? items.length,
      items
    };
  },
  create: async (payload: CooperadoAPIInput): Promise<CooperadoResponse> => {
    const response = await api.post<CooperadoResponse>('/logistica/produtores', payload);
    return response.data;
  },
  update: async (id: number, payload: CooperadoAPIInput): Promise<CooperadoResponse> => {
    const response = await api.put<CooperadoResponse>(`/logistica/produtores/${id}`, payload);
    return response.data;
  },
  getById: async (id: number): Promise<CooperadoResponse> => {
    const response = await api.get<CooperadoResponse>(`/logistica/produtores/${id}`);
    return response.data;
  },
  // 🛡️ DELETE: Se o erro 405 persistir, verifique com o backend se o método é DELETE ou POST/PUT
  delete: async (estabelecimentoId: number): Promise<void> => {
    await api.delete(`/logistica/produtores/${estabelecimentoId}`);
  },
  deleteBatch: async (estabelecimentoIds: number[]): Promise<void> => {
    await api.post('/logistica/produtores/exclusao-lote', { estabelecimentoIds });
  }
};