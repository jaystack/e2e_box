
## Fast info for typing hungry
See detailed content below.

### Running in DEV mode
```
docker-compose run --rm tests
```

*Features*
- access website under test on [localhost:5000](http://localhost:5000/)
- live edits and reload for website code written in React
- live edits and fast test run for test code using Cucumber.js
- zero fuss with selenium setup


### Running in CI mode

# E2E testing fun with cucumber, selenium and docker-compose

Browser based E2E tests are awesome. You just create a couple of lines of test code and you can cover several thousand lines of application logic and tons of css rule. Plus it's the closest thing in order to validate how our system behaves when interacting with real users.

Also browser based E2E tests suck - as having one in the development and CI/CD pipeline very often causes more problems than that it solves. Typical issues are:
- its fragile, and seems non-deterministic - tests do fail sometimes without apparent issue, and do pass on the next attempt
- selenium can be bottleneck if multiple users or jobs use it the same time
- it has a complicated runtime environment so running it locally the same way you'd run during CI/CD process isn't simple.



