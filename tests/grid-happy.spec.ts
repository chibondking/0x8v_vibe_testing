const { test, expect, chromium } = require('@playwright/test');
const { createGridPage } = require('../pages');

test.describe('GRID App - Happy Path', () => {
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
    await gridPage.loadDemoData();
  });

  test('enables buttons after loading demo data', async () => {
    await expect(gridPage.getScreenshotButton()).toBeEnabled();
    await expect(gridPage.getViewStatsButton()).toBeEnabled();
  });

  test('loads demo data and updates statistics', async () => {
    const stats = await gridPage.getStatistics();
    expect(parseInt(stats.total)).toBeGreaterThan(0);
    expect(parseInt(stats.grids)).toBeGreaterThan(0);
    expect(parseInt(stats.countries)).toBeGreaterThan(0);
  });

  test('grids are displayed on map', async () => {
    const gridCount = await gridPage.getVisibleGrids();
    expect(gridCount).toBeGreaterThan(0);
  });

  test('can toggle color by band', async () => {
    await expect(gridPage.getColorByBandCheckbox()).not.toBeChecked();
    
    await gridPage.toggleColorByBand();
    
    await expect(gridPage.getColorByBandCheckbox()).toBeChecked();
  });

  test('can toggle bright map', async () => {
    await expect(gridPage.getBrightMapCheckbox()).not.toBeChecked();
    
    await gridPage.toggleBrightMap();
    
    await expect(gridPage.getBrightMapCheckbox()).toBeChecked();
  });

  test('can toggle show fields', async () => {
    await expect(gridPage.getShowFieldsCheckbox()).toBeChecked();
    
    await gridPage.toggleShowFields();
    
    await expect(gridPage.getShowFieldsCheckbox()).not.toBeChecked();
  });

  test('clicking view stats opens popup', async () => {
    await gridPage.clickViewStats();
    
    const statsPopup = gridPage.getStatsPopup();
    await expect(statsPopup).toBeVisible();
  });

  test('stats popup contains data', async () => {
    await gridPage.clickViewStats();
    
    const popupText = await gridPage.getStatsPopup().textContent();
    expect(popupText).toContain('LOG STATISTICS');
    expect(popupText).toContain('Total Contacts');
    expect(popupText).toContain('Unique Grids');
    expect(popupText).toContain('Countries');
  });

  test('can close stats popup', async () => {
    await gridPage.clickViewStats();
    await gridPage.closeStatsPopup();
    
    const statsPopup = gridPage.getStatsPopup();
    await expect(statsPopup).not.toBeVisible();
  });

  test('screenshot button is clickable', async () => {
    await expect(gridPage.getScreenshotButton()).toBeEnabled();
  });

  test.skip('map has correct bounds after loading', async () => {
    const bounds = await gridPage.getMapBounds();
    expect(bounds).not.toBeNull();
    expect(bounds.north).toBeGreaterThan(bounds.south);
    expect(bounds.east).toBeGreaterThan(bounds.west);
  });
});
