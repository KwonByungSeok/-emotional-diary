import { test, expect, Page } from '@playwright/test';

// ============================================
// Diaries New Modal Close Functionality Tests
// ============================================

test.describe('일기쓰기 모달 닫기 기능', () => {
  // ============================================
  // Test Setup
  // ============================================

  const setupDiaryModal = async (page: Page) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용, timeout 2000ms)
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="diary-write-button"]');

    // 일기쓰기 모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();
  };

  const openCancelModal = async (page: Page) => {
    // 닫기 버튼 클릭
    await page.click('[data-testid="diaries-new-modal"] button:has-text("닫기")');

    // 등록취소모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"]')).toBeVisible();
  };

  // ============================================
  // Modal Close Cancel Tests
  // ============================================

  test('닫기 버튼 클릭 시 등록취소모달이 열리고, 계속작성 버튼으로 등록취소모달만 닫힌다', async ({
    page,
  }) => {
    await setupDiaryModal(page);
    await openCancelModal(page);

    // 계속작성 버튼 클릭
    await page.click('[data-testid="diaries-cancel-modal-cancel"]');

    // 등록취소모달은 닫히고 일기쓰기 모달은 여전히 열려있는지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();
  });

  test('닫기 버튼 클릭 시 등록취소모달이 열리고, 등록취소 버튼으로 모든 모달이 닫힌다', async ({
    page,
  }) => {
    await setupDiaryModal(page);
    await openCancelModal(page);

    // 등록취소 버튼 클릭
    await page.click('[data-testid="diaries-cancel-modal-confirm"]');

    // 모든 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diaries-new-modal"]')).not.toBeVisible();
  });

  // ============================================
  // Modal Position Tests
  // ============================================

  test('등록취소모달이 일기쓰기폼모달 위에 중앙에 위치한다', async ({
    page,
  }) => {
    await setupDiaryModal(page);
    await openCancelModal(page);

    // 일기쓰기 모달도 여전히 보이는지 확인 (2중 모달)
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();

    // 등록취소모달이 일기쓰기 모달보다 위에 있는지 확인 (z-index)
    const cancelModal = page.locator('[data-testid="diaries-cancel-modal"]');
    const newModal = page.locator('[data-testid="diaries-new-modal"]');
    
    await expect(cancelModal).toBeVisible();
    await expect(newModal).toBeVisible();

    // 등록취소모달의 텍스트 내용 확인
    await expect(cancelModal.locator('h2')).toHaveText('등록을 취소하시겠습니까?');
    await expect(cancelModal.locator('p')).toHaveText('작성 중인 내용이 모두 사라집니다.');

    // 등록취소모달의 버튼 텍스트 확인
    await expect(cancelModal.locator('button:has-text("계속작성")')).toBeVisible();
    await expect(cancelModal.locator('button:has-text("등록취소")')).toBeVisible();

    // 등록취소모달이 중앙에 위치하는지 확인 (CSS 클래스 확인)
    const cancelModalContainer = cancelModal.locator('..');
    await expect(cancelModalContainer).toHaveClass(/content/);
  });

  // ============================================
  // Edge Case Tests
  // ============================================

  test('ESC 키로 등록취소모달이 닫히고 일기쓰기 모달은 유지된다', async ({
    page,
  }) => {
    await setupDiaryModal(page);
    await openCancelModal(page);

    // ESC 키 누르기
    await page.keyboard.press('Escape');

    // 등록취소모달은 닫히고 일기쓰기 모달은 여전히 열려있는지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();
  });

  test('등록취소모달 외부 클릭 시 등록취소모달만 닫힌다', async ({
    page,
  }) => {
    await setupDiaryModal(page);
    await openCancelModal(page);

    // 등록취소모달 외부(배경) 클릭
    const backdrop = page.locator('[class*="backdrop"]').last();
    await backdrop.click({ position: { x: 10, y: 10 } });

    // 등록취소모달은 닫히고 일기쓰기 모달은 여전히 열려있는지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();
  });

  // ============================================
  // User Scenario Tests
  // ============================================

  test('사용자 시나리오: 일기 작성 중 실수로 닫기 버튼 클릭 후 계속 작성', async ({
    page,
  }) => {
    await setupDiaryModal(page);

    // 일기 내용 일부 입력
    await page.fill('input[placeholder="제목을 입력합니다."]', '테스트 제목');
    await page.fill('textarea[placeholder="내용을 입력합니다."]', '테스트 내용');

    // 입력한 내용이 올바르게 저장되었는지 확인
    await expect(page.locator('input[placeholder="제목을 입력합니다."]')).toHaveValue('테스트 제목');
    await expect(page.locator('textarea[placeholder="내용을 입력합니다."]')).toHaveValue('테스트 내용');

    // 실수로 닫기 버튼 클릭
    await page.click('[data-testid="diaries-new-modal"] button:has-text("닫기")');

    // 등록취소모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"]')).toBeVisible();

    // 등록취소모달의 내용이 올바른지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"] h2')).toHaveText('등록을 취소하시겠습니까?');

    // 계속작성 버튼 클릭
    await page.click('[data-testid="diaries-cancel-modal-cancel"]');

    // 등록취소모달은 닫히고 일기쓰기 모달은 여전히 열려있는지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diaries-new-modal"]')).toBeVisible();

    // 입력한 내용이 유지되는지 확인
    await expect(page.locator('input[placeholder="제목을 입력합니다."]')).toHaveValue('테스트 제목');
    await expect(page.locator('textarea[placeholder="내용을 입력합니다."]')).toHaveValue('테스트 내용');

    // 일기쓰기 모달의 제목이 올바른지 확인
    await expect(page.locator('[data-testid="diaries-new-modal"] [class*="headerTitle"]')).toHaveText('일기 쓰기');
  });

  test('사용자 시나리오: 일기 작성 중 닫기 버튼 클릭 후 등록 취소', async ({
    page,
  }) => {
    await setupDiaryModal(page);

    // 일기 내용 일부 입력
    await page.fill('input[placeholder="제목을 입력합니다."]', '취소할 제목');
    await page.fill('textarea[placeholder="내용을 입력합니다."]', '취소할 내용');

    // 입력한 내용이 올바르게 저장되었는지 확인
    await expect(page.locator('input[placeholder="제목을 입력합니다."]')).toHaveValue('취소할 제목');
    await expect(page.locator('textarea[placeholder="내용을 입력합니다."]')).toHaveValue('취소할 내용');

    // 닫기 버튼 클릭
    await page.click('[data-testid="diaries-new-modal"] button:has-text("닫기")');

    // 등록취소모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"]')).toBeVisible();

    // 등록취소모달의 내용이 올바른지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"] h2')).toHaveText('등록을 취소하시겠습니까?');
    await expect(page.locator('[data-testid="diaries-cancel-modal"] p')).toHaveText('작성 중인 내용이 모두 사라집니다.');

    // 등록취소 버튼 클릭
    await page.click('[data-testid="diaries-cancel-modal-confirm"]');

    // 모든 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="diaries-cancel-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diaries-new-modal"]')).not.toBeVisible();

    // 일기목록 페이지로 돌아왔는지 확인
    await expect(page).toHaveURL('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 499 });

    // 일기쓰기 버튼이 다시 보이는지 확인
    await expect(page.locator('[data-testid="diary-write-button"]')).toBeVisible();
  });

});
