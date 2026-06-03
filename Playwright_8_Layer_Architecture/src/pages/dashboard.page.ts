/**
 * Layer 4 - Pages (POM)
 * Dashboard page. Composes Layer 3 components (header + nav).
 */
import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../core/base.page.js';
import { HeaderComponent } from '../components/header.component.js';
import { NavComponent } from '../components/nav.component.js';

export class DashboardPage extends BasePage {
  protected readonly path = '/dashboard';

  readonly header: HeaderComponent;
  readonly nav: NavComponent;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.nav = new NavComponent(page);
    this.welcomeHeading = page.getByRole('heading', { name: /welcome/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.welcomeHeading).toBeVisible();
    await this.header.expectLoggedIn();
  }
}
