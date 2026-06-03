/**
 * Layer 1 - Config (root)
 * Wires the whole stack: testDir -> Layer 8, baseURL/auth -> Layer 1 env,
 * storageState -> produced by tests/setup/auth.setup.ts.
 */
import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env.config.js';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  use: {
    baseURL: env.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: env.authStatePath },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: env.authStatePath },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: env.authStatePath },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'], storageState: env.authStatePath },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: env.baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
