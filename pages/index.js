const LandingPage = require('./LandingPage');
const AppPage = require('./AppPage');
const { getAppUrl, getLandingPageUrl } = require('../config');

function createLandingPage(page) {
  return new LandingPage(page);
}

function createAppPage(page, appName) {
  const appUrl = getAppUrl(appName);
  return new AppPage(page, appName, appUrl);
}

function createPage(page, url) {
  if (url.includes('vibe.0x8v.io')) {
    return new LandingPage(page);
  }
  
  const appMatch = url.match(/https?:\/\/(\w+)\.0x8v\.io/);
  if (appMatch) {
    return new AppPage(page, appMatch[1], url);
  }
  
  return new BasePage(page, url);
}

module.exports = {
  createLandingPage,
  createAppPage,
  createPage,
};
