const { test, expect } = require('@playwright/test');
const { createLivePage } = require('../pages');
const { createTestSuite, closeBrowser } = require('./test-utils');

/**
 * @typedef {import('../pages/LivePage')} LivePage
 */

const liveContext = createTestSuite({
  pageName: 'Live',
  createPageObject: createLivePage,
});

test.describe('LIVE App - Initial Load', () => {
  test.beforeAll(liveContext.beforeAll);
  test.afterAll(liveContext.afterAll);
  test.beforeEach(liveContext.beforeEach);

  test('displays LIVE header and system status', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getHeaderTitle()).toHaveText('LIVE HAMRADIO MAP');
    await expect(livePage.getSystemStatus()).toBeVisible();
    await expect(livePage.getSystemStatus()).toHaveText('SYSTEM READY');
  });

  test('displays timestamp', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getTimestampDisplay()).toBeVisible();
  });

  test('displays map container', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getMap()).toBeVisible();
  });

  test('displays mode filter buttons', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getModeButtons().first()).toBeVisible();
  });

  test('displays band filter buttons', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getBandButtons().first()).toBeVisible();
  });

  test('displays display options section', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getColorByBandCheckbox()).toBeVisible();
    await expect(livePage.getBrightMapCheckbox()).toBeVisible();
    await expect(livePage.getDrawLinesCheckbox()).toBeVisible();
  });

  test('displays live feed section', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getConnectLiveButton()).toBeVisible();
  });

  test('displays my call section', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getMyCallInput()).toBeVisible();
    await expect(livePage.getHeardMeButton()).toBeVisible();
  });

  test('displays zoom controls', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getZoomInButton()).toBeVisible();
    await expect(livePage.getZoomOutButton()).toBeVisible();
  });

  test('page title is correct', async () => {
    const page = liveContext.getPage();
    await expect(page).toHaveTitle(/Live Map/i);
  });
});

test.describe('LIVE App - Functionality', () => {
  test.beforeAll(liveContext.beforeAll);
  test.afterAll(liveContext.afterAll);
  test.beforeEach(liveContext.beforeEach);

  test('connect live button is clickable', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getConnectLiveButton()).toBeEnabled();
  });

  test('my call input accepts text', async () => {
    const livePage = liveContext.getPageObject();
    await livePage.setMyCall('W1AW');
    const value = await livePage.getMyCallInput().inputValue();
    expect(value).toBe('W1AW');
  });

  test('mode filter has FT8 option', async () => {
    const page = liveContext.getPage();
    await expect(page.locator('button:has-text("FT8")')).toBeVisible();
  });

  test('band filter has 20m option', async () => {
    const page = liveContext.getPage();
    await expect(page.locator('button:has-text("20m")').first()).toBeVisible();
  });

  test('heard me button is disabled initially', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getHeardMeButton()).toBeDisabled();
  });
});

test.describe('LIVE App - UI/UX', () => {
  test.beforeAll(liveContext.beforeAll);
  test.afterAll(liveContext.afterAll);
  test.beforeEach(liveContext.beforeEach);

  test.skip('page loads without JavaScript errors', async () => {
    const livePage = liveContext.getPageObject();
    const errors = livePage.getPageErrors();
    expect(errors).toHaveLength(0);
  });

  test('footer status is visible', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getStatusLeft()).toBeVisible();
    await expect(livePage.getStatusRight()).toBeVisible();
  });

  test.skip('map is visible on mobile viewport', async () => {
    const page = liveContext.getPage();
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://live.0x8v.io/');
    const livePage = liveContext.getPageObject();
    await expect(livePage.getMap()).toBeVisible();
  });

  test('display options have correct default states', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getColorByBandCheckbox()).toBeChecked();
    await expect(livePage.getDrawLinesCheckbox()).toBeChecked();
    await expect(livePage.getBrightMapCheckbox()).not.toBeChecked();
  });
});

test.describe('LIVE App - My Call Fuzz Tests', () => {
  test.beforeAll(liveContext.beforeAll);
  test.afterAll(liveContext.afterAll);
  test.beforeEach(async () => {
    await liveContext.beforeEach();
    const livePage = liveContext.getPageObject();
    await livePage.getMyCallInput().clear();
  });

  test('accepts basic US callsigns', async () => {
    const livePage = liveContext.getPageObject();
    const callsigns = ['WT2P', 'WB9ZZZ', 'K1ABC', 'N3XYZ', 'AA9SS'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      expect(await livePage.getMyCallInput().inputValue()).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts callsigns with numbers', async () => {
    const livePage = liveContext.getPageObject();
    const callsigns = ['P40XA', '3Z9X', '9Y4L', '4U1ITU'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      expect(await livePage.getMyCallInput().inputValue()).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts callsigns with single slash prefix', async () => {
    const livePage = liveContext.getPageObject();
    const callsigns = ['P4/WT2P', 'G4DIY/P', 'W1ABC/MM'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      expect(await livePage.getMyCallInput().inputValue()).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts callsigns with dashes for SSID', async () => {
    const livePage = liveContext.getPageObject();
    const callsigns = ['WT2P-9', 'W1ABC-4', 'K1XYZ-1', 'DL5YBR-7', 'LA3YY-15'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      expect(await livePage.getMyCallInput().inputValue()).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts European callsigns', async () => {
    const livePage = liveContext.getPageObject();
    const callsigns = ['DL1ABS', 'G4DIY', 'M0XYZ', 'PA1TT', 'OH2ZZ', 'LA3YY', 'SM5AZQ'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      expect(await livePage.getMyCallInput().inputValue()).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts callsigns with special prefixes', async () => {
    const livePage = liveContext.getPageObject();
    const callsigns = ['4U1ITU', '4U1WXC', 'ZL9DX', 'VK0IR', 'FT5YJ', 'LU8XW'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      expect(await livePage.getMyCallInput().inputValue()).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts short callsigns', async () => {
    const livePage = liveContext.getPageObject();
    const callsigns = ['WT2P', 'WB9', 'K1X', 'N4Z', 'P40'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      expect(await livePage.getMyCallInput().inputValue()).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('accepts callsigns with slash and SSID', async () => {
    const livePage = liveContext.getPageObject();
    const callsigns = ['WT2P-9', 'P4/WT2P-7'];
    for (const callsign of callsigns) {
      await livePage.setMyCall(callsign);
      expect(await livePage.getMyCallInput().inputValue()).toBe(callsign);
      await livePage.getMyCallInput().clear();
    }
  });

  test('clearing my call input works correctly', async () => {
    const livePage = liveContext.getPageObject();
    await livePage.setMyCall('WT2P');
    expect(await livePage.getMyCallInput().inputValue()).toBe('WT2P');
    await livePage.getMyCallInput().clear();
    expect(await livePage.getMyCallInput().inputValue()).toBe('');
  });

  test('overwrites existing callsign when setting new one', async () => {
    const livePage = liveContext.getPageObject();
    await livePage.setMyCall('WT2P');
    expect(await livePage.getMyCallInput().inputValue()).toBe('WT2P');
    await livePage.setMyCall('WB9ZZZ');
    expect(await livePage.getMyCallInput().inputValue()).toBe('WB9ZZZ');
    await livePage.setMyCall('P40XA');
    expect(await livePage.getMyCallInput().inputValue()).toBe('P40XA');
  });
});

test.describe('LIVE App - Live Feed Tests', () => {
  test.beforeAll(liveContext.beforeAll);
  test.afterAll(liveContext.afterAll);
  test.beforeEach(liveContext.beforeEach);

  test('connect button is enabled and clickable', async () => {
    const livePage = liveContext.getPageObject();
    await expect(livePage.getConnectLiveButton()).toBeEnabled();
  });

  test('clicking connect does not cause errors', async () => {
    const livePage = liveContext.getPageObject();
    await livePage.clickConnectLive();
  });

  test('map container is visible during live feed', async () => {
    const livePage = liveContext.getPageObject();
    await livePage.clickConnectLive();
    await expect(livePage.getMap()).toBeVisible();
  });

  test('feed controls remain visible during live feed', async () => {
    const livePage = liveContext.getPageObject();
    await livePage.clickConnectLive();
    await expect(livePage.getMyCallInput()).toBeVisible();
    await expect(livePage.getConnectLiveButton()).toBeVisible();
  });

  test('mode filter buttons remain visible during live feed', async () => {
    const livePage = liveContext.getPageObject();
    await livePage.clickConnectLive();
    await expect(livePage.getModeButtons().first()).toBeVisible();
  });

  test('band filter buttons remain visible during live feed', async () => {
    const livePage = liveContext.getPageObject();
    await livePage.clickConnectLive();
    await expect(livePage.getBandButtons().first()).toBeVisible();
  });

  test('multiple connect/disconnect cycles do not cause errors', async () => {
    const livePage = liveContext.getPageObject();
    await livePage.clickConnectLive();
    await livePage.clickConnectLive();
    await livePage.clickConnectLive();
    await livePage.clickConnectLive();
  });

  test('live feed toggle preserves page functionality', async () => {
    const livePage = liveContext.getPageObject();
    await livePage.clickConnectLive();
    await expect(livePage.getHeaderTitle()).toHaveText('LIVE HAMRADIO MAP');
    await expect(livePage.getSystemStatus()).toBeVisible();
  });
});
