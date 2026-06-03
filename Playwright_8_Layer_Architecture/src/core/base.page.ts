/**
 * Layer 2 - Core
 * Abstract base for every Page Object. Holds page lifecycle plumbing so
 * concrete pages (Layer 4) only declare locators + intent-revealing actions.
 */
import { Page } from '@playwright/test';
import { createLogger, Logger } from '../utils/logger.js';

export abstract class BasePage {
  readonly page: Page;
  protected readonly log: Logger;

  /** Each concrete page declares its own route, used by open(). */
  protected abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.log = createLogger(this.constructor.name);
  }

  async open(): Promise<void> {
    this.log.info(`navigate -> ${this.path}`);
    await this.page.goto(this.path);
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }
}
