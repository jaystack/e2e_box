
## Fast info for typing hungry
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

# E2E testing fun with cucumber, selenium and docker-compose

Browser based E2E tests are awesome. You just create a couple of lines of test code and you can cover several thousand lines of application logic and tons of css rule. And they are the closest thing to a real simulation of behavior meeting user interaction.

Browser based E2E tests also suck. Reality shows that having one in the development and test pipeline very often causes more problems than that it solves. They are usually felt fragile, almost non-deterministic with a lot of false positive runs, complicated to operate and develop, and prone to break from a simple change in the markup.

In the below I just collected what was learned from a couple of recent experiments - and share some tips on building an E2E environment that not just holds - but also fun to use.

### The tools
Just the usual suspects
- `Selenium WebDriver` with Chrome and/or Chrome Headless
- NodeJS to run tests written gherkin style run with `cucumber.js` and `selenium-webdriver` modules
- `docker-compose`













