// src/services/auth.ts
import { v4 as uuidv4 } from 'uuid';

// Interface para um item de usuário mockado
export interface MockUser {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'administrador' | 'editor' | 'leitor';
  filiais?: string[];
}

// Dados de usuário mockados com perfis e filiais
const mockUsers: MockUser[] = [
  { id: uuidv4(), username: 'admin', email: 'admin@mwm.com', password: 'admin123', role: 'administrador', filiais: ['Toledo - PR', 'Cascavel - PR'] },
  { id: uuidv4(), username: 'editor', email: 'editor@mwm.com', password: 'editor123', role: 'editor', filiais: ['Toledo - PR'] },
  { id: uuidv4(), username: 'porteiro', email: 'porteiro@mwm.com', password: 'leitor123', role: 'leitor', filiais: ['Toledo - PR'] },
];

/**
 * Simula a autenticação de login.
 * @param username O nome de usuário para autenticar.
 * @param password A senha fornecida.
 * @returns Um Promise que resolve com o usuário mockado se o login for bem-sucedido, ou rejeita em caso de falha.
 */
export const login = (username: string, password: string): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        // Remove a senha antes de retornar o objeto para a aplicação
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Usuário ou senha inválidos.'));
      }
    }, 1000); // Simula uma latência de 1 segundo
  });
};

/**
 * Simula o processo de recuperação de senha.
 * @param email O email do usuário para redefinir a senha.
 * @returns Um Promise que resolve em sucesso ou rejeita se o email não for encontrado.
 */
export const forgotPassword = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userExists = mockUsers.some((u) => u.email === email);
      if (userExists) {
        console.log(`Email de redefinição de senha enviado para ${email}`);
        resolve();
      } else {
        reject(new Error('Nenhum usuário encontrado com este email.'));
      }
    }, 1000);
  });
};

/**
 * Simula a criação de uma nova senha.
 * @param email O email do usuário.
 * @param newPassword A nova senha.
 * @returns Um Promise que resolve em sucesso ou rejeita em caso de falha.
 */
export const createNewPassword = (email: string, newPassword: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      if (user) {
        user.password = newPassword; // Atualiza a senha (apenas para a simulação)
        console.log(`Senha do usuário ${user.username} redefinida com sucesso.`);
        resolve();
      } else {
        reject(new Error('Não foi possível redefinir a senha. Tente novamente.'));
      }
    }, 1000);
  });
};