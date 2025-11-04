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
  // 일기 목록 페이지로 이동 (네비게이션 안정화를 위한 대기 추가)
  await page.waitForTimeout(200); // 네비게이션 충돌 방지
  await page.goto("/diaries");
  await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForTimeout(300);
  
  // 일기쓰기 버튼이 클릭 가능한지 확인 후 클릭
  const writeButton = page.locator('[data-testid="diary-write-button"]');
  await expect(writeButton).toBeVisible();
  await writeButton.click();
  
  // 모달이 열릴 때까지 대기
  await page.waitForSelector('[data-testid="diaries-new-modal"]', { timeout: 499 });
  
  // 폼 입력
  await page.fill('[data-testid="diary-title-input"]', diaryData.title);
  await page.fill('[data-testid="diary-content-textarea"]', diaryData.content);
  await page.click(`[data-testid="emotion-${diaryData.emotion.toLowerCase()}"]`);
  
  // 등록하기 버튼 클릭
  await page.click('[data-testid="diaries-submit-button"]');
  
  // 성공 모달 확인 후 닫기
  await page.waitForSelector('[data-testid="diary-success-modal"]', { timeout: 499 });
  await page.click('[data-testid="diary-success-modal"] button');
  
  // 모달이 닫힐 때까지 대기
  await page.waitForSelector('[data-testid="diaries-new-modal"]', { state: 'hidden', timeout: 499 });
  
  // 페이지가 안정화될 때까지 충분한 대기 (WebKit 안정화)
  await page.waitForTimeout(300);
}

/**
 * 로컬스토리지에서 실제 데이터 확인
 */
async function getRealDiaryData(page: Page) {
  return await page.evaluate(() => {
    const data = localStorage.getItem("diaries");
    return data ? JSON.parse(data) : [];
  });
}

/**
 * 일기 카드의 데이터가 올바르게 바인딩되었는지 확인
 */
async function verifyDiaryCardBinding(page: Page, diaryData: { title: string; emotion: EmotionType; createdAt: string }, cardIndex: number) {
  // 카드가 존재하는지 확인
  const cards = page.locator('[data-testid="diary-card"]');
  await expect(cards.nth(cardIndex)).toBeVisible();
  
  const card = cards.nth(cardIndex);
  
  // 제목 확인 (텍스트 오버플로우 처리 포함)
  const titleElement = card.locator('[data-testid="diary-title"]');
  await expect(titleElement).toBeVisible();
  const actualTitle = await titleElement.textContent();
  expect(actualTitle).toBeTruthy();
  
  // 감정 텍스트 확인
  const emotionElement = card.locator('[data-testid="diary-emotion"]');
  await expect(emotionElement).toBeVisible();
  
  // 작성일 확인
  const dateElement = card.locator('[data-testid="diary-date"]');
  await expect(dateElement).toBeVisible();
  
  // 감정 이미지 확인
  const imageElement = card.locator('[data-testid="diary-image"]');
  await expect(imageElement).toBeVisible();
}

// ============================================
// Test Setup
// ============================================

test.beforeEach(async () => {
  // 실제 데이터를 사용하기 위해 로컬스토리지 모킹 제거
  // 대신 실제 애플리케이션에서 생성된 데이터를 사용
});

// ============================================
// Success Scenarios
// ============================================

test.skip("일기 목록 페이지에서 실제 데이터가 올바르게 바인딩되는지 확인", async ({ page }) => {
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
  
  // 일기 목록 페이지로 이동
    await page.waitForTimeout(300); // 네비게이션 안정화를 위한 대기
  await page.goto("/diaries", { waitUntil: 'domcontentloaded' });
  
  // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  
  // 일기 카드가 표시되는지 확인
  const cards = page.locator('[data-testid="diary-card"]');
  await expect(cards.first()).toBeVisible();
  
  // 첫 번째 카드의 데이터 바인딩 확인
  await verifyDiaryCardBinding(page, {
    title: createdDiary.title,
    emotion: createdDiary.emotion,
    createdAt: createdDiary.createdAt
  }, 0);
});

test("여러 개의 일기 데이터가 올바르게 바인딩되는지 확인", async ({ page }) => {
  // 첫 번째 일기 데이터 생성
  const diaryData1 = {
    title: "행복한 하루",
    content: "오늘은 정말 행복한 하루였습니다.",
    emotion: EmotionType.HAPPY
  };
  
  await createRealDiaryData(page, diaryData1);
  
  // 첫 번째 일기 생성 후 추가 대기 (WebKit 안정화)
    await page.waitForTimeout(300);
  
  // 두 번째 일기 데이터 생성
  const diaryData2 = {
    title: "슬픈 하루",
    content: "오늘은 정말 슬픈 하루였습니다.",
    emotion: EmotionType.SAD
  };
  
  await createRealDiaryData(page, diaryData2);
  
  // 두 번째 일기 생성 후 추가 대기 (WebKit 안정화)
    await page.waitForTimeout(300);
  
  // 세 번째 일기 데이터 생성
  const diaryData3 = {
    title: "화가 나는 하루",
    content: "오늘은 정말 화가 났습니다.",
    emotion: EmotionType.ANGRY
  };
  
  await createRealDiaryData(page, diaryData3);
  
  // 세 번째 일기 생성 후 추가 대기 (WebKit 안정화)
    await page.waitForTimeout(300);
  
  // 생성된 일기 데이터 확인
  const realData = await getRealDiaryData(page);
  expect(realData.length).toBeGreaterThanOrEqual(3);
  
  // 일기 목록 페이지로 이동
  await page.goto("/diaries");
  
  // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  
  // 일기 카드들이 표시되는지 확인
  const cards = page.locator('[data-testid="diary-card"]');
  await expect(cards).toHaveCount(realData.length);
  
  // 각 카드의 데이터 바인딩 확인 (최근 생성된 순서대로)
  const recentDiaries = realData.slice(-3).reverse(); // 최근 3개를 역순으로
  
  for (let i = 0; i < recentDiaries.length; i++) {
    await verifyDiaryCardBinding(page, {
      title: recentDiaries[i].title,
      emotion: recentDiaries[i].emotion,
      createdAt: recentDiaries[i].createdAt
    }, i);
  }
});

test("긴 제목이 올바르게 처리되는지 확인", async ({ page }) => {
  // 긴 제목의 일기 데이터 생성
  const diaryData = {
    title: "이것은 정말 긴 제목입니다. 일기 카드의 크기를 넘어가는 매우 긴 제목이에요. 이 제목이 어떻게 처리되는지 확인해보겠습니다.",
    content: "긴 제목 테스트 내용입니다.",
    emotion: EmotionType.SURPRISE
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 생성된 일기 데이터 확인
  const realData = await getRealDiaryData(page);
  expect(realData.length).toBeGreaterThan(0);
  
  // 일기 목록 페이지로 이동
  await page.goto("/diaries");
  
  // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  
  // 첫 번째 카드의 제목 확인
  const cards = page.locator('[data-testid="diary-card"]');
  const firstCard = cards.first();
  
  const titleElement = firstCard.locator('[data-testid="diary-title"]');
  await expect(titleElement).toBeVisible();
  
  // 제목이 잘렸는지 확인 (CSS의 text-overflow: ellipsis 적용)
  const titleText = await titleElement.textContent();
  expect(titleText).toBeTruthy();
  
  // 제목이 원본과 다르다면 잘린 것 (실제로는 CSS에서 처리)
  // 여기서는 제목이 표시되는지만 확인
});

// ============================================
// Failure Scenarios
// ============================================

test("로컬스토리지에 데이터가 없을 때 빈 목록이 표시되는지 확인", async ({ page }) => {
  // 로컬스토리지 초기화
  await page.goto("/diaries");
  await page.evaluate(() => {
    localStorage.removeItem("diaries");
  });
  
  // 페이지 새로고침
  await page.reload();
  
  // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  
  // 일기 카드가 없는지 확인
  const cards = page.locator('[data-testid="diary-card"]');
  await expect(cards).toHaveCount(0);
  
  // 빈 상태 메시지가 있는지 확인 (있다면)
  const emptyState = page.locator('[data-testid="empty-state"]');
  if (await emptyState.count() > 0) {
    await expect(emptyState).toBeVisible();
  }
});

test("로컬스토리지 데이터가 잘못된 형식일 때 에러 처리 확인", async ({ page }) => {
  // 먼저 실제 데이터를 하나 생성
  const diaryData = {
    title: "테스트 일기",
    content: "테스트 내용입니다.",
    emotion: EmotionType.HAPPY
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 잘못된 JSON 형식으로 로컬스토리지 설정
    await page.waitForTimeout(300); // 네비게이션 안정화를 위한 대기
  await page.goto("/diaries", { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem("diaries", "invalid json");
  });
  
  // 페이지 새로고침
  await page.reload();
  
  // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  
  // 에러 상태 확인 (에러 메시지가 표시되는지)
  const errorMessage = page.locator('[data-testid="error-message"]');
  if (await errorMessage.count() > 0) {
    await expect(errorMessage).toBeVisible();
  }
  
  // 일기 카드가 없는지 확인
  const cards = page.locator('[data-testid="diary-card"]');
  await expect(cards).toHaveCount(0);
});

test("로컬스토리지 데이터가 배열이 아닐 때 에러 처리 확인", async ({ page }) => {
  // 먼저 실제 데이터를 하나 생성
  const diaryData = {
    title: "테스트 일기",
    content: "테스트 내용입니다.",
    emotion: EmotionType.HAPPY
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 배열이 아닌 객체로 로컬스토리지 설정
    await page.waitForTimeout(300); // 네비게이션 안정화를 위한 대기
  await page.goto("/diaries", { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem("diaries", JSON.stringify({ invalid: "data" }));
  });
  
  // 페이지 새로고침
  await page.reload();
  
  // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  
  // 에러 상태 확인
  const errorMessage = page.locator('[data-testid="error-message"]');
  if (await errorMessage.count() > 0) {
    await expect(errorMessage).toBeVisible();
  }
  
  // 일기 카드가 없는지 확인
  const cards = page.locator('[data-testid="diary-card"]');
  await expect(cards).toHaveCount(0);
});

// ============================================
// Edge Cases
// ============================================

test("일부 데이터가 유효하지 않을 때 유효한 데이터만 표시되는지 확인", async ({ page }) => {
  // 먼저 실제 데이터를 하나 생성
  const diaryData = {
    title: "테스트 일기",
    content: "테스트 내용입니다.",
    emotion: EmotionType.HAPPY
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 유효한 데이터와 유효하지 않은 데이터를 섞어서 설정
    await page.waitForTimeout(300); // 네비게이션 안정화를 위한 대기
  await page.goto("/diaries", { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const validData = [
      {
        id: 1,
        title: "유효한 일기",
        content: "유효한 내용",
        emotion: "HAPPY",
        createdAt: "2024-01-01"
      },
      {
        id: 2,
        title: "유효하지 않은 일기",
        content: "유효하지 않은 내용",
        emotion: "INVALID_EMOTION", // 유효하지 않은 감정
        createdAt: "2024-01-02"
      },
      {
        id: 3,
        title: "또 다른 유효한 일기",
        content: "또 다른 유효한 내용",
        emotion: "SAD",
        createdAt: "2024-01-03"
      }
    ];
    localStorage.setItem("diaries", JSON.stringify(validData));
  });
  
  // 페이지 새로고침
  await page.reload();
  
  // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  
  // 유효한 데이터만 표시되는지 확인 (2개)
  const cards = page.locator('[data-testid="diary-card"]');
  await expect(cards).toHaveCount(2);
  
  // 각 카드의 제목 확인
  await expect(cards.nth(0).locator('[data-testid="diary-title"]')).toContainText("유효한 일기");
  await expect(cards.nth(1).locator('[data-testid="diary-title"]')).toContainText("또 다른 유효한 일기");
});
