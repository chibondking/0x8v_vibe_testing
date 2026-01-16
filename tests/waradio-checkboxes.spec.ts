const { test, expect, chromium } = require('@playwright/test');
const { createWaradioPage } = require('../pages');

test.describe('WARADIO App - Checkbox Interactions', () => {
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

  test('toggle real time mode off', async () => {
    await expect(waradioPage.getRealTimeCheckbox()).toBeChecked();
    
    await waradioPage.getRealTimeCheckbox().click();
    
    await expect(waradioPage.getRealTimeCheckbox()).not.toBeChecked();
  });

  test('toggle slow plot mode on', async () => {
    await expect(waradioPage.getSlowPlotCheckbox()).not.toBeChecked();
    
    await waradioPage.getSlowPlotCheckbox().click();
    
    await expect(waradioPage.getSlowPlotCheckbox()).toBeChecked();
  });

  test('toggle gap detection on/off', async () => {
    await expect(waradioPage.getGapDetectionCheckbox()).toBeChecked();
    
    await waradioPage.getGapDetectionCheckbox().click();
    
    await expect(waradioPage.getGapDetectionCheckbox()).not.toBeChecked();
  });

  test('toggle derive location on/off', async () => {
    await expect(waradioPage.getDeriveLocationCheckbox()).toBeChecked();
    
    await waradioPage.getDeriveLocationCheckbox().click();
    
    await expect(waradioPage.getDeriveLocationCheckbox()).not.toBeChecked();
  });

  test('toggle brighter map on', async () => {
    await expect(waradioPage.getBrighterMapCheckbox()).not.toBeChecked();
    
    await waradioPage.getBrighterMapCheckbox().click();
    
    await expect(waradioPage.getBrighterMapCheckbox()).toBeChecked();
  });

  test('can change speed during playback', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(1000);
    
    await waradioPage.setSpeed('2');
    const speed = await waradioPage.getCurrentSpeed();
    expect(speed).toBe('2');
    
    await waradioPage.setSpeed('4');
    const speed4x = await waradioPage.getCurrentSpeed();
    expect(speed4x).toBe('4');
  });

  test('multiple pause/resume cycles work', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(1000);
    const plotted1 = await waradioPage.getPlottedContacts().textContent();
    
    await waradioPage.clickPause();
    await page.waitForTimeout(500);
    
    await waradioPage.clickPlay();
    await page.waitForTimeout(1000);
    const plotted2 = await waradioPage.getPlottedContacts().textContent();
    
    expect(parseInt(plotted2)).toBeGreaterThan(parseInt(plotted1));
  });

  test('slow plot mode affects plotting speed', async () => {
    await waradioPage.getSlowPlotCheckbox().click();
    
    const speed = await waradioPage.getCurrentSpeed();
    await waradioPage.setSpeed('4');
    
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(3000);
    const plottedWithSlow = await waradioPage.getPlottedContacts().textContent();
    
    await waradioPage.clickPause();
    await waradioPage.clickReset();
    
    await page.waitForTimeout(500);
    
    await waradioPage.getSlowPlotCheckbox().click();
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(3000);
    const plottedWithoutSlow = await waradioPage.getPlottedContacts().textContent();
    
    expect(parseInt(plotttedWithoutSlow)).toBeGreaterThan(parseInt(plottedWithSlow));
  });
});
