const { test, expect } = require('@playwright/test');
const { createGridPage } = require('../pages');
const { createTestSuite } = require('./test-utils');

/**
 * @typedef {import('../pages/GridPage')} GridPage
 */

const gridContext = createTestSuite({
  pageName: 'GRID',
  createPageObject: createGridPage,
});

test.describe('GRID App - Happy Path', () => {
  test.beforeAll(gridContext.beforeAll);
  test.afterAll(gridContext.afterAll);
  test.beforeEach(async () => {
    await gridContext.beforeEach();
    const gridPage = gridContext.getPageObject();
    await gridPage.loadDemoData();
  });

  test('enables buttons after loading demo data', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getScreenshotButton()).toBeEnabled();
    await expect(gridPage.getViewStatsButton()).toBeEnabled();
  });

  test('loads demo data and updates statistics', async () => {
    const gridPage = gridContext.getPageObject();
    const stats = await gridPage.getStatistics();
    expect(parseInt(stats.total)).toBeGreaterThan(0);
    expect(parseInt(stats.grids)).toBeGreaterThan(0);
    expect(parseInt(stats.countries)).toBeGreaterThan(0);
  });

  test('grids are displayed on map', async () => {
    const gridPage = gridContext.getPageObject();
    const gridCount = await gridPage.getVisibleGrids();
    expect(gridCount).toBeGreaterThan(0);
  });

  test('can toggle color by band', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getColorByBandCheckbox()).not.toBeChecked();
    await gridPage.toggleColorByBand();
    await expect(gridPage.getColorByBandCheckbox()).toBeChecked();
  });

  test('can toggle bright map', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getBrightMapCheckbox()).not.toBeChecked();
    await gridPage.toggleBrightMap();
    await expect(gridPage.getBrightMapCheckbox()).toBeChecked();
  });

  test('can toggle show fields', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getShowFieldsCheckbox()).toBeChecked();
    await gridPage.toggleShowFields();
    await expect(gridPage.getShowFieldsCheckbox()).not.toBeChecked();
  });

  test('clicking view stats opens popup', async () => {
    const gridPage = gridContext.getPageObject();
    await gridPage.clickViewStats();
    await expect(gridPage.getStatsPopup()).toBeVisible();
  });

  test('stats popup contains data', async () => {
    const gridPage = gridContext.getPageObject();
    await gridPage.clickViewStats();
    const popupText = await gridPage.getStatsPopup().textContent();
    expect(popupText).toContain('LOG STATISTICS');
    expect(popupText).toContain('Total Contacts');
    expect(popupText).toContain('Unique Grids');
    expect(popupText).toContain('Countries');
  });

  test('can close stats popup', async () => {
    const gridPage = gridContext.getPageObject();
    await gridPage.clickViewStats();
    await gridPage.closeStatsPopup();
    await expect(gridPage.getStatsPopup()).not.toBeVisible();
  });

  test('screenshot button is clickable', async () => {
    const gridPage = gridContext.getPageObject();
    await expect(gridPage.getScreenshotButton()).toBeEnabled();
  });

  test.skip('map has correct bounds after loading', async () => {
    const gridPage = gridContext.getPageObject();
    const bounds = await gridPage.getMapBounds();
    expect(bounds).not.toBeNull();
    expect(bounds.north).toBeGreaterThan(bounds.south);
    expect(bounds.east).toBeGreaterThan(bounds.west);
  });
});
