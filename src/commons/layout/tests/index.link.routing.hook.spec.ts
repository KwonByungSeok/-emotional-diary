import { test, expect } from '@playwright/test';

// ============================================
// Layout Link Routing Tests
// ============================================

test.describe('Layout Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    // 일기목록 페이지로 이동하여 테스트 시작
    await page.goto('/diaries');
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });
  });

  // ============================================
  // Logo Navigation Tests
  // ============================================

  test('로고 클릭 시 일기목록 페이지로 이동 (사진목록에서)', async ({ page }) => {
    // 사진목록 페이지로 이동
    await page.goto('/pictures');
    await page.waitForSelector('[data-testid="pictures-page"]', { timeout: 500 });

    // 로고 클릭
    await page.click('[data-testid="logo-link"]');

    // 일기목록 페이지로 이동했는지 확인
    await expect(page).toHaveURL('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });
  });

  test('로고 클릭 시 일기목록 페이지로 이동 (일기목록에서)', async ({ page }) => {
    // 이미 일기목록 페이지에 있으므로 로고 클릭 시에도 같은 페이지에 머물러야 함
    await page.click('[data-testid="logo-link"]');
    await expect(page).toHaveURL('/diaries');
  });

  // ============================================
  // Tab Navigation Tests
  // ============================================

  test('일기보관함 탭 클릭 시 일기목록 페이지로 이동', async ({ page }) => {
    // 사진목록 페이지로 이동
    await page.goto('/pictures');
    await page.waitForSelector('[data-testid="pictures-page"]', { timeout: 500 });

    // 일기보관함 탭 클릭
    await page.click('[data-testid="diaries-tab"]');

    // 일기목록 페이지로 이동했는지 확인
    await expect(page).toHaveURL('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });
  });

  test('사진보관함 탭 클릭 시 사진목록 페이지로 이동', async ({ page }) => {
    // 일기목록 페이지에서 사진보관함 탭 클릭
    await page.click('[data-testid="pictures-tab"]');

    // 사진목록 페이지로 이동했는지 확인
    await expect(page).toHaveURL('/pictures');
    await page.waitForSelector('[data-testid="pictures-page"]', { timeout: 500 });
  });

  // ============================================
  // Active State Visual Tests
  // ============================================

  test('일기목록 페이지에서 일기보관함 탭이 활성 상태', async ({ page }) => {
    // 일기목록 페이지에서 시작
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });

    // 일기보관함 탭이 활성 상태인지 확인
    const diariesTab = page.locator('[data-testid="diaries-tab-text"]');
    await expect(diariesTab).toHaveClass(/tabTextActive/);

    // 사진보관함 탭이 비활성 상태인지 확인
    const picturesTab = page.locator('[data-testid="pictures-tab-text"]');
    await expect(picturesTab).toHaveClass(/tabTextInactive/);

    // 일기보관함 탭 컨테이너가 activeTab 클래스를 가지는지 확인
    const diariesTabContainer = page.locator('[data-testid="diaries-tab"]');
    await expect(diariesTabContainer).toHaveClass(/activeTab/);
  });

  test('사진목록 페이지에서 사진보관함 탭이 활성 상태', async ({ page }) => {
    // 사진목록 페이지로 이동
    await page.goto('/pictures');
    await page.waitForSelector('[data-testid="pictures-page"]', { timeout: 500 });

    // 사진보관함 탭이 활성 상태인지 확인
    const picturesTab = page.locator('[data-testid="pictures-tab-text"]');
    await expect(picturesTab).toHaveClass(/tabTextActive/);

    // 일기보관함 탭이 비활성 상태인지 확인
    const diariesTab = page.locator('[data-testid="diaries-tab-text"]');
    await expect(diariesTab).toHaveClass(/tabTextInactive/);

    // 사진보관함 탭 컨테이너가 activeTab 클래스를 가지는지 확인
    const picturesTabContainer = page.locator('[data-testid="pictures-tab"]');
    await expect(picturesTabContainer).toHaveClass(/activeTab/);
  });

  // ============================================
  // User Scenario Tests
  // ============================================

  test('사용자 시나리오: 사진목록에서 일기목록으로 이동 후 다시 사진목록으로', async ({ page }) => {
    // 1. 사진목록 페이지로 이동
    await page.goto('/pictures');
    await page.waitForSelector('[data-testid="pictures-page"]', { timeout: 500 });

    // 2. 일기보관함 탭 클릭하여 일기목록으로 이동
    await page.click('[data-testid="diaries-tab"]');
    await expect(page).toHaveURL('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });

    // 3. 사진보관함 탭 클릭하여 다시 사진목록으로 이동
    await page.click('[data-testid="pictures-tab"]');
    await expect(page).toHaveURL('/pictures');
    await page.waitForSelector('[data-testid="pictures-page"]', { timeout: 500 });
  });

  test('사용자 시나리오: 로고를 통한 홈 네비게이션', async ({ page }) => {
    // 1. 사진목록 페이지로 이동
    await page.goto('/pictures');
    await page.waitForSelector('[data-testid="pictures-page"]', { timeout: 500 });

    // 2. 로고 클릭하여 일기목록으로 이동
    await page.click('[data-testid="logo-link"]');
    await expect(page).toHaveURL('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });

    // 3. 사진보관함 탭 클릭하여 다시 사진목록으로 이동
    await page.click('[data-testid="pictures-tab"]');
    await expect(page).toHaveURL('/pictures');
    await page.waitForSelector('[data-testid="pictures-page"]', { timeout: 500 });

    // 4. 다시 로고 클릭하여 일기목록으로 이동
    await page.click('[data-testid="logo-link"]');
    await expect(page).toHaveURL('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });
  });

  // ============================================
  // Edge Case Tests
  // ============================================

  test('연속 탭 클릭 시 올바른 상태 유지', async ({ page }) => {
    // 일기목록 페이지에서 시작
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });

    // 일기보관함 탭을 연속으로 클릭
    await page.click('[data-testid="diaries-tab"]');
    await page.click('[data-testid="diaries-tab"]');
    await page.click('[data-testid="diaries-tab"]');

    // 여전히 일기목록 페이지에 있어야 함
    await expect(page).toHaveURL('/diaries');
    
    // 일기보관함 탭이 활성 상태를 유지해야 함
    const diariesTab = page.locator('[data-testid="diaries-tab-text"]');
    await expect(diariesTab).toHaveClass(/tabTextActive/);
  });

  test('빠른 탭 전환 시 올바른 최종 상태', async ({ page }) => {
    // 일기목록 페이지에서 시작
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });

    // 빠르게 탭들을 클릭
    await page.click('[data-testid="pictures-tab"]');
    await page.click('[data-testid="diaries-tab"]');
    await page.click('[data-testid="pictures-tab"]');

    // 최종적으로 사진목록 페이지에 있어야 함
    await expect(page).toHaveURL('/pictures');
    await page.waitForSelector('[data-testid="pictures-page"]', { timeout: 500 });

    // 사진보관함 탭이 활성 상태여야 함
    const picturesTab = page.locator('[data-testid="pictures-tab-text"]');
    await expect(picturesTab).toHaveClass(/tabTextActive/);
  });
});
