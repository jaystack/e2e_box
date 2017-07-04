const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({ After, Before }) {
  After(async function() {
      await this.driver.quit();
  });
});

