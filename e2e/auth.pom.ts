import { type Page, expect } from '@playwright/test';

export class AuthPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
    // Aguarda o título da página estar visível, o que é um indicador confiável
    // de que a página de login foi carregada e está pronta para interação.
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
  }

  async login(user: string, pass: string) {
    await this.page.getByPlaceholder('Seu usuário').fill(user);
    await this.page.getByPlaceholder('Sua senha').fill(pass);
    await this.page.getByRole('button', { name: /entrar/i }).click();
  }
}