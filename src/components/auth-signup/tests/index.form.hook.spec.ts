import { test, expect, Page } from '@playwright/test';

// ============================================
// Helper Functions
// ============================================

/**
 * 폼 입력 헬퍼 함수
 */
async function fillSignupForm(page: Page, data: { email: string; password: string; passwordConfirm: string; name: string }) {
  await page.fill('[data-testid="email-input"]', data.email);
  await page.fill('[data-testid="password-input"]', data.password);
  await page.fill('[data-testid="passwordConfirm-input"]', data.passwordConfirm);
  await page.fill('[data-testid="name-input"]', data.name);
}

/**
 * 회원가입 성공 시나리오 헬퍼 함수
 */
async function performSuccessfulSignup(page: Page, userData: { email: string; password: string; name: string }) {
  await fillSignupForm(page, {
    ...userData,
    passwordConfirm: userData.password
  });

  // 버튼 활성화 확인
  await expect(page.locator('[data-testid="signup-submit-button"]')).toBeEnabled();

  // 회원가입 버튼 클릭
  await page.click('[data-testid="signup-submit-button"]');

  // 성공 모달 확인
  await expect(page.locator('[data-testid="signup-success-modal"]')).toBeVisible({ timeout: 2000 });
}

// ============================================
// Test Configuration
// ============================================

test.describe('Auth Signup Form Hook Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 회원가입 페이지로 이동
    await page.goto('/auth/signup');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="auth-signup-container"]', { timeout: 2000 });
  });

  // ============================================
  // Success Scenarios
  // ============================================

  test('회원가입 성공 시나리오 - 실제 API 호출', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'password123';
    const testName = '테스트사용자';

    // 헬퍼 함수를 사용하여 회원가입 수행
    await performSuccessfulSignup(page, {
      email: testEmail,
      password: testPassword,
      name: testName
    });

    // 모달 내용 확인
    await expect(page.locator('[data-testid="signup-success-modal"]')).toContainText('회원가입 완료');
    await expect(page.locator('[data-testid="signup-success-modal"]')).toContainText('회원가입이 성공적으로 완료되었습니다.');

    // 확인 버튼 클릭
    await page.click('[data-testid="signup-success-modal-confirm"]');

    // 로그인 페이지로 이동했는지 확인
    await expect(page).toHaveURL('/auth/login');
  });

  // ============================================
  // Failure Scenarios
  // ============================================

  test('회원가입 실패 시나리오 - API 에러', async ({ page }) => {
    // API 응답을 모킹하여 에러 발생시키기
    await page.route('/api/graphql', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [{ message: '이미 존재하는 이메일입니다.' }]
        })
      });
    });

    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    const testName = '테스트사용자';

    // 폼 입력
    await page.fill('[data-testid="email-input"]', testEmail);
    await page.fill('[data-testid="password-input"]', testPassword);
    await page.fill('[data-testid="passwordConfirm-input"]', testPassword);
    await page.fill('[data-testid="name-input"]', testName);

    // 회원가입 버튼 클릭
    await page.click('[data-testid="signup-submit-button"]');

    // 실패 모달이 나타나는지 확인
    await expect(page.locator('[data-testid="signup-error-modal"]')).toBeVisible({ timeout: 2000 });

    // 모달 내용 확인
    await expect(page.locator('[data-testid="signup-error-modal"]')).toContainText('회원가입 실패');
    await expect(page.locator('[data-testid="signup-error-modal"]')).toContainText('이미 존재하는 이메일입니다.');

    // 확인 버튼 클릭
    await page.click('[data-testid="signup-error-modal-confirm"]');

    // 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="signup-error-modal"]')).not.toBeVisible();

    // 여전히 회원가입 페이지에 있는지 확인
    await expect(page).toHaveURL('/auth/signup');
  });

  // ============================================
  // Form Validation Tests
  // ============================================

  test('이메일 검증 테스트', async ({ page }) => {
    // 잘못된 이메일 형식으로 폼 입력
    await fillSignupForm(page, {
      email: 'invalid-email',
      password: 'password123',
      passwordConfirm: 'password123',
      name: '테스트사용자'
    });

    // 버튼이 비활성화되어 있는지 확인
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeDisabled();

    // 올바른 이메일 형식으로 수정
    await page.fill('[data-testid="email-input"]', 'test@example.com');

    // 버튼이 활성화되는지 확인
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeEnabled();
  });

  test('비밀번호 검증 테스트', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    
    // 짧은 비밀번호 입력
    await page.fill('[data-testid="password-input"]', '123');
    await page.fill('[data-testid="passwordConfirm-input"]', '123');
    await page.fill('[data-testid="name-input"]', '테스트사용자');

    // 버튼이 비활성화되어 있는지 확인
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeDisabled();

    // 영문만 있는 비밀번호
    await page.fill('[data-testid="password-input"]', 'password');
    await page.fill('[data-testid="passwordConfirm-input"]', 'password');

    // 버튼이 비활성화되어 있는지 확인
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeDisabled();

    // 올바른 비밀번호 형식
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="passwordConfirm-input"]', 'password123');

    // 버튼이 활성화되는지 확인
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeEnabled();
  });

  test('비밀번호 확인 검증 테스트', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="name-input"]', '테스트사용자');

    // 다른 비밀번호 확인 입력
    await page.fill('[data-testid="passwordConfirm-input"]', 'different123');

    // 버튼이 비활성화되어 있는지 확인
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeDisabled();

    // 같은 비밀번호 확인 입력
    await page.fill('[data-testid="passwordConfirm-input"]', 'password123');

    // 버튼이 활성화되는지 확인
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeEnabled();
  });

  test('이름 검증 테스트', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="passwordConfirm-input"]', 'password123');

    // 빈 이름
    await page.fill('[data-testid="name-input"]', '');

    // 버튼이 비활성화되어 있는지 확인
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeDisabled();

    // 이름 입력
    await page.fill('[data-testid="name-input"]', '테스트사용자');

    // 버튼이 활성화되는지 확인
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeEnabled();
  });

  // ============================================
  // Button State Tests
  // ============================================

  test('모든 필드 입력 시 버튼 활성화', async ({ page }) => {
    // 초기에는 버튼이 비활성화되어 있어야 함
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeDisabled();

    // 하나씩 입력하면서 버튼 상태 확인
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeDisabled();

    await page.fill('[data-testid="password-input"]', 'password123');
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeDisabled();

    await page.fill('[data-testid="passwordConfirm-input"]', 'password123');
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeDisabled();

    // 모든 필드 입력 완료
    await page.fill('[data-testid="name-input"]', '테스트사용자');
    
    // 버튼이 활성화되어야 함
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeEnabled();
  });
});
