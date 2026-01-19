/**
 * Shared assertions and helpers for Playwright tests
 * Reduces repetition across test files
 */

const { expect } = require('@playwright/test');

/**
 * Standard mobile viewport size for responsive testing
 */
const MOBILE_VIEWPORT = { width: 375, height: 667 };

/**
 * Standard tablet viewport size
 */
const TABLET_VIEWPORT = { width: 768, height: 1024 };

/**
 * Standard desktop viewport size
 */
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };

/**
 * Common panel titles across apps
 */
const PANEL_TITLES = {
  DATA_INPUT: 'DATA INPUT',
  PLAYBACK_CONTROL: 'PLAYBACK CONTROL',
  STATISTICS: 'STATISTICS',
  CURRENT_CONTACT: 'CURRENT CONTACT',
  DISPLAY_OPTIONS: 'DISPLAY OPTIONS',
};

/**
 * Contact field labels
 */
const CONTACT_LABELS = {
  CALL: 'CALL:',
  LOCATION: 'LOCATION:',
  MODE: 'MODE:',
  BAND: 'BAND:',
  DISTANCE: 'DISTANCE:',
  GRID: 'GRID:',
};

/**
 * Default checkbox states for WARADIO
 */
const WARADIO_CHECKBOX_DEFAULTS = {
  realTime: true,
  slowPlot: false,
  gapDetection: true,
  deriveLocation: true,
  brighterMap: false,
};

/**
 * Default checkbox states for GRID
 */
const GRID_CHECKBOX_DEFAULTS = {
  colorByBand: false,
  brightMap: false,
  showFields: true,
  showFieldLabels: true,
};

/**
 * Default checkbox states for LIVE
 */
const LIVE_CHECKBOX_DEFAULTS = {
  colorByBand: true,
  brightMap: false,
  drawLines: true,
};

/**
 * Assert all contact field labels are visible
 * @param {import('@playwright/test').Page} page
 */
async function assertContactLabelsVisible(page) {
  for (const [name, label] of Object.entries(CONTACT_LABELS)) {
    const locator = page.locator(`#contact-${name.toLowerCase()}`).locator('..').locator('.label');
    await expect(locator).toHaveText(label);
  }
}

/**
 * Assert panel title is visible and has correct text
 * @param {import('@playwright/test').Page} page
 * @param {string} panelSelector - CSS selector for the panel
 * @param {string} expectedTitle
 */
async function assertPanelTitle(page, panelSelector, expectedTitle) {
  const panel = page.locator(panelSelector);
  await expect(panel.locator('.panel-title, .section-title, h2, h3').first()).toHaveText(expectedTitle);
}

/**
 * Assert all WARADIO checkbox default states
 * @param {object} pageObject - Page object with checkbox getters
 */
async function assertWaradioCheckboxDefaults(pageObject) {
  await expect(pageObject.getRealTimeCheckbox()).toBeChecked();
  await expect(pageObject.getSlowPlotCheckbox()).not.toBeChecked();
  await expect(pageObject.getGapDetectionCheckbox()).toBeChecked();
  await expect(pageObject.getDeriveLocationCheckbox()).toBeChecked();
  await expect(pageObject.getBrighterMapCheckbox()).not.toBeChecked();
}

/**
 * Assert all GRID checkbox default states
 * @param {object} pageObject - Page object with checkbox getters
 */
async function assertGridCheckboxDefaults(pageObject) {
  await expect(pageObject.getColorByBandCheckbox()).not.toBeChecked();
  await expect(pageObject.getBrightMapCheckbox()).not.toBeChecked();
  await expect(pageObject.getShowFieldsCheckbox()).toBeChecked();
  await expect(pageObject.getShowFieldLabelsCheckbox()).toBeChecked();
}

/**
 * Assert all LIVE checkbox default states
 * @param {object} pageObject - Page object with checkbox getters
 */
async function assertLiveCheckboxDefaults(pageObject) {
  await expect(pageObject.getColorByBandCheckbox()).toBeChecked();
  await expect(pageObject.getBrightMapCheckbox()).not.toBeChecked();
  await expect(pageObject.getDrawLinesCheckbox()).toBeChecked();
}

/**
 * Assert playback buttons are in correct initial state (disabled)
 * @param {object} pageObject - Page object with button getters
 */
async function assertPlaybackButtonsDisabled(pageObject) {
  await expect(pageObject.getPlayButton()).toBeDisabled();
  await expect(pageObject.getPauseButton()).toBeDisabled();
  await expect(pageObject.getResetButton()).toBeDisabled();
}

/**
 * Assert header and status are visible
 * @param {object} pageObject - Page object with header getters
 * @param {string} expectedHeaderText
 */
async function assertHeaderAndStatus(pageObject, expectedHeaderText) {
  await expect(pageObject.getHeaderTitle()).toHaveText(expectedHeaderText);
  await expect(pageObject.getSystemStatus()).toBeVisible();
}

/**
 * Assert map is visible
 * @param {object} pageObject - Page object with map getter
 */
async function assertMapVisible(pageObject) {
  await expect(pageObject.getMap()).toBeVisible();
}

/**
 * Set mobile viewport and optionally reload page
 * @param {import('@playwright/test').Page} page
 * @param {boolean} reload - Whether to reload after viewport change
 */
async function setMobileViewport(page, reload = false) {
  await page.setViewportSize(MOBILE_VIEWPORT);
  if (reload) {
    await page.reload({ waitUntil: 'networkidle' });
  }
}

/**
 * Set tablet viewport
 * @param {import('@playwright/test').Page} page
 */
async function setTabletViewport(page) {
  await page.setViewportSize(TABLET_VIEWPORT);
}

/**
 * Set desktop viewport
 * @param {import('@playwright/test').Page} page
 */
async function setDesktopViewport(page) {
  await page.setViewportSize(DESKTOP_VIEWPORT);
}

/**
 * Assert all data input elements are visible
 * @param {object} pageObject - Page object with input getters
 */
async function assertDataInputVisible(pageObject) {
  await expect(pageObject.getLoadDemoDataButton()).toBeVisible();
  await expect(pageObject.getMyGridInput()).toBeVisible();
}

/**
 * Assert playback controls are visible
 * @param {object} pageObject - Page object with playback getters
 */
async function assertPlaybackControlsVisible(pageObject) {
  await expect(pageObject.getPlayButton()).toBeVisible();
  await expect(pageObject.getPauseButton()).toBeVisible();
  await expect(pageObject.getResetButton()).toBeVisible();
}

/**
 * Assert footer status elements are visible
 * @param {object} pageObject - Page object with status getters
 */
async function assertFooterStatusVisible(pageObject) {
  await expect(pageObject.getStatusLeft()).toBeVisible();
  await expect(pageObject.getStatusRight()).toBeVisible();
}

/**
 * Assert speed buttons are visible with correct labels
 * @param {object} pageObject - Page object with speed button getters
 */
async function assertSpeedButtonsVisible(pageObject) {
  const speeds = ['0.5', '1', '2', '4'];
  for (const speed of speeds) {
    await expect(pageObject.getSpeedButton(speed)).toHaveText(`${speed}x`);
  }
}

/**
 * Wait for page to be fully loaded (network idle)
 * @param {import('@playwright/test').Page} page
 * @param {number} timeout
 */
async function waitForPageLoad(page, timeout = 30000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Assert element is attached to DOM (exists but may not be visible)
 * @param {import('@playwright/test').Locator} locator
 */
async function assertAttached(locator) {
  await expect(locator).toBeAttached();
}

/**
 * Assert element is not attached (removed from DOM)
 * @param {import('@playwright/test').Locator} locator
 */
async function assertNotAttached(locator) {
  await expect(locator).not.toBeAttached();
}

module.exports = {
  // Viewports
  MOBILE_VIEWPORT,
  TABLET_VIEWPORT,
  DESKTOP_VIEWPORT,

  // Constants
  PANEL_TITLES,
  CONTACT_LABELS,
  WARADIO_CHECKBOX_DEFAULTS,
  GRID_CHECKBOX_DEFAULTS,
  LIVE_CHECKBOX_DEFAULTS,

  // Assertions
  assertContactLabelsVisible,
  assertPanelTitle,
  assertWaradioCheckboxDefaults,
  assertGridCheckboxDefaults,
  assertLiveCheckboxDefaults,
  assertPlaybackButtonsDisabled,
  assertHeaderAndStatus,
  assertMapVisible,
  assertDataInputVisible,
  assertPlaybackControlsVisible,
  assertFooterStatusVisible,
  assertSpeedButtonsVisible,

  // Viewport helpers
  setMobileViewport,
  setTabletViewport,
  setDesktopViewport,

  // General helpers
  waitForPageLoad,
  assertAttached,
  assertNotAttached,
};
