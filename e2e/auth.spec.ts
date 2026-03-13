import { test, expect } from '@playwright/test';
import { AuthPage } from './auth.pom';

test.describe('Fluxo de Autenticação', () => {

  test('deve exibir uma mensagem de erro com credenciais inválidas', async ({ page }) => {
    const authPage = new AuthPage(page);

    // 1. Navegar para a página de login
    await authPage.goto();

    // 2. Tentar login com credenciais inválidas
    await authPage.login('usuario-invalido', 'senha-invalida');

    // 3. Verificar se a mensagem de erro é exibida
    await expect(page.getByText('Usuário ou senha inválidos.')).toBeVisible();
  });
});