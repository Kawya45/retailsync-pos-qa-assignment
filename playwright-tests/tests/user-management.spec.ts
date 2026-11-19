import { test, expect } from '@playwright/test';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  EMPLOYEE_ROLE_ID,
  BRANCH_ID,
  EXISTING_USER_EMAIL,
  NEW_USER_PASSWORD,
} from './env';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'admin@retailsync.com' }).fill(ADMIN_EMAIL);
  await page.getByRole('textbox', { name: '********' }).fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign in to your account' }).click();
  await page.waitForURL('**/dashboard');
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'User & Role Management' }).click({ timeout: 15000 });
});

test.describe('User Management', () => {
  test('creates a new user successfully', async ({ page }) => {
    await page.getByRole('button', { name: 'Add User' }).click();

    const uniqueEmail = `pw.test.${Date.now()}@retailsync.com`;

    await page.getByRole('textbox', { name: 'John', exact: true }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Doe', exact: true }).fill('TestUser');
    await page.getByRole('textbox', { name: 'john_doe' }).fill(`pwtest${Date.now()}`);
    await page.getByRole('textbox', { name: 'john@retailsync.com' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Min. 8 characters' }).fill(NEW_USER_PASSWORD);
    await page.getByRole('combobox').nth(1).selectOption(EMPLOYEE_ROLE_ID); // EMPLOYEE role
    await page.getByRole('combobox').nth(2).selectOption(BRANCH_ID); // a real branch

    await page.getByRole('button', { name: 'Create User' }).click();

    // Confirm the new user actually shows up in the table — this is the real assertion,
    // not just "did the button click work"
    await expect(page.getByText(uniqueEmail)).toBeVisible();
  });

  test('shows an error when creating a user with a duplicate email', async ({ page }) => {
    await page.getByRole('button', { name: 'Add User' }).click();

    // Reuse a known existing seeded email on purpose
    await page.getByRole('textbox', { name: 'John', exact: true }).fill('Duplicate');
    await page.getByRole('textbox', { name: 'Doe', exact: true }).fill('Test');
    await page.getByRole('textbox', { name: 'john_doe' }).fill(`dup${Date.now()}`);
    await page.getByRole('textbox', { name: 'john@retailsync.com' }).fill(EXISTING_USER_EMAIL);
    await page.getByRole('textbox', { name: 'Min. 8 characters' }).fill(NEW_USER_PASSWORD);
    await page.getByRole('combobox').nth(1).selectOption(EMPLOYEE_ROLE_ID);
    await page.getByRole('combobox').nth(2).selectOption(BRANCH_ID);

    await page.getByRole('button', { name: 'Create User' }).click();

    // BUG001: this currently shows a raw technical error instead of a friendly message.
    // This assertion documents the CURRENT (buggy) behavior so the test suite stays accurate.
    // Once BUG001 is fixed, update this to check for a friendly message instead.
    await expect(page.getByText(/status code 409/i)).toBeVisible();
  });
});
