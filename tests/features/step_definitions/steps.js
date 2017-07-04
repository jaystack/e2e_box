const {defineSupportCode} = require('cucumber');
const { until, By } = require('selenium-webdriver');
const assert = require('assert');

defineSupportCode(function ({ Given, When, Then }) {

  Given(
    'a visitor navigates to the site',
    async function () {
      const driver = this.driver;
      await driver.get('http://web:5000/')
    }
  );
  Then('they will see a greeting message saying "{message}"', async function(expected) {
      const driver = this.driver;
      const wellElement = driver.findElement(By.className('App-header'));
      await driver.wait(until.elementIsVisible(wellElement), 2000);
      const content = await wellElement.getText();
      assert.equal(content, expected);
  });
});