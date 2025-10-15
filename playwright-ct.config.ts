// playwright-ct.config.ts
import { defineConfig, devices } from '@playwright/experimental-ct-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'path';

export default defineConfig({
  testDir: './src',
  testMatch: /.*\.spec\.tsx/,
  snapshotDir: './__snapshots__',
  timeout: 10 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    ctTemplateDir: './playwright',
    ctPort: 3100,
    ctViteConfig: {
      resolve: {
        alias: {
          '@': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src'),
        },
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
