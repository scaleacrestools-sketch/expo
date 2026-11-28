import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  // BASE_URL=https://your-site.netlify.app runs the suite against a deployed site (no local server).
  use: { baseURL: process.env.BASE_URL || 'http://localhost:4173', trace: 'off' },
  webServer: process.env.BASE_URL ? undefined : { command: 'npm run preview', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /responsive|mobile/ },
  ],
});
