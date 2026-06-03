/**
 * Layer 8 - Tests (setup project)
 * Runs once before browser projects; stores authenticated storage state so
 * specs start logged-in. Wires L1 config + L4 pages + L6 data.
 */
import { test as setup } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { DashboardPage } from '../../src/pages/dashboard.page.js';
import { adminCredentials } from '../../src/data/credentials.js';
import { env } from '../../src/config/env.config.js';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboard = new DashboardPage(page);

  await loginPage.open();
  await loginPage.login(adminCredentials.email, adminCredentials.password);
  await dashboard.expectLoaded();

  await page.context().storageState({ path: env.authStatePath });
});
