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

  test('WOPR lights are visible', async ({ page }) => {
    const woprLights = await gridPage.getWoprLights();
    await expect(woprLights).toBeVisible();
  });

  test('timestamp display is visible', async ({ page }) => {
    const timestamp = await gridPage.getTimestampDisplay();
    await expect(timestamp).toBeVisible();
  });

  test('data input section title is visible', async ({ page }) => {
    const dataInputSection = page.locator('section:has-text("DATA INPUT")');
    await expect(dataInputSection).toBeVisible();
  });

  test('display options section title is visible', async ({ page }) => {
    const displayOptionsSection = page.locator('section:has-text("DISPLAY OPTIONS")');
    await expect(displayOptionsSection).toBeVisible();
  });

  test('statistics section title is visible', async ({ page }) => {
    const statsSection = page.locator('section:has-text("STATISTICS")');
    await expect(statsSection).toBeVisible();
  });

  test('all checkbox labels are visible', async ({ page }) => {
    const colorByBand = await gridPage.getColorByBandCheckbox();
    const brightMap = await gridPage.getBrightMapCheckbox();
    const showFields = await gridPage.getShowFieldsCheckbox();
    const showFieldLabels = await gridPage.getShowFieldLabelsCheckbox();
    await expect(colorByBand).toBeVisible();
    await expect(brightMap).toBeVisible();
    await expect(showFields).toBeVisible();
    await expect(showFieldLabels).toBeVisible();
  });

  test('checkbox labels have correct text', async ({ page }) => {
    const colorByBandLabel = page.locator('label:has-text("Color by Band")');
    const brightMapLabel = page.locator('label:has-text("Bright Map")');
    const showFieldsLabel = page.locator('label:has-text("Show Fields")');
    const showFieldLabelsLabel = page.locator('label:has-text("Field Labels")');
    await expect(colorByBandLabel).toBeVisible();
    await expect(brightMapLabel).toBeVisible();
    await expect(showFieldsLabel).toBeVisible();
    await expect(showFieldLabelsLabel).toBeVisible();
  });

  test('my grid input has placeholder', async ({ page }) => {
    const myGridInput = gridPage.getMyGridInput();
    await expect(myGridInput).toHaveAttribute('placeholder', /EN91/);
  });

  test('my grid input has label', async ({ page }) => {
    const myGridLabel = page.locator('label:has-text("My Grid")');
    await expect(myGridLabel).toBeVisible();
  });

  test('load demo data button has correct label', async ({ page }) => {
    const loadDemoButton = gridPage.getLoadDemoDataButton();
    await expect(loadDemoButton).toHaveText(/Demo Data|Load Demo/);
  });

  test('screenshot button has correct label', async ({ page }) => {
    const screenshotBtn = gridPage.getScreenshotButton();
    await expect(screenshotBtn).toHaveText(/Screenshot/);
  });

  test('view stats button has correct label', async ({ page }) => {
    const viewStatsBtn = gridPage.getViewStatsButton();
    await expect(viewStatsBtn).toHaveText(/Stats|Statistics/);
  });

  test('map is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const map = await gridPage.getMap();
    await expect(map).toBeVisible();
  });

  test('footer status is visible', async ({ page }) => {
    const footerLeft = page.locator('.status-left, .footer-left, footer >> text=0x8v');
    const footerRight = page.locator('.status-right, .footer-right');
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
    const totalLabel = page.locator('text=Total Contacts');
    const gridsLabel = page.locator('text=Unique Grids');
    const countriesLabel = page.locator('text=Countries');
    await expect(totalLabel.first()).toBeVisible();
    await expect(gridsLabel.first()).toBeVisible();
    await expect(countriesLabel.first()).toBeVisible();
  });

  test('buttons have correct disabled states initially', async ({ page }) => {
    const screenshotBtn = gridPage.getScreenshotButton();
    const viewStatsBtn = gridPage.getViewStatsButton();
    await expect(screenshotBtn).toBeDisabled();
    await expect(viewStatsBtn).toBeDisabled();
  });

  test('all panels are visible', async ({ page }) => {
    const panels = page.locator('section, .panel');
    const panelCount = await panels.count();
    expect(panelCount).toBeGreaterThanOrEqual(3);
  });

  test('ADIF file input is visible', async ({ page }) => {
    const adifInput = gridPage.getAdifFileInput();
    await expect(adifInput).toBeVisible();
  });

  test('file info displays initially empty', async ({ page }) => {
    const fileInfo = await gridPage.getFileInfo();
    const text = await fileInfo.textContent();
    expect(text.trim()).toBe('');
  });

  test('statistics section has all count displays', async ({ page }) => {
    const total = await gridPage.getTotalContacts();
    const grids = await gridPage.getUniqueGrids();
    const countries = await gridPage.getCountries();
    await expect(total).toHaveText('0');
    await expect(grids).toHaveText('0');
    await expect(countries).toHaveText('0');
  });

  test('stats popup has correct header', async ({ page }) => {
    await gridPage.loadDemoData();
    await page.waitForTimeout(500);
    await gridPage.openStats();
    const statsPopup = gridPage.getStatsPopup();
    await expect(statsPopup).toContainText(/Statistics|GRID STATISTICS/i);
  });
});
