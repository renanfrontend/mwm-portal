// src/utils/permissao.ts
import type { LoginResponse } from '../services/auth';

export function temPermissao(permissao: string, user: LoginResponse | null): boolean {
  if (!user || !user.permissoes) return false;
  return user.permissoes.includes(permissao);
}
