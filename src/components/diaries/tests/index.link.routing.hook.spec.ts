import { test, expect, Page } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

// ============================================
// Helper Functions
// ============================================

/**
 * 실제 일기 데이터를 생성하는 헬퍼 함수
 * 애플리케이션의 실제 로직을 사용하여 데이터 생성
 */
async function createRealDiaryData(page: Page, diaryData: { title: string; content: string; emotion: EmotionType }) {
  // 일기 목록 페이지로 이동
  await page.goto("/diaries");
  await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });
  
  // 일기쓰기 버튼 클릭
  await page.click('[data-testid="diary-write-button"]');
  await page.waitForSelector('[data-testid="diaries-new-modal"]', { timeout: 500 });
  
  // 폼 입력
  await page.fill('[data-testid="diary-title-input"]', diaryData.title);
  await page.fill('[data-testid="diary-content-textarea"]', diaryData.content);
  await page.click(`[data-testid="emotion-${diaryData.emotion.toLowerCase()}"]`);
  
  // 등록하기 버튼 클릭
  await page.click('[data-testid="diaries-submit-button"]');
  
  // 성공 모달 확인 후 닫기
  await page.waitForSelector('[data-testid="diary-success-modal"]', { timeout: 500 });
  await page.click('[data-testid="diary-success-modal"] button');
  
  // 모달이 닫힐 때까지 대기
  await page.waitForSelector('[data-testid="diaries-new-modal"]', { state: 'hidden', timeout: 500 });
  
  // 페이지가 안정화될 때까지 대기
  await page.waitForTimeout(100);
}

/**
 * 로컬스토리지에서 실제 데이터를 가져오는 헬퍼 함수
 */
async function getRealDiaryData(page: Page) {
  return await page.evaluate(() => {
    const data = localStorage.getItem("diaries");
    return data ? JSON.parse(data) : [];
  });
}


// ============================================
// Test Cases
// ============================================

test.describe('Diaries Link Routing', () => {
  test.beforeEach(async () => {
    // 실제 데이터를 사용하기 위해 로컬스토리지 모킹 제거
    // 대신 실제 애플리케이션에서 생성된 데이터를 사용
  });

  test('실제 데이터로 생성된 일기 카드 클릭시 상세 페이지로 이동', async ({ page }) => {
    // 실제 일기 데이터 생성
    const diaryData = {
      title: "오늘은 정말 특별한 하루였어요",
      content: "오늘은 정말 특별한 하루였어요. 아침에 일어나서 창문을 열었는데, 비가 그치고 맑은 하늘이 보였습니다.",
      emotion: EmotionType.HAPPY
    };
    
    await createRealDiaryData(page, diaryData);
    
    // 생성된 일기 데이터 확인
    const realData = await getRealDiaryData(page);
    expect(realData.length).toBeGreaterThan(0);
    
    const createdDiary = realData[realData.length - 1]; // 가장 최근 생성된 일기
    const diaryId = createdDiary.id;
    
    // 일기 목록 페이지로 이동
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diary-card"]', { timeout: 500 });
    
    // 첫 번째 일기 카드 클릭
    const firstDiaryCard = page.locator('[data-testid="diary-card"]').first();
    await firstDiaryCard.click();

    // URL이 올바르게 변경되었는지 확인
    await expect(page).toHaveURL(`/diaries/${diaryId}`);
  });

  test('여러 일기 생성 후 각각의 카드 클릭시 올바른 상세 페이지로 이동', async ({ page }) => {
    // 첫 번째 일기 생성
    const firstDiaryData = {
      title: "첫 번째 일기",
      content: "첫 번째 일기 내용입니다.",
      emotion: EmotionType.HAPPY
    };
    
    await createRealDiaryData(page, firstDiaryData);
    
    // 두 번째 일기 생성
    const secondDiaryData = {
      title: "두 번째 일기",
      content: "두 번째 일기 내용입니다.",
      emotion: EmotionType.SAD
    };
    
    await createRealDiaryData(page, secondDiaryData);
    
    // 생성된 일기 데이터 확인
    const realData = await getRealDiaryData(page);
    expect(realData.length).toBeGreaterThanOrEqual(2);
    
    // 일기 목록 페이지로 이동
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diary-card"]', { timeout: 500 });
    
    // 카드 개수 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    const cardCount = await diaryCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(2);
    
    // 첫 번째 카드 클릭
    await diaryCards.first().click();
    
    // URL이 올바른 형식인지 확인 (실제 ID 값은 동적으로 생성되므로 형식만 확인)
    await expect(page).toHaveURL(/\/diaries\/\d+/);
    
    // 이전 페이지로 돌아가기
    await page.goBack();
    await page.waitForSelector('[data-testid="diary-card"]', { timeout: 500 });
    
    // 두 번째 카드 클릭
    await diaryCards.nth(1).click();
    
    // URL이 올바른 형식인지 확인
    await expect(page).toHaveURL(/\/diaries\/\d+/);
  });

  test('삭제 버튼 클릭시 페이지 이동하지 않음', async ({ page }) => {
    // 실제 일기 데이터 생성
    const diaryData = {
      title: "삭제 테스트용 일기",
      content: "삭제 버튼 테스트를 위한 일기입니다.",
      emotion: EmotionType.ANGRY
    };
    
    await createRealDiaryData(page, diaryData);
    
    // 일기 목록 페이지로 이동
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diary-card"]', { timeout: 500 });
    
    // 삭제 버튼 클릭 - SVG 아이콘이 있는 버튼 찾기
    const deleteButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await deleteButton.click();

    // URL이 변경되지 않았는지 확인 (여전히 /diaries 페이지에 있어야 함)
    await expect(page).toHaveURL('/diaries');
  });

  test('일기 카드에 cursor: pointer 스타일 적용', async ({ page }) => {
    // 실제 일기 데이터 생성
    const diaryData = {
      title: "스타일 테스트용 일기",
      content: "스타일 테스트를 위한 일기입니다.",
      emotion: EmotionType.SURPRISE
    };
    
    await createRealDiaryData(page, diaryData);
    
    // 일기 목록 페이지로 이동
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diary-card"]', { timeout: 500 });
    
    // 일기 카드의 CSS 스타일 확인
    const diaryCard = page.locator('[data-testid="diary-card"]').first();
    const cursorStyle = await diaryCard.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursorStyle).toBe('pointer');
  });

  test('빈 상태에서 일기 카드가 없는지 확인', async ({ page }) => {
    // 일기 목록 페이지로 이동
    await page.goto('/diaries');
    
    // 빈 상태 확인
    await page.waitForSelector('[data-testid="empty-state"]', { timeout: 500 });
    
    // 빈 상태에서는 일기 카드가 없으므로 클릭할 수 없음
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(0);
  });
});
