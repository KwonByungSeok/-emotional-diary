import { test, expect } from "@playwright/test";

test.describe("Pictures Component - Filter Hook Tests", () => {
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto("/pictures");
    
    // 페이지가 완전히 로드될 때까지 대기 (network 통신이 아닌 경우: 500ms 미만)
    await page.waitForSelector('[data-testid="pictures-page"]', { timeout: 2000 });
    
    // 사진이 로드될 때까지 대기 (network 통신인 경우: 2000ms 미만)
    await page.waitForSelector('[data-testid="picture-item"]', { timeout: 1999 });
  });

  test.skip("필터 선택박스가 기본 옵션으로 초기화되어야 함", async ({ page }) => {
    // 필터 선택박스가 존재하는지 확인
    const filterSelect = page.locator('[data-testid="pictures-filter"]');
    await expect(filterSelect).toBeVisible();
    
    // 기본 옵션이 선택되어 있는지 확인
    // SelectBox의 현재 선택된 값을 확인하기 위해 버튼 텍스트를 확인
    const selectedText = await filterSelect.locator('[role="button"]').textContent();
    expect(selectedText).toContain("기본");
  });

  test.skip("필터를 기본으로 선택 시 이미지가 640x640 사이즈여야 함", async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="pictures-filter"]');
    await filterSelect.locator('[role="button"]').click();
    
    // "기본" 옵션 선택
    await page.locator('[role="option"]:has-text("기본")').click();
    
    // 이미지 사이즈가 변경될 때까지 대기
    await page.waitForTimeout(300);
    
    // 첫 번째 이미지 아이템의 사이즈 확인
    const firstPictureItem = page.locator('[data-testid="picture-item"]').first();
    const width = await firstPictureItem.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    const height = await firstPictureItem.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    
    // 640x640 사이즈 확인 (약간의 오차 허용)
    expect(parseFloat(width)).toBeCloseTo(640, 0);
    expect(parseFloat(height)).toBeCloseTo(640, 0);
  });

  test.skip("필터를 가로형으로 선택 시 이미지가 640x480 사이즈여야 함", async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="pictures-filter"]');
    await filterSelect.locator('[role="button"]').click();
    
    // "가로형" 옵션 선택
    await page.locator('[role="option"]:has-text("가로형")').click();
    
    // 이미지 사이즈가 변경될 때까지 대기
    await page.waitForTimeout(300);
    
    // 첫 번째 이미지 아이템의 사이즈 확인
    const firstPictureItem = page.locator('[data-testid="picture-item"]').first();
    const width = await firstPictureItem.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    const height = await firstPictureItem.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    
    // 640x480 사이즈 확인 (약간의 오차 허용)
    expect(parseFloat(width)).toBeCloseTo(640, 0);
    expect(parseFloat(height)).toBeCloseTo(480, 0);
  });

  test.skip("필터를 세로형으로 선택 시 이미지가 480x640 사이즈여야 함", async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="pictures-filter"]');
    await filterSelect.locator('[role="button"]').click();
    
    // "세로형" 옵션 선택
    await page.locator('[role="option"]:has-text("세로형")').click();
    
    // 이미지 사이즈가 변경될 때까지 대기
    await page.waitForTimeout(300);
    
    // 첫 번째 이미지 아이템의 사이즈 확인
    const firstPictureItem = page.locator('[data-testid="picture-item"]').first();
    const width = await firstPictureItem.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    const height = await firstPictureItem.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    
    // 480x640 사이즈 확인 (약간의 오차 허용)
    expect(parseFloat(width)).toBeCloseTo(480, 0);
    expect(parseFloat(height)).toBeCloseTo(640, 0);
  });

  test("필터 변경 시 모든 이미지 아이템의 사이즈가 일괄 변경되어야 함", async ({ page }) => {
    // 초기 상태 확인 (기본 사이즈)
    const pictureItems = page.locator('[data-testid="picture-item"]');
    const initialCount = await pictureItems.count();
    
    // 가로형으로 변경
    const filterSelect = page.locator('[data-testid="pictures-filter"]');
    await filterSelect.locator('[role="button"]').click();
    await page.locator('[role="option"]:has-text("가로형")').click();
    await page.waitForTimeout(300);
    
    // 모든 이미지 아이템이 같은 사이즈인지 확인
    for (let i = 0; i < Math.min(initialCount, 3); i++) {
      const item = pictureItems.nth(i);
      const width = await item.evaluate((el) => {
        return window.getComputedStyle(el).width;
      });
      const height = await item.evaluate((el) => {
        return window.getComputedStyle(el).height;
      });
      
      expect(parseFloat(width)).toBeCloseTo(640, 0);
      expect(parseFloat(height)).toBeCloseTo(480, 0);
    }
  });

  test("필터 옵션 목록이 올바르게 표시되어야 함", async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="pictures-filter"]');
    await filterSelect.locator('[role="button"]').click();
    
    // 옵션 목록 확인
    const options = page.locator('[role="option"]');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThanOrEqual(3);
    
    // 각 옵션 텍스트 확인
    const optionTexts = await options.allTextContents();
    expect(optionTexts).toContain("기본");
    expect(optionTexts).toContain("가로형");
    expect(optionTexts).toContain("세로형");
  });

  test("유저 시나리오: 필터 변경하기", async ({ page }) => {
    // 1. 초기 상태: 기본 필터가 선택되어 있음 (640x640)
    let firstItem = page.locator('[data-testid="picture-item"]').first();
    let width = await firstItem.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    let height = await firstItem.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    expect(parseFloat(width)).toBeCloseTo(640, 0);
    expect(parseFloat(height)).toBeCloseTo(640, 0);
    
    // 2. 가로형 필터로 변경 (640x480)
    const filterSelect = page.locator('[data-testid="pictures-filter"]');
    await filterSelect.locator('[role="button"]').click();
    await page.locator('[role="option"]:has-text("가로형")').click();
    await page.waitForTimeout(300);
    
    firstItem = page.locator('[data-testid="picture-item"]').first();
    width = await firstItem.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    height = await firstItem.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    expect(parseFloat(width)).toBeCloseTo(640, 0);
    expect(parseFloat(height)).toBeCloseTo(480, 0);
    
    // 3. 세로형 필터로 변경 (480x640)
    await filterSelect.locator('[role="button"]').click();
    await page.locator('[role="option"]:has-text("세로형")').click();
    await page.waitForTimeout(300);
    
    firstItem = page.locator('[data-testid="picture-item"]').first();
    width = await firstItem.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    height = await firstItem.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    expect(parseFloat(width)).toBeCloseTo(480, 0);
    expect(parseFloat(height)).toBeCloseTo(640, 0);
    
    // 4. 다시 기본 필터로 변경 (640x640)
    await filterSelect.locator('[role="button"]').click();
    await page.locator('[role="option"]:has-text("기본")').click();
    await page.waitForTimeout(300);
    
    firstItem = page.locator('[data-testid="picture-item"]').first();
    width = await firstItem.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    height = await firstItem.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    expect(parseFloat(width)).toBeCloseTo(640, 0);
    expect(parseFloat(height)).toBeCloseTo(640, 0);
  });
});
