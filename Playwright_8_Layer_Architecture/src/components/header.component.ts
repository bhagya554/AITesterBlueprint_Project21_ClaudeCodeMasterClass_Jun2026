/**
 * Layer 3 - Components
 * Site header. Reused by any page that renders the top nav bar.
 */
import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from '../core/base.component.js';

export class HeaderComponent extends BaseComponent {
  readonly userMenu: Locator;
  readonly logoutItem: Locator;
  readonly searchBox: Locator;

  constructor(page: Page) {
    super(page, page.getByRole('banner'));
    this.userMenu = this.root.getByRole('button', { name: 'Account menu' });
    this.logoutItem = page.getByRole('menuitem', { name: 'Log out' });
    this.searchBox = this.root.getByRole('searchbox', { name: 'Search' });
  }

  async logout(): Promise<void> {
    await this.userMenu.click();
    await this.logoutItem.click();
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchBox.press('Enter');
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.userMenu).toBeVisible();
  }
}
