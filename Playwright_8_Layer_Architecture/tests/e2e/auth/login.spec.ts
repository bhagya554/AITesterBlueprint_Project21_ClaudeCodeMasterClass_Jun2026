/**
 * Layer 8 - Tests
 * Login specs. Consumes Layer 7 fixtures + Layer 6 data only — no manual
 * construction, no literal selectors. Reads as a user journey.
 */
import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { adminCredentials, invalidCredentials } from '../../../src/data/credentials.js';

test.describe('Login functionality', () => {
  test('logs in with valid credentials @smoke @critical', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(adminCredentials.email, adminCredentials.password);
    await dashboardPage.expectLoaded();
  });

  test('shows error for invalid credentials @smoke', async ({ loginPage }) => {
    await loginPage.login(invalidCredentials.email, invalidCredentials.password);
    await loginPage.expectErrorMessage('Invalid email or password');
  });

  test('navigates to forgot password page', async ({ loginPage, page }) => {
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });
});
