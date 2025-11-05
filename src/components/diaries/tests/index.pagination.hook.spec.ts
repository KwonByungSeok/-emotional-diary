import { test, expect, Page } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

// ============================================
// Diaries Pagination Hook Tests
// ============================================

test.describe("일기 페이지네이션 기능", () => {
  // ============================================
  // Helper Functions
  // ============================================

  /**
   * 테스트용 일기 데이터 생성 헬퍼 함수
   */
  async function createTestDiaries(page: Page, count: number, emotion?: EmotionType) {
    await page.evaluate(({ count, emotion }) => {
      const diaries = [];
      const emotions = emotion 
        ? [emotion] 
        : ["HAPPY", "SAD", "ANGRY", "SURPRISE", "ETC"];
      
      for (let i = 1; i <= count; i++) {
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        diaries.push({
          id: i,
          title: `일기 ${i}`,
          content: `일기 내용 ${i}`,
          emotion: randomEmotion,
          createdAt: new Date(2024, 0, i).toISOString(),
        });
      }
      
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, { count, emotion: emotion || "" });
  }

  /**
   * 일기 카드 개수 확인
   */
  async function verifyDiaryCardCount(page: Page, expectedCount: number) {
    const cards = page.locator('[data-testid="diary-card"]');
    await expect(cards).toHaveCount(expectedCount);
  }

  /**
   * 페이지 번호 버튼 확인
   */
  async function verifyPageNumbers(page: Page, expectedPages: number[]) {
    for (const pageNum of expectedPages) {
      const pageButton = page.locator(`[data-testid="pagination-page-button-${pageNum}"]`);
      await expect(pageButton).toBeVisible({ timeout: 499 });
    }
  }

  /**
   * 페이지 번호 클릭
   */
  async function clickPageNumber(page: Page, pageNum: number) {
    const pageButton = page.locator(`[data-testid="pagination-page-button-${pageNum}"]`);
    await expect(pageButton).toBeVisible({ timeout: 499 });
    await pageButton.click();
    // 페이지 변경 후 카드가 업데이트될 때까지 대기
    await page.waitForSelector('[data-testid="diary-card"]', { timeout: 499 });
  }

  /**
   * 현재 활성화된 페이지 번호 확인
   */
  async function verifyActivePage(page: Page, expectedPage: number) {
    const activeButton = page.locator(`[data-testid="pagination-page-button-${expectedPage}"][aria-current="page"]`);
    await expect(activeButton).toBeVisible({ timeout: 499 });
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
  // Pagination Display Tests
  // ============================================

  test("한 페이지에 3행 4열로 총 12개의 일기카드가 노출되는지 확인", async ({ page }) => {
    // 12개 이상의 일기 데이터 생성 (13개 생성하여 2페이지 테스트)
    await createTestDiaries(page, 13);

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 2. 첫 페이지에 정확히 12개의 일기카드가 표시되는지 확인 (3행 4열 구조)
    await verifyDiaryCardCount(page, 12);
  });

  test("페이지 번호가 1, 2, 3, 4, 5 형태로 5개 단위로 노출되는지 확인", async ({ page }) => {
    // 5페이지 이상의 데이터 생성 (약 60개)
    await createTestDiaries(page, 60);

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 2. 페이지네이션 컴포넌트가 표시되는지 확인
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible({ timeout: 499 });

    // 3. 첫 페이지에서 1, 2, 3, 4, 5 페이지 번호가 표시되는지 확인
    await verifyPageNumbers(page, [1, 2, 3, 4, 5]);

    // 4. 페이지 2로 이동
    await clickPageNumber(page, 2);
    await verifyActivePage(page, 2);
    await verifyPageNumbers(page, [1, 2, 3, 4, 5]);

    // 5. 페이지 3으로 이동
    await clickPageNumber(page, 3);
    await verifyActivePage(page, 3);
    await verifyPageNumbers(page, [1, 2, 3, 4, 5]);
  });

  test("페이지번호 클릭 시 해당 페이지번호에 맞는 일기 컨텐츠목록 보여지는지 확인", async ({ page }) => {
    // 25개의 일기 데이터 생성 (3페이지 분량)
    await createTestDiaries(page, 25);

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 2. 첫 페이지의 첫 번째 일기 제목 확인
    const firstPageFirstCard = page.locator('[data-testid="diary-card"]').first();
    const firstPageFirstTitle = await firstPageFirstCard.locator('[data-testid="diary-title"]').textContent();
    
    // 3. 페이지 2로 이동
    await clickPageNumber(page, 2);
    await verifyActivePage(page, 2);

    // 4. 두 번째 페이지의 첫 번째 일기 제목 확인 (첫 페이지와 다르야 함)
    const secondPageFirstCard = page.locator('[data-testid="diary-card"]').first();
    const secondPageFirstTitle = await secondPageFirstCard.locator('[data-testid="diary-title"]').textContent();
    
    expect(firstPageFirstTitle).not.toBe(secondPageFirstTitle);

    // 5. 두 번째 페이지에는 12개의 카드가 표시되는지 확인
    await verifyDiaryCardCount(page, 12);

    // 6. 페이지 3으로 이동
    await clickPageNumber(page, 3);
    await verifyActivePage(page, 3);

    // 7. 세 번째 페이지에는 1개의 카드만 표시되는지 확인 (25개 중 24개는 이미 표시됨)
    await verifyDiaryCardCount(page, 1);

    // 8. 다시 첫 페이지로 이동
    await clickPageNumber(page, 1);
    await verifyActivePage(page, 1);

    // 9. 첫 페이지의 첫 번째 일기 제목이 원래와 같은지 확인
    const backToFirstPageFirstCard = page.locator('[data-testid="diary-card"]').first();
    const backToFirstPageFirstTitle = await backToFirstPageFirstCard.locator('[data-testid="diary-title"]').textContent();
    
    expect(backToFirstPageFirstTitle).toBe(firstPageFirstTitle);
  });

  // ============================================
  // Search + Pagination Tests
  // ============================================

  test("검색 결과에 맞게 페이지 수가 변경되었는지 확인", async ({ page }) => {
    // 다양한 제목의 일기 데이터 생성 (30개)
    await page.evaluate(() => {
      const diaries = [];
      for (let i = 1; i <= 30; i++) {
        const title = i <= 15 ? `행복한 일기 ${i}` : `슬픈 일기 ${i - 15}`;
        diaries.push({
          id: i,
          title: title,
          content: `일기 내용 ${i}`,
          emotion: i <= 15 ? "HAPPY" : "SAD",
          createdAt: new Date(2024, 0, i).toISOString(),
        });
      }
      localStorage.setItem("diaries", JSON.stringify(diaries));
    });

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 2. 전체 일기는 30개이므로 3페이지가 표시되어야 함
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible({ timeout: 499 });
    await verifyPageNumbers(page, [1, 2, 3]);

    // 3. 검색창에 "행복" 입력하여 검색
    const searchInput = page.locator('input[placeholder*="검색어"]');
    await searchInput.fill("행복");
    await searchInput.press("Enter");
    // 검색 결과 업데이트 대기
    await page.waitForSelector('[data-testid="pagination"]', { timeout: 499 });

    // 4. 검색 결과는 15개이므로 2페이지가 표시되어야 함
    await verifyPageNumbers(page, [1, 2]);
    await verifyDiaryCardCount(page, 12); // 첫 페이지에 12개

    // 5. 두 번째 페이지로 이동
    await clickPageNumber(page, 2);
    await verifyActivePage(page, 2);

    // 6. 두 번째 페이지에는 3개만 표시되어야 함
    await verifyDiaryCardCount(page, 3);

    // 7. 검색어를 "슬픈"으로 변경
    await searchInput.fill("슬픈");
    await searchInput.press("Enter");
    // 검색 결과 업데이트 대기
    await page.waitForSelector('[data-testid="pagination"]', { timeout: 499 });

    // 8. 검색 결과는 15개이므로 2페이지가 표시되어야 함
    await verifyPageNumbers(page, [1, 2]);
    await verifyDiaryCardCount(page, 12); // 첫 페이지로 리셋되어 12개

    // 9. 검색어를 지우고 전체 검색
    await searchInput.fill("");
    await searchInput.press("Enter");
    // 검색 결과 업데이트 대기
    await page.waitForSelector('[data-testid="pagination"]', { timeout: 499 });

    // 10. 전체 일기는 30개이므로 다시 3페이지가 표시되어야 함
    await verifyPageNumbers(page, [1, 2, 3]);
  });

  // ============================================
  // Filter + Pagination Tests
  // ============================================

  test("필터선택박스 클릭 시 선택한 emotion과 일치하는 일기 카드들로 페이지 수가 변경되었는지 확인", async ({ page }) => {
    // 다양한 emotion의 일기 데이터 생성
    await page.evaluate(() => {
      const diaries = [];
      const emotions = [
        "HAPPY",
        "SAD",
        "ANGRY",
        "SURPRISE",
        "ETC",
      ];
      
      // 각 emotion별로 15개씩 생성 (총 75개, 7페이지)
      for (let i = 0; i < emotions.length; i++) {
        for (let j = 1; j <= 15; j++) {
          diaries.push({
            id: i * 15 + j,
            title: `일기 ${i * 15 + j}`,
            content: `일기 내용 ${i * 15 + j}`,
            emotion: emotions[i],
            createdAt: new Date(2024, 0, i * 15 + j).toISOString(),
          });
        }
      }
      
      localStorage.setItem("diaries", JSON.stringify(diaries));
    });

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 2. 전체 일기는 75개이므로 7페이지가 표시되어야 함
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible({ timeout: 499 });
    await verifyPageNumbers(page, [1, 2, 3, 4, 5]);

    // 3. 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="diary-filter-select"] button[type="button"]');
    await filterSelect.click();

    // 4. "행복해요" 필터 선택
    const dropdown = page.locator('ul[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 499 });
    await page.locator('li[role="option"]:has-text("행복해요")').click();
    // 필터링 결과 업데이트 대기
    await page.waitForSelector('[data-testid="pagination"]', { timeout: 499 });

    // 5. 필터링 결과는 15개이므로 2페이지가 표시되어야 함
    await verifyPageNumbers(page, [1, 2]);
    await verifyDiaryCardCount(page, 12); // 첫 페이지에 12개

    // 6. 각 카드의 emotion이 "행복해요"인지 확인
    const cards = page.locator('[data-testid="diary-card"]');
    const cardCount = await cards.count();
    for (let i = 0; i < cardCount; i++) {
      const emotionLabel = cards.nth(i).locator('[data-testid="diary-emotion"]');
      const emotionText = await emotionLabel.textContent();
      expect(emotionText).toBe("행복해요");
    }

    // 7. 두 번째 페이지로 이동
    await clickPageNumber(page, 2);
    await verifyActivePage(page, 2);

    // 8. 두 번째 페이지에는 3개만 표시되어야 함
    await verifyDiaryCardCount(page, 3);

    // 9. 다시 필터 선택박스 클릭하여 "슬퍼요" 필터 선택
    await filterSelect.click();
    await expect(dropdown).toBeVisible({ timeout: 499 });
    await page.locator('li[role="option"]:has-text("슬퍼요")').click();
    // 필터링 결과 업데이트 대기
    await page.waitForSelector('[data-testid="pagination"]', { timeout: 499 });

    // 10. 필터링 결과는 15개이므로 2페이지가 표시되어야 함
    await verifyPageNumbers(page, [1, 2]);
    await verifyDiaryCardCount(page, 12); // 첫 페이지로 리셋되어 12개

    // 11. 다시 필터 선택박스 클릭하여 "전체" 필터 선택
    await filterSelect.click();
    await expect(dropdown).toBeVisible({ timeout: 499 });
    await page.locator('li[role="option"]:has-text("전체")').click();
    // 필터링 결과 업데이트 대기
    await page.waitForSelector('[data-testid="pagination"]', { timeout: 499 });

    // 12. 전체 일기는 75개이므로 다시 7페이지가 표시되어야 함
    await verifyPageNumbers(page, [1, 2, 3, 4, 5]);
  });
});

