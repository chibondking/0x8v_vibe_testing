const getBaseUrl = () => process.env.BASE_URL || 'https://vibe.0x8v.io';
const getDomain = () => process.env.DOMAIN || '0x8v.io';

const CONFIG = {
  baseUrl: getBaseUrl(),
  domain: getDomain(),
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

function getAppUrl(appName) {
  return `https://${appName}.${CONFIG.domain}`;
}

function getLandingPageUrl() {
  return CONFIG.baseUrl;
}

function getAppsConfig() {
  return CONFIG.apps;
}

function shouldSkipLink(url) {
  if (CONFIG.skipPatterns.anchors.some(anchor => url.endsWith(anchor))) {
    return { skipped: true, reason: 'anchor' };
  }
  if (CONFIG.skipPatterns.externalDomains.some(domain => url.includes(domain))) {
    return { skipped: true, reason: 'external' };
  }
  return { skipped: false, reason: null };
}

module.exports = {
  CONFIG,
  getAppUrl,
  getLandingPageUrl,
  getAppsConfig,
  shouldSkipLink,
};
