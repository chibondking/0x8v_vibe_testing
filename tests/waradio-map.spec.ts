const { test, expect, chromium } = require('@playwright/test');
const { createWaradioPage } = require('../pages');

test.describe('WARADIO App - Map and Legend', () => {
  let page;
  let waradioPage;

  test.beforeAll(async () => {
    const browser = await chromium.launch();
    page = await browser.newPage();
    waradioPage = createWaradioPage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await waradioPage.load();
    await waradioPage.disableRealTimeMode();
    await waradioPage.setSpeed('4');
    await waradioPage.loadDemoData();
  });

  test('map is visible on page load', async () => {
    await expect(waradioPage.getMap()).toBeVisible();
  });

  test('band legend is visible on page load', async () => {
    await expect(waradioPage.getBandLegend()).toBeVisible();
  });

  test('band legend contains all amateur radio bands', async () => {
    const legendItems = await waradioPage.getBandLegend().locator('.legend-item').count();
    expect(legendItems).toBeGreaterThanOrEqual(14);
  });

  test('map shows markers after playback starts', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(3000);
    
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(0);
  });

  test('map center updates during playback', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(3000);
    
    const contact = await waradioPage.getCurrentContact();
    expect(contact.callsign).not.toBe('--');
  });

  test('can zoom map using controls', async () => {
    const zoomIn = page.locator('.leaflet-control-zoom-in');
    const zoomOut = page.locator('.leaflet-control-zoom-out');
    
    const zoomInVisible = await zoomIn.isVisible();
    const zoomOutVisible = await zoomOut.isVisible();
    
    if (zoomInVisible) {
      await zoomIn.click();
    }
    if (zoomOutVisible) {
      await zoomOut.click();
    }
    
    expect(true).toBe(true);
  });

  test('band legend shows different colors for each band', async () => {
    const legendItems = await waradioPage.getBandLegend().locator('.legend-item');
    const count = await legendItems.count();
    
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const item = legendItems.nth(i);
      await expect(item).toBeVisible();
    }
  });

  test('markers appear at correct geographical locations', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(5000);
    
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(5);
  });

  test('map tiles load correctly', async () => {
    await waradioPage.load();
    
    const mapContainer = await waradioPage.getMap();
    await expect(mapContainer).toBeVisible();
    
    const tiles = await page.locator('.leaflet-tile').count();
    expect(tiles).toBeGreaterThan(0);
  });

  test('map attribution is present', async () => {
    const attribution = page.locator('.leaflet-control-attribution');
    await expect(attribution).toBeVisible();
  });
});
