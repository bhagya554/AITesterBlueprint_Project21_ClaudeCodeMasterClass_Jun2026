/**
 * Layer 7 - Fixtures
 * Dependency-injection wiring. Tests (L8) consume ready objects from L4/L5
 * without constructing them. Also provides automatic teardown.
 */
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { DashboardPage } from '../pages/dashboard.page.js';
import { RegisterPage } from '../pages/register.page.js';
import { ApiClient } from '../services/api-client.js';
import { UserService } from '../services/user.service.js';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  registerPage: RegisterPage;
};

type Services = {
  apiClient: ApiClient;
  userService: UserService;
};

export const test = base.extend<Pages & Services>({
  // --- Page objects (Layer 4) ---
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  // --- Services (Layer 5) with auto-dispose teardown ---
  apiClient: async ({}, use) => {
    const client = await ApiClient.create();
    await use(client);
    await client.dispose();
  },

  userService: async ({ apiClient }, use) => {
    await use(new UserService(apiClient));
  },
});

export { expect } from '@playwright/test';
