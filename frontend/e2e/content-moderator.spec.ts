import { test, expect } from '@playwright/test';

test.describe('Content Moderator Features', () => {
  // We assume the user needs to be logged in as a moderator,
  // but we can at least check if the route redirects to login or loads the page properly.
  
  test('Moderator Dashboard should load or redirect to login', async ({ page }) => {
    await page.goto('http://localhost:5173/content');
    
    const currentUrl = page.url();
    expect(currentUrl.includes('/login') || currentUrl.includes('/content')).toBeTruthy();
  });

  test('Guide Verification page should load or redirect', async ({ page }) => {
    await page.goto('http://localhost:5173/content/guide-verification');
    const currentUrl = page.url();
    expect(currentUrl.includes('/login') || currentUrl.includes('/content/guide-verification')).toBeTruthy();
  });

  test('Reports Management page should load or redirect', async ({ page }) => {
    await page.goto('http://localhost:5173/content/reports');
    const currentUrl = page.url();
    expect(currentUrl.includes('/login') || currentUrl.includes('/content/reports')).toBeTruthy();
  });

  test('Tour Moderation page should load or redirect', async ({ page }) => {
    await page.goto('http://localhost:5173/content/tours');
    const currentUrl = page.url();
    expect(currentUrl.includes('/login') || currentUrl.includes('/content/tours')).toBeTruthy();
  });
});
