const {defineSupportCode} = require('cucumber');
const { until, By } = require('selenium-webdriver');
const assert = require('assert');

const locateByCss = async (driver, css, timeout = 2000) =>
  await driver.wait(until.elementLocated(By.css(css)), timeout);

defineSupportCode(function ({ Given, When, Then }) {

  Given(
    /navigates to the site/,
    async function () {
      const driver = this.driver;
      await driver.get('http://web:5000/')
    }
  );
  Then('they will see a greeting message saying "{message}"', async function(expected) {
      const driver = this.driver;
      const welcomeBox= await locateByCss(driver, '[data-welcome]');
      const content = await welcomeBox.getText();
      assert.equal(content, expected);
  });

  Then(/input for the "(x|y)" value/, async function(varName) {
      const driver = this.driver;
      const input = await locateByCss(driver, `[data-${varName}]`);
      const tagName = await input.getTagName();
      assert.equal(tagName, 'input');
  });

  Then(/a button saying "(.*)"/, async function(expectedCaption) {
      const driver = this.driver;
      const button = await locateByCss(driver, '[data-submit]');
      const caption = await button.getText();
      assert.equal(caption, expectedCaption)
  });

  When(/"(\d*)" into the "(x|y)" value/, async function(value, varName) {
      const driver = this.driver;
      const input = await locateByCss(driver, `[data-${varName}]`);
      await input.sendKeys(value);
  });

  When(/presses the button/, async function() {
      const driver = this.driver;
      const button = await locateByCss(driver, '[data-submit]');
      const clickResult = await button.click();
  });

  Then(/the result "(.*)" is displayed/, async function(expectedResult) {
      const driver = this.driver;
      const result = await locateByCss(driver, '[data-results]');
      const resultText = await result.getText();
      assert(resultText, expectedResult);
  });

  When(/the user sets X to (\d*) and Y to (\d*)/, async function(x, y) {
      const driver = this.driver;
      const xInput = await locateByCss(driver, '[data-x]');
      const yInput = await locateByCss(driver, '[data-y]');
      await xInput.sendKeys(x);
      await yInput.sendKeys(y);
  });

  Then(/(.*) is displayed as result/, async function(expectedResult) {
      const driver = this.driver;
      const result = await locateByCss(driver, '[data-results]');
      const resultText = await result.getText();
      assert(resultText, expectedResult);
  });


});