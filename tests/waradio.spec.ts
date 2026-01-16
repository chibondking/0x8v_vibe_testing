const { test, expect, chromium } = require('@playwright/test');
const { createWaradioPage } = require('../pages');

test.describe('WARADIO App', () => {
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

  test.describe('Initial Load', () => {
    test.beforeEach(async () => {
      await waradioPage.load();
    });

    test('displays WARadio header and system status', async () => {
      await expect(waradioPage.getHeaderTitle()).toHaveText('WARadio Contact Visualizer');
      await expect(waradioPage.getSystemStatus()).toBeVisible();
    });

    test('displays data input section with all elements', async () => {
      await expect(waradioPage.getAdifFileInput()).toBeVisible();
      await expect(waradioPage.getLoadDemoDataButton()).toBeVisible();
      await expect(waradioPage.getMyGridInput()).toBeVisible();
    });

    test('displays playback controls', async () => {
      await expect(waradioPage.getPlayButton()).toBeVisible();
      await expect(waradioPage.getPauseButton()).toBeVisible();
      await expect(waradioPage.getResetButton()).toBeVisible();
    });

    test('speed defaults to 1x', async () => {
      const currentSpeed = await waradioPage.getCurrentSpeed();
      expect(currentSpeed).toBe('1');
      await expect(waradioPage.getSpeedButton('1')).toHaveClass(/active/);
    });

    test('checkboxes have correct default states', async () => {
      await expect(waradioPage.getRealTimeCheckbox()).toBeChecked();
      await expect(waradioPage.getGapDetectionCheckbox()).toBeChecked();
      await expect(waradioPage.getDeriveLocationCheckbox()).toBeChecked();
      await expect(waradioPage.getSlowPlotCheckbox()).not.toBeChecked();
      await expect(waradioPage.getBrighterMapCheckbox()).not.toBeChecked();
    });

    test('playback buttons are disabled initially', async () => {
      await expect(waradioPage.getPlayButton()).toBeDisabled();
      await expect(waradioPage.getPauseButton()).toBeDisabled();
      await expect(waradioPage.getResetButton()).toBeDisabled();
    });

    test('displays statistics section', async () => {
      await expect(waradioPage.getTotalContacts()).toHaveText('0');
      await expect(waradioPage.getPlottedContacts()).toHaveText('0');
      await expect(waradioPage.getRemainingContacts()).toHaveText('0');
      await expect(waradioPage.getTimeElapsed()).toHaveText('00:00:00');
    });

    test('displays current contact section', async () => {
      await expect(waradioPage.getContactCallsign()).toHaveText('--');
      await expect(waradioPage.getContactLocation()).toHaveText('--');
      await expect(waradioPage.getContactMode()).toHaveText('--');
      await expect(waradioPage.getContactBand()).toHaveText('--');
      await expect(waradioPage.getContactDistance()).toHaveText('--');
      await expect(waradioPage.getContactGrid()).toHaveText('--');
    });

    test('displays map with band legend', async () => {
      await expect(waradioPage.getMap()).toBeVisible();
      await expect(waradioPage.getBandLegend()).toBeVisible();
    });

    test('band legend contains all amateur radio bands', async () => {
      const legendItems = await waradioPage.getBandLegend().locator('.legend-item').count();
      expect(legendItems).toBeGreaterThanOrEqual(14);
    });
  });

  test.describe('Happy Path - Load Demo Data and Play', () => {
    test.beforeEach(async () => {
      await waradioPage.load();
      await waradioPage.loadDemoData();
    });

    test('enables playback buttons after loading demo data', async () => {
      await expect(waradioPage.getPlayButton()).toBeEnabled();
      await expect(waradioPage.getPauseButton()).toBeEnabled();
      await expect(waradioPage.getResetButton()).toBeEnabled();
    });

    test('loads demo data and updates statistics', async () => {
      const stats = await waradioPage.getStatistics();
      expect(parseInt(stats.total)).toBeGreaterThan(0);
      expect(parseInt(stats.plotted)).toBe(0);
      expect(parseInt(stats.remaining)).toEqual(parseInt(stats.total));
    });

    test('speed is at 1x by default', async () => {
      const speed = await waradioPage.getCurrentSpeed();
      expect(speed).toBe('1');
    });

    test('clicking play starts playback and updates time elapsed', async () => {
      await waradioPage.clickPlay();
      
      await expect(waradioPage.getPlayButton()).toBeDisabled();
      await expect(waradioPage.getPauseButton()).toBeEnabled();
      
      await page.waitForTimeout(2000);
      
      const elapsed = await waradioPage.getTimeElapsed().textContent();
      expect(elapsed).not.toBe('00:00:00');
    });

    test('map shows markers after playing', async () => {
      await waradioPage.clickPlay();
      
      await page.waitForTimeout(3000);
      
      const plotted = await waradioPage.getPlottedContacts().textContent();
      expect(parseInt(plotted)).toBeGreaterThan(0);
    });

    test('current contact updates during playback', async () => {
      await waradioPage.clickPlay();
      
      await page.waitForTimeout(3000);
      
      const contact = await waradioPage.getCurrentContact();
      expect(contact.callsign).not.toBe('--');
      expect(contact.band).not.toBe('--');
      expect(contact.mode).not.toBe('--');
    });

    test('clicking pause stops time elapsed', async () => {
      await waradioPage.clickPlay();
      await page.waitForTimeout(2000);
      
      const elapsedBeforePause = await waradioPage.getTimeElapsed().textContent();
      await waradioPage.clickPause();
      
      await page.waitForTimeout(1000);
      const elapsedAfterPause = await waradioPage.getTimeElapsed().textContent();
      
      expect(elapsedAfterPause).toBe(elapsedBeforePause);
    });

    test('clicking reset returns to initial state', async () => {
      await waradioPage.clickPlay();
      await page.waitForTimeout(2000);
      await waradioPage.clickPause();
      await waradioPage.clickReset();
      
      const stats = await waradioPage.getStatistics();
      expect(stats.plotted).toBe('0');
      expect(stats.elapsed).toBe('00:00:00');
      
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
});
