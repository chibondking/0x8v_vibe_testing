const { test, expect, chromium } = require('@playwright/test');
const { createWaradioPage } = require('../pages');

test.describe('WARADIO App - UI/UX', () => {
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

  test('page title is correct', async () => {
    await expect(page).toHaveTitle(/WARadio/);
  });

  test('header contains app name', async () => {
    await expect(waradioPage.getHeaderTitle()).toBeVisible();
  });

  test('system status indicator is visible', async () => {
    await expect(waradioPage.getSystemStatus()).toBeVisible();
  });

  test('data input section title is visible', async () => {
    const dataInputTitle = page.locator('.panel-section h3').first();
    await expect(dataInputTitle).toHaveText('DATA INPUT');
  });

  test('playback section title is visible', async () => {
    const playbackTitle = page.locator('.panel-section h3').nth(1);
    await expect(playbackTitle).toHaveText('PLAYBACK CONTROL');
  });

  test('statistics section title is visible', async () => {
    const statsTitle = page.locator('.panel-section h3').nth(2);
    await expect(statsTitle).toHaveText('STATISTICS');
  });

  test('current contact section title is visible', async () => {
    const contactTitle = page.locator('.panel-section h3').nth(3);
    await expect(contactTitle).toHaveText('CURRENT CONTACT');
  });

  test('all button labels are correct', async () => {
    await expect(waradioPage.getPlayButton()).toHaveText(/PLAY/);
    await expect(waradioPage.getPauseButton()).toHaveText(/PAUSE/);
    await expect(waradioPage.getResetButton()).toHaveText(/RESET/);
  });

  test('speed buttons show correct labels', async () => {
    await expect(waradioPage.getSpeedButton('0.5')).toHaveText('0.5x');
    await expect(waradioPage.getSpeedButton('1')).toHaveText('1x');
    await expect(waradioPage.getSpeedButton('2')).toHaveText('2x');
    await expect(waradioPage.getSpeedButton('4')).toHaveText('4x');
  });

  test('checkbox labels are visible', async () => {
    await expect(page.locator('label:has(#real-time-mode)')).toContainText('REAL TIME');
    await expect(page.locator('label:has(#slow-plot-mode)')).toContainText('SLOW PLOT');
    await expect(page.locator('label:has(#gap-detection)')).toContainText('GAP DETECTION');
    await expect(page.locator('label:has(#use-state-location)')).toContainText('DERIVE LOC');
    await expect(page.locator('label:has(#bright-map)')).toContainText('BRIGHTER MAP');
  });

  test('statistics labels are visible', async () => {
    const statsSection = waradioPage.getStatisticsSection();
    await expect(statsSection.locator('.stat-row span').first()).toContainText('TOTAL CONTACTS');
  });

  test('contact field labels are visible', async () => {
    await expect(page.locator('#contact-call').locator('..').locator('.label')).toHaveText('CALL:');
    await expect(page.locator('#contact-location').locator('..').locator('.label')).toHaveText('LOCATION:');
    await expect(page.locator('#contact-mode').locator('..').locator('.label')).toHaveText('MODE:');
    await expect(page.locator('#contact-band').locator('..').locator('.label')).toHaveText('BAND:');
    await expect(page.locator('#contact-distance').locator('..').locator('.label')).toHaveText('DISTANCE:');
    await expect(page.locator('#contact-grid').locator('..').locator('.label')).toHaveText('GRID:');
  });

  test('my grid input has placeholder', async () => {
    const placeholder = await waradioPage.getMyGridInput().getAttribute('placeholder');
    expect(placeholder).toBe('EN91');
  });

  test('map is responsive', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await expect(waradioPage.getMap()).toBeVisible();
  });

  test('footer version is visible', async () => {
    const footer = page.locator('.footer, footer, .app-footer');
    const footerVisible = await footer.count() > 0;
    
    expect(footerVisible).toBe(true);
  });

  test('page loads without JavaScript errors', async () => {
    const errors = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await waradioPage.load();
    
    const jsErrors = errors.filter(e => !e.includes('net::ERR_'));
    expect(jsErrors.length).toBe(0);
  });

  test('buttons have correct disabled states initially', async () => {
    await expect(waradioPage.getPlayButton()).toBeDisabled();
    await expect(waradioPage.getPauseButton()).toBeDisabled();
    await expect(waradioPage.getResetButton()).toBeDisabled();
  });

  test('all panels are visible', async () => {
    const panels = page.locator('.panel-section');
    await expect(panels).toHaveCount(4);
  });
});
