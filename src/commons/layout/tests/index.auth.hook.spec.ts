import { test, expect } from '@playwright/test';

// ============================================
// Layout Auth Hook Tests
// ============================================

test.describe('Layout Auth Hook Tests', () => {
  // ============================================
  // 비로그인 유저 테스트
  // ============================================

  test('비로그인 유저 - 일기목록 페이지에서 로그인 버튼 노출 및 클릭', async ({ page }) => {
    // 1. 비회원으로 /diaries에 접속하여 페이지 로드 확인
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 2. layout의 로그인버튼 노출여부 확인
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toContainText('로그인');

    // 3. 로그인버튼 클릭하여 /auth/login 페이지로 이동
    await loginButton.click();
    await expect(page).toHaveURL('/auth/login');
    await page.waitForSelector('[data-testid="auth-login-container"]', { timeout: 499 });
  });

  // ============================================
  // 로그인 유저 테스트
  // ============================================

  test('로그인 유저 - 로그인 후 로그아웃까지 전체 플로우', async ({ page }) => {
    // 1. 비회원으로 /auth/login에 접속하여 페이지 로드 확인
    await page.goto('/auth/login');
    await page.waitForSelector('[data-testid="auth-login-container"]', { timeout: 499 });

    // 2. 로그인시도
    // email: a@c.com
    // password: 1234qwer
    await page.fill('input[data-testid="email-input"]', 'a@c.com');
    await page.fill('input[data-testid="password-input"]', '1234qwer');
    await page.click('[data-testid="login-submit-button"]');

    // 3. 로그인 성공 후, 완료 모달 클릭하여 /diaries 페이지 로드 확인
    try {
      // 성공 모달이 나타날 때까지 대기
      await page.waitForSelector('[data-testid="login-success-modal"]', { timeout: 499 });
      const successModal = page.locator('[data-testid="login-success-modal"]');
      await expect(successModal).toBeVisible();

      // 확인 버튼 클릭
      await page.click('[data-testid="login-success-modal-confirm"]');

      // /diaries 페이지로 이동 확인
      await expect(page).toHaveURL('/diaries');
      await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
    } catch (e) {
      // 로그인 실패 시 에러 모달 확인
      const errorModal = page.locator('[data-testid="login-error-modal"]');
      if (await errorModal.isVisible()) {
        const errorText = await errorModal.locator('p').textContent();
        console.log('Login failed with error:', errorText);
        throw new Error(`Login failed: ${errorText}`);
      }
      throw e;
    }

    // 4. layout에서 유저이름, 로그아웃버튼 노출여부 확인
    const userName = page.locator('[data-testid="user-name"]');
    const logoutButton = page.locator('[data-testid="logout-button"]');
    
    await expect(userName).toBeVisible();
    await expect(logoutButton).toBeVisible();
    await expect(logoutButton).toContainText('로그아웃');

    // 5. 로그아웃버튼 클릭하여 /auth/login 페이지 로드 확인
    await logoutButton.click();
    await expect(page).toHaveURL('/auth/login');
    await page.waitForSelector('[data-testid="auth-login-container"]', { timeout: 499 });

    // 6. /diaries에 접속하여 페이지 로드 확인
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 7. layout에 로그인버튼 노출여부 확인
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toContainText('로그인');
  });

  // ============================================
  // 로그인 상태별 UI 노출 테스트
  // ============================================

  test('비로그인 상태에서 로그인 버튼만 표시', async ({ page }) => {
    // 일기목록 페이지로 먼저 이동
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 로그아웃 상태 확인 (로컬 스토리지 초기화)
    await page.evaluate(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    });

    // 페이지 새로고침하여 로그아웃 상태 반영
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 로그인 버튼이 표시되는지 확인
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeVisible();

    // 로그아웃 버튼과 유저 이름이 표시되지 않는지 확인
    const logoutButton = page.locator('[data-testid="logout-button"]');
    await expect(logoutButton).not.toBeVisible();
  });

  test('로그인 상태에서 유저 정보와 로그아웃 버튼만 표시', async ({ page }) => {
    // 로그인 먼저 수행
    await page.goto('/auth/login');
    await page.waitForSelector('[data-testid="auth-login-container"]', { timeout: 499 });
    
    await page.fill('input[data-testid="email-input"]', 'a@c.com');
    await page.fill('input[data-testid="password-input"]', '1234qwer');
    await page.click('[data-testid="login-submit-button"]');

    try {
      await page.waitForSelector('[data-testid="login-success-modal"]', { timeout: 5000 });
      await page.click('[data-testid="login-success-modal-confirm"]');
      await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 5000 });
    } catch (e) {
      const errorModal = page.locator('[data-testid="login-error-modal"]');
      if (await errorModal.isVisible()) {
        throw new Error('Login failed during test setup');
      }
      throw e;
    }

    // 일기목록 페이지에서 로그인 상태 확인
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 유저 이름과 로그아웃 버튼이 표시되는지 확인
    const userName = page.locator('[data-testid="user-name"]');
    const logoutButton = page.locator('[data-testid="logout-button"]');
    
    await expect(userName).toBeVisible();
    await expect(logoutButton).toBeVisible();

    // 로그인 버튼이 표시되지 않는지 확인
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).not.toBeVisible();
  });
});

