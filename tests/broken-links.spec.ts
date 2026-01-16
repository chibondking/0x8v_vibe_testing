import { test, expect } from '@playwright/test';

interface LinkInfo {
  url: string;
  text: string;
}

async function getAllLinks(page: any, baseUrl: string): Promise<LinkInfo[]> {
  const links: LinkInfo[] = await page.evaluate((baseUrl: string) => {
    const anchorTags = Array.from(document.querySelectorAll('a[href]'));
    return anchorTags.map((a: any) => ({
      url: a.href,
      text: a.textContent?.trim() || ''
    })).filter(link => link.url.startsWith('http'));
  }, baseUrl);
  
  return links;
}

async function checkLinks(page: any, links: LinkInfo[]): Promise<{ url: string; text: string; status: number }[]> {
  const results: { url: string; text: string; status: number }[] = [];
  
  for (const link of links) {
    try {
      const response = await page.request.head(link.url, { timeout: 10000 });
      results.push({ url: link.url, text: link.text, status: response.status() });
    } catch (error) {
      results.push({ url: link.url, text: link.text, status: 0 });
    }
  }
  
  return results;
}

test.describe('Broken Link Tests', () => {
  const apps = [
    { name: 'WARADIO', url: 'https://waradio.0x8v.io' },
    { name: 'GRID', url: 'https://grid.0x8v.io' },
    { name: 'LIVE', url: 'https://live.0x8v.io' },
  ];

  for (const app of apps) {
    test.describe(`${app.name} (${app.url})`, () => {
      test('should have no broken links', async ({ page }) => {
        const errors: string[] = [];
        
        page.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(`Console error: ${msg.text()}`);
          }
        });

        page.on('pageerror', error => {
          errors.push(`Page error: ${error.message}`);
        });

        await page.goto(app.url, { waitUntil: 'networkidle', timeout: 30000 });
        
        const links = await getAllLinks(page, app.url);
        expect(links.length).toBeGreaterThan(0);
        
        const linkResults = await checkLinks(page, links);
        
        const brokenLinks = linkResults.filter(r => r.status >= 400 || r.status === 0);
        
        if (brokenLinks.length > 0) {
          console.log(`Broken links found on ${app.name}:`);
          brokenLinks.forEach(link => {
            console.log(`  - ${link.text}: ${link.url} (status: ${link.status})`);
          });
        }
        
        expect(brokenLinks, `Found ${brokenLinks.length} broken links on ${app.name}`).toHaveLength(0);
        
        if (errors.length > 0) {
          console.log(`Console errors on ${app.name}:`);
          errors.forEach(err => console.log(`  - ${err}`));
        }
      });
    });
  }

  test('main landing page should have valid links to all apps', async ({ page }) => {
    await page.goto('https://vibe.0x8v.io', { waitUntil: 'networkidle', timeout: 30000 });
    
    const mainLinks = [
      { url: 'https://waradio.0x8v.io', name: 'WARADIO' },
      { url: 'https://grid.0x8v.io', name: 'GRID' },
      { url: 'https://live.0x8v.io', name: 'LIVE' },
    ];
    
    for (const link of mainLinks) {
      const response = await page.request.head(link.url, { timeout: 15000 });
      expect(response.status()).toBeLessThan(400);
    }
  });
});
