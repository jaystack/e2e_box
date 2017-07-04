const {defineSupportCode} = require('cucumber');
const seleniumWebdriver = require('selenium-webdriver');
const { logging, promise } = seleniumWebdriver;


logging.installConsoleHandler();
logging.getLogger('promise.ControlFlow').setLevel(logging.Level.ALL);
promise.USE_PROMISE_MANAGER = false;

function CustomWorld() {
  this.driver = new seleniumWebdriver.Builder()
    .forBrowser('chrome')
    .usingServer('http://selenium:4444/wd/hub')
    .build();
}

defineSupportCode(({setWorldConstructor}) => {
  setWorldConstructor(CustomWorld);
})