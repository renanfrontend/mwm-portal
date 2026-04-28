/**
 * Permissões de domínio para Portaria
 *
 * Autor: Antonio Marcos de Souza Santos
 * Data: 28/04/2026
 * Full Stack Developer
 *
 * -------------------------------------------------------------
 *
 * Esta estrutura centraliza todas as regras de permissão do domínio Portaria.
 * O objetivo é evitar código duplicado, facilitar manutenção e garantir
 * que todas as verificações de permissão estejam em um único local.
 *
 * Como usar:
 * 1. Importe as funções e constantes deste arquivo nos componentes de Portaria.
 * 2. Use as funções podeVisualizarPortaria, podeEditarPortaria, etc., para
 *    condicionar a renderização de botões, grids e ações.
 * 3. Para outros domínios (Logística, Abastecimento, etc.), crie arquivos
 *    semelhantes seguindo este padrão.
 *
 * Exemplo de uso:
 *   import { podeEditarPortaria } from '../domain/permissaoPortaria';
 *   ...
 *   {podeEditarPortaria(user) && <IconButton ... />} // Só renderiza se tiver permissão
 *
 * Vantagens:
 * - Centralização das regras
 * - Facilidade de manutenção e testes
 * - Padrão replicável para outros módulos
 *
 * -------------------------------------------------------------
 */
import type { LoginResponse } from '../services/auth';
import { temPermissao } from '../utils/permissao';

export const PermissoesPortaria = {
  visualizar: 'PORTARIA_VISUALIZAR',
  cadastrar: 'PORTARIA_CADASTRAR',
  editar: 'PORTARIA_EDITAR',
  excluir: 'PORTARIA_EXCLUIR',
};

export function podeVisualizarPortaria(user: LoginResponse | null) {
  return temPermissao(PermissoesPortaria.visualizar, user);
}
export function podeCadastrarPortaria(user: LoginResponse | null) {
  return temPermissao(PermissoesPortaria.cadastrar, user);
}
export function podeEditarPortaria(user: LoginResponse | null) {
  return temPermissao(PermissoesPortaria.editar, user);
}
export function podeExcluirPortaria(user: LoginResponse | null) {
  return temPermissao(PermissoesPortaria.excluir, user);
}
