import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { getAppUrl } from '../config';

export class LivePage extends BasePage {
  readonly appName = 'live';
  readonly appUrl: string;

  constructor(page: Page) {
    super(page, getAppUrl('live'));
    this.appUrl = getAppUrl('live');
  }

  async load(): Promise<this> {
    await this.goto('/');
    return this;
  }

  getHeaderTitle(): Locator {
    return this.page.locator('h1');
  }

  getSystemStatus(): Locator {
    return this.page.locator('#system-status');
  }

  getTimestampDisplay(): Locator {
    return this.page.locator('#timestamp-display');
  }

  getLocationDisplay(): Locator {
    return this.page.locator('.status-location');
  }

  getMap(): Locator {
    return this.page.locator('#map');
  }

  getModeButtons(): Locator {
    return this.page.locator('.control-panel .panel-section button');
  }

  getBandButtons(): Locator {
    return this.page.locator('.control-panel .panel-section').nth(1).locator('button');
  }

  getColorByBandCheckbox(): Locator {
    return this.page.locator('#color-by-band');
  }

  getBrightMapCheckbox(): Locator {
    return this.page.locator('#bright-map');
  }

  getClassicFormatCheckbox(): Locator {
    return this.page.locator('#classic-format');
  }

  getShowLabelsCheckbox(): Locator {
    return this.page.locator('#show-labels');
  }

  getDrawLinesCheckbox(): Locator {
    return this.page.locator('#draw-lines');
  }

  getConnectLiveButton(): Locator {
    return this.page.locator('#btn-connect');
  }

  getSpotCount(): Locator {
    return this.page.locator('.live-feed-stats');
  }

  getClearAllButton(): Locator {
    return this.page.locator('#btn-clear');
  }

  getHeardMeButton(): Locator {
    return this.page.locator('#btn-heard-me');
  }

  getHeardByMeButton(): Locator {
    return this.page.locator('#btn-heard-by-me');
  }

  getEnableLocationButton(): Locator {
    return this.page.locator('#btn-enable-location');
  }

  getMyCallInput(): Locator {
    return this.page.locator('#my-call');
  }

  getZoomInButton(): Locator {
    return this.page.locator('.leaflet-control-zoom-in');
  }

  getZoomOutButton(): Locator {
    return this.page.locator('.leaflet-control-zoom-out');
  }

  getStatusLeft(): Locator {
    return this.page.locator('#status-left');
  }

  getStatusRight(): Locator {
    return this.page.locator('#status-right');
  }

  async clickModeButton(mode: string): Promise<LivePage> {
    const button = this.page.locator(`.mode-filter button:has-text("${mode}")`);
    await button.click();
    return this;
  }

  async clickBandButton(band: string): Promise<LivePage> {
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

  async setMyCall(callsign: string): Promise<LivePage> {
    await this.getMyCallInput().fill(callsign);
    return this;
  }

  async enableLocation() {
    await this.getEnableLocationButton().click();
    return this;
  }

  async getSpotCountValue(): Promise<number> {
    const countText = await this.textOf(this.getSpotCount());
    const match = countText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  async isConnected(): Promise<boolean> {
    const text = await this.textOf(this.getConnectLiveButton());
    return text.includes('DISCONNECT');
  }

  async isLiveFeedActive(): Promise<boolean> {
    const buttonText = await this.textOf(this.getConnectLiveButton());
    return buttonText.includes('DISCONNECT') || buttonText.includes('LIVE');
  }

  async waitForSpots(timeout: number = 30000): Promise<boolean> {
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

  async waitForNewSpot(previousCount: number, timeout: number = 5000): Promise<boolean> {
    try {
      await this.page.waitForFunction((prevCount) => {
        const spotCount = document.getElementById('spot-count');
        return spotCount !== null && parseInt(spotCount.textContent ?? '') > prevCount;
      }, previousCount, { timeout });
      return true;
    } catch (error) {
      console.error('Timeout waiting for new spot');
      return false;
    }
  }

  async getStatistics(): Promise<{spotCount: string, myCall: string}> {
    return {
      spotCount: await this.textOf(this.getSpotCount()),
      myCall: await this.getMyCallInput().inputValue(),
    };
  }

  getSpotElements(): Locator {
    return this.page.locator('.live-spot, .spot-item, .spot-row, tr[class*="spot"]');
  }

  async getLiveFeedStatus(): Promise<string|null> {
    const statusElement = this.page.locator('#live-feed-status, .feed-status, [class*="status"]');
    if (await statusElement.count() > 0) {
      return await statusElement.textContent();
    }
    return null;
  }

  async getSpotData(index: number = 0): Promise<{text: string, locator: Locator}|null> {
    const spots = this.page.locator('.live-spot, .spot-item, .spot-row, tr[class*="spot"]');
    const count = await spots.count();
    if (count === 0 || index >= count) {
      return null;
    }
    const spot = spots.nth(index);
    return {
      text: await this.textOf(spot),
      locator: spot,
    };
  }

  async getAllSpotData(): Promise<Array<{text: string, locator: Locator}>> {
    const spots = this.page.locator('.live-spot, .spot-item, .spot-row, tr[class*="spot"]');
    const count = await spots.count();
    const spotData = [];
    for (let i = 0; i < Math.min(count, 50); i++) {
      const spot = spots.nth(i);
      spotData.push({
        text: await this.textOf(spot),
        locator: spot,
      });
    }
    return spotData;
  }

  async getMapMarkers(): Promise<Locator> {
    return this.page.locator('.leaflet-marker-icon, .marker, [class*="marker"]');
  }

  async getMapLines(): Promise<Locator> {
    return this.page.locator('.leaflet-polyline, .line, [class*="line"]');
  }

  async getCurrentTimestamp(): Promise<string|null> {
    const timestampElement = this.page.locator('#timestamp-display, .timestamp');
    if (await timestampElement.count() > 0) {
      return await timestampElement.textContent();
    }
    return null;
  }

  async getFeedInfo(): Promise<{spotCount: number, isConnected: boolean, timestamp: string|null, status: string|null}> {
    return {
      spotCount: await this.getSpotCountValue(),
      isConnected: await this.isLiveFeedActive(),
      timestamp: await this.getCurrentTimestamp(),
      status: await this.getLiveFeedStatus(),
    };
  }
}

export default LivePage;
