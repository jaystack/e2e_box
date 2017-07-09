const {defineSupportCode} = require('cucumber');
const { until, By } = require('selenium-webdriver');
const assert = require('assert');

const sleep = timeout => new Promise(r => setTimeout(r, timeout))
const locateByCss = async (driver, css, timeout = 3000) => {
    let retries = 0
    let to = 10
    while(retries < 50 && to < timeout) {
        const items = await driver.findElements(By.css(css))
        if (items.length) {
            return items[0]
        }
        await sleep(to);
        to *= 2;
    }
    throw new Error('Item not found');
}
const waitForByCss = locateByCss;

defineSupportCode(function ({ Given, When, Then }) {
    /* welcome features */
    Given(/a website to accept visitors/, async function() {
        this.driver = await this.createSeleniumDriver();
    })

    When(/I open the main page/, async function() {
        await this.driver.get(this.webUrl);
    })

    Then(/I see a welcome message saying "(.*)"/, async function(expected) {
        const driver = this.driver;
        const welcomeBox= await locateByCss(driver, '[data-welcome]');
        const content = await welcomeBox.getText();
        assert.equal(content, expected);
    });

    /* cart */
    When(/I navigate to the product page/, async function() {
        const { driver } = this;
        await driver.get(this.webUrl);
        const productsElement = await waitForByCss(driver, '[data-content]');
        const productList = await productsElement.findElements(By.css('.product-item'));
        this.productList = productList;
    })

    Then(/I see "(.*)" items in the product list/, async function(expectedCount) {
        assert.equal(this.productList.length, parseInt(expectedCount));
    })

    When(/I put the "(.*)" product in my cart/, async function(productName) {
        for(product of this.productList) {
            const text = await product.getText();
            const [name] = text.split('£');
            if (name === productName) {
                const button = await product.findElement(By.tagName('button'));
                await button.click();
            }
        }
    })

    Then(/I see "(.*)" items in my cart/, async function(expectedCount) {
        const items = await this.driver.findElements(By.css('.App-cart .product-item'));
        assert.equal(items.length, parseInt(expectedCount, 10));
    })

    Then(/the total cart value is "(.*)"/, async function(cartValue) {
        const item = await locateByCss(this.driver, '[data-total]');
        assert.equal(await item.getText(), cartValue);
    })

    /* api related */
    Given(/the product database contains the following items/, async function(table) {
        const products = table.hashes();
        const { post } = this.getApiClient()
        await post(`/products`, products);
    });

    When(/I issue a GET request to "(.*)"/, async function(apiPath) {
        const api = this.getApiClient();
        const data = await api.get(apiPath);
        this.ax = JSON.stringify(data, null, 2);
    });

    Then(/I receive the following JSON response/, async function(expectedJson) {
        assert.deepEqual(this.ax, expectedJson)
    })
});