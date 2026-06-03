/**
 * Layer 3 - Components
 * Primary sidebar navigation.
 */
import { Page } from '@playwright/test';
import { BaseComponent } from '../core/base.component.js';

export class NavComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.getByRole('navigation', { name: 'Primary' }));
  }

  async goTo(linkName: string): Promise<void> {
    await this.root.getByRole('link', { name: linkName }).click();
  }
}
