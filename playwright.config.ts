import { defineConfig } from '@playwright/test';

/**
 * Configuração do Playwright para a automação de testes de API da Verzel Store.
 *
 * Os testes exercitam a API documentada na história VZS-142. A URL base pode ser
 * sobrescrita via variável de ambiente BASE_URL, útil para apontar para ambientes
 * alternativos sem alterar o código.
 */
const BASE_URL =
  process.env.BASE_URL ??
  'https://verzel-store.qa-test-verzel-store.workers.dev';

export default defineConfig({
  testDir: './tests',
  // Tempo máximo por teste.
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  // Falha o build de CI caso um test.only seja esquecido no código.
  forbidOnly: !!process.env.CI,
  // Uma nova tentativa em CI para mitigar instabilidade de rede.
  retries: process.env.CI ? 1 : 0,
  // Execução paralela entre arquivos de teste.
  fullyParallel: true,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // Captura trace na primeira retentativa para facilitar a investigação.
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api',
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
