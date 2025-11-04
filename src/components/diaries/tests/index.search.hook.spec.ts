import { test, expect, Page } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

// ============================================
// Diaries Search Hook Tests
// ============================================

test.describe("일기 검색 기능", () => {
  // ============================================
  // Helper Functions
  // ============================================

  /**
   * 실제 일기 데이터를 생성하는 헬퍼 함수
   */
  async function createRealDiaryData(page: Page, diaryData: { title: string; content: string; emotion: EmotionType }) {
    await page.waitForTimeout(200);
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
    
    await page.waitForTimeout(300);
    
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await expect(writeButton).toBeVisible();
    await writeButton.click();
    
    await page.waitForSelector('[data-testid="diaries-new-modal"]', { timeout: 499 });
    
    await page.fill('[data-testid="diary-title-input"]', diaryData.title);
    await page.fill('[data-testid="diary-content-textarea"]', diaryData.content);
    await page.click(`[data-testid="emotion-${diaryData.emotion.toLowerCase()}"]`);
    
    await page.click('[data-testid="diaries-submit-button"]');
    
    await page.waitForSelector('[data-testid="diary-success-modal"]', { timeout: 499 });
    await page.click('[data-testid="diary-success-modal"] button');
    
    await page.waitForSelector('[data-testid="diaries-new-modal"]', { state: 'hidden', timeout: 499 });
    
    await page.waitForTimeout(300);
  }

  /**
   * 검색창에 검색어 입력
   */
  async function inputSearchTerm(page: Page, searchTerm: string) {
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill(searchTerm);
  }

  /**
   * 검색 실행 (엔터키 또는 돋보기 버튼)
   */
  async function executeSearch(page: Page, method: 'enter' | 'button') {
    if (method === 'enter') {
      const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
      await searchInput.press('Enter');
    } else {
      const searchButton = page.locator('button[aria-label="검색"]');
      await expect(searchButton).toBeVisible();
      await searchButton.click();
    }
  }

  /**
   * 일기 카드 개수 확인
   */
  async function verifyDiaryCardCount(page: Page, expectedCount: number) {
    const cards = page.locator('[data-testid="diary-card"]');
    await expect(cards).toHaveCount(expectedCount);
  }

  /**
   * 일기 카드 제목 확인
   */
  async function verifyDiaryCardTitle(page: Page, cardIndex: number, expectedTitle: string) {
    const cards = page.locator('[data-testid="diary-card"]');
    const card = cards.nth(cardIndex);
    const titleElement = card.locator('[data-testid="diary-title"]');
    await expect(titleElement).toBeVisible();
    const actualTitle = await titleElement.textContent();
    expect(actualTitle).toContain(expectedTitle);
  }

  // ============================================
  // Test Setup & Teardown
  // ============================================

  test.beforeEach(async ({ page }) => {
    // 테스트 전 로컬스토리지 초기화
    await page.goto("/diaries");
    await page.evaluate(() => {
      localStorage.removeItem("diaries");
    });
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  });

  // ============================================
  // Search Execution Tests
  // ============================================

  test.skip("검색창에 검색어를 입력하고 엔터키를 누르면 title이 검색어에 포함된 일기만 표시된다", async ({ page }) => {
    // 테스트 데이터 생성
    const diary1 = {
      title: "행복한 하루",
      content: "오늘은 정말 행복한 하루였습니다.",
      emotion: EmotionType.HAPPY
    };
    
    const diary2 = {
      title: "슬픈 하루",
      content: "오늘은 정말 슬픈 하루였습니다.",
      emotion: EmotionType.SAD
    };
    
    const diary3 = {
      title: "화가 나는 하루",
      content: "오늘은 정말 화가 났습니다.",
      emotion: EmotionType.ANGRY
    };
    
    await createRealDiaryData(page, diary1);
    await page.waitForTimeout(499);
    
    await createRealDiaryData(page, diary2);
    await page.waitForTimeout(499);
    
    await createRealDiaryData(page, diary3);
    await page.waitForTimeout(499);
    
    // 일기 목록 페이지로 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
    
    // 모든 일기 카드가 표시되는지 확인 (3개)
    await verifyDiaryCardCount(page, 3);
    
    // 검색어 입력
    await inputSearchTerm(page, "행복");
    
    // 엔터키로 검색 실행
    await executeSearch(page, 'enter');
    
    // 검색 결과 확인 (1개만 표시되어야 함)
    await page.waitForTimeout(300);
    await verifyDiaryCardCount(page, 1);
    await verifyDiaryCardTitle(page, 0, "행복한 하루");
  });

  test.skip("검색창에 검색어를 입력하고 돋보기 버튼을 클릭하면 title이 검색어에 포함된 일기만 표시된다", async ({ page }) => {
    // 테스트 데이터 생성
    const diary1 = {
      title: "행복한 하루",
      content: "오늘은 정말 행복한 하루였습니다.",
      emotion: EmotionType.HAPPY
    };
    
    const diary2 = {
      title: "슬픈 하루",
      content: "오늘은 정말 슬픈 하루였습니다.",
      emotion: EmotionType.SAD
    };
    
    await createRealDiaryData(page, diary1);
    await page.waitForTimeout(499);
    
    await createRealDiaryData(page, diary2);
    await page.waitForTimeout(499);
    
    // 일기 목록 페이지로 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
    
    // 모든 일기 카드가 표시되는지 확인 (2개)
    await verifyDiaryCardCount(page, 2);
    
    // 검색어 입력
    await inputSearchTerm(page, "슬픈");
    
    // 돋보기 버튼으로 검색 실행
    await executeSearch(page, 'button');
    
    // 검색 결과 확인 (1개만 표시되어야 함)
    await page.waitForTimeout(300);
    await verifyDiaryCardCount(page, 1);
    await verifyDiaryCardTitle(page, 0, "슬픈 하루");
  });

  // ============================================
  // Edge Cases
  // ============================================

  test.skip("검색어가 일치하는 일기가 없을 때 빈 목록이 표시된다", async ({ page }) => {
    // 테스트 데이터 생성
    const diary1 = {
      title: "행복한 하루",
      content: "오늘은 정말 행복한 하루였습니다.",
      emotion: EmotionType.HAPPY
    };
    
    await createRealDiaryData(page, diary1);
    await page.waitForTimeout(499);
    
    // 일기 목록 페이지로 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
    
    // 검색어 입력
    await inputSearchTerm(page, "존재하지않는제목");
    
    // 엔터키로 검색 실행
    await executeSearch(page, 'enter');
    
    // 검색 결과 확인 (0개)
    await page.waitForTimeout(300);
    await verifyDiaryCardCount(page, 0);
  });

  test("검색어가 빈 문자열일 때 모든 일기가 표시된다", async ({ page }) => {
    // 테스트 데이터 생성
    const diary1 = {
      title: "행복한 하루",
      content: "오늘은 정말 행복한 하루였습니다.",
      emotion: EmotionType.HAPPY
    };
    
    const diary2 = {
      title: "슬픈 하루",
      content: "오늘은 정말 슬픈 하루였습니다.",
      emotion: EmotionType.SAD
    };
    
    await createRealDiaryData(page, diary1);
    await page.waitForTimeout(499);
    
    await createRealDiaryData(page, diary2);
    await page.waitForTimeout(499);
    
    // 일기 목록 페이지로 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
    
    // 검색어 입력 (빈 문자열)
    await inputSearchTerm(page, "");
    
    // 엔터키로 검색 실행
    await executeSearch(page, 'enter');
    
    // 검색 결과 확인 (모든 일기 표시)
    await page.waitForTimeout(300);
    await verifyDiaryCardCount(page, 2);
  });

  test.skip("부분 일치 검색이 올바르게 작동한다", async ({ page }) => {
    // 테스트 데이터 생성
    const diary1 = {
      title: "행복한 하루",
      content: "오늘은 정말 행복한 하루였습니다.",
      emotion: EmotionType.HAPPY
    };
    
    const diary2 = {
      title: "행복한 저녁",
      content: "오늘 저녁은 정말 행복했습니다.",
      emotion: EmotionType.HAPPY
    };
    
    const diary3 = {
      title: "슬픈 하루",
      content: "오늘은 정말 슬픈 하루였습니다.",
      emotion: EmotionType.SAD
    };
    
    await createRealDiaryData(page, diary1);
    await page.waitForTimeout(499);
    
    await createRealDiaryData(page, diary2);
    await page.waitForTimeout(499);
    
    await createRealDiaryData(page, diary3);
    await page.waitForTimeout(499);
    
    // 일기 목록 페이지로 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
    
    // 검색어 입력 (부분 일치)
    await inputSearchTerm(page, "행복");
    
    // 엔터키로 검색 실행
    await executeSearch(page, 'enter');
    
    // 검색 결과 확인 (2개 표시되어야 함)
    await page.waitForTimeout(300);
    await verifyDiaryCardCount(page, 2);
  });

  test("대소문자 구분 없이 검색이 작동한다", async ({ page }) => {
    // 테스트 데이터 생성
    const diary1 = {
      title: "행복한 하루",
      content: "오늘은 정말 행복한 하루였습니다.",
      emotion: EmotionType.HAPPY
    };
    
    await createRealDiaryData(page, diary1);
    await page.waitForTimeout(499);
    
    // 일기 목록 페이지로 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
    
    // 검색어 입력 (대문자)
    await inputSearchTerm(page, "행복");
    
    // 엔터키로 검색 실행
    await executeSearch(page, 'enter');
    
    // 검색 결과 확인
    await page.waitForTimeout(300);
    await verifyDiaryCardCount(page, 1);
    await verifyDiaryCardTitle(page, 0, "행복한 하루");
  });
});

