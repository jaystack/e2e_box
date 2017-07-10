# E2E testing with cucumber, selenium-webdriver and docker-compose

## Quick info if you don't want to read much

Pull the e2e_box repository

### Running in local DEV mode
#### Run tests
```
e2e
❯ docker-compose run tests
```

#### Start system without running tests
```
e2e
❯ docker-compose up -d web
```

*Features*
- access website being tested on [localhost:5000](http://localhost:5000/)
- access website backend REST API on [localhost:5001](http://localhost:5001/)
- access Selenium vnc viewerport on [localhost:5900](http://localhost:5900/)
- live edits and live-reload for website: open `e2e_box/web/src`
- live edits and live-reload for api: open `e2e_box/api/src`
- live edits and fast test run for test code using Cucumber.js
- zero complication with selenium setup

### Running in CI mode
```
docker-compose -f docker-compose.yml run tests && \
 docker-compose -f docker-compose.yml down
```

# E2E testing with cucumber, selenium and docker-compose

Browser based E2E tests are awesome. You just create a couple of lines of test code and you can cover several thousand lines of application logic and tons of css rule.

Browser based E2E tests are also a pain. They are usually felt fragile, complicated to develop and maintain, sometimes non-deterministic with a lot of false positive runs, and prone to break from a simple change in the markup.

Is all lost then? I hope not, so I collected what was learned from some recent experience - and share some tips on building an E2E environment that is less prone to the above issues and is more likely to hold on the longer run - and also fun to use.

## The tools used in this demo

#### Selenium WebDriver with Chrome
Selenium (webdriver) is like the [Khumbu Icefall](https://en.wikipedia.org/wiki/Khumbu_Icefall) when it comes to summitting the Everest from the South Col - there's no way around it. However with some simple tricks we can achieve decent reliability...

#### ~~Selenium WebDriver with Chrome Headless~~
Sorry guys, it's just not there yet - but very very close. Read  more at the end.

#### docker and docker-compose
Docker and docker-compose provides our sandbox that can spin up in any environments that has docker installed - letting us run the very same E2E test system in local development time or during the CI/CD pipeline.

#### selenium-webdriver library
Using the lowest level driver (okay, almost) provides a better understanding of the overall test system - and is `one less api and documentation` to know about.

#### gherkin style tests with Cucumber.js
It could be really anything, like mocha. Done in BDD tyle or not - the gherkin syntax, and keeping test specificaions separate from implementation code has some nice benefits. Non developers being able to participate in their creation, and data driven tests are just two it.

## The big picture

Instead of relying on shared, permanent services, like a shared Selenium server in test env, or a development webserver, we will have all our system components captured as docker images, and started as dedicated containers - that exist just for the lifetime of a single test run. Each time we execute the tests, our required services will start afresh in perfect new condition - giving the highest chance for a predictable execution result. Also, instead of running the E2E test code using the webserver process, which is a common practice, we will run it in its dedicated worker process and container.

<img width="50%" align="right" src="https://raw.githubusercontent.com/jaystack/e2e_box/master/content/compose2.png" />|

That's a lot of containers to deal with, you might say, more so, if you'll add some more tiers like REST api service and a mongodb - for a more realistic application. The good news is: you'll don't need to deal with those containers. Docker-compose to our help: all of the above will be encapsulated in a <b>docker-compose project</b> - so we can use simple docker-compose commands to start/run/stop the whole test system, or just parts. The <b>default docker network</b> provided by docker-compose also serves as a sandbox, that wraps the set of containers created for each test runs. This lets the different service components to always know about each other without extra configuration effort. For example the test application can always access Selenium as `http://selenium` while the Selenium service can always access the website as `http://web`  no matter where we are running the tests.


## The implementation

A fully built version of the test system can be found at https://github.com/jaystack/e2e_box.

### The test application
Source: https://github.com/jaystack/e2e_box/tree/master/tests

This document isn't aiming to be a detailed material on the `gherkin syntax`, or the `cucumber.js` library, or the means to unleash your BDD super idenity. It just tries to show some interesting basics so that you'll wanna dig deeper on your own.

Cucumber.js has a unique way for providing the otherwise usual functionality of a test framework: its functional mainly with a pinch of classes and instances. Sounds doggy but its actually a very nice balance.

Tests are specified through a list of features definitions, which are stand alone text files with one or more scenarios in them that are plain English sentences with some basic semantic rules in them. They must have a `.feature` file extension.
**tests/features/welcome.feture**
```gherkin
Feature: Website main page

Scenario: Visitors are welcomed
 Given a website to accept visitors
 When  I open the main page
 Then I see a welcome message saying "Welcome to React"
```

`Given`, `When`, `Then` are the guys you probably know as Arrange, Act, Assert from your previous experiences. You can have multiple of them and you can change them anyplace to `And` for better readability.

Test implementation is given as a set of match handlers - against the specification text.
**tests/features/step_definitions/steps.js**
```javascript
const { defineSupportCode } = require('cucumber');

defineSupportCode(function ({ Given, When, Then }) {
    Given(/a website to accept visitors/, async function() {
        // the `this` holds the actual World instance - read below
        this.driver = await this.createSeleniumDriver();
    })

    When(/I open the main page/, async function() {
        await this.driver.get(this.webUrl);
    })

    Then(/I see a welcome message saying "(.*)"/, async function(expected) {
        const driver = this.driver;
        const welcomeBox = await locateByCss(driver, '[data-welcome]');
        const content = await welcomeBox.getText();
        assert.equal(content, expected);
    });
```
Notice the extensive use of `this`. Cucumber tests are stateful: Scenarios when executed get a dedicated World instance that operates as their state. Scenario steps are free to alter the state and since the order of the steps


The gherkin/cucumber.js based tests are composed of two types files: test specifications file with a distinctive `.feature` file extension, and test implementation code written in one of the supported languages - in our case these are `.js` files.

```gherkin
Feature: Website main page

Scenario: Visiting the website
 Given a visitor navigates to the site
 Then they will see a greeting message saying "Welcome to React"
```

CUCUMBER INTRO COMES HERE

### The docker-compose setup

DOCKER-COMPOSE FILE AND USAGE DETAILED


### The test subject #1: a create-react-app application
Source: https://github.com/jaystack/e2e_box/tree/master/web

It is  irrelevant what technlogy is was to create the solution, as long as one can build a docker container to host and run it. It is a particularly simple process for a nodejs/React app (but not too complicated for Java or .NET either) - all it takes is a Dockerfile, that we place in the website root for simplicity sake. A very simple version of it, that expects a `build` and a `service` package script to do the appliction specific steps would look like this:

**web/Dockerfile**
```Dockerfile
FROM node:6
WORKDIR /app
ADD package-lock.json .
ADD package.json .
RUN npm i
ADD . .
RUN npm run build

ENTRYPOINT ["npm"]
CMD ["run","service"]

```
Note that the package*.json files are added to the image first and source files only after `RUN npm i`. This way installing packages will fulfilled from local docker cache the next time we rebuild this image - assuming the package files haven't changed.

Also note that we build the web application inside the container with `npm run build`. This way the whole build process is also encapsulated.


Later on the docker-compose utility will use this file to build an image for us.
####


#### Read stuff

http://docs.behat.org/en/v2.5/guides/1.gherkin.html#backgrounds
http://docs.behat.org/en/v2.5/guides/1.gherkin.html
















