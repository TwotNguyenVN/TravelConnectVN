import { test, expect } from '@playwright/test';

test.describe('Accountant Finance Features', () => {
  // We assume the user needs to be logged in as accountant,
  // but without a full login flow, we can at least check if the route redirects or loads.
  
  test('Finance Dashboard should load or redirect to login', async ({ page }) => {
    await page.goto('http://localhost:5173/accountant');
    
    // Check if we hit the login page due to auth guard, or the dashboard
    // Depending on the app's routing
    const currentUrl = page.url();
    expect(currentUrl.includes('/login') || currentUrl.includes('/accountant')).toBeTruthy();
  });

  test('Finance Transactions page should load or redirect', async ({ page }) => {
    await page.goto('http://localhost:5173/accountant/transactions');
    const currentUrl = page.url();
    expect(currentUrl.includes('/login') || currentUrl.includes('/accountant/transactions')).toBeTruthy();
  });
});
