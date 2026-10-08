import { chromium, type Browser, type Page } from '@playwright/test';

export interface BrowserSession {
  browser: Browser;
  page: Page;
}

/**
 * Creates a Playwright browser and page
 */
export async function createBrowser(options: { headless?: boolean } = {}): Promise<BrowserSession> {
  const { headless = true } = options;
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();
  return { browser, page };
}

/**
 * Closes browser and page
 */
export async function closeBrowser(page?: Page | null, browser?: Browser | null): Promise<void> {
  if (page) await page.close();
  if (browser) await browser.close();
}

/**
 * Creates a test context with browser, page, and page object
 */
export async function createTestContext<T>(options: {
  page?: Page;
  browser?: Browser;
  launchBrowser?: boolean;
  headless?: boolean;
  createPageObject: (page: Page) => T;
}): Promise<{ browser?: Browser; page?: Page; pageObject: T }> {
  const { page, browser, launchBrowser = true, headless = true, createPageObject } = options;

  let activeBrowser = browser;
  let activePage = page;

  if (launchBrowser && !activeBrowser) {
    const result = await createBrowser({ headless });
    activeBrowser = result.browser;
    activePage = result.page;
  }

  if (!activePage) {
    throw new Error('createTestContext needs a page or launchBrowser: true');
  }

  const pageObject = createPageObject(activePage);
  return { browser: activeBrowser, page: activePage, pageObject };
}

/**
 * Test context wrapper that logs which context failed
 */
export function withContext<T>(options: {
  name: string;
  fn: (context: { page: Page; pageObject: T }) => Promise<void>;
}): (context: { page: Page; browser: Browser; pageObject: T }) => Promise<void> {
  const { name, fn } = options;
  return async ({ page, pageObject }) => {
    try {
      await fn({ page, pageObject });
    } catch (error) {
      console.error(`Error in ${name}:`, (error as Error).message);
      throw error;
    }
  };
}

export interface TestSuite<T> {
  getPage: () => Page;
  getBrowser: () => Browser;
  getPageObject: () => T;
  beforeAll: () => Promise<void>;
  afterAll: () => Promise<void>;
  beforeEach: () => Promise<void>;
  load: (path?: string) => Promise<void>;
  cleanup: () => Promise<void>;
}

/**
 * Shared test setup for Playwright tests
 */
export function createTestSuite<T extends object>(options: {
  pageName: string;
  createPageObject: (page: Page) => T;
}): TestSuite<T> {
  const { createPageObject } = options;

  let page: Page | null = null;
  let browser: Browser | null = null;
  let pageObject: T | null = null;

  const required = <V>(value: V | null, what: string): V => {
    if (value === null) {
      throw new Error(`${options.pageName}: ${what} used before beforeAll ran`);
    }
    return value;
  };

  return {
    getPage: () => required(page, 'page'),
    getBrowser: () => required(browser, 'browser'),
    getPageObject: () => required(pageObject, 'page object'),

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
      // Page objects with a load() method navigate to their start page before each test
      if (pageObject && 'load' in pageObject && typeof pageObject.load === 'function') {
        await pageObject.load();
      }
    },

    load: async (path = '/') => {
      await required(page, 'page').goto(path);
    },

    cleanup: async () => {
      await closeBrowser(page, browser);
      page = null;
      browser = null;
      pageObject = null;
    },
  };
}
