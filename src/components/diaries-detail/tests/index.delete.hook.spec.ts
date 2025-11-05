import { test, expect, Page } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";
import { DiaryData } from "../hooks/index.delete.hook";

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

test("삭제 버튼 클릭 시 일기삭제 모달이 노출되어야 함", async ({ page }) => {
  // 실제 일기 데이터 생성
  const diaryData = {
    title: "삭제 테스트 일기",
    content: "이 일기는 삭제 테스트를 위한 일기입니다.",
    emotion: EmotionType.HAPPY
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 생성된 일기 데이터 확인
  const realData = await getRealDiaryData(page);
  expect(realData.length).toBeGreaterThan(0);
  
  const createdDiary = realData[realData.length - 1]; // 가장 최근 생성된 일기
  const diaryId = createdDiary.id;
  
  // 일기 상세 페이지로 이동
  await page.goto(`/diaries/${diaryId}`);
  
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
  
  // 삭제 버튼 클릭
  await page.click('button:has-text("삭제")');
  
  // 일기삭제 모달이 노출되는지 확인
  await page.waitForSelector('[data-testid="diary-delete-modal"]', { timeout: 499 });
  await expect(page.locator('[data-testid="diary-delete-modal"]')).toBeVisible();
});

test("일기삭제 모달에서 취소 버튼 클릭 시 모달이 닫혀야 함", async ({ page }) => {
  // 실제 일기 데이터 생성
  const diaryData = {
    title: "취소 테스트 일기",
    content: "이 일기는 취소 테스트를 위한 일기입니다.",
    emotion: EmotionType.SAD
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 생성된 일기 데이터 확인
  const realData = await getRealDiaryData(page);
  expect(realData.length).toBeGreaterThan(0);
  
  const createdDiary = realData[realData.length - 1];
  const diaryId = createdDiary.id;
  
  // 일기 상세 페이지로 이동
  await page.goto(`/diaries/${diaryId}`);
  
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
  
  // 삭제 버튼 클릭
  await page.click('button:has-text("삭제")');
  
  // 모달이 노출되는지 확인
  await page.waitForSelector('[data-testid="diary-delete-modal"]', { timeout: 499 });
  
  // 취소 버튼 클릭
  await page.click('[data-testid="diary-delete-modal-cancel"]');
  
  // 모달이 닫혔는지 확인
  await page.waitForSelector('[data-testid="diary-delete-modal"]', { state: 'hidden', timeout: 499 });
  
  // 일기 상세 페이지에 여전히 머물러 있는지 확인
  await expect(page).toHaveURL(`/diaries/${diaryId}`);
});

test("일기삭제 모달에서 삭제 버튼 클릭 시 해당 일기가 로컬스토리지에서 제거되고 /diaries로 이동해야 함", async ({ page }) => {
  // 실제 일기 데이터 생성
  const diaryData = {
    title: "삭제 확인 테스트 일기",
    content: "이 일기는 삭제 확인 테스트를 위한 일기입니다.",
    emotion: EmotionType.ANGRY
  };
  
  await createRealDiaryData(page, diaryData);
  
  // 생성된 일기 데이터 확인
  const realDataBefore = await getRealDiaryData(page);
  expect(realDataBefore.length).toBeGreaterThan(0);
  
  const createdDiary = realDataBefore[realDataBefore.length - 1];
  const diaryId = createdDiary.id;
  
  // 삭제 전 일기 개수 저장
  const diaryCountBefore = realDataBefore.length;
  
  // 일기 상세 페이지로 이동
  await page.goto(`/diaries/${diaryId}`);
  
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 499 });
  
  // 삭제 버튼 클릭
  await page.click('button:has-text("삭제")');
  
  // 모달이 노출되는지 확인
  await page.waitForSelector('[data-testid="diary-delete-modal"]', { timeout: 499 });
  
  // 삭제 버튼 클릭
  await page.click('[data-testid="diary-delete-modal-confirm"]');
  
  // /diaries 페이지로 이동했는지 확인
  await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });
  await expect(page).toHaveURL('/diaries');
  
  // 로컬스토리지에서 해당 일기가 제거되었는지 확인
  const realDataAfter = await getRealDiaryData(page);
  const diaryCountAfter = realDataAfter.length;
  
  // 일기 개수가 1개 감소했는지 확인
  expect(diaryCountAfter).toBe(diaryCountBefore - 1);
  
  // 삭제된 일기가 로컬스토리지에 없는지 확인
  const deletedDiary = (realDataAfter as DiaryData[]).find((diary: DiaryData) => diary.id === diaryId);
  expect(deletedDiary).toBeUndefined();
});

