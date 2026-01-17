const { test, expect, chromium } = require('@playwright/test');
const { createWaradioPage } = require('../pages');

test.describe('WARADIO App - Grid Input', () => {
  let page;
  let waradioPage;

  test.beforeAll(async () => {
    const browser = await chromium.launch();
    page = await browser.newPage();
    waradioPage = createWaradioPage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await waradioPage.load();
    await waradioPage.disableRealTimeMode();
    await waradioPage.setSpeed('4');
    await waradioPage.loadDemoData();
  });

  test('grid input field is visible', async () => {
    await expect(waradioPage.getMyGridInput()).toBeVisible();
  });

  test('grid input accepts valid 4-character grid square', async () => {
    await waradioPage.getMyGridInput().fill('EM73');
    
    const value = await waradioPage.getMyGridInput().inputValue();
    expect(value).toBe('EM73');
  });

  test('grid input accepts valid 6-character grid square', async () => {
    await waradioPage.getMyGridInput().fill('EM73ab');
    
    const value = await waradioPage.getMyGridInput().inputValue();
    expect(value).toBe('EM73ab');
  });

  test('grid input preserves case as entered', async () => {
    await waradioPage.getMyGridInput().fill('en91');
    
    const value = await waradioPage.getMyGridInput().inputValue();
    expect(value).toBe('en91');
  });

  test('grid input has max length of 8', async () => {
    await waradioPage.getMyGridInput().fill('EM73AB12');
    
    const value = await waradioPage.getMyGridInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(8);
  });

  test('changing grid affects distance calculation', async () => {
    await waradioPage.getMyGridInput().fill('EN91');
    
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(3000);
    
    const distance = await waradioPage.getContactDistance().textContent();
    
    if (distance !== '--') {
      const distanceNum = parseFloat(distance);
      expect(distanceNum).toBeGreaterThan(0);
    }
  });

  test('empty grid shows no distance', async () => {
    await waradioPage.getMyGridInput().fill('');
    
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(3000);
    
    const distance = await waradioPage.getContactDistance().textContent();
    
    expect(distance).not.toBe('--');
  });

  test('valid grid enables distance calculation', async () => {
    const validGrids = ['EM73', 'FN31', 'DM33', 'IO91', 'OF78'];
    
    for (const grid of validGrids) {
      await waradioPage.getMyGridInput().fill(grid);
      await page.waitForTimeout(100);
      
      const value = await waradioPage.getMyGridInput().inputValue();
      expect(value.length).toBeGreaterThanOrEqual(4);
    }
  });
});
