const BasePage = require('./BasePage');

class WaradioPage extends BasePage {
  constructor(page) {
    super(page, 'https://waradio.0x8v.io');
    this.appName = 'waradio';
    this.appUrl = 'https://waradio.0x8v.io';
  }

  async load() {
    await this.goto('/');
    return this;
  }

  getHeaderTitle() {
    return this.page.locator('.header-left h1');
  }

  getSystemStatus() {
    return this.page.locator('#system-status');
  }

  getTimestampDisplay() {
    return this.page.locator('#timestamp-display');
  }

  getDataInputSection() {
    return this.page.locator('.control-panel .panel-section').first();
  }

  getAdifFileInput() {
    return this.page.locator('#adif-file');
  }

  getLoadDemoDataButton() {
    return this.page.locator('#btn-demo');
  }

  getFileInfo() {
    return this.page.locator('#file-info');
  }

  getMyGridInput() {
    return this.page.locator('#my-grid');
  }

  getPlaybackSection() {
    return this.page.locator('.panel-section').nth(1);
  }

  getPlayButton() {
    return this.page.locator('#btn-play');
  }

  getPauseButton() {
    return this.page.locator('#btn-pause');
  }

  getResetButton() {
    return this.page.locator('#btn-reset');
  }

  getSpeedButtons() {
    return this.page.locator('.speed-btn');
  }

  getSpeedButton(speed) {
    return this.page.locator(`.speed-btn[data-speed="${speed}"]`);
  }

  getRealTimeCheckbox() {
    return this.page.locator('#real-time-mode');
  }

  getSlowPlotCheckbox() {
    return this.page.locator('#slow-plot-mode');
  }

  getGapDetectionCheckbox() {
    return this.page.locator('#gap-detection');
  }

  getDeriveLocationCheckbox() {
    return this.page.locator('#use-state-location');
  }

  getBrighterMapCheckbox() {
    return this.page.locator('#bright-map');
  }

  getStatisticsSection() {
    return this.page.locator('.panel-section').nth(2);
  }

  getTotalContacts() {
    return this.page.locator('#stat-total');
  }

  getPlottedContacts() {
    return this.page.locator('#stat-plotted');
  }

  getRemainingContacts() {
    return this.page.locator('#stat-remaining');
  }

  getTimeElapsed() {
    return this.page.locator('#stat-elapsed');
  }

  getCurrentContactSection() {
    return this.page.locator('.panel-section').nth(3);
  }

  getContactCallsign() {
    return this.page.locator('#contact-call');
  }

  getContactLocation() {
    return this.page.locator('#contact-location');
  }

  getContactMode() {
    return this.page.locator('#contact-mode');
  }

  getContactBand() {
    return this.page.locator('#contact-band');
  }

  getContactDistance() {
    return this.page.locator('#contact-distance');
  }

  getContactGrid() {
    return this.page.locator('#contact-grid');
  }

  getMap() {
    return this.page.locator('#map');
  }

  getBandLegend() {
    return this.page.locator('#band-legend');
  }

  async loadDemoData() {
    await this.getLoadDemoDataButton().click();
    await this.waitForPlaybackEnabled();
    return this;
  }

  async clickPlay() {
    await this.getPlayButton().click();
    return this;
  }

  async clickPause() {
    await this.getPauseButton().click();
    return this;
  }

  async clickReset() {
    await this.getResetButton().click();
    return this;
  }

  async setSpeed(speed) {
    await this.getSpeedButton(speed).click();
    return this;
  }

  async getCurrentSpeed() {
    const activeBtn = await this.page.locator('.speed-btn.active');
    return await activeBtn.getAttribute('data-speed');
  }

  async waitForPlaybackEnabled() {
    await this.getPlayButton().waitFor({ state: 'visible', timeout: 5000 });
    const isDisabled = await this.getPlayButton().getAttribute('disabled');
    if (isDisabled === null) {
      return true;
    }
    return false;
  }

  async getStatistics() {
    return {
      total: await this.getTotalContacts().textContent(),
      plotted: await this.getPlottedContacts().textContent(),
      remaining: await this.getRemainingContacts().textContent(),
      elapsed: await this.getTimeElapsed().textContent(),
    };
  }

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

  async isRealTimeChecked() {
    return await this.getRealTimeCheckbox().isChecked();
  }

  async isGapDetectionChecked() {
    return await this.getGapDetectionCheckbox().isChecked();
  }

  async isDeriveLocationChecked() {
    return await this.getDeriveLocationCheckbox().isChecked();
  }

  async getMapMarkers() {
    return await this.page.locator('.leaflet-marker-icon, .leaflet-circle-marker');
  }

  async getMapMarkerCount() {
    return await this.getMapMarkers().count();
  }
}

module.exports = WaradioPage;
