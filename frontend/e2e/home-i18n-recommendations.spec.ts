import { test, expect } from '@playwright/test';

test.describe('Home Page - i18n & Recommendations', () => {
  test('should display translation texts correctly when switching languages', async ({ page, context }) => {
    // Force default language to Vietnamese
    await context.addInitScript(() => {
      window.localStorage.setItem('i18nextLng', 'vi');
    });

    // 1. Go to Home Page
    await page.goto('/');

    // 2. Default language is Vietnamese, check the hero title
    await expect(page.locator('text=Trải nghiệm du lịch theo cách của bạn')).toBeVisible();
    await expect(page.locator('text=Khám phá Tour')).toBeVisible(); // header nav

    // 3. Click the language switcher button
    const langBtn = page.locator('button[title="Switch to English"], button[title="Switch to Vietnamese"]');
    await langBtn.click();

    // 4. Check if text switches to English
    await expect(page.locator('text=Experience travel your way')).toBeVisible();
    await expect(page.locator('text=Discover Tours')).toBeVisible();

    // 5. Switch back to Vietnamese
    await langBtn.click();
    await expect(page.locator('text=Trải nghiệm du lịch theo cách của bạn')).toBeVisible();
  });

});
