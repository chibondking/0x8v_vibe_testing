import { defineConfig, devices } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'https://vibe.0x8v.io';
const domain = process.env.DOMAIN || '0x8v.io';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 60000,
  retries: 0,
  use: {
    baseURL: baseUrl,
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [
    ['line'],
    ['html', { outputFolder: './playwright-report' }],
  ],
  outputDir: './test-results/html-report',
});
