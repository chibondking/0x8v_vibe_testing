const BasePage = require('./BasePage');
const { shouldSkipLink } = require('../config');

/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {Object} LinkCheckResult
 * @property {string} appName
 * @property {string} appUrl
 * @property {number} totalLinks
 * @property {Array<{url: string, text: string, reason?: string}>} skippedLinks
 * @property {Array<{url: string, text: string, status: number}>} brokenLinks
 * @property {boolean} passed
 */

class AppPage extends BasePage {
  /**
   * @param {Page} page
   * @param {string} appName
   * @param {string} appUrl
   */
  constructor(page, appName, appUrl) {
    super(page, appUrl);
    this.appName = appName;
    this.appUrl = appUrl;
  }

  async load() {
    await this.goto('/');
    return this;
  }

  /** @returns {LinkCheckResult} */
  getLinkCheckResults() {
    return {
      appName: this.appName,
      appUrl: this.appUrl,
      totalLinks: 0,
      skippedLinks: [],
      brokenLinks: [],
      passed: true,
    };
  }

  /** @returns {Promise<LinkCheckResult>} */
  async checkAllLinks() {
    const result = this.getLinkCheckResults();
    const applicableLinks = await this.getApplicableLinks();
    result.totalLinks = applicableLinks.length;

    const skipped = await this.getSkippedLinks();
    result.skippedLinks = skipped.map(link => ({
      url: link.url,
      text: link.text,
      reason: shouldSkipLink(link.url).reason,
    }));

    const testableLinks = await this.getTestableLinks();

    const https = require('https');
    const http = require('http');

    for (const link of testableLinks) {
      const status = await new Promise((resolve) => {
        const protocol = link.url.startsWith('https') ? https : http;
        const req = protocol.get(link.url, (res) => {
          resolve(res.statusCode);
        });
        req.on('error', () => resolve(0));
        req.setTimeout(10000, () => {
          req.destroy();
          resolve(0);
        });
      });

      const linkStatus = status || 0;
      if (linkStatus >= 400 || linkStatus === 0) {
        result.brokenLinks.push({
          url: link.url,
          text: link.text,
          status: linkStatus,
        });
        result.passed = false;
      }
    }

    return result;
  }
}

module.exports = AppPage;
