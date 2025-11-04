import { test, expect } from '@playwright/test';

// ============================================
// Layout Area Visibility Tests
// ============================================

test.describe('Layout Area Visibility Tests', () => {
  // ============================================
  // All Areas Visible Tests
  // ============================================

  test('should show all areas on diaries page', async ({ page }) => {
    await page.goto('/diaries');
    
    // 페이지 로드 완료 대기 (data-testid 사용, timeout 400ms 미만)
    await page.waitForSelector('[data-testid="logo-link"]', { timeout: 499 });
    
    // Header 영역 확인
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('[data-testid="logo-link"]')).toBeVisible();
    
    // Banner 영역 확인 (CSS 모듈 클래스명 사용)
    await expect(page.locator('section[class*="banner"]')).toBeVisible();
    
    // Navigation 영역 확인
    await expect(page.locator('nav[class*="navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="diaries-tab"]')).toBeVisible();
    await expect(page.locator('[data-testid="pictures-tab"]')).toBeVisible();
    
    // Footer 영역 확인
    await expect(page.locator('footer')).toBeVisible();
  });

  test.skip('should show all areas on pictures page', async ({ page }) => {
    // 요구사항에 따라 /pictures 페이지는 테스트 skip 대상
    await page.goto('/pictures');
    
    // 페이지 로드 완료 대기 (data-testid 사용, timeout 400ms 미만)
    await page.waitForSelector('[data-testid="logo-link"]', { timeout: 499 });
    
    // Header 영역 확인
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('[data-testid="logo-link"]')).toBeVisible();
    
    // Banner 영역 확인
    await expect(page.locator('section[class*="banner"]')).toBeVisible();
    
    // Navigation 영역 확인
    await expect(page.locator('nav[class*="navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="diaries-tab"]')).toBeVisible();
    await expect(page.locator('[data-testid="pictures-tab"]')).toBeVisible();
    
    // Footer 영역 확인
    await expect(page.locator('footer')).toBeVisible();
  });

  // ============================================
  // All Areas Hidden Tests
  // ============================================

  test.skip('should hide all areas on auth/login page', async ({ page }) => {
    // 요구사항에 따라 /auth/login 페이지는 테스트 skip 대상
    await page.goto('/auth/login');
    
    // 페이지 로드 완료 대기 (data-testid 방식 사용, timeout 400ms 미만)
    await page.waitForSelector('body', { timeout: 499 });
    
    // 모든 영역이 숨겨져 있는지 확인
    await expect(page.locator('header')).not.toBeVisible();
    await expect(page.locator('section[class*="banner"]')).not.toBeVisible();
    await expect(page.locator('nav[class*="navigation"]')).not.toBeVisible();
    await expect(page.locator('footer')).not.toBeVisible();
  });

  test.skip('should hide all areas on auth/signup page', async ({ page }) => {
    // 요구사항에 따라 /auth/signup 페이지는 테스트 skip 대상
    await page.goto('/auth/signup');
    
    // 페이지 로드 완료 대기 (data-testid 방식 사용, timeout 400ms 미만)
    await page.waitForSelector('body', { timeout: 499 });
    
    // 모든 영역이 숨겨져 있는지 확인
    await expect(page.locator('header')).not.toBeVisible();
    await expect(page.locator('section[class*="banner"]')).not.toBeVisible();
    await expect(page.locator('nav[class*="navigation"]')).not.toBeVisible();
    await expect(page.locator('footer')).not.toBeVisible();
  });

  // ============================================
  // Partial Areas Visible Tests
  // ============================================

  test('should show header and footer but hide banner and navigation on diary detail page', async ({ page }) => {
    await page.goto('/diaries/1');
    
    // 페이지 로드 완료 대기 (data-testid 사용, timeout 400ms 미만)
    await page.waitForSelector('[data-testid="logo-link"]', { timeout: 499 });
    
    // Header 영역 확인
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('[data-testid="logo-link"]')).toBeVisible();
    
    // Banner 영역 숨김 확인
    await expect(page.locator('section[class*="banner"]')).not.toBeVisible();
    
    // Navigation 영역 숨김 확인
    await expect(page.locator('nav[class*="navigation"]')).not.toBeVisible();
    
    // Footer 영역 확인
    await expect(page.locator('footer')).toBeVisible();
  });
});
