const BasePage = require('./BasePage');
const { getAppUrl } = require('../config');

class GridPage extends BasePage {
  constructor(page) {
    super(page, getAppUrl('grid'));
    this.appName = 'grid';
    this.appUrl = getAppUrl('grid');
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

  getWoprLights() {
    return this.page.locator('.header-wopr-lights');
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

  getColorByBandCheckbox() {
    return this.page.locator('#color-by-band');
  }

  getBrightMapCheckbox() {
    return this.page.locator('#bright-map');
  }

  getShowFieldsCheckbox() {
    return this.page.locator('#show-fields');
  }

  getShowFieldLabelsCheckbox() {
    return this.page.locator('#show-field-labels');
  }

  getScreenshotButton() {
    return this.page.locator('#btn-screenshot');
  }

  getViewStatsButton() {
    return this.page.locator('#btn-stats');
  }

  getTotalContacts() {
    return this.page.locator('#stat-total');
  }

  getUniqueGrids() {
    return this.page.locator('#stat-grids');
  }

  getCountries() {
    return this.page.locator('#stat-countries');
  }

  getMap() {
    return this.page.locator('#map');
  }

  getLoadingOverlay() {
    return this.page.locator('#loading-overlay');
  }

  getErrorPopup() {
    return this.page.locator('#error-popup');
  }

  getStatsPopup() {
    return this.page.locator('#stats-popup');
  }

  getStatusLeft() {
    return this.page.locator('#status-left');
  }

  getStatusRight() {
    return this.page.locator('#status-right');
  }

  async loadDemoData() {
    await this.getLoadDemoDataButton().click();
    await this.waitForDataLoaded();
    return this;
  }

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

  async clickScreenshot() {
    await this.getScreenshotButton().click();
    return this;
  }

  async clickViewStats() {
    await this.getViewStatsButton().click();
    await this.page.waitForSelector('#stats-popup:not(.hidden)');
    return this;
  }

  async closeStatsPopup() {
    const popup = this.getStatsPopup();
    const isHidden = await popup.evaluate(el => el.classList.contains('hidden'));
    if (!isHidden) {
      await this.page.locator('#btn-close-stats').click();
      await this.page.waitForSelector('#stats-popup.hidden');
    }
    return this;
  }

  async isColorByBandEnabled() {
    return await this.getColorByBandCheckbox().isChecked();
  }

  async toggleColorByBand() {
    await this.getColorByBandCheckbox().click();
    return this;
  }

  async toggleBrightMap() {
    await this.getBrightMapCheckbox().click();
    return this;
  }

  async toggleShowFields() {
    await this.getShowFieldsCheckbox().click();
    return this;
  }

  async getStatistics() {
    return {
      total: await this.getTotalContacts().textContent(),
      grids: await this.getUniqueGrids().textContent(),
      countries: await this.getCountries().textContent(),
    };
  }

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

  async getVisibleGrids() {
    const count = await this.page.locator('.grid-square-rect').count();
    return count;
  }
}

module.exports = GridPage;
