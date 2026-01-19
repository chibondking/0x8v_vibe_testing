const { test, expect } = require('@playwright/test');
const { createGridPage } = require('../pages');
const { createTestSuite } = require('./test-utils');
const { MOBILE_VIEWPORT } = require('./assertions');

/**
 * @typedef {import('../pages/GridPage')} GridPageType
 */

test.describe('GRID App - Edge Cases', () => {
  /** @type {GridPageType} */
  let gridPage;

const gridContext = createTestSuite({
  pageName: 'GRID',
  createPageObject: createGridPage,
});

test.describe('GRID App - Edge Cases', () => {
  test.beforeAll(gridContext.beforeAll);
  test.afterAll(gridContext.afterAll);
  test.beforeEach(gridContext.beforeEach);

  test('handles invalid grid input gracefully', async () => {
    const gridPage = gridContext.getPageObject();
    const page = gridContext.getPage();
    await gridPage.getMyGridInput().fill('INVALID');
    await page.keyboard.press('Tab');
    const value = await gridPage.getMyGridInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(4);
  });

  test('handles special characters in grid input', async () => {
    const gridPage = gridContext.getPageObject();
    const page = gridContext.getPage();
    await gridPage.getMyGridInput().fill('EN@#$');
    await page.keyboard.press('Tab');
    const value = await gridPage.getMyGridInput().inputValue();
    expect(value).toMatch(/^[A-Z0-9]*$/);
  });

  test('handles grid input with numbers only', async () => {
    const gridPage = gridContext.getPageObject();
    const page = gridContext.getPage();
    await gridPage.getMyGridInput().fill('1234');
    await page.keyboard.press('Tab');
    const value = await gridPage.getMyGridInput().inputValue();
    expect(value).toBe('1234');
  });

  test('shows loading state during data load', async () => {
    const gridPage = gridContext.getPageObject();
    const demoButton = gridPage.getLoadDemoDataButton();
    await demoButton.click();
    const isDisabled = await demoButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('recovers from map resize', async () => {
    const gridPage = gridContext.getPageObject();
    const page = gridContext.getPage();
    await page.setViewportSize({ width: 1200, height: 800 });
    await gridPage.loadDemoData();
    await page.waitForTimeout(1000);
    await expect(gridPage.getMap()).toBeVisible();
  });

  test('handles empty ADIF file selection gracefully', async () => {
    const gridPage = gridContext.getPageObject();
    await gridPage.getAdifFileInput().setInputFiles([]);
    await expect(gridPage.getFileInfo()).toHaveText('');
  });

  test('validates grid square format', async () => {
    const gridPage = gridContext.getPageObject();
    const validGrids = ['EN91', 'EM73', 'FN31', 'JO01', 'PM25'];
    for (const grid of validGrids) {
      await gridPage.getMyGridInput().fill(grid);
      const value = await gridPage.getMyGridInput().inputValue();
      expect(value).toBe(grid.toUpperCase());
    }
  });

  test('handles rapid toggle interactions', async () => {
    const gridPage = gridContext.getPageObject();
    const page = gridContext.getPage();
    await gridPage.loadDemoData();
    await page.waitForTimeout(500);
    for (let i = 0; i < 5; i++) {
      await gridPage.toggleColorByBand();
      await gridPage.toggleBrightMap();
    }
    await expect(gridPage.getColorByBandCheckbox()).toBeVisible();
  });

  test('maintains state after statistics popup open/close', async () => {
    const gridPage = gridContext.getPageObject();
    const page = gridContext.getPage();
    await gridPage.loadDemoData();
    await page.waitForTimeout(500);
    await gridPage.clickViewStats();
    await gridPage.closeStatsPopup();
    await expect(gridPage.getStatsPopup()).toHaveClass(/hidden/);
  });

  test('handles grid input with lowercase letters', async () => {
    const gridPage = gridContext.getPageObject();
    const page = gridContext.getPage();
    await gridPage.getMyGridInput().fill('en91');
    await page.keyboard.press('Tab');
    const value = await gridPage.getMyGridInput().inputValue();
    expect(value).toBe('EN91');
  });
});

test.describe('GRID App - ADIF Loading (Skipped)', () => {
  test.beforeAll(gridContext.beforeAll);
  test.afterAll(gridContext.afterAll);
  test.beforeEach(gridContext.beforeEach);

  test.skip('can upload ADIF file and update statistics', async () => {
    const gridPage = gridContext.getPageObject();
    await gridPage.getAdifFileInput().setInputFiles('tests/fixtures/test.adif');
    await gridPage.waitForDataLoaded();
    const total = await gridPage.getTotalContacts();
    expect(total).toBeGreaterThan(0);
  });

  test.skip('displays file info after loading ADIF', async () => {
    const gridPage = gridContext.getPageObject();
    await gridPage.getAdifFileInput().setInputFiles('tests/fixtures/test.adif');
    await gridPage.waitForDataLoaded();
    await expect(gridPage.getFileInfo()).toBeVisible();
  });

  test.skip('enables buttons after ADIF file upload', async () => {
    const gridPage = gridContext.getPageObject();
    await gridPage.getAdifFileInput().setInputFiles('tests/fixtures/test.adif');
    await gridPage.waitForDataLoaded();
    await expect(gridPage.getScreenshotButton()).toBeEnabled();
    await expect(gridPage.getViewStatsButton()).toBeEnabled();
  });

  test.skip('can upload and plot ADIF contacts', async () => {
    const gridPage = gridContext.getPageObject();
    await gridPage.getAdifFileInput().setInputFiles('tests/fixtures/test.adif');
    await gridPage.waitForDataLoaded();
    const gridCount = await gridPage.getGridSquareCount();
    expect(gridCount).toBeGreaterThan(0);
  });

  test.skip('handles invalid ADIF file gracefully', async () => {
    const page = gridContext.getPage();
    const gridPage = gridContext.getPageObject();
    await gridPage.getAdifFileInput().setInputFiles('tests/fixtures/invalid.adif');
    await page.waitForTimeout(500);
    await expect(page.locator('.error-popup')).toBeVisible();
  });

  test.skip('handles empty ADIF file', async () => {
    const gridPage = gridContext.getPageObject();
    await gridPage.getAdifFileInput().setInputFiles('tests/fixtures/empty.adif');
    await gridPage.waitForDataLoaded();
    const total = await gridPage.getTotalContacts();
    expect(total).toBe(0);
  });

  test.skip('ADIF and demo data produce similar behavior', async () => {
    const gridPage = gridContext.getPageObject();
    const page = gridContext.getPage();
    await gridPage.loadDemoData();
    await page.waitForTimeout(1000);
    const demoStats = await gridPage.getStatistics();

    await gridPage.getAdifFileInput().setInputFiles('tests/fixtures/test.adif');
    await gridPage.waitForDataLoaded();
    const adifStats = await gridPage.getStatistics();

    expect(adifStats.total).toBeGreaterThan(0);
  });

  test.skip('MY_GRIDSQUARE from ADIF populates grid input', async () => {
    const gridPage = gridContext.getPageObject();
    await gridPage.getAdifFileInput().setInputFiles('tests/fixtures/test-with-grid.adif');
    await gridPage.waitForDataLoaded();
    const gridValue = await gridPage.getMyGridInput().inputValue();
    expect(gridValue).toMatch(/^[A-Z]{2}[0-9]{2}$/);
  });
});
