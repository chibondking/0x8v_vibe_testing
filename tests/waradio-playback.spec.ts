const { test, expect } = require('@playwright/test');
const { createWaradioPage } = require('../pages');
const { createTestSuite } = require('./test-utils');

/**
 * @typedef {import('../pages/WaradioPage')} WaradioPage
 */

const waradioContext = createTestSuite({
  pageName: 'WARADIO',
  createPageObject: createWaradioPage,
});

test.describe('WARADIO App - Happy Path Playback', () => {
  test.beforeAll(waradioContext.beforeAll);
  test.afterAll(waradioContext.afterAll);
  test.beforeEach(async () => {
    await waradioContext.beforeEach();
    const waradioPage = waradioContext.getPageObject();
    await waradioPage.disableRealTimeMode();
    await waradioPage.setSpeed('4');
    await waradioPage.loadDemoData();
  });

  test('enables playback buttons after loading demo data', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getPlayButton()).toBeEnabled();
    await expect(waradioPage.getResetButton()).toBeEnabled();
    await expect(waradioPage.getPauseButton()).toBeDisabled();
  });

  test('loads demo data and updates statistics', async () => {
    const waradioPage = waradioContext.getPageObject();
    const stats = await waradioPage.getStatistics();
    expect(parseInt(stats.total)).toBeGreaterThan(0);
    expect(parseInt(stats.plotted)).toBe(0);
    expect(parseInt(stats.remaining)).toEqual(parseInt(stats.total));
  });

  test('speed is at 4x after change', async () => {
    const waradioPage = waradioContext.getPageObject();
    const speed = await waradioPage.getCurrentSpeed();
    expect(speed).toBe('4');
  });

  test('clicking play starts playback and plots first contact', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await expect(waradioPage.getPlayButton()).toBeDisabled();
    await expect(waradioPage.getPauseButton()).toBeEnabled();
    await page.waitForTimeout(2000);
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(0);
  });

  test('map shows markers after playing', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(0);
  });

  test('current contact updates during playback', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    const contact = await waradioPage.getCurrentContact();
    expect(contact.callsign).not.toBe('--');
    expect(contact.band).not.toBe('--');
    expect(contact.mode).not.toBe('--');
  });

  test.skip('clicking pause stops time elapsed', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    const plottedBeforePause = await waradioPage.getPlottedContacts().textContent();
    await waradioPage.clickPause();
    const plottedAfterPause = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plottedBeforePause)).toBeGreaterThan(0);
    expect(parseInt(plottedAfterPause)).toEqual(parseInt(plottedBeforePause));
  });

  test('clicking reset returns to initial state', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    await waradioPage.clickReset();
    await expect(waradioPage.getPlayButton()).toBeEnabled();
    await expect(waradioPage.getPauseButton()).toBeDisabled();
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBe(0);
    const contact = await waradioPage.getCurrentContact();
    expect(contact.callsign).toBe('--');
  });

  test('can change playback speed', async () => {
    const waradioPage = waradioContext.getPageObject();
    const page = waradioContext.getPage();
    await waradioPage.clickPlay();
    await page.waitForTimeout(1000);
    await waradioPage.setSpeed('2');
    expect(await waradioPage.getCurrentSpeed()).toBe('2');
    await waradioPage.setSpeed('4');
    expect(await waradioPage.getCurrentSpeed()).toBe('4');
  });
});
