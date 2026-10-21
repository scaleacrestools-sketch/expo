import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts/,
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3100', launchOptions: { executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' } },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  reporter: 'list',
});
