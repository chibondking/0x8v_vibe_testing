const { chromium } = require('playwright');
const { createLandingPage, createAppPage } = require('../pages');
const { getAppsConfig, getLandingPageUrl } = require('../config');

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let allPassed = true;
  
  console.log('========================================');
  console.log('BROKEN LINK TESTS');
  console.log('========================================\n');
  
  console.log(`Landing Page: ${getLandingPageUrl()}`);
  const landingPage = createLandingPage(page);
  await landingPage.goto('/');
  
  const appLinks = await landingPage.getAppLinks();
  console.log(`  Found ${appLinks.length} app links`);
  
  const appLinkResults = await landingPage.verifyAllAppLinks();
  let landingPagePassed = true;
  
  for (const result of appLinkResults) {
    if (result.passed) {
      console.log(`  OK: ${result.appName} - ${result.status}`);
    } else {
      console.log(`  FAILED: ${result.appName} (${result.url}) - ${result.status}`);
      landingPagePassed = false;
      allPassed = false;
    }
  }
  
  if (landingPagePassed) {
    console.log('  PASSED: All app links verified\n');
  }
  
  const appsConfig = getAppsConfig();
  
  for (const app of appsConfig) {
    console.log(`Testing ${app.name} (https://${app.name}.0x8v.io)...`);
    const appPage = createAppPage(page, app.name);
    
    await appPage.load();
    
    const appResult = await appPage.checkAllLinks();
    
    if (appResult.totalLinks === 0) {
      console.log(`  WARNING: No links found`);
      continue;
    }
    
    if (appResult.skippedLinks.length > 0) {
      console.log(`  Skipped ${appResult.skippedLinks.length} links:`);
      appResult.skippedLinks.forEach(link => {
        console.log(`    - "${link.text}": ${link.url} (${link.reason})`);
      });
    }
    
    if (appResult.brokenLinks.length > 0) {
      console.log(`  FAILED: Found ${appResult.brokenLinks.length} broken links:`);
      appResult.brokenLinks.forEach(link => {
        const errorInfo = link.error ? ` - ${link.error}` : ` (status: ${link.status})`;
        console.log(`    - "${link.text}": ${link.url}${errorInfo}`);
      });
      allPassed = false;
    } else {
      console.log(`  PASSED: All ${appResult.totalLinks - appResult.skippedLinks.length} links working`);
    }
    
    const errors = appPage.getPageErrors();
    if (errors.length > 0) {
      console.log(`  Console errors:`);
      errors.forEach(err => console.log(`    - ${err}`));
    }
    
    console.log('');
  }
  
  console.log('========================================');
  if (allPassed) {
    console.log('ALL TESTS PASSED');
  } else {
    console.log('SOME TESTS FAILED');
  }
  console.log('========================================\n');
  
  await browser.close();
  
  process.exit(allPassed ? 0 : 1);
}

runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
