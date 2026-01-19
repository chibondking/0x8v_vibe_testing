const BasePage = require('./BasePage');
const { getAppUrl } = require('../config');

/** @typedef {import('@playwright/test').Page} Page */

class WaradioPage extends BasePage {
  /** @param {Page} page */
  constructor(page) {
    super(page, getAppUrl('waradio'));
    this.appName = 'waradio';
    this.appUrl = getAppUrl('waradio');
  }

  async load() {
    await this.goto('/');
    return this;
  }

  /** @returns {import('@playwright/test').Locator} */
  getHeaderTitle() {
    return this.page.locator('.header-left h1');
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
  getDataInputSection() {
    return this.page.locator('.control-panel .panel-section').first();
  }

  /** @returns {import('@playwright/test').Locator} */
  getAdifFileInput() {
    return this.page.locator('#adif-file');
  }

  /** @returns {import('@playwright/test').Locator} */
  getLoadDemoDataButton() {
    return this.page.locator('#btn-demo');
  }

  /** @returns {import('@playwright/test').Locator} */
  getFileInfo() {
    return this.page.locator('#file-info');
  }

  /** @returns {import('@playwright/test').Locator} */
  getMyGridInput() {
    return this.page.locator('#my-grid');
  }

  /** @returns {import('@playwright/test').Locator} */
  getPlaybackSection() {
    return this.page.locator('.panel-section').nth(1);
  }

  /** @returns {import('@playwright/test').Locator} */
  getPlayButton() {
    return this.page.locator('#btn-play');
  }

  /** @returns {import('@playwright/test').Locator} */
  getPauseButton() {
    return this.page.locator('#btn-pause');
  }

  /** @returns {import('@playwright/test').Locator} */
  getResetButton() {
    return this.page.locator('#btn-reset');
  }

  /** @returns {import('@playwright/test').Locator} */
  getSpeedButtons() {
    return this.page.locator('.speed-btn');
  }

  /**
   * @param {string} speed
   * @returns {import('@playwright/test').Locator}
   */
  getSpeedButton(speed) {
    return this.page.locator(`.speed-btn[data-speed="${speed}"]`);
  }

  /** @returns {import('@playwright/test').Locator} */
  getRealTimeCheckbox() {
    return this.page.locator('#real-time-mode');
  }

  /** @returns {import('@playwright/test').Locator} */
  getSlowPlotCheckbox() {
    return this.page.locator('#slow-plot-mode');
  }

  /** @returns {import('@playwright/test').Locator} */
  getGapDetectionCheckbox() {
    return this.page.locator('#gap-detection');
  }

  /** @returns {import('@playwright/test').Locator} */
  getDeriveLocationCheckbox() {
    return this.page.locator('#use-state-location');
  }

  /** @returns {import('@playwright/test').Locator} */
  getBrighterMapCheckbox() {
    return this.page.locator('#bright-map');
  }

  /** @returns {import('@playwright/test').Locator} */
  getStatisticsSection() {
    return this.page.locator('.panel-section').nth(2);
  }

  /** @returns {import('@playwright/test').Locator} */
  getTotalContacts() {
    return this.page.locator('#stat-total');
  }

  /** @returns {import('@playwright/test').Locator} */
  getPlottedContacts() {
    return this.page.locator('#stat-plotted');
  }

  /** @returns {import('@playwright/test').Locator} */
  getRemainingContacts() {
    return this.page.locator('#stat-remaining');
  }

  /** @returns {import('@playwright/test').Locator} */
  getTimeElapsed() {
    return this.page.locator('#stat-elapsed');
  }

  /** @returns {import('@playwright/test').Locator} */
  getCurrentContactSection() {
    return this.page.locator('.panel-section').nth(3);
  }

  /** @returns {import('@playwright/test').Locator} */
  getContactCallsign() {
    return this.page.locator('#contact-call');
  }

  /** @returns {import('@playwright/test').Locator} */
  getContactLocation() {
    return this.page.locator('#contact-location');
  }

  /** @returns {import('@playwright/test').Locator} */
  getContactMode() {
    return this.page.locator('#contact-mode');
  }

  /** @returns {import('@playwright/test').Locator} */
  getContactBand() {
    return this.page.locator('#contact-band');
  }

  /** @returns {import('@playwright/test').Locator} */
  getContactDistance() {
    return this.page.locator('#contact-distance');
  }

  /** @returns {import('@playwright/test').Locator} */
  getContactGrid() {
    return this.page.locator('#contact-grid');
  }

  /** @returns {import('@playwright/test').Locator} */
  getMap() {
    return this.page.locator('#map');
  }

  /** @returns {import('@playwright/test').Locator} */
  getBandLegend() {
    return this.page.locator('#band-legend');
  }

  /** @returns {Promise<WaradioPage>} */
  async loadDemoData() {
    await this.getLoadDemoDataButton().click();
    await this.waitForPlaybackEnabled();
    return this;
  }

  /** @returns {Promise<WaradioPage>} */
  async disableRealTimeMode() {
    const checkbox = this.getRealTimeCheckbox();
    if (await checkbox.isChecked()) {
      await checkbox.click();
    }
    return this;
  }

  /** @returns {Promise<WaradioPage>} */
  async clickPlay() {
    await this.getPlayButton().click();
    return this;
  }

  /** @returns {Promise<WaradioPage>} */
  async clickPause() {
    await this.getPauseButton().click();
    return this;
  }

  /** @returns {Promise<WaradioPage>} */
  async clickReset() {
    await this.getResetButton().click();
    return this;
  }

  /**
   * @param {string} speed
   * @returns {Promise<WaradioPage>}
   */
  async setSpeed(speed) {
    await this.getSpeedButton(speed).click();
    return this;
  }

  /** @returns {Promise<string>} */
  async getCurrentSpeed() {
    const activeBtn = this.page.locator('.speed-btn.active');
    return await activeBtn.getAttribute('data-speed') || '';
  }

  /** @returns {Promise<boolean>} */
  async waitForPlaybackEnabled() {
    try {
      await this.page.waitForFunction(() => {
        const playBtn = document.getElementById('btn-play') as HTMLButtonElement;
        return playBtn && !playBtn.disabled;
      }, { timeout: 15000 });
      return true;
    } catch (error) {
      console.error('Timeout waiting for playback to be enabled');
      return false;
    }
  }

  /** @returns {Promise<{total: string, plotted: string, remaining: string, elapsed: string}>} */
  async getStatistics() {
    return {
      total: await this.getTotalContacts().textContent(),
      plotted: await this.getPlottedContacts().textContent(),
      remaining: await this.getRemainingContacts().textContent(),
      elapsed: await this.getTimeElapsed().textContent(),
    };
  }

  /** @returns {Promise<{callsign: string, location: string, mode: string, band: string, distance: string, grid: string}>} */
  async getCurrentContact() {
    return {
      callsign: await this.getContactCallsign().textContent(),
      location: await this.getContactLocation().textContent(),
      mode: await this.getContactMode().textContent(),
      band: await this.getContactBand().textContent(),
      distance: await this.getContactDistance().textContent(),
      grid: await this.getContactGrid().textContent(),
    };
  }

  /** @returns {Promise<boolean>} */
  async isRealTimeChecked() {
    return await this.getRealTimeCheckbox().isChecked();
  }

  async isSlowPlotChecked() {
    return this.getSlowPlotCheckbox().isChecked();
  }

  /** @returns {Promise<boolean>} */
  async isGapDetectionChecked() {
    return await this.getGapDetectionCheckbox().isChecked();
  }

  /** @returns {Promise<boolean>} */
  async isDeriveLocationChecked() {
    return await this.getDeriveLocationCheckbox().isChecked();
  }

  /** @returns {Promise<import('@playwright/test').Locator>} */
  async getMapMarkers() {
    return this.page.locator('.leaflet-marker-icon, .leaflet-circle-marker');
  }

  /** @returns {Promise<number>} */
  async getMapMarkerCount() {
    const markers = await this.getMapMarkers();
    return await markers.count();
  }
}

module.exports = WaradioPage;
