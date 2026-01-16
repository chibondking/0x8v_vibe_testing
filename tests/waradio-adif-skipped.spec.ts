const { test, expect, chromium } = require('@playwright/test');
const path = require('path');
const { createWaradioPage } = require('../pages');

test.describe('WARADIO App - ADIF File Loading (Manual Review)', () => {
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
  });

  test.skip('can upload ADIF file and update statistics', async () => {
    const adifPath = path.join(__dirname, '../test-data/test-contacts.adi');
    
    await waradioPage.getAdifFileInput().setInputFiles(adifPath);
    
    await page.waitForTimeout(10000);
    
    const stats = await waradioPage.getStatistics();
    expect(parseInt(stats.total)).toBeGreaterThan(0);
  });

  test.skip('displays file info after loading ADIF', async () => {
    const adifPath = path.join(__dirname, '../test-data/test-contacts.adi');
    
    await waradioPage.getAdifFileInput().setInputFiles(adifPath);
    
    await page.waitForTimeout(10000);
    
    const fileInfo = await waradioPage.getFileInfo().textContent();
    expect(fileInfo).toContain('Loaded');
  });

  test.skip('enables playback after ADIF file upload', async () => {
    const adifPath = path.join(__dirname, '../test-data/test-contacts.adi');
    
    await waradioPage.getAdifFileInput().setInputFiles(adifPath);
    
    await page.waitForTimeout(10000);
    
    await expect(waradioPage.getPlayButton()).toBeEnabled();
    await expect(waradioPage.getResetButton()).toBeEnabled();
  });

  test.skip('can play back ADIF contacts', async () => {
    const adifPath = path.join(__dirname, '../test-data/test-contacts.adi');
    
    await waradioPage.getAdifFileInput().setInputFiles(adifPath);
    
    await page.waitForTimeout(10000);
    await waradioPage.disableRealTimeMode();
    await waradioPage.setSpeed('4');
    await waradioPage.clickPlay();
    
    await page.waitForTimeout(3000);
    
    const plotted = await waradioPage.getPlottedContacts().textContent();
    expect(parseInt(plotted)).toBeGreaterThan(0);
    
    const contact = await waradioPage.getCurrentContact();
    expect(contact.callsign).not.toBe('--');
  });

  test.skip('handles invalid ADIF file gracefully', async () => {
    const invalidPath = path.join(__dirname, '../test-data/invalid.adi');
    
    await waradioPage.getAdifFileInput().setInputFiles(invalidPath);
    
    await page.waitForTimeout(5000);
    
    const fileInfo = await waradioPage.getFileInfo().textContent();
    expect(fileInfo).toContain('Error');
  });

  test.skip('handles empty ADIF file', async () => {
    const emptyPath = path.join(__dirname, '../test-data/empty.adi');
    
    await waradioPage.getAdifFileInput().setInputFiles(emptyPath);
    
    await page.waitForTimeout(5000);
    
    const fileInfo = await waradioPage.getFileInfo().textContent();
    expect(fileInfo).toContain('No contacts');
  });

  test.skip('ADIF and demo data produce similar playback behavior', async () => {
    await waradioPage.loadDemoData();
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    
    const demoPlotted = await waradioPage.getPlottedContacts().textContent();
    
    await waradioPage.clickReset();
    await page.waitForTimeout(500);
    
    const adifPath = path.join(__dirname, '../test-data/test-contacts.adi');
    await waradioPage.getAdifFileInput().setInputFiles(adifPath);
    
    await page.waitForTimeout(10000);
    await waradioPage.clickPlay();
    await page.waitForTimeout(2000);
    
    const adifPlotted = await waradioPage.getPlottedContacts().textContent();
    
    expect(parseInt(adifPlotted)).toBeGreaterThan(0);
  });

  test.skip('MY_GRIDSQUARE from ADIF populates grid input', async () => {
    const adifPath = path.join(__dirname, '../test-data/test-contacts.adi');
    
    await waradioPage.getAdifFileInput().setInputFiles(adifPath);
    
    await page.waitForTimeout(10000);
    
    const gridValue = await waradioPage.getMyGridInput().inputValue();
    expect(gridValue.length).toBeGreaterThan(0);
  });
});
