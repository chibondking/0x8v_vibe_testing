const { test, expect, chromium } = require('@playwright/test');
const { createLivePage } = require('../pages');

/**
 * @typedef {import('../pages/LivePage')} LivePage
 */

test.describe('LIVE App - Initial Load', () => {
  /** @type {import('@playwright/test').Page} */
  let page;
  /** @type {ReturnType<typeof createLivePage>} */
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

  test.skip('page loads without JavaScript errors', async () => {
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

test.describe('LIVE App - My Call Fuzz Tests', () => {
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
    await livePage.getMyCallInput().clear();
  });

  test('accepts basic US callsigns', async () => {
    const callsigns = ['WT2P', 'WB9ZZZ', 'K1ABC', 'N3XYZ', 'AA9SS'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      const value = await livePage.getMyCallInput().inputValue();
      expect(value).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts callsigns with numbers', async () => {
    const callsigns = ['P40XA', '3Z9X', '9Y4L', '4U1ITU'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      const value = await livePage.getMyCallInput().inputValue();
      expect(value).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts callsigns with single slash prefix', async () => {
    const callsigns = ['P4/WT2P', 'G4DIY/P', 'W1ABC/MM'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      const value = await livePage.getMyCallInput().inputValue();
      expect(value).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts callsigns with dashes for SSID', async () => {
    const callsigns = ['WT2P-9', 'W1ABC-4', 'K1XYZ-1', 'DL5YBR-7', 'LA3YY-15'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      const value = await livePage.getMyCallInput().inputValue();
      expect(value).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts European callsigns', async () => {
    const callsigns = ['DL1ABS', 'G4DIY', 'M0XYZ', 'PA1TT', 'OH2ZZ', 'LA3YY', 'SM5AZQ'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      const value = await livePage.getMyCallInput().inputValue();
      expect(value).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts callsigns with special prefixes', async () => {
    const callsigns = ['4U1ITU', '4U1WXC', 'ZL9DX', 'VK0IR', 'FT5YJ', 'LU8XW'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      const value = await livePage.getMyCallInput().inputValue();
      expect(value).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts short callsigns', async () => {
    const callsigns = ['WT2P', 'WB9', 'K1X', 'N4Z', 'P40'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      const value = await livePage.getMyCallInput().inputValue();
      expect(value).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts callsigns with slash and SSID', async () => {
    const callsigns = ['WT2P-9', 'P4/WT2P-7'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      const value = await livePage.getMyCallInput().inputValue();
      expect(value).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('clearing my call input works correctly', async () => {
    await livePage.setMyCall('WT2P');
    let value = await livePage.getMyCallInput().inputValue();
    expect(value).toBe('WT2P');

    await livePage.getMyCallInput().clear();
    value = await livePage.getMyCallInput().inputValue();
    expect(value).toBe('');
  });

  test('overwrites existing callsign when setting new one', async () => {
    await livePage.setMyCall('WT2P');
    expect(await livePage.getMyCallInput().inputValue()).toBe('WT2P');

    await livePage.setMyCall('WB9ZZZ');
    expect(await livePage.getMyCallInput().inputValue()).toBe('WB9ZZZ');

    await livePage.setMyCall('P40XA');
    expect(await livePage.getMyCallInput().inputValue()).toBe('P40XA');
  });
});

test.describe('LIVE App - Live Feed Tests', () => {
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

  test('connect button is enabled and clickable', async () => {
    const button = livePage.getConnectLiveButton();
    await expect(button).toBeEnabled();
  });

  test('clicking connect does not cause errors', async () => {
    await livePage.clickConnectLive();
  });

  test('map container is visible during live feed', async () => {
    await livePage.clickConnectLive();
    await expect(livePage.getMap()).toBeVisible();
  });

  test('feed controls remain visible during live feed', async () => {
    await livePage.clickConnectLive();
    await expect(livePage.getMyCallInput()).toBeVisible();
    await expect(livePage.getConnectLiveButton()).toBeVisible();
  });

  test('mode filter buttons remain visible during live feed', async () => {
    await livePage.clickConnectLive();
    const modeButtons = livePage.getModeButtons();
    await expect(modeButtons.first()).toBeVisible();
  });

  test('band filter buttons remain visible during live feed', async () => {
    await livePage.clickConnectLive();
    const bandButtons = livePage.getBandButtons();
    await expect(bandButtons.first()).toBeVisible();
  });

  test('multiple connect/disconnect cycles do not cause errors', async () => {
    await livePage.clickConnectLive();
    await livePage.clickConnectLive();
    await livePage.clickConnectLive();
    await livePage.clickConnectLive();
  });

  test('live feed toggle preserves page functionality', async () => {
    await livePage.clickConnectLive();
    await expect(livePage.getHeaderTitle()).toHaveText('LIVE HAMRADIO MAP');
    await expect(livePage.getSystemStatus()).toBeVisible();
  });
});
