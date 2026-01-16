const { test, expect, chromium } = require('@playwright/test');
const { createWaradioPage } = require('../pages');

test.describe('WARADIO App - Initial Load', () => {
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
  });

  test('displays WARadio header and system status', async () => {
    await expect(waradioPage.getHeaderTitle()).toHaveText('WARadio Contact Visualizer');
    await expect(waradioPage.getSystemStatus()).toBeVisible();
  });

  test('displays data input section with all elements', async () => {
    await expect(waradioPage.getLoadDemoDataButton()).toBeVisible();
    await expect(waradioPage.getMyGridInput()).toBeVisible();
  });

  test('displays playback controls', async () => {
    await expect(waradioPage.getPlayButton()).toBeVisible();
    await expect(waradioPage.getPauseButton()).toBeVisible();
    await expect(waradioPage.getResetButton()).toBeVisible();
  });

  test('speed defaults to 1x', async () => {
    const currentSpeed = await waradioPage.getCurrentSpeed();
    expect(currentSpeed).toBe('1');
    await expect(waradioPage.getSpeedButton('1')).toHaveClass(/active/);
  });

  test('checkboxes have correct default states', async () => {
    await expect(waradioPage.getRealTimeCheckbox()).toBeChecked();
    await expect(waradioPage.getGapDetectionCheckbox()).toBeChecked();
    await expect(waradioPage.getDeriveLocationCheckbox()).toBeChecked();
    await expect(waradioPage.getSlowPlotCheckbox()).not.toBeChecked();
    await expect(waradioPage.getBrighterMapCheckbox()).not.toBeChecked();
  });

  test('playback buttons are disabled initially', async () => {
    await expect(waradioPage.getPlayButton()).toBeDisabled();
    await expect(waradioPage.getPauseButton()).toBeDisabled();
    await expect(waradioPage.getResetButton()).toBeDisabled();
  });

  test('displays statistics section', async () => {
    await expect(waradioPage.getTotalContacts()).toHaveText('0');
    await expect(waradioPage.getPlottedContacts()).toHaveText('0');
    await expect(waradioPage.getRemainingContacts()).toHaveText('0');
    await expect(waradioPage.getTimeElapsed()).toHaveText('00:00:00');
  });

  test('displays current contact section', async () => {
    await expect(waradioPage.getContactCallsign()).toHaveText('--');
    await expect(waradioPage.getContactLocation()).toHaveText('--');
    await expect(waradioPage.getContactMode()).toHaveText('--');
    await expect(waradioPage.getContactBand()).toHaveText('--');
    await expect(waradioPage.getContactDistance()).toHaveText('--');
    await expect(waradioPage.getContactGrid()).toHaveText('--');
  });

  test('displays map with band legend', async () => {
    await expect(waradioPage.getMap()).toBeVisible();
    await expect(waradioPage.getBandLegend()).toBeVisible();
  });

  test('band legend contains all amateur radio bands', async () => {
    const legendItems = await waradioPage.getBandLegend().locator('.legend-item').count();
    expect(legendItems).toBeGreaterThanOrEqual(14);
  });
});
