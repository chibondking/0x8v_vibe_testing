const { test, expect } = require('@playwright/test');
const GridPage = require('../pages/GridPage');

test.describe('GRID App - UI/UX', () => {
  let gridPage;

  test.beforeEach(async ({ page }) => {
    gridPage = new GridPage(page);
    await gridPage.load();
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/GRID|Grid Square Visualizer/);
  });

  test('header contains app name', async ({ page }) => {
    const header = await gridPage.getHeaderTitle();
    await expect(header).toContainText('GRID');
  });

  test('system status indicator is visible', async ({ page }) => {
    const status = await gridPage.getSystemStatus();
    await expect(status).toBeVisible();
  });

  test('timestamp display is visible', async ({ page }) => {
    const timestamp = await gridPage.getTimestampDisplay();
    await expect(timestamp).toBeVisible();
  });

  test('data input section is visible', async ({ page }) => {
    const dataInputSection = page.locator('h3:has-text("DATA INPUT")');
    await expect(dataInputSection).toBeVisible();
  });

  test('statistics section is visible', async ({ page }) => {
    const statsSection = page.locator('h3:has-text("STATISTICS")');
    await expect(statsSection).toBeVisible();
  });

  test('all checkbox labels are visible', async ({ page }) => {
    const colorByBand = page.locator('text=COLOR BY BAND');
    const brightMap = page.locator('text=BRIGHTER MAP');
    const showFields = page.locator('text=SHOW FIELDS');
    const fieldLabels = page.locator('text=FIELD LABELS');
    await expect(colorByBand).toBeVisible();
    await expect(brightMap).toBeVisible();
    await expect(showFields).toBeVisible();
    await expect(fieldLabels).toBeVisible();
  });

  test('my grid input has placeholder', async ({ page }) => {
    const myGridInput = gridPage.getMyGridInput();
    await expect(myGridInput).toHaveValue('EN91');
  });

  test('my grid input is visible', async ({ page }) => {
    const myGridInput = gridPage.getMyGridInput();
    await expect(myGridInput).toBeVisible();
  });

  test('load demo data button is visible', async ({ page }) => {
    const loadDemoButton = page.locator('button:has-text("LOAD DEMO DATA")');
    await expect(loadDemoButton).toBeVisible();
  });

  test('screenshot button is visible', async ({ page }) => {
    const screenshotBtn = page.locator('button:has-text("SAVE SCREENSHOT")');
    await expect(screenshotBtn).toBeVisible();
  });

  test('view stats button is visible', async ({ page }) => {
    const viewStatsBtn = page.locator('button:has-text("VIEW STATS")');
    await expect(viewStatsBtn).toBeVisible();
  });

  test('map is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const map = await gridPage.getMap();
    await expect(map).toBeVisible();
  });

  test('footer status is visible', async ({ page }) => {
    const footerLeft = page.locator('.status-left, footer');
    const footerRight = page.locator('.status-right, footer');
    await expect(footerLeft.first()).toBeVisible();
    await expect(footerRight.first()).toBeVisible();
  });

  test('page loads without JavaScript errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await gridPage.load();
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });

  test('statistics labels are visible', async ({ page }) => {
    const totalLabel = page.locator('text=TOTAL CONTACTS');
    const gridsLabel = page.locator('text=UNIQUE GRIDS');
    const countriesLabel = page.locator('text=COUNTRIES');
    await expect(totalLabel.first()).toBeVisible();
    await expect(gridsLabel.first()).toBeVisible();
    await expect(countriesLabel.first()).toBeVisible();
  });

  test('buttons are present initially', async ({ page }) => {
    const screenshotBtn = gridPage.getScreenshotButton();
    const viewStatsBtn = gridPage.getViewStatsButton();
    await expect(screenshotBtn).toBeVisible();
    await expect(viewStatsBtn).toBeVisible();
  });

  test('ADIF file input exists in DOM', async ({ page }) => {
    const adifInput = page.locator('#adif-file');
    await expect(adifInput).toBeAttached();
  });

  test('file info exists in DOM', async ({ page }) => {
    const fileInfo = page.locator('#file-info');
    await expect(fileInfo).toBeAttached();
  });

  test('statistics section has all count displays', async ({ page }) => {
    const total = await gridPage.getTotalContacts();
    const grids = await gridPage.getUniqueGrids();
    const countries = await gridPage.getCountries();
    await expect(total).toHaveText('0');
    await expect(grids).toHaveText('0');
    await expect(countries).toHaveText('0');
  });
});
