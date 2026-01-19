const { chromium } = require('@playwright/test');

/**
 * Creates a Playwright browser and page
 * @param {object} options
 * @param {boolean} [options.headless] - Run in headless mode (default: true)
 * @returns {Promise<{browser: import('@playwright/test').Browser, page: import('@playwright/test').Page}>}
 */
async function createBrowser(options = {}) {
  const { headless = true } = options;
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();
  return { browser, page };
}

/**
 * Closes browser and page
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Browser} browser
 */
async function closeBrowser(page, browser) {
  if (page) await page.close();
  if (browser) await browser.close();
}

/**
 * Creates a test context with browser, page, and page object
 * @template T
 * @param {object} options
 * @param {import('@playwright/test').Page} [options.page] - Existing page to use
 * @param {import('@playwright/test').Browser} [options.browser] - Existing browser to use
 * @param {boolean} [options.launchBrowser] - Whether to launch a new browser (default: true)
 * @param {boolean} [options.headless] - Run browser headless (default: true)
 * @param {(page: import('@playwright/test').Page) => T} createPageObject - Factory function to create page object
 * @returns {Promise<{browser: import('@playwright/test').Browser, page: import('@playwright/test').Page, pageObject: T}>}
 */
async function createTestContext(options) {
  const { page, browser, launchBrowser = true, headless = true, createPageObject } = options;

  let activeBrowser = browser;
  let activePage = page;

  if (launchBrowser && !activeBrowser) {
    const result = await createBrowser({ headless });
    activeBrowser = result.browser;
    activePage = result.page;
  }

  const pageObject = createPageObject(activePage);
  return { browser: activeBrowser, page: activePage, pageObject };
}

/**
 * Test context that auto-closes browser
 * @template T
 * @param {object} options
 * @param {string} options.name - Context name for logging
 * @param {(context: {page: import('@playwright/test').Page, pageObject: T}) => Promise<void>} fn - Test function
 * @returns {(context: {page: import('@playwright/test').Page, browser: import('@playwright/test').Browser, pageObject: T}) => Promise<void>}
 */
function withContext(options) {
  const { name, fn } = options;
  return async ({ page, browser, pageObject }) => {
    try {
      await fn({ page, pageObject });
    } catch (error) {
      console.error(`Error in ${name}:`, error.message);
      throw error;
    }
  };
}

/**
 * Shared test setup for Playwright tests
 * @param {object} options
 * @param {string} options.pageName - Name of the page for logging
 * @param {(page: import('@playwright/test').Page) => any} options.createPageObject - Factory to create page object
 * @returns {object} Test context with beforeAll, afterAll, beforeEach
 */
function createTestSuite(options) {
  const { pageName, createPageObject } = options;

  /** @type {import('@playwright/test').Page} */
  let page;
  /** @type {import('@playwright/test').Browser} */
  let browser;
  /** @type {ReturnType<typeof createPageObject>} */
  let pageObject;

  return {
    getPage: () => page,
    getBrowser: () => browser,
    getPageObject: () => pageObject,

    beforeAll: async () => {
      const result = await createBrowser();
      browser = result.browser;
      page = result.page;
      pageObject = createPageObject(page);
    },

    afterAll: async () => {
      await closeBrowser(page, browser);
    },

    beforeEach: async () => {
      if (pageObject && typeof pageObject.load === 'function') {
        await pageObject.load();
      }
    },

    load: async (path = '/') => {
      await page.goto(path);
    },

    cleanup: async () => {
      await closeBrowser(page, browser);
      page = null;
      browser = null;
      pageObject = null;
    },
  };
}

module.exports = {
  createBrowser,
  closeBrowser,
  createTestContext,
  withContext,
  createTestSuite,
};
