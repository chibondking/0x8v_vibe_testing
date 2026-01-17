import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 0,
  use: {
    baseURL: 'https://vibe.0x8v.io',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: './playwright-report', open: 'never' }],
  ],
  outputDir: './test-results/html-report',
});
