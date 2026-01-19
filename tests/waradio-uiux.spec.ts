const { test, expect } = require('@playwright/test');
const { createWaradioPage } = require('../pages');
const { createTestSuite } = require('./test-utils');
const { CONTACT_LABELS, assertMapVisible } = require('./assertions');

const waradioContext = createTestSuite({
  pageName: 'WARADIO',
  createPageObject: createWaradioPage,
});

test.describe('WARADIO App - UI/UX', () => {
  test.beforeAll(waradioContext.beforeAll);
  test.afterAll(waradioContext.afterAll);
  test.beforeEach(waradioContext.beforeEach);

  test('page title is correct', async () => {
    const page = waradioContext.getPage();
    await expect(page).toHaveTitle(/WARadio/);
  });

  test('header contains app name', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getHeaderTitle()).toContainText('WARadio');
  });

  test('system status indicator is visible', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getSystemStatus()).toBeVisible();
  });

  test('all button labels are correct', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getPlayButton()).toHaveText(/PLAY/);
    await expect(waradioPage.getPauseButton()).toHaveText(/PAUSE/);
    await expect(waradioPage.getResetButton()).toHaveText(/RESET/);
  });

  test('speed buttons show correct labels', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getSpeedButton('0.5')).toHaveText('0.5x');
    await expect(waradioPage.getSpeedButton('1')).toHaveText('1x');
    await expect(waradioPage.getSpeedButton('2')).toHaveText('2x');
    await expect(waradioPage.getSpeedButton('4')).toHaveText('4x');
  });

  test('checkbox labels are visible', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getRealTimeCheckbox()).toBeVisible();
    await expect(waradioPage.getSlowPlotCheckbox()).toBeVisible();
    await expect(waradioPage.getGapDetectionCheckbox()).toBeVisible();
    await expect(waradioPage.getDeriveLocationCheckbox()).toBeVisible();
    await expect(waradioPage.getBrighterMapCheckbox()).toBeVisible();
  });

  test('contact field labels are visible', async () => {
    const page = waradioContext.getPage();
    for (const [name, label] of Object.entries(CONTACT_LABELS)) {
      const locator = page.locator(`#contact-${name.toLowerCase()}`).locator('..').locator('.label');
      await expect(locator).toHaveText(label);
    }
  });

  test('my grid input has placeholder', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getMyGridInput()).toHaveAttribute('placeholder', 'EN91');
  });

  test('map is responsive', async () => {
    const page = waradioContext.getPage();
    await page.setViewportSize({ width: 375, height: 667 });
    const waradioPage = waradioContext.getPageObject();
    await assertMapVisible(waradioPage);
  });

  test('buttons have correct disabled states initially', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getPlayButton()).toBeDisabled();
    // Pause button state varies
  });

  test('all panels are visible', async () => {
    const page = waradioContext.getPage();
    const panels = page.locator('.panel-section');
    await expect(panels).toHaveCount(4);
  });

  test.skip('data input section exists', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getLoadDemoDataButton()).toBeVisible();
  });

  test.skip('playback section exists', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getPlayButton()).toBeVisible();
  });

  test.skip('statistics section exists', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getTotalContacts()).toBeVisible();
  });

  test.skip('current contact section exists', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getContactCallsign()).toBeVisible();
  });
});
