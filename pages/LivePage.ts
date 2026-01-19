const BasePage = require('./BasePage');
const { getAppUrl } = require('../config');

/** @typedef {import('@playwright/test').Page} Page */

class LivePage extends BasePage {
  /** @param {Page} page */
  constructor(page) {
    super(page, getAppUrl('live'));
    this.appName = 'live';
    this.appUrl = getAppUrl('live');
  }

  async load() {
    await this.goto('/');
    return this;
  }

  /** @returns {import('@playwright/test').Locator} */
  getHeaderTitle() {
    return this.page.locator('h1');
  }

  /** @returns {import('@playwright/test').Locator} */
  getSystemStatus() {
    return this.page.locator('#system-status');
  }

  /** @returns {import('@playwright/test').Locator} */
  getTimestampDisplay() {
    return this.page.locator('#timestamp-display');
  }

  /** @returns {import('@playwright/test').Locator} */
  getLocationDisplay() {
    return this.page.locator('.status-location');
  }

  /** @returns {import('@playwright/test').Locator} */
  getMap() {
    return this.page.locator('#map');
  }

  /** @returns {import('@playwright/test').Locator} */
  getModeButtons() {
    return this.page.locator('.control-panel .panel-section button');
  }

  /** @returns {import('@playwright/test').Locator} */
  getBandButtons() {
    return this.page.locator('.control-panel .panel-section').nth(1).locator('button');
  }

  /** @returns {import('@playwright/test').Locator} */
  getColorByBandCheckbox() {
    return this.page.locator('#color-by-band');
  }

  /** @returns {import('@playwright/test').Locator} */
  getBrightMapCheckbox() {
    return this.page.locator('#bright-map');
  }

  /** @returns {import('@playwright/test').Locator} */
  getClassicFormatCheckbox() {
    return this.page.locator('#classic-format');
  }

  /** @returns {import('@playwright/test').Locator} */
  getShowLabelsCheckbox() {
    return this.page.locator('#show-labels');
  }

  /** @returns {import('@playwright/test').Locator} */
  getDrawLinesCheckbox() {
    return this.page.locator('#draw-lines');
  }

  /** @returns {import('@playwright/test').Locator} */
  getConnectLiveButton() {
    return this.page.locator('#btn-connect');
  }

  /** @returns {import('@playwright/test').Locator} */
  getSpotCount() {
    return this.page.locator('.live-feed-stats');
  }

  /** @returns {import('@playwright/test').Locator} */
  getClearAllButton() {
    return this.page.locator('#btn-clear');
  }

  /** @returns {import('@playwright/test').Locator} */
  getHeardMeButton() {
    return this.page.locator('#btn-heard-me');
  }

  /** @returns {import('@playwright/test').Locator} */
  getHeardByMeButton() {
    return this.page.locator('#btn-heard-by-me');
  }

  /** @returns {import('@playwright/test').Locator} */
  getEnableLocationButton() {
    return this.page.locator('#btn-enable-location');
  }

  /** @returns {import('@playwright/test').Locator} */
  getMyCallInput() {
    return this.page.locator('#my-call');
  }

  /** @returns {import('@playwright/test').Locator} */
  getZoomInButton() {
    return this.page.locator('.leaflet-control-zoom-in');
  }

  /** @returns {import('@playwright/test').Locator} */
  getZoomOutButton() {
    return this.page.locator('.leaflet-control-zoom-out');
  }

  /** @returns {import('@playwright/test').Locator} */
  getStatusLeft() {
    return this.page.locator('#status-left');
  }

  /** @returns {import('@playwright/test').Locator} */
  getStatusRight() {
    return this.page.locator('#status-right');
  }

  /**
   * @param {string} mode
   * @returns {Promise<LivePage>}
   */
  async clickModeButton(mode) {
    const button = this.page.locator(`.mode-filter button:has-text("${mode}")`);
    await button.click();
    return this;
  }

  /**
   * @param {string} band
   * @returns {Promise<LivePage>}
   */
  async clickBandButton(band) {
    const button = this.page.locator(`.band-filter button:has-text("${band}")`);
    await button.click();
    return this;
  }

  async clickConnectLive() {
    await this.getConnectLiveButton().click();
    return this;
  }

  async clickClearAll() {
    await this.getClearAllButton().click();
    return this;
  }

  /**
   * @param {string} callsign
   * @returns {Promise<LivePage>}
   */
  async setMyCall(callsign) {
    await this.getMyCallInput().fill(callsign);
    return this;
  }

  async enableLocation() {
    await this.getEnableLocationButton().click();
    return this;
  }

  /** @returns {Promise<number>} */
  async getSpotCountValue() {
    const countText = await this.getSpotCount().textContent();
    const match = countText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  /** @returns {Promise<boolean>} */
  async isConnected() {
    const text = await this.getConnectLiveButton().textContent();
    return text.includes('DISCONNECT');
  }

  /** @returns {Promise<boolean>} */
  async isLiveFeedActive() {
    const buttonText = await this.getConnectLiveButton().textContent();
    return buttonText.includes('DISCONNECT') || buttonText.includes('LIVE');
  }

  /**
   * @param {number} [timeout]
   * @returns {Promise<boolean>}
   */
  async waitForSpots(timeout = 30000) {
    try {
      await this.page.waitForFunction(() => {
        const spotCount = document.getElementById('spot-count');
        return spotCount && parseInt(spotCount.textContent) > 0;
      }, { timeout });
      return true;
    } catch (error) {
      console.error('Timeout waiting for spots');
      return false;
    }
  }

  /**
   * @param {number} previousCount
   * @param {number} [timeout]
   * @returns {Promise<boolean>}
   */
  async waitForNewSpot(previousCount, timeout = 5000) {
    try {
      await this.page.waitForFunction((prevCount) => {
        const spotCount = document.getElementById('spot-count');
        return spotCount && parseInt(spotCount.textContent) > prevCount;
      }, { timeout }, previousCount);
      return true;
    } catch (error) {
      console.error('Timeout waiting for new spot');
      return false;
    }
  }

  /** @returns {Promise<{spotCount: string, myCall: string}>} */
  async getStatistics() {
    return {
      spotCount: await this.getSpotCount().textContent(),
      myCall: await this.getMyCallInput().inputValue(),
    };
  }

  /** @returns {import('@playwright/test').Locator} */
  getSpotElements() {
    return this.page.locator('.live-spot, .spot-item, .spot-row, tr[class*="spot"]');
  }

  /** @returns {Promise<string|null>} */
  async getLiveFeedStatus() {
    const statusElement = this.page.locator('#live-feed-status, .feed-status, [class*="status"]');
    if (await statusElement.count() > 0) {
      return await statusElement.textContent();
    }
    return null;
  }

  /**
   * @param {number} [index]
   * @returns {Promise<{text: string, locator: import('@playwright/test').Locator}|null>}
   */
  async getSpotData(index = 0) {
    const spots = this.page.locator('.live-spot, .spot-item, .spot-row, tr[class*="spot"]');
    const count = await spots.count();
    if (count === 0 || index >= count) {
      return null;
    }
    const spot = spots.nth(index);
    return {
      text: await spot.textContent(),
      locator: spot,
    };
  }

  /** @returns {Promise<Array<{text: string, locator: import('@playwright/test').Locator}>>} */
  async getAllSpotData() {
    const spots = this.page.locator('.live-spot, .spot-item, .spot-row, tr[class*="spot"]');
    const count = await spots.count();
    const spotData = [];
    for (let i = 0; i < Math.min(count, 50); i++) {
      const spot = spots.nth(i);
      spotData.push({
        text: await spot.textContent(),
        locator: spot,
      });
    }
    return spotData;
  }

  /** @returns {Promise<import('@playwright/test').Locator>} */
  async getMapMarkers() {
    return this.page.locator('.leaflet-marker-icon, .marker, [class*="marker"]');
  }

  /** @returns {Promise<import('@playwright/test').Locator>} */
  async getMapLines() {
    return this.page.locator('.leaflet-polyline, .line, [class*="line"]');
  }

  /** @returns {Promise<string|null>} */
  async getCurrentTimestamp() {
    const timestampElement = this.page.locator('#timestamp-display, .timestamp');
    if (await timestampElement.count() > 0) {
      return await timestampElement.textContent();
    }
    return null;
  }

  /** @returns {Promise<{spotCount: number, isConnected: boolean, timestamp: string|null, status: string|null}>} */
  async getFeedInfo() {
    return {
      spotCount: await this.getSpotCountValue(),
      isConnected: await this.isLiveFeedActive(),
      timestamp: await this.getCurrentTimestamp(),
      status: await this.getLiveFeedStatus(),
    };
  }
}

module.exports = LivePage;
