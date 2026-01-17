const { test, expect, chromium } = require('@playwright/test');
const { createLivePage } = require('../pages');

test.describe('LIVE App - Initial Load', () => {
  let page;
  let livePage;

  test.beforeAll(async () => {
    const browser = await chromium.launch();
    page = await browser.newPage();
    livePage = createLivePage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await livePage.load();
  });

  test('displays LIVE header and system status', async () => {
    await expect(livePage.getHeaderTitle()).toHaveText('LIVE HAMRADIO MAP');
    await expect(livePage.getSystemStatus()).toBeVisible();
    await expect(livePage.getSystemStatus()).toHaveText('SYSTEM READY');
  });

  test('displays timestamp', async () => {
    await expect(livePage.getTimestampDisplay()).toBeVisible();
  });

  test('displays map container', async () => {
    await expect(livePage.getMap()).toBeVisible();
  });

  test('displays mode filter buttons', async () => {
    const modeButtons = livePage.getModeButtons();
    await expect(modeButtons.first()).toBeVisible();
  });

  test('displays band filter buttons', async () => {
    const bandButtons = livePage.getBandButtons();
    await expect(bandButtons.first()).toBeVisible();
  });

  test('displays display options section', async () => {
    await expect(livePage.getColorByBandCheckbox()).toBeVisible();
    await expect(livePage.getBrightMapCheckbox()).toBeVisible();
    await expect(livePage.getDrawLinesCheckbox()).toBeVisible();
  });

  test('displays live feed section', async () => {
    await expect(livePage.getConnectLiveButton()).toBeVisible();
  });

  test('displays my call section', async () => {
    await expect(livePage.getMyCallInput()).toBeVisible();
    await expect(livePage.getHeardMeButton()).toBeVisible();
  });

  test('displays zoom controls', async () => {
    await expect(livePage.getZoomInButton()).toBeVisible();
    await expect(livePage.getZoomOutButton()).toBeVisible();
  });

  test('page title is correct', async () => {
    await expect(page).toHaveTitle(/Live Map/i);
  });
});

test.describe('LIVE App - Functionality', () => {
  let page;
  let livePage;

  test.beforeAll(async () => {
    const browser = await chromium.launch();
    page = await browser.newPage();
    livePage = createLivePage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await livePage.load();
  });

  test('connect live button is clickable', async () => {
    await expect(livePage.getConnectLiveButton()).toBeEnabled();
  });

  test('my call input accepts text', async () => {
    await livePage.setMyCall('W1AW');
    const value = await livePage.getMyCallInput().inputValue();
    expect(value).toBe('W1AW');
  });

  test('mode filter has FT8 option', async () => {
    const ft8Button = page.locator('button:has-text("FT8")');
    await expect(ft8Button).toBeVisible();
  });

  test('band filter has 20m option', async () => {
    const band20Button = page.locator('button:has-text("20m")');
    await expect(band20Button.first()).toBeVisible();
  });

  test('heard me button is disabled initially', async () => {
    await expect(livePage.getHeardMeButton()).toBeDisabled();
  });
});

test.describe('LIVE App - UI/UX', () => {
  let page;
  let livePage;

  test.beforeAll(async () => {
    const browser = await chromium.launch();
    page = await browser.newPage();
    livePage = createLivePage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await livePage.load();
  });

  test('page loads without JavaScript errors', async () => {
    const errors = livePage.getPageErrors();
    expect(errors).toHaveLength(0);
  });

  test('footer status is visible', async () => {
    await expect(livePage.getStatusLeft()).toBeVisible();
    await expect(livePage.getStatusRight()).toBeVisible();
  });

  test('map is visible on mobile viewport', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    await livePage.load();
    await expect(livePage.getMap()).toBeVisible();
  });

  test('display options have correct default states', async () => {
    await expect(livePage.getColorByBandCheckbox()).toBeChecked();
    await expect(livePage.getDrawLinesCheckbox()).toBeChecked();
    await expect(livePage.getBrightMapCheckbox()).not.toBeChecked();
  });
});
