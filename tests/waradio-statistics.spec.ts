const { test, expect } = require('@playwright/test');
const { createWaradioPage } = require('../pages');
const { createTestSuite } = require('./test-utils');

const waradioContext = createTestSuite({
  pageName: 'WARADIO',
  createPageObject: createWaradioPage,
});

test.describe('WARADIO App - Statistics', () => {
  test.beforeAll(waradioContext.beforeAll);
  test.afterAll(waradioContext.afterAll);
  test.beforeEach(async () => {
    await waradioContext.beforeEach();
    const waradioPage = waradioContext.getPageObject();
    await waradioPage.disableRealTimeMode();
    await waradioPage.setSpeed('4');
    await waradioPage.loadDemoData();
  });

  test('total contacts shows correct count', async () => {
    const waradioPage = waradioContext.getPageObject();
    const stats = await waradioPage.getStatistics();
    expect(parseInt(stats.total)).toBeGreaterThan(0);
  });

  test('plotted starts at 0', async () => {
    const waradioPage = waradioContext.getPageObject();
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBe(0);
  });

  test('remaining equals total before playback', async () => {
    const waradioPage = waradioContext.getPageObject();
    const stats = await waradioPage.getStatistics();
    expect(parseInt(stats.remaining)).toEqual(parseInt(stats.total));
  });

  test('plotted increases during playback', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(0);
  });

  test('remaining decreases as contacts are plotted', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    const statsBefore = await waradioPage.getStatistics();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    const statsAfter = await waradioPage.getStatistics();
    expect(parseInt(statsAfter.remaining)).toBeLessThan(parseInt(statsBefore.remaining));
  });

  test('plotted + remaining equals total', async () => {
    const waradioPage = waradioContext.getPageObject();
    const stats = await waradioPage.getStatistics();
    expect(parseInt(stats.plotted) + parseInt(stats.remaining)).toEqual(parseInt(stats.total));
  });

  test('time elapsed updates during playback', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    const elapsedBefore = await waradioPage.getTimeElapsed().textContent();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    const elapsedAfter = await waradioPage.getTimeElapsed().textContent();
    expect(elapsedAfter).not.toBe(elapsedBefore);
  });

  test('distance is calculated during playback', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    const distance = await waradioPage.getContactDistance().textContent();
    expect(distance).not.toBe('--');
    expect(parseFloat(distance.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
  });

  test('reset clears plotted count', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    await waradioPage.clickReset();
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBe(0);
  });

  test('reset clears remaining to total', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    const statsBefore = await waradioPage.getStatistics();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    await waradioPage.clickReset();
    const statsAfter = await waradioPage.getStatistics();
    expect(parseInt(statsAfter.remaining)).toEqual(parseInt(statsBefore.total));
  });

  test('reset clears time elapsed', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    await waradioPage.clickReset();
    const elapsed = await waradioPage.getTimeElapsed().textContent();
    expect(elapsed).toBe('00:00:00');
  });

  test('statistics update in real-time during playback', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    const plotted1 = await waradioPage.getPlottedContacts().textContent();
    await page.waitForTimeout(1000);
    const plotted2 = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted2)).toBeGreaterThan(parseInt(plotted1));
  });
});
