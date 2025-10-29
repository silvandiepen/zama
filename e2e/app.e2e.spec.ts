/**
 * End-to-end test suite for the Zama application.
 * Tests critical user flows including authentication, API key management,
 * feature flags, and usage charts to ensure the application works correctly.
 */
import { test, expect } from '@playwright/test';

/**
 * Tests guest sign-in flow and verifies redirect to dashboard.
 */
test('guest sign-in redirects to dashboard', async ({ page }) => {
  await page.goto('/signin');
  await page.getByRole('button', { name: /continue as guest/i }).click();
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.getByText(/dashboard/i)).toBeVisible();
});

/**
 * Tests complete API key lifecycle: creation, reveal, copying, and revocation.
 */
test('create then revoke API key', async ({ page }) => {
  await page.goto('/signin');
  await page.getByRole('button', { name: /continue as guest/i }).click();
  await page.goto('/keys');
  await page.getByRole('button', { name: /add key/i }).click();
  await page.getByLabel(/title/i).fill('Playwright Key');
  await page.getByRole('button', { name: /generate|create/i }).click();
  // Reveal modal appears
  await expect(page.getByText(/only shown once/i)).toBeVisible();
  await page.getByRole('button', { name: /copy/i }).click();
  await page.getByRole('button', { name: /close|dismiss/i }).click({ trial: true }).catch(() => {});
  // Revoke the key
  await page.getByRole('button', { name: /revoke/i }).first().click();
  await expect(page.getByText(/revoked/i).first()).toBeVisible();
});

/**
 * Tests feature flag functionality by toggling user menu visibility.
 */
test('feature flag hides user menu', async ({ page }) => {
  await page.goto('/signin');
  await page.getByRole('button', { name: /continue as guest/i }).click();
  await page.getByRole('button', { name: /show dev/i }).click();
  // Disable user menu flag
  await page.getByText(/show user menu/i).click();
  await expect(page.getByText(/guest/i)).toHaveCount(0);
});

/**
 * Tests usage page functionality and chart rendering.
 */
test('usage chart visible with data', async ({ page }) => {
  await page.goto('/signin');
  await page.getByRole('button', { name: /continue as guest/i }).click();
  await page.goto('/usage');
  await expect(page.getByText(/usage/i)).toBeVisible();
  // Chart canvas present
  await expect(page.locator('canvas')).toHaveCount(1);
});

/**
 * Tests empty state display when no API keys exist.
 */
test('empty state when no keys', async ({ page }) => {
  // Start clean storage
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/signin');
  await page.getByRole('button', { name: /continue as guest/i }).click();
  await page.goto('/keys');
  await expect(page.getByText(/no api keys yet/i)).toBeVisible();
});

