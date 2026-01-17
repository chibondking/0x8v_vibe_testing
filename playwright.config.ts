import { defineConfig, devices } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'https://vibe.0x8v.io';
const domain = process.env.DOMAIN || '0x8v.io';

const reporters: any[] = [['line']];
if (process.env.HTML_REPORT === '1' || process.env.CI) {
  reporters.push(['html', { outputFolder: './playwright-report' }]);
}

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
  reporter: reporters,
  outputDir: './test-results/html-report',
});
