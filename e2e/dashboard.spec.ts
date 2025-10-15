import { test, expect } from '@playwright/test';
import { AuthPage } from './auth.pom';

/**
 * Função auxiliar para realizar o login antes de cada teste do dashboard.
 * Isso evita a repetição do código de login em todos os testes.
 */
async function loginComoAdmin(page: import('@playwright/test').Page) {
  const authPage = new AuthPage(page);
  await authPage.goto();
  await authPage.login('admin', 'admin123');
  await page.waitForURL('/dashboard');
}

test.describe('Dashboard', () => {
  // Executa o login antes de cada teste neste grupo
  test.beforeEach(async ({ page }) => {
    await loginComoAdmin(page);
  });

  test('deve exibir o título e os cards de métrica após o login', async ({ page }) => {
    // Verifica se o título principal está visível
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Verifica se os cards de métricas foram renderizados
    // Aguarda o primeiro card aparecer, o que indica que os dados foram carregados
    await expect(page.getByText('Densidade dos dejetos')).toBeVisible();
    await expect(page.getByText('Volume recebido')).toBeVisible();
  });

  test('deve exibir os gráficos do dashboard', async ({ page }) => {
    // Aguarda os componentes do gráfico serem renderizados
    // Usamos seletores que buscam pelo texto dentro dos componentes mockados nos testes unitários,
    // mas aqui eles representam os componentes reais.
    await expect(page.getByText('Status do Estoque')).toBeVisible();
    await expect(page.getByText('Análise de Cooperados')).toBeVisible();
    await expect(page.getByText('Abastecimento por Veículo')).toBeVisible();
  });
});