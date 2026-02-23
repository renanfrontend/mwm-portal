// src/services/auth.ts
// CORREÇÃO: Removido 'uuidv4' não utilizado
import axios from 'axios';
import { type MockUser } from '../types/models'; // Import MockUser from models.ts
import { login as mockLogin, forgotPassword as mockForgotPassword, createNewPassword as mockCreateNewPassword } from './mock/auth.mock';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

/*
// Interface para um item de usuário mockado
export interface MockUser {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'administrador' | 'editor' | 'leitor';
  filiais?: string[];
}

/*
// Dados de usuário mockados com perfis e filiais
const mockUsers: MockUser[] = [
  { id: uuidv4(), username: 'admin', email: 'admin@mwm.com', password: 'admin123', role: 'administrador', filiais: ['Toledo - PR', 'Cascavel - PR'] },
  { id: uuidv4(), username: 'editor', email: 'editor@mwm.com', password: 'editor123', role: 'editor', filiais: ['Toledo - PR'] },
  { id: uuidv4(), username: 'porteiro', email: 'porteiro@mwm.com', password: 'leitor123', role: 'leitor', filiais: ['Toledo - PR'] },
];*/
/**
 * Simula a autenticação de login.
 * @param username O nome de usuário para autenticar.
 * @param password A senha fornecida.
 * @returns Um Promise que resolve com o token JWT mockado se o login for bem-sucedido, ou rejeita em caso de falha.
 */
export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    perfil: string;
  };
}

export const login = (username: string, password: string): Promise<LoginResponse> => {
  if (import.meta.env.VITE_USE_MOCK_API !== 'false') {
    // Mock: mantém compatibilidade com o frontend
    return mockLogin(username, password).then((token: string) => ({
      token,
      usuario: {
        id: 1,
        nome: username,
        perfil: 'ADMIN',
      },
    }));
  }

  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      // Adapta para o formato esperado pelo frontend
      if (response.data.token && response.data.usuario) {
        resolve(response.data);
      } else if (response.data.message && response.data.nome) {
        // Monta um objeto compatível
        resolve({
          token: '', // Não há token, pode ser ajustado se backend passar a enviar
          usuario: {
            id: 1,
            nome: response.data.nome,
            perfil: 'ADMIN', // Ajuste conforme regra de perfil real
          },
        });
      } else {
        reject(new Error('Resposta inesperada do servidor.'));
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Erro na resposta da API:', error.response);
        if (error.response.status === 401) {
          // Mostra mensagem do backend se existir
          const msg = error.response.data?.erro || error.response.data?.error || error.response.data?.message;
          reject(new Error(msg || 'Usuário ou senha inválidos.'));
        } else if (error.response.status === 403) {
          reject(new Error('Usuário bloqueado ou inativo.'));
        } else if (error.response.status === 500) {
          reject(new Error('Erro interno ao processar login.'));
        } else {
          reject(new Error(error.response.data?.erro || error.response.data?.error || JSON.stringify(error.response.data) || 'Erro desconhecido.'));
        }
      } else {
        console.error('Erro sem resposta da API:', error);
        reject(new Error('Erro de conexão com o servidor.'));
      }
    }
  });
};

/**
 * Simula o processo de recuperação de senha.
 * @param email O email do usuário para redefinir a senha.
 * @returns Um Promise que resolve em sucesso ou rejeita se o email não for encontrado.
 */
export const forgotPassword = (email: string): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCK_API !== 'false') { // Already correct
    return mockForgotPassword(email);
  }

  return new Promise(async (resolve, reject) => {
    try {
      await api.post('/auth/forgot-password', { email });
      resolve();
    } catch (error) {
      reject(new Error('Nenhum usuário encontrado com este email.'));
    }
  });
};

/**
 * Simula a criação de uma nova senha.
 * @param email O email do usuário.
 * @param newPassword A nova senha.
 * @returns Um Promise que resolve em sucesso ou rejeita em caso de falha.
 */
export const createNewPassword = (email: string, newPassword: string): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCK_API !== 'false') { // Already correct
    return mockCreateNewPassword(email, newPassword);
  }

  return new Promise(async (resolve, reject) => {
    try {
      await api.post('/auth/create-new-password', { email, newPassword });
      resolve();
    } catch (error) {
      reject(new Error('Não foi possível redefinir a senha. Tente novamente.'));
    }
  });
};

/**
 * Decodifica um token JWT mockado para obter os dados do usuário.
 * @param token O token JWT a ser decodificado.
 * @returns O objeto do usuário decodificado ou null se o token for inválido.
 */
export const decodeJwt = (token: string): Partial<MockUser> | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const data = JSON.parse(decoded);
    return data;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};