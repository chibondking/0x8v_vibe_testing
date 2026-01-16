# Test Data Directory

This directory contains test ADIF files for WARADIO testing.

## File Structure

```
test-data/
├── README.md              # This file
└── test-contacts.adi      # Sample ADIF file with 10 test contacts
```

## test-contacts.adi

Sample ADIF file containing 10 contacts across different bands and modes:

| Callsign | Band | Mode | Grid Square |
|----------|------|------|-------------|
| N4XYZ | 20M | FT8 | EM73 |
| W1AW | 40M | SSB | FN31 |
| KC2L | 15M | FT8 | FN12AB |
| KD8ABC | 10M | FT8 | EN72 |
| VE3X | 80M | CW | FN03 |
| VE1ABC | 160M | FT8 | FN74IR |
| LU1 | 12M | FT8 | GF05 |
| PY1ZZZ | 17M | FT8 | GG80AB |
| ZL3X | 6M | FT8 | RE78LX |
| VK3 | 2M | FT8 | QF22PG |

## Adding More Test Data

To add more test contacts:
1. Copy the format above
2. Include required fields: CALL, BAND, MODE, FREQ, GRIDSQUARE, DATE, TIME
3. End file with `END` on a new line

## Usage in Tests

```javascript
const adifPath = path.join(__dirname, '../test-data/test-contacts.adi');
await page.setInputFiles('#adif-file', adifPath);
```
