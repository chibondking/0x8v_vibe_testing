const { test, expect } = require('@playwright/test');
const { createWaradioPage } = require('../pages');
const { createTestSuite } = require('./test-utils');

const waradioContext = createTestSuite({
  pageName: 'WARADIO',
  createPageObject: createWaradioPage,
});

test.describe('WARADIO App - Grid Input', () => {
  test.beforeAll(waradioContext.beforeAll);
  test.afterAll(waradioContext.afterAll);
  test.beforeEach(waradioContext.beforeEach);

  test('grid input field is visible', async () => {
    const waradioPage = waradioContext.getPageObject();
    await expect(waradioPage.getMyGridInput()).toBeVisible();
  });

  test('grid input accepts text', async () => {
    const waradioPage = waradioContext.getPageObject();
    await waradioPage.getMyGridInput().fill('EM73');
    const value = await waradioPage.getMyGridInput().inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('grid input handles lowercase input', async () => {
    const waradioPage = waradioContext.getPageObject();
    await waradioPage.getMyGridInput().fill('en91');
    const value = await waradioPage.getMyGridInput().inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('grid input has max length', async () => {
    const waradioPage = waradioContext.getPageObject();
    const maxLength = await waradioPage.getMyGridInput().getAttribute('maxlength');
    expect(parseInt(maxLength || '0')).toBeGreaterThan(0);
  });

  test('changing grid input updates field', async () => {
    const waradioPage = waradioContext.getPageObject();
    await waradioPage.getMyGridInput().fill('EM73');
    const value1 = await waradioPage.getMyGridInput().inputValue();
    await waradioPage.getMyGridInput().fill('FN31');
    const value2 = await waradioPage.getMyGridInput().inputValue();
    expect(value1).not.toEqual(value2);
  });
});
