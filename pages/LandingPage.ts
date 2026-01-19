const BasePage = require('./BasePage');
const { getAppUrl, getAppsConfig, CONFIG } = require('../config');

/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {Object} Link
 * @property {string} url
 * @property {string} text
 * @property {string} href
 */

class LandingPage extends BasePage {
  /** @param {Page} page */
  constructor(page) {
    super(page, CONFIG.baseUrl);
  }

  /**
   * @returns {Promise<Link[]>}
   */
  async getAppLinks() {
    const links = await this.getAllLinks();
    const appsConfig = getAppsConfig();
    const appUrls = appsConfig.map(app => getAppUrl(app.name));

    return links.filter(link =>
      appUrls.some(url => link.url.startsWith(url)) && !link.url.includes('#')
    );
  }

  /**
   * @param {string} appName
   * @returns {Promise<Link | undefined>}
   */
  async getAppLink(appName) {
    const targetUrl = getAppUrl(appName);
    const links = await this.getAllLinks();
    return links.find(link => link.url.startsWith(targetUrl));
  }

  /**
   * @returns {Promise<Array<{appName: string, url: string, status: number, passed: boolean}>>}
   */
  async verifyAllAppLinks() {
    const results = [];
    const appsConfig = getAppsConfig();

    const https = require('https');

    for (const app of appsConfig) {
      const appUrl = getAppUrl(app.name);
      const status = await new Promise((resolve) => {
        const req = https.get(appUrl, (res) => {
          resolve(res.statusCode);
        });
        req.on('error', () => resolve(0));
        req.setTimeout(10000, () => {
          req.destroy();
          resolve(0);
        });
      });

      results.push({
        appName: app.name,
        url: appUrl,
        status: status || 0,
        passed: (status || 0) < 400 && status !== 0,
      });
    }

    return results;
  }

  /** @returns {Promise<import('@playwright/test').AriaSnapshot>} */
  async getAriaSnapshot() {
    return this.page.locator('body').ariaSnapshot();
  }

  /**
   * @param {import('@playwright/test').AriaSnapshot} expectedSnapshot
   * @returns {Promise<boolean>}
   */
  async verifyAriaSnapshot(expectedSnapshot) {
    const actualSnapshot = await this.getAriaSnapshot();
    return JSON.stringify(actualSnapshot, null, 2) === JSON.stringify(expectedSnapshot, null, 2);
  }

  /** @returns {Promise<import('@playwright/test').AriaSnapshot>} */
  async takeAndLogAriaSnapshot() {
    const snapshot = await this.getAriaSnapshot();
    console.log('  Aria Snapshot:');
    console.log(JSON.stringify(snapshot, null, 2));
    return snapshot;
  }
}

module.exports = LandingPage;
