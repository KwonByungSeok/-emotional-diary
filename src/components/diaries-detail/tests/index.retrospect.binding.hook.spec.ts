import { test, expect } from '@playwright/test';

// ============================================
// Retrospect Binding Hook Tests
// ============================================

test.describe('회고 데이터 바인딩 기능', () => {
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
  // Success Scenarios
  // ============================================

  test('diaryId가 일치하는 회고 데이터가 올바르게 바인딩되어 표시된다', async ({ page }) => {
    // 일기 데이터와 회고 데이터 설정
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    await page.evaluate(() => {
      // 일기 데이터 설정
      const diaries = [
        {
          id: 1,
          title: '테스트 일기',
          content: '테스트 내용',
          emotion: 'HAPPY',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('diaries', JSON.stringify(diaries));
      
      // 회고 데이터 설정
      const retrospects = [
        {
          id: 1,
          content: '첫 번째 회고입니다',
          diaryId: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          content: '두 번째 회고입니다',
          diaryId: 1,
          createdAt: '2024-01-02T00:00:00.000Z',
        },
        {
          id: 3,
          content: '다른 일기의 회고',
          diaryId: 2,
          createdAt: '2024-01-03T00:00:00.000Z',
        },
      ];
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    });
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 회고 리스트가 렌더링될 때까지 대기 (첫 번째 회고 컨텐츠가 나타날 때까지)
    await page.waitForSelector('[data-testid="retrospect-content"]', { timeout: 499 });
    
    // 회고 리스트 확인 - diaryId가 1인 회고만 표시되어야 함
    const retrospectItems = page.locator('[data-testid="retrospect-item"]');
    const count = await retrospectItems.count();
    
    expect(count).toBe(2); // diaryId가 1인 회고는 2개
    
    // 첫 번째 회고 내용 확인
    const firstContent = page.locator('[data-testid="retrospect-item"]').first().locator('[data-testid="retrospect-content"]');
    await expect(firstContent).toContainText('첫 번째 회고입니다');
    
    // 두 번째 회고 내용 확인
    const secondContent = page.locator('[data-testid="retrospect-item"]').nth(1).locator('[data-testid="retrospect-content"]');
    await expect(secondContent).toContainText('두 번째 회고입니다');
    
    // 다른 일기의 회고는 표시되지 않아야 함
    const allContent = await page.locator('[data-testid="retrospect-content"]').allTextContents();
    expect(allContent).not.toContain('다른 일기의 회고');
  });

  test('회고의 날짜가 올바른 형식으로 표시된다', async ({ page }) => {
    // 일기 데이터와 회고 데이터 설정
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    await page.evaluate(() => {
      // 일기 데이터 설정
      const diaries = [
        {
          id: 1,
          title: '테스트 일기',
          content: '테스트 내용',
          emotion: 'HAPPY',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('diaries', JSON.stringify(diaries));
      
      // 회고 데이터 설정
      const retrospects = [
        {
          id: 1,
          content: '날짜 테스트 회고',
          diaryId: 1,
          createdAt: '2024-01-15T12:30:00.000Z',
        },
      ];
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    });
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 회고 리스트가 렌더링될 때까지 대기 (회고 컨텐츠가 나타날 때까지)
    await page.waitForSelector('[data-testid="retrospect-content"]', { timeout: 499 });
    
    // 날짜 표시 확인
    const dateText = page.locator('[data-testid="retrospect-item"]').first().locator('[data-testid="retrospect-date"]');
    await expect(dateText).toBeVisible();
    
    // 날짜 형식이 올바른지 확인 (한국 형식)
    const dateContent = await dateText.textContent();
    expect(dateContent).toMatch(/\[\d{4}\.\s?\d{2}\.\s?\d{2}\]/);
  });

  test('다른 diaryId의 페이지에서는 해당 diaryId의 회고만 표시된다', async ({ page }) => {
    // 일기 데이터와 회고 데이터 설정
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    await page.evaluate(() => {
      // 일기 데이터 설정
      const diaries = [
        {
          id: 1,
          title: '테스트 일기 1',
          content: '테스트 내용 1',
          emotion: 'HAPPY',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          title: '테스트 일기 2',
          content: '테스트 내용 2',
          emotion: 'SAD',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
        {
          id: 3,
          title: '테스트 일기 3',
          content: '테스트 내용 3',
          emotion: 'ANGRY',
          createdAt: '2024-01-03T00:00:00.000Z',
        },
      ];
      localStorage.setItem('diaries', JSON.stringify(diaries));
      
      // 회고 데이터 설정
      const retrospects = [
        {
          id: 1,
          content: '일기 1의 회고',
          diaryId: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          content: '일기 2의 회고',
          diaryId: 2,
          createdAt: '2024-01-02T00:00:00.000Z',
        },
        {
          id: 3,
          content: '일기 3의 회고',
          diaryId: 3,
          createdAt: '2024-01-03T00:00:00.000Z',
        },
      ];
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    });
    
    // diaryId가 2인 페이지로 이동
    await page.goto('/diaries/2');
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 회고 리스트가 렌더링될 때까지 대기 (회고 컨텐츠가 나타날 때까지)
    await page.waitForSelector('[data-testid="retrospect-content"]', { timeout: 499 });
    
    // diaryId가 2인 회고만 표시되어야 함
    const retrospectItems = page.locator('[data-testid="retrospect-item"]');
    const count = await retrospectItems.count();
    
    expect(count).toBe(1);
    
    const content = page.locator('[data-testid="retrospect-item"]').first().locator('[data-testid="retrospect-content"]');
    await expect(content).toContainText('일기 2의 회고');
    
    // 다른 일기의 회고는 표시되지 않아야 함
    const allContent = await page.locator('[data-testid="retrospect-content"]').allTextContents();
    expect(allContent).not.toContain('일기 1의 회고');
    expect(allContent).not.toContain('일기 3의 회고');
  });

  test('회고가 없을 때 빈 리스트가 표시된다', async ({ page }) => {
    // 로컬스토리지에 회고 데이터 없음
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 회고 리스트가 비어있는지 확인
    const retrospectItems = page.locator('[data-testid="retrospect-item"]');
    const count = await retrospectItems.count();
    
    expect(count).toBe(0);
  });

  test('다른 diaryId의 회고만 있고 현재 diaryId의 회고가 없을 때 빈 리스트가 표시된다', async ({ page }) => {
    // 일기 데이터와 다른 diaryId의 회고만 설정
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    await page.evaluate(() => {
      // 일기 데이터 설정
      const diaries = [
        {
          id: 1,
          title: '테스트 일기',
          content: '테스트 내용',
          emotion: 'HAPPY',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          title: '테스트 일기 2',
          content: '테스트 내용 2',
          emotion: 'SAD',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('diaries', JSON.stringify(diaries));
      
      // 다른 diaryId의 회고만 설정
      const retrospects = [
        {
          id: 1,
          content: '다른 일기의 회고',
          diaryId: 2,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    });
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 회고 리스트가 비어있는지 확인
    const retrospectItems = page.locator('[data-testid="retrospect-item"]');
    const count = await retrospectItems.count();
    
    expect(count).toBe(0);
  });

  // ============================================
  // Edge Cases
  // ============================================

  test('로컬스토리지에 retrospects 키가 없을 때 빈 리스트가 표시된다', async ({ page }) => {
    // 로컬스토리지에 retrospects 키 자체가 없음
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 회고 리스트가 비어있는지 확인
    const retrospectItems = page.locator('[data-testid="retrospect-item"]');
    const count = await retrospectItems.count();
    
    expect(count).toBe(0);
  });

  test('로컬스토리지에 잘못된 형식의 데이터가 있을 때 에러 없이 빈 리스트가 표시된다', async ({ page }) => {
    // 일기 데이터 설정 및 잘못된 형식의 회고 데이터 설정
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    await page.evaluate(() => {
      // 일기 데이터 설정
      const diaries = [
        {
          id: 1,
          title: '테스트 일기',
          content: '테스트 내용',
          emotion: 'HAPPY',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('diaries', JSON.stringify(diaries));
      
      // 잘못된 형식의 회고 데이터 설정
      localStorage.setItem('retrospects', 'invalid json');
    });
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
    
    // 에러 없이 빈 리스트가 표시되어야 함
    const retrospectItems = page.locator('[data-testid="retrospect-item"]');
    const count = await retrospectItems.count();
    
    expect(count).toBe(0);
  });
});

