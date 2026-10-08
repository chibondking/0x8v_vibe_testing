import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { getAppUrl } from '../config';

export class WaradioPage extends BasePage {
  readonly appName = 'waradio';
  readonly appUrl: string;

  constructor(page: Page) {
    super(page, getAppUrl('waradio'));
    this.appUrl = getAppUrl('waradio');
  }

  async load(): Promise<this> {
    await this.goto('/');
    return this;
  }

  getHeaderTitle(): Locator {
    return this.page.locator('.header-left h1');
  }

  getSystemStatus(): Locator {
    return this.page.locator('#system-status');
  }

  getTimestampDisplay(): Locator {
    return this.page.locator('#timestamp-display');
  }

  getDataInputSection(): Locator {
    return this.page.locator('.control-panel .panel-section').first();
  }

  getAdifFileInput(): Locator {
    return this.page.locator('#adif-file');
  }

  getLoadDemoDataButton(): Locator {
    return this.page.locator('#btn-demo');
  }

  getFileInfo(): Locator {
    return this.page.locator('#file-info');
  }

  getMyGridInput(): Locator {
    return this.page.locator('#my-grid');
  }

  getPlaybackSection(): Locator {
    return this.page.locator('.panel-section').nth(1);
  }

  getPlayButton(): Locator {
    return this.page.locator('#btn-play');
  }

  getPauseButton(): Locator {
    return this.page.locator('#btn-pause');
  }

  getResetButton(): Locator {
    return this.page.locator('#btn-reset');
  }

  getSpeedButtons(): Locator {
    return this.page.locator('.speed-btn');
  }

  getSpeedButton(speed: string): Locator {
    return this.page.locator(`.speed-btn[data-speed="${speed}"]`);
  }

  getRealTimeCheckbox(): Locator {
    return this.page.locator('#real-time-mode');
  }

  getSlowPlotCheckbox(): Locator {
    return this.page.locator('#slow-plot-mode');
  }

  getGapDetectionCheckbox(): Locator {
    return this.page.locator('#gap-detection');
  }

  getDeriveLocationCheckbox(): Locator {
    return this.page.locator('#use-state-location');
  }

  getBrighterMapCheckbox(): Locator {
    return this.page.locator('#bright-map');
  }

  getStatisticsSection(): Locator {
    return this.page.locator('.panel-section').nth(2);
  }

  getTotalContacts(): Locator {
    return this.page.locator('#stat-total');
  }

  getPlottedContacts(): Locator {
    return this.page.locator('#stat-plotted');
  }

  getRemainingContacts(): Locator {
    return this.page.locator('#stat-remaining');
  }

  getTimeElapsed(): Locator {
    return this.page.locator('#stat-elapsed');
  }

  getCurrentContactSection(): Locator {
    return this.page.locator('.panel-section').nth(3);
  }

  getContactCallsign(): Locator {
    return this.page.locator('#contact-call');
  }

  getContactLocation(): Locator {
    return this.page.locator('#contact-location');
  }

  getContactMode(): Locator {
    return this.page.locator('#contact-mode');
  }

  getContactBand(): Locator {
    return this.page.locator('#contact-band');
  }

  getContactDistance(): Locator {
    return this.page.locator('#contact-distance');
  }

  getContactGrid(): Locator {
    return this.page.locator('#contact-grid');
  }

  getMap(): Locator {
    return this.page.locator('#map');
  }

  getBandLegend(): Locator {
    return this.page.locator('#band-legend');
  }

  async loadDemoData(): Promise<WaradioPage> {
    await this.getLoadDemoDataButton().click();
    await this.waitForPlaybackEnabled();
    return this;
  }

  async disableRealTimeMode(): Promise<WaradioPage> {
    const checkbox = this.getRealTimeCheckbox();
    if (await checkbox.isChecked()) {
      await checkbox.click();
    }
    return this;
  }

  async clickPlay(): Promise<WaradioPage> {
    await this.getPlayButton().click();
    return this;
  }

  async clickPause(): Promise<WaradioPage> {
    await this.getPauseButton().click();
    return this;
  }

  async clickReset(): Promise<WaradioPage> {
    await this.getResetButton().click();
    return this;
  }

  async setSpeed(speed: string): Promise<WaradioPage> {
    await this.getSpeedButton(speed).click();
    return this;
  }

  async getCurrentSpeed(): Promise<string> {
    const activeBtn = this.page.locator('.speed-btn.active');
    return await activeBtn.getAttribute('data-speed') || '';
  }

  async waitForPlaybackEnabled(): Promise<boolean> {
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

  async getStatistics(): Promise<{total: string, plotted: string, remaining: string, elapsed: string}> {
    return {
      total: await this.textOf(this.getTotalContacts()),
      plotted: await this.textOf(this.getPlottedContacts()),
      remaining: await this.textOf(this.getRemainingContacts()),
      elapsed: await this.textOf(this.getTimeElapsed()),
    };
  }

  async getCurrentContact(): Promise<{callsign: string, location: string, mode: string, band: string, distance: string, grid: string}> {
    return {
      callsign: await this.textOf(this.getContactCallsign()),
      location: await this.textOf(this.getContactLocation()),
      mode: await this.textOf(this.getContactMode()),
      band: await this.textOf(this.getContactBand()),
      distance: await this.textOf(this.getContactDistance()),
      grid: await this.textOf(this.getContactGrid()),
    };
  }

  async isRealTimeChecked(): Promise<boolean> {
    return await this.getRealTimeCheckbox().isChecked();
  }

  async isGapDetectionChecked(): Promise<boolean> {
    return await this.getGapDetectionCheckbox().isChecked();
  }

  async isDeriveLocationChecked(): Promise<boolean> {
    return await this.getDeriveLocationCheckbox().isChecked();
  }

  async getMapMarkers(): Promise<Locator> {
    return this.page.locator('.leaflet-marker-icon, .leaflet-circle-marker');
  }

  async getMapMarkerCount(): Promise<number> {
    const markers = await this.getMapMarkers();
    return await markers.count();
  }
}

export default WaradioPage;
