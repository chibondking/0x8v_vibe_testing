const LandingPage = require('./LandingPage');
const AppPage = require('./AppPage');
const WaradioPage = require('./WaradioPage');
const GridPage = require('./GridPage');
const { getAppUrl, getLandingPageUrl } = require('../config');

function createLandingPage(page) {
  return new LandingPage(page);
}

function createAppPage(page, appName) {
  const appUrl = getAppUrl(appName);
  return new AppPage(page, appName, appUrl);
}

function createWaradioPage(page) {
  return new WaradioPage(page);
}

function createGridPage(page) {
  return new GridPage(page);
}

function createLivePage(page) {
  return new (require('./LivePage'))(page);
}

function createPage(page, url) {
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
    return createLivePage(page);
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
  createWaradioPage,
  createGridPage,
  createLivePage,
  createPage,
};
