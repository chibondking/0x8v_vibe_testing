export interface AppConfig {
  name: string;
  path: string;
  description: string;
}

export interface SkipResult {
  skipped: boolean;
  reason: 'anchor' | 'external' | null;
}

const getBaseUrl = (): string => process.env.BASE_URL || 'https://vibe.0x8v.io';
const getDomain = (): string => process.env.DOMAIN || '0x8v.io';

export const CONFIG = {
  baseUrl: getBaseUrl(),
  domain: getDomain(),
  apps: [
    { name: 'live', path: '/', description: 'FT8 Live Map' },
    { name: 'grid', path: '/', description: 'Grid Square Visualizer' },
    { name: 'waradio', path: '/', description: 'ADIF Log Visualizer' },
  ] as AppConfig[],
  skipPatterns: {
    anchors: ['#'],
    externalDomains: ['leafletjs.com', 'openstreetmap.org', 'carto.com'],
  },
};

export function getAppUrl(appName: string): string {
  return `https://${appName}.${CONFIG.domain}`;
}

export function getLandingPageUrl(): string {
  return CONFIG.baseUrl;
}

export function getAppsConfig(): AppConfig[] {
  return CONFIG.apps;
}

export function shouldSkipLink(url: string): SkipResult {
  if (CONFIG.skipPatterns.anchors.some(anchor => url.endsWith(anchor))) {
    return { skipped: true, reason: 'anchor' };
  }
  if (CONFIG.skipPatterns.externalDomains.some(domain => url.includes(domain))) {
    return { skipped: true, reason: 'external' };
  }
  return { skipped: false, reason: null };
}
