import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { getAppUrl } from '../config';

export class GridPage extends BasePage {
  readonly appName = 'grid';
  readonly appUrl: string;

  constructor(page: Page) {
    super(page, getAppUrl('grid'));
    this.appUrl = getAppUrl('grid');
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

  getWoprLights(): Locator {
    return this.page.locator('.header-wopr-lights');
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

  getDisplayOptionsSection(): Locator {
    return this.page.locator('.panel-section').nth(1);
  }

  getColorByBandCheckbox(): Locator {
    return this.page.locator('#color-by-band');
  }

  getBrightMapCheckbox(): Locator {
    return this.page.locator('#bright-map');
  }

  getShowFieldsCheckbox(): Locator {
    return this.page.locator('#show-fields');
  }

  getShowFieldLabelsCheckbox(): Locator {
    return this.page.locator('#show-field-labels');
  }

  getScreenshotButton(): Locator {
    return this.page.locator('#btn-screenshot');
  }

  getFfmaButtonContainer(): Locator {
    return this.page.locator('#ffma-button-container');
  }

  getStatisticsSection(): Locator {
    return this.page.locator('.panel-section').nth(2);
  }

  getTotalContacts(): Locator {
    return this.page.locator('#stat-total');
  }

  getUniqueGrids(): Locator {
    return this.page.locator('#stat-grids');
  }

  getCountries(): Locator {
    return this.page.locator('#stat-countries');
  }

  getViewStatsButton(): Locator {
    return this.page.locator('#btn-stats');
  }

  getStatsPopup(): Locator {
    return this.page.locator('#stats-popup');
  }

  getCloseStatsButton(): Locator {
    return this.page.locator('#btn-close-stats');
  }

  getMap(): Locator {
    return this.page.locator('#map');
  }

  getMapContainer(): Locator {
    return this.page.locator('.map-container');
  }

  getLoadingOverlay(): Locator {
    return this.page.locator('#loading-overlay');
  }

  getLoadingMessage(): Locator {
    return this.page.locator('#loading-message');
  }

  getErrorPopup(): Locator {
    return this.page.locator('#error-popup');
  }

  getErrorText(): Locator {
    return this.page.locator('.error-text');
  }

  getStatusBarLeft(): Locator {
    return this.page.locator('#status-left');
  }

  getStatusBarRight(): Locator {
    return this.page.locator('#status-right');
  }

  getStatusLeft(): Locator {
    return this.getStatusBarLeft();
  }

  getStatusRight(): Locator {
    return this.getStatusBarRight();
  }

  getMobileControls(): Locator {
    return this.page.locator('.mobile-controls');
  }

  getMobileDemoButton(): Locator {
    return this.page.locator('#btn-demo-mobile');
  }

  async loadDemoData(): Promise<GridPage> {
    await this.getLoadDemoDataButton().click();
    await this.waitForDataLoaded();
    return this;
  }

  async loadDemoDataMobile(): Promise<GridPage> {
    await this.getMobileDemoButton().click();
    await this.waitForDataLoaded();
    return this;
  }

  async waitForDataLoaded(): Promise<boolean> {
    try {
      await this.page.waitForFunction(() => {
        const total = document.getElementById('stat-total');
        return total && parseInt(total.textContent) > 0;
      }, { timeout: 15000 });
      return true;
    } catch (error) {
      console.error('Timeout waiting for data to load');
      return false;
    }
  }

  async getStatistics(): Promise<{total: string, grids: string, countries: string}> {
    return {
      total: await this.textOf(this.getTotalContacts()),
      grids: await this.textOf(this.getUniqueGrids()),
      countries: await this.textOf(this.getCountries()),
    };
  }

  async toggleBrightMap(): Promise<GridPage> {
    await this.getBrightMapCheckbox().click();
    return this;
  }

  async toggleColorByBand(): Promise<GridPage> {
    await this.getColorByBandCheckbox().click();
    return this;
  }

  async openStats(): Promise<GridPage> {
    await this.getViewStatsButton().click();
    await this.page.waitForSelector('#stats-popup:not(.hidden)');
    return this;
  }

  async closeStats(): Promise<GridPage> {
    await this.getCloseStatsButton().click();
    await this.page.waitForFunction(() => {
      const el = document.getElementById('stats-popup');
      return el && el.classList.contains('hidden');
    }, { timeout: 5000 });
    return this;
  }

  async setMyGrid(grid: string): Promise<GridPage> {
    await this.getMyGridInput().clear();
    await this.getMyGridInput().fill(grid);
    return this;
  }

  getGridSquares(): Locator {
    return this.page.locator('.grid-square-rect');
  }

  async getGridSquareCount(): Promise<number> {
    return this.getGridSquares().count();
  }

  getFieldLabels(): Locator {
    return this.page.locator('.field-label');
  }

  async clickScreenshot(): Promise<GridPage> {
    await this.getScreenshotButton().click();
    return this;
  }

  async clickViewStats(): Promise<GridPage> {
    await this.getViewStatsButton().click();
    await this.page.waitForSelector('#stats-popup:not(.hidden)');
    return this;
  }

  async closeStatsPopup(): Promise<GridPage> {
    const popup = this.getStatsPopup();
    const isHidden = await popup.evaluate(el => el.classList.contains('hidden'));
    if (!isHidden) {
      await this.page.locator('#btn-close-stats').click();
      await this.page.waitForFunction(() => {
        const el = document.getElementById('stats-popup');
        return el && el.classList.contains('hidden');
      }, { timeout: 5000 });
    }
    return this;
  }

  async isColorByBandEnabled(): Promise<boolean> {
    return await this.getColorByBandCheckbox().isChecked();
  }

  async toggleShowFields(): Promise<GridPage> {
    await this.getShowFieldsCheckbox().click();
    return this;
  }

  async getMapBounds(): Promise<{north: number, south: number, east: number, west: number} | null> {
    return await this.page.evaluate(() => {
      // Leaflet attaches untyped properties to the map element and its instance
      const map = document.getElementById('map') as (HTMLElement & { _leaflet_id?: number }) | null;
      if (map && map._leaflet_id) {
        const leafletMap = Object.values(window).find((obj: any) =>
          obj && obj._container === map && obj.getBounds
        ) as any;
        if (leafletMap) {
          const bounds = leafletMap.getBounds();
          return {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          };
        }
      }
      return null;
    });
  }

  async getVisibleGrids(): Promise<number> {
    const count = await this.page.locator('.grid-square-rect').count();
    return count;
  }
}

export default GridPage;
