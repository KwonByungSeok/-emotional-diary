import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

// ============================================
// Type Definitions
// ============================================

/**
 * Window 인터페이스 확장 (테스트 환경 변수 추가)
 */
declare global {
  interface Window {
    /**
     * 테스트 환경에서 로그인 검사 패스 여부
     * - true 또는 undefined: 로그인 검사 패스
     * - false: 로그인 검사 수행
     */
    __TEST_BYPASS__?: boolean;
  }
}

// ============================================
// Diaries Filter Functionality Tests
// ============================================

test.describe('Diaries Filter Functionality', () => {

  // ============================================
  // Test Setup
  // ============================================

  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 window.__TEST_BYPASS__ 초기화
    // 기본값은 "로그인 유저"로 설정
    await page.goto('/diaries');
    await page.evaluate(() => {
      // 기본값: 로그인 유저 (undefined 또는 true)
      window.__TEST_BYPASS__ = true;
    });
  });

  // ============================================
  // Filter Menu Tests
  // ============================================

  test('필터 선택박스 클릭 시 선택 가능한 메뉴가 표시되어야 합니다', async ({ page }) => {
    // 테스트용 일기 데이터 설정 (로컬스토리지)
    const testDiaries = [
      {
        id: 1,
        title: '행복한 일기',
        content: '오늘은 행복한 하루였어요',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        title: '슬픈 일기',
        content: '오늘은 슬픈 하루였어요',
        emotion: EmotionType.SAD,
        createdAt: '2024-01-02T00:00:00.000Z'
      }
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 2. 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="diary-filter-select"] button[type="button"]');
    await filterSelect.click();

    // 3. 드롭다운 메뉴가 열렸는지 확인
    const dropdown = page.locator('ul[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 499 });

    // 4. 선택 가능한 메뉴 옵션 확인
    const options = dropdown.locator('li[role="option"]');
    const optionCount = await options.count();
    expect(optionCount).toBe(6); // 전체 + 5개 emotion (HAPPY, SAD, ANGRY, SURPRISE, ETC)

    // 5. 각 옵션의 텍스트 확인
    const optionTexts = await options.allTextContents();
    expect(optionTexts).toContain('전체');
    expect(optionTexts).toContain('행복해요');
    expect(optionTexts).toContain('슬퍼요');
    expect(optionTexts).toContain('놀랐어요');
    expect(optionTexts).toContain('화나요');
  });

  // ============================================
  // Filter by Emotion Tests
  // ============================================

  test('행복해요 필터 선택 시 행복한 일기만 노출되어야 합니다', async ({ page }) => {
    // 테스트용 일기 데이터 설정 (다양한 emotion 포함)
    const testDiaries = [
      {
        id: 1,
        title: '행복한 일기',
        content: '오늘은 행복한 하루였어요',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        title: '슬픈 일기',
        content: '오늘은 슬픈 하루였어요',
        emotion: EmotionType.SAD,
        createdAt: '2024-01-02T00:00:00.000Z'
      },
      {
        id: 3,
        title: '또 다른 행복한 일기',
        content: '오늘도 행복한 하루였어요',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-01-03T00:00:00.000Z'
      },
      {
        id: 4,
        title: '화난 일기',
        content: '오늘은 화난 하루였어요',
        emotion: EmotionType.ANGRY,
        createdAt: '2024-01-04T00:00:00.000Z'
      }
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 초기에는 모든 일기가 표시되어야 함
    const initialCards = page.locator('[data-testid="diary-card"]');
    const initialCount = await initialCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // 2. 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="diary-filter-select"] button[type="button"]');
    await filterSelect.click();

    // 3. "행복해요" 옵션 선택
    const dropdown = page.locator('ul[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 499 });
    await page.locator('li[role="option"]:has-text("행복해요")').click();

    // 4. 선택한 emotion과 일치하는 일기 카드만 노출되는지 확인
    await page.waitForTimeout(100); // 필터링 처리 대기
    const filteredCards = page.locator('[data-testid="diary-card"]');
    const filteredCount = await filteredCards.count();
    
    // 행복한 일기는 2개
    expect(filteredCount).toBe(2);

    // 각 카드의 emotion 확인
    for (let i = 0; i < filteredCount; i++) {
      const emotionLabel = filteredCards.nth(i).locator('[data-testid="diary-emotion"]');
      const emotionText = await emotionLabel.textContent();
      expect(emotionText).toBe('행복해요');
    }
  });

  test('슬퍼요 필터 선택 시 슬픈 일기만 노출되어야 합니다', async ({ page }) => {
    // 테스트용 일기 데이터 설정
    const testDiaries = [
      {
        id: 1,
        title: '행복한 일기',
        content: '오늘은 행복한 하루였어요',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        title: '슬픈 일기',
        content: '오늘은 슬픈 하루였어요',
        emotion: EmotionType.SAD,
        createdAt: '2024-01-02T00:00:00.000Z'
      },
      {
        id: 3,
        title: '또 다른 슬픈 일기',
        content: '오늘도 슬픈 하루였어요',
        emotion: EmotionType.SAD,
        createdAt: '2024-01-03T00:00:00.000Z'
      }
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 2. 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="diary-filter-select"] button[type="button"]');
    await filterSelect.click();

    // 3. "슬퍼요" 옵션 선택
    const dropdown = page.locator('ul[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 499 });
    await page.locator('li[role="option"]:has-text("슬퍼요")').click();

    // 4. 선택한 emotion과 일치하는 일기 카드만 노출되는지 확인
    await page.waitForTimeout(100); // 필터링 처리 대기
    const filteredCards = page.locator('[data-testid="diary-card"]');
    const filteredCount = await filteredCards.count();
    
    // 슬픈 일기는 2개
    expect(filteredCount).toBe(2);

    // 각 카드의 emotion 확인
    for (let i = 0; i < filteredCount; i++) {
      const emotionLabel = filteredCards.nth(i).locator('[data-testid="diary-emotion"]');
      const emotionText = await emotionLabel.textContent();
      expect(emotionText).toBe('슬퍼요');
    }
  });

  test('전체 필터 선택 시 모든 일기가 노출되어야 합니다', async ({ page }) => {
    // 테스트용 일기 데이터 설정
    const testDiaries = [
      {
        id: 1,
        title: '행복한 일기',
        content: '오늘은 행복한 하루였어요',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        title: '슬픈 일기',
        content: '오늘은 슬픈 하루였어요',
        emotion: EmotionType.SAD,
        createdAt: '2024-01-02T00:00:00.000Z'
      },
      {
        id: 3,
        title: '화난 일기',
        content: '오늘은 화난 하루였어요',
        emotion: EmotionType.ANGRY,
        createdAt: '2024-01-03T00:00:00.000Z'
      }
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 2. 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="diary-filter-select"] button[type="button"]');
    await filterSelect.click();

    // 3. "행복해요" 필터 선택 (먼저 필터링)
    const dropdown = page.locator('ul[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 499 });
    await page.locator('li[role="option"]:has-text("행복해요")').click();

    await page.waitForTimeout(100);
    let filteredCards = page.locator('[data-testid="diary-card"]');
    let filteredCount = await filteredCards.count();
    expect(filteredCount).toBe(1); // 행복한 일기만 1개

    // 4. "전체" 필터 선택
    await filterSelect.click();
    await expect(dropdown).toBeVisible({ timeout: 499 });
    await page.locator('li[role="option"]:has-text("전체")').click();

    // 5. 모든 일기가 노출되는지 확인
    await page.waitForTimeout(100);
    filteredCards = page.locator('[data-testid="diary-card"]');
    filteredCount = await filteredCards.count();
    expect(filteredCount).toBe(3); // 모든 일기 3개
  });

  // ============================================
  // Search + Filter Tests
  // ============================================

  test('검색 결과에 대해 필터를 적용할 수 있어야 합니다', async ({ page }) => {
    // 테스트용 일기 데이터 설정
    const testDiaries = [
      {
        id: 1,
        title: '행복한 일기',
        content: '오늘은 행복한 하루였어요',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        title: '행복한 하루',
        content: '오늘도 행복한 하루였어요',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-01-02T00:00:00.000Z'
      },
      {
        id: 3,
        title: '슬픈 일기',
        content: '오늘은 슬픈 하루였어요',
        emotion: EmotionType.SAD,
        createdAt: '2024-01-03T00:00:00.000Z'
      },
      {
        id: 4,
        title: '행복한 날씨',
        content: '오늘 날씨가 좋아요',
        emotion: EmotionType.SAD,
        createdAt: '2024-01-04T00:00:00.000Z'
      }
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 2. 검색창에 "행복" 입력하여 검색
    const searchInput = page.locator('input[placeholder*="검색어"]');
    await searchInput.fill('행복');
    await searchInput.press('Enter');

    // 검색 결과 대기
    await page.waitForTimeout(100);

    // 검색 결과: "행복한 일기", "행복한 하루", "행복한 날씨" 3개
    let cards = page.locator('[data-testid="diary-card"]');
    let cardCount = await cards.count();
    expect(cardCount).toBe(3);

    // 3. 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="diary-filter-select"] button[type="button"]');
    await filterSelect.click();

    // 4. "행복해요" 필터 선택
    const dropdown = page.locator('ul[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 499 });
    await page.locator('li[role="option"]:has-text("행복해요")').click();

    // 5. 검색 결과 중에서 선택한 emotion과 일치하는 일기 카드만 노출되는지 확인
    await page.waitForTimeout(100);
    cards = page.locator('[data-testid="diary-card"]');
    cardCount = await cards.count();
    
    // 검색 결과 중 행복한 emotion은 2개 ("행복한 일기", "행복한 하루")
    expect(cardCount).toBe(2);

    // 각 카드의 emotion 확인
    for (let i = 0; i < cardCount; i++) {
      const emotionLabel = cards.nth(i).locator('[data-testid="diary-emotion"]');
      const emotionText = await emotionLabel.textContent();
      expect(emotionText).toBe('행복해요');
    }
  });
});

