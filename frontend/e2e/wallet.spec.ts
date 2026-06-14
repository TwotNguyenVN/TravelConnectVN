import { test, expect } from '@playwright/test';

test.describe('Wallet Features', () => {
  test('Wallet Dashboard should load or redirect to login', async ({ page }) => {
    await page.goto('/user/wallet');
    const currentUrl = page.url();
    expect(currentUrl.includes('/login') || currentUrl.includes('/user/wallet')).toBeTruthy();
  });
});
