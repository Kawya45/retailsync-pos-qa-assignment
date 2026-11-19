import { test, expect } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './env';

test.beforeEach(async ({ page }) => {
  test.setTimeout(120000);

  // Same login flow as user-management.spec.ts
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'admin@retailsync.com' }).fill(ADMIN_EMAIL);
  await page.getByRole('textbox', { name: '********' }).fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign in to your account' }).click();

  await page.waitForURL('**/dashboard', { timeout: 60000 });
  await page.waitForLoadState('networkidle');

  await page.getByRole('link', { name: 'User & Role Management' }).click({ timeout: 15000 });
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: 'Roles & Permissions' }).click();
  await page.waitForLoadState('networkidle');
});

test.describe('Role Management', () => {

  test('creates a new custom role successfully', async ({ page }) => {
    const uniqueRoleName = `TEST_ROLE_${Date.now()}`;

    await page.getByRole('button', { name: /Create Custom Role|Create Role|\+ Create/i }).first().click();

    await page.locator('input[placeholder*="ASSISTANT_MANAGER"], input[placeholder*="Role"]').first().fill(uniqueRoleName);
    await page.locator('textarea').first().fill('Automated test role');

    const form = page.locator('form').first();
    await form.getByText('CREATE USER', { exact: true }).click();
    await form.getByRole('checkbox', { name: 'CREATE USER' }).check();
    await form.getByText('READ USER', { exact: true }).click();
    await form.getByRole('checkbox', { name: 'READ USER' }).check();

    await page.getByRole('button', { name: /Create Role|Save|Submit/i }).click();

    // Simple assertion – just check for success message or role name
    await expect(page.getByText(uniqueRoleName).or(page.getByText(/created successfully|success/i))).toBeVisible({ timeout: 15000 });
  });

  test('shows an error when creating a role with a duplicate name', async ({ page }) => {
    await page.getByRole('button', { name: /Create Custom Role|Create Role|\+ Create/i }).first().click();

    await page.locator('input[placeholder*="ASSISTANT_MANAGER"], input[placeholder*="Role"]').first().fill('cashier');
    await page.locator('textarea').first().fill('Should fail');

    const form = page.locator('form').first();
    await form.getByText('READ USER', { exact: true }).click();
    await form.getByRole('checkbox', { name: 'READ USER' }).check();

    await page.getByRole('button', { name: /Create Role|Save|Submit/i }).click();

    await expect(page.getByText(/already exists|duplicate|Role name already exists/i)).toBeVisible({ timeout: 15000 });
  });

});
