import { type Page, expect, type Locator } from '@playwright/test';

export class AuthPage {
  private readonly userInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.userInput = page.getByPlaceholder('Seu usuário');
    this.passwordInput = page.getByPlaceholder('Sua senha');
    this.loginButton = page.getByRole('button', { name: /entrar/i });
  }

  async goto() {
    await this.page.goto('/login');
    // Aguarda o título da página estar visível, o que é um indicador confiável
    // de que a página de login foi carregada e está pronta para interação.
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
  }

  async login(user: string, pass: string) {
    await this.userInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}