import https from 'node:https';
import type { Page } from '@playwright/test';
import { BasePage, type Link } from './BasePage';
import { getAppUrl, getAppsConfig, CONFIG } from '../config';

export interface AppLinkStatus {
  appName: string;
  url: string;
  status: number;
  passed: boolean;
}

export class LandingPage extends BasePage {
  constructor(page: Page) {
    super(page, CONFIG.baseUrl);
  }

  async getAppLinks(): Promise<Link[]> {
    const links = await this.getAllLinks();
    const appsConfig = getAppsConfig();
    const appUrls = appsConfig.map(app => getAppUrl(app.name));

    return links.filter(link =>
      appUrls.some(url => link.url.startsWith(url)) && !link.url.includes('#')
    );
  }

  async getAppLink(appName: string): Promise<Link | undefined> {
    const targetUrl = getAppUrl(appName);
    const links = await this.getAllLinks();
    return links.find(link => link.url.startsWith(targetUrl));
  }

  async verifyAllAppLinks(): Promise<AppLinkStatus[]> {
    const results: AppLinkStatus[] = [];
    const appsConfig = getAppsConfig();

    for (const app of appsConfig) {
      const appUrl = getAppUrl(app.name);
      const status = await new Promise<number>((resolve) => {
        const req = https.get(appUrl, (res) => {
          resolve(res.statusCode ?? 0);
        });
        req.on('error', () => resolve(0));
        req.setTimeout(10000, () => {
          req.destroy();
          resolve(0);
        });
      });

      results.push({
        appName: app.name,
        url: appUrl,
        status: status || 0,
        passed: (status || 0) < 400 && status !== 0,
      });
    }

    return results;
  }

  async getAriaSnapshot(): Promise<string> {
    return this.page.locator('body').ariaSnapshot();
  }

  async verifyAriaSnapshot(expectedSnapshot: string): Promise<boolean> {
    const actualSnapshot = await this.getAriaSnapshot();
    return JSON.stringify(actualSnapshot, null, 2) === JSON.stringify(expectedSnapshot, null, 2);
  }

  async takeAndLogAriaSnapshot(): Promise<string> {
    const snapshot = await this.getAriaSnapshot();
    console.log('  Aria Snapshot:');
    console.log(JSON.stringify(snapshot, null, 2));
    return snapshot;
  }
}

export default LandingPage;
