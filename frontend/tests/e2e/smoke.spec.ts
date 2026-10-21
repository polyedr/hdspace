import { test, expect } from '@playwright/test';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
const apiUrl = process.env.API_URL || 'http://localhost:18000';

test.describe('HDSpace smoke', () => {
  test('API health is ok', async ({ request }) => {
    const response = await request.get(`${apiUrl}/health/`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('frontend home loads', async ({ page }) => {
    await page.goto(frontendUrl);
    await expect(page).toHaveTitle(/./);
    await expect(page.locator('body')).toBeVisible();
  });

  test('login page is reachable', async ({ page }) => {
    await page.goto(`${frontendUrl}/login`);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    // Login form fields vary by build; ensure page did not crash.
    await expect(page.locator('#root, #app, body')).toBeVisible();
  });
});
