const { shouldSkipLink, getAppUrl } = require('../config');

class BasePage {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.errors = [];

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!this.isIgnorableError(text)) {
          this.errors.push(text);
        }
      }
    });

    this.page.on('pageerror', error => {
      this.errors.push(error.message);
    });
  }

  isIgnorableError(text) {
    const ignorablePatterns = [
      'net::ERR_',
      'favicon',
      'Failed to load resource',
    ];
    return ignorablePatterns.some(pattern => text.includes(pattern));
  }

  async goto(path = '/', options = {}) {
    const url = `${this.baseUrl}${path}`;
    return this.page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
      ...options,
    });
  }

  getPageErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  async getAllLinks() {
    return this.page.evaluate(() => {
      const anchorTags = Array.from(document.querySelectorAll('a[href]'));
      return anchorTags.map(a => ({
        url: a.href,
        text: a.textContent ? a.textContent.trim() : '',
        href: a.getAttribute('href'),
      }));
    });
  }

  async getApplicableLinks() {
    const links = await this.getAllLinks();
    return links.filter(link => {
      if (link.url.startsWith('mailto:')) return false;
      if (link.url.startsWith('tel:')) return false;
      return true;
    });
  }

  async getSkippedLinks() {
    const links = await this.getApplicableLinks();
    return links.filter(link => shouldSkipLink(link.url).skipped);
  }

  async getTestableLinks() {
    const links = await this.getApplicableLinks();
    return links.filter(link => !shouldSkipLink(link.url).skipped);
  }
}

module.exports = BasePage;
