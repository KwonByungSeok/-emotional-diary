import { test, expect } from '@playwright/test';

// ============================================
// Retrospect Form Hook Tests
// ============================================

test.describe('회고 등록 폼 기능', () => {
  // ============================================
  // Test Setup & Teardown
  // ============================================

  test.beforeEach(async ({ page }) => {
    // 로컬스토리지 초기화
    await page.goto('/diaries/1');
    await page.evaluate(() => {
      localStorage.removeItem('retrospects');
    });
  });

  test.afterEach(async ({ page }) => {
    // 테스트 후 로컬스토리지 정리
    await page.evaluate(() => {
      localStorage.removeItem('retrospects');
    });
  });

  // ============================================
  // Input Button Activation Tests
  // ============================================

  test.skip('회고 입력 필드에 입력하면 입력 버튼이 활성화된다', async ({ page }) => {
    // /diaries/[id] 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 완료 대기 (data-testid 사용, timeout 500ms 미만)
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 회고 입력 필드 찾기
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    
    // 초기 상태: 입력 버튼이 비활성화되어 있는지 확인
    await expect(submitButton).toBeDisabled();
    
    // 회고 입력
    await retrospectInput.fill('오늘 하루도 고생했다');
    
    // 입력 버튼이 활성화되었는지 확인
    await expect(submitButton).toBeEnabled();
  });

  test.skip('회고 입력 필드가 비어있으면 입력 버튼이 비활성화된다', async ({ page }) => {
    // /diaries/[id] 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 회고 입력 필드 찾기
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    
    // 입력 후 삭제
    await retrospectInput.fill('테스트');
    await retrospectInput.clear();
    
    // 입력 버튼이 비활성화되었는지 확인
    await expect(submitButton).toBeDisabled();
  });

  // ============================================
  // Retrospect Registration Tests (Empty Storage)
  // ============================================

  test.skip('등록하기 버튼 클릭 시 로컬스토리지에 새로운 retrospects 배열을 생성하여 저장한다 (기존 데이터 없음)', async ({ page }) => {
    // /diaries/[id] 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 회고 입력 및 등록
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    
    await retrospectInput.fill('첫 번째 회고입니다');
    await submitButton.click();
    
    // 페이지 새로고침 대기 (새로고침 후 페이지 로드 확인)
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 로컬스토리지에서 데이터 확인
    const storedData = await page.evaluate(() => {
      return localStorage.getItem('retrospects');
    });
    
    expect(storedData).not.toBeNull();
    
    const retrospects = JSON.parse(storedData!);
    expect(retrospects).toHaveLength(1);
    expect(retrospects[0]).toMatchObject({
      id: 1,
      content: '첫 번째 회고입니다',
      diaryId: 1,
    });
    expect(retrospects[0].createdAt).toBeDefined();
    expect(typeof retrospects[0].createdAt).toBe('string');
  });

  // ============================================
  // Retrospect Registration Tests (Existing Data)
  // ============================================

  test.skip('등록하기 버튼 클릭 시 기존 retrospects에 push하고 id를 가장 큰 id+1로 설정한다 (기존 데이터 있음)', async ({ page }) => {
    // 기존 데이터 설정
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    await page.evaluate(() => {
      const existingRetrospects = [
        {
          id: 1,
          content: '기존 회고 1',
          diaryId: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 3,
          content: '기존 회고 2',
          diaryId: 1,
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('retrospects', JSON.stringify(existingRetrospects));
    });
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 새로운 회고 등록
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    
    await retrospectInput.fill('새로운 회고입니다');
    await submitButton.click();
    
    // 페이지 새로고침 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 로컬스토리지에서 데이터 확인
    const storedData = await page.evaluate(() => {
      return localStorage.getItem('retrospects');
    });
    
    const retrospects = JSON.parse(storedData!);
    expect(retrospects).toHaveLength(3);
    
    // 새로 추가된 회고가 id 4로 저장되었는지 확인 (가장 큰 id 3 + 1)
    const newRetrospect = retrospects.find((r: { content: string }) => r.content === '새로운 회고입니다');
    expect(newRetrospect).toBeDefined();
    expect(newRetrospect.id).toBe(4);
    expect(newRetrospect.diaryId).toBe(1);
  });

  // ============================================
  // Page Refresh Test
  // ============================================

  test.skip('등록 완료 후 현재 페이지가 새로고침된다', async ({ page }) => {
    // /diaries/[id] 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 회고 등록
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    
    await retrospectInput.fill('새로고침 테스트');
    await submitButton.click();
    
    // 페이지 새로고침 후 로드 완료 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 입력 필드가 비워졌는지 확인 (새로고침 후 상태)
    const inputValue = await retrospectInput.inputValue();
    expect(inputValue).toBe('');
  });
});

