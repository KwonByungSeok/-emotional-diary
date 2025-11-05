import { test, expect, Page } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

// ============================================
// Helper Functions
// ============================================

/**
 * 실제 일기 데이터를 생성하는 헬퍼 함수
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
  
  // 페이지가 안정화될 때까지 대기 (다이어리 목록 페이지로 돌아왔는지 확인)
  await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
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
// Test Suite
// ============================================

test.describe("일기 상세 수정 기능", () => {
  // ============================================
  // Test Setup
  // ============================================

  test.beforeEach(async () => {
    // 실제 데이터를 사용하기 위해 로컬스토리지 모킹 제거
    // 대신 실제 애플리케이션에서 생성된 데이터를 사용
  });

  // ============================================
  // Edit Mode Toggle Tests
  // ============================================

  test("수정 버튼 클릭 시 수정 모드로 전환된다", async ({ page }) => {
    // 실제 일기 데이터 생성
    const diaryData = {
      title: "수정 테스트 일기",
      content: "수정 테스트 내용입니다.",
      emotion: EmotionType.HAPPY
    };
    
    await createRealDiaryData(page, diaryData);
    
    // 생성된 일기 데이터 확인
    const realData = await getRealDiaryData(page);
    expect(realData.length).toBeGreaterThan(0);
    
    const createdDiary = realData[realData.length - 1];
    const diaryId = createdDiary.id;
    
    // 일기 상세 페이지로 이동
    await page.goto(`/diaries/${diaryId}`, { waitUntil: 'networkidle' });
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });
    
    // 수정 버튼 클릭
    const editButton = page.locator('button:has-text("수정")');
    await editButton.click();
    
    // 수정 모드로 전환되었는지 확인 (감정 선택 영역이 보이는지 확인)
    await page.waitForSelector('[data-testid="edit-emotion-section"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="edit-emotion-section"]')).toBeVisible();
  });

  test("수정 모드로 전환 시 제목과 내용 입력 필드가 표시된다", async ({ page }) => {
    // 실제 일기 데이터 생성
    const diaryData = {
      title: "수정 테스트 일기",
      content: "수정 테스트 내용입니다.",
      emotion: EmotionType.HAPPY
    };
    
    await createRealDiaryData(page, diaryData);
    
    const realData = await getRealDiaryData(page);
    const createdDiary = realData[realData.length - 1];
    const diaryId = createdDiary.id;
    
    // 일기 상세 페이지로 이동
    await page.waitForTimeout(300);
    await page.goto(`/diaries/${diaryId}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });
    
    // 수정 버튼 클릭
    await page.click('button:has-text("수정")');
    
    // 수정 모드 입력 필드 확인
    await page.waitForSelector('[data-testid="edit-title-input"]', { timeout: 5000 });
    await page.waitForSelector('[data-testid="edit-content-textarea"]', { timeout: 5000 });
    
    await expect(page.locator('[data-testid="edit-title-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="edit-content-textarea"]')).toBeVisible();
  });

  test("수정 모드로 전환 시 회고 입력창이 비활성화된다", async ({ page }) => {
    // 실제 일기 데이터 생성
    const diaryData = {
      title: "수정 테스트 일기",
      content: "수정 테스트 내용입니다.",
      emotion: EmotionType.HAPPY
    };
    
    await createRealDiaryData(page, diaryData);
    
    const realData = await getRealDiaryData(page);
    const createdDiary = realData[realData.length - 1];
    const diaryId = createdDiary.id;
    
    // 일기 상세 페이지로 이동
    await page.waitForTimeout(300);
    await page.goto(`/diaries/${diaryId}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });
    
    // 수정 버튼 클릭
    await page.click('button:has-text("수정")');
    
    // 수정 모드로 전환되었는지 확인
    await page.waitForSelector('[data-testid="edit-emotion-section"]', { timeout: 5000 });
    
    // 회고 입력창이 비활성화되었는지 확인
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    await expect(retrospectInput).toBeDisabled();
    
    // 회고 입력 버튼도 비활성화되었는지 확인
    const retrospectSubmitButton = page.locator('[data-testid="retrospect-submit-button"]');
    await expect(retrospectSubmitButton).toBeDisabled();
  });

  // ============================================
  // Edit Form Tests
  // ============================================

  test("수정 모드에서 감정, 제목, 내용을 변경하고 수정 완료한다", async ({ page }) => {
    // 실제 일기 데이터 생성
    const diaryData = {
      title: "원본 제목",
      content: "원본 내용입니다.",
      emotion: EmotionType.HAPPY
    };
    
    await createRealDiaryData(page, diaryData);
    
    const realData = await getRealDiaryData(page);
    const createdDiary = realData[realData.length - 1];
    const diaryId = createdDiary.id;
    
    // 일기 상세 페이지로 이동
    await page.waitForTimeout(300);
    await page.goto(`/diaries/${diaryId}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });
    
    // 수정 버튼 클릭
    await page.click('button:has-text("수정")');
    
    // 수정 모드로 전환되었는지 확인
    await page.waitForSelector('[data-testid="edit-emotion-section"]', { timeout: 5000 });
    
    // 감정 변경 (SAD로 변경)
    await page.click('[data-testid="edit-emotion-sad"]');
    
    // 제목 변경
    const titleInput = page.locator('[data-testid="edit-title-input"]');
    await titleInput.clear();
    await titleInput.fill("수정된 제목");
    
    // 내용 변경
    const contentTextarea = page.locator('[data-testid="edit-content-textarea"]');
    await contentTextarea.clear();
    await contentTextarea.fill("수정된 내용입니다.");
    
    // 수정하기 버튼 클릭
    await page.click('[data-testid="edit-submit-button"]');
    
    // 수정 모드가 종료되고 일반 모드로 돌아왔는지 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });
    
    // 수정된 내용이 반영되었는지 확인
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText("수정된 제목");
    await expect(page.locator('[data-testid="diary-content"]')).toContainText("수정된 내용입니다.");
    await expect(page.locator('[data-testid="emotion-text"]')).toHaveText("슬퍼요");
  });

  test("수정 완료 후 로컬스토리지 데이터가 올바르게 업데이트된다", async ({ page }) => {
    // 실제 일기 데이터 생성
    const diaryData = {
      title: "원본 제목",
      content: "원본 내용입니다.",
      emotion: EmotionType.HAPPY
    };
    
    await createRealDiaryData(page, diaryData);
    
    const realData = await getRealDiaryData(page);
    const createdDiary = realData[realData.length - 1];
    const diaryId = createdDiary.id;
    
    // 일기 상세 페이지로 이동
    await page.waitForTimeout(300);
    await page.goto(`/diaries/${diaryId}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });
    
    // 수정 버튼 클릭
    await page.click('button:has-text("수정")');
    await page.waitForSelector('[data-testid="edit-emotion-section"]', { timeout: 5000 });
    
    // 내용 변경
    await page.click('[data-testid="edit-emotion-angry"]');
    const titleInput = page.locator('[data-testid="edit-title-input"]');
    await titleInput.clear();
    await titleInput.fill("업데이트된 제목");
    const contentTextarea = page.locator('[data-testid="edit-content-textarea"]');
    await contentTextarea.clear();
    await contentTextarea.fill("업데이트된 내용입니다.");
    
    // 수정하기 버튼 클릭
    await page.click('[data-testid="edit-submit-button"]');
    
    // 페이지가 새로고침되었는지 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });
    
    // 로컬스토리지에서 데이터 확인
    const updatedData = await getRealDiaryData(page);
    const updatedDiary = updatedData.find((d: { id: number }) => d.id === diaryId);
    
    expect(updatedDiary).toBeDefined();
    expect(updatedDiary.title).toBe("업데이트된 제목");
    expect(updatedDiary.content).toBe("업데이트된 내용입니다.");
    expect(updatedDiary.emotion).toBe(EmotionType.ANGRY);
  });

  test("취소 버튼 클릭 시 수정 모드가 종료되고 원래 내용이 유지된다", async ({ page }) => {
    // 실제 일기 데이터 생성
    const diaryData = {
      title: "원본 제목",
      content: "원본 내용입니다.",
      emotion: EmotionType.HAPPY
    };
    
    await createRealDiaryData(page, diaryData);
    
    const realData = await getRealDiaryData(page);
    const createdDiary = realData[realData.length - 1];
    const diaryId = createdDiary.id;
    
    // 일기 상세 페이지로 이동
    await page.waitForTimeout(300);
    await page.goto(`/diaries/${diaryId}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });
    
    // 원본 제목 저장
    const originalTitle = await page.locator('[data-testid="diary-title"]').textContent();
    
    // 수정 버튼 클릭
    await page.click('button:has-text("수정")');
    await page.waitForSelector('[data-testid="edit-emotion-section"]', { timeout: 5000 });
    
    // 내용 변경
    const titleInput = page.locator('[data-testid="edit-title-input"]');
    await titleInput.clear();
    await titleInput.fill("변경된 제목");
    
    // 취소 버튼 클릭
    await page.click('[data-testid="edit-cancel-button"]');
    
    // 수정 모드가 종료되었는지 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });
    
    // 원래 내용이 유지되었는지 확인
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText(originalTitle || "");
  });
});

