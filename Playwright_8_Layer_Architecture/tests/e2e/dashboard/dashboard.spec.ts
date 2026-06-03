/**
 * Layer 8 - Tests
 * Dashboard specs. Runs authenticated (storageState from auth.setup), so these
 * skip the login UI entirely. Demonstrates API setup/teardown via L5 services.
 */
import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { makeUser } from '../../../src/data/user.factory.js';

test.describe('Dashboard', () => {
  test('loads for an authenticated user @smoke', async ({ dashboardPage }) => {
    await dashboardPage.open();
    await dashboardPage.expectLoaded();
  });

  test('search returns results', async ({ dashboardPage }) => {
    await dashboardPage.open();
    await dashboardPage.header.search('invoices');
    await expect(dashboardPage.page).toHaveURL(/search/);
  });

  test('created user appears then is cleaned up', async ({ dashboardPage, userService }) => {
    const user = makeUser({ role: 'editor' });
    const created = await userService.createUser(user);

    await dashboardPage.open();
    await dashboardPage.nav.goTo('Users');
    await expect(dashboardPage.page.getByText(user.email)).toBeVisible();

    // teardown — keep tests isolated
    await userService.deleteUser(created.id);
  });
});
