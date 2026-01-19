const { test, expect } = require('@playwright/test');
const { createGridPage } = require('../pages');
const { createTestSuite, MOBILE_VIEWPORT } = require('./test-utils');

/**
 * @typedef {import('../pages/GridPage')} GridPage
 */

const gridContext = createTestSuite({
  pageName: 'GRID',
  createPageObject: createGridPage,
});

test.describe('GRID App - UI/UX', () => {
  test.beforeAll(gridContext.beforeAll);
  test.afterAll(gridContext.afterAll);
  test.beforeEach(gridContext.beforeEach);

  test('page title is correct', async () => {
    const page = gridContext.getPage();
    await expect(page).toHaveTitle(/GRID|Grid Square Visualizer/);
  });

  test('header contains app name', async () => {
    const gridPage = gridContext.getPageObject();
    const header = await gridPage.getHeaderTitle();
    await expect(header).toContainText('GRID');
  });

  test('system status indicator is visible', async () => {
    const gridPage = gridContext.getPageObject();
    const status = await gridPage.getSystemStatus();
    await expect(status).toBeVisible();
  });

  test('timestamp display is visible', async () => {
    const gridPage = gridContext.getPageObject();
    const timestamp = await gridPage.getTimestampDisplay();
    await expect(timestamp).toBeVisible();
  });

  test('data input section is visible', async () => {
    const page = gridContext.getPage();
    const dataInputSection = page.locator('h3:has-text("DATA INPUT")');
    await expect(dataInputSection).toBeVisible();
  });

  test('statistics section is visible', async () => {
    const page = gridContext.getPage();
    const statsSection = page.locator('h3:has-text("STATISTICS")');
    await expect(statsSection).toBeVisible();
  });

  test('all checkbox labels are visible', async () => {
    const page = gridContext.getPage();
    const colorByBand = page.locator('text=COLOR BY BAND');
    const brightMap = page.locator('text=BRIGHTER MAP');
    const showFields = page.locator('text=SHOW FIELDS');
    const fieldLabels = page.locator('text=FIELD LABELS');
    await expect(colorByBand).toBeVisible();
    await expect(brightMap).toBeVisible();
    await expect(showFields).toBeVisible();
    await expect(fieldLabels).toBeVisible();
  });

  test('load demo data button is visible', async () => {
    const page = gridContext.getPage();
    const loadDemoButton = page.locator('button:has-text("LOAD DEMO DATA")');
    await expect(loadDemoButton).toBeVisible();
  });

  test('screenshot button is visible', async () => {
    const page = gridContext.getPage();
    const screenshotBtn = page.locator('button:has-text("SAVE SCREENSHOT")');
    await expect(screenshotBtn).toBeVisible();
  });

  test('view stats button is visible', async () => {
    const page = gridContext.getPage();
    const viewStatsBtn = page.locator('button:has-text("VIEW STATS")');
    await expect(viewStatsBtn).toBeVisible();
  });

  test('footer status is visible', async () => {
    const page = gridContext.getPage();
    const footerLeft = page.locator('.status-left, footer');
    const footerRight = page.locator('.status-right, footer');
    await expect(footerLeft.first()).toBeVisible();
    await expect(footerRight.first()).toBeVisible();
  });

  test('ADIF file input exists in DOM', async () => {
    const page = gridContext.getPage();
    const adifInput = page.locator('#adif-file');
    await expect(adifInput).toBeAttached();
  });

  test('file info exists in DOM', async () => {
    const page = gridContext.getPage();
    const fileInfo = page.locator('#file-info');
    await expect(fileInfo).toBeAttached();
  });

  test('statistics section has all count displays', async () => {
    const gridPage = gridContext.getPageObject();
    const total = await gridPage.getTotalContacts();
    const grids = await gridPage.getUniqueGrids();
    const countries = await gridPage.getCountries();
    await expect(total).toHaveText('0');
    await expect(grids).toHaveText('0');
    await expect(countries).toHaveText('0');
  });
});
