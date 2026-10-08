/**
 * Shared assertions and helpers for Playwright tests
 * Reduces repetition across test files
 */

import { expect, type Locator, type Page } from '@playwright/test';

/*
 * Structural types for the page-object getters each assertion needs, so any
 * page object with the right getters (WARADIO, GRID or LIVE) can be passed in.
 */
type Getter = () => Locator;

export interface WaradioCheckboxes {
  getRealTimeCheckbox: Getter;
  getSlowPlotCheckbox: Getter;
  getGapDetectionCheckbox: Getter;
  getDeriveLocationCheckbox: Getter;
  getBrighterMapCheckbox: Getter;
}

export interface GridCheckboxes {
  getColorByBandCheckbox: Getter;
  getBrightMapCheckbox: Getter;
  getShowFieldsCheckbox: Getter;
  getShowFieldLabelsCheckbox: Getter;
}

export interface LiveCheckboxes {
  getColorByBandCheckbox: Getter;
  getBrightMapCheckbox: Getter;
  getDrawLinesCheckbox: Getter;
}

export interface PlaybackControls {
  getPlayButton: Getter;
  getPauseButton: Getter;
  getResetButton: Getter;
}

export interface HeaderAndStatus {
  getHeaderTitle: Getter;
  getSystemStatus: Getter;
}

export interface HasMap {
  getMap: Getter;
}

export interface DataInput {
  getLoadDemoDataButton: Getter;
  getMyGridInput: Getter;
}

export interface FooterStatus {
  getStatusLeft: Getter;
  getStatusRight: Getter;
}

export interface SpeedButtons {
  getSpeedButton: (speed: string) => Locator;
}

/**
 * Standard mobile viewport size for responsive testing
 */
export const MOBILE_VIEWPORT = { width: 375, height: 667 };

/**
 * Standard tablet viewport size
 */
export const TABLET_VIEWPORT = { width: 768, height: 1024 };

/**
 * Standard desktop viewport size
 */
export const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };

/**
 * Common panel titles across apps
 */
export const PANEL_TITLES = {
  DATA_INPUT: 'DATA INPUT',
  PLAYBACK_CONTROL: 'PLAYBACK CONTROL',
  STATISTICS: 'STATISTICS',
  CURRENT_CONTACT: 'CURRENT CONTACT',
  DISPLAY_OPTIONS: 'DISPLAY OPTIONS',
};

/**
 * Contact field labels
 */
export const CONTACT_LABELS = {
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
export const WARADIO_CHECKBOX_DEFAULTS = {
  realTime: true,
  slowPlot: false,
  gapDetection: true,
  deriveLocation: true,
  brighterMap: false,
};

/**
 * Default checkbox states for GRID
 */
export const GRID_CHECKBOX_DEFAULTS = {
  colorByBand: false,
  brightMap: false,
  showFields: true,
  showFieldLabels: true,
};

/**
 * Default checkbox states for LIVE
 */
export const LIVE_CHECKBOX_DEFAULTS = {
  colorByBand: true,
  brightMap: false,
  drawLines: true,
};

/**
 * Assert all contact field labels are visible
 */
export async function assertContactLabelsVisible(page: Page): Promise<void> {
  for (const [name, label] of Object.entries(CONTACT_LABELS)) {
    const locator = page.locator(`#contact-${name.toLowerCase()}`).locator('..').locator('.label');
    await expect(locator).toHaveText(label);
  }
}

/**
 * Assert panel title is visible and has correct text
 */
export async function assertPanelTitle(page: Page, panelSelector: string, expectedTitle: string): Promise<void> {
  const panel = page.locator(panelSelector);
  await expect(panel.locator('.panel-title, .section-title, h2, h3').first()).toHaveText(expectedTitle);
}

/**
 * Assert all WARADIO checkbox default states
 */
export async function assertWaradioCheckboxDefaults(pageObject: WaradioCheckboxes): Promise<void> {
  await expect(pageObject.getRealTimeCheckbox()).toBeChecked();
  await expect(pageObject.getSlowPlotCheckbox()).not.toBeChecked();
  await expect(pageObject.getGapDetectionCheckbox()).toBeChecked();
  await expect(pageObject.getDeriveLocationCheckbox()).toBeChecked();
  await expect(pageObject.getBrighterMapCheckbox()).not.toBeChecked();
}

/**
 * Assert all GRID checkbox default states
 */
export async function assertGridCheckboxDefaults(pageObject: GridCheckboxes): Promise<void> {
  await expect(pageObject.getColorByBandCheckbox()).not.toBeChecked();
  await expect(pageObject.getBrightMapCheckbox()).not.toBeChecked();
  await expect(pageObject.getShowFieldsCheckbox()).toBeChecked();
  await expect(pageObject.getShowFieldLabelsCheckbox()).toBeChecked();
}

/**
 * Assert all LIVE checkbox default states
 */
export async function assertLiveCheckboxDefaults(pageObject: LiveCheckboxes): Promise<void> {
  await expect(pageObject.getColorByBandCheckbox()).toBeChecked();
  await expect(pageObject.getBrightMapCheckbox()).not.toBeChecked();
  await expect(pageObject.getDrawLinesCheckbox()).toBeChecked();
}

/**
 * Assert playback buttons are in correct initial state (disabled)
 */
export async function assertPlaybackButtonsDisabled(pageObject: PlaybackControls): Promise<void> {
  await expect(pageObject.getPlayButton()).toBeDisabled();
  await expect(pageObject.getPauseButton()).toBeDisabled();
  await expect(pageObject.getResetButton()).toBeDisabled();
}

/**
 * Assert header and status are visible
 */
export async function assertHeaderAndStatus(pageObject: HeaderAndStatus, expectedHeaderText: string): Promise<void> {
  await expect(pageObject.getHeaderTitle()).toHaveText(expectedHeaderText);
  await expect(pageObject.getSystemStatus()).toBeVisible();
}

/**
 * Assert map is visible
 */
export async function assertMapVisible(pageObject: HasMap): Promise<void> {
  await expect(pageObject.getMap()).toBeVisible();
}

/**
 * Set mobile viewport and optionally reload page
 */
export async function setMobileViewport(page: Page, reload = false): Promise<void> {
  await page.setViewportSize(MOBILE_VIEWPORT);
  if (reload) {
    await page.reload({ waitUntil: 'networkidle' });
  }
}

/**
 * Set tablet viewport
 */
export async function setTabletViewport(page: Page): Promise<void> {
  await page.setViewportSize(TABLET_VIEWPORT);
}

/**
 * Set desktop viewport
 */
export async function setDesktopViewport(page: Page): Promise<void> {
  await page.setViewportSize(DESKTOP_VIEWPORT);
}

/**
 * Assert all data input elements are visible
 */
export async function assertDataInputVisible(pageObject: DataInput): Promise<void> {
  await expect(pageObject.getLoadDemoDataButton()).toBeVisible();
  await expect(pageObject.getMyGridInput()).toBeVisible();
}

/**
 * Assert playback controls are visible
 */
export async function assertPlaybackControlsVisible(pageObject: PlaybackControls): Promise<void> {
  await expect(pageObject.getPlayButton()).toBeVisible();
  await expect(pageObject.getPauseButton()).toBeVisible();
  await expect(pageObject.getResetButton()).toBeVisible();
}

/**
 * Assert footer status elements are visible
 */
export async function assertFooterStatusVisible(pageObject: FooterStatus): Promise<void> {
  await expect(pageObject.getStatusLeft()).toBeVisible();
  await expect(pageObject.getStatusRight()).toBeVisible();
}

/**
 * Assert speed buttons are visible with correct labels
 */
export async function assertSpeedButtonsVisible(pageObject: SpeedButtons): Promise<void> {
  const speeds = ['0.5', '1', '2', '4'];
  for (const speed of speeds) {
    await expect(pageObject.getSpeedButton(speed)).toHaveText(`${speed}x`);
  }
}

/**
 * Wait for page to be fully loaded (network idle)
 */
export async function waitForPageLoad(page: Page, timeout = 30000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Assert element is attached to DOM (exists but may not be visible)
 */
export async function assertAttached(locator: Locator): Promise<void> {
  await expect(locator).toBeAttached();
}

/**
 * Assert element is not attached (removed from DOM)
 */
export async function assertNotAttached(locator: Locator): Promise<void> {
  await expect(locator).not.toBeAttached();
}
