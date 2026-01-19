const { test, expect } = require('@playwright/test');
const { createWaradioPage } = require('../pages');
const { createTestSuite, closeBrowser } = require('./test-utils');
const {
  assertHeaderAndStatus,
  assertDataInputVisible,
  assertPlaybackControlsVisible,
  assertPlaybackButtonsDisabled,
  assertMapVisible,
  assertFooterStatusVisible,
  CONTACT_LABELS,
} = require('./assertions');

/**
 * @typedef {import('../pages/WaradioPage')} WaradioPage
 */

const waradioContext = createTestSuite({
  pageName: 'WARADIO',
  createPageObject: createWaradioPage,
});

test.describe('WARADIO App - Initial Load', () => {
  test.beforeAll(waradioContext.beforeAll);
  test.afterAll(waradioContext.afterAll);
  test.beforeEach(waradioContext.beforeEach);

  test('displays WARadio header and system status', async () => {
    const waradioPage = waradioContext.getPageObject();
    await assertHeaderAndStatus(waradioPage, 'WARadio Contact Visualizer');
  });

  test('displays data input section with all elements', async () => {
    const waradioPage = waradioContext.getPageObject();
    await assertDataInputVisible(waradioPage);
  });

  test('displays playback controls', async () => {
    const waradioPage = waradioContext.getPageObject();
    await assertPlaybackControlsVisible(waradioPage);
  });

  test('speed defaults to 1x', async () => {
    const waradioPage = waradioContext.getPageObject();
    const currentSpeed = await waradioPage.getCurrentSpeed();
    expect(currentSpeed).toBe('1');
    await expect(waradioPage.getSpeedButton('1')).toHaveClass(/active/);
  });

  test('checkboxes have correct default states', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getRealTimeCheckbox()).toBeChecked();
    await expect(waradioPage.getGapDetectionCheckbox()).toBeChecked();
    await expect(waradioPage.getDeriveLocationCheckbox()).toBeChecked();
    await expect(waradioPage.getSlowPlotCheckbox()).not.toBeChecked();
    await expect(waradioPage.getBrighterMapCheckbox()).not.toBeChecked();
  });

  test('playback buttons are disabled initially', async () => {
    const waradioPage = waradioContext.getPageObject();
    await assertPlaybackButtonsDisabled(waradioPage);
  });

  test('displays statistics section', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getTotalContacts()).toHaveText('0');
    await expect(waradioPage.getPlottedContacts()).toHaveText('0');
    await expect(waradioPage.getRemainingContacts()).toHaveText('0');
    await expect(waradioPage.getTimeElapsed()).toHaveText('00:00:00');
  });

  test('displays current contact section', async () => {
    const waradioPage = waradioContext.getPageObject();
    const contactFields = [
      waradioPage.getContactCallsign(),
      waradioPage.getContactLocation(),
      waradioPage.getContactMode(),
      waradioPage.getContactBand(),
      waradioPage.getContactDistance(),
      waradioPage.getContactGrid(),
    ];
    for (const field of contactFields) {
      await expect(field).toHaveText('--');
    }
  });

  test('displays map with band legend', async () => {
    const waradioPage = waradioContext.getPageObject();
    await assertMapVisible(waradioPage);
    await expect(waradioPage.getBandLegend()).toBeVisible();
  });

  test('band legend contains all amateur radio bands', async () => {
    const waradioPage = waradioContext.getPageObject();
    const legendItems = await waradioPage.getBandLegend().locator('.legend-item').count();
    expect(legendItems).toBeGreaterThanOrEqual(14);
  });
});
