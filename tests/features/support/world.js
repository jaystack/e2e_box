const {defineSupportCode} = require('cucumber');
const seleniumWebdriver = require('selenium-webdriver');
const { promise } = seleniumWebdriver;
const fetch = require('node-fetch');

promise.USE_PROMISE_MANAGER = false;
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const getBody = body => ({
  headers,
  method: 'POST',
  body: JSON.stringify(body)
});

class World {
  constructor({ parameters }) {
    const {
      seleniumUrl = 'http://selenium:4444/wd/hub',
      apiUrl = 'http://api:5001',
      webUrl = 'http://web:5000'
    } = parameters;
    this.cleanUpTasks = [];
    Object.assign(this, { seleniumUrl, apiUrl, webUrl });
  }

  async createSeleniumDriver() {
    const driver = await new seleniumWebdriver.Builder()
      .forBrowser('chrome')
      .usingServer(this.seleniumUrl)
      .build();
    this.driver = driver;
    this.cleanUpTasks.push(async () => await driver.quit());
    return driver;
  }

  getApiClient() {
    const post = async (path, body) =>
      fetch(`${this.apiUrl}${path}`, getBody(body)).then(response => response.json());

    const get = async (path) =>
      fetch(`${this.apiUrl}${path}`).then(response => response.json())

    return { post, get }
  }

  async cleanUp() {
    for(const task of this.cleanUpTasks) {
      await task();
    }
  }
}

defineSupportCode(({setWorldConstructor}) => {
  setWorldConstructor(World);
})