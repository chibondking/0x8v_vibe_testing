const { test, expect, chromium } = require('@playwright/test');
const { createWaradioPage } = require('../pages');

test.describe('WARADIO App - Happy Path Playback', () => {
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

  test('enables playback buttons after loading demo data', async () => {
    await expect(waradioPage.getPlayButton()).toBeEnabled();
    await expect(waradioPage.getResetButton()).toBeEnabled();
    await expect(waradioPage.getPauseButton()).toBeDisabled();
  });

  test('loads demo data and updates statistics', async () => {
    const stats = await waradioPage.getStatistics();
    expect(parseInt(stats.total)).toBeGreaterThan(0);
    expect(parseInt(stats.plotted)).toBe(0);
    expect(parseInt(stats.remaining)).toEqual(parseInt(stats.total));
  });

  test('speed is at 4x after change', async () => {
    const speed = await waradioPage.getCurrentSpeed();
    expect(speed).toBe('4');
  });

  test('clicking play starts playback and plots first contact', async () => {
    await waradioPage.clickPlay();
    
    await expect(waradioPage.getPlayButton()).toBeDisabled();
    await expect(waradioPage.getPauseButton()).toBeEnabled();
    
    await page.waitForTimeout(2000);
    
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(0);
  });

  test('map shows markers after playing', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(2000);
    
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(0);
  });

  test('current contact updates during playback', async () => {
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(2000);
    
    const contact = await waradioPage.getCurrentContact();
    expect(contact.callsign).not.toBe('--');
    expect(contact.band).not.toBe('--');
    expect(contact.mode).not.toBe('--');
  });

  test.skip('clicking pause stops time elapsed', async () => {
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    
    const plottedBeforePause = await waradioPage.getPlottedContacts().textContent();
    await waradioPage.clickPause();
    
    await page.waitForTimeout(1000);
    const plottedAfterPause = await waradioPage.getPlottedContacts().textContent();
    
    expect(plottedAfterPause).toBe(plottedBeforePause);
  });

  test('clicking reset returns to initial state', async () => {
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    await waradioPage.clickPause();
    await waradioPage.clickReset();
    
    const stats = await waradioPage.getStatistics();
    expect(stats.plotted).toBe('0');
    
    const contact = await waradioPage.getCurrentContact();
    expect(contact.callsign).toBe('--');
  });

  test('can change playback speed', async () => {
    await waradioPage.setSpeed('2');
    const speed = await waradioPage.getCurrentSpeed();
    expect(speed).toBe('2');
    
    await waradioPage.setSpeed('4');
    const speed4x = await waradioPage.getCurrentSpeed();
    expect(speed4x).toBe('4');
  });
});
