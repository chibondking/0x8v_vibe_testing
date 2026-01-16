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
  WaradioPage.js     # Page object for WARADIO ADIF Log Visualizer
  GridPage.js        # Page object for GRID Square Visualizer
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
npm run test:waradio        # Run WARADIO tests
npm run test:grid           # Run GRID tests
```

## Test Coverage by App

### WARADIO App (ADIF Log Visualizer)

**Total: 75 running tests, 8 skipped**

#### waradio-initial.spec.ts (10 tests)
- **displays WARadio header and system status** - Verifies h1 title "WARadio Contact Visualizer" and system status indicator visibility
- **displays data input section with all elements** - Checks load demo data button and my grid input are visible
- **displays playback controls** - Verifies play, pause, and reset buttons are visible
- **speed defaults to 1x** - Checks default speed is 1 and 1x button has active class
- **checkboxes have correct default states** - Validates REAL TIME, GAP DETECTION, DERIVE LOC checked; SLOW PLOT, BRIGHTER MAP unchecked
- **playback buttons are disabled initially** - Verifies play, pause, reset are disabled before data load
- **displays statistics section** - Checks total, plotted, remaining contacts and time elapsed show zeros
- **displays current contact section** - Validates callsign, location, mode, band, distance, grid show "--" initially
- **displays map with band legend** - Verifies map and band legend container are visible
- **band legend contains all amateur radio bands** - Checks at least 14 legend items for HF bands

#### waradio-playback.spec.ts (9 tests)
- **enables playback buttons after loading demo data** - Play and reset enabled, pause disabled after data load
- **loads demo data and updates statistics** - Validates total contacts > 0, plotted = 0, remaining = total
- **speed is at 4x after change** - Confirms speed change to 4x works
- **clicking play starts playback and plots first contact** - Play disabled, pause enabled, plotted contacts increase
- **map shows markers after playing** - Verifies markers appear on map during playback
- **current contact updates during playback** - Callsign, band, mode update from "--" to actual values
- **clicking pause stops time elapsed** - Plotted count remains constant during pause
- **clicking reset returns to initial state** - Plotted resets to 0, callsign returns to "--"
- **can change playback speed** - Speed can be changed between 2x and 4x during playback

#### waradio-checkboxes.spec.ts (8 tests)
- **toggle real time mode off** - Real time checkbox can be unchecked
- **toggle slow plot mode on** - Slow plot checkbox can be checked
- **toggle gap detection on/off** - Gap detection checkbox toggle works
- **toggle derive location on/off** - Derive location checkbox toggle works
- **toggle brighter map on** - Brighter map checkbox can be checked
- **can change speed during playback** - Speed adjustment works while playing
- **multiple pause/resume cycles work** - Play/pause cycles increment plotted count correctly
- **slow plot mode affects plotting speed** - Slow plot reduces contacts plotted per time unit

#### waradio-map.spec.ts (10 tests)
- **map is visible on page load** - Verifies Leaflet map container renders
- **band legend is visible on page load** - Legend panel is present
- **band legend contains all amateur radio bands** - At least 14 HF bands displayed
- **map shows markers after playback starts** - Contact markers appear during playback
- **map center updates during playback** - Map pans to current contact location
- **can zoom map using controls** - Zoom in/out buttons are functional
- **band legend shows different colors for each band** - Legend items are visible with band colors
- **markers appear at correct geographical locations** - Multiple contacts plotted (5+)
- **map tiles load correctly** - Leaflet tiles render successfully
- **map attribution is present** - OpenStreetMap attribution visible

#### waradio-grid.spec.ts (8 tests)
- **grid input field is visible** - MY GRID input is present
- **grid input accepts valid 4-character grid square** - EM73 accepted correctly
- **grid input accepts valid 6-character grid square** - EM73ab converts to EM73AB
- **grid input converts to uppercase** - en91 becomes EN91
- **grid input has max length of 8** - Length constrained appropriately
- **changing grid affects distance calculation** - Distance updates based on grid input
- **empty grid shows no distance** - Handles empty grid input gracefully
- **valid grid enables distance calculation** - Various valid grids (EM73, FN31, etc.) work

#### waradio-statistics.spec.ts (12 tests)
- **total contacts shows correct count** - Demo data has contacts > 0
- **plotted starts at 0** - Initial plotted count is zero
- **remaining equals total before playback** - Remaining equals total before playing
- **plotted increases during playback** - Plotted count grows during playback
- **remaining decreases as contacts are plotted** - Remaining count decreases
- **plotted + remaining equals total** - Statistics stay consistent
- **time elapsed updates during playback** - Timer increments HH:MM:SS format
- **distance is calculated during playback** - Distance shows positive values
- **reset clears plotted count** - Reset returns plotted to 0
- **reset clears remaining to total** - Reset returns remaining to total
- **reset clears time elapsed** - Reset returns timer to 00:00:00
- **statistics update in real-time during playback** - Plotted increases during playback

#### waradio-uiux.spec.ts (18 tests)
- **page title is correct** - Title contains "WARadio"
- **header contains app name** - Header title visible
- **system status indicator is visible** - Status indicator present
- **data input section title is visible** - "DATA INPUT" panel title correct
- **playback section title is visible** - "PLAYBACK CONTROL" panel title correct
- **statistics section title is visible** - "STATISTICS" panel title correct
- **current contact section title is visible** - "CURRENT CONTACT" panel title correct
- **all button labels are correct** - PLAY, PAUSE, RESET labels verified
- **speed buttons show correct labels** - 0.5x, 1x, 2x, 4x labels correct
- **checkbox labels are visible** - All checkbox labels (REAL TIME, SLOW PLOT, etc.) present
- **statistics labels are visible** - TOTAL CONTACTS label present
- **contact field labels are visible** - CALL, LOCATION, MODE, BAND, DISTANCE, GRID labels correct
- **my grid input has placeholder** - Placeholder shows "EN91"
- **map is responsive** - Map visible on mobile viewport (375x667)
- **footer version is visible** - Footer element present
- **page loads without JavaScript errors** - No JS errors in console
- **buttons have correct disabled states initially** - Play, pause, reset disabled initially
- **all panels are visible** - Four panel sections present

#### waradio-adif-skipped.spec.ts (8 tests - all skipped)
- **can upload ADIF file and update statistics** - (skipped - requires test ADIF file)
- **displays file info after loading ADIF** - (skipped - requires test ADIF file)
- **enables playback after ADIF file upload** - (skipped - requires test ADIF file)
- **can play back ADIF contacts** - (skipped - requires test ADIF file)
- **handles invalid ADIF file gracefully** - (skipped - requires test ADIF file)
- **handles empty ADIF file** - (skipped - requires test ADIF file)
- **ADIF and demo data produce similar playback behavior** - (skipped - requires test ADIF file)
- **MY_GRIDSQUARE from ADIF populates grid input** - (skipped - requires test ADIF file)

---

### GRID App (Grid Square Visualizer)

**Total: ~85 tests across multiple spec files**

#### grid.spec.ts (comprehensive test suite with embedded GridPage class)
- **GRID App - Initial Load** (~20 tests) - Header, system status, data input, display options, statistics, map, footer
- **GRID App - Happy Path** (11 tests) - Demo data loading, button enablement, grid squares on map, toggle functionality, stats popup
- **GRID App - Edge Cases** (~10 tests) - Invalid grid input, special characters, loading overlay, error popup, map resize
- **GRID App - UI/UX** (~20 tests) - Panel titles, button labels, checkbox labels, CRT overlay, VT323 font, mobile responsiveness
- **GRID App - ADIF Loading** (5 tests - all skipped) - ADIF file upload handling (pending manual review)
- **GRID App - Map Features** (~10 tests) - Leaflet integration, zoom controls, grid square rendering, color by band, bright map mode

#### grid-initial.spec.ts (12 tests)
- **displays GRID header and system status** - "GRID SQUARE VISUALIZER" title and status indicator
- **displays WOPR lights** - WOPR lights container visible
- **displays timestamp display** - Timestamp display element present
- **displays data input section with all elements** - Demo data button, ADIF input, my grid input visible
- **displays display options section** - All four checkboxes (color by band, bright map, show fields, field labels) visible
- **checkboxes have correct default states** - Show fields and field labels checked; color by band and bright map unchecked
- **displays statistics section** - Total contacts, unique grids, countries all show 0
- **buttons are disabled initially** - Screenshot and view stats buttons disabled
- **displays map container** - Leaflet map visible
- **map container has correct attributes** - Map has id="map"
- **my grid input has correct default value** - Default value "EN91"
- **my grid input has max length of 4** - Maxlength attribute is 4
- **footer status is visible** - Left and right status bar elements visible

#### grid-happy.spec.ts (11 tests)
- **enables buttons after loading demo data** - Screenshot and view stats buttons become enabled
- **loads demo data and updates statistics** - Total, grids, and countries all greater than 0
- **grids are displayed on map** - Grid squares visible on map
- **can toggle color by band** - Color by band checkbox toggles correctly
- **can toggle bright map** - Bright map checkbox toggles correctly
- **can toggle show fields** - Show fields checkbox toggles correctly
- **clicking view stats opens popup** - Stats popup becomes visible
- **stats popup contains data** - Popup shows GRID STATISTICS, Total Contacts, Unique Grids, Countries
- **can close stats popup** - Stats popup can be closed
- **screenshot button is clickable** - Screenshot button is enabled and clickable
- **map has correct bounds after loading** - Map bounds are valid (north > south, east > west)

---

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
- ADIF file upload tests (require actual test ADIF files and manual review)
- ARIA snapshot tests (pending visual regression testing configuration)

---

## Page Objects

### WaradioPage.js

Page object for WARADIO ADIF Log Visualizer. Provides methods for:

- **Navigation**: `load()`, `disableRealTimeMode()`, `loadDemoData()`
- **Playback Controls**: `clickPlay()`, `clickPause()`, `clickReset()`, `setSpeed(speed)`
- **Statistics**: `getStatistics()`, `getTotalContacts()`, `getPlottedContacts()`, `getRemainingContacts()`, `getTimeElapsed()`
- **Current Contact**: `getCurrentContact()`, `getContactCallsign()`, `getContactLocation()`, `getContactMode()`, `getContactBand()`, `getContactDistance()`, `getContactGrid()`
- **Checkboxes**: `getRealTimeCheckbox()`, `getGapDetectionCheckbox()`, `getDeriveLocationCheckbox()`, `getSlowPlotCheckbox()`, `getBrighterMapCheckbox()`
- **Input Fields**: `getMyGridInput()`, `getAdifFileInput()`
- **Map Elements**: `getMap()`, `getBandLegend()`

### GridPage.js

Page object for GRID Square Visualizer. Provides methods for:

- **Navigation**: `load()`, `loadDemoData()`, `loadDemoDataMobile()`, `waitForDataLoaded()`
- **Header Elements**: `getHeaderTitle()`, `getSystemStatus()`, `getTimestampDisplay()`, `getWoprLights()`
- **Data Input**: `getAdifFileInput()`, `getLoadDemoDataButton()`, `getFileInfo()`, `getMyGridInput()`
- **Display Options**: `getColorByBandCheckbox()`, `getBrightMapCheckbox()`, `getShowFieldsCheckbox()`, `getShowFieldLabelsCheckbox()`, `toggleBrightMap()`, `toggleColorByBand()`
- **Statistics**: `getStatistics()`, `getTotalContacts()`, `getUniqueGrids()`, `getCountries()`, `openStats()`, `closeStats()`
- **Map Elements**: `getMap()`, `getMapContainer()`, `getGridSquares()`, `getGridSquareCount()`, `getFieldLabels()`
- **Actions**: `setMyGrid()`, `getScreenshotButton()`, `getViewStatsButton()`, `getStatsPopup()`

---

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
