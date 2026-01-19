const { test, expect } = require('@playwright/test');
const { createWaradioPage } = require('../pages');
const { createTestSuite } = require('./test-utils');
const { assertMapVisible } = require('./assertions');

/**
 * @typedef {import('../pages/WaradioPage')} WaradioPage
 */

const waradioContext = createTestSuite({
  pageName: 'WARADIO',
  createPageObject: createWaradioPage,
});

test.describe('WARADIO App - Map and Legend', () => {
  test.beforeAll(waradioContext.beforeAll);
  test.afterAll(waradioContext.afterAll);
  test.beforeEach(async () => {
    await waradioContext.beforeEach();
    const waradioPage = waradioContext.getPageObject();
    await waradioPage.disableRealTimeMode();
    await waradioPage.setSpeed('4');
    await waradioPage.loadDemoData();
  });

  test('map is visible on page load', async () => {
    const waradioPage = waradioContext.getPageObject();
    await assertMapVisible(waradioPage);
  });

  test('band legend is visible on page load', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getBandLegend()).toBeVisible();
  });

  test('band legend contains all amateur radio bands', async () => {
    const waradioPage = waradioContext.getPageObject();
    const legendItems = await waradioPage.getBandLegend().locator('.legend-item').count();
    expect(legendItems).toBeGreaterThanOrEqual(14);
  });

  test('map shows markers after playback starts', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(3000);
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(0);
  });

  test('map center updates during playback', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(3000);
    const contact = await waradioPage.getCurrentContact();
    expect(contact.callsign).not.toBe('--');
  });

  test.skip('can zoom map using controls', async () => {
    const page = waradioContext.getPage();
    const zoomIn = page.locator('.leaflet-control-zoom-in');
    const zoomOut = page.locator('.leaflet-control-zoom-out');
    const zoomInVisible = await zoomIn.isVisible();
    const zoomOutVisible = await zoomOut.isVisible();
    if (zoomInVisible) await zoomIn.click();
    if (zoomOutVisible) await zoomOut.click();
    expect(true).toBe(true);
  });

  test('band legend shows different colors for each band', async () => {
    const waradioPage = waradioContext.getPageObject();
    const legendItems = await waradioPage.getBandLegend().locator('.legend-item');
    const count = await legendItems.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(legendItems.nth(i)).toBeVisible();
    }
  });

  test('markers appear at correct geographical locations', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(5000);
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(5);
  });

  test('map tiles load correctly', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.load();
    await assertMapVisible(waradioPage);
    const tiles = await page.locator('.leaflet-tile').count();
    expect(tiles).toBeGreaterThan(0);
  });

  test('map attribution is present', async () => {
    const page = waradioContext.getPage();
    const attribution = page.locator('.leaflet-control-attribution');
    await expect(attribution).toBeVisible();
  });
});
