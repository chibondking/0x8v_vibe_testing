# Test Scenarios & Coverage Documentation

This document provides an overview of all test scenarios, what's covered, what's missing, and how tests are structured.

## Test Summary

| App | Spec Files | Tests | Status |
|-----|-----------|-------|--------|
| Vibe (Landing) | vibe.spec.ts | 15 | ✅ Complete |
| WARADIO | waradio-*.spec.ts | 82 | ✅ Complete (11 skipped for ADIF) |
| GRID | grid*.spec.ts | ~113 | ✅ Complete (18 skipped) |
| LIVE | live.spec.ts | 35 | ✅ Complete (2 skipped) |
| Broken Links | broken-links.spec.ts | 4 | ✅ Complete |

**Total: ~258 tests (223 running, 35 skipped)**

---

## What's Covered

### Vibe Landing Page (vibe.spec.ts)
- ✅ Header and status verification
- ✅ App cards with correct links
- ✅ ARIA snapshot structure
- ✅ All app links accessible
- ✅ Section titles visible
- ✅ Footer elements present
- ✅ Stress tests for edge cases

### LIVE App (live.spec.ts)
- ✅ Initial load (header, status, map, filters, options)
- ✅ Functionality (connect button, callsign input, filters)
- ✅ UI/UX (no JS errors, footer, mobile responsive, defaults)
- ✅ **My Call Fuzz Tests** - Comprehensive callsign validation:
  - Basic US callsigns (WT2P, WB9ZZZ, K1ABC, etc.)
  - Callsigns with numbers (P40XA, 3Z9X, 4U1ITU, etc.)
  - Callsigns with slashes (P4/WT2P, G4DIY/P, W1ABC/MM)
  - Callsigns with dashes/SSID (WT2P-9, W1ABC-4, LA3YY-15)
  - European callsigns (DL1ABS, G4DIY, PA1TT, etc.)
  - Special prefixes (4U1ITU, ZL9DX, VK0IR, etc.)
  - Short callsigns and combined formats
- ✅ **Live Feed Tests** - Feed connectivity and UI stability:
  - Connect/disconnect button functionality
  - Map visibility during feed
  - Controls remain visible during feed
  - Multiple connect/disconnect cycles
  - Page functionality preserved during toggle

### WARADIO App (waradio-*.spec.ts)
- ✅ Initial load (header, status, controls, checkboxes, statistics)
- ✅ Playback functionality (play, pause, reset, speed changes)
- ✅ Checkbox interactions (real time, slow plot, gap detection, etc.)
- ✅ Map features (markers, zoom, band legend)
- ✅ Grid input validation
- ✅ Statistics tracking during playback
- ✅ UI/UX (panel titles, labels, fonts, mobile responsive)
- ⏭️ ADIF file upload (requires test files)

### GRID App (grid*.spec.ts)
- ✅ Initial load (header, WOPR lights, data input, display options)
- ✅ Happy path (demo data, toggles, stats popup)
- ✅ Edge cases (invalid input, special characters, loading states)
- ✅ UI/UX (CRT overlay, VT323 font, mobile responsive)
- ✅ Map features (zoom, grid squares, color by band)
- ⏭️ ADIF file upload (requires test files)

---

## Test Utilities

### Shared Browser Setup (`tests/test-utils.js`)

Browser lifecycle management is DRY via shared utilities:

```javascript
const { createTestSuite } = require('./test-utils');

const liveContext = createTestSuite({
  pageName: 'Live',
  createPageObject: createLivePage,
});

test.describe('Feature', () => {
  test.beforeAll(liveContext.beforeAll);
  test.afterAll(liveContext.afterAll);
  test.beforeEach(liveContext.beforeEach);

  test('test name', async () => {
    const livePage = liveContext.getPageObject();
    // Test implementation
  });
});
```

**Available functions:**
- `createBrowser(options)` - Launches browser with headless option
- `closeBrowser(page, browser)` - Cleans up browser/page
- `createTestSuite(options)` - Creates reusable test context
- `createTestContext(options)` - Alternative context creator
- `withContext(options)` - Wrapper for context management

### Shared Assertions (`tests/assertions.js`)

Common assertions and viewport constants for DRY tests:

```javascript
const {
  MOBILE_VIEWPORT,
  TABLET_VIEWPORT,
  DESKTOP_VIEWPORT,
  assertHeaderAndStatus,
  assertMapVisible,
  assertDataInputVisible,
  assertFooterStatusVisible,
  assertWaradioCheckboxDefaults,
  assertGridCheckboxDefaults,
  assertLiveCheckboxDefaults,
  setMobileViewport,
  setDesktopViewport,
} = require('./assertions');
```

**Viewport Constants:**
- `MOBILE_VIEWPORT` = `{ width: 375, height: 667 }`
- `TABLET_VIEWPORT` = `{ width: 768, height: 1024 }`
- `DESKTOP_VIEWPORT` = `{ width: 1920, height: 1080 }`

**Available assertions:**
- `assertHeaderAndStatus(pageObject, expectedHeader)` - Assert header text and status visibility
- `assertMapVisible(pageObject)` - Assert map is visible
- `assertDataInputVisible(pageObject)` - Assert demo data button and grid input visible
- `assertFooterStatusVisible(pageObject)` - Assert left and right status elements visible
- `assertWaradioCheckboxDefaults(pageObject)` - Assert WARADIO checkbox default states
- `assertGridCheckboxDefaults(pageObject)` - Assert GRID checkbox default states
- `assertLiveCheckboxDefaults(pageObject)` - Assert LIVE checkbox default states
- `assertPlaybackButtonsDisabled(pageObject)` - Assert play/pause/reset buttons disabled
- `assertContactLabelsVisible(page)` - Assert all contact field labels visible
- `assertPanelTitle(page, panelSelector, expectedTitle)` - Assert panel title text
- `assertPlaybackControlsVisible(pageObject)` - Assert playback buttons visible
- `assertSpeedButtonsVisible(pageObject)` - Assert speed buttons (0.5x, 1x, 2x, 4x) visible
- `setMobileViewport(page, reload)` - Set mobile viewport, optionally reload
- `setTabletViewport(page)` - Set tablet viewport
- `setDesktopViewport(page)` - Set desktop viewport
- `waitForPageLoad(page, timeout)` - Wait for network idle
- `assertAttached(locator)` - Assert element exists in DOM
- `assertNotAttached(locator)` - Assert element removed from DOM

---

## Test File Structure

```
tests/
├── test-utils.js            # Shared browser/page utilities
├── assertions.js            # Shared assertions and viewport constants (NEW)
├── aria-snapshots.spec.ts   # ARIA baseline snapshots (if needed)
├── broken-links.spec.ts     # HTTP link checking
├── vibe.spec.ts             # Landing page tests (uses test-utils)
├── live.spec.ts             # LIVE FT8 Map tests (uses test-utils)
├── grid-initial.spec.ts     # GRID initial load (uses test-utils)
├── grid-happy.spec.ts       # GRID happy path (uses test-utils)
├── grid-edge.spec.ts        # GRID edge cases (uses test-utils)
├── grid-uiux.spec.ts        # GRID UI/UX (uses test-utils)
├── grid.spec.ts             # GRID comprehensive
├── waradio-initial.spec.ts  # WARADIO initial load (uses test-utils)
├── waradio-playback.spec.ts # WARADIO playback (uses test-utils)
├── waradio-checkboxes.spec.ts  # WARADIO checkboxes (uses test-utils)
├── waradio-map.spec.ts      # WARADIO map (uses test-utils)
├── waradio-grid.spec.ts     # WARADIO grid input (uses test-utils)
├── waradio-statistics.spec.ts  # WARADIO statistics (uses test-utils)
├── waradio-uiux.spec.ts     # WARADIO UI/UX (uses test-utils)
└── waradio-adif-skipped.spec.ts # WARADIO ADIF (skipped)
```

---

## Page Objects (TypeScript)

All page objects are written in TypeScript (.ts) with JSDoc annotations:

```typescript
/** @returns {import('@playwright/test').Locator} */
getHeaderTitle() {
  return this.page.locator('h1');
}
```

### LivePage.ts - My Call Fuzz Testing

The LIVE app includes comprehensive My Call input fuzz testing:

```typescript
test('accepts basic US callsigns', async () => {
  const callsigns = ['WT2P', 'WB9ZZZ', 'K1ABC', 'N3XYZ', 'AA9SS'];
  for (const callsign of callsigns) {
    await livePage.setMyCall(callsign);
    expect(await livePage.getMyCallInput().inputValue()).toBe(callsign);
  }
});

test('accepts callsigns with dashes for SSID', async () => {
  const callsigns = ['WT2P-9', 'W1ABC-4', 'K1XYZ-1', 'DL5YBR-7', 'LA3YY-15'];
  // ...
});
```

**Valid Callsign Patterns:**
- Basic: `WT2P`, `WB9ZZZ`, `K1ABC`
- With numbers: `P40XA`, `3Z9X`, `4U1ITU`
- With slash: `P4/WT2P`, `G4DIY/P`, `W1ABC/MM`
- With dash/SSID: `WT2P-9`, `W1ABC-4`, `LA3YY-15`
- European: `DL1ABS`, `G4DIY`, `PA1TT`, `OH2ZZ`

---

## Adding New Test Scenarios

### 1. Using Test Utilities (Recommended)

```javascript
const { test, expect } = require('@playwright/test');
const { createNewPage } = require('../pages');
const { createTestSuite } = require('./test-utils');
const {
  assertHeaderAndStatus,
  assertMapVisible,
  MOBILE_VIEWPORT,
  DESKTOP_VIEWPORT,
} = require('./assertions');

const newContext = createTestSuite({
  pageName: 'NewFeature',
  createPageObject: createNewPage,
});

test.describe('New Feature', () => {
  test.beforeAll(newContext.beforeAll);
  test.afterAll(newContext.afterAll);
  test.beforeEach(newContext.beforeEach);

  test('does something', async () => {
    const newPage = newContext.getPageObject();
    // Use shared assertions
    await assertHeaderAndStatus(newPage, 'Expected Header');
  });
});

test.describe('New Feature @stress', () => {
  let page;

  test.beforeAll(async () => {
    const { browser } = await require('./test-utils').createBrowser();
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    if (page) await page.close();
  });

  test('handles viewport changes @stress', async () => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    // ...
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });
});
```

### 2. Page Object Method Pattern

Add methods to page objects for reusable functionality:

```typescript
// pages/LivePage.ts
/**
 * @param {string} callsign
 * @returns {Promise<LivePage>}
 */
async setMyCall(callsign) {
  await this.getMyCallInput().fill(callsign);
  return this;
}
```

### 3. Fuzz Testing Pattern

For input validation tests, use parameterized testing:

```typescript
test('accepts valid formats', async () => {
  const validFormats = [
    'WT2P',      // Basic
    'P40XA',     // With number
    'P4/WT2P',   // With prefix
    'WT2P-9',    // With SSID
  ];
  for (const format of validFormats) {
    await livePage.setMyCall(format);
    expect(await livePage.getMyCallInput().inputValue()).toBe(format);
  }
});
```

---

## Best Practices

### 1. Use Test Utilities
Always use `createTestSuite` for browser lifecycle management to reduce boilerplate.

### 2. Use Shared Assertions
Use `assertions.js` for common assertions:
```javascript
const {
  assertHeaderAndStatus,
  assertMapVisible,
  assertDataInputVisible,
  MOBILE_VIEWPORT,
  DESKTOP_VIEWPORT,
} = require('./assertions');
```

### 3. Use Page Objects
All tests should use page objects from `pages/` directory for maintainability.

### 4. Add JSDoc Types
Type your page objects for IDE support:
```typescript
/** @returns {import('@playwright/test').Locator} */
getButton() { return this.page.locator('#btn'); }
```

### 5. Parameterize Fuzz Tests
Use arrays for multiple test cases to keep tests DRY.

### 6. Skip ADIF Tests When Needed
ADIF upload tests require actual test files:
```typescript
test('can upload ADIF file', async () => {
  test.skip(); // Remove when test ADIF files are available
});
```

---

## Troubleshooting

### Tests Timing Out
- Increase timeout: `test.describe('suite', { timeout: 120000 })`
- Use explicit waits instead of `waitForTimeout`

### Page Object Methods Not Found
- Check `pages/index.js` exports the page object
- Verify class extends `BasePage`
- Ensure `load()` method navigates correctly

### TypeScript Errors in Page Objects
- Add JSDoc annotations for IDE support
- Use `@typedef` for complex types
- Check `tsconfig.json` includes pages directory

---

## References

- [Playwright Test](https://playwright.dev/docs/test-intro)
- [Page Object Model](https://playwright.dev/docs/test-pom)
- [TypeScript in Playwright](https://playwright.dev/docs/test-typescript)
