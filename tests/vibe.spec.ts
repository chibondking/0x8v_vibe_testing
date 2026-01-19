const { test, expect } = require('@playwright/test');
const { createLandingPage } = require('../pages');
const { getAppsConfig, getAppUrl, CONFIG } = require('../config');
const { createTestSuite, closeBrowser } = require('./test-utils');
const { MOBILE_VIEWPORT, TABLET_VIEWPORT, DESKTOP_VIEWPORT } = require('./assertions');

const LARGE_VIEWPORT = { width: 2560, height: 1440 };

/**
 * @typedef {import('../pages/LandingPage')} LandingPage
 */

const vibeContext = createTestSuite({
  pageName: 'Vibe',
  createPageObject: createLandingPage,
});

test.describe('Vibe Landing Page', () => {
  test.beforeAll(vibeContext.beforeAll);
  test.afterAll(vibeContext.afterAll);

  test('has correct heading and status', async () => {
    const page = vibeContext.getPage();
    const landingPage = vibeContext.getPageObject();
    await landingPage.goto('/');
    
    await expect(page.locator('h1.title')).toHaveText('HAMRAD INTERFACE');
    await expect(page.locator('.status-text')).toHaveText('SYSTEM ONLINE');
  });
  
  test('has all app cards with correct links', async () => {
    const page = vibeContext.getPage();
    const landingPage = vibeContext.getPageObject();
    await landingPage.goto('/');
    
    const appsConfig = getAppsConfig();
    const cards = page.locator('.system-card');
    await expect(cards).toHaveCount(appsConfig.length);
    
    for (const app of appsConfig) {
      const expectedUrl = getAppUrl(app.name);
      const cardTitle = app.name.toUpperCase();
      const card = page.locator(`.system-card:has(.card-title:has-text("${cardTitle}"))`);
      await expect(card.locator('.card-title')).toHaveText(cardTitle);
      await expect(card).toHaveAttribute('href', expectedUrl);
    }
  });
  
  test('aria snapshot has expected structure', async () => {
    const page = vibeContext.getPage();
    const landingPage = vibeContext.getPageObject();
    await landingPage.goto('/');
    
    const snapshot = await page.locator('body').ariaSnapshot();
    
    expect(snapshot).toBeDefined();
    expect(snapshot).toContain('HAMRAD INTERFACE');
    expect(snapshot).toContain('=== AVAILABLE SYSTEMS ===');
    expect(snapshot).toContain('WARADIO');
    expect(snapshot).toContain('GRID');
    expect(snapshot).toContain('LIVE');
    expect(snapshot).toContain(getAppUrl('waradio'));
    expect(snapshot).toContain(getAppUrl('grid'));
    expect(snapshot).toContain(getAppUrl('live'));
  });
  
  test('all app links are accessible', async () => {
    const page = vibeContext.getPage();
    const landingPage = vibeContext.getPageObject();
    await landingPage.goto('/');
    
    const appsConfig = getAppsConfig();
    
    for (const app of appsConfig) {
      const expectedUrl = getAppUrl(app.name);
      const link = page.locator(`.system-card[href="${expectedUrl}"]`);
      await expect(link).toBeVisible();
      await expect(link).toBeEnabled();
    }
  });
  
  test('section titles are visible', async () => {
    const page = vibeContext.getPage();
    const landingPage = vibeContext.getPageObject();
    await landingPage.goto('/');
    
    await expect(page.locator('.section-title')).toHaveText('=== AVAILABLE SYSTEMS ===');
  });
  
  test('footer elements are present', async () => {
    const page = vibeContext.getPage();
    const landingPage = vibeContext.getPageObject();
    await landingPage.goto('/');
    
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('.footer-text').first()).toContainText('HAM RADIO');
  });
});

test.describe('Vibe Landing Page @stress', () => {
  let page;

  test.beforeAll(async () => {
    const { browser } = await require('./test-utils').createBrowser();
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    if (page) await page.close();
  });

  test.beforeEach(async () => {
    await page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle' });
  });

  test('handles rapid window resize events @stress', async () => {
    const sizes = [
      MOBILE_VIEWPORT,
      TABLET_VIEWPORT,
      DESKTOP_VIEWPORT,
      { width: 414, height: 896 },
      LARGE_VIEWPORT,
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(50);
    }

    await expect(page.locator('h1.title')).toHaveText('HAMRAD INTERFACE');
  });

  test('handles rapid page reloads @stress', async () => {
    for (let i = 0; i < 5; i++) {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1.title')).toBeVisible();
    }
  });

  test('handles rapid keyboard navigation @stress', async () => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const activeElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(activeElement);
  });

  test('handles script injection prevention @stress', async () => {
    const cards = page.locator('.system-card');
    const count = await cards.count();
    
    for (let i = 0; i < count; i++) {
      const cardContent = await cards.nth(i).textContent();
      expect(cardContent).not.toContain('<script>');
      expect(cardContent).not.toContain('javascript:');
    }
  });

  test('handles rapid visibility toggles @stress', async () => {
    await page.setViewportSize({ width: 0, height: 0 });
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.setViewportSize(DESKTOP_VIEWPORT);
    
    await expect(page.locator('h1.title')).toBeVisible();
  });

  test('handles rapid mouse movements across cards @stress', async () => {
    const cards = page.locator('.system-card');
    const count = await cards.count();
    
    for (let round = 0; round < 3; round++) {
      for (let i = 0; i < count; i++) {
        await cards.nth(i).hover();
      }
    }
    
    await expect(page.locator('h1.title')).toHaveText('HAMRAD INTERFACE');
  });

  test('handles concurrent scroll and click @stress', async () => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.evaluate(() => window.scrollTo(0, 0));
    
    await expect(page.locator('h1.title')).toHaveText('HAMRAD INTERFACE');
  });

  test('handles multiple rapid state changes @stress', async () => {
    for (let i = 0; i < 20; i++) {
      await page.evaluate((idx) => {
        document.body.style.opacity = idx % 2 === 0 ? '0.5' : '1';
      }, i);
    }
    
    await page.evaluate(() => {
      document.body.style.opacity = '1';
    });
    
    await expect(page.locator('h1.title')).toBeVisible();
  });

  test('handles resource-intensive DOM operations @stress', async () => {
    await page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle' });
    
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'stress-test-container';
      container.style.display = 'none';
      document.body.appendChild(container);
      
      for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.textContent = 'test';
        container.appendChild(div);
      }
    });
    
    await page.evaluate(() => {
      const container = document.getElementById('stress-test-container');
      if (container) container.remove();
    });
    
    await expect(page.locator('h1.title')).toBeVisible();
  });
});
