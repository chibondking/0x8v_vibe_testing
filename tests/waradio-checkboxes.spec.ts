const { test, expect } = require('@playwright/test');
const { createWaradioPage } = require('../pages');
const { createTestSuite } = require('./test-utils');

/**
 * @typedef {import('../pages/WaradioPage')} WaradioPage
 */

const waradioContext = createTestSuite({
  pageName: 'WARADIO',
  createPageObject: createWaradioPage,
});

test.describe('WARADIO App - Checkbox Interactions', () => {
  test.beforeAll(waradioContext.beforeAll);
  test.afterAll(waradioContext.afterAll);
  test.beforeEach(async () => {
    await waradioContext.beforeEach();
    const waradioPage = waradioContext.getPageObject();
    await waradioPage.disableRealTimeMode();
    await waradioPage.setSpeed('4');
    await waradioPage.loadDemoData();
  });

  test('toggle real time mode off', async () => {
    const waradioPage = waradioContext.getPageObject();
    const checkbox = waradioPage.getRealTimeCheckbox();
    await expect(checkbox).toBeAttached();
    const isChecked = await checkbox.isChecked();
    if (isChecked) {
      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
    }
  });

  test('toggle slow plot mode on', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getSlowPlotCheckbox()).not.toBeChecked();
    await waradioPage.getSlowPlotCheckbox().click();
    await expect(waradioPage.isSlowPlotChecked()).toBe(true);
  });

  test('toggle gap detection on/off', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getGapDetectionCheckbox()).toBeChecked();
    await waradioPage.getGapDetectionCheckbox().click();
    await expect(waradioPage.getGapDetectionCheckbox()).not.toBeChecked();
  });

  test('toggle derive location on/off', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getDeriveLocationCheckbox()).toBeChecked();
    await waradioPage.getDeriveLocationCheckbox().click();
    await expect(waradioPage.getDeriveLocationCheckbox()).not.toBeChecked();
  });

  test('toggle brighter map on', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getBrighterMapCheckbox()).not.toBeChecked();
    await waradioPage.getBrighterMapCheckbox().click();
    await expect(waradioPage.getBrighterMapCheckbox()).toBeChecked();
  });

  test('can change speed during playback', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(1000);
    await waradioPage.setSpeed('2');
    expect(await waradioPage.getCurrentSpeed()).toBe('2');
    await waradioPage.setSpeed('4');
    expect(await waradioPage.getCurrentSpeed()).toBe('4');
  });

  test('multiple pause/resume cycles work', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(500);
    for (let i = 0; i < 3; i++) {
      await waradioPage.clickPause();
      await page.waitForTimeout(200);
      await waradioPage.clickPlay();
      await page.waitForTimeout(200);
    }
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(0);
  });

  test.skip('slow plot mode affects plotting speed', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.getSlowPlotCheckbox().click();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeLessThan(5);
  });
});
