# E2E testing with cucumber, selenium-webdriver and docker-compose

## Fast info for the typing hungry
See detailed content below.

### Running in DEV mode
```
docker-compose run --rm tests
```

*Features*
- access website under test on [localhost:5000](http://localhost:5000/)
- access Selenium vnc viewerport on [localhost:5900](http://localhost:5900/)
- live edits and live-reload for website code written in React
- live edits and fast test run for test code using Cucumber.js
- zero fuss with selenium setup

### Running in CI mode
```
docker-compose -f docker-compose.yml run tests && \
 docker-compose -f docker-compose.yml down
```

# E2E testing with cucumber, selenium and docker-compose

Browser based E2E tests are awesome. You just create a couple of lines of test code and you can cover several thousand lines of application logic and tons of css rule

Browser based E2E tests also suck. They are usually felt fragile, complicated to operate and develop, non-deterministic with a lot of false positive runs, and prone to break from a simple change in the markup.

In the below I just collected what was learned from a couple of recent experiments - and share some tips on building an E2E environment that is less prone to the above issues and is more likely to hold on the longer run - and also fun to use.

## The tools used in this demo

#### Selenium WebDriver with Chrome
Selenium (webdriver) is like the [Khumbu Icefall](https://en.wikipedia.org/wiki/Khumbu_Icefall) when it comes to summitting the Everest from the South Col - there's no way around it. However with some simple tricks we can achieve decent reliability...

#### ~~Selenium WebDriver with Chrome Headless~~
Sorry guys, it's just not there yet - but very very close. Read  more at the end.

#### docker-compose
Docker-compose provides our sandbox  that can run in any environments that supports docker - letting us to run the very same E2E test system in local development time or during the CI/CD pipeline.


#### selenium-webdriver library
Using the lowest level driver (okay, almost) provides a better understanding of the overall test system - and is `one less api and documentation` to know about.

#### gherkin style tests with Cucumber.js
It could be really anything, like mocha. For me however, working against plain English sentences, created potentially by someone non developer, helps creating test code that is more agnostic to the implementation.

## The big picture

Instead of relying on shared, permanent services, like a corp wide Selenium server, or a development webserver, we will have all our system components captured as docker images, started as dedicated containers - that exists just for the lifetime of a single test run. Each time we do a test run our required services will start afresh in perfect new condition - giving the highest chance for a predictable execution result. Also, instead of running the E2E test code using the webserver process, which is a common practice, we will run it in its dedicated worker process and container.

This all will be encapsulated in a docker-compose project, which serves as a sandbox, that wraps each test environments. This also lets the components to always know about each other without extra configuration effort. For example the test application can always access Selenium as `http://selenium` while the Selenium service can always access the website as `http://web`.

![img](https://raw.githubusercontent.com/jaystack/e2e_box/master/content/images.001.png)



















