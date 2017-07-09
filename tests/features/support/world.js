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

const createPostMethod = apiUrl => async (path, body) =>
  fetch(`${apiUrl}${path}`, getBody(body)).then(response => response.json());

const createGetMethod = apiUrl => async (path) =>
  fetch(`${apiUrl}${path}`).then(response => response.json())

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

  get apiClient() {
    const { apiUrl } = this;
    return {
      post: createPostMethod(apiUrl),
      get: createGetMethod(apiUrl)
    }
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

  async cleanUp() {
    for(const task of this.cleanUpTasks) {
      await task();
    }
  }
}

defineSupportCode(({setWorldConstructor}) => {
  setWorldConstructor(World);
})