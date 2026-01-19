const BasePage = require('./BasePage');
const { getAppUrl } = require('../config');

/** @typedef {import('@playwright/test').Page} Page */

class GridPage extends BasePage {
  /** @param {Page} page */
  constructor(page) {
    super(page, getAppUrl('grid'));
    this.appName = 'grid';
    this.appUrl = getAppUrl('grid');
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
  getWoprLights() {
    return this.page.locator('.header-wopr-lights');
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
  getDisplayOptionsSection() {
    return this.page.locator('.panel-section').nth(1);
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
  getShowFieldsCheckbox() {
    return this.page.locator('#show-fields');
  }

  /** @returns {import('@playwright/test').Locator} */
  getShowFieldLabelsCheckbox() {
    return this.page.locator('#show-field-labels');
  }

  /** @returns {import('@playwright/test').Locator} */
  getScreenshotButton() {
    return this.page.locator('#btn-screenshot');
  }

  /** @returns {import('@playwright/test').Locator} */
  getFfmaButtonContainer() {
    return this.page.locator('#ffma-button-container');
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
  getUniqueGrids() {
    return this.page.locator('#stat-grids');
  }

  /** @returns {import('@playwright/test').Locator} */
  getCountries() {
    return this.page.locator('#stat-countries');
  }

  /** @returns {import('@playwright/test').Locator} */
  getViewStatsButton() {
    return this.page.locator('#btn-stats');
  }

  /** @returns {import('@playwright/test').Locator} */
  getStatsPopup() {
    return this.page.locator('#stats-popup');
  }

  /** @returns {import('@playwright/test').Locator} */
  getCloseStatsButton() {
    return this.page.locator('#btn-close-stats');
  }

  /** @returns {import('@playwright/test').Locator} */
  getMap() {
    return this.page.locator('#map');
  }

  /** @returns {import('@playwright/test').Locator} */
  getMapContainer() {
    return this.page.locator('.map-container');
  }

  /** @returns {import('@playwright/test').Locator} */
  getLoadingOverlay() {
    return this.page.locator('#loading-overlay');
  }

  /** @returns {import('@playwright/test').Locator} */
  getLoadingMessage() {
    return this.page.locator('#loading-message');
  }

  /** @returns {import('@playwright/test').Locator} */
  getErrorPopup() {
    return this.page.locator('#error-popup');
  }

  /** @returns {import('@playwright/test').Locator} */
  getErrorText() {
    return this.page.locator('.error-text');
  }

  /** @returns {import('@playwright/test').Locator} */
  getStatusBarLeft() {
    return this.page.locator('#status-left');
  }

  /** @returns {import('@playwright/test').Locator} */
  getStatusBarRight() {
    return this.page.locator('#status-right');
  }

  /** @returns {import('@playwright/test').Locator} */
  getStatusLeft() {
    return this.getStatusBarLeft();
  }

  /** @returns {import('@playwright/test').Locator} */
  getStatusRight() {
    return this.getStatusBarRight();
  }

  /** @returns {import('@playwright/test').Locator} */
  getMobileControls() {
    return this.page.locator('.mobile-controls');
  }

  /** @returns {import('@playwright/test').Locator} */
  getMobileDemoButton() {
    return this.page.locator('#btn-demo-mobile');
  }

  /** @returns {Promise<GridPage>} */
  async loadDemoData() {
    await this.getLoadDemoDataButton().click();
    await this.waitForDataLoaded();
    return this;
  }

  /** @returns {Promise<GridPage>} */
  async loadDemoDataMobile() {
    await this.getMobileDemoButton().click();
    await this.waitForDataLoaded();
    return this;
  }

  /** @returns {Promise<boolean>} */
  async waitForDataLoaded() {
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

  /** @returns {Promise<{total: string, grids: string, countries: string}>} */
  async getStatistics() {
    return {
      total: await this.getTotalContacts().textContent(),
      grids: await this.getUniqueGrids().textContent(),
      countries: await this.getCountries().textContent(),
    };
  }

  /** @returns {Promise<GridPage>} */
  async toggleBrightMap() {
    await this.getBrightMapCheckbox().click();
    return this;
  }

  /** @returns {Promise<GridPage>} */
  async toggleColorByBand() {
    await this.getColorByBandCheckbox().click();
    return this;
  }

  /** @returns {Promise<GridPage>} */
  async openStats() {
    await this.getViewStatsButton().click();
    await this.page.waitForSelector('#stats-popup:not(.hidden)');
    return this;
  }

  /** @returns {Promise<GridPage>} */
  async closeStats() {
    await this.getCloseStatsButton().click();
    await this.page.waitForFunction(() => {
      const el = document.getElementById('stats-popup');
      return el && el.classList.contains('hidden');
    }, { timeout: 5000 });
    return this;
  }

  /**
   * @param {string} grid
   * @returns {Promise<GridPage>}
   */
  async setMyGrid(grid) {
    await this.getMyGridInput().clear();
    await this.getMyGridInput().fill(grid);
    return this;
  }

  /** @returns {import('@playwright/test').Locator} */
  async getGridSquares() {
    return this.page.locator('.grid-square-rect');
  }

  /** @returns {Promise<number>} */
  async getGridSquareCount() {
    const squares = await this.getGridSquares();
    return await squares.count();
  }

  /** @returns {import('@playwright/test').Locator} */
  async getFieldLabels() {
    return this.page.locator('.field-label');
  }

  /** @returns {Promise<GridPage>} */
  async clickScreenshot() {
    await this.getScreenshotButton().click();
    return this;
  }

  /** @returns {Promise<GridPage>} */
  async clickViewStats() {
    await this.getViewStatsButton().click();
    await this.page.waitForSelector('#stats-popup:not(.hidden)');
    return this;
  }

  /** @returns {Promise<GridPage>} */
  async closeStatsPopup() {
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

  /** @returns {Promise<boolean>} */
  async isColorByBandEnabled() {
    return await this.getColorByBandCheckbox().isChecked();
  }

  /** @returns {Promise<GridPage>} */
  async toggleShowFields() {
    await this.getShowFieldsCheckbox().click();
    return this;
  }

  /**
   * @returns {Promise<{north: number, south: number, east: number, west: number} | null>}
   */
  async getMapBounds() {
    return await this.page.evaluate(() => {
      const map = document.getElementById('map');
      if (map && map._leaflet_id) {
        const leafletMap = Object.values(window).find(obj =>
          obj._container === map && obj.getBounds
        );
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

  /** @returns {Promise<number>} */
  async getVisibleGrids() {
    const count = await this.page.locator('.grid-square-rect').count();
    return count;
  }
}

module.exports = GridPage;
