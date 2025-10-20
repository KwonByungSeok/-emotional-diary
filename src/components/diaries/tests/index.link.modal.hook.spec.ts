import { test, expect } from '@playwright/test';

// ============================================
// Diaries Modal Link Functionality Tests
// ============================================

test.describe('Diaries Modal Link Functionality', () => {

  // ============================================
  // Modal Open Tests
  // ============================================

  test('일기쓰기 버튼 클릭 시 모달이 열려야 합니다', async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용, timeout 400ms 미만)
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 400 });
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="diary-write-button"]');
    
    // 모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();
  });

  // ============================================
  // Modal Close Tests
  // ============================================

  test('모달의 닫기 버튼 클릭 시 모달이 닫혀야 합니다', async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용, timeout 400ms 미만)
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 400 });
    
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('[data-testid="diary-write-button"]');
    
    // 모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();
    
    // 닫기 버튼 클릭
    await page.click('button:has-text("닫기")');
    
    // 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="diaries-new-modal"]')).not.toBeVisible();
  });

  test('모달의 등록하기 버튼 클릭 시 필수 필드 검증이 작동해야 합니다', async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용, timeout 400ms 미만)
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 400 });
    
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('[data-testid="diary-write-button"]');
    
    // 모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();
    
    // alert 이벤트 리스너 설정 (필수 필드 미입력으로 인한)
    const dialogPromise = page.waitForEvent('dialog');
    
    // 등록하기 버튼 클릭 (필수 필드 미입력으로 alert 발생 예상)
    await page.locator('button:has-text("등록하기")').click({ force: true });
    
    // alert 확인 및 처리
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe('모든 필드를 입력해주세요.');
    await dialog.accept();
    
    // 모달이 여전히 열려있는지 확인 (등록 실패로 인해 모달이 닫히지 않음)
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();
  });

  // ============================================
  // Modal Interaction Tests
  // ============================================

  test('모달 외부 클릭 시 모달이 닫혀야 합니다', async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용, timeout 400ms 미만)
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 400 });
    
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('[data-testid="diary-write-button"]');
    
    // 모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();
    
    // 모달 배경 오버레이 확인
    const backdrop = page.locator('.fixed.inset-0');
    await expect(backdrop).toBeVisible();
    
    // 모달 외부(배경) 클릭 (배경의 왼쪽 상단 모서리 클릭)
    await backdrop.click({ position: { x: 10, y: 10 } });
    
    // 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="diaries-new-modal"]')).not.toBeVisible();
  });

  test('ESC 키로 모달이 닫혀야 합니다', async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용, timeout 400ms 미만)
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 400 });
    
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('[data-testid="diary-write-button"]');
    
    // 모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();
    
    // ESC 키 누르기
    await page.keyboard.press('Escape');
    
    // 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="diaries-new-modal"]')).not.toBeVisible();
  });
});
