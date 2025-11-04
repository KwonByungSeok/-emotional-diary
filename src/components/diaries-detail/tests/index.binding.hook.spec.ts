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
  await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  
  // 일기쓰기 버튼 클릭
  await page.click('[data-testid="diary-write-button"]');
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
  
  // 페이지가 안정화될 때까지 대기
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

test.skip("일기 상세 페이지에서 실제 데이터가 올바르게 바인딩되는지 확인", async ({ page }) => {
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
  
  // 일기 상세 페이지로 이동 (네비게이션 안정화를 위해 대기)
  await page.waitForTimeout(300);
  await page.goto(`/diaries/${diaryId}`, { waitUntil: 'domcontentloaded' });
  
  // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
  await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
  
  // 제목 확인
  await expect(page.locator('[data-testid="diary-title"]')).toHaveText(diaryData.title);
  
  // 감정 아이콘 확인
  const emotionIcon = page.locator('[data-testid="emotion-icon"]');
  await expect(emotionIcon).toBeVisible();
  
  // 감정 텍스트 확인
  await expect(page.locator('[data-testid="emotion-text"]')).toHaveText("행복해요");
  
  // 작성일 확인 (실제 생성된 날짜)
  await expect(page.locator('[data-testid="created-date"]')).toBeVisible();
  
  // 내용 확인
  await expect(page.locator('[data-testid="diary-content"]')).toContainText(diaryData.content);
});

test.skip("다른 ID의 일기 데이터가 올바르게 바인딩되는지 확인", async ({ page }) => {
  // 실제 일기 데이터 생성
  const diaryData = {
    title: "슬픈 하루",
    content: "오늘은 정말 슬픈 하루였습니다. 좋아하던 사람과 이별했어요.",
    emotion: EmotionType.SAD
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 생성된 일기 데이터 확인
  const realData = await getRealDiaryData(page);
  expect(realData.length).toBeGreaterThan(0);
  
  const createdDiary = realData[realData.length - 1]; // 가장 최근 생성된 일기
  const diaryId = createdDiary.id;
  
  // 일기 상세 페이지로 이동 (네비게이션 안정화를 위해 대기)
  await page.waitForTimeout(300);
  await page.goto(`/diaries/${diaryId}`, { waitUntil: 'domcontentloaded' });
  
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
  
  // 제목 확인
  await expect(page.locator('[data-testid="diary-title"]')).toHaveText(diaryData.title);
  
  // 감정 텍스트 확인
  await expect(page.locator('[data-testid="emotion-text"]')).toHaveText("슬퍼요");
  
  // 내용 확인
  await expect(page.locator('[data-testid="diary-content"]')).toContainText(diaryData.content);
});

test("세 번째 ID의 일기 데이터가 올바르게 바인딩되는지 확인", async ({ page }) => {
  // 실제 일기 데이터 생성
  const diaryData = {
    title: "화가 나는 일",
    content: "오늘은 정말 화가 났습니다. 차가 막혀서 늦었어요.",
    emotion: EmotionType.ANGRY
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 생성된 일기 데이터 확인
  const realData = await getRealDiaryData(page);
  expect(realData.length).toBeGreaterThan(0);
  
  const createdDiary = realData[realData.length - 1]; // 가장 최근 생성된 일기
  const diaryId = createdDiary.id;
  
  // 일기 상세 페이지로 이동 (네비게이션 안정화를 위해 대기)
  await page.waitForTimeout(300);
  await page.goto(`/diaries/${diaryId}`);
  
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
  
  // 제목 확인
  await expect(page.locator('[data-testid="diary-title"]')).toHaveText(diaryData.title);
  
  // 감정 텍스트 확인
  await expect(page.locator('[data-testid="emotion-text"]')).toHaveText("화나요");
  
  // 내용 확인
  await expect(page.locator('[data-testid="diary-content"]')).toContainText(diaryData.content);
});

// ============================================
// Failure Scenarios
// ============================================

test("존재하지 않는 ID로 접근 시 에러 처리 확인", async ({ page }) => {
  // 먼저 실제 데이터를 하나 생성
  const diaryData = {
    title: "테스트 일기",
    content: "테스트 내용입니다.",
    emotion: EmotionType.HAPPY
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 존재하지 않는 ID로 접근 (실제로는 존재하지 않는 ID)
  await page.goto("/diaries/99999");
  
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
  
  // 에러 메시지 확인
  await expect(page.locator('[data-testid="error-message"]')).toContainText("ID 99999에 해당하는 일기를 찾을 수 없습니다");
});

test("로컬스토리지에 데이터가 없을 때 에러 처리 확인", async ({ page }) => {
  // 로컬스토리지 초기화 (실제 브라우저 환경에서)
  await page.goto("/diaries");
  await page.evaluate(() => {
    localStorage.removeItem("diaries");
  });
  
  // 일기 상세 페이지로 이동 (데이터가 없는 상태)
  await page.goto("/diaries/1");
  
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
  
  // 에러 메시지 확인
  await expect(page.locator('[data-testid="error-message"]')).toContainText("저장된 일기 데이터가 없습니다");
});

test("잘못된 ID 형식으로 접근 시 에러 처리 확인", async ({ page }) => {
  // 먼저 실제 데이터를 하나 생성
  const diaryData = {
    title: "테스트 일기",
    content: "테스트 내용입니다.",
    emotion: EmotionType.HAPPY
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 잘못된 ID 형식으로 접근
  await page.goto("/diaries/invalid");
  
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
  
  // 에러 메시지 확인 (NaN 처리)
  await expect(page.locator('[data-testid="error-message"]')).toContainText("ID invalid에 해당하는 일기를 찾을 수 없습니다");
});

// ============================================
// Edge Cases
// ============================================

// ID가 제공되지 않았을 때의 테스트는 실제로는 라우팅에서 막히므로 제거
// 실제 애플리케이션에서는 /diaries/ 경로가 존재하지 않음

test("로컬스토리지 데이터가 잘못된 형식일 때 에러 처리 확인", async ({ page }) => {
  // 먼저 실제 데이터를 하나 생성
  const diaryData = {
    title: "테스트 일기",
    content: "테스트 내용입니다.",
    emotion: EmotionType.HAPPY
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 잘못된 JSON 형식으로 로컬스토리지 설정 (실제 브라우저 환경에서)
  await page.goto("/diaries");
  await page.evaluate(() => {
    localStorage.setItem("diaries", "invalid json");
  });
  
  // 일기 상세 페이지로 이동
  await page.goto("/diaries/1");
  
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
  
  // 에러 메시지 확인
  await expect(page.locator('[data-testid="error-message"]')).toContainText("일기 데이터를 불러오는 중 오류가 발생했습니다");
});
