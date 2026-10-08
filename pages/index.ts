import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LandingPage } from './LandingPage';
import { AppPage } from './AppPage';
import { WaradioPage } from './WaradioPage';
import { GridPage } from './GridPage';
import { LivePage } from './LivePage';
import { getAppUrl } from '../config';

export { BasePage, LandingPage, AppPage, WaradioPage, GridPage, LivePage };

export function createLandingPage(page: Page): LandingPage {
  return new LandingPage(page);
}

export function createAppPage(page: Page, appName: string): AppPage {
  const appUrl = getAppUrl(appName);
  return new AppPage(page, appName, appUrl);
}

export function createWaradioPage(page: Page): WaradioPage {
  return new WaradioPage(page);
}

export function createGridPage(page: Page): GridPage {
  return new GridPage(page);
}

export function createLivePage(page: Page): LivePage {
  return new LivePage(page);
}

export function createPage(page: Page, url: string): BasePage {
  if (url.includes('vibe.0x8v.io')) {
    return new LandingPage(page);
  }

  if (url.includes('waradio.0x8v.io')) {
    return new WaradioPage(page);
  }

  if (url.includes('grid.0x8v.io')) {
    return new GridPage(page);
  }

  if (url.includes('live.0x8v.io')) {
    return new LivePage(page);
  }

  const appMatch = url.match(/https?:\/\/(\w+)\.0x8v\.io/);
  if (appMatch) {
    return new AppPage(page, appMatch[1], url);
  }

  return new BasePage(page, url);
}
