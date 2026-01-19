const { test, expect } = require('@playwright/test');
const { createGridPage } = require('../pages');
const { createTestSuite } = require('./test-utils');
const {
  assertHeaderAndStatus,
  assertDataInputVisible,
  assertFooterStatusVisible,
  assertMapVisible,
} = require('./assertions');

/**
 * @typedef {import('../pages/GridPage')} GridPage
 */

const gridContext = createTestSuite({
  pageName: 'GRID',
  createPageObject: createGridPage,
});

test.describe('GRID App - Initial Load', () => {
  test.beforeAll(gridContext.beforeAll);
  test.afterAll(gridContext.afterAll);
  test.beforeEach(gridContext.beforeEach);

  test('displays GRID header and system status', async () => {
    const gridPage = gridContext.getPageObject();
    await assertHeaderAndStatus(gridPage, 'GRID SQUARE VISUALIZER');
  });

  test('WOPR lights container is present', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getWoprLights()).toBeAttached();
  });

  test('displays timestamp display', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getTimestampDisplay()).toBeVisible();
  });

  test('displays data input section with all elements', async () => {
    const gridPage = gridContext.getPageObject();
    await assertDataInputVisible(gridPage);
  });

  test('displays display options section', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getColorByBandCheckbox()).toBeVisible();
    await expect(gridPage.getBrightMapCheckbox()).toBeVisible();
    await expect(gridPage.getShowFieldsCheckbox()).toBeVisible();
    await expect(gridPage.getShowFieldLabelsCheckbox()).toBeVisible();
  });

  test('checkboxes have correct default states', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getColorByBandCheckbox()).not.toBeChecked();
    await expect(gridPage.getBrightMapCheckbox()).not.toBeChecked();
    await expect(gridPage.getShowFieldsCheckbox()).toBeChecked();
    await expect(gridPage.getShowFieldLabelsCheckbox()).toBeChecked();
  });

  test('displays statistics section', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getTotalContacts()).toHaveText('0');
    await expect(gridPage.getUniqueGrids()).toHaveText('0');
    await expect(gridPage.getCountries()).toHaveText('0');
  });

  test('buttons are disabled initially', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getScreenshotButton()).toBeDisabled();
    await expect(gridPage.getViewStatsButton()).toBeDisabled();
  });

  test('displays map container', async () => {
    const gridPage = gridContext.getPageObject();
    await assertMapVisible(gridPage);
  });

  test('map container has correct attributes', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getMap()).toHaveAttribute('id', 'map');
  });

  test('my grid input has correct default value', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getMyGridInput()).toHaveValue('EN91');
  });

  test('my grid input has max length of 4', async () => {
    const gridPage = gridContext.getPageObject();
    const maxLength = await gridPage.getMyGridInput().getAttribute('maxlength');
    expect(maxLength).toBe('4');
  });

  test('footer status is visible', async () => {
    const gridPage = gridContext.getPageObject();
    await assertFooterStatusVisible(gridPage);
  });
});
