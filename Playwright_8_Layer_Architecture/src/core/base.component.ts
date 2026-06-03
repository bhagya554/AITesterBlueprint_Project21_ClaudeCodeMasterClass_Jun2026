/**
 * Layer 2 - Core
 * Abstract base for reusable UI components (Layer 3). A component is scoped to
 * a root Locator so the same widget can be reused across many pages.
 */
import { Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
  readonly page: Page;
  readonly root: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }
}
