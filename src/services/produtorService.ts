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

export const ProdutorService = {
  list: async (plantaId: number, filiadaId: number, page: number = 1, pageSize: number = 9999): Promise<ProdutorListResponse> => {
    const response = await api.get<ProdutorListResponse>('/logistica/produtores', {
      params: { plantaId, filiadaId, page, pageSize }
    });
    return response.data;
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
  delete: async (id: number): Promise<void> => {
    await api.delete(`/logistica/produtores/${id}`);
  }
};