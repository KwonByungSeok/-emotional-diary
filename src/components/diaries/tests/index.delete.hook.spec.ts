import { test, expect } from '@playwright/test';

import { EmotionType } from "@/commons/constants/enum";
import { DiaryData } from "@/commons/types/diary";

// ============================================
// Test Data - 실제 데이터 사용 (Mock 데이터 금지)
// ============================================

/**
 * 실제 테스트용 일기 데이터 생성
 * Mock 데이터가 아닌 실제 데이터 구조를 사용
 */
const createTestDiaries = (): DiaryData[] => {
  const currentDate = new Date();
  return [
    {
      id: Date.now() + 1,
      title: "행복한 하루",
      content: "오늘은 정말 행복한 하루였다.",
      emotion: EmotionType.HAPPY,
      createdAt: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: Date.now() + 2,
      title: "슬픈 하루",
      content: "오늘은 조금 슬픈 일이 있었다.",
      emotion: EmotionType.SAD,
      createdAt: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: Date.now() + 3,
      title: "화난 하루",
      content: "오늘은 화가 났다.",
      emotion: EmotionType.ANGRY,
      createdAt: currentDate.toISOString()
    }
  ];
};

// ============================================
// Test Setup Helpers
// ============================================

/**
 * 로컬스토리지에 실제 테스트 일기 데이터 설정
 * Mock 데이터 대신 실제 데이터 사용
 */
const setupTestDiaries = async (page: import('@playwright/test').Page) => {
  // 페이지 로드 후 로컬스토리지 설정
  await page.goto("/diaries");
  
  // 실제 데이터 생성 및 설정
  const testDiaries = createTestDiaries();
  await page.evaluate((diaries: DiaryData[]) => {
    localStorage.setItem("diaries", JSON.stringify(diaries));
  }, testDiaries);
  
  // 페이지 새로고침하여 데이터 반영
  await page.reload();
};

/**
 * 페이지 로드 대기 (data-testid 기반)
 */
const waitForPageLoad = async (page: import('@playwright/test').Page) => {
  await page.waitForSelector('[data-testid="diaries-container"]');
};

// ============================================
// 비로그인 유저 테스트
// ============================================

test.describe("일기 삭제 기능 - 비로그인 유저", () => {
  test.beforeEach(async ({ page }) => {
    // 비로그인 상태 설정
    await page.evaluate(() => {
      window.__TEST_BYPASS__ = false;
    });
    
    // 테스트 데이터 설정
    await setupTestDiaries(page);
  });

  test("일기카드 각각의 삭제아이콘(X) 미노출 확인", async ({ page }) => {
    // 페이지 로드 확인
    await waitForPageLoad(page);
    
    // 일기 카드들이 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-card"]');
    
    // 모든 일기 카드 조회
    const diaryCards = await page.locator('[data-testid="diary-card"]').all();
    
    // 각 카드에서 삭제 버튼이 보이지 않는지 확인
    for (const card of diaryCards) {
      const deleteButton = card.locator('[data-testid="diary-delete-button"]');
      await expect(deleteButton).not.toBeVisible();
    }
  });
});

// ============================================
// 로그인 유저 테스트
// ============================================

test.describe("일기 삭제 기능 - 로그인 유저", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태 설정 (테스트 바이패스)
    await page.evaluate(() => {
      window.__TEST_BYPASS__ = true;
    });
    
    // 테스트 데이터 설정
    await setupTestDiaries(page);
  });

  test("일기카드 각각의 삭제아이콘(X) 노출 확인", async ({ page }) => {
    // 페이지 로드 확인
    await waitForPageLoad(page);
    
    // 일기 카드들이 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-card"]');
    
    // 모든 일기 카드 조회
    const diaryCards = await page.locator('[data-testid="diary-card"]').all();
    
    // 각 카드에서 삭제 버튼이 보이는지 확인
    for (const card of diaryCards) {
      const deleteButton = card.locator('[data-testid="diary-delete-button"]');
      await expect(deleteButton).toBeVisible();
    }
  });

  test("삭제아이콘(X) 클릭 시 일기삭제 모달 노출", async ({ page }) => {
    // 페이지 로드 확인
    await waitForPageLoad(page);
    
    // 첫 번째 일기 카드의 삭제 버튼 클릭
    await page.waitForSelector('[data-testid="diary-card"]');
    const firstCard = page.locator('[data-testid="diary-card"]').first();
    const deleteButton = firstCard.locator('[data-testid="diary-delete-button"]');
    
    await deleteButton.click();
    
    // 삭제 모달이 나타나는지 확인
    await page.waitForSelector('[data-testid="diary-delete-modal"]');
    
    // 모달 내용 확인
    const modal = page.locator('[data-testid="diary-delete-modal"]');
    await expect(modal).toBeVisible();
    
    // 모달 제목 확인
    await expect(modal.locator('text=일기 삭제')).toBeVisible();
    
    // 모달 내용 확인
    await expect(modal.locator('text=일기를 삭제 하시겠어요?')).toBeVisible();
    
    // 취소 버튼 확인
    await expect(modal.locator('text=취소')).toBeVisible();
    
    // 삭제 버튼 확인
    await expect(modal.locator('text=삭제')).toBeVisible();
  });

  test("삭제 모달에서 취소 클릭 시 모달 닫기", async ({ page }) => {
    // 페이지 로드 확인
    await waitForPageLoad(page);
    
    // 첫 번째 일기 카드의 삭제 버튼 클릭
    await page.waitForSelector('[data-testid="diary-card"]');
    const firstCard = page.locator('[data-testid="diary-card"]').first();
    const deleteButton = firstCard.locator('[data-testid="diary-delete-button"]');
    
    await deleteButton.click();
    
    // 삭제 모달 대기
    await page.waitForSelector('[data-testid="diary-delete-modal"]');
    
    // 취소 버튼 클릭
    const cancelButton = page.locator('[data-testid="diary-delete-modal"]').locator('text=취소');
    await cancelButton.click();
    
    // 모달이 사라지는지 확인
    await expect(page.locator('[data-testid="diary-delete-modal"]')).not.toBeVisible();
  });

  test("삭제 모달에서 삭제 클릭 시 일기 삭제 및 페이지 새로고침", async ({ page }) => {
    // 페이지 로드 확인
    await waitForPageLoad(page);
    
    // 삭제 전 일기 개수 확인
    await page.waitForSelector('[data-testid="diary-card"]');
    const initialCards = await page.locator('[data-testid="diary-card"]').count();
    
    // 첫 번째 일기 카드의 ID 저장 (제목으로 식별)
    const firstCardTitle = await page.locator('[data-testid="diary-card"]').first()
      .locator('[data-testid="diary-title"]').textContent();
    
    // 첫 번째 일기 카드의 삭제 버튼 클릭
    const firstCard = page.locator('[data-testid="diary-card"]').first();
    const deleteButton = firstCard.locator('[data-testid="diary-delete-button"]');
    
    await deleteButton.click();
    
    // 삭제 모달 대기
    await page.waitForSelector('[data-testid="diary-delete-modal"]');
    
    // 삭제 버튼 클릭
    const confirmButton = page.locator('[data-testid="diary-delete-modal"]').locator('text=삭제');
    
    await confirmButton.click();
    
    // 페이지 새로고침 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-container"]');
    
    // 페이지 로드 확인
    await waitForPageLoad(page);
    
    // 로컬스토리지에서 해당 일기가 삭제되었는지 확인
    const remainingDiaries = await page.evaluate((): DiaryData[] => {
      const diariesJson = localStorage.getItem("diaries");
      return diariesJson ? JSON.parse(diariesJson) : [];
    });
    
    // 삭제된 일기가 로컬스토리지에서 제거되었는지 확인
    const deletedDiary = remainingDiaries.find((diary) => diary.title === firstCardTitle);
    expect(deletedDiary).toBeUndefined();
    
    // 일기 개수가 하나 줄었는지 확인
    expect(remainingDiaries.length).toBe(initialCards - 1);
  });

  test("여러 일기 삭제 시나리오", async ({ page }) => {
    // 페이지 로드 확인
    await waitForPageLoad(page);
    
    // 초기 일기 개수 확인
    await page.waitForSelector('[data-testid="diary-card"]');
    const initialCount = await page.locator('[data-testid="diary-card"]').count();
    
    // 첫 번째 일기 삭제
    const firstCard = page.locator('[data-testid="diary-card"]').first();
    const firstDeleteButton = firstCard.locator('[data-testid="diary-delete-button"]');
    
    await firstDeleteButton.click();
    await page.waitForSelector('[data-testid="diary-delete-modal"]');
    
    const firstConfirmButton = page.locator('[data-testid="diary-delete-modal"]').locator('text=삭제');
    
    await firstConfirmButton.click();
    // 페이지 새로고침 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-container"]');
    await waitForPageLoad(page);
    
    // 두 번째 일기 삭제
    await page.waitForSelector('[data-testid="diary-card"]');
    const secondCard = page.locator('[data-testid="diary-card"]').first();
    const secondDeleteButton = secondCard.locator('[data-testid="diary-delete-button"]');
    
    await secondDeleteButton.click();
    await page.waitForSelector('[data-testid="diary-delete-modal"]');
    
    const secondConfirmButton = page.locator('[data-testid="diary-delete-modal"]').locator('text=삭제');
    
    await secondConfirmButton.click();
    // 페이지 새로고침 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-container"]');
    await waitForPageLoad(page);
    
    // 최종 일기 개수 확인
    const remainingDiaries = await page.evaluate((): DiaryData[] => {
      const diariesJson = localStorage.getItem("diaries");
      return diariesJson ? JSON.parse(diariesJson) : [];
    });
    
    expect(remainingDiaries.length).toBe(initialCount - 2);
  });
});
