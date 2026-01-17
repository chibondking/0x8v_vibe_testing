# Test Scenarios & Coverage Documentation

This document provides an overview of all test scenarios, what's covered, what's missing, and how to use ARIA snapshot tests for UI regression detection.

## Test Summary

| App | Spec Files | Tests | Status |
|-----|-----------|-------|--------|
| Vibe (Landing) | vibe.spec.ts | 6 | ✅ Complete |
| WARADIO | waradio-*.spec.ts | 81 | ✅ Complete (8 skipped for ADIF) |
| GRID | grid*.spec.ts | ~100 | ✅ Complete (5 skipped for ADIF) |
| LIVE | live.spec.ts | 19 | ✅ Complete |
| Broken Links | broken-links.spec.ts | 4 | ✅ Complete |
| **ARIA Snapshots** | aria-snapshots.spec.ts | 4 | 🆕 New |

**Total: ~249 tests (230 running, 19 skipped)**

---

## What's Covered

### Vibe Landing Page (vibe.spec.ts)
- ✅ Header and status verification
- ✅ App cards with correct links
- ✅ ARIA snapshot structure
- ✅ All app links accessible
- ✅ Section titles visible
- ✅ Footer elements present

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

### LIVE App (live.spec.ts)
- ✅ Initial load (header, status, map, filters, options)
- ✅ Functionality (connect button, callsign input, filters)
- ✅ UI/UX (no JS errors, footer, mobile responsive, defaults)

---

## What's Missing / Planned

### ARIA Snapshot Testing - DEPRECATED

Full ARIA snapshots were attempted but found unsuitable because:

1. **Pages have dynamic content** - Timestamps, versions, spot counts change on every run
2. **False positives** - Any UI update (even a version bump) would fail tests
3. **Maintenance burden** - Would require constant snapshot updates

**Current Approach:** Instead of full snapshots, we use targeted assertions:

```typescript
// vibe.spec.ts - Check structure without exact snapshot
test('aria snapshot has expected structure', async () => {
  const snapshot = await page.locator('body').ariaSnapshot();
  expect(snapshot).toContain('HAMRAD INTERFACE');
  expect(snapshot).toContain('WARADIO');
  expect(snapshot).toContain('GRID');
  expect(snapshot).toContain('LIVE');
});
```

This approach:
- ✅ Detects missing major UI elements
- ✅ Ignores dynamic content
- ✅ Doesn't require snapshot maintenance
- ⚠️ Won't catch subtle layout changes

---

## Future Enhancements (If Needed)

If visual regression testing is needed later, consider:

1. **Playwright Visual Snapshots** (requires approved UI changes)
   ```typescript
   test('matches visual snapshot', async () => {
     await expect(page).toHaveScreenshot('app-page.png');
   });
   ```

2. **Percy or Chromatic** - Full visual regression SaaS

3. **Storybook** - Component-level visual testing

---

## ARIA Snapshot Testing Guide

### Why ARIA Snapshots?

ARIA snapshots capture the accessibility tree structure of a page. When UI changes:
1. **Headings** are added/removed/reordered
2. **Landmarks** (banner, main, complementary, contentinfo) change
3. **Interactive elements** (buttons, links, checkboxes) are added/removed
4. **Form controls** (textboxes, checkboxes) change state

This catches regressions that functional tests might miss.

### How It Works

```typescript
test('matches page ARIA snapshot', async () => {
  const snapshot = await page.locator('body').ariaSnapshot();
  expect(snapshot).toMatchInlineSnapshot(`
    - banner:
      - heading "APP NAME" [level=1]
      ...
  `);
});
```

### Running ARIA Snapshot Tests

```bash
# Run all ARIA snapshot tests
npm run test:aria

# Run specific app
npx playwright test tests/aria-snapshots.spec.ts --grep "WARADIO"

# Update snapshots after approved UI changes
npx playwright test tests/aria-snapshots.spec.ts --update-snapshots
```

### When Snapshots Fail

If an ARIA snapshot test fails:

1. **Check if the change was intentional**
   - Did a developer intentionally add/remove UI elements?
   - Was this a design update?

2. **Review the diff**
   - The test output shows exactly what changed
   - Compare old vs new structure

3. **Update if approved**
   ```bash
   npx playwright test tests/aria-snapshots.spec.ts --update-snapshots
   ```

4. **Document the change**
   - Update this document
   - Note the change in commit message

---

## Test File Structure

```
tests/
├── aria-snapshots.spec.ts      # ARIA baseline snapshots (NEW)
├── broken-links.spec.ts        # HTTP link checking
├── vibe.spec.ts                # Landing page tests
├── live.spec.ts                # LIVE FT8 Map tests
├── grid-initial.spec.ts        # GRID initial load
├── grid-happy.spec.ts          # GRID happy path
├── grid-edge.spec.ts           # GRID edge cases
├── grid-uiux.spec.ts           # GRID UI/UX
├── grid.spec.ts                # GRID comprehensive
├── waradio-initial.spec.ts     # WARADIO initial load
├── waradio-playback.spec.ts    # WARADIO playback
├── waradio-checkboxes.spec.ts  # WARADIO checkboxes
├── waradio-map.spec.ts         # WARADIO map
├── waradio-grid.spec.ts        # WARADIO grid input
├── waradio-statistics.spec.ts  # WARADIO statistics
├── waradio-uiux.spec.ts        # WARADIO UI/UX
└── waradio-adif-skipped.spec.ts # WARADIO ADIF (skipped)
```

---

## Adding New Test Scenarios

### 1. Functional Test (using Page Objects)

```typescript
// tests/new-feature.spec.ts
const { test, expect } = require('@playwright/test');
const { createWaradioPage } = require('../pages');

test.describe('New Feature', () => {
  let waradioPage;

  test.beforeEach(async ({ page }) => {
    waradioPage = createWaradioPage(page);
    await waradioPage.load();
  });

  test('does something', async () => {
    // Test implementation
  });
});
```

### 2. ARIA Snapshot Test

```typescript
// Add to tests/aria-snapshots.spec.ts
test.describe('ARIA Snapshots - App Name', () => {
  let page;

  test.beforeAll(async () => {
    const browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto('https://app.0x8v.io', { waitUntil: 'networkidle' });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('matches app ARIA snapshot', async () => {
    const snapshot = await page.locator('body').ariaSnapshot();
    expect(snapshot).toMatchInlineSnapshot(`...`);
  });
});
```

---

## Best Practices

### 1. Use Page Objects
All tests should use page objects from `pages/` directory for maintainability.

### 2. Add ARIA Snapshots for New Pages
When adding a new app/page, create an ARIA snapshot test:
```typescript
test('matches page ARIA snapshot', async () => {
  const snapshot = await page.locator('body').ariaSnapshot();
  expect(snapshot).toMatchInlineSnapshot(`- banner:...`);
});
```

### 3. Handle Dynamic Content
For pages with dynamic content (timestamps, spot counts):
```typescript
test('matches page ARIA snapshot (dynamic content)', async () => {
  const snapshot = await page.locator('body').ariaSnapshot();
  // Use regex for dynamic values
  expect(snapshot).toMatch(/TIMESTAMP: \d{2}:\d{2}:\d{2}/);
});
```

### 4. Skip ADIF Tests When Needed
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

### ARIA Snapshot Mismatches
- Run with `--update-snapshots` if changes are intentional
- Check for async content that hasn't loaded
- Verify page is in expected state

### Page Object Methods Not Found
- Check `pages/index.js` exports the page object
- Verify class extends `BasePage`
- Ensure `load()` method navigates correctly

---

## References

- [Playwright ARIA Snapshots](https://playwright.dev/docs/api/class-locator#locator-aria-snapshot)
- [Page Object Model Pattern](https://playwright.dev/docs/test-pom)
- [Visual Regression Testing](https://playwright.dev/docs/test-snapshots)
