/**
 * Layer 4 - Pages (POM)
 * Register (signup) page. Encapsulates selectors + user-intent actions only.
 */
import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../core/base.page.js';

export class RegisterPage extends BasePage {
  protected readonly path = '/register';

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly loginLink: Locator;
  readonly toast: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel('Username');
    // 'Password' is a substring of 'Confirm Password' — exact match disambiguates.
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm Password');
    this.registerButton = page.getByRole('button', { name: 'Register Now' });
    this.loginLink = page.getByRole('link', { name: 'Login here' });
    this.toast = page.getByRole('alert');
  }

  /** Fills the form and submits. Confirm password defaults to the same password. */
  async register(username: string, password: string, confirmPassword = password): Promise<void> {
    this.log.info(`register as ${username}`);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.registerButton.click();
  }

  async expectToast(message: string): Promise<void> {
    await expect(this.toast).toBeVisible();
    await expect(this.toast).toContainText(message);
  }

  /** On success QKart redirects to the login page. */
  async expectRegistered(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }
}
