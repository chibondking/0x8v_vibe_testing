const { test, expect, chromium } = require('@playwright/test');
const { createLandingPage } = require('../pages');
const { getAppsConfig, getAppUrl, CONFIG } = require('../config');

test.describe('Vibe Landing Page', () => {
  let page;
  
  test.beforeAll(async () => {
    const browser = await chromium.launch();
    page = await browser.newPage();
  });
  
  test.afterAll(async () => {
    await page.close();
  });
  
  test('has correct heading and status', async () => {
    const landingPage = createLandingPage(page);
    await landingPage.goto('/');
    
    await expect(page.locator('h1.title')).toHaveText('HAMRAD INTERFACE');
    await expect(page.locator('.status-text')).toHaveText('SYSTEM ONLINE');
  });
  
  test('has all app cards with correct links', async () => {
    const landingPage = createLandingPage(page);
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
    const landingPage = createLandingPage(page);
    await landingPage.goto('/');
    
    const snapshot = await page.locator('body').ariaSnapshot();
    
    expect(snapshot).toBeDefined();
    expect(snapshot).toContain('HAMRAD INTERFACE');
    expect(snapshot).toContain('=== AVAILABLE SYSTEMS ===');
    expect(snapshot).toContain('WARADIO');
    expect(snapshot).toContain('GRID');
    expect(snapshot).toContain('LIVE');
    expect(snapshot).toContain('https://waradio.0x8v.io');
    expect(snapshot).toContain('https://grid.0x8v.io');
    expect(snapshot).toContain('https://live.0x8v.io');
  });
  
  test('all app links are accessible', async () => {
    const landingPage = createLandingPage(page);
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
    const landingPage = createLandingPage(page);
    await landingPage.goto('/');
    
    await expect(page.locator('.section-title')).toHaveText('=== AVAILABLE SYSTEMS ===');
  });
});
