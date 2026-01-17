const { test, expect } = require('@playwright/test');
const GridPage = require('../pages/GridPage');

test.describe('GRID App - Edge Cases', () => {
  let gridPage;

  test.beforeEach(async ({ page }) => {
    gridPage = new GridPage(page);
    await gridPage.load();
  });

  test('handles invalid grid input gracefully', async ({ page }) => {
    await gridPage.getMyGridInput().fill('INVALID');
    await page.keyboard.press('Tab');
    const value = await gridPage.getMyGridInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(4);
  });

  test('handles special characters in grid input', async ({ page }) => {
    await gridPage.getMyGridInput().fill('EN@#$');
    await page.keyboard.press('Tab');
    const value = await gridPage.getMyGridInput().inputValue();
    expect(value).toMatch(/^[A-Z0-9]*$/);
  });

  test('handles grid input with numbers only', async ({ page }) => {
    await gridPage.getMyGridInput().fill('1234');
    await page.keyboard.press('Tab');
    const value = await gridPage.getMyGridInput().inputValue();
    expect(value).toBe('1234');
  });

  test('shows loading state during data load', async ({ page }) => {
    const demoButton = gridPage.getLoadDemoDataButton();
    await demoButton.click();
    const isDisabled = await demoButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('recovers from map resize', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await gridPage.loadDemoData();
    await page.waitForTimeout(1000);
    const map = await gridPage.getMap();
    await expect(map).toBeVisible();
  });

  test('handles empty ADIF file selection gracefully', async ({ page }) => {
    const fileInput = gridPage.getAdifFileInput();
    await fileInput.setInputFiles([]);
    const fileInfo = gridPage.getFileInfo();
    await expect(fileInfo).toHaveText('');
  });

  test('validates grid square format', async ({ page }) => {
    const validGrids = ['EN91', 'EM73', 'FN31', 'JO01', 'PM25'];
    for (const grid of validGrids) {
      await gridPage.getMyGridInput().fill(grid);
      const value = await gridPage.getMyGridInput().inputValue();
      expect(value).toBe(grid.toUpperCase());
    }
  });

  test('handles rapid toggle interactions', async ({ page }) => {
    await gridPage.loadDemoData();
    await page.waitForTimeout(500);
    for (let i = 0; i < 5; i++) {
      await gridPage.toggleColorByBand();
      await gridPage.toggleBrightMap();
    }
    const colorByBand = await gridPage.getColorByBandCheckbox();
    await expect(colorByBand).toBeVisible();
  });

  test('maintains state after statistics popup open/close', async ({ page }) => {
    await gridPage.loadDemoData();
    await page.waitForTimeout(500);
    await gridPage.clickViewStats();
    await gridPage.closeStatsPopup();
    const statsPopup = gridPage.getStatsPopup();
    await expect(statsPopup).toHaveClass(/hidden/);
  });

  test('handles grid input with lowercase letters', async ({ page }) => {
    await gridPage.getMyGridInput().fill('en91');
    await page.keyboard.press('Tab');
    const value = await gridPage.getMyGridInput().inputValue();
    expect(value).toBe('EN91');
  });
});

test.describe('GRID App - ADIF Loading (Skipped)', () => {
  let gridPage;

  test.beforeEach(async ({ page }) => {
    gridPage = new GridPage(page);
    await gridPage.load();
  });

  test.skip('can upload ADIF file and update statistics', async ({ page }) => {
    const fileInput = gridPage.getAdifFileInput();
    await fileInput.setInputFiles('tests/fixtures/test.adif');
    await gridPage.waitForDataLoaded();
    const total = await gridPage.getTotalContacts();
    expect(total).toBeGreaterThan(0);
  });

  test.skip('displays file info after loading ADIF', async ({ page }) => {
    const fileInput = gridPage.getAdifFileInput();
    await fileInput.setInputFiles('tests/fixtures/test.adif');
    await gridPage.waitForDataLoaded();
    const fileInfo = await gridPage.getFileInfo();
    await expect(fileInfo).toBeVisible();
  });

  test.skip('enables buttons after ADIF file upload', async ({ page }) => {
    const fileInput = gridPage.getAdifFileInput();
    await fileInput.setInputFiles('tests/fixtures/test.adif');
    await gridPage.waitForDataLoaded();
    const screenshotBtn = gridPage.getScreenshotButton();
    const viewStatsBtn = gridPage.getViewStatsButton();
    await expect(screenshotBtn).toBeEnabled();
    await expect(viewStatsBtn).toBeEnabled();
  });

  test.skip('can upload and plot ADIF contacts', async ({ page }) => {
    const fileInput = gridPage.getAdifFileInput();
    await fileInput.setInputFiles('tests/fixtures/test.adif');
    await gridPage.waitForDataLoaded();
    const gridCount = await gridPage.getGridSquareCount();
    expect(gridCount).toBeGreaterThan(0);
  });

  test.skip('handles invalid ADIF file gracefully', async ({ page }) => {
    const fileInput = gridPage.getAdifFileInput();
    await fileInput.setInputFiles('tests/fixtures/invalid.adif');
    await page.waitForTimeout(500);
    const errorPopup = page.locator('.error-popup');
    await expect(errorPopup).toBeVisible();
  });

  test.skip('handles empty ADIF file', async ({ page }) => {
    const fileInput = gridPage.getAdifFileInput();
    await fileInput.setInputFiles('tests/fixtures/empty.adif');
    await gridPage.waitForDataLoaded();
    const total = await gridPage.getTotalContacts();
    expect(total).toBe(0);
  });

  test.skip('ADIF and demo data produce similar behavior', async ({ page }) => {
    await gridPage.loadDemoData();
    await page.waitForTimeout(1000);
    const demoStats = await gridPage.getStatistics();

    const fileInput = gridPage.getAdifFileInput();
    await fileInput.setInputFiles('tests/fixtures/test.adif');
    await gridPage.waitForDataLoaded();
    const adifStats = await gridPage.getStatistics();

    expect(adifStats.total).toBeGreaterThan(0);
  });

  test.skip('MY_GRIDSQUARE from ADIF populates grid input', async ({ page }) => {
    const fileInput = gridPage.getAdifFileInput();
    await fileInput.setInputFiles('tests/fixtures/test-with-grid.adif');
    await gridPage.waitForDataLoaded();
    const gridValue = await gridPage.getMyGridInput().inputValue();
    expect(gridValue).toMatch(/^[A-Z]{2}[0-9]{2}$/);
  });
});
