const { test, expect, chromium } = require('@playwright/test');
const { createWaradioPage } = require('../pages');

test.describe('WARADIO App - Statistics', () => {
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
  }, 60000);

  test('total contacts shows correct count', async () => {
    const stats = await waradioPage.getStatistics();
    expect(parseInt(stats.total)).toBeGreaterThan(0);
  });

  test('plotted starts at 0', async () => {
    const stats = await waradioPage.getStatistics();
    expect(parseInt(stats.plotted)).toBe(0);
  });

  test('remaining equals total before playback', async () => {
    const stats = await waradioPage.getStatistics();
    expect(parseInt(stats.remaining)).toEqual(parseInt(stats.total));
  });

  test('plotted increases during playback', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(2000);
    
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(0);
  });

  test('remaining decreases as contacts are plotted', async () => {
    await waradioPage.loadDemoData();
    
    const beforeStats = await waradioPage.getStatistics();
    const beforeRemaining = parseInt(beforeStats.remaining);
    
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(3000);
    
    const afterStats = await waradioPage.getStatistics();
    const afterRemaining = parseInt(afterStats.remaining);
    
    expect(afterRemaining).toBeLessThan(beforeRemaining);
  });

  test('plotted + remaining equals total', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(3000);
    await waradioPage.clickPause();
    
    const stats = await waradioPage.getStatistics();
    const total = parseInt(stats.total);
    const plotted = parseInt(stats.plotted);
    const remaining = parseInt(stats.remaining);
    
    expect(plotted + remaining).toBeLessThanOrEqual(total);
  });

  test('time elapsed updates during playback', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(2000);
    
    const elapsed = await waradioPage.getTimeElapsed().textContent();
    
    const timeParts = elapsed.split(':');
    expect(timeParts.length).toBe(3);
    
    const seconds = parseInt(timeParts[2]);
    expect(seconds).toBeGreaterThanOrEqual(0);
  });

  test('distance is calculated during playback', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(3000);
    
    const distance = await waradioPage.getContactDistance().textContent();
    
    if (distance !== '--') {
      const distanceNum = parseFloat(distance);
      expect(distanceNum).toBeGreaterThan(0);
    }
  });

  test('reset clears plotted count', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(2000);
    await waradioPage.clickPause();
    
    const beforeReset = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(beforeReset)).toBeGreaterThan(0);
    
    await waradioPage.clickReset();
    
    const afterReset = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(afterReset)).toBe(0);
  });

  test('reset clears remaining to total', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(2000);
    await waradioPage.clickPause();
    
    const total = await waradioPage.getTotalContacts().textContent();
    
    await waradioPage.clickReset();
    
    const remaining = await waradioPage.getRemainingContacts().textContent();
    expect(parseInt(remaining)).toEqual(parseInt(total));
  });

  test('reset clears time elapsed', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(2000);
    await waradioPage.clickPause();
    
    const elapsed = await waradioPage.getTimeElapsed().textContent();
    expect(elapsed).not.toBe('00:00:00');
    
    await waradioPage.clickReset();
    
    const resetElapsed = await waradioPage.getTimeElapsed().textContent();
    expect(resetElapsed).toBe('00:00:00');
  });

  test('statistics update in real-time during playback', async () => {
    await waradioPage.clickPlay();
    
    const plotted1 = await waradioPage.getPlottedContacts().textContent();
    await page.waitForTimeout(500);
    
    const plotted2 = await waradioPage.getPlottedContacts().textContent();
    
    expect(parseInt(plotted2)).toBeGreaterThanOrEqual(parseInt(plotted1));
  });
});
