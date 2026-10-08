import http from 'node:http';
import https from 'node:https';
import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { shouldSkipLink } from '../config';

export interface LinkCheckResult {
  appName: string;
  appUrl: string;
  totalLinks: number;
  skippedLinks: Array<{ url: string; text: string; reason?: string | null }>;
  brokenLinks: Array<{ url: string; text: string; status: number }>;
  passed: boolean;
}

export class AppPage extends BasePage {
  readonly appName: string;
  readonly appUrl: string;

  constructor(page: Page, appName: string, appUrl: string) {
    super(page, appUrl);
    this.appName = appName;
    this.appUrl = appUrl;
  }

  async load(): Promise<this> {
    await this.goto('/');
    return this;
  }

  getLinkCheckResults(): LinkCheckResult {
    return {
      appName: this.appName,
      appUrl: this.appUrl,
      totalLinks: 0,
      skippedLinks: [],
      brokenLinks: [],
      passed: true,
    };
  }

  async checkAllLinks(): Promise<LinkCheckResult> {
    const result = this.getLinkCheckResults();
    const applicableLinks = await this.getApplicableLinks();
    result.totalLinks = applicableLinks.length;

    const skipped = await this.getSkippedLinks();
    result.skippedLinks = skipped.map(link => ({
      url: link.url,
      text: link.text,
      reason: shouldSkipLink(link.url).reason,
    }));

    const testableLinks = await this.getTestableLinks();

    for (const link of testableLinks) {
      const status = await new Promise<number>((resolve) => {
        const protocol = link.url.startsWith('https') ? https : http;
        const req = protocol.get(link.url, (res) => {
          resolve(res.statusCode ?? 0);
        });
        req.on('error', () => resolve(0));
        req.setTimeout(10000, () => {
          req.destroy();
          resolve(0);
        });
      });

      const linkStatus = status || 0;
      if (linkStatus >= 400 || linkStatus === 0) {
        result.brokenLinks.push({
          url: link.url,
          text: link.text,
          status: linkStatus,
        });
        result.passed = false;
      }
    }

    return result;
  }
}

export default AppPage;
