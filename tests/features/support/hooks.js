const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({ After, Before }) {
  Before(async function() {
    this.driver = await this.builder.build();
  })

  After(async function() {
    await this.driver.quit();
  });

});

