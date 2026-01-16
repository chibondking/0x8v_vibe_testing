# Playwright Link Tests for 0x8v.io

This project contains automated tests to check for broken links on the 0x8v.io website and its associated applications.

## Architecture

Uses **Page Object Model (POM)** pattern for reusability and maintainability.

```
config/
  index.js           # Centralized configuration
pages/
  BasePage.js        # Base page object with common methods
  LandingPage.js     # Page object for landing pages
  AppPage.js         # Page object for application pages
  index.js           # Page factory
tests/
  broken-links.test.js  # Legacy JS test for broken links
  vibe.spec.ts          # Playwright test with assertions
snapshots/              # Test snapshots
```

## Configuration

All URLs and apps are configured in `config/index.js`:

```javascript
CONFIG = {
  baseUrl: 'https://vibe.0x8v.io',
  apps: [
    { name: 'live', path: '/', description: 'FT8 Live Map' },
    { name: 'grid', path: '/', description: 'Grid Square Visualizer' },
    { name: 'waradio', path: '/', description: 'ADIF Log Visualizer' },
  ],
  skipPatterns: {
    anchors: ['#'],
    externalDomains: ['leafletjs.com', 'openstreetmap.org', 'carto.com'],
  },
};
```

To add/remove apps, simply edit the `apps` array in `config/index.js`.

## Applications Tested

- **LIVE** - FT8 Live Map (https://live.0x8v.io)
- **GRID** - Grid Square Visualizer (https://grid.0x8v.io)
- **WARADIO** - ADIF Log Visualizer (https://waradio.0x8v.io)

## Running Tests

```bash
npm test                    # Run all tests
npm run test:playwright     # Run Playwright tests with assertions
npm run test:vibe           # Run only vibe page tests
npm run test:broken-links   # Run broken links check
npm run test:headed         # Run tests in headed mode
```

## Test Coverage

### vibe.spec.ts (Playwright with Assertions)

- **has correct heading and status** - Verifies h1 title and status text
- **has all app cards with correct links** - Checks card count and href attributes
- **aria snapshot has expected structure** - Validates ARIA landmarks and content
- **all app links are accessible** - Verifies links are visible and enabled
- **section titles are visible** - Checks section title text

### broken-links.test.js (Legacy)

- Landing page app links HTTP status check
- All internal links on each app page
- Console errors (excluding network errors and favicon)

### What's Skipped

- Anchor links (URLs ending with `#`)
- External dependencies (Leaflet, OpenStreetMap, CARTO attribution links)

## Adding New Tests

### Adding Playwright Tests

Create new `.spec.ts` files in `tests/`:

```typescript
const { test, expect } = require('@playwright/test');

test.describe('New Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('https://vibe.0x8v.io');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Adding Page Objects

Extend `BasePage` in `pages/`:

```javascript
const BasePage = require('./BasePage');

class NewPage extends BasePage {
  async specificMethod() {
    // Custom methods
  }
}

module.exports = NewPage;
```

## Requirements

- Node.js 12+
- @playwright/test
