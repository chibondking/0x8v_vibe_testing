import type { Locator, Page, Response } from '@playwright/test';
import { shouldSkipLink } from '../config';

export interface Link {
  url: string;
  text: string;
  href: string | null;
}

export class BasePage {
  readonly page: Page;
  readonly baseUrl: string;
  protected errors: string[] = [];

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!this.isIgnorableError(text)) {
          this.errors.push(text);
        }
      }
    });

    this.page.on('pageerror', error => {
      this.errors.push(error.message);
    });
  }

  isIgnorableError(text: string): boolean {
    const ignorablePatterns = [
      'net::ERR_',
      'favicon',
      'Failed to load resource',
    ];
    return ignorablePatterns.some(pattern => text.includes(pattern));
  }

  async goto(path = '/', options: Parameters<Page['goto']>[1] = {}): Promise<Response | null> {
    const url = `${this.baseUrl}${path}`;
    return this.page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 45000,
      ...options,
    });
  }

  /** Text content of a locator, with a missing node read as ''. */
  async textOf(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? '';
  }

  getPageErrors(): string[] {
    return this.errors;
  }

  clearErrors(): void {
    this.errors = [];
  }

  async getAllLinks(): Promise<Link[]> {
    return this.page.evaluate(() => {
      const anchorTags = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
      return anchorTags.map(a => ({
        url: a.href,
        text: a.textContent ? a.textContent.trim() : '',
        href: a.getAttribute('href'),
      }));
    });
  }

  async getApplicableLinks(): Promise<Link[]> {
    const links = await this.getAllLinks();
    return links.filter(link => {
      if (link.url.startsWith('mailto:')) return false;
      if (link.url.startsWith('tel:')) return false;
      return true;
    });
  }

  async getSkippedLinks(): Promise<Link[]> {
    const links = await this.getApplicableLinks();
    return links.filter(link => shouldSkipLink(link.url).skipped);
  }

  async getTestableLinks(): Promise<Link[]> {
    const links = await this.getApplicableLinks();
    return links.filter(link => !shouldSkipLink(link.url).skipped);
  }
}

export default BasePage;
