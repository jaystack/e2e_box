const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({ After, Before }) {
  Before(async function() {
    // this executes before each scenario
  })

  After(async function() {
    // this executes after each scenario
    await this.cleanUp();
  });

});

