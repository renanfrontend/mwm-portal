// src/services/mock/auth.mock.ts
import { v4 as uuidv4 } from 'uuid';
import { type MockUser } from '../../types/models'; // Import MockUser from models.ts

// Dados de usuário mockados com perfis e filiais
const mockUsers: MockUser[] = [
  { id: uuidv4(), username: 'admin', email: 'admin@mwm.com', password: 'admin123', role: 'administrador', filiais: ['Toledo - PR', 'Cascavel - PR'] },
  { id: uuidv4(), username: 'editor', email: 'editor@mwm.com', password: 'editor123', role: 'editor', filiais: ['Toledo - PR'] },
  { id: uuidv4(), username: 'porteiro', email: 'porteiro@mwm.com', password: 'leitor123', role: 'leitor', filiais: ['Toledo - PR'] },
];

export const login = (username: string, password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        // Simula a criação de um token JWT (na prática, isso viria do backend)
        const token = `mock-jwt-token.${btoa(JSON.stringify({ user: user.username, role: user.role, filiais: user.filiais }))}.signature`;
        resolve(token);
      } else {
        reject(new Error('Usuário ou senha inválidos.'));
      }
    }, 500); // Simula uma latência de 0.5 segundo
  });
};

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
    }, 500);
  });
};

export const createNewPassword = (email: string, newPassword: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      if (user) {
        user.password = newPassword; // Atualiza a senha (apenas para a simulação)
        resolve();
      } else {
        reject(new Error('Não foi possível redefinir a senha. Tente novamente.'));
      }
    }, 500);
  });
};