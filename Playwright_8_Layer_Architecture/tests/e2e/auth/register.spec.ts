/**
 * Layer 8 - Tests
 * Register (signup) specs. Consumes Layer 7 fixtures only — no manual page
 * construction, no literal selectors. Reads as a user journey.
 *
 * Note: targets the QKart register page. Run with BASE_URL pointed at
 * https://crio-qkart-frontend-qa.vercel.app for these to pass end-to-end.
 */
import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { randomString } from '../../../src/utils/helpers.js';

test.describe('Register functionality', () => {
  test('registers a new user with valid credentials @smoke', async ({ registerPage }) => {
    await registerPage.open();
    const username = `qa_${randomString(8)}`;
    await registerPage.register(username, 'Secret123');
    await registerPage.expectRegistered();
  });

  test('shows error when passwords do not match @smoke', async ({ registerPage }) => {
    await registerPage.open();
    await registerPage.register(`qa_${randomString(8)}`, 'Secret123', 'Mismatch123');
    await registerPage.expectToast('do not match');
  });

  test('navigates to the login page via "Login here"', async ({ registerPage, page }) => {
    await registerPage.open();
    await registerPage.loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
