import { test, expect } from '@playwright/test';

test.describe('DiariesNew Form Hook Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지 초기화
    await page.goto('/diaries');
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });
    
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('[data-testid="diary-write-button"]');
    
    // 모달이 열릴 때까지 대기
    await page.waitForSelector('[data-testid="diaries-new-modal"]', { timeout: 500 });
  });

  test('should validate required fields', async ({ page }) => {
    // 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator('[data-testid="diaries-submit-button"]');
    await expect(submitButton).toBeDisabled();

    // 제목만 입력
    await page.fill('[data-testid="diary-title-input"]', '테스트 제목');
    await expect(submitButton).toBeDisabled();

    // 내용만 추가 입력
    await page.fill('[data-testid="diary-content-textarea"]', '테스트 내용');
    await expect(submitButton).toBeDisabled();

    // 감정 선택
    await page.click('[data-testid="emotion-happy"]');
    
    // 모든 필드가 입력되면 버튼 활성화
    await expect(submitButton).toBeEnabled();
  });

  test('should save diary to localStorage with new ID when no existing data', async ({ page }) => {
    // 폼 입력
    await page.fill('[data-testid="diary-title-input"]', '첫 번째 일기');
    await page.fill('[data-testid="diary-content-textarea"]', '첫 번째 일기 내용입니다.');
    await page.click('[data-testid="emotion-happy"]');

    // 등록하기 버튼 클릭
    await page.click('[data-testid="diaries-submit-button"]');

    // 성공 모달이 나타나는지 확인
    await page.waitForSelector('[data-testid="diary-success-modal"]', { timeout: 500 });

    // 로컬스토리지에 데이터가 저장되었는지 확인
    const storageData = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : null;
    });

    expect(storageData).toBeTruthy();
    expect(storageData).toHaveLength(1);
    expect(storageData[0]).toMatchObject({
      id: 1,
      title: '첫 번째 일기',
      content: '첫 번째 일기 내용입니다.',
      emotion: 'HAPPY'
    });
    expect(storageData[0].createdAt).toBeTruthy();
  });

  test('should save diary with incremented ID when existing data exists', async ({ page }) => {
    // 기존 데이터 설정
    await page.evaluate(() => {
      const existingData = [
        {
          id: 1,
          title: '기존 일기',
          content: '기존 내용',
          emotion: 'SAD',
          createdAt: '2023-01-01T00:00:00.000Z'
        },
        {
          id: 3,
          title: '다른 일기',
          content: '다른 내용',
          emotion: 'ANGRY',
          createdAt: '2023-01-02T00:00:00.000Z'
        }
      ];
      localStorage.setItem('diaries', JSON.stringify(existingData));
    });

    // 폼 입력
    await page.fill('[data-testid="diary-title-input"]', '새로운 일기');
    await page.fill('[data-testid="diary-content-textarea"]', '새로운 일기 내용입니다.');
    await page.click('[data-testid="emotion-surprise"]');

    // 등록하기 버튼 클릭
    await page.click('[data-testid="diaries-submit-button"]');

    // 성공 모달이 나타나는지 확인
    await page.waitForSelector('[data-testid="diary-success-modal"]', { timeout: 500 });

    // 로컬스토리지에 데이터가 추가되었는지 확인
    const storageData = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : null;
    });

    expect(storageData).toHaveLength(3);
    
    // 새로 추가된 데이터 확인 (가장 큰 ID + 1)
    const newDiary = storageData.find((diary: { id: number; title: string; content: string; emotion: string }) => diary.title === '새로운 일기');
    expect(newDiary).toMatchObject({
      id: 4, // 기존 최대 ID(3) + 1
      title: '새로운 일기',
      content: '새로운 일기 내용입니다.',
      emotion: 'SURPRISE'
    });
  });

  test('should show success modal and navigate to detail page on confirm', async ({ page }) => {
    // 폼 입력
    await page.fill('[data-testid="diary-title-input"]', '상세페이지 테스트');
    await page.fill('[data-testid="diary-content-textarea"]', '상세페이지로 이동하는 테스트입니다.');
    await page.click('[data-testid="emotion-etc"]');

    // 등록하기 버튼 클릭
    await page.click('[data-testid="diaries-submit-button"]');

    // 성공 모달이 나타나는지 확인
    await page.waitForSelector('[data-testid="diary-success-modal"]', { timeout: 500 });
    
    // 모달 내용 확인
    await expect(page.locator('[data-testid="diary-success-modal"]')).toContainText('등록 완료');
    await expect(page.locator('[data-testid="diary-success-modal"]')).toContainText('일기가 성공적으로 등록되었습니다.');

    // 확인 버튼 클릭
    await page.click('[data-testid="diary-success-modal-confirm"]');

    // 상세페이지로 이동했는지 확인
    await page.waitForURL('/diaries/1', { timeout: 2000 });
    
    // 모든 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="diary-success-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diaries-new-modal"]')).not.toBeVisible();
  });

  test('should display validation errors for empty fields', async ({ page }) => {
    // 빈 제목으로 포커스 이동 (validation 트리거)
    await page.fill('[data-testid="diary-title-input"]', 'a');
    await page.fill('[data-testid="diary-title-input"]', '');
    await page.locator('[data-testid="diary-title-input"]').blur();

    // 빈 내용으로 포커스 이동 (validation 트리거)
    await page.fill('[data-testid="diary-content-textarea"]', 'a');
    await page.fill('[data-testid="diary-content-textarea"]', '');
    await page.locator('[data-testid="diary-content-textarea"]').blur();

    // 에러 메시지가 표시되는지 확인
    await expect(page.locator('[data-testid="title-error"]')).toContainText('제목을 입력해주세요.');
    await expect(page.locator('[data-testid="content-error"]')).toContainText('내용을 입력해주세요.');
  });

  test('should reset form after successful submission', async ({ page }) => {
    // 폼 입력
    await page.fill('[data-testid="diary-title-input"]', '리셋 테스트');
    await page.fill('[data-testid="diary-content-textarea"]', '폼이 리셋되는지 테스트합니다.');
    await page.click('[data-testid="emotion-sad"]');

    // 등록하기 버튼 클릭
    await page.click('[data-testid="diaries-submit-button"]');

    // 성공 모달에서 확인 클릭
    await page.waitForSelector('[data-testid="diary-success-modal"]', { timeout: 500 });
    await page.click('[data-testid="diary-success-modal-confirm"]');

    // 다시 일기쓰기 모달 열기
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(100); // Firefox 네비게이션 안정화
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 2000 });
    await page.click('[data-testid="diary-write-button"]');
    await page.waitForSelector('[data-testid="diaries-new-modal"]', { timeout: 2000 });

    // 폼이 초기화되었는지 확인
    await expect(page.locator('[data-testid="diary-title-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="diary-content-textarea"]')).toHaveValue('');
    
    // 감정 선택이 초기화되었는지 확인
    const emotionInputs = page.locator('input[name="emotion"]');
    const checkedCount = await emotionInputs.evaluateAll(inputs => 
      inputs.filter(input => (input as HTMLInputElement).checked).length
    );
    expect(checkedCount).toBe(0);
  });
});
