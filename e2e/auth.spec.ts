import { test, expect } from '@playwright/test';
import { AuthPage } from './auth.pom';

test.describe('Fluxo de Autenticação', () => {
  test('deve permitir que um usuário administrador faça login com sucesso', async ({ page }) => {
    const authPage = new AuthPage(page);

    // 1. Navegar para a página de login e aguardar o carregamento
    await authPage.goto();

    // 2. Realizar o login com credenciais válidas
    await authPage.login('admin', 'admin123');

    // 3. Verificar se o login foi bem-sucedido e redirecionou para o dashboard
    await page.waitForURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});