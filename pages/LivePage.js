const BasePage = require('./BasePage');
const { getAppUrl } = require('../config');

class LivePage extends BasePage {
  constructor(page) {
    super(page, getAppUrl('live'));
    this.appName = 'live';
    this.appUrl = getAppUrl('live');
  }

  async load() {
    await this.goto('/');
    return this;
  }

  getHeaderTitle() {
    return this.page.locator('h1');
  }

  getSystemStatus() {
    return this.page.locator('#system-status');
  }

  getTimestampDisplay() {
    return this.page.locator('#timestamp-display');
  }

  getLocationDisplay() {
    return this.page.locator('.status-location');
  }

  getMap() {
    return this.page.locator('#map');
  }

  getModeButtons() {
    return this.page.locator('.control-panel .panel-section button');
  }

  getBandButtons() {
    return this.page.locator('.control-panel .panel-section').nth(1).locator('button');
  }

  getColorByBandCheckbox() {
    return this.page.locator('#color-by-band');
  }

  getBrightMapCheckbox() {
    return this.page.locator('#bright-map');
  }

  getClassicFormatCheckbox() {
    return this.page.locator('#classic-format');
  }

  getShowLabelsCheckbox() {
    return this.page.locator('#show-labels');
  }

  getDrawLinesCheckbox() {
    return this.page.locator('#draw-lines');
  }

  getConnectLiveButton() {
    return this.page.locator('#btn-connect');
  }

  getSpotCount() {
    return this.page.locator('.live-feed-stats');
  }

  getClearAllButton() {
    return this.page.locator('button:has-text("CLEAR ALL")');
  }

  getHeardMeButton() {
    return this.page.locator('button:has-text("HEARD ME")');
  }

  getHeardByMeButton() {
    return this.page.locator('button:has-text("HEARD BY ME")');
  }

  getEnableLocationButton() {
    return this.page.locator('button:has-text("ENABLE")');
  }

  getClearAllButton() {
    return this.page.locator('#btn-clear');
  }

  getMyCallInput() {
    return this.page.locator('#my-call');
  }

  getHeardMeButton() {
    return this.page.locator('#btn-heard-me');
  }

  getHeardByMeButton() {
    return this.page.locator('#btn-heard-by-me');
  }

  getEnableLocationButton() {
    return this.page.locator('#btn-enable-location');
  }

  getZoomInButton() {
    return this.page.locator('.leaflet-control-zoom-in');
  }

  getZoomOutButton() {
    return this.page.locator('.leaflet-control-zoom-out');
  }

  getStatusLeft() {
    return this.page.locator('#status-left');
  }

  getStatusRight() {
    return this.page.locator('#status-right');
  }

  async clickModeButton(mode) {
    const button = this.page.locator(`.mode-filter button:has-text("${mode}")`);
    await button.click();
    return this;
  }

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

  async setMyCall(callsign) {
    await this.getMyCallInput().fill(callsign);
    return this;
  }

  async enableLocation() {
    await this.getEnableLocationButton().click();
    return this;
  }

  async getSpotCountValue() {
    const text = await this.getSpotCount().textContent();
    return parseInt(text) || 0;
  }

  async isConnected() {
    const text = await this.getConnectLiveButton().textContent();
    return text.includes('DISCONNECT');
  }

  async isLiveFeedActive() {
    const text = await this.getConnectLiveButton().textContent();
    return text.includes('LIVE');
  }

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

  async getStatistics() {
    return {
      spotCount: await this.getSpotCount().textContent(),
      myCall: await this.getMyCallInput().inputValue(),
    };
  }

  getSpotElements() {
    return this.page.locator('.live-spot, .spot-item, .spot-row, tr[class*="spot"]');
  }

  async getSpotCountValue() {
    const countText = await this.getSpotCount().textContent();
    const match = countText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  async getLiveFeedStatus() {
    const statusElement = this.page.locator('#live-feed-status, .feed-status, [class*="status"]');
    if (await statusElement.count() > 0) {
      return await statusElement.textContent();
    }
    return null;
  }

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

  async getMapMarkers() {
    return this.page.locator('.leaflet-marker-icon, .marker, [class*="marker"]');
  }

  async getMapLines() {
    return this.page.locator('.leaflet-polyline, .line, [class*="line"]');
  }

  async isLiveFeedActive() {
    const buttonText = await this.getConnectLiveButton().textContent();
    return buttonText.includes('DISCONNECT') || buttonText.includes('LIVE');
  }

  async getCurrentTimestamp() {
    const timestampElement = this.page.locator('#timestamp-display, .timestamp');
    if (await timestampElement.count() > 0) {
      return await timestampElement.textContent();
    }
    return null;
  }

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
