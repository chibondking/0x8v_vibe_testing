const BasePage = require('./BasePage');
const { getAppUrl, getAppsConfig, CONFIG } = require('../config');

class LandingPage extends BasePage {
  constructor(page) {
    super(page, CONFIG.baseUrl);
  }
  
  async getAppLinks() {
    const links = await this.getAllLinks();
    const appsConfig = getAppsConfig();
    const appUrls = appsConfig.map(app => getAppUrl(app.name));
    
    return links.filter(link => 
      appUrls.some(url => link.url.startsWith(url)) && !link.url.includes('#')
    );
  }
  
  async getAppLink(appName) {
    const targetUrl = getAppUrl(appName);
    const links = await this.getAllLinks();
    return links.find(link => link.url.startsWith(targetUrl));
  }
  
  async verifyAllAppLinks() {
    const results = [];
    const appsConfig = getAppsConfig();
    
    const https = require('https');
    
    for (const app of appsConfig) {
      const appUrl = getAppUrl(app.name);
      const status = await new Promise((resolve) => {
        const req = https.get(appUrl, (res) => {
          resolve(res.statusCode);
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
        status,
        passed: status < 400 && status !== 0,
      });
    }
    
    return results;
  }
  
  async getAriaSnapshot() {
    return this.page.locator('body').ariaSnapshot();
  }
  
  async verifyAriaSnapshot(expectedSnapshot) {
    const actualSnapshot = await this.getAriaSnapshot();
    return JSON.stringify(actualSnapshot, null, 2) === JSON.stringify(expectedSnapshot, null, 2);
  }
  
  async takeAndLogAriaSnapshot() {
    const snapshot = await this.getAriaSnapshot();
    console.log('  Aria Snapshot:');
    console.log(JSON.stringify(snapshot, null, 2));
    return snapshot;
  }
}

module.exports = LandingPage;
