const { test, expect, chromium } = require('@playwright/test');
const { createGridPage } = require('../pages');

test.describe('GRID App - Initial Load', () => {
  let page;
  let gridPage;

  test.beforeAll(async () => {
    const browser = await chromium.launch();
    page = await browser.newPage();
    gridPage = createGridPage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await gridPage.load();
  });

  test('displays GRID header and system status', async () => {
    await expect(gridPage.getHeaderTitle()).toHaveText('GRID SQUARE VISUALIZER');
    await expect(gridPage.getSystemStatus()).toBeVisible();
  });

  test('displays WOPR lights', async () => {
    await expect(gridPage.getWoprLights()).toBeVisible();
  });

  test('displays timestamp display', async () => {
    await expect(gridPage.getTimestampDisplay()).toBeVisible();
  });

  test('displays data input section with all elements', async () => {
    await expect(gridPage.getLoadDemoDataButton()).toBeVisible();
    await expect(gridPage.getMyGridInput()).toBeVisible();
  });

  test('displays display options section', async () => {
    await expect(gridPage.getColorByBandCheckbox()).toBeVisible();
    await expect(gridPage.getBrightMapCheckbox()).toBeVisible();
    await expect(gridPage.getShowFieldsCheckbox()).toBeVisible();
    await expect(gridPage.getShowFieldLabelsCheckbox()).toBeVisible();
  });

  test('checkboxes have correct default states', async () => {
    await expect(gridPage.getColorByBandCheckbox()).not.toBeChecked();
    await expect(gridPage.getBrightMapCheckbox()).not.toBeChecked();
    await expect(gridPage.getShowFieldsCheckbox()).toBeChecked();
    await expect(gridPage.getShowFieldLabelsCheckbox()).toBeChecked();
  });

  test('displays statistics section', async () => {
    await expect(gridPage.getTotalContacts()).toHaveText('0');
    await expect(gridPage.getUniqueGrids()).toHaveText('0');
    await expect(gridPage.getCountries()).toHaveText('0');
  });

  test('buttons are disabled initially', async () => {
    await expect(gridPage.getScreenshotButton()).toBeDisabled();
    await expect(gridPage.getViewStatsButton()).toBeDisabled();
  });

  test('displays map container', async () => {
    await expect(gridPage.getMap()).toBeVisible();
  });

  test('map container has correct attributes', async () => {
    const map = gridPage.getMap();
    await expect(map).toHaveAttribute('id', 'map');
  });

  test('my grid input has correct default value', async () => {
    await expect(gridPage.getMyGridInput()).toHaveValue('EN91');
  });

  test('my grid input has max length of 4', async () => {
    const maxLength = await gridPage.getMyGridInput().getAttribute('maxlength');
    expect(maxLength).toBe('4');
  });

  test('footer status is visible', async () => {
    await expect(gridPage.getStatusLeft()).toBeVisible();
    await expect(gridPage.getStatusRight()).toBeVisible();
  });
});
